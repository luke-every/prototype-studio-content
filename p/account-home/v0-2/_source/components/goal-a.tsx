"use client";

import { useState } from "react";
import { FLAGS } from "@/lib/flags";
import { asset, dish, Dish, Goal, goalBg, GOALS, goalInfo, groupBg, TODAY_INDEX } from "@/lib/data";
import { isEaten, State, useStore, weekEaten } from "@/lib/store";
import { weeklyHistory } from "./goals";
import { DeepDiveNudge } from "./planhub";
import { plantCount } from "./plan";
import { Band, PageSection, SectionLink, Surface } from "./section";
import { usePlanHref, variantOf } from "./top";
import { usePathname } from "next/navigation";

/** Target numbers openly in Variant A; one tap deep (chip drawer) in B and C. */
const useOpenNumbers = () => variantOf(usePathname()).id === "a";
import { Icon, Sheet } from "./ui";
import { NutritionTracks } from "./nutrition";
import { ONLY_B } from "@/lib/flags";

/**
 * Variant A goal sections in the visual language of the Figma "Website" bundle result screens
 * (node 5661:24113): "Your best match: *The … Bundle*" headline, the customer's own answers as check pills,
 * mood photography, an average-per-meal stat card, an italic benefit headline with icon rows,
 * "Dig a little deeper" FAQ and "Not sure it's a fit? Explore other …" cards.
 */

/** Mood photo + benefit headline per goal group. Headlines are reused from the Figma bundle result screens (pending goal-specific copy). */
const MOOD: Record<string, { img: string; img2: string; head: [string, string] }> = {
  "Eat well": { img: "/quiz/c-table.jpg", img2: "/discover/peas-love.jpg", head: ["Every detail.", "Thought through."] },
  Weight: { img: "/discover/bundle-hero-perfect-portions.jpg", img2: "/meals/beetroot-salad.jpg", head: ["When eating is sorted,", "losing weight gets easier."] },
  Fitness: { img: "/discover/bundle-hero-protein.jpg", img2: "/meals/arrabbiata.jpg", head: ["When protein is sorted,", "the rest gets easier."] },
  Postpartum: { img: "/discover/bundle-hero-postpartum.jpg", img2: "/meals/dal-delight.jpg", head: ["The weeks will change.", "The food keeps up."] },
};
export const moodOf = (g: Goal) => MOOD[goalInfo(g).group];

const BENEFIT_ICON = { plants: "leaf", fibre: "check", protein: "chart", kcal: "sun", carbs: "spark", fat: "heart", iron: "heart", folate: "leaf" } as const;

/** Planned main meals this week (lunch/dinner), with eaten state. */
function weekMains(s: State) {
  return s.weeks.this.flatMap((d, i) => d.slots.filter((x) => x.dishId && x.slot !== "breakfast").map((x) => ({ i, slot: x.slot, d: dish(x.dishId!), eaten: isEaten(s, i, x.slot) })));
}

const avg = (ds: Dish[], f: (d: Dish) => number) => (ds.length ? Math.round(ds.reduce((a, d) => a + f(d), 0) / ds.length) : 0);

/** One number that makes the goal tangible this week. */
function heroStat(s: State, numbers = true): { value: string; label: string } {
  const mains = weekMains(s).map((m) => m.d);
  const sum = (f: (d: Dish) => number) => mains.reduce((a, d) => a + f(d), 0);
  // Without open numbers (B, C), macro goals show a count instead of grams or kcal
  if (!numbers && ["lose", "maintain", "lean", "muscle", "energy"].includes(s.goal)) return { value: String(mains.length), label: `meals on your plan this week, chosen for ${goalInfo(s.goal).label.toLowerCase()}` };
  switch (s.goal) {
    case "gut": return { value: String(plantCount(s)), label: "different plants on your plan this week" };
    case "balanced": return { value: String(mains.length), label: "good decisions already made this week" };
    case "lose": case "maintain": return { value: `${avg(mains, (d) => d.protein)} g`, label: `protein and ${avg(mains, (d) => d.fibre)} g fibre in each meal` };
    case "lean": case "muscle": return { value: `≈ ${sum((d) => d.protein)} g`, label: "protein from your meals this week" };
    case "energy": return { value: `≈ ${sum((d) => d.kcal).toLocaleString("en-GB")}`, label: "kcal of fuel from your meals this week" };
    case "postpartum": return { value: String(mains.filter((d) => /dal|lentil|beetroot|bolognese/i.test(`${d.id} ${d.name}`)).length), label: "iron-rich lentil meals this week" };
  }
}

