"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import {
  Allergen, Day, DELIVERY_OPTIONS, NEXT_MONDAY, Persona, Quiz, SlotName, THIS_MONDAY, TODAY_INDEX,
  buildRhythm, buildWeek, persona as getPersona, RhythmDay, DISHES, DAY_NAMES, goalInfo, dish as dishById, fitScore, Goal, scheduleFromQuiz,
} from "./data";

export type Sheet =
  | null
  | { kind: "why"; week: "this" | "next"; day: number; slot: SlotName }
  | { kind: "swap"; week: "this" | "next"; day: number; slot: SlotName }
  | { kind: "checkin" }
  | { kind: "vacation" }
  | { kind: "delivery" }
  | { kind: "perk" }
  | { kind: "nutrition" }
  | { kind: "wrapped" }
  | { kind: "onboarding" }
  | { kind: "preferences" }
  | { kind: "addMeals" }
  | { kind: "interval" }
  | { kind: "dish"; id: string }
  | { kind: "manage" }
  | { kind: "goals"; preset?: Goal }
  | { kind: "quiz"; goalOnly?: boolean }
  | { kind: "planDay"; week: number; day: number }
  | { kind: "addSlot"; week: "this" | "next"; day: number; slot: SlotName }
  | { kind: "lovePrompt"; id: string }
  | { kind: "chip"; key: string }
  | { kind: "goalDetails" }
  | { kind: "mealPlan" }
  | { kind: "intro" }
  | { kind: "firstBox" }
  | { kind: "deep" }
  | { kind: "checkinFlow" };

/** Prototype controls: who the customer is right now, and which moment in the week we're looking at. */
export type CustomerState = "active" | "new" | "paused45" | "paused120" | "cancelled" | "today";
export type Moment = "none" | "checkin" | "predelivery" | "firstbox" | "away7";
export type BoxState = "aligned" | "shortfall" | "surplus";

export type Toast = { id: number; text: string; undo?: () => void };

export type State = {
  personaId: Persona["id"];
  weeks: { this: Day[]; next: Day[] };
  made: Record<string, true>; // key `${dayIndex}:${slot}` for this week
  loved: string[];
  disliked: string[];
  notes: string[];
  exclude: Allergen[];
  avoid: string[];
  delivery: {
    date: string;
    label: string;
    window: string;
    status: "active" | "today" | "skipped" | "vacation" | "cancelled";
    vacationUntil?: string;
    cadence: "weekly" | "fortnightly" | "monthly";
    /** Cancelled state (Figma "My Plan RC Cancelled Subscription") */
    inactiveSince?: string;
    lastBox?: string;
  };
  /** Box quantities on top of the plan (freezer extras + add-ons). One place for plan and box. */
  extras: Record<string, number>;
  /** Adjustable goals (all variants): focus, meals from the plan per week, plants per week. */
  goal: Goal;
  weeklyTarget: number;
  plantTarget: number;
  /** Profile goal vs the goal this month's plan was built with (mid-month changes apply next month, F4). */
  planGoal: Goal;
  goalFrom: string | null;
  quiz: Quiz;
  planConfirmed: boolean;
  customer: CustomerState;
  moment: Moment;
  boxState: BoxState;
  /** Meals currently in the freezer (the box). Eaten meals come out; "didn't eat it" keeps them in. */
  freezer: number;
  /** Eaten is assumed on the scheduled day (vision decision); this records the exceptions. */
  notEaten: Record<string, true>;
  removedFromPlan: string[];
  skipNextOrder: string[];
  dismissed: string[];
  checkinScore: number | null;
  checkinWeek: number;
  introSeen: boolean;
  planView: "calendar" | "week";
  calMonth: 0 | 1;
  sms: boolean;
  discount: string | null;
  addonsDismissed: boolean;
  checkIn: "open" | "done" | "later";
  eveningDone: boolean;
  rhythm: RhythmDay[];
  sheet: Sheet;
  eveOpen: boolean;
  eveSeed: string | null;
  week: "this" | "next";
  selectedDay: number;
  view: "day" | "week";
  toasts: Toast[];
  events: string[]; // fake-door + research events, logged to console as well
};

export function initialState(id: Persona["id"]): State {
  const p = getPersona(id);
  return {
    personaId: id,
    weeks: { this: buildWeek(p, THIS_MONDAY), next: buildWeek(p, NEXT_MONDAY, 2) },
    made: {},
    loved: [p.favourite],
    disliked: [],
    notes: [],
    exclude: [...p.exclude],
    avoid: [],
    delivery: { ...DELIVERY_OPTIONS[0], status: "active", cadence: "weekly" },
    extras: {},
    goal: p.goal,
    planGoal: p.goal,
    goalFrom: null,
    quiz: structuredClone(p.quiz),
    planConfirmed: true,
    customer: "active",
    moment: "none",
    boxState: "aligned",
    freezer: freezerFor(p, "aligned"),
    notEaten: {},
    removedFromPlan: [],
    skipNextOrder: [],
    dismissed: [],
    checkinScore: null,
    checkinWeek: 6,
    introSeen: true,
    planView: "week",
    calMonth: 0,
    weeklyTarget: p.quiz.meals ?? goalInfo(p.goal).baseMeals,
    plantTarget: 30,
    sms: true,
    discount: null,
    addonsDismissed: false,
    checkIn: "open",
    eveningDone: false,
    rhythm: buildRhythm(p),
    sheet: null,
    eveOpen: false,
    eveSeed: null,
    week: "this",
    selectedDay: 1,
    view: "day",
    toasts: [],
    events: [],
  };
}

