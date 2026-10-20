"use client";

import { useMemo, useState } from "react";
import {
  addDays, asset, buildWeek, DAY_NAMES, Day, dish, goalBg, goalInfo, persona, SlotName, THIS_MONDAY, TODAY_INDEX,
} from "@/lib/data";
import { eur, fmtDate, freezerOutlook, hasGoal, isEaten, isNewCustomer, planSchedule, State, useStore } from "@/lib/store";
import { GoalProgress, GoalTag } from "./goals";
import { MealActions, WeekKey } from "./meal";
import { MomentCard, PreDeliveryCard } from "./moments";
import { Button, Icon, Pill, Sheet } from "./ui";
import { usePathname } from "next/navigation";
import { variantOf } from "./top";

/**
 * My Plan as the plan hub (vision): goal header, soft focus chips, freezer outlook, goal progress,
 * week ↔ calendar views with every meal action, inline signals and the pre-delivery prompt.
 * Shown in all three variants above the box, price and subscription sections.
 */
export function PlanHub() {
  const { s, set, openSheet } = useStore();
  const g = goalInfo(s.goal);
  const [science, setScience] = useState(false);
  const goalSet = hasGoal(s);
  const isNew = isNewCustomer(s);
  // Targets openly in Variant A, one tap deep (chip drawer) in B and C
  const openNumbers = variantOf(usePathname()).id === "a";

  return (
    <section aria-label="Your plan" className="mx-auto max-w-[1120px] space-y-6 px-4 pt-6 sm:px-6 lg:pt-8">
      <MomentCard place="plan" />

      {/* 1. Goal header, in the goal group colour */}
      <div className={`rounded-[24px] p-5 sm:p-6 ${goalSet ? goalBg(s.goal) : "bg-white"}`}>
        <div className="flex flex-wrap items-center gap-2">
          <GoalTag />
          {!isNew && <span className="text-[12.5px] text-stone">{s.weeklyTarget} meals a week · plan for 1 person</span>}
          {!isNew && s.quiz.household && s.quiz.household !== "me" && <span className="w-full text-[12.5px] text-stone">Your plan is for you. Your box can still feed more people.</span>}
        </div>
        <h1 className="mt-3 font-serif text-[28px] leading-[1.1] text-ink sm:text-[34px]">{goalSet ? g.title : isNew ? "Your plan starts here" : "Your starter plan"}</h1>
        <p className="mt-2 max-w-[60ch] text-[14.5px] leading-relaxed text-body">{goalSet ? g.message || g.hint : isNew ? "Your first box is on its way. Answer Eve's questions and she builds your meal plan around your goal, your week and what you like." : "Eve picked balanced, popular meals to get you started. Once you've answered her questions, the plan is shaped around your goal."}</p>
        {goalSet && <>
        <div className="mt-4 flex flex-wrap gap-2" aria-label="Your focus">
          {g.chips.map((c) => (
            <button key={c.key} onClick={() => openSheet({ kind: "chip", key: c.key })}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1.5 text-[13px] font-medium text-ink hover:bg-white">
              {c.label}{openNumbers && <span className="font-normal text-stone">· {c.target.split(" ").slice(0, 2).join(" ")}</span>}
            </button>
          ))}
        </div>
        {g.science && <button onClick={() => setScience((v) => !v)} aria-expanded={science} className="mt-4 flex items-center gap-1.5 text-[13px] font-medium text-ink">
          <Icon name="info" className="size-4" /> Why this works <Icon name="chevronDown" className={`size-3.5 transition ${science ? "rotate-180" : ""}`} />
        </button>}
        {science && <p className="mt-2 max-w-[62ch] text-[13.5px] leading-relaxed text-body">{g.science}</p>}
        </>}
        {!goalSet && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-terra-bg/60 p-4">
            <p className="text-[13.5px] text-body">10 quick questions: your goal, your week, what you like. About two minutes.</p>
            <Button size="sm" onClick={() => openSheet({ kind: "quiz" })}>Answer Eve&apos;s questions</Button>
          </div>
        )}
        {goalSet && <DeepDiveNudge />}
      </div>

      {!isNew && <>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
        <div className="min-w-0 space-y-6">
          <Signals />
          <PlanViews />
        </div>
        <div className="space-y-6">
          <FreezerCard />
          <PreDeliveryCard />
          <GoalProgress />
          {s.planView === "calendar" && s.calMonth === 1 && <AheadBanner />}
        </div>
      </div>
      <button onClick={() => set((d) => { d.sheet = { kind: "intro" }; })} className="text-[12.5px] text-stone underline decoration-line2 underline-offset-4 hover:text-ink">How your plan works</button>
      </>}
    </section>
  );
}

