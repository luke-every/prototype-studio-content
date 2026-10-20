"use client";

import Link from "next/link";
import { useState } from "react";
import { asset, DAY_NAMES, dish, goalInfo, TODAY_INDEX, goalQuote, goalBg } from "@/lib/data";
import { hasGoal, isEaten, useStore } from "@/lib/store";
import { EveFace } from "./eve-mark";
import { useMealActions } from "./meal";
import { usePlanHref } from "./top";
import { Button, Icon, Sheet } from "./ui";

/**
 * Proactive moments (Miro F5/F6, Notion "Eve moments"): the weekly check-in, pre-delivery, first box done,
 * seven days away, return after a pause and the 120-day goal review. Driven by the prototype bar's
 * Customer and Moment controls so every moment can be shown in every variant.
 */

const SCORE_LABELS = ["Not at all", "Not really", "So-so", "Fine", "Good", "Loved it"];

/** Eve's reply, five variants by satisfaction (0–1, 2, 3, 4, 5). */
function eveReply(score: number, goal: string) {
  if (score <= 1) return "Thanks for being honest. That week didn't land, and that's on the plan, not on you. Here are three things Eve can change right now.";
  if (score === 2) return "Okay, a bit flat. Let's make next week easier to like. Pick one of these and Eve does the rest.";
  if (score === 3) return `A steady week. Steady is how ${goal.toLowerCase()} works. Small tweak below if you want one.`;
  if (score === 4) return "Good week. Your plan stays the same, with one or two new things to keep it interesting.";
  return "Loved it. Eve keeps what worked and brings your favourites back sooner.";
}