type Ctx = {
  s: State;
  p: Persona & { goalOrNull: Goal | null };
  set: (fn: (draft: State) => void) => void;
  toast: (text: string, undo?: () => void) => void;
  track: (event: string) => void;
  openSheet: (sheet: Sheet) => void;
  openEve: (seed?: string) => void;
  switchPersona: (id: Persona["id"]) => void;
};

const StoreCtx = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [s, setS] = useState<State>(() => initialState("anna"));
  const toastId = useRef(0);

  const set = useCallback((fn: (draft: State) => void) => {
    setS((prev) => {
      const draft = structuredClone({ ...prev, toasts: [] }) as State;
      // functions (undo callbacks) can't be cloned, so carry toasts over by reference
      draft.toasts = prev.toasts;
      fn(draft);
      return draft;
    });
  }, []);

  const toast = useCallback((text: string, undo?: () => void) => {
    const id = ++toastId.current;
    setS((prev) => ({ ...prev, toasts: [...prev.toasts.slice(-1), { id, text, undo }] }));
    setTimeout(() => setS((prev) => ({ ...prev, toasts: prev.toasts.filter((t) => t.id !== id) })), 4200);
  }, []);

  const track = useCallback((event: string) => {
    console.info("[prototype event]", event);
    setS((prev) => ({ ...prev, events: [...prev.events, event] }));
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      s,
      p: { ...getPersona(s.personaId), goal: s.goal, goalLabel: goalInfo(s.goal).label, schedule: planSchedule(s), goalOrNull: hasGoal(s) ? s.goal : null },
      set,
      toast,
      track,
      openSheet: (sheet) => set((d) => { d.sheet = sheet; }),
      openEve: (seed) => set((d) => { d.eveOpen = true; d.eveSeed = seed ?? null; d.sheet = null; }),
      switchPersona: (id) => setS(initialState(id)),
    }),
    [s, set, toast, track]
  );

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("useStore outside StoreProvider");
  return ctx;
}

/** All dishes in next week's plan, i.e. the next box. One place for plan and box. */
export function boxItems(s: State) {
  const counts = new Map<string, number>();
  s.weeks.next.forEach((d) => d.slots.forEach((sl) => {
    if (sl.dishId && !s.skipNextOrder.includes(sl.dishId)) counts.set(sl.dishId, (counts.get(sl.dishId) ?? 0) + 1);
  }));
  Object.entries(s.extras).forEach(([id, n]) => { if (n > 0) counts.set(id, (counts.get(id) ?? 0) + n); });
  return [...counts.entries()].map(([id, qty]) => ({ id, qty, planned: s.skipNextOrder.includes(id) ? 0 : planCount(s, id) }));
}

export function planCount(s: State, id: string) {
  return s.weeks.next.reduce((a, d) => a + d.slots.filter((x) => x.dishId === id).length, 0);
}

/** Days in next week's plan that hold this dish, e.g. "Mon, Thu". */
export function planDays(s: State, id: string) {
  return s.weeks.next.flatMap((d, i) => (d.slots.some((x) => x.dishId === id) ? [DAY_NAMES[i]] : [])).join(", ");
}

export function boxPricing(s: State) {
  const items = boxItems(s);
  const count = items.reduce((a, b) => a + b.qty, 0);
  const meals = items.filter((i) => dishById(i.id).kind !== "addon").reduce((a, b) => a + b.qty, 0);
  const price = items.reduce((a, b) => a + dishById(b.id).price * b.qty, 0);
  const pct = meals >= 16 ? 21 : meals >= 12 ? 15 : meals >= 8 ? 10 : 0;
  const qtySave = (price * pct) / 100;
  const codeSave = s.discount ? ((price - qtySave) * 10) / 100 : 0;
  const shipping = price - qtySave - codeSave >= 60 || count === 0 ? 0 : 4.95;
  const total = price - qtySave - codeSave + shipping;
  return { items, count, meals, price, pct, qtySave, codeSave, shipping, savings: qtySave + codeSave, total };
}

export function plantsThisWeek(s: State) {
  // Unique-plant approximation: sum plants of distinct dishes, capped for realism.
  const ids = new Set<string>();
  s.weeks.this.forEach((d) => d.slots.forEach((sl) => sl.dishId && ids.add(sl.dishId)));
  return ids;
}