/** Optional deep-dive for goals where portions matter (Miro DQ). Never required. */
export function DeepDiveNudge() {
  const { s, set, openSheet } = useStore();
  // Deep dive only for weight and fitness goals (Miro: "If goal = weight or fitness")
  if (!["lose", "maintain", "lean", "energy", "muscle"].includes(s.goal) || s.dismissed.includes("deep") || s.quiz.deep.height) return null;
  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white/70 p-4">
      <p className="text-[13.5px] text-body"><b className="font-medium text-ink">Want portions tuned to you?</b> Add height and weight. Optional, and only used for your plan.</p>
      <div className="flex gap-2">
        <Button size="sm" variant="ghost" onClick={() => set((d) => { d.dismissed.push("deep"); })}>Not now</Button>
        <Button size="sm" variant="outline" onClick={() => openSheet({ kind: "deep" })}>Add details</Button>
      </div>
    </div>
  );
}

/** Freezer outlook (Miro Steps 3–4): how long the box lasts vs the next delivery, flagged at 5+ days. */
export function FreezerCard({ compact = false }: { compact?: boolean }) {
  const { s, set, toast, track, openSheet } = useStore();
  const o = freezerOutlook(s);
  if (s.delivery.status === "cancelled") return null;
  const key = `freezer:${o.flag}`;
  const flagged = o.flag && !s.dismissed.includes(key);

  return (
    <section aria-label="Your freezer" className={`rounded-[20px] p-4 sm:p-5 ${flagged ? (o.flag === "shortfall" ? "bg-terra-bg/70" : "bg-sky-bg/70") : "border border-line bg-white"}`}>
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-ink"><Icon name="fridge" className="size-5" /></span>
        <div className="min-w-0 flex-1">
          <p className="eyebrow !text-[10.5px]">In your freezer</p>
          <p className="mt-0.5 text-[15px] text-ink"><b className="font-medium">{o.left} {o.left === 1 ? "meal" : "meals"}</b> · lasts until {fmtDate(o.runsOut)}</p>
          {!compact && <p className="text-[12.5px] text-stone">Next delivery {s.delivery.label}. Your plan eats {o.perWeek} a week.</p>}
        </div>
      </div>
      {flagged && o.flag === "shortfall" && (
        <div className="mt-3">
          <p className="text-[14px] leading-relaxed text-body">Your box runs out {o.gapDays} days before the next one arrives. Want to close the gap?</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button size="sm" onClick={() => { set((d) => { d.delivery.date = "2026-10-01"; d.delivery.label = "Thu 1 Oct"; d.boxState = "aligned"; d.freezer += 0; d.dismissed.push(key); }); track("SHORTFALL_bring_forward"); toast("Delivery moved to Thu 1 Oct. No gap now."); }}>Bring delivery forward</Button>
            <Button size="sm" variant="outline" onClick={() => openSheet({ kind: "addMeals" })}>Add meals</Button>
            <Button size="sm" variant="ghost" onClick={() => set((d) => { d.dismissed.push(key); })}>I&apos;m fine</Button>
          </div>
        </div>
      )}
      {flagged && o.flag === "surplus" && (
        <div className="mt-3">
          <p className="text-[14px] leading-relaxed text-body">You&apos;ll still have about {o.leftAtDelivery} meals when the next box arrives. Want to adjust?</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button size="sm" onClick={() => { set((d) => { d.weeklyTarget += 1; d.dismissed.push(key); }); track("SURPLUS_more_meals"); toast("Plan set to one more meal a week, from your freezer first."); }}>Eat more from my plan</Button>
            <Button size="sm" variant="outline" onClick={() => { set((d) => { d.delivery.date = "2026-10-08"; d.delivery.label = "Thu 8 Oct"; d.dismissed.push(key); }); track("SURPLUS_push"); toast("Next delivery pushed to Thu 8 Oct."); }}>Push delivery a week</Button>
            <Button size="sm" variant="ghost" onClick={() => set((d) => { d.dismissed.push(key); })}>Keep as is</Button>
          </div>
        </div>
      )}
    </section>
  );
}

