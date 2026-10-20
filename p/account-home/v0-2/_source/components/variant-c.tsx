"use client";

import { createContext, useContext, useState } from "react";
import Link from "next/link";
import { asset, dish, fmtDay, NOW, SlotName, TODAY_INDEX, reasonFor } from "@/lib/data";
import { boxPricing, eur, isNewCustomer, useStore } from "@/lib/store";
import { CHIP_LABELS, plantCount } from "./plan";
import { usePlanHref, useGreeting } from "./top";
import { MomentCard } from "./moments";
import { EveFace } from "./eve-mark";
import { GoalsCard } from "./goals";
import { FreezerCard } from "./planhub";
import { Button, Card, Icon } from "./ui";

/**
 * Variant C: "Simplified".
 * Same 12 features, fewer decisions per screen. The home answers five questions, in order:
 *   1. What do I eat today?        (Today: one meal, one reason, made it / swap / why)
 *   2. Anything I should do?       (For you now: one nudge at a time, never a stack)
 *   3. What's coming?              (Next delivery: one card, one "Manage" entry for every change)
 *   4. What's the rest of my week? (This week: a plain list, depth one tap away)
 *   5. How am I doing?             (Your progress: rhythm, plants, Wrapped, help)
 * Eve is one search-or-ask bar at the top plus the floating button.
 */
export function HomeSimple() {
  const { s } = useStore();
  const isNew = isNewCustomer(s);
  const today = <TodayCard />;
  const nudge = <ForYouNow />;
  const delivery = <NextDelivery />;
  const week = <WeekList />;
  const progress = <Progress />;
  return (
    <main className="mx-auto max-w-[1120px] px-4 pb-8 sm:px-6">
      <Hello />
      {isNew ? <div className="mt-5"><GoalsCard compact /></div> : <div className="mt-5 grid gap-3 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]"><GoalsCard compact /><FreezerCard compact /></div>}
      <EveBar />
      {/* New customer: only the next delivery, no meal plan, rhythm or progress yet */}
      {isNew ? <div className="mt-6 max-w-[640px]">{delivery}</div> : <>
      {/* Mobile: one column, in question order */}
      <div className="mt-6 space-y-6 lg:hidden">{today}{nudge}{delivery}{week}{progress}</div>
      {/* Desktop: eating on the left, logistics and progress on the right */}
      <div className="mt-6 hidden grid-cols-[minmax(0,1fr)_360px] items-start gap-8 lg:grid">
        <div className="min-w-0 space-y-6">{today}{week}</div>
        <div className="space-y-6">{nudge}{delivery}{progress}</div>
      </div>
      </>}
    </main>
  );
}

/** Inside the shared section frame (pages.tsx) the frame carries the title, so C's own titles step aside. */
export const CBare = createContext(false);

function SectionTitle({ n, children, action }: { n: number; children: React.ReactNode; action?: React.ReactNode }) {
  if (useContext(CBare)) return null;
  return (
    <div className="mb-3 flex items-baseline justify-between gap-3">
      <h2 className="flex items-baseline gap-2 text-[17px] font-medium text-ink">
        <span className="sr-only">{n}.</span>{children}
      </h2>
      {action}
    </div>
  );
}

/** Greeting, derived from the customer state, plus the moment slot. */
function Hello() {
  const { p } = useStore();
  const g = useGreeting();
  return (
    <section className="pt-6 sm:pt-8">
      <h1 className="font-serif text-[32px] leading-tight text-ink sm:text-[38px]">Hi {p.name}.</h1>
      <p className="mt-1 text-[15px] text-stone">{g.title} {g.sub}</p>
      <div className="mt-4 empty:hidden"><MomentCard place="home" /></div>
    </section>
  );
}

/** One field for search and questions. Chips only appear once you focus, so the resting screen stays quiet. */
export function EveBar() {
  const { openEve } = useStore();
  const [q, setQ] = useState("");
  const [focus, setFocus] = useState(false);
  return (
    <div className="mt-5" onFocus={() => setFocus(true)} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setFocus(false); }}>
      <form onSubmit={(e) => { e.preventDefault(); if (q.trim()) { openEve(q.trim()); setQ(""); } }}
        className="flex items-center gap-3 rounded-full border border-line2 bg-white py-1.5 pl-1.5 pr-1.5 shadow-e1 focus-within:border-ink/50">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-olive-bg text-ink"><EveFace className="size-8" /></span>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ask Eve, or search meals" aria-label="Ask Eve, or search meals"
          className="min-w-0 flex-1 bg-transparent py-2 text-[15px] text-ink outline-none placeholder:text-stone/70" />
        <button type="submit" disabled={!q.trim()} aria-label="Send" className="grid size-10 place-items-center rounded-full bg-ink text-paper disabled:opacity-25"><Icon name="send" className="size-4" /></button>
      </form>
      {focus && (
        <div className="no-scrollbar -mx-4 mt-2 flex gap-2 overflow-x-auto px-4 animate-fade-in sm:mx-0 sm:flex-wrap sm:px-0">
          {CHIP_LABELS.map((c) => (
            <button key={c} onClick={() => openEve(c)} className="whitespace-nowrap rounded-full border border-line2 bg-white px-3.5 py-2 text-[13px] font-medium text-ink">{c}</button>
          ))}
        </div>
      )}
    </div>
  );
}