/** Hard filter: swap any dish that now conflicts with the customer's allergens, everywhere in the plan. */
export function applyExclusions(d: State, goal: Goal) {
  const ok = (id: string) => !dishById(id).contains.some((a) => d.exclude.includes(a));
  const pool = DISHES.filter((x) => !x.contains.some((a) => d.exclude.includes(a))).sort((a, b) => fitScore(goal, b) - fitScore(goal, a));
  let k = 0;
  for (const w of [d.weeks.this, d.weeks.next]) for (const day of w) for (const sl of day.slots) {
    if (sl.dishId && !ok(sl.dishId)) {
      const kinds = sl.slot === "breakfast" ? ["breakfast", "smoothie"] : ["meal"];
      const alts = pool.filter((x) => kinds.includes(x.kind));
      sl.dishId = alts.length ? alts[k++ % alts.length].id : null;
    }
  }
}

/** Slots the plan uses: from the quiz answers on file, or the persona default for a new customer without answers. */
export function planSchedule(s: State) {
  return s.quiz.meals ? scheduleFromQuiz(s.quiz) : getPersona(s.personaId).schedule;
}

/** New customer before their first plan: they see the next delivery, but no meal plan, rhythm or celebration yet. */
export function isNewCustomer(s: State) {
  return s.customer === "new";
}

/** A goal exists once the customer answered Eve's questions. New customers on a starter plan see no goal data. */
export function hasGoal(s: State) {
  return s.planConfirmed && !!s.quiz.q1;
}

// ---------- Plan model helpers (vision: the plan schedules the box in your freezer) ----------

const MAINS: SlotName[] = ["lunch", "dinner"];

/** Eaten is assumed for past planned meals unless the customer said otherwise; today counts once marked. */
export function isEaten(s: State, day: number, slot: SlotName) {
  const key = `${day}:${slot}`;
  if (day < TODAY_INDEX) return !s.notEaten[key];
  if (day === TODAY_INDEX) return !!s.made[key];
  return false;
}

/** Main meals from the plan eaten this week (for the goal progress card). */
export function weekEaten(s: State) {
  return s.weeks.this.reduce((a, d, i) => a + d.slots.filter((x) => x.dishId && MAINS.includes(x.slot) && isEaten(s, i, x.slot)).length, 0);
}

export function mainsPerWeek(s: State) {
  return s.weeks.this.reduce((a, d) => a + d.slots.filter((x) => x.dishId && MAINS.includes(x.slot)).length, 0);
}

export function slotsPerWeek(s: State) {
  return s.weeks.this.reduce((a, d) => a + d.slots.filter((x) => x.dishId).length, 0);
}

/** Starting freezer count for a box-state preset (prototype control). */
export function freezerFor(p: Persona, box: BoxState) {
  const week = buildWeek(p, THIS_MONDAY);
  const untilDelivery = week.slice(TODAY_INDEX, 3).reduce((a, d) => a + d.slots.filter((x) => x.dishId).length, 0);
  return box === "surplus" ? untilDelivery + 12 : box === "shortfall" ? Math.max(1, untilDelivery - 1) : untilDelivery;
}

const parseIso = (iso: string) => { const [y, m, d] = iso.split("-").map(Number); return new Date(y, m - 1, d); };
const dayDiff = (a: Date, b: Date) => Math.round((b.getTime() - a.getTime()) / 864e5);

/**
 * Box duration vs next delivery (Miro Steps 3–4): walk the plan forward from today, eating from the freezer.
 * Shortfall: the box runs out 5+ days before the next delivery. Surplus: 5+ days of meals still left on arrival.
 */
export function freezerOutlook(s: State) {
  const today = new Date(2026, 8, 29);
  const delivery = parseIso(s.delivery.date);
  const untilDelivery = Math.max(0, dayDiff(today, delivery));
  let left = s.freezer;
  let runsOut: Date | null = null;
  for (let i = 0; i < 60 && left > 0; i++) {
    const wd = (TODAY_INDEX + i) % 7;
    const week = TODAY_INDEX + i < 7 ? s.weeks.this : s.weeks.next;
    const planned = week[wd].slots.filter((x) => x.dishId && !(i === 0 && isEaten(s, wd, x.slot))).length;
    left -= planned;
    if (left <= 0) runsOut = new Date(2026, 8, 29 + i);
  }
  if (!runsOut) runsOut = new Date(2026, 8, 29 + 60);
  const perWeek = Math.max(1, slotsPerWeek(s));
  const gapDays = dayDiff(runsOut, delivery);
  const leftAtDelivery = Math.max(0, Math.round(s.freezer - (perWeek * untilDelivery) / 7));
  const surplusDays = Math.round((leftAtDelivery / perWeek) * 7);
  const flag: "shortfall" | "surplus" | null = gapDays >= 5 ? "shortfall" : surplusDays >= 5 ? "surplus" : null;
  const weeks = Math.round((s.freezer / perWeek) * 10) / 10;
  return { left: s.freezer, runsOut, delivery, gapDays, leftAtDelivery, flag, weeks, perWeek };
}

export const fmtDate = (d: Date) => d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });

/** One currency format everywhere (de-DE): 71,30 € (heuristic 2.9). */
export const eur = (n: number) => `${n.toFixed(2).replace(".", ",")} €`;
