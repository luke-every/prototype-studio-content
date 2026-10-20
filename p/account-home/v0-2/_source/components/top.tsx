"use client";

import { EveFace } from "./eve-mark";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ADDRESS, asset, buildWeek, NEXT_MONDAY, THIS_MONDAY, CUTOFF, DELIVERY_OPTIONS, dish, EMPTY_QUIZ, Goal, GOALS, goalInfo, NOW, persona, PERSONAS, Quiz, scheduleFromQuiz } from "@/lib/data";
import { BoxState, boxPricing, eur, hasGoal, CustomerState, freezerFor, Moment, State, useStore } from "@/lib/store";
import { MomentCard } from "./moments";
import { ONLY_B } from "@/lib/flags";
import { useEmbedded } from "@/lib/studio-controls";
import { Button, Card, Icon, Pill } from "./ui";

const ALL_VARIANTS = [
  { id: "a", prefix: "", label: "A", title: "Original" },
  { id: "b", prefix: "/v2", label: "B", title: "Week + Discover" },
  { id: "c", prefix: "/v3", label: "C", title: "Simplified" },
] as const;
type Variant = { id: (typeof ALL_VARIANTS)[number]["id"]; prefix: string; label: string; title: string };
/** The B only copy serves Variant B at the root and has no variant switch. */
export const VARIANTS: readonly Variant[] = ONLY_B ? [{ id: "b", prefix: "", label: "B", title: "Week + Discover" }] : ALL_VARIANTS;

export function variantOf(path: string) {
  return VARIANTS.find((v) => v.prefix && (path === v.prefix || path.startsWith(`${v.prefix}/`))) ?? VARIANTS[0];
}

/** Prototype controls for the vision states (customer, moment, freezer vs delivery). */
export function setCustomer(d: State, v: CustomerState) {
  d.customer = v;
  d.dismissed = [];
  if (v === "active") { d.planConfirmed = true; d.quiz = structuredClone(persona(d.personaId).quiz); d.delivery = { ...DELIVERY_OPTIONS[0], status: "active", cadence: d.delivery.cadence }; }
  if (v === "new") { d.planConfirmed = false; d.introSeen = false; d.checkinWeek = 1; d.loved = []; d.made = {}; d.notEaten = {}; d.quiz = structuredClone(EMPTY_QUIZ); d.goalFrom = null; d.goal = d.planGoal = persona(d.personaId).goal; d.weeks = { this: buildWeek(persona(d.personaId), THIS_MONDAY), next: buildWeek(persona(d.personaId), NEXT_MONDAY, 2) }; d.weeklyTarget = 3; d.delivery = { ...DELIVERY_OPTIONS[0], status: "active", cadence: "weekly" }; d.introSeen = true; d.sheet = { kind: "quiz" }; }
  if (v === "paused45" || v === "paused120") { d.planConfirmed = true; d.delivery = { ...DELIVERY_OPTIONS[0], status: "vacation", vacationUntil: v === "paused45" ? "you restart" : "you restart", cadence: d.delivery.cadence }; }
}

/** B only copy: the goal types are the personas. Same account, the quiz answers that lead to this goal (Miro goal routing). */
const GOAL_QUIZ: Record<Goal, Pick<Quiz, "q1" | "q1a" | "fitness">> = {
  balanced: { q1: "eat", q1a: null, fitness: null },
  gut: { q1: "gut", q1a: null, fitness: null },
  lose: { q1: "lose", q1a: "doctor", fitness: null },
  maintain: { q1: "lose", q1a: "maintain", fitness: null },
  lean: { q1: "fitness", q1a: null, fitness: "lean" },
  energy: { q1: "fitness", q1a: null, fitness: "energy" },
  muscle: { q1: "fitness", q1a: null, fitness: "muscle" },
  postpartum: { q1: "postpartum", q1a: null, fitness: null },
};
export function setGoalPersona(d: State, goal: Goal) {
  const base = persona(d.personaId);
  const meals = goalInfo(goal).baseMeals as 3 | 4;
  d.quiz = { ...structuredClone(base.quiz), ...GOAL_QUIZ[goal], meals };
  d.goal = d.planGoal = goal;
  d.goalFrom = null;
  d.weeklyTarget = meals;
  d.made = {};
  const schedule = scheduleFromQuiz(d.quiz);
  d.weeks = { this: buildWeek({ ...base, goal, exclude: d.exclude, schedule }, THIS_MONDAY), next: buildWeek({ ...base, goal, exclude: d.exclude, schedule }, NEXT_MONDAY, 2) };
}