const SLOT: Record<SlotName, string> = { breakfast: "Breakfast", lunch: "Lunch", dinner: "Dinner" };

/** 1. Today: one meal, big, with its reason and the three actions that matter. */
export function TodayCard() {
  const { s, p, set, toast, openSheet, track } = useStore();
  const day = s.weeks.this[TODAY_INDEX];
  const meals = day.slots.filter((x) => x.dishId);
  const main = meals.find((x) => !s.made[`${TODAY_INDEX}:${x.slot}`]) ?? meals[0];

  if (!main) {
    const tomorrow = s.weeks.this[TODAY_INDEX + 1].slots.find((x) => x.dishId);
    return (
      <section>
        <SectionTitle n={1}>Today</SectionTitle>
        <Card className="p-5">
          <p className="text-[15px] text-ink">Nothing from Every today, you&apos;re cooking.</p>
          {tomorrow && <p className="mt-1 text-[14px] text-stone">Tomorrow: {dish(tomorrow.dishId!).name}</p>}
        </Card>
      </section>
    );
  }
  const d = dish(main.dishId!);
  const key = `${TODAY_INDEX}:${main.slot}`;
  const made = !!s.made[key];
  const others = meals.filter((x) => x !== main);

  return (
    <section>
      <SectionTitle n={1}>Today · {fmtDay(day.date, { weekday: "long", day: "numeric", month: "long" })}</SectionTitle>
      <Card className="overflow-hidden">
        <button onClick={() => openSheet({ kind: "why", week: "this", day: TODAY_INDEX, slot: main.slot })} className="block w-full" aria-label={`Why ${d.name}?`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset(d.img)} alt="" className="h-52 w-full object-cover sm:h-64" />
        </button>
        <div className="p-5">
          <span className="eyebrow">{SLOT[main.slot]} · {d.minutes ? `${d.minutes} min` : "ready to eat"}</span>
          <h3 className="mt-1 font-serif text-[28px] leading-tight text-ink">{d.name}</h3>
          <p className="mt-1.5 text-[15px] leading-relaxed text-body">{reasonFor(d, p.goalOrNull)}</p>
          <div className="mt-5 grid grid-cols-3 gap-2">
            <Button size="sm" variant={made ? "dark" : "outline"} aria-pressed={made} onClick={() => {
              set((x) => { if (x.made[key]) delete x.made[key]; else x.made[key] = true; });
              track(`fake_door:i_made_this:${d.id}`);
              if (!made) toast("Nice. Logged with one tap, no counting.");
            }}><Icon name="check" className="size-4" strokeWidth={2.2} /> {made ? "Eaten" : "Made it"}</Button>
            <Button size="sm" variant="gray" onClick={() => openSheet({ kind: "swap", week: "this", day: TODAY_INDEX, slot: main.slot })}><Icon name="swap" className="size-4" /> Swap</Button>
            <Button size="sm" variant="gray" onClick={() => openSheet({ kind: "why", week: "this", day: TODAY_INDEX, slot: main.slot })}>Why this?</Button>
          </div>
          {others.length > 0 && (
            <p className="mt-4 border-t border-line pt-3 text-[13.5px] text-stone">
              Also today: {others.map((x) => `${SLOT[x.slot]} · ${dish(x.dishId!).name}`).join(", ")}
            </p>
          )}
        </div>
      </Card>
    </section>
  );
}

