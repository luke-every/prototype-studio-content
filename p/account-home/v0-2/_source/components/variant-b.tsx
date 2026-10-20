"use client";

import { useState } from "react";
import Link from "next/link";
import { asset, BUNDLES, CATEGORIES, dish, POPULAR, SlotName, TODAY_INDEX, reasonFor, goalBg } from "@/lib/data";
import { isNewCustomer, useStore } from "@/lib/store";
import { FLAGS, ONLY_B } from "@/lib/flags";
import { plantCount, SearchAsk } from "./plan";
import { CheckInCard, Impact, PerkCard, Rhythm } from "./progress";
import { DeliveryCard, Greeting, useMealsHref } from "./top";
import { EveFace, EveFigure } from "./eve-mark";
import { Band, BandBleed } from "./band";
import { FreezerCard } from "./planhub";
import { GoalsCard } from "./goals";
import { Card, Icon, Pill, Sheet } from "./ui";
import { NutritionTracks } from "./nutrition";

/**
 * Variant B: "Week + Discover".
 * Meals are organised by week only (no day strip): what's still to enjoy, what's already eaten, and next week's box.
 * The Discover elements from the Figma page (668:19244) live on the home: seasonal hero, this month's favourite,
 * the full menu, bundles, "Talk of the table" and the discount milestones.
 */
export function HomeWeekDiscover() {
  const { s } = useStore();
  const isNew = isNewCustomer(s);
  return (
    <main className="pb-0">
      <Band tone="white" first>
        <Greeting />
      </Band>

      <Band tone="orange" tight>
        {isNew ? <GoalsCard /> : <div className="grid gap-3 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]"><GoalsCard /><FreezerCard compact /></div>}
      </Band>

      <Band tone="white" eyebrow="Coming up" title="Your next delivery">
        <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
          <DeliveryCard />
          <Milestones transparent />
        </div>
      </Band>

      {!isNew && (
        <Band tone="orangeSoft">
          <div className="space-y-6">
            <WeekMeals />
            <SearchAsk />
          </div>
        </Band>
      )}

      {/* Seasonal hero takes the "very light orange" slot as a full-bleed image section */}
      <BandBleed><SeasonalHero full /></BandBleed>

      <Band tone="white">
        <MonthFavourite />
      </Band>

      <Band tone="orange" eyebrow="Explore" title="Meet the full menu">
        <div className="[&_section>h2:first-child]:hidden [&_section>h2:first-child+p]:mt-0">
          <FullMenu />
        </div>
        <div className="mt-10"><TalkOfTheTable /></div>
      </Band>

      <Band tone="white" eyebrow="Bundles" title="Which bundle fits you?">
        <div className="[&_section>h2:first-child]:hidden [&_section>div]:!mt-0"><Bundles /></div>
      </Band>

      {!isNew && <Band tone="orangeSoft" eyebrow="Keep it going" title="Your rhythm & perks">
        <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
          <CheckInCard />
          <Rhythm />
          <Impact />
          <PerkCard />
        </div>
      </Band>}
    </main>
  );
}

type Entry = { day: number; slot: SlotName; dishId: string };

const SLOT: Record<SlotName, string> = { breakfast: "Breakfast", lunch: "Lunch", dinner: "Dinner" };