export function setBox(d: State, v: BoxState) {
  d.boxState = v;
  d.freezer = freezerFor(persona(d.personaId), v);
  d.dismissed = d.dismissed.filter((k) => !k.startsWith("freezer"));
  d.delivery = v === "shortfall" ? { ...d.delivery, date: "2026-10-08", label: "Thu 8 Oct" } : { ...d.delivery, date: DELIVERY_OPTIONS[0].date, label: DELIVERY_OPTIONS[0].label };
}

/** The delivery states the bar offers: a box coming, arriving today, or cancelled. */
export function setDelivery(d: State, v: "coming" | "today" | "cancelled") {
  if (v === "coming") d.delivery = { ...DELIVERY_OPTIONS[0], status: "active", cadence: d.delivery.cadence };
  if (v === "today") d.delivery = { date: "2026-09-29", label: "Today", window: "14:00–18:00", status: "today", cadence: d.delivery.cadence };
  if (v === "cancelled") d.delivery = { ...DELIVERY_OPTIONS[0], label: "", status: "cancelled", cadence: d.delivery.cadence, inactiveSince: "August 2026", lastBox: "27.07.2026" };
}

export function setMoment(d: State, v: Moment) {
  d.moment = v;
  if (v === "checkin") d.checkIn = "open";
}