/** 2. For you now: the single most relevant nudge. One at a time; "Not now" never nags again today. */
function ForYouNow() {
  const { s, set, toast, openSheet } = useStore();
  const [skipped, setSkipped] = useState<string[]>([]);
  const tomorrow = s.weeks.this[TODAY_INDEX + 1].slots.find((x) => x.dishId && x.slot !== "breakfast");
  const queue = [
    tomorrow && !s.eveningDone && {
      id: "fridge", icon: "fridge" as const, tone: "bg-sky-bg",
      text: <>Tomorrow&apos;s {tomorrow.slot} is <b className="font-medium">{dish(tomorrow.dishId!).name}</b>. Move it to the fridge tonight?</>,
      cta: "Done", run: () => { set((x) => { x.eveningDone = true; }); toast("Done. Tomorrow is sorted."); },
    },
    s.checkIn !== "done" && {
      id: "checkin", icon: "heart" as const, tone: "bg-plum-bg",
      text: <>How was last week? Your check-in takes about a minute.</>,
      cta: "Check in", run: () => openSheet({ kind: "checkin" }),
    },
    {
      id: "wrapped", icon: "spark" as const, tone: "bg-olive-bg",
      text: <>Your September is ready. See your month in plants and time saved.</>,
      cta: "See it", run: () => openSheet({ kind: "wrapped" }),
    },
  ].filter(Boolean).filter((x) => x && !skipped.includes(x.id)) as { id: string; icon: "fridge" | "heart" | "spark"; tone: string; text: React.ReactNode; cta: string; run: () => void }[];
  const item = queue[0];
  if (!item) return null;
  return (
    <section>
      <SectionTitle n={2} action={queue.length > 1 ? <span className="text-[12.5px] text-stone">1 of {queue.length}</span> : undefined}>For you now</SectionTitle>
      <div key={item.id} className={`flex items-center gap-3 rounded-[20px] p-4 animate-fade-in ${item.tone}`}>
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-ink">
          {item.icon === "spark" ? <EveFace className="size-8" /> : <Icon name={item.icon} />}
        </span>
        <p className="min-w-0 flex-1 text-[14px] leading-snug text-ink">{item.text}</p>
      </div>
      <div className="mt-2 flex gap-2">
        <Button size="sm" className="flex-1" onClick={item.run}>{item.cta}</Button>
        <Button size="sm" variant="gray" className="flex-1" onClick={() => setSkipped((x) => [...x, item.id])}>Not now</Button>
      </div>
    </section>
  );
}

/** 3. Next delivery: one card, one "Manage" entry for every change (move, change meals, skip, away, pause/cancel). */
export function NextDelivery() {
  const { s, set, toast, openSheet } = useStore();
  const planHref = usePlanHref();
  const { count, total } = boxPricing(s);
  const d = s.delivery;
  const hours = Math.floor((new Date(2026, 8, 29, 23, 59).getTime() - NOW.getTime()) / 3.6e6);
  let title = d.label, line = `${d.window} · change until 23:59 tonight`;
  if (d.status === "today") { title = "Arrives today"; line = `Estimated ${d.window}`; }
  if (d.status === "skipped") { title = "Box skipped"; line = "Your plan and rhythm are saved."; }
  if (d.status === "vacation") { title = `Away until ${d.vacationUntil}`; line = "Eve restarts your plan when you're back."; }
  if (d.status === "cancelled") { title = "Subscription cancelled"; line = "Your favourites and allergens stay saved."; }
  const paused = d.status === "skipped" || d.status === "vacation" || d.status === "cancelled";
  return (
    <section>
      <SectionTitle n={3}>Next delivery</SectionTitle>
      <Card className="p-5">
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brown text-paper"><Icon name="truck" className="size-5" /></span>
          <div className="min-w-0 flex-1">
            <p className="font-serif text-[22px] leading-tight text-ink">{title}</p>
            <p className="mt-0.5 text-[13.5px] text-stone">{line}</p>
            {!paused && d.status !== "today" && <p className="mt-2 text-[13.5px] text-ink">{count} items · {eur(total)} · <span className="text-terra">{hours} h left to edit</span></p>}
            {d.status === "today" && <p className="mt-2 text-[13.5px] text-ink">{count} items on the way</p>}
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {paused ? (
            <Button size="sm" variant="outline" onClick={() => { set((x) => { x.delivery = { date: "2026-10-01", label: "Thu 1 Oct", window: "08:00–12:00", status: "active", cadence: x.delivery.cadence }; }); toast("Your box is back on."); }}>Restart</Button>
          ) : d.status === "today" ? (
            <Button size="sm" variant="dark" onClick={() => toast("Prototype: this would open the courier's tracking page.")}>Track</Button>
          ) : (
            <Button size="sm" variant="dark" onClick={() => openSheet({ kind: "manage" })}>Manage</Button>
          )}
          <Link href={planHref} className="inline-flex items-center justify-center rounded-full bg-offwhite px-3.5 py-2 text-[13px] font-medium text-ink">See the box</Link>
        </div>
      </Card>
    </section>
  );
}