/** The customer's own answers, played back as check pills (Figma: "Maximizing protein · Quick to prepare …"). */
function answerPills(s: State) {
  const out = [...s.quiz.watch.filter((w) => w !== "Nothing in particular"), ...s.quiz.challenges.slice(0, 1)];
  return (out.length ? out : goalInfo(s.goal).chips.map((c) => c.label)).slice(0, 3);
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-2.5 py-1 text-[12.5px] text-ink">
      <span className="grid size-3.5 place-items-center rounded-full bg-ink/80"><svg viewBox="0 0 12 12" className="size-2.5" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m3 6.2 2 2 4-4.4" /></svg></span>
      {children}
    </span>
  );
}

// ---------------------------------------------------------------------------------------------------
// HOME: a small "best match" card
// ---------------------------------------------------------------------------------------------------

export function GoalCardA() {
  const { s, openSheet } = useStore();
  const planHref = usePlanHref();
  const g = goalInfo(s.goal);
  const numbers = useOpenNumbers();
  const stat = heroStat(s, numbers);
  const mains = weekMains(s);
  const eaten = weekEaten(s);
  return (
    <Band tone={goalBg(s.goal)} label="Your goal">
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12">
        <div>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="font-serif text-[26px] leading-[1.1] text-ink sm:text-[30px]">Your goal:<br /><em className="italic">{g.label}</em></h2>
            <div className="mt-3 flex flex-wrap gap-1.5">{answerPills(s).map((x) => <Pill key={x}>{x}</Pill>)}</div>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset(moodOf(s.goal).img)} alt="" className="size-[88px] shrink-0 rounded-[18px] object-cover sm:size-[112px] lg:hidden" />
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center">
          <div className="rounded-[20px] bg-white/70 px-4 py-3">
            <p className="font-serif text-[34px] leading-none text-ink">{stat.value}</p>
            <p className="mt-1 max-w-[22ch] text-[12.5px] leading-snug text-body">{stat.label}</p>
          </div>
          {/* This week's meals: eaten ones in full colour with a tick, upcoming ones faded */}
          <div>
            <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
              {mains.map((m) => (
                <button key={`${m.i}${m.slot}`} onClick={() => openSheet({ kind: "why", week: "this", day: m.i, slot: m.slot })} aria-label={`${m.d.name}${m.eaten ? ", eaten" : ""}`} className="relative shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={asset(m.d.img)} alt="" className={`size-14 rounded-full object-cover ring-2 ${m.eaten ? "ring-white" : "opacity-45 ring-transparent"} ${m.i === TODAY_INDEX && !m.eaten ? "!opacity-100 ring-ink/70" : ""}`} />
                  {m.eaten && <span className="absolute -bottom-0.5 -right-0.5 grid size-5 place-items-center rounded-full bg-ink text-white"><Icon name="check" className="size-3" strokeWidth={2.6} /></span>}
                </button>
              ))}
            </div>
            <p className="mt-2 text-[13px] text-body"><b className="font-medium text-ink">{eaten} of {s.weeklyTarget}</b> meals this week · missed meals never count against you</p>
          </div>
        </div>
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-ink/10 pt-4">
          <SectionLink href={`${planHref}#goal`}>See your plan</SectionLink>
          <SectionLink onClick={() => openSheet({ kind: "quiz", goalOnly: true })}>Adjust goal</SectionLink>
        </div>
        </div>
        {/* Desktop: the goal's mood photo fills the right half, as on the bundle pages */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset(moodOf(s.goal).img)} alt="" className="hidden h-full max-h-[380px] w-full rounded-[24px] object-cover lg:block" />
      </div>
    </Band>
  );
}

