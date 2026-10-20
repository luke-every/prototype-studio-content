"use client";

import Link from "next/link";
import { asset, dish, Dish, fmtDay, goalBg, goalInfo, NOW } from "@/lib/data";
import { ONLY_B } from "@/lib/flags";
import { hasGoal, isEaten, isNewCustomer, State, useStore, weekEaten } from "@/lib/store";
import { EveFace } from "./eve-mark";
import { weeklyHistory } from "./goals";
import { plantCount } from "./plan";
import { PageSection, SectionLink } from "./section";
import { usePlanHref } from "./top";
import { Button, Icon } from "./ui";
import { NutritionLine, Num, useArrived } from "./nutrition";

/** This week's planned main meals in order, with eaten state (for the plates). */
function plannedMains(s: State) {
  return s.weeks.this.flatMap((d, i) => d.slots.filter((x) => x.dishId && x.slot !== "breakfast").map((x) => ({ d: dish(x.dishId!), eaten: isEaten(s, i, x.slot) })));
}

/** Weeks in a row with at least one every meal, this week included (no-guilt: counts showing up, not hitting a target). */
function streak(hist: number[]) {
  let n = 0;
  for (let i = hist.length - 1; i >= 0 && hist[i] > 0; i--) n++;
  return n;
}

/**
 * Which headline stats each goal type cares about (Miro goal docs), hero first. Meals this week is everyone's progress;
 * plants only where plant variety is a lever; weeks in a row where the doc stresses consistency;
 * the month where the goal is about the longer run.
 */
type StatKey = "meals" | "plants" | "streak" | "month";
const STAT_FOCUS: Record<string, StatKey[]> = {
  balanced: ["plants", "meals", "streak"],   // variety and consistency, "30+ plants a week"
  gut: ["plants", "meals", "streak"],        // plant diversity is the lever
  lose: ["month", "meals"],                  // sustainable, gradual: the month shows the trend
  maintain: ["streak", "meals", "month"],    // "consistency, not restriction"
  lean: ["streak", "meals"],                 // protein spread consistently across the week
  energy: ["meals", "month"],                // enough fuel across active weeks
  muscle: ["streak", "meals"],               // protein and calories, week after week
  postpartum: ["meals", "month"],            // steady support through the weeks after birth
};

// ---------- Stat tiles, each in its own shape ----------

/** All stats share one row: visual on top, then the number and a short label. `tight` = three tiles on a phone. */
function Tile({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="flex min-w-0 flex-col rounded-[20px] bg-white/70 p-3 sm:p-4" role="group" aria-label={label}>
      {children}
    </div>
  );
}

function Figure({ value, of, suffix, label }: { value: number; of?: number; suffix?: string; label: string }) {
  return (
    <div className="mt-auto pt-3">
      <p className="font-serif text-[26px] leading-none text-ink sm:text-[30px]"><Num value={value} />{suffix}{of !== undefined && <span className="text-[15px] text-stone sm:text-[18px]">/{of}</span>}</p>
      <p className="mt-1 text-[12px] leading-snug text-body sm:text-[12.5px]">{label}</p>
    </div>
  );
}

/** Meals this week as plates: eaten ones in colour with a tick, the rest faded. */
function Plates({ s, target, eaten, tight }: { s: State; target: number; eaten: number; tight: boolean }) {
  const planned = plannedMains(s).slice(0, target);
  const plates: { d: Dish | null; eaten: boolean }[] = [...planned, ...Array.from({ length: Math.max(0, target - planned.length) }, () => ({ d: null, eaten: false }))];
  const size = tight ? "size-7" : "size-9";
  return (
    <Tile label={`${eaten} of ${target} meals this week`}>
      <div className={`flex ${tight ? "-space-x-2" : "-space-x-1.5"}`} aria-hidden="true">
        {plates.map((x, i) => (
          <span key={i} className="relative shrink-0">
            {x.d
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={asset(x.d.img)} alt="" className={`${size} rounded-full object-cover ring-2 ring-white transition duration-500 ${x.eaten ? "" : "opacity-35 grayscale"}`} style={{ transitionDelay: `${i * 80}ms` }} />
              : <span className={`block ${size} rounded-full border-2 border-dashed border-ink/20`} />}
            {x.eaten && <span className="absolute -bottom-0.5 -right-0.5 grid size-3.5 place-items-center rounded-full bg-ink text-paper"><Icon name="check" className="size-2" strokeWidth={3} /></span>}
          </span>
        ))}
      </div>
      <Figure value={eaten} of={target} label="meals this week" />
    </Tile>
  );
}