/** The week as one set of meals, not a calendar. Frozen meals don't expire, so uneaten ones are "in your freezer", not missed. */
/** `bare`: inside the shared section frame, which carries the eyebrow and title. */
/** `grid` (Variant B Home, slim copy): this week only, no header or week toggle, meals stacked in a grid instead of a swipe row. */
export function WeekMeals({ bare = false, grid = false }: { bare?: boolean; grid?: boolean } = {}) {
  const { s, p, set } = useStore();
  const week = grid ? "this" : s.week;
  const entries: Entry[] = s.weeks[week].flatMap((d, day) => d.slots.filter((x) => x.dishId).map((x) => ({ day, slot: x.slot, dishId: x.dishId! })));
  const eaten = week === "this" ? entries.filter((e) => s.made[`${e.day}:${e.slot}`]) : [];
  const todo = entries.filter((e) => !eaten.includes(e));
  const plants = plantCount(s);
  const goalDone = Object.keys(s.made).filter((k) => !k.endsWith("breakfast")).length;

  return (
    <section id="plan" className="scroll-mt-20">
      {!grid && <div className="flex flex-wrap items-end justify-between gap-3">
        {!bare && <div>
          <span className="eyebrow">{week === "this" ? "This week · 28 Sep – 4 Oct" : "Next week · 5 – 11 Oct · your box"}</span>
          <h2 className="mt-1 font-serif text-[28px] leading-tight text-ink sm:text-[32px]">{week === "this" ? "Your week of meals" : "Next week's box"}</h2>
        </div>}
        <div className="flex rounded-full bg-offwhite p-1 text-[12.5px]" role="radiogroup" aria-label="Week">
          {(["this", "next"] as const).map((w) => (
            <button key={w} role="radio" aria-checked={week === w} onClick={() => set((d) => { d.week = w; })}
              className={`rounded-full px-3.5 py-1.5 font-medium ${week === w ? "bg-white text-ink shadow-e1" : "text-stone"}`}>
              {w === "this" ? "This week" : "Next week"}
            </button>
          ))}
        </div>
      </div>}

      {!FLAGS.compactWeekB && <div className="mt-4 flex flex-wrap gap-2">
        <Pill tone="stone">{entries.length} meals</Pill>
        {week === "this" && p.goalOrNull && <Pill tone="olive"><Icon name="leaf" className="size-3.5" /> {plants} of {s.plantTarget} plants</Pill>}
        {week === "this" && p.goalOrNull && <Pill tone="terra">Goal: {Math.min(s.weeklyTarget, goalDone)} of {s.weeklyTarget} meals</Pill>}
        {p.goalOrNull && <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11.5px] font-medium text-ink ${goalBg(p.goal)}`}><Icon name="check" className="size-3.5" /> Fits: {p.goalLabel.toLowerCase()}</span>}
      </div>}

      {week === "this" ? (
        <>
          <Group title="Still to enjoy" hint="Eat them in any order. Anything left stays good in your freezer." entries={todo} week={week} grid={grid} />
          {eaten.length > 0 && <Group title="Enjoyed" entries={eaten} week={week} muted grid={grid} />}
        </>
      ) : (
        <Group title="In your box" hint="Swap anything until tonight, 23:59. The box follows." entries={todo} week={week} />
      )}
    </section>
  );
}

function Group({ title, hint, entries, week, muted, grid }: { title: string; hint?: string; entries: Entry[]; week: "this" | "next"; muted?: boolean; grid?: boolean }) {
  return (
    <div className={grid ? "mt-0 [&+&]:mt-10" : "mt-6"}>
      <div className="flex items-baseline justify-between gap-3">
        {grid
          ? <h2 className="font-serif text-[26px] leading-tight text-ink sm:text-[30px]">{title} <span className="text-stone">· {entries.length}</span></h2>
          : <h3 className="text-[15px] font-medium text-ink">{title} <span className="font-normal text-stone">· {entries.length}</span></h3>}
      </div>
      {hint && <p className={grid ? "mt-1 text-[14px] text-stone" : "mt-0.5 text-[13px] text-stone"}>{hint}</p>}
      {grid ? (
        <ul className={`mt-4 divide-y divide-line overflow-hidden rounded-[20px] border border-line bg-white lg:max-w-[720px] ${muted ? "opacity-70" : ""}`}>
          {entries.map((e) => <li key={`${e.day}:${e.slot}`}><WeekRow e={e} week={week} /></li>)}
        </ul>
      ) : <div className={`no-scrollbar -mx-4 mt-3 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:scroll-px-0 sm:px-0 ${muted ? "opacity-70" : ""}`}>
        {entries.map((e) => (
          <div key={`${e.day}:${e.slot}`} className="flex w-[46%] min-w-[160px] max-w-[220px] shrink-0 snap-start">
            <WeekCard e={e} week={week} slim={FLAGS.compactWeekB} />
          </div>
        ))}
      </div>}
    </div>
  );
}

/** B only copy: "Your meal plan" opens from My Plan's top card with this week's Still to enjoy / Enjoyed lists. */
/** The week's meals first, then their nutrition: what the meals give you, planned vs eaten, against the goal's targets. */
export function MealPlanSheet({ onClose }: { onClose: () => void }) {
  const { s } = useStore();
  return (
    <Sheet onClose={onClose} eyebrow="This week · 28 Sep – 4 Oct" title="Your meal plan" wide>
      <WeekMeals bare grid />
      <section aria-labelledby="mp-nutrition" className="mt-10">
        <h2 id="mp-nutrition" className="font-serif text-[26px] leading-tight text-ink sm:text-[30px]">Your nutrition</h2>
        <p className="mt-1 text-[14px] text-stone">What the meals above give you per meal, against your goal&apos;s targets.</p>
        <div className="mt-4 rounded-[20px] border border-line bg-white p-4"><NutritionTracks s={s} /></div>
      </section>
    </Sheet>
  );
}

/** One meal as a list row (Variant B Home, slim copy): thumbnail, name, Made it and Swap. */
function WeekRow({ e, week }: { e: Entry; week: "this" | "next" }) {
  const { s, set, toast, openSheet, track } = useStore();
  const d = dish(e.dishId);
  const key = `${e.day}:${e.slot}`;
  const made = week === "this" && s.made[key];
  const why = () => { set((x) => { x.week = week; }); openSheet({ kind: "why", week, day: e.day, slot: e.slot }); };
  return (
    <div className="flex items-center gap-3 p-3">
      <button onClick={why} className="relative shrink-0" aria-label={`Why ${d.name}?`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset(d.img)} alt="" className="size-[72px] rounded-xl object-cover" />
        {made && <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-olive text-white"><Icon name="check" className="size-3" strokeWidth={2.6} /></span>}
      </button>
      <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <button onClick={why} className="min-w-0 text-left">
        <p className="text-[14.5px] font-medium leading-snug text-ink">{d.name}</p>
      </button>
      <div className="flex shrink-0 gap-1.5">
        {week === "this" && (
          <button onClick={() => {
            set((x) => { if (x.made[key]) delete x.made[key]; else x.made[key] = true; });
            track(`fake_door:i_made_this:${d.id}`);
            if (!made) toast("Nice. Logged with one tap, no counting.");
          }} aria-pressed={!!made} aria-label={`${made ? "Made" : "Made it"}: ${d.name}`}
            className={`flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-1.5 text-[12px] font-medium ${made ? "bg-olive text-white" : "border border-line2 text-ink"}`}>
            <Icon name="check" className="size-3.5" strokeWidth={2.2} /> {made ? "Made" : "Made it"}
          </button>
        )}
        <button onClick={() => { set((x) => { x.week = week; }); openSheet({ kind: "swap", week, day: e.day, slot: e.slot }); }}
          className="flex items-center gap-1 whitespace-nowrap rounded-full bg-offwhite px-3 py-1.5 text-[12px] font-medium text-ink" aria-label={`Swap ${d.name}`}>
          <Icon name="swap" className="size-3.5" /> Swap
        </button>
      </div>
      </div>
    </div>
  );
}

/** `slim` (reduced copy): image, meal name, Made it and Swap only. */
function WeekCard({ e, week, slim = false }: { e: Entry; week: "this" | "next"; slim?: boolean }) {
  const { s, p, set, toast, openSheet, track } = useStore();
  const d = dish(e.dishId);
  const key = `${e.day}:${e.slot}`;
  const made = week === "this" && s.made[key];
  const inFreezer = week === "this" && !made && e.day < TODAY_INDEX;
  const why = () => { set((x) => { x.week = week; }); openSheet({ kind: "why", week, day: e.day, slot: e.slot }); };
  return (
    <Card className="flex w-full flex-col overflow-hidden">
      <button onClick={why} className="relative" aria-label={`Why ${d.name}?`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset(d.img)} alt="" className="aspect-[4/3] w-full object-cover" />
        {inFreezer && <span className="absolute left-2 top-2 rounded-full bg-sky-bg px-2 py-0.5 text-[11px] font-medium text-[#3f5e77]">In your freezer</span>}
        {made && <span className="absolute left-2 top-2 grid size-7 place-items-center rounded-full bg-olive text-white"><Icon name="check" className="size-4" strokeWidth={2.4} /></span>}
      </button>
      <div className="flex flex-1 flex-col p-3">
        {!slim && <span className="eyebrow !text-[10.5px]">{SLOT[e.slot]}</span>}
        <button onClick={why} className={slim ? "text-left" : "mt-0.5 text-left"}>
          <p className="text-[14.5px] font-medium leading-snug text-ink">{d.name}</p>
          {!slim && <p className="mt-0.5 line-clamp-2 text-[12.5px] leading-snug text-stone">{reasonFor(d, p.goalOrNull)}</p>}
        </button>
        {!slim && <p className="mt-1.5 flex gap-2.5 text-[12px] text-stone">
          <span className="flex items-center gap-1"><Icon name="clock" className="size-3.5" />{d.minutes ? `${d.minutes} min` : "Ready"}</span>
          <span className="flex items-center gap-1"><Icon name="leaf" className="size-3.5" />{d.plants}</span>
        </p>}
        <div className="mt-auto flex gap-1.5 pt-3">
          {week === "this" && (
            <button onClick={() => {
              set((x) => { if (x.made[key]) delete x.made[key]; else x.made[key] = true; });
              track(`fake_door:i_made_this:${d.id}`);
              if (!made) toast("Nice. Logged with one tap, no counting.");
            }} aria-pressed={!!made}
              className={`flex flex-1 items-center justify-center gap-1 whitespace-nowrap rounded-full px-2 py-1.5 text-[12px] font-medium ${made ? "bg-olive text-white" : "border border-line2 text-ink"}`}>
              <Icon name="check" className="size-3.5" strokeWidth={2.2} /> {made ? "Made" : "Made it"}
            </button>
          )}
          <button onClick={() => { set((x) => { x.week = week; }); openSheet({ kind: "swap", week, day: e.day, slot: e.slot }); }}
            className="flex flex-1 items-center justify-center gap-1 whitespace-nowrap rounded-full bg-offwhite px-2 py-1.5 text-[12px] font-medium text-ink" aria-label={`Swap ${d.name}`}>
            <Icon name="swap" className="size-3.5" /> Swap
          </button>
        </div>
      </div>
    </Card>
  );
}

/** Figma "September Drop" hero. */
/** `full`: used edge to edge on the Variant B home, so the text aligns with the page grid. */
export function SeasonalHero({ full = false }: { full?: boolean }) {
  return (
    <section className="relative -mx-4 overflow-hidden sm:mx-0 sm:rounded-[28px]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={asset("/discover/hero-back-to-better.jpg")} alt="" className="absolute inset-0 size-full object-cover object-[center_30%]" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/45 to-ink/10" />
      <div className={`relative flex min-h-[300px] flex-col justify-end p-6 text-paper sm:min-h-[340px] ${full ? "mx-auto w-full max-w-[1120px] pb-14 sm:px-6" : ""}`}>
        <span className="w-fit rounded-md bg-ink/60 px-2.5 py-1 text-[12px]">September Drop</span>
        <h2 className="mt-3 font-serif text-[28px] leading-tight">The Back to Better Bundle</h2>
        <p className="mt-2 max-w-[44ch] text-[14.5px] leading-relaxed text-paper/90">Want to get back into your routine? Comforting meals for the season ahead, paired with our high-fibre spirulina smoothies.</p>
        <a href="/bundle-back-to-better.html" className="mt-5 flex w-full items-center justify-center rounded-full bg-white py-3 text-[12.5px] font-medium uppercase tracking-[.14em] text-ink sm:w-fit sm:px-10">Discover the bundle</a>
      </div>
    </section>
  );
}

/** Figma "This month's favourite". */
export function MonthFavourite() {
  const { s, set, toast } = useStore();
  const d = dish("peas-love");
  const blocked = d.contains.some((a) => s.exclude.includes(a));
  const n = s.extras[d.id] ?? 0;
  return (
    <section className="overflow-hidden rounded-[24px] bg-white shadow-e2 sm:grid sm:grid-cols-2">
      <button onClick={() => set((x) => { x.sheet = { kind: "dish", id: d.id }; })} aria-label={`About ${d.name}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset(d.img)} alt="" className="aspect-[3/2] w-full object-cover sm:aspect-auto sm:h-full" />
      </button>
      <div className="flex flex-col p-5">
        <span className="text-[12px] uppercase tracking-[.06em] text-ink">This month&apos;s favourite</span>
        <h2 className="mt-2 font-serif text-[26px] text-ink">{d.name}</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-body">Creamy pea pesto, fresh basil, roasted greens and semi-dried tomatoes.</p>
        <p className="mt-2 text-[13px] text-stone">{d.plants} plants · {d.minutes} min · contains gluten</p>
        <div className="mt-auto pt-5">
          {blocked ? (
            <p className="rounded-2xl bg-offwhite p-3 text-[13.5px] text-stone">Contains gluten, which you&apos;ve asked Eve to leave out.</p>
          ) : (
            <button onClick={() => { set((x) => { x.extras[d.id] = n + 1; }); toast(`${d.name} added to your next box.`); }}
              className="w-full rounded-full border border-ink/70 py-3 text-[12.5px] font-medium uppercase tracking-[.14em] text-ink hover:bg-offwhite">
              {n ? `In your box · ${n} — add another` : "Add to box"}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

/** Figma "Meet the full menu": category circles, tap one to see what it's for. */
const CAT_TO_SECTION: Record<string, string> = { breakfast: "#cat-breakfast", meals: "#cat-pasta", salads: "#cat-signature", shots: "#cat-breakfast", smoothies: "#cat-breakfast", sweet: "#cat-sweet" };

export function FullMenu() {
  const mealsHref = useMealsHref();
  const [sel, setSel] = useState<string | null>(null);
  const c = CATEGORIES.find((x) => x.id === sel);
  return (
    <section>
      <h2 className="font-serif text-[26px] text-ink">Meet the full menu</h2>
      <p className="mt-1 text-[14.5px] text-body">Something for every craving, any time of day.</p>
      {c && (
        <div className="mt-4 flex items-center gap-4 animate-fade-in">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset(c.img)} alt="" className="size-20 shrink-0 rounded-full object-cover ring-2 ring-ink ring-offset-2 ring-offset-paper" />
          <div>
            <p className="text-[14.5px] leading-relaxed text-body">{c.blurb}</p>
            <Link href={`${mealsHref}${CAT_TO_SECTION[c.id]}`} className="mt-1 inline-block text-[13.5px] text-ink underline underline-offset-2">{c.link} →</Link>
          </div>
        </div>
      )}
      <div className="no-scrollbar -mx-4 mt-4 flex gap-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
        {CATEGORIES.filter((x) => x.id !== sel).map((x) => (
          <button key={x.id} onClick={() => setSel(x.id)} className="flex w-[84px] shrink-0 flex-col items-center gap-2 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset(x.img)} alt="" className="size-20 rounded-full object-cover" />
            <span className="text-[13.5px] leading-tight text-ink">{x.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

/** Figma "Which bundle fits you?" carousel. Links to the existing bundle PDP prototypes on the deployed site. */
/** Eve only recommends bundles that fit the goal: best fit first, the rest left out. */
const BUNDLE_FIT: Record<string, string[]> = {
  balanced: ["better", "portions"], gut: ["better", "portions"], lose: ["portions", "better"], maintain: ["portions", "better"],
  lean: ["protein", "portions"], energy: ["protein", "better"], muscle: ["protein", "portions"], postpartum: ["parent", "better"],
};
function eveBundleIds(goal: string | null) {
  return goal ? BUNDLE_FIT[goal] ?? [] : ["better", "portions"];
}

/** `eve` (Variant B Home, slim copy): framed as Eve's recommendations for the customer's plan. */
export function Bundles({ eve = false }: { eve?: boolean } = {}) {
  const { p } = useStore();
  // All bundles stay; with `eve` Eve's picks come first and are highlighted
  const picks = eve ? eveBundleIds(p.goalOrNull) : [];
  const list = eve ? [...BUNDLES].sort((a, b) => (picks.indexOf(a.id) + 1 || 99) - (picks.indexOf(b.id) + 1 || 99)) : BUNDLES;
  return (
    <section>
      <h2 className="font-serif text-[26px] text-ink">Which bundle fits you?</h2>
      {eve && <p className="mt-1 text-[14px] text-stone">{p.goalOrNull ? `Eve recommends the ones that fit your ${p.goalLabel.toLowerCase()} goal and the meals in your plan.` : "Eve recommends the ones that fit the meals in your plan."}</p>}
      <div className="no-scrollbar -mx-4 mt-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:scroll-px-0 sm:px-0">
        {list.map((b) => (
          <a key={b.id} href={b.href} className={`flex w-[272px] shrink-0 snap-start flex-col rounded-[24px] bg-gradient-to-b ${picks.includes(b.id) ? "border-2 border-ink" : "border border-line"} ${b.tint} to-white to-45% p-5`}>
            <span className="text-[11.5px] uppercase tracking-[.08em] text-ink">{b.eyebrow}</span>
            <span className="mt-2 font-serif text-[22px] leading-tight text-ink">{b.name}</span>
            <span className="relative mt-4 block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(b.img)} alt="" className="aspect-[5/4] w-full rounded-2xl object-cover" />
              {picks.includes(b.id) && <EveTag label="Recommended by Eve" />}
            </span>
            <span className="mt-4 text-[14px] leading-relaxed text-body">{b.desc}</span>
            <span className="mt-auto pt-5 text-[13.5px] text-ink underline underline-offset-2">{b.price} →</span>
          </a>
        ))}
      </div>
    </section>
  );
}

/** Figma "Talk of the table": most-reordered dishes, info opens the dish sheet. */
/** A small "from Eve" label on a recommendation image. */
function EveTag({ label }: { label: string }) {
  return <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-white/95 py-0.5 pl-0.5 pr-2.5 text-[11.5px] font-medium text-ink shadow-e1"><EveFace className="size-5" />{label}</span>;
}

/** `eve` (Variant B Home, slim copy): the same favourites, framed as Eve's picks for the customer's plan. */
export function TalkOfTheTable({ eve = false }: { eve?: boolean } = {}) {
  const { s, p, openSheet } = useStore();
  const list = POPULAR.map(dish).filter((d) => !d.contains.some((a) => s.exclude.includes(a)));
  return (
    <section>
      <div className="flex items-baseline justify-between">
        <h2 className="font-serif text-[26px] text-ink">{eve ? "Eve's picks for your plan" : "Talk of the table"}</h2>
        <Link href={useMealsHref("latest")} className="text-[13.5px] text-ink underline underline-offset-2">More →</Link>
      </div>
      <p className="mt-1 text-[14px] text-stone">{eve
        ? p.goalOrNull ? `This month's most reordered dishes that fit your ${p.goalLabel.toLowerCase()} goal. Eve recommends adding one to your next box.` : "This month's most reordered dishes that Eve thinks you'll like. Add one to your next box."
        : "What other customers reordered most this month."}</p>
      <div className="no-scrollbar -mx-4 mt-4 flex gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
        {list.map((d) => (
          <button key={d.id} onClick={() => openSheet({ kind: "dish", id: d.id })} className="w-[168px] shrink-0 text-left">
            <span className="relative block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(d.img)} alt="" className="aspect-square w-full rounded-[18px] object-cover" />
              {eve && <EveTag label="Eve's pick" />}
              <span className="absolute bottom-2 right-2 grid size-7 place-items-center rounded-full bg-white/90 text-ink"><Icon name="info" className="size-4" /></span>
            </span>
            <span className="mt-2 block text-[14px] font-medium text-ink">{d.name}</span>
            <span className="text-[12.5px] text-stone">{eve ? <span className="line-clamp-2">{reasonFor(d, p.goalOrNull)}</span> : `${d.plants} plants · ${d.minutes} min`}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

/** Figma "Your discount milestones": order streak toward the subscription discount. Pausing keeps it (no-guilt lapse rule). */
/** `transparent`: on the Variant B home the card sits on the section background with just an outline. */
export function Milestones({ transparent = false }: { transparent?: boolean }) {
  const steps = [
    { n: "✓", label: "Order 1", off: "20% off", state: "done" },
    { n: "2", label: "Order 2", off: "15% off", state: "current" },
    { n: "3", label: "Order 3", off: "15% off", state: "next" },
    { n: "4+", label: "", off: "", state: "next" },
  ];
  return (
    <section className={`rounded-[28px] ${transparent ? (ONLY_B ? "py-1" : "border border-line p-5") : "bg-offwhite p-5"}`} aria-label="Discount milestones">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-serif text-[24px] leading-tight text-ink">Enjoy 15% off!</h2>
          <p className="mt-1 text-[13.5px] text-body">On your next two orders. No code needed.</p>
        </div>
        <span className="shrink-0 rounded-md bg-signal px-2.5 py-1 text-[12px] text-ink">1 in 3 complete</span>
      </div>
      <div className="mt-2 flex justify-end"><EveFigure pose="wave" className="h-14 w-auto" /></div>
      <ol className="mt-2 grid grid-cols-4 items-start">
        {steps.map((st, i) => (
          <li key={i} className="relative flex flex-col items-center text-center">
            {i < steps.length - 1 && <span className={`absolute left-1/2 top-[15px] h-[2px] w-full ${st.state === "done" ? "bg-signal" : "bg-brown"}`} aria-hidden="true" />}
            <span className={`relative grid size-8 place-items-center rounded-full text-[13px] ${st.state === "done" ? "bg-signal text-ink" : st.state === "current" ? "bg-ink text-paper ring-4 ring-signal/70" : "bg-brown text-paper"}`}>{st.n}</span>
            {st.label && <span className="mt-2 text-[13px] text-ink">{st.label}</span>}
            {st.off && <span className="text-[12px] text-stone">{st.off}</span>}
          </li>
        ))}
      </ol>
      <p className="mt-4 flex items-center gap-2 text-[13px] text-ink">
        <span className="grid size-5 shrink-0 place-items-center rounded-full bg-ink text-[11px] text-paper">i</span>
        Pausing your subscription keeps your discount.
      </p>
    </section>
  );
}