/** Inline plan signals (Miro A–E). Quiet, one line each, always dismissible. */
export type Signal = { key: string; tone: string; text: string; cta: string; run: () => void };

/** Inline plan signals A–E, already filtered for dismissals. Shared by the plan hub and Variant A's "Eve noticed". */
export function useSignals(): Signal[] {
  const { s, set, toast, track, openSheet, openEve } = useStore();
  const notEaten = Object.keys(s.notEaten).length;
  const dislikedNext = s.weeks.next.flatMap((d, i) => d.slots.filter((x) => x.dishId && s.disliked.includes(x.dishId)).map((x) => ({ i, slot: x.slot, id: x.dishId! })));
  const lovedMissing = s.loved.filter((id) => !s.weeks.next.some((d) => d.slots.some((x) => x.dishId === id)) && !s.extras[id]);
  const signals: { key: string; tone: string; text: string; cta: string; run: () => void }[] = [];
  if (dislikedNext[0]) signals.push({ key: `A:${dislikedNext[0].id}`, tone: "bg-plum-bg", text: `${dish(dislikedNext[0].id).name} is still in next week, and you said it's not for you.`, cta: "Swap it", run: () => openSheet({ kind: "swap", week: "next", day: dislikedNext[0].i, slot: dislikedNext[0].slot }) });
  if (notEaten >= 2) signals.push({ key: "B", tone: "bg-sky-bg", text: `A busy week: ${notEaten} meals are still in the freezer. Want one meal fewer a week for now?`, cta: "Plan one fewer", run: () => { set((d) => { d.weeklyTarget = Math.max(2, d.weeklyTarget - 1); }); track("SIGNAL_fewer"); toast("Done. Change it back any time."); } });
  if (lovedMissing[0]) signals.push({ key: `C:${lovedMissing[0]}`, tone: "bg-terra-bg/70", text: `You loved ${dish(lovedMissing[0]).name}. It's not in your next box.`, cta: "Add it", run: () => { set((d) => { d.extras[lovedMissing[0]] = 1; }); toast(`${dish(lovedMissing[0]).name} added to your next order.`); } });
  if (s.goalFrom && hasGoal(s)) signals.push({ key: "D", tone: goalBg(s.goal), text: `New goal saved. Your plan follows ${goalInfo(s.goal).label.toLowerCase()} from ${s.goalFrom}; this week stays as it is.`, cta: "See what changes", run: () => openSheet({ kind: "goals" }) });
  if (s.notes.length) signals.push({ key: "E", tone: "bg-paper", text: `Eve is using your note: “${s.notes[s.notes.length - 1]}”.`, cta: "Tell Eve more", run: () => openEve() });
  return signals.filter((x) => !s.dismissed.includes(`sig:${x.key}`));
}