// ---------------------------------------------------------------------------------------------------
// MY PLAN: the goal section as a mini result page
// ---------------------------------------------------------------------------------------------------

/** The chip's per-meal value for a list of dishes, plus whether it sits in the target range. */
function chipStat(key: string, ds: Dish[], target: string) {
  const val = (f: (d: Dish) => number) => avg(ds, f);
  const v = key === "plants" ? val((d) => d.plants) : key === "kcal" ? val((d) => d.kcal) : key === "carbs" ? val((d) => d.carbs) : key === "fat" ? val((d) => d.fat) : key === "fibre" ? val((d) => d.fibre) : key === "protein" ? val((d) => d.protein) : null;
  const unit = key === "kcal" ? "kcal" : key === "plants" ? "plants" : "g";
  const m = target.match(/(\d+)\s*[–-]\s*(\d+)/) ?? target.match(/(\d+)\+?/);
  const lo = m ? Number(m[1]) : 0;
  const hi = m && m[2] ? Number(m[2]) : Infinity;
  const ok = v === null ? true : v >= lo * 0.9 && v <= hi * 1.1;
  return { v, unit, ok };
}

/** My Plan goal section. In the slim copy: one small card with a touch point that opens all details in a modal. */
export function PlanGoalSectionA() {
  return <PageSection id="goal">{FLAGS.compactPlanGoal ? <GoalSummaryCard /> : <GoalDetailsBody />}</PageSection>;
}

/** The one small goal card (slim copy): goal, plan, answers, this week's progress, and "See plan details". */
/** Meals on this week's plan not yet eaten (the "Still to enjoy" count). */
function mealsLeft(s: State) {
  return s.weeks.this.reduce((a, d, i) => a + d.slots.filter((x) => x.dishId && !s.made[`${i}:${x.slot}`]).length, 0);
}

function GoalSummaryCard() {
  const { s, openSheet } = useStore();
  const g = goalInfo(s.goal);
  const eaten = weekEaten(s);
  return (
    <div className={`rounded-[24px] p-4 sm:p-6 ${goalBg(s.goal)}`}>
      <div className="flex items-start gap-4">
        <div className="min-w-0 flex-1">
          <p className="eyebrow">Your goal · {g.label}</p>
          <h1 className="mt-1.5 font-serif text-[26px] leading-[1.1] text-ink sm:text-[30px]">Your plan: <em className="italic">{g.title.replace(/^Your /, "The ")}</em></h1>
          <p className="mt-2 text-[13.5px] text-body"><b className="font-medium text-ink">{eaten} of {s.weeklyTarget}</b> meals this week · {s.weeklyTarget} a week, plan for 1 person</p>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset(moodOf(s.goal).img)} alt="" className="size-[76px] shrink-0 rounded-[16px] object-cover sm:size-[96px]" />
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">{answerPills(s).map((x) => <Pill key={x}>{x}</Pill>)}</div>
      {/* B only copy: the plan's focus macros at a glance (planned vs eaten against the target) */}
      {ONLY_B && <div className="mt-4 rounded-[18px] bg-white/70 p-3.5"><NutritionTracks s={s} compact /></div>}
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-ink/10 pt-3">
        {FLAGS.planInMyPlan ? (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <button onClick={() => openSheet({ kind: "mealPlan" })} className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-[13.5px] font-medium text-paper">
              Your meal plan <span className="font-normal text-paper/70">· {Math.max(0, mealsLeft(s))} to enjoy</span> <Icon name="chevron" className="size-4" />
            </button>
            <SectionLink onClick={() => openSheet({ kind: "goalDetails" })}>Goal details</SectionLink>
          </div>
        ) : (
          <button onClick={() => openSheet({ kind: "goalDetails" })} className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-[13.5px] font-medium text-paper">
            See plan details <Icon name="chevron" className="size-4" />
          </button>
        )}
        <SectionLink onClick={() => openSheet({ kind: "quiz", goalOnly: true })}>Change goal</SectionLink>
      </div>
    </div>
  );
}