export function PrototypeBar() {
  const { s, set, switchPersona } = useStore();
  // Inside the studio the states are its controls (see StudioControls), so the bar steps aside.
  const embedded = useEmbedded();
  // B only copy: the customer state is the main switch; the goal ("Viewing as") and the rest sit behind "More states"
  const [more, setMore] = useState(!ONLY_B);
  // B only copy: start on the default goal's own setup (meals a week, plan), the same as picking it in "Viewing as"
  useEffect(() => { if (ONLY_B) set((d) => setGoalPersona(d, d.goal)); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const path = usePathname();
  const router = useRouter();
  const current = variantOf(path);
  const goVariant = (id: string) => {
    const v = VARIANTS.find((x) => x.id === id)!;
    router.push(`${v.prefix}${path.includes("/my-plan") ? "/my-plan/" : path.includes("/all-meals") ? "/all-meals/" : "/"}`);
  };
  const state = s.delivery.status === "today" ? "today" : s.delivery.status === "cancelled" ? "cancelled" : "coming";
  const setState = (v: "coming" | "today" | "cancelled") => set((d) => setDelivery(d, v));
  const customerSeg = (
    <Seg label="Customer" value={s.customer === "today" || s.customer === "cancelled" ? "active" : s.customer} onChange={(v) => set((d) => setCustomer(d, v as CustomerState))}
      options={[{ value: "active", label: "Active" }, { value: "new", label: "New" }, { value: "paused45", label: "Back after 45d" }, { value: "paused120", label: "Back after 120d" }]} />
  );
  const deliverySeg = (
    <Seg label="Delivery" value={state} onChange={(v) => setState(v as "coming" | "today" | "cancelled")}
      options={[{ value: "coming", label: "Coming" }, { value: "today", label: "Arrives today" }, { value: "cancelled", label: "Cancelled" }]} />
  );
  if (embedded) return null;
  return (
    <div className="bg-brown text-paper">
      <div className="mx-auto flex max-w-[1120px] flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2 text-[12.5px] sm:px-6">
        <span className="rounded-full bg-paper/15 px-2 py-0.5 font-medium">Prototype</span>
        {VARIANTS.length > 1 && <Seg label="Variant" value={current.id} onChange={goVariant} options={VARIANTS.map((v) => ({ value: v.id, label: <>{v.label} <span className="hidden opacity-60 md:inline">{v.title}</span></> }))} />}
        {!ONLY_B && (
          <Seg label="Viewing as" value={s.personaId} onChange={(v) => switchPersona(v as typeof s.personaId)}
            options={PERSONAS.map((p) => ({ value: p.id, label: <>{p.name} <span className="opacity-60">{p.code}</span></> }))} />
        )}
        {ONLY_B ? customerSeg : deliverySeg}
        <button onClick={() => setMore((m) => !m)} aria-expanded={more} className="ml-auto rounded-full px-2.5 py-1 text-paper/80 hover:bg-paper/10">{more ? "Fewer states" : "More states"}</button>
      </div>
      {more && (
        <div className="mx-auto flex max-w-[1120px] flex-wrap items-center gap-x-4 gap-y-2 border-t border-paper/10 px-4 py-2 text-[12.5px] sm:px-6">
          {ONLY_B && (
            <Seg label="Viewing as" value={s.goal} onChange={(v) => set((d) => setGoalPersona(d, v as Goal))}
              options={GOALS.map((g) => ({ value: g.id, label: g.short }))} />
          )}
          {ONLY_B ? deliverySeg : customerSeg}
          <Seg label="Moment" value={s.moment} onChange={(v) => set((d) => setMoment(d, v as Moment))}
            options={[{ value: "none", label: "None" }, { value: "checkin", label: "Check-in" }, { value: "predelivery", label: "Pre-delivery" }, { value: "firstbox", label: "First box done" }, { value: "away7", label: "Away 7 days" }]} />
          <Seg label="Box" value={s.boxState} onChange={(v) => set((d) => setBox(d, v as BoxState))}
            options={[{ value: "aligned", label: "Lasts" }, { value: "shortfall", label: "Runs out" }, { value: "surplus", label: "Too much" }]} />
        </div>
      )}
    </div>
  );
}

function Seg({ label, value, options, onChange }: { label: string; value: string; options: { value: string; label: React.ReactNode }[]; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-paper/70">{label}</span>
      <div className="flex gap-0.5" role="radiogroup" aria-label={label}>
        {options.map((o) => (
          <button key={o.value} role="radio" aria-checked={value === o.value} onClick={() => onChange(o.value)}
            className={`rounded-full px-2.5 py-1 transition ${value === o.value ? "bg-paper text-ink" : "text-paper/80 hover:bg-paper/10"}`}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const { s, toast, openSheet } = useStore();
  const path = usePathname();
  const { prefix } = variantOf(path);
  const onPlan = path.includes("/my-plan");
  const onMeals = path.includes("/all-meals");
  const soon = () => toast("Not part of this prototype");
  const tab = (active: boolean) =>
    `whitespace-nowrap rounded-full px-3.5 py-2 text-[14px] font-medium transition sm:px-4 ${active ? "bg-ink text-paper" : "text-stone hover:text-ink"}`;
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <nav className="relative mx-auto flex h-16 max-w-[1120px] items-center gap-3 px-4 sm:gap-5 sm:px-6" aria-label="Account sections">
        <Link href={`${prefix}/`} aria-label="every home" className="hidden shrink-0 sm:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset("/logo.svg")} alt="every" className="h-[22px] w-auto" />
        </Link>
        <div className="-ml-2 flex items-center gap-0.5 sm:ml-2 sm:gap-1.5">
          <Link href={`${prefix}/`} aria-current={!onPlan && !onMeals ? "page" : undefined} className={tab(!onPlan && !onMeals)}>Home</Link>
          <Link href={`${prefix}/all-meals/`} aria-current={onMeals ? "page" : undefined} className={tab(onMeals)}>{prefix || ONLY_B ? "All meals" : "Discover Every"}</Link>
          <Link href={`${prefix}/my-plan/`} aria-current={onPlan ? "page" : undefined} className={tab(onPlan)}>My Plan</Link>
        </div>
        <button onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="Settings and more" className="ml-auto grid size-10 shrink-0 place-items-center rounded-xl text-stone hover:bg-offwhite">
          <Icon name="menu" />
        </button>
        {open && (
          <div className="absolute right-4 top-[calc(100%+8px)] z-50 flex min-w-[230px] flex-col rounded-[20px] bg-white p-3 shadow-e3 sm:right-6" role="menu">
            {["My goals", "Track delivery", "Order history", "Preferences & allergens", "Rewards", "Account & settings", "Help & FAQ", "Log out"].map((l) => (
              <button key={l} role="menuitem" onClick={() => { setOpen(false); if (l.startsWith("Preferences")) openSheet({ kind: "preferences" }); else if (l === "My goals") openSheet({ kind: hasGoal(s) ? "goals" : "quiz" }); else soon(); }} className="rounded-lg px-3 py-2.5 text-left text-[15px] text-ink hover:bg-offwhite">
                {l}
              </button>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}

/**
 * Greeting derived from state, not persona copy (heuristic: persona data QA). Re-entry language only
 * for customers who were actually away; active customers get the one thing that matters this week.
 */
export function useGreeting() {
  const { s } = useStore();
  const st = s.delivery.status;
  if (st === "cancelled") return { title: "Good to see you again.", sub: "Your loves and your plan are saved. Pick up whenever it suits you." };
  if (s.customer === "paused45" || s.customer === "paused120") return { title: "Welcome back.", sub: "Your plan is where you left it." };
  if (s.customer === "new") return { title: "Welcome to every.", sub: s.planConfirmed ? "Your first box arrives Thursday. Edit until tonight, 23:59." : "Your first box arrives Thursday. A weekly plan makes the next ones automatic." };
  if (st === "today") return { title: "Your box arrives today.", sub: "Between 14:00 and 18:00. Freezer space for about 10 meals helps." };
  if (st === "skipped") return { title: "This week is skipped.", sub: "Your plan picks up again with the box after." };
  if (st === "vacation") return { title: "Your plan is on hold.", sub: `Vacation mode until ${s.delivery.vacationUntil}.` };
  return { title: `Your box arrives ${s.delivery.label === "Thu 1 Oct" ? "Thursday" : s.delivery.label}.`, sub: "This week is planned. Nothing else to sort." };
}

/** Greeting knows the customer. No "you've been away" banner (Anna, Laura). */
export function Greeting() {
  const { p } = useStore();
  const hour = NOW.getHours();
  const hello = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const g = useGreeting();

  return (
    <section className="pt-6 sm:pt-8">
      <p className="text-[14px] text-stone">{hello}, {p.name}</p>
      <h1 className="mt-1 font-serif text-[30px] leading-[1.08] text-ink sm:text-[38px]">{g.title}</h1>
      {g.sub && <p className="mt-1.5 text-[14.5px] text-stone">{g.sub}</p>}
      <div className="mt-4 empty:hidden"><MomentCard place="home" /></div>

    </section>
  );
}

function useCutoff() {
  const ms = CUTOFF.getTime() - NOW.getTime();
  const h = Math.floor(ms / 3.6e6);
  const m = Math.round((ms % 3.6e6) / 6e4);
  return { h, m };
}

/** My Plan link inside the current variant (A: /my-plan/, B: /v2/my-plan/, C: /v3/my-plan/). */
export function usePlanHref() {
  return `${variantOf(usePathname()).prefix}/my-plan/`;
}

/** All Meals link inside the current variant, optionally jumping to a category section. */
export function useMealsHref(cat?: string) {
  return `${variantOf(usePathname()).prefix}/all-meals/${cat ? `#cat-${cat}` : ""}`;
}

/** `extra` renders inside the white part, under the box (Variant A puts the freezer line there). */
export function DeliveryCard({ extra }: { extra?: React.ReactNode } = {}) {
  const { s, set, toast, openSheet, openEve } = useStore();
  const planHref = usePlanHref();
  const pr = boxPricing(s);
  const { items, count, total } = pr;
  const { h, m } = useCutoff();
  const d = s.delivery;

  const skip = () => {
    set((x) => { x.delivery.status = "skipped"; });
    toast(`Skipped the ${d.label} box. Your rhythm is on hold, not reset.`, () => {
      set((x) => { x.delivery.status = "active"; x.toasts = []; });
    });
  };

  if (d.status === "cancelled") {
    return (
      <Card className="p-5">
        <div className="eyebrow">Subscription</div>
        <p className="mt-2 font-serif text-[22px] text-ink">{d.label ? `Your last box arrives ${d.label}.` : "No more boxes are on the way."}</p>
        <p className="mt-1 text-[14px] text-stone">Your plan, favourites and allergens stay saved if you ever want to come back.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => { set((x) => { x.delivery = { ...DELIVERY_OPTIONS[0], status: "active", cadence: x.delivery.cadence }; }); toast("Subscription resumed. Nothing else changed."); }}>Resume subscription</Button>
          <Link href={planHref} className="inline-flex items-center rounded-full px-4 py-3 text-[14px] font-medium text-ink underline decoration-line2 underline-offset-4">See my last box</Link>
        </div>
      </Card>
    );
  }

  if (d.status === "today") {
    return (
      <Card className="overflow-hidden">
        <div className="bg-brown p-5 text-paper">
          <span className="text-[12px] uppercase tracking-[.08em] text-paper/65">Your box arrives today</span>
          <p className="mt-3 font-serif text-[28px] leading-none">Estimated {d.window}</p>
          <p className="mt-2 text-[14px] text-paper/75">{count} items · {ADDRESS}</p>
        </div>
        <div className="grid grid-cols-2 gap-2 p-5">
          <Button size="sm" variant="dark" onClick={() => toast("Prototype: this would open the courier's tracking page.")}><Icon name="truck" className="size-4" /> Track delivery</Button>
          <Link href={planHref} className="inline-flex items-center justify-center rounded-full bg-offwhite px-3.5 py-2 text-[13px] font-medium text-ink">See my box</Link>
        </div>
      </Card>
    );
  }

  const paused = d.status === "skipped" || d.status === "vacation";

  return (
    <Card className="overflow-hidden">
      <div className="bg-brown p-5 text-paper">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[12px] uppercase tracking-[.08em] text-paper/65">Next delivery</span>
          {!paused ? (
            <span className="rounded-full bg-signal px-2.5 py-1 text-[11.5px] font-medium text-ink">Edit until tonight, 23:59</span>
          ) : (
            <span className="rounded-full bg-paper/15 px-2.5 py-1 text-[11.5px] font-medium">{d.status === "vacation" ? "Vacation mode" : "Skipped"}</span>
          )}
        </div>
        <p className="mt-3 font-serif text-[28px] leading-none">
          {d.status === "vacation" ? `Back from ${d.vacationUntil}` : d.label}
        </p>
        <p className="mt-2 text-[14px] text-paper/75">
          {paused
            ? d.status === "vacation"
              ? "I'm holding your rhythm. Your plan restarts on its own when you're back."
              : "No box this week. Your plan and rhythm are saved."
            : `${d.window} · ${ADDRESS}`}
        </p>
        {!paused && (
          <p className="mt-3 flex items-center gap-1.5 text-[13px] text-paper/85">
            <Icon name="clock" className="size-4" /> {h} h {m} min left to change meals, day or address
          </p>
        )}
      </div>

      {!paused ? (
        <div className="p-5">
          <div className="flex items-baseline justify-between">
            <p className="text-[14px] font-medium text-ink">{count} items in your box</p>
            <Link href={planHref} className="text-[13px] text-stone underline decoration-line2 underline-offset-4 hover:text-ink">{eur(total)} · details</Link>
          </div>
          <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
            {items.map(({ id, qty }) => (
              <div key={id} className="relative shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset(dish(id).img)} alt={dish(id).name} className="size-14 rounded-xl object-cover" />
                {qty > 1 && <span className="absolute -right-1 -top-1 rounded-full bg-ink px-1.5 text-[11px] text-paper">×{qty}</span>}
              </div>
            ))}
          </div>
          {pr.savings > 0 && <p className="mt-3 text-[13px] text-[#5d5e2f]">You save {eur(pr.savings)} on this order.</p>}
          <p className="mt-1 text-[12.5px] text-stone">Your next order follows your plan. Change a meal in My Plan and the box follows.</p>
          {extra}
          <Link href={`${planHref}#plan`} onClick={() => set((x) => { x.week = "next"; x.planView = "week"; })} className="mt-4 flex w-full items-center justify-center rounded-full bg-ink px-5 py-3 text-[14px] font-medium text-paper">Edit meals</Link>
          <div className="mt-3 flex items-center justify-center gap-4 text-[13px] text-stone">
            <button onClick={() => openSheet({ kind: "delivery" })} className="underline decoration-line2 underline-offset-4 hover:text-ink">Move day</button>
            <button onClick={skip} className="underline decoration-line2 underline-offset-4 hover:text-ink">Skip this box</button>
            <button onClick={() => openEve("pause")} className="underline decoration-line2 underline-offset-4 hover:text-ink">Going away?</button>
          </div>
        </div>
      ) : (
        <div className="p-5">
          <Button variant="outline" className="w-full" onClick={() => { set((x) => { x.delivery.status = "active"; x.delivery.vacationUntil = undefined; }); toast("Welcome to next week. Your box is back on."); }}>
            {d.status === "vacation" ? "I'm back early, restart now" : "Undo skip"}
          </Button>
        </div>
      )}
    </Card>
  );
}

/** Evening-before prompt, hooked onto the existing slot (research §4). */
export function EveningNudge() {
  const { s, set, toast } = useStore();
  const tomorrow = s.weeks.this[2];
  const next = tomorrow.slots.find((x) => x.dishId && x.slot !== "breakfast");
  if (!next || s.eveningDone) return null;
  const d = dish(next.dishId!);
  return (
    <div className="flex items-center gap-3 rounded-[20px] bg-moment p-4">
      <div className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-sky"><Icon name="fridge" /></div>
      <p className="min-w-0 flex-1 text-[14px] leading-snug text-ink">
        Tomorrow&apos;s {next.slot} is <b className="font-medium">{d.name}</b>. Move it to the fridge tonight?
      </p>
      <div className="flex shrink-0 gap-1.5">
        <Button size="sm" variant="light" onClick={() => { set((x) => { x.eveningDone = true; }); toast("Not now. Eve reminds you at 20:00.", () => set((x) => { x.eveningDone = false; x.toasts = []; })); }}>Not now</Button>
        <Button size="sm" variant="dark" onClick={() => { set((x) => { x.eveningDone = true; }); toast("Done. Tomorrow is sorted.", () => set((x) => { x.eveningDone = false; x.toasts = []; })); }}>Done</Button>
      </div>
    </div>
  );
}

export { Pill };