function Signals() {
  const { set } = useStore();
  const show = useSignals().slice(0, 3);
  if (!show.length) return null;
  return (
    <div className="space-y-2" aria-label="Eve noticed">
      {show.map((x) => (
        <div key={x.key} className={`flex flex-wrap items-center gap-x-3 gap-y-2 rounded-2xl px-4 py-3 ${x.tone}`}>
          <p className="min-w-0 flex-1 text-[13.5px] leading-snug text-body">{x.text}</p>
          <div className="flex items-center gap-1">
            <Button size="sm" variant="light" onClick={x.run}>{x.cta}</Button>
            <button aria-label="Dismiss" onClick={() => set((d) => { d.dismissed.push(`sig:${x.key}`); })} className="grid size-8 place-items-center rounded-full text-stone hover:bg-white/60"><Icon name="close" className="size-3.5" /></button>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Week ↔ calendar toggle (Miro "My Plan views"). */
export function PlanViewToggle() {
  const { s, set } = useStore();
  return (
    <div className="flex rounded-full bg-offwhite p-1 text-[13px]" role="tablist" aria-label="Plan view">
      {(["week", "calendar"] as const).map((v) => (
        <button key={v} role="tab" aria-selected={s.planView === v} onClick={() => set((d) => { d.planView = v; })}
          className={`rounded-full px-4 py-1.5 font-medium capitalize ${s.planView === v ? "bg-white text-ink shadow-e1" : "text-stone"}`}>{v}</button>
      ))}
    </div>
  );
}

/** Week or calendar body without its own title (Variant A puts the title and toggle in the section header). */
export function PlanViewBody() {
  const { s } = useStore();
  return s.planView === "week" ? <WeekView /> : <CalendarView />;
}

function PlanViews() {
  const { s, set } = useStore();
  return (
    <section aria-label="Plan" className="rounded-[24px] bg-white p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-serif text-[24px] leading-tight text-ink">Your meals</h2>
        <div className="flex rounded-full bg-offwhite p-1 text-[13px]" role="tablist" aria-label="Plan view">
          {(["week", "calendar"] as const).map((v) => (
            <button key={v} role="tab" aria-selected={s.planView === v} onClick={() => set((d) => { d.planView = v; })}
              className={`rounded-full px-4 py-1.5 font-medium capitalize ${s.planView === v ? "bg-white text-ink shadow-e1" : "text-stone"}`}>{v}</button>
          ))}
        </div>
      </div>
      {s.planView === "week" ? <WeekView /> : <CalendarView />}
    </section>
  );
}

function WeekView() {
  const { s, set } = useStore();
  const week = s.week as WeekKey;
  const days = s.weeks[week];
  return (
    <div className="mt-4">
      <div className="flex gap-2">
        {(["this", "next"] as const).map((w) => (
          <button key={w} onClick={() => set((d) => { d.week = w; })} aria-pressed={week === w}
            className={`rounded-full border px-3.5 py-1.5 text-[13px] font-medium ${week === w ? "border-ink bg-ink text-paper" : "border-line2 text-ink"}`}>
            {w === "this" ? "This week · 28 Sep" : "Next week · 5 Oct"}
          </button>
        ))}
      </div>
      {week === "next" && <p className="mt-3 text-[12.5px] text-stone">Next week is your next order. Changes here change the box, until tonight 23:59.</p>}
      <ol className="mt-4 divide-y divide-line">
        {days.map((d, i) => <DayRow key={d.date} week={week} day={i} d={d} />)}
      </ol>
    </div>
  );
}

function DayRow({ week, day, d }: { week: WeekKey; day: number; d: Day }) {
  const { s, p } = useStore();
  const scheduled = (slot: SlotName) => !!p.schedule[slot]?.includes(day);
  const slots = d.slots.filter((x) => x.dishId || scheduled(x.slot));
  const isToday = week === "this" && day === TODAY_INDEX;
  const past = week === "this" && day < TODAY_INDEX;
  return (
    <li className={`py-3 ${past ? "opacity-80" : ""}`}>
      <p className="text-[12.5px] font-medium uppercase tracking-[.12em] text-stone">
        {DAY_NAMES[day]} {Number(d.date.slice(-2))}{isToday && <span className="ml-2 rounded-full bg-terra px-2 py-0.5 text-[10.5px] tracking-normal text-white">Today</span>}
      </p>
      {slots.length === 0 && <p className="mt-1.5 text-[13px] text-stone">Nothing planned. Your own cooking, or a night out.</p>}
      <div className="mt-2 space-y-3">
        {slots.map((x) => x.dishId ? <MealRow key={x.slot} week={week} day={day} slot={x.slot} id={x.dishId} /> : <AddSlot key={x.slot} week={week} day={day} slot={x.slot} />)}
      </div>
      {isToday && s.loved.length === 0 && null}
    </li>
  );
}

function MealRow({ week, day, slot, id }: { week: WeekKey; day: number; slot: SlotName; id: string }) {
  const { s, p, openSheet } = useStore();
  const d = dish(id);
  const disliked = s.disliked.includes(id);
  const eaten = week === "this" && isEaten(s, day, slot);
  return (
    <div className="flex gap-3">
      <button onClick={() => openSheet({ kind: "why", week, day, slot })} className="shrink-0" aria-label={`Why ${d.name}?`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset(d.img)} alt="" className={`size-[72px] rounded-xl object-cover ${disliked ? "grayscale" : ""}`} />
      </button>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2">
          <span className="text-[11.5px] capitalize text-stone">{slot}</span>
          <span className="text-[11.5px] text-stone">· {s.extras[id] ? "Eve pick" : "In your plan"}</span>
          {eaten && <span className="text-[11.5px] text-[#5d5e2f]">· counted</span>}
        </div>
        <button onClick={() => openSheet({ kind: "why", week, day, slot })} className={`block text-left text-[15.5px] font-medium leading-snug ${disliked ? "text-stone line-through decoration-1" : "text-ink"}`}>{d.name}</button>
        <p className="mt-0.5 line-clamp-1 text-[12.5px] text-stone">{p.goalOrNull ? `${goalInfo(p.goal).chips[0].label}: ${chipValue(d, goalInfo(p.goal).chips[0].key)} · ` : ""}{d.minutes ? `${d.minutes} min` : "No cooking"}</p>
        <div className="mt-2"><MealActions week={week} day={day} slot={slot} compact /></div>
      </div>
    </div>
  );
}

function AddSlot({ week, day, slot }: { week: WeekKey; day: number; slot: SlotName }) {
  const { openSheet } = useStore();
  return (
    <button onClick={() => openSheet({ kind: "addSlot", week, day, slot })} className="flex w-full items-center gap-3 rounded-2xl border border-dashed border-line2 px-3 py-3 text-left text-[13.5px] text-stone hover:border-ink/40 hover:text-ink">
      <span className="grid size-10 place-items-center rounded-xl bg-offwhite"><Icon name="plus" className="size-4" /></span>
      Add a {slot}<span className="ml-auto text-[12px]">from your box or new</span>
    </button>
  );
}

/** Weeks beyond next are projected from the goal (Eve fills them closer to the time). */
function useProjected(s: State) {
  return useMemo(() => {
    const base = { ...persona(s.personaId), goal: s.goal, exclude: s.exclude };
    const out: Day[][] = [s.weeks.this, s.weeks.next];
    for (let w = 2; w < 11; w++) out.push(buildWeek(base, addDays(THIS_MONDAY, 7 * w), w * 2));
    return out;
  }, [s.personaId, s.goal, s.exclude, s.weeks]);
}

const MONTHS = [{ label: "October 2026", y: 2026, m: 9 }, { label: "November 2026", y: 2026, m: 10 }];

function CalendarView() {
  const { s, set, openSheet } = useStore();
  const weeks = useProjected(s);
  const M = MONTHS[s.calMonth];
  const first = new Date(M.y, M.m, 1);
  const start = addDays(first, -((first.getDay() + 6) % 7));
  const cells = Array.from({ length: 42 }, (_, i) => addDays(start, i)).filter((d, i) => i < 35 || d.getMonth() === M.m);
  const weekIdx = (d: Date) => Math.floor(Math.round((d.getTime() - THIS_MONDAY.getTime()) / 864e5) / 7);
  const dayOf = (d: Date) => (d.getDay() + 6) % 7;
  const slotsOn = (d: Date) => { const w = weekIdx(d); return w >= 0 && w < weeks.length ? weeks[w][dayOf(d)].slots.filter((x) => x.dishId) : []; };

  const inMonth = cells.filter((d) => d.getMonth() === M.m);
  const all = inMonth.flatMap(slotsOn);
  const mains = all.filter((x) => x.slot !== "breakfast").length;
  const breakfasts = all.length - mains;
  const extras = Object.values(s.extras).reduce((a, b) => a + b, 0);
  const loved = all.filter((x) => s.loved.includes(x.dishId!)).length;
  const priceMonth = all.reduce((a, x) => a + dish(x.dishId!).price, 0);

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between">
        <button disabled={s.calMonth === 0} onClick={() => set((d) => { d.calMonth = 0; })} aria-label="Previous month" className="grid size-9 place-items-center rounded-full border border-line2 disabled:opacity-30"><Icon name="arrowLeft" className="size-4" /></button>
        <p className="font-serif text-[20px] text-ink">{M.label}</p>
        <button disabled={s.calMonth === 1} onClick={() => set((d) => { d.calMonth = 1; })} aria-label="Next month" className="grid size-9 place-items-center rounded-full border border-line2 disabled:opacity-30"><Icon name="chevron" className="size-4" /></button>
      </div>
      <dl className="mt-3 grid grid-cols-4 divide-x divide-line rounded-2xl bg-paper text-center">
        {[["Mains", mains], ["Breakfasts", breakfasts], ["Extras", extras], ["Loved", loved]].map(([k, v]) => (
          <div key={k as string} className="py-2.5"><dt className="text-[11px] text-stone">{k}</dt><dd className="font-serif text-[19px] text-ink">{v}</dd></div>
        ))}
      </dl>
      <p className="mt-1.5 text-right text-[11.5px] text-stone">About {eur(priceMonth)} this month before savings</p>
      <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[11px] text-stone" aria-hidden="true">{DAY_NAMES.map((d) => <span key={d}>{d}</span>)}</div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((d) => {
          const sl = slotsOn(d);
          const out = d.getMonth() !== M.m;
          const w = weekIdx(d);
          const isToday = w === 0 && dayOf(d) === TODAY_INDEX;
          const delivery = d.getDate() === Number(s.delivery.date.slice(-2)) && d.getMonth() === Number(s.delivery.date.slice(5, 7)) - 1;
          return (
            <button key={d.toISOString()} disabled={w < 0 || w >= weeks.length} onClick={() => openSheet({ kind: "planDay", week: w, day: dayOf(d) })}
              aria-label={`${d.toDateString()}: ${sl.length} meals`}
              className={`relative flex aspect-square flex-col items-center justify-start rounded-xl pt-1.5 text-[12.5px] transition hover:bg-offwhite ${out ? "text-stone/50" : "text-ink"} ${isToday ? "ring-1 ring-terra" : ""}`}>
              <span className={isToday ? "font-medium text-terra" : ""}>{d.getDate()}</span>
              <span className="mt-1 flex gap-0.5">
                {sl.map((x) => <span key={x.slot} className={`size-1.5 rounded-full ${x.slot === "breakfast" ? "bg-signal" : s.loved.includes(x.dishId!) ? "bg-terra" : "bg-olive"}`} />)}
              </span>
              {delivery && <Icon name="truck" className="absolute bottom-1 size-3 text-ink" />}
            </button>
          );
        })}
      </div>
      <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11.5px] text-stone">
        <span className="flex items-center gap-1"><span className="size-1.5 rounded-full bg-olive" /> Main</span>
        <span className="flex items-center gap-1"><span className="size-1.5 rounded-full bg-signal" /> Breakfast</span>
        <span className="flex items-center gap-1"><span className="size-1.5 rounded-full bg-terra" /> Loved</span>
        <span className="flex items-center gap-1"><Icon name="truck" className="size-3" /> Delivery</span>
      </p>
    </div>
  );
}