export function CheckInFlow({ onClose }: { onClose: () => void }) {
  const { s, p, set, toast, track, openSheet, openEve } = useStore();
  const g = goalInfo(s.goal);
  const a = useMealActions();
  const [step, setStep] = useState<"intro" | "score" | "meals" | "reply">("intro");
  const [score, setScore] = useState<number | null>(null);
  const meals = s.weeks.this.flatMap((d, i) => (i <= TODAY_INDEX ? d.slots.filter((x) => x.dishId).map((x) => ({ i, slot: x.slot, id: x.dishId! })) : []));
  const ate = meals.filter((m) => isEaten(s, m.i, m.slot)).length;
  const loved = meals.filter((m) => s.loved.includes(m.id)).length;
  const notFor = meals.filter((m) => s.disliked.includes(m.id));

  const later = () => { set((d) => { d.checkIn = "later"; d.sheet = null; }); toast("No problem. Eve asks again tomorrow, then lets it go."); };
  const finish = () => {
    set((d) => { d.checkIn = "done"; d.checkinScore = score; d.checkinWeek += 1; d.moment = d.moment === "checkin" ? "none" : d.moment; });
    track(`checkin:${score}`);
    setStep("reply");
  };

  if (step === "intro") return (
    <Sheet onClose={onClose} eyebrow={`Week ${s.checkinWeek} with Eve`} title={hasGoal(s) ? goalQuote(s.goal, s.checkinWeek) : "Small steps count."}>
      <div className="flex items-start gap-3 rounded-2xl bg-white p-4">
        <EveFace className="size-10 shrink-0" />
        <p className="text-[14px] leading-relaxed text-body">{hasGoal(s) && g.science ? g.science : "Ready-made meals on busy days take one decision off your plate. That's the whole idea."}</p>
      </div>
      <p className="mt-4 text-[13.5px] text-stone">About a minute: one question, then a quick look at your meals. It tunes next week.</p>
      <div className="mt-5 grid grid-cols-2 gap-2">
        <Button variant="gray" onClick={later}>Later</Button>
        <Button onClick={() => setStep("score")}>Do my check-in</Button>
      </div>
    </Sheet>
  );

  if (step === "score") return (
    <Sheet onClose={onClose} eyebrow="Check-in · 1 of 2" title="How satisfied were you with your meals this week?">
      <div className="grid grid-cols-6 gap-1.5" role="radiogroup" aria-label="Satisfaction from 0 to 5">
        {SCORE_LABELS.map((l, n) => (
          <button key={n} role="radio" aria-checked={score === n} aria-label={`${n}: ${l}`} onClick={() => setScore(n)}
            className={`aspect-square rounded-2xl border text-[20px] font-medium transition ${score === n ? "border-ink bg-ink text-paper" : "border-line bg-white text-ink hover:border-ink/40"}`}>{n}</button>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[12px] text-stone"><span>Not at all</span><span>{score !== null ? SCORE_LABELS[score] : ""}</span><span>Loved it</span></div>
      <Button className="mt-6 w-full" disabled={score === null} onClick={() => setStep("meals")}>Next</Button>
    </Sheet>
  );

  if (step === "meals") return (
    <Sheet onClose={onClose} eyebrow="Check-in · 2 of 2" title="Your meals so far">
      <p className="text-[13.5px] text-stone">Everything counts as eaten unless you say otherwise. No judgement, it just tunes next week.</p>
      <p className="mt-3 rounded-full bg-white px-4 py-2 text-center text-[13px] text-body" aria-live="polite">
        <b className="font-medium text-ink">{ate}</b> eaten · <b className="font-medium text-ink">{meals.length - ate}</b> skipped · <b className="font-medium text-ink">{loved}</b> loved
      </p>
      <div className="mt-3 space-y-2.5">
        {meals.map((m) => {
          const d = dish(m.id);
          const eaten = isEaten(s, m.i, m.slot);
          return (
            <div key={`${m.i}${m.slot}`} className="rounded-2xl border border-line bg-white p-3">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset(d.img)} alt="" className="size-12 rounded-xl object-cover" />
                <div className="min-w-0 flex-1"><p className="text-[11.5px] text-stone">{DAY_NAMES[m.i]} · {m.slot}</p><p className="truncate text-[14.5px] font-medium text-ink">{d.name}</p></div>
              </div>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                <Seg on={eaten} onClick={() => !eaten && a.markEaten(m.i, m.slot)}>Ate it</Seg>
                <Seg on={!eaten} onClick={() => eaten && a.didNotEat(m.i, m.slot)}>Skipped</Seg>
                <span className="w-2" />
                <Seg on={s.loved.includes(m.id)} tone="terra" onClick={() => !s.loved.includes(m.id) && set((x) => { x.loved.push(m.id); x.disliked = x.disliked.filter((y) => y !== m.id); })}>Loved it</Seg>
                <Seg on={s.disliked.includes(m.id)} onClick={() => !s.disliked.includes(m.id) && set((x) => { x.disliked.push(m.id); x.loved = x.loved.filter((y) => y !== m.id); })}>Not for me</Seg>
              </div>
            </div>
          );
        })}
      </div>
      <Button className="mt-5 w-full" onClick={finish}>Finish check-in</Button>
    </Sheet>
  );

  const sc = score ?? 3;
  return (
    <Sheet onClose={onClose} eyebrow="Thanks" title="Here's what Eve does next">
      <div className="flex items-start gap-3 rounded-2xl bg-white p-4">
        <EveFace className="size-10 shrink-0" />
        <p className="text-[14.5px] leading-relaxed text-body">{eveReply(sc, p.goalOrNull ? g.label : "a good routine")}</p>
      </div>
      <div className="mt-3 space-y-2.5">
        {sc <= 2 ? (
          [
            { t: "Plan one meal fewer a week", h: "Less in the freezer, no pressure", run: () => { set((d) => { d.weeklyTarget = Math.max(2, d.weeklyTarget - 1); d.sheet = null; }); toast("Done. One fewer from next week."); } },
            { t: "Try a different goal", h: "See what changes before you decide", run: () => openSheet({ kind: "goals" }) },
            { t: "Tell Eve what didn't work", h: "Taste, portions, timing, anything", run: () => { onClose(); openEve("situation"); } },
          ].map((x) => (
            <button key={x.t} onClick={x.run} className="flex w-full items-center justify-between rounded-2xl border border-line bg-white px-4 py-3 text-left">
              <span><span className="block text-[14.5px] font-medium text-ink">{x.t}</span><span className="text-[12.5px] text-stone">{x.h}</span></span>
              <Icon name="chevron" className="size-4 text-stone" />
            </button>
          ))
        ) : (
          <>
            {notFor[0] && (
              <div className="rounded-2xl bg-plum-bg p-4">
                <p className="text-[14px] text-ink"><b className="font-medium">{dish(notFor[0].id).name}</b> was not for you. Want a swap for next week?</p>
                <Button size="sm" variant="light" className="mt-3" onClick={() => { const i = s.weeks.next.findIndex((d) => d.slots.some((x) => x.dishId === notFor[0].id)); const sl = i >= 0 ? s.weeks.next[i].slots.find((x) => x.dishId === notFor[0].id)!.slot : "dinner"; openSheet({ kind: "swap", week: "next", day: Math.max(0, i), slot: sl }); }}>Find a swap</Button>
              </div>
            )}
            {loved > 0 && <p className="rounded-2xl bg-terra-bg/70 p-4 text-[14px] text-ink">Love noted on {loved} {loved === 1 ? "meal" : "meals"}. They&apos;ll come back.</p>}
            <p className={`rounded-2xl p-4 text-[14px] text-ink ${p.goalOrNull ? goalBg(p.goal) : "bg-offwhite"}`}>{p.goalOrNull ? `Next week keeps your ${p.goalLabel.toLowerCase()} focus. Nothing else to do.` : "Next week learns from this. Nothing else to do."}</p>
          </>
        )}
      </div>
      <Button variant="gray" className="mt-5 w-full" onClick={onClose}>Done</Button>
    </Sheet>
  );
}

function Seg({ on, tone, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement> & { on: boolean; tone?: "terra" }) {
  return <button {...rest} aria-pressed={on} className={`rounded-full px-3 py-1.5 text-[12.5px] font-medium transition ${on ? (tone === "terra" ? "bg-terra text-white" : "bg-ink text-paper") : "border border-line2 text-ink"}`} />;
}

/** First-run intro: three cards, once (heuristic 10). */
export function IntroSheet({ onClose }: { onClose: () => void }) {
  const { s, set } = useStore();
  const [i, setI] = useState(0);
  const cards = [
    hasGoal(s)
      ? { t: "Your plan comes from your goal", b: `Eve fills your week from ${goalInfo(s.goal).label.toLowerCase()} and the meals you love. Your next box follows the plan.` }
      : { t: "Start with a plan, add a goal", b: "Eve made you a starter plan. Answer her 10 questions and she shapes it around your goal. Your next box follows the plan." },
    { t: "Eaten is assumed", b: "No logging. Meals count on their day. Didn't get to one? Tap it once and it stays in your freezer." },
    { t: "Once a week, a one-minute check-in", b: "How did it feel, what did you love. Eve tunes next week from that, and never counts missed meals against you." },
  ];
  const done = () => { set((d) => { d.introSeen = true; d.sheet = null; }); };
  return (
    <Sheet onClose={done} eyebrow={`${i + 1} of 3`} title={cards[i].t}>
      <p className="text-[15px] leading-relaxed text-body">{cards[i].b}</p>
      <div className="mt-5 flex justify-center gap-1.5" aria-hidden="true">{cards.map((_, k) => <span key={k} className={`h-1.5 rounded-full transition-all ${k === i ? "w-6 bg-ink" : "w-1.5 bg-linen"}`} />)}</div>
      <div className="mt-5 grid grid-cols-2 gap-2">
        <Button variant="gray" onClick={done}>Skip</Button>
        <Button onClick={() => (i < 2 ? setI(i + 1) : (done(), onClose()))}>{i < 2 ? "Next" : "Got it"}</Button>
      </div>
    </Sheet>
  );
}

/** First box done: full-screen goal message (Miro F6). */
export function FirstBoxSheet({ onClose }: { onClose: () => void }) {
  const { s, set } = useStore();
  const g = goalInfo(s.goal);
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-brown px-6 text-center text-paper animate-fade-in" role="dialog" aria-modal="true" aria-label="First box done">
      <EveFace className="size-16" />
      <p className="eyebrow mt-6 !text-paper/70">First box, done</p>
      <h2 className="mt-3 max-w-[18ch] font-serif text-[36px] leading-[1.1]">{hasGoal(s) ? goalQuote(s.goal, 0) : "One week of good food, sorted."}</h2>
      <p className="mt-4 max-w-[46ch] text-[15.5px] leading-relaxed text-paper/85">{hasGoal(s) ? g.message || g.hint : "Next step: tell Eve what you want from your food, and your plan follows it."}</p>
      <button onClick={() => { set((d) => { d.moment = "none"; }); onClose(); }} className="mt-8 rounded-full bg-white px-7 py-3 text-[14px] font-medium text-ink">See my next week</button>
    </div>
  );
}

/** Pre-delivery prompt (Miro): max three suggestions — swap, add, keep — each with its reason. */
export type PreDeliveryItem = { k: string; icon: "swap" | "plus" | "heart"; t: string; why: string; cta: string; run: () => void };

/** Pre-delivery suggestions (max 3). Empty unless it's the pre-delivery moment (or forced). */
export function usePreDeliveryItems(force = false): PreDeliveryItem[] {
  const { s, set, toast, track, openSheet } = useStore();
  if ((!force && s.moment !== "predelivery") || s.delivery.status !== "active") return [];
  const next = s.weeks.next.flatMap((d, i) => d.slots.filter((x) => x.dishId).map((x) => ({ i, slot: x.slot, id: x.dishId! })));
  const skipped = Object.keys(s.notEaten).map((k) => s.weeks.this[Number(k.split(":")[0])].slots.find((x) => x.slot === k.split(":")[1])?.dishId).filter(Boolean) as string[];
  const swap = next.find((m) => s.disliked.includes(m.id) || skipped.includes(m.id)) ?? next[next.length - 1];
  const add = s.loved.find((id) => !next.some((m) => m.id === id) && !s.extras[id]);
  const keep = next.find((m) => s.loved.includes(m.id));
  const items = [
    swap && !s.dismissed.includes(`pd:swap:${swap.id}`) && { k: `pd:swap:${swap.id}`, icon: "swap" as const, t: `Swap ${dish(swap.id).name}`, why: s.disliked.includes(swap.id) ? "You said it's not for you." : skipped.includes(swap.id) ? "It stayed in the freezer this week." : "Something new for variety.", cta: "Swap", run: () => openSheet({ kind: "swap", week: "next", day: swap.i, slot: swap.slot }) },
    add && !s.dismissed.includes(`pd:add:${add}`) && { k: `pd:add:${add}`, icon: "plus" as const, t: `Add ${dish(add).name}`, why: "You loved it, and it's not in this box.", cta: "Add", run: () => { set((d) => { d.extras[add] = 1; d.dismissed.push(`pd:add:${add}`); }); track("PREDELIVERY_add"); toast(`${dish(add).name} added.`); } },
    keep && !s.dismissed.includes(`pd:keep:${keep.id}`) && { k: `pd:keep:${keep.id}`, icon: "heart" as const, t: `Keep ${dish(keep.id).name}`, why: "A favourite. It's already in.", cta: "Keep", run: () => set((d) => { d.dismissed.push(`pd:keep:${keep.id}`); }) },
  ].filter(Boolean).slice(0, 3) as PreDeliveryItem[];
  return items;
}

export function PreDeliveryCard({ force = false }: { force?: boolean }) {
  const { s } = useStore();
  const items = usePreDeliveryItems(force);
  if (!force && s.moment !== "predelivery") return null;
  if (s.delivery.status !== "active") return null;
  return (
    <section aria-label="Before your box ships" className="rounded-[20px] bg-white p-4 sm:p-5">
      <div className="flex items-center gap-2.5"><EveFace className="size-8" /><div><p className="text-[15px] font-medium text-ink">Before your box ships</p><p className="text-[12.5px] text-stone">Edit until tonight 23:59 · {s.delivery.label}</p></div></div>
      {items.length === 0 ? <p className="mt-3 text-[13.5px] text-stone">All set. Your box matches your plan.</p> : (
        <ul className="mt-3 divide-y divide-line">
          {items.map((x) => (
            <li key={x.k} className="flex items-center gap-3 py-2.5">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-offwhite"><Icon name={x.icon} className="size-4" /></span>
              <span className="min-w-0 flex-1"><span className="block text-[14px] font-medium text-ink">{x.t}</span><span className="text-[12.5px] text-stone">{x.why}</span></span>
              <Button size="sm" variant="outline" onClick={x.run}>{x.cta}</Button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/** True when a proactive moment card would show (so Variant A's single Eve slot can fall back to the next prompt). */
export function hasMoment(s: ReturnType<typeof useStore>["s"]) {
  return s.customer === "paused45" || s.customer === "paused120" || s.moment === "away7" || s.moment === "firstbox"
    || (s.moment === "checkin" && s.checkIn !== "done") || s.moment === "predelivery";
}

/**
 * One slot for whichever moment applies, in priority order. Home shows it compact with a link into My Plan;
 * My Plan shows it in full.
 */
export function MomentCard({ place }: { place: "home" | "plan" }) {
  const { s, set, toast, openSheet } = useStore();
  const planHref = usePlanHref();
  const g = goalInfo(s.goal);
  const shell = "flex flex-wrap items-center gap-x-4 gap-y-3 rounded-[20px] p-4 sm:p-5";
  const restart = () => { set((d) => { d.customer = "active"; d.delivery.status = "active"; d.delivery.vacationUntil = undefined; }); toast("Welcome back. Your plan is on again."); };

  if (s.customer === "paused45") return (
    <section className={`${shell} bg-moment`}>
      <EveFace className="size-10 shrink-0" />
      <p className="min-w-0 flex-1 text-[14.5px] leading-relaxed text-ink">Welcome back. Your plan is where you left it. No explanation needed — just pick it up.</p>
      <Button size="sm" onClick={restart}>Pick it up</Button>
    </section>
  );
  if (s.customer === "paused120") return (
    <section className={`${shell} bg-moment`}>
      <EveFace className="size-10 shrink-0" />
      <div className="min-w-0 flex-1"><p className="text-[14.5px] font-medium text-ink">It&apos;s been a while. Still going for {g.label.toLowerCase()}?</p><p className="text-[13px] text-stone">A quick look before your plan restarts. Your loves and history are all still here.</p></div>
      <div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => openSheet({ kind: "goals" })}>Change goal</Button><Button size="sm" onClick={restart}>Yes, restart</Button></div>
    </section>
  );
  // New customers without a goal get one way in: the "No goal set yet" line (Home) and the plan header (My Plan).
  if (s.moment === "away7") return (
    <section className={`${shell} bg-moment`}>
      <EveFace className="size-10 shrink-0" />
      <p className="min-w-0 flex-1 text-[14.5px] leading-relaxed text-ink">Life gets busy. Your meals are still in the freezer. No catch-up required — just pick up where you left off.</p>
      <Button size="sm" variant="outline" onClick={() => set((d) => { d.moment = "none"; })}>Pick up today</Button>
    </section>
  );
  if (s.moment === "firstbox") return (
    <section className={`${shell} bg-moment`}>
      <EveFace className="size-10 shrink-0" />
      <p className="min-w-0 flex-1 text-[14.5px] font-medium text-ink">Your first box is done. That&apos;s the hardest week.</p>
      <Button size="sm" onClick={() => openSheet({ kind: "firstBox" })}>See what&apos;s next</Button>
    </section>
  );
  if (s.moment === "checkin" && s.checkIn !== "done") return (
    <section className={`${shell} bg-moment`}>
      <div className="min-w-0 flex-1">
        <p className="eyebrow !text-[10.5px]">Week {s.checkinWeek} · check-in</p>
        <p className="mt-1 font-serif text-[21px] leading-tight text-ink">{hasGoal(s) ? goalQuote(s.goal, s.checkinWeek) : "How was your first week?"}</p>
      </div>
      <div className="flex gap-2">
        <Button size="sm" variant="ghost" onClick={() => { set((d) => { d.checkIn = "later"; d.moment = "none"; }); toast("Eve asks again tomorrow."); }}>Later</Button>
        <Button size="sm" onClick={() => openSheet({ kind: "checkinFlow" })}>Do my check-in</Button>
      </div>
    </section>
  );
  if (s.moment === "predelivery" && place === "home") return (
    <section className={`${shell} bg-moment`}>
      <EveFace className="size-10 shrink-0" />
      <div className="min-w-0 flex-1"><p className="text-[14.5px] font-medium text-ink">Your box ships {s.delivery.label}</p><p className="text-[13px] text-stone">Eve has a few suggestions before the cut-off tonight.</p></div>
      <Link href={`${planHref}#plan`} className="rounded-full bg-ink px-3.5 py-2 text-[13px] font-medium text-paper">Review</Link>
    </section>
  );
  return null;
}