/** 4. This week: a plain list by day. Tap a meal for the why, swap and love/dislike. Exclusions shown once, quietly. */
export function WeekList() {
  const { s, p, openSheet } = useStore();
  const planHref = usePlanHref();
  const plants = plantCount(s);
  return (
    <section id="c-week" className="scroll-mt-20">
      <SectionTitle n={4} action={<Link href={planHref} className="text-[13px] text-ink underline underline-offset-2">Next week&apos;s box</Link>}>This week</SectionTitle>
      <Card className="divide-y divide-line">
        {s.weeks.this.map((day, i) => {
          const meals = day.slots.filter((x) => x.dishId);
          if (!meals.length) return null;
          const past = i < TODAY_INDEX;
          return (
            <div key={day.date} className={`flex items-center gap-3 px-4 py-3 ${i === TODAY_INDEX ? "bg-offwhite/60" : ""}`}>
              <span className={`w-12 shrink-0 text-[13px] ${past ? "text-stone" : "font-medium text-ink"}`}>{i === TODAY_INDEX ? "Today" : fmtDay(day.date, { weekday: "short" })}</span>
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                {meals.map((x) => {
                  const m = dish(x.dishId!);
                  const made = s.made[`${i}:${x.slot}`];
                  return (
                    <button key={x.slot} onClick={() => openSheet({ kind: "why", week: "this", day: i, slot: x.slot })} className="flex min-w-0 items-center gap-2.5 text-left">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={asset(m.img)} alt="" className="size-9 shrink-0 rounded-lg object-cover" />
                      <span className={`truncate text-[14px] ${past && !made ? "text-stone" : "text-ink"}`}>{m.name}</span>
                      {made && <Icon name="check" className="size-4 shrink-0 text-olive" strokeWidth={2.4} />}
                    </button>
                  );
                })}
              </div>
              <Icon name="chevron" className="size-4 shrink-0 text-stone" />
            </div>
          );
        })}
      </Card>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[13px] text-stone">
        {p.goalOrNull && <span className="flex items-center gap-1.5"><Icon name="leaf" className="size-4 text-olive" /> {plants} of {s.plantTarget} plants this week</span>}
        <button onClick={() => openSheet({ kind: "preferences" })} className="underline decoration-line2 underline-offset-4 hover:text-ink">
          {s.exclude.length ? `Leaving out: ${s.exclude.join(", ")}` : "Nothing left out"} · Edit
        </button>
      </div>
    </section>
  );
}

/** 5. Your progress: rhythm (never a streak), plants, Wrapped, and where to get help. */
export function Progress() {
  const { s, p, openSheet } = useStore();
  const made = Math.min(14, p.rhythmMade + Object.keys(s.made).filter((k) => !k.startsWith("0:")).length);
  return (
    <section>
      <SectionTitle n={5}>Your progress</SectionTitle>
      <Card className="p-5">
        <p className="font-serif text-[26px] leading-none text-ink">{made} of your last 14</p>
        <p className="mt-1.5 text-[13.5px] text-stone">Planned meals you actually ate. Missed ones don&apos;t count against you.</p>
        <div className="mt-3 flex gap-1" aria-hidden="true">
          {Array.from({ length: 14 }).map((_, i) => <span key={i} className={`h-2 flex-1 rounded-full ${i < made ? "bg-olive" : "bg-cream"}`} />)}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 text-center">
          <div className="rounded-2xl bg-offwhite py-3"><p className="font-serif text-[22px] text-ink">{41 + plantCount(s)}</p><p className="text-[12px] text-stone">plants this month</p></div>
          <div className="rounded-2xl bg-offwhite py-3"><p className="font-serif text-[22px] text-ink">11 h</p><p className="text-[12px] text-stone">not spent cooking</p></div>
        </div>
        <div className="mt-4 flex flex-col gap-2 border-t border-line pt-3 text-[13.5px]">
          <button onClick={() => openSheet({ kind: "vacation" })} className="flex items-center justify-between text-left text-ink">Going away? Hold my rhythm <Icon name="chevron" className="size-4 text-stone" /></button>
          <button onClick={() => openSheet({ kind: "perk" })} className="flex items-center justify-between text-left text-ink">Ask a nutritionist <Icon name="chevron" className="size-4 text-stone" /></button>
        </div>
      </Card>
    </section>
  );
}