/** Future month: pausing or cancelling sits next to the plan, never hidden (Miro). */
export function AheadBanner() {
  const { openSheet } = useStore();
  return (
    <section className="rounded-[20px] border border-line bg-white p-4">
      <p className="text-[14px] font-medium text-ink">Planning ahead for November?</p>
      <p className="mt-1 text-[13px] text-stone">Eve fills it from your goal closer to the time. Away for part of it? Pause or skip, nothing is lost.</p>
      <div className="mt-3 flex gap-2">
        <Button size="sm" variant="outline" onClick={() => openSheet({ kind: "vacation" })}>Pause</Button>
        <Button size="sm" variant="ghost" onClick={() => openSheet({ kind: "manage" })}>Skip or cancel</Button>
      </div>
    </section>
  );
}

export function PlanDaySheet({ week, day, onClose }: { week: number; day: number; onClose: () => void }) {
  const { s } = useStore();
  const weeks = useProjected(s);
  const d = weeks[week][day];
  const wk: WeekKey | null = week === 0 ? "this" : week === 1 ? "next" : null;
  const slots = d.slots.filter((x) => x.dishId || (wk && isScheduled(s, x.slot, day)));
  return (
    <Sheet onClose={onClose} eyebrow={wk ? (wk === "this" ? "This week" : "Next order") : "Planned from your goal"} title={new Date(d.date).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}>
      {slots.length === 0 && <p className="text-[14px] text-stone">Nothing planned on this day.</p>}
      <div className="space-y-4">
        {slots.map((x) => x.dishId ? (
          wk ? <MealRow key={x.slot} week={wk} day={day} slot={x.slot} id={x.dishId} /> : (
            <div key={x.slot} className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(dish(x.dishId).img)} alt="" className="size-14 rounded-xl object-cover" />
              <div><p className="text-[11.5px] capitalize text-stone">{x.slot}</p><p className="text-[15px] font-medium text-ink">{dish(x.dishId).name}</p></div>
            </div>
          )
        ) : wk ? <AddSlot key={x.slot} week={wk} day={day} slot={x.slot} /> : null)}
      </div>
      {!wk && <p className="mt-5 rounded-2xl bg-white p-4 text-[13px] text-stone">Eve fills this week from your goal and your loves about a week before it ships. You can still change every meal then.</p>}
    </Sheet>
  );
}