/** Different plants as a jar that fills with leaves from the bottom. */
function PlantJar({ plants, target, tight }: { plants: number; target: number; tight: boolean }) {
  const on = useArrived();
  const leaves = Array.from({ length: target });
  return (
    <Tile label={`${plants} of ${target} different plants this week`}>
      <div aria-hidden="true" className={tight ? "w-[64px]" : "w-[84px]"}>
        <span className="mx-auto block h-1.5 w-7 rounded-t-md border-2 border-b-0 border-ink" />
        <div className="grid grid-cols-6 gap-[2px] rounded-b-[14px] rounded-t-[6px] border-2 border-ink bg-white p-1">
          {leaves.map((_, i) => {
            const filled = i >= target - plants; // fill from the bottom up
            return <span key={i} className={`block transition-colors duration-300 ${filled && on ? "text-olive" : "text-ink/15"}`} style={{ transitionDelay: `${(target - i) * 18}ms` }}><Icon name="leaf" className="size-full" strokeWidth={2.4} /></span>;
          })}
        </div>
      </div>
      <Figure value={plants} of={target} label="plants this week" />
    </Tile>
  );
}

/** Weeks in a row as dots, the current run filled. */
function StreakStrip({ hist, weeks, tight }: { hist: number[]; weeks: number; tight: boolean }) {
  return (
    <Tile label={`${weeks} weeks in a row with every`}>
      <div className="flex items-center gap-1" aria-hidden="true">
        {hist.map((_, i) => {
          const inRun = i >= hist.length - weeks;
          const now = i === hist.length - 1;
          return <span key={i} className={`block shrink-0 rounded-full ${tight ? "size-4" : "size-5"} ${inRun ? "bg-ink" : "border-2 border-ink/20"} ${now ? "outline outline-2 outline-offset-2 outline-ink/25" : ""}`} />;
        })}
      </div>
      <Figure value={weeks} label={weeks === 1 ? "week in a row" : "weeks in a row"} />
    </Tile>
  );
}

/** On track this month as a ring. */
function MonthRing({ pct, month, tight }: { pct: number; month: number; tight: boolean }) {
  const on = useArrived();
  const r = 26, c = 2 * Math.PI * r;
  return (
    <Tile label={`${pct}% on track this month, ${month} meals`}>
      <svg viewBox="0 0 64 64" className={`${tight ? "size-9" : "size-11"} shrink-0 -rotate-90`} aria-hidden="true">
        <circle cx="32" cy="32" r={r} fill="none" stroke="currentColor" strokeWidth="9" className="text-ink/10" />
        <circle cx="32" cy="32" r={r} fill="none" stroke="currentColor" strokeWidth="9" strokeLinecap="round" className="text-ink transition-[stroke-dashoffset] duration-1000 ease-out"
          strokeDasharray={c} strokeDashoffset={on ? c * (1 - pct / 100) : c} />
      </svg>
      <Figure value={pct} suffix="%" label={`on track · ${month} meals`} />
    </Tile>
  );
}

/** One line from Eve that sums the card up, led by the goal's hero stat. */
function eveLine(hero: StatKey, v: { eaten: number; target: number; plants: number; weeks: number; pct: number }) {
  const meals = `${v.eaten} ${v.eaten === 1 ? "meal" : "meals"} in`;
  switch (hero) {
    case "plants": return v.plants >= 30 ? `${v.plants} plants already. That's the 30 covered.` : `You're ${meals} and already at ${v.plants} plants. Nice pace.`;
    case "streak": return `${v.weeks} ${v.weeks === 1 ? "week" : "weeks"} in a row with every. Steady beats perfect.`;
    case "month": return `${v.pct}% on track this month. Slow and steady is exactly how this works.`;
    default: return v.eaten >= v.target ? "This week's meals are done. Lovely." : `You're ${meals} this week. ${v.target - v.eaten} to go, in any order.`;
  }
}

/**
 * B only copy: the first thing on Home is a small dashboard. Who you are and your goal, then the goal's own stats
 * (one hero tile, each stat in its own shape), Eve's line, the goal's main macro and the next box.
 */