/** Modal with everything the goal section holds: hero, what's in your week, progress, benefits, questions. */
export function GoalDetailsSheet({ onClose }: { onClose: () => void }) {
  const { s } = useStore();
  return (
    <Sheet onClose={onClose} eyebrow={ONLY_B ? "Goal details" : "Your plan"} title={goalInfo(s.goal).label} wide>
      <GoalDetailsBody />
    </Sheet>
  );
}

export function GoalDetailsBody() {
  const { s, openSheet } = useStore();
  const numbers = useOpenNumbers();
  const g = goalInfo(s.goal);
  const mood = moodOf(s.goal);
  const mains = weekMains(s).map((m) => m.d);
  const uniq = [...new Map(mains.map((d) => [d.id, d])).values()];
  const c0 = g.chips[0], c1 = g.chips[1];
  const s0 = chipStat(c0.key, mains, c0.target), s1 = chipStat(c1.key, mains, c1.target);
  const fmt = (st: { v: number | null; unit: string }, label: string) => (st.unit === "g" ? `${st.v} g ${label.toLowerCase()}` : `${st.v} ${st.unit}`);
  const line = numbers && s0.v !== null && s1.v !== null ? `Around ${fmt(s0, c0.label)} and ${fmt(s1, c1.label)} in each meal, without the effort.` : g.hint;
  const household = s.quiz.household && s.quiz.household !== "me";
  const target = s.weeklyTarget;
  const hist = weeklyHistory(s).map((n) => Math.min(n, target));
  const month = hist.reduce((a, b) => a + b, 0);
  const pct = Math.round((month / (target * 4)) * 100);

  return (
      <div className="space-y-4">
        {/* 1. Hero: "Your plan: The plants-first plan" */}
        <Surface tone={goalBg(s.goal)} className="overflow-hidden !px-0">
          <div className="px-4 sm:px-6">
            <div className="flex items-start justify-between gap-3">
              <p className="eyebrow">Your goal · {g.label}</p>
              <SectionLink onClick={() => openSheet({ kind: "quiz", goalOnly: true })}>Change goal</SectionLink>
            </div>
            <h1 className="mt-2 font-serif text-[32px] leading-[1.08] text-ink sm:text-[40px]">Your plan:<br /><em className="italic">{g.title.replace(/^Your /, "The ")}</em></h1>
            <div className="mt-3 flex flex-wrap gap-1.5">{answerPills(s).map((x) => <Pill key={x}>{x}</Pill>)}</div>
          </div>
          <div className="no-scrollbar mt-5 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 sm:scroll-px-6 sm:px-6" aria-label="Your plan in pictures">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset(mood.img)} alt="" className="h-[220px] w-[78%] max-w-[420px] shrink-0 snap-start rounded-[20px] object-cover sm:h-[260px]" />
            {uniq.slice(0, 5).map((d) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={d.id} src={asset(d.img)} alt={d.name} className="h-[220px] w-[60%] max-w-[260px] shrink-0 snap-start rounded-[20px] object-cover sm:h-[260px]" />
            ))}
          </div>
          <div className="px-4 pt-4 sm:px-6">
            <p className="max-w-[56ch] text-[15px] leading-relaxed text-body">{line}</p>
            <p className="mt-1 text-[13px] text-stone">{s.weeklyTarget} meals a week · plan for 1 person{household ? " · your box can still feed more people" : ""}{s.goalFrom ? ` · new goal from ${s.goalFrom}` : ""}</p>
          </div>
        </Surface>

        <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
          {/* 2. What's in your week: average per meal vs your targets (B only copy: nutrition and meals live in "Your meal plan") */}
          {!ONLY_B && <Surface>
            <h3 className="font-serif text-[22px] leading-tight text-ink">What&apos;s in your week</h3>
            <div className={`mt-3 rounded-[20px] p-4 ${goalBg(s.goal)}`}>
              <p className="text-center text-[12.5px] text-body">{numbers ? "Average per meal" : "Per meal · tap for the numbers"}</p>
              <div className={`mt-2 grid gap-2 text-center ${g.chips.length >= 3 ? "grid-cols-3" : "grid-cols-2"}`}>
                {g.chips.slice(0, 3).map((c) => {
                  const st = chipStat(c.key, mains, c.target);
                  return (
                    <button key={c.key} onClick={() => openSheet({ kind: "chip", key: c.key })} className="rounded-xl px-1 py-1 hover:bg-white/50">
                      {numbers ? (
                        <>
                          <p className="font-serif text-[26px] leading-none text-ink">{st.v ?? "✓"}<span className="ml-0.5 text-[13px]">{st.v !== null ? (st.unit === "plants" ? "" : st.unit) : ""}</span></p>
                          <p className="mt-1 text-[12px] text-body">{c.label}</p>
                          <p className="text-[11px] text-stone">target {c.target.split(" ").slice(0, 2).join(" ")}</p>
                        </>
                      ) : (
                        <>
                          <span className="mx-auto grid size-8 place-items-center rounded-full bg-white/80 text-ink"><Icon name={BENEFIT_ICON[c.key]} className="size-4" /></span>
                          <p className="mt-1.5 text-[12.5px] font-medium text-ink">{c.label}</p>
                          <p className="text-[11px] text-stone">{st.ok ? "In the right range" : "Eve is tuning this"}</p>
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
              {uniq.slice(0, 4).map((d, i) => (
                <div key={d.id} className={i === 3 ? "hidden sm:block" : ""}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={asset(d.img)} alt="" className="aspect-square w-full rounded-xl object-cover" />
                  <p className="mt-1 line-clamp-1 text-[12px] text-ink">{d.name}</p>
                </div>
              ))}
            </div>
          </Surface>}

          {/* 4. Progress, compact */}
          <Surface>
            <h3 className="font-serif text-[22px] leading-tight text-ink">Your progress</h3>
            <div className="mt-3 grid grid-cols-4 items-end gap-2" style={{ height: 76 }} aria-hidden="true">
              {hist.map((n, i) => (
                <div key={i} className="flex h-full flex-col items-center justify-end gap-1">
                  <span className="text-[11px] text-stone">{n}/{target}</span>
                  <div className={`w-full max-w-[40px] rounded-t-md ${i === 3 ? "bg-ink" : "bg-ink/30"}`} style={{ height: Math.max(5, Math.min(1, n / target) * 54) }} />
                </div>
              ))}
            </div>
            <div className="mt-1 grid grid-cols-4 gap-2 text-center text-[11px] text-stone">{["3 wks ago", "2 wks ago", "Last week", "This week"].map((l) => <span key={l}>{l}</span>)}</div>
            <p className="mt-3 text-[14px] text-body"><b className="font-medium text-ink">{month} of {target * 4}</b> meals this month · {pct}% on track</p>
            <p className="mt-1 text-[12.5px] text-stone">Missed meals never count against you.</p>
          </Surface>
        </div>

        {/* 3. Benefit band: italic headline, two photos, icon rows */}
        <Surface tone={goalBg(s.goal)}>
          <h3 className="font-serif text-[26px] leading-[1.12] text-ink sm:text-[30px]">{mood.head[0]}<br /><em className="italic">{mood.head[1]}</em></h3>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset(mood.img)} alt="" className="aspect-[4/5] w-full rounded-[16px] object-cover" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset(mood.img2)} alt="" className="aspect-[4/5] w-full rounded-[16px] object-cover" />
          </div>
          <ul className="mt-5 space-y-4">
            {g.chips.map((c) => (
              <li key={c.key} className="flex gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-full border border-ink/15 bg-white/60 text-ink"><Icon name={BENEFIT_ICON[c.key]} className="size-4" /></span>
                <span>
                  <span className="block text-[15px] font-medium text-ink">{numbers ? `${c.label}: ${c.target}` : c.label}</span>
                  <span className="text-[13.5px] leading-snug text-body">{c.why}{numbers ? ` ${c.how}` : ""}</span>
                </span>
              </li>
            ))}
          </ul>
        </Surface>

        {/* 5. Dig a little deeper */}
        <Surface>
          <p className="eyebrow">Common questions</p>
          <h3 className="mt-1 font-serif text-[22px] leading-tight text-ink">Dig a little deeper</h3>
          <Faq />
        </Surface>

        {/* 6. Explore other goals */}
        {!FLAGS.hideOtherGoals && <OtherGoals />}
      </div>
  );
}

function Faq() {
  const { s } = useStore();
  const g = goalInfo(s.goal);
  const [open, setOpen] = useState<number | null>(null);
  const deep = ["lose", "maintain", "lean", "energy", "muscle"].includes(s.goal);
  const items: { q: string; a: React.ReactNode }[] = [
    { q: "Why does this plan work for my goal?", a: g.science || g.message || g.hint },
    { q: "How does Eve pick my meals?", a: `${g.chips.map((c) => c.how).join(" ")} Your loves come back more often, and dishes you said aren't for you are left out.` },
    { q: "What if I miss a meal?", a: "Nothing resets and missed meals never count against you. Anything you didn't eat stays in your freezer for later." },
    ...(deep ? [{ q: "Can my portions be tuned to me?", a: <DeepDiveNudge /> }] : []),
  ];
  return (
    <ul className="mt-3 divide-y divide-line">
      {items.map((x, i) => (
        <li key={x.q}>
          <button onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} className="flex w-full items-center justify-between gap-3 py-3.5 text-left text-[14.5px] text-ink">
            {x.q}<span className="grid size-7 shrink-0 place-items-center rounded-full border border-line2"><Icon name={open === i ? "close" : "plus"} className="size-3.5" /></span>
          </button>
          {open === i && <div className="pb-4 text-[14px] leading-relaxed text-body">{x.a}</div>}
        </li>
      ))}
    </ul>
  );
}

/** "Not sure it's a fit? Explore other goals": every other goal as a card in its group colour. */
function OtherGoals() {
  const { s, openSheet } = useStore();
  const others = GOALS.filter((x) => x.id !== s.goal);
  return (
    <div>
      <h3 className="font-serif text-[22px] leading-tight text-ink sm:text-[26px]">Not sure it&apos;s the right goal?<br /><em className="italic">Explore other goals</em></h3>
      <div className="no-scrollbar -mx-4 mt-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:scroll-px-6 sm:px-6">
        {others.map((x) => (
          <button key={x.id} onClick={() => openSheet({ kind: "goals", preset: x.id })} className={`flex w-[220px] shrink-0 snap-start flex-col overflow-hidden rounded-[20px] text-left ${groupBg(x.group)}`}>
            <span className="px-4 pt-4 text-[11px] font-medium uppercase tracking-[.12em] text-stone">{x.group}</span>
            <span className="px-4 pt-1 font-serif text-[19px] leading-tight text-ink">{x.label}</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset(MOOD[x.group].img)} alt="" className="mx-4 mt-3 aspect-[4/3] w-[calc(100%-2rem)] rounded-[14px] object-cover" />
            <span className="px-4 pb-4 pt-3 text-[12.5px] leading-snug text-body">{x.baseMeals} meals a week · {x.chips.slice(0, 2).map((c) => c.label.toLowerCase()).join(" & ")} first</span>
          </button>
        ))}
      </div>
    </div>
  );
}