function isScheduled(s: State, slot: SlotName, day: number) {
  return !!planSchedule(s)[slot]?.includes(day);
}

/** A dish's value for a focus chip, e.g. "12 g" fibre or "540 kcal". */
function chipValue(d: ReturnType<typeof dish>, key: string) {
  switch (key) {
    case "plants": return `${d.plants} plants`;
    case "kcal": return `${d.kcal} kcal`;
    case "carbs": return `${d.carbs} g`;
    case "fat": return `${d.fat} g`;
    case "fibre": return `${d.fibre} g`;
    case "iron": case "folate": return /dal|lentil|beetroot|bolognese/i.test(`${d.id} ${d.name}`) ? "lentil-rich" : "some";
    default: return `${d.protein} g`;
  }
}

/** Soft goal chip → drawer: target range, why, how the plan does it, "no tracking" (vision: gentle depth). */
export function ChipSheet({ chipKey, onClose }: { chipKey: string; onClose: () => void }) {
  const { s } = useStore();
  const g = goalInfo(s.goal);
  const c = g.chips.find((x) => x.key === chipKey) ?? g.chips[0];
  const mains = s.weeks.this.flatMap((d) => d.slots.filter((x) => x.dishId)).map((x) => dish(x.dishId!));
  const avg = (f: (d: ReturnType<typeof dish>) => number) => Math.round(mains.reduce((a, d) => a + f(d), 0) / Math.max(1, mains.length));
  const now: Record<string, string> = {
    plants: `${new Set(mains.map((d) => d.id)).size * 7} plants across this week's meals`,
    fibre: `${avg((d) => d.fibre)} g per meal on average`,
    protein: `${avg((d) => d.protein)} g per meal on average`,
    kcal: `${avg((d) => d.kcal)} kcal per meal on average`,
    carbs: `${avg((d) => d.carbs)} g carbs per meal on average`,
    fat: `${avg((d) => d.fat)} g fat per meal on average`,
    folate: "Lentils and greens in this week's meals",
    iron: "Lentils and greens in 3 of this week's meals",
  };
  return (
    <Sheet onClose={onClose} eyebrow={g.label} title={c.label}>
      <div className={`rounded-2xl p-4 ${goalBg(s.goal)}`}>
        <p className="text-[12px] text-stone">The direction</p>
        <p className="font-serif text-[22px] text-ink">{c.target}</p>
        <p className="mt-2 text-[13.5px] text-body">This week: {now[c.key]}</p>
      </div>
      <h3 className="mt-5 text-[15px] font-medium text-ink">Why it matters</h3>
      <p className="mt-1 text-[14.5px] leading-relaxed text-body">{c.why}</p>
      <h3 className="mt-4 text-[15px] font-medium text-ink">How your plan does it</h3>
      <p className="mt-1 text-[14.5px] leading-relaxed text-body">{c.how}</p>
      <p className={`mt-5 flex gap-2 rounded-2xl p-4 text-[13.5px] text-ink ${goalBg(s.goal)}`}><Icon name="check" className="mt-0.5 size-4 shrink-0" strokeWidth={2.2} /> Nothing to track or log. The plan already leans this way.</p>
    </Sheet>
  );
}