export function HomeDashboard() {
  const { s, p, openSheet } = useStore();
  const planHref = usePlanHref();
  const hour = NOW.getHours();
  const hello = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const goal = hasGoal(s);
  const isNew = isNewCustomer(s);
  const g = goalInfo(s.goal);
  const target = s.weeklyTarget;
  const eaten = Math.min(weekEaten(s), target);
  const plants = plantCount(s);
  const hist = weeklyHistory(s);
  const month = hist.reduce((a, b) => a + b, 0);
  const onTrack = Math.min(100, Math.round((month / (target * 4)) * 100));
  const weeks = streak(hist);
  const stats = STAT_FOCUS[s.goal] ?? ["meals", "plants", "streak", "month"];


  const d = s.delivery;
  const box = d.status === "active" || d.status === "today";

  // One row, always: the goal's lead stat first; three tiles get the tighter visuals
  const tight = stats.length >= 3;
  const tile = (k: StatKey) => {
    if (k === "meals") return <Plates key={k} s={s} target={target} eaten={eaten} tight={tight} />;
    if (k === "plants") return <PlantJar key={k} plants={plants} target={s.plantTarget} tight={tight} />;
    if (k === "streak") return <StreakStrip key={k} hist={hist} weeks={weeks} tight={tight} />;
    return <MonthRing key={k} pct={onTrack} month={month} tight={tight} />;
  };

  return (
    <PageSection>
      {/* Screen-wide like the LP/PDP bands, right under the top navigation; content stays on the 1120 px grid */}
      <div className="ml-[calc(50%-50vw)] mr-[calc(50%-50vw)] overflow-hidden rounded-b-[32px] bg-white">
        {/* Profile + goal + headline stats */}
        <div className={goal ? goalBg(s.goal) : "bg-offwhite"}>
        <div className="mx-auto max-w-[1120px] px-4 py-6 sm:px-6 sm:py-8">
          <div className="flex items-center gap-3">
            {ONLY_B ? (
              // Avatar: Happy Tummy Eve (head and heart), only used here
              // eslint-disable-next-line @next/next/no-img-element
              <img src={asset("/eve/eve-avatar.png")} alt="" aria-hidden="true" className="size-14 shrink-0 rounded-full bg-white object-contain p-1" />
            ) : (
              <span className="grid size-14 shrink-0 place-items-center rounded-full bg-white font-serif text-[26px] text-ink" aria-hidden="true">{p.name.charAt(0)}</span>
            )}
            <div className="min-w-0 flex-1">
              <p className="eyebrow">{hello}</p>
              <h1 className="font-serif text-[26px] leading-tight text-ink sm:text-[30px]">{p.name}</h1>
              <p className="text-[13.5px] text-body">{goal ? <>Goal: <b className="font-medium text-ink">{g.label}</b> · {target} meals a week</> : "No goal set yet"}</p>
            </div>
            {goal && <SectionLink href={`${planHref}#goal`}>Your goal</SectionLink>}
          </div>

          {goal && !isNew ? (
            <>
              <div className="mt-5 grid gap-2 sm:gap-2.5" style={{ gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))` }}>{stats.map(tile)}</div>
              {/* Only the goal's main macro here; the full nutrition sits with the meals ("Your meal plan") */}
              <div className="mt-4 rounded-[18px] bg-white/70 p-3.5"><NutritionLine s={s} onMore={() => openSheet({ kind: "mealPlan" })} /></div>
              <p className="mt-4 flex items-start gap-2.5 text-[14px] leading-snug text-ink">
                <EveFace className="size-7 shrink-0" />
                <span className="pt-0.5">{eveLine(stats[0], { eaten, target, plants, weeks, pct: onTrack })}</span>
              </p>
            </>
          ) : (
            <div className="mt-5 rounded-[18px] bg-white/70 p-4">
              <p className="text-[14.5px] text-ink">{goal ? "Your numbers start with your first box." : "Answer Eve's questions and your dashboard fills with your goal, meals, plants and macros."}</p>
              {!goal && <Button className="mt-3" size="sm" onClick={() => openSheet({ kind: "quiz" })}>Answer Eve&apos;s questions</Button>}
            </div>
          )}
        </div>
        </div>

        {/* Next box, so the delivery stays one glance away */}
        {box && (
          <div className="border-t border-line">
          <div className="mx-auto flex max-w-[1120px] flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-4 sm:px-6">
            <p className="flex items-center gap-2 text-[13.5px] text-body">
              <Icon name="truck" className="size-4 shrink-0 text-ink" />
              <span><b className="font-medium text-ink">Next box:</b> {d.status === "today" ? "today" : fmtDay(d.date, { weekday: "long", day: "numeric", month: "long" })} · {d.window}</span>
            </p>
            <Link href={`${planHref}#order`} className="text-[13.5px] text-ink underline decoration-line2 underline-offset-4 hover:decoration-ink">Manage</Link>
          </div>
          </div>
        )}
      </div>
    </PageSection>
  );
}
