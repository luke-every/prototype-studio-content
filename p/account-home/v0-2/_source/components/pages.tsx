"use client";

import Link from "next/link";
import { FLAGS, ONLY_B } from "@/lib/flags";
import { useState } from "react";
import { ADDRESS, asset, CUTOFF, DELIVERY_OPTIONS, dish, fmtDay, goalBg, goalInfo, NOW, TODAY_INDEX, weekCopy } from "@/lib/data";
import { boxPricing, eur, fmtDate, freezerOutlook, hasGoal, isNewCustomer, useStore, weekEaten } from "@/lib/store";
import { EveFace } from "./eve-mark";
import { HomeDashboard } from "./dashboard";
import { GoalProgress, weeklyHistory } from "./goals";
import { hasMoment, MomentCard, usePreDeliveryItems } from "./moments";
import { Addons, BoxCard, Cancelled, Pricing, Referral, SubscriptionDetails } from "./myplan";
import { Plan, SearchAsk } from "./plan";
import { AheadBanner, DeepDiveNudge, PlanViewBody, PlanViewToggle, useSignals } from "./planhub";
import { Impact, PerkCard, Rhythm } from "./progress";
import { Band, PageSection, SectionLink, SectionNav, Surface } from "./section";
import { DeliveryCard, EveningNudge, useGreeting, usePlanHref } from "./top";
import { Button, Icon } from "./ui";
import { Bundles, FullMenu, Milestones, MonthFavourite, SeasonalHero, TalkOfTheTable, WeekMeals } from "./variant-b";
import { CBare, EveBar, NextDelivery, Progress, TodayCard, WeekList } from "./variant-c";
import { usePathname } from "next/navigation";
import { GoalCardA, PlanGoalSectionA } from "./goal-a";
import { variantOf } from "./top";

/**
 * Section structure for all three variants (Victor, 13 Oct 2026): every page is a few themed sections in the
 * same order on mobile and desktop, each with one frame and one surface. Home answers "what matters today and
 * this week"; My Plan answers "manage my plan and my next order", with a sticky section nav.
 * Variants keep their character inside the frame: A by day, B as a week carousel + Discover, C as plain lists.
 */

// =====================================================================================================
// HOME
// =====================================================================================================

export function HomeA() {
  const { s } = useStore();
  const isNew = isNewCustomer(s);
  return (
    <main className="mx-auto max-w-[1120px] px-4 pb-6 sm:px-6">
      <div className="space-y-8 pt-6 sm:pt-8">
        <TodaySection />
        {hasGoal(s) ? <GoalCardA /> : <GoalSection />}
        {!isNew && <WeekSection />}
        <EveSlotSection />
        <DeliverySection />
        {!isNew && !FLAGS.hideKeepGoing && <MonthSection />}
        {!isNew && !FLAGS.hideWrapped && <WrappedBand />}
      </div>
    </main>
  );
}

/** Variant B: week as one carousel, plus Discover, in the same section frame. */
export function HomeB() {
  const { s } = useStore();
  const isNew = isNewCustomer(s);
  return (
    <main className="mx-auto max-w-[1120px] px-4 pb-6 sm:px-6">
      <div className={`space-y-8 ${FLAGS.homeDashboard ? "" : "pt-6 sm:pt-8"}`}>
        {FLAGS.homeDashboard ? <HomeDashboard /> : <TodaySection goalLine={FLAGS.bHomeFocus} />}
        {!FLAGS.bHomeFocus && (hasGoal(s) ? <GoalCardA /> : <GoalSection />)}
        {!isNew && !FLAGS.planInMyPlan && (FLAGS.bHomeFocus ? <PageSection id="week"><WeekMeals bare grid /></PageSection> : <WeekSectionB />)}
        <EveSlotSection noCheckIn={FLAGS.bHomeFocus} />
        <DeliverySection />
        <DiscoverSection />
        {!isNew && !FLAGS.hideKeepGoing && <MonthSection />}
        {!isNew && !FLAGS.hideWrapped && <WrappedBand />}
      </div>
    </main>
  );
}

/** Variant C: the simplest version. Today's meal sits in Today; week, box and progress as plain blocks. */
export function HomeC() {
  const { s } = useStore();
  const isNew = isNewCustomer(s);
  const planHref = usePlanHref();
  return (
    <CBare.Provider value={true}>
      <main className="mx-auto max-w-[1120px] px-4 pb-6 sm:px-6">
        <div className="space-y-8 pt-6 sm:pt-8">
          <TodaySection mealLine={FLAGS.mealGreetingC} extra={<>{!FLAGS.hideWeekSearch && <EveBar />}{!isNew && <div className={FLAGS.hideWeekSearch ? "" : "mt-5"}><TodayCard /></div>}</>} />
          {!FLAGS.goalLastC && (hasGoal(s) ? <GoalCardA /> : <GoalSection />)}
          {!isNew && (
            <PageSection id="week" eyebrow="This week · 28 Sep – 4 Oct" title="Your meals" action={<SectionLink href={`${planHref}${MEALS_ANCHOR}`}>Next week&apos;s box</SectionLink>}>
              <div className="lg:max-w-[720px]"><WeekList /></div>
            </PageSection>
          )}
          <EveSlotSection />
          <DeliverySection />
          {!isNew && !FLAGS.hideKeepGoing && (
            <PageSection id="month" eyebrow="Keep it going" title="Your progress">
              <div className="lg:max-w-[720px]"><Progress /></div>
            </PageSection>
          )}
          {!isNew && !FLAGS.hideWrapped && <WrappedBand />}
          {FLAGS.goalLastC && (hasGoal(s) ? <GoalCardA /> : <GoalSection />)}
        </div>
      </main>
    </CBare.Provider>
  );
}

/** Move day · Skip this box · Going away? as quiet text actions. `tone` = "dark" inside the delivery band. */
function DeliveryActions({ tone = "light", className = "" }: { tone?: "light" | "dark"; className?: string }) {
  const { s, set, toast, openSheet, openEve } = useStore();
  const d = s.delivery;
  if (d.status !== "active") return null;
  const skip = () => {
    set((x) => { x.delivery.status = "skipped"; });
    toast(`Skipped the ${d.label} box. Your rhythm is on hold, not reset.`, () => set((x) => { x.delivery.status = "active"; x.toasts = []; }));
  };
  const link = tone === "dark" ? "underline decoration-paper/40 underline-offset-4 hover:decoration-paper" : "underline decoration-line2 underline-offset-4 hover:text-ink hover:decoration-ink";
  return (
    <div className={`flex flex-wrap items-center gap-x-5 gap-y-2 text-[13.5px] ${tone === "dark" ? "text-paper/80" : "text-body"} ${className}`}>
      <button onClick={() => openSheet({ kind: "delivery" })} className={link}>Move day</button>
      <button onClick={skip} className={link}>Skip this box</button>
      <button onClick={() => openEve("pause")} className={link}>Going away?</button>
    </div>
  );
}

/** Where "edit your meals" links land in My Plan (the box editor in Next order when Meals is dropped). */
const MEALS_ANCHOR = FLAGS.planGoalOrderOnly ? "#order" : "#meals";

/** The single Eve slot, placed right after "Your week". Collapses when there's nothing to show. */
function EveSlotSection({ noCheckIn = false }: { noCheckIn?: boolean } = {}) {
  return <PageSection className="empty:hidden"><EveSlot noCheckIn={noCheckIn} /></PageSection>;
}

/** 1. Today: the greeting. */
/** In the slim copy the next box (date, time window, edit cut-off) is part of the greeting while it's coming. */
const boxInGreeting = (s: ReturnType<typeof useStore>["s"]) => FLAGS.deliveryInGreeting && s.delivery.status === "active";

/** `goalLine` (Variant B, slim copy): the headline mixes the next box with how far this week's goal is. */
function TodaySection({ extra, goalLine = false, mealLine = false }: { extra?: React.ReactNode; goalLine?: boolean; mealLine?: boolean } = {}) {
  const { s, p } = useStore();
  if (goalLine) return <TodayGoalSection />;
  if (mealLine) return <TodayMealSection extra={extra} />;
  const g = useGreeting();
  const hour = NOW.getHours();
  const hello = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const box = boxInGreeting(s);
  const isNew = s.customer === "new";
  return (
    <PageSection>
      <p className="text-[14px] text-stone">{hello}, {p.name}</p>
      {box ? (
        <>
          <h1 className="mt-1 font-serif text-[32px] leading-[1.08] text-ink sm:text-[40px]">
            {isNew ? "Your first box arrives" : "Your box arrives"} {fmtDay(s.delivery.date, { weekday: "long", day: "numeric", month: "long" })}.
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="text-[15px] text-body">{s.delivery.window}</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-signal px-3 py-1 text-[12.5px] font-medium text-ink"><Icon name="clock" className="size-3.5" /> Edit until tonight, 23:59</span>
          </div>
        </>
      ) : (
        <>
          <h1 className="mt-1 font-serif text-[32px] leading-[1.08] text-ink sm:text-[40px]">{g.title}</h1>
          {g.sub && <p className="mt-1.5 text-[15px] text-stone">{g.sub}</p>}
        </>
      )}
      {FLAGS.deliveryActionsInGreeting && <DeliveryActions className="mt-4" />}
      {extra && <div className="mt-5">{extra}</div>}
    </PageSection>
  );
}

/** Variant C (slim copy): the headline is about today's meal; the meal card follows right under it. */
function TodayMealSection({ extra }: { extra?: React.ReactNode }) {
  const { s, p } = useStore();
  const hour = NOW.getHours();
  const hello = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const day = s.weeks.this[TODAY_INDEX];
  const meals = day.slots.filter((x) => x.dishId);
  const main = meals.find((x) => !s.made[`${TODAY_INDEX}:${x.slot}`]) ?? meals[0];
  const d = main ? dish(main.dishId!) : null;
  const made = main ? !!s.made[`${TODAY_INDEX}:${main.slot}`] : false;
  const when = main?.slot === "dinner" ? "Dinner's sorted tonight" : main?.slot === "lunch" ? "Lunch is sorted today" : "Breakfast is sorted";
  const title = !d ? "Nothing from every today. Enjoy your own cooking."
    : made ? `Today's ${main!.slot} is done. Nice one.`
    : d.minutes ? `${when}, and it takes ${d.minutes} minutes.` : `${when}, and there's nothing to cook.`;
  return (
    <PageSection>
      <p className="text-[14px] text-stone">{hello}, {p.name}</p>
      <h1 className="mt-1 max-w-[22ch] font-serif text-[32px] leading-[1.08] text-ink sm:text-[40px]">{title}</h1>
      {extra && <div className="mt-5">{extra}</div>}
    </PageSection>
  );
}

function TodayGoalSection() {
  const { s, p, openSheet } = useStore();
  const planHref = usePlanHref();
  const hour = NOW.getHours();
  const hello = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const goal = hasGoal(s);
  const started = goal && s.customer !== "new" && s.planConfirmed;
  const label = goalInfo(s.goal).label;
  const eaten = Math.min(weekEaten(s), s.weeklyTarget);
  const target = s.weeklyTarget;
  // The headline is about the goal only; the next box sits in the line below it
  const title = !goal ? "Tell Eve your goal and she plans your meals around it."
    : !started ? `Your ${label} plan starts with your ${s.customer === "new" ? "first" : "next"} box.`
    : eaten >= target ? `This week's ${label} goal is done: ${target} of ${target} meals.`
    : `You're ${eaten} of ${target} meals into this week's ${label} goal.`;
  return (
    <PageSection>
      <p className="text-[14px] text-stone">{hello}, {p.name}</p>
      <h1 className="mt-1 max-w-[24ch] font-serif text-[28px] leading-[1.12] text-ink sm:text-[38px]">{title}</h1>
      {started && (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="flex gap-1" aria-hidden="true">
            {Array.from({ length: target }).map((_, i) => <span key={i} className={`h-2 w-6 rounded-full ${i < eaten ? "bg-ink" : "bg-ink/15"}`} />)}
          </div>
          <SectionLink href={`${planHref}#goal`}>Your goal</SectionLink>
        </div>
      )}
      {!goal && <Button className="mt-5" size="sm" onClick={() => openSheet({ kind: "quiz" })}>Answer Eve&apos;s questions</Button>}
    </PageSection>
  );
}

/** Priority: proactive moment → weekly check-in → tomorrow's fridge nudge. Never more than one. */
function EveSlot({ noCheckIn = false }: { noCheckIn?: boolean }) {
  const { s, set, toast, openSheet } = useStore();
  if (hasMoment(s)) return <MomentCard place="home" />;
  if (isNewCustomer(s)) return null;
  if (!noCheckIn && s.checkIn !== "done" && s.checkIn !== "later") {
    return (
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3 rounded-[20px] bg-moment p-4 sm:p-5">
        <EveFace className="size-10 shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-medium text-ink">How was last week?</p>
          <p className="text-[13px] text-stone">Your weekly check-in · about a minute</p>
        </div>
        <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto">
          <Button size="sm" variant="light" onClick={() => { set((d) => { d.checkIn = "later"; }); toast("No problem. Eve asks again tomorrow."); }}>Later</Button>
          <Button size="sm" onClick={() => openSheet({ kind: "checkinFlow" })}>Check in</Button>
        </div>
      </div>
    );
  }
  // Variant B (slim copy) also drops the fridge nudge; only proactive moments stay
  return noCheckIn ? null : <EveningNudge />;
}

/** 2. Your goal: the only goal-coloured section. */
function GoalSection() {
  const { s, openSheet } = useStore();
  const planHref = usePlanHref();
  if (!hasGoal(s)) return <PageSection><GoalProgress compact /></PageSection>;
  const g = goalInfo(s.goal);
  const eaten = weekEaten(s);
  const target = s.weeklyTarget;
  const isNew = s.customer === "new" || !s.planConfirmed;
  return (
    <PageSection>
      <Surface tone={goalBg(s.goal)}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="eyebrow">Your goal</p>
            <p className="mt-1 font-serif text-[26px] leading-tight text-ink sm:text-[30px]">{g.label}</p>
            <p className="mt-1 max-w-[52ch] text-[14px] leading-snug text-body">{g.hint}</p>
          </div>
          <Button size="sm" variant="light" onClick={() => openSheet({ kind: "goals" })}><Icon name="swap" className="size-4" /> Adjust</Button>
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-ink/10 pt-4">
          {isNew ? (
            <p className="text-[14px] text-body">Progress starts after your first week.</p>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex gap-1" aria-hidden="true">
                {Array.from({ length: target }).map((_, i) => <span key={i} className={`h-2 w-6 rounded-full ${i < eaten ? "bg-ink" : "bg-white/80"}`} />)}
              </div>
              <p className="text-[14px] text-body"><b className="font-medium text-ink">{eaten} of {target}</b> meals this week</p>
            </div>
          )}
          <SectionLink href={`${planHref}#goal`}>See your plan</SectionLink>
        </div>
        <p className="mt-2 text-[12.5px] text-stone">Missed meals never count against you.</p>
      </Surface>
    </PageSection>
  );
}

/** 3. Your week: meals, today first; edit lives in My Plan. */
function WeekSection() {
  const { s } = useStore();
  const planHref = usePlanHref();
  // Copy follows the meals in the week that's showing (this or next)
  const copy = weekCopy(s.weeks[s.week].flatMap((d) => d.slots.map((x) => x.dishId).filter((x): x is string => !!x)));
  return (
    <PageSection id="week" eyebrow={s.week === "next" ? "Next week · 5 – 11 Oct" : "Your week · 28 Sep – 4 Oct"} title={FLAGS.bareWeekA ? undefined : copy.title} action={<SectionLink href={`${planHref}${MEALS_ANCHOR}`}>Edit in My Plan</SectionLink>}>
      {!FLAGS.bareWeekA && copy.sub && <p className="-mt-2 mb-5 max-w-[56ch] text-[14.5px] leading-relaxed text-body">{copy.sub}</p>}
      <div className="space-y-6">
        {!FLAGS.hideWeekSearch && <SearchAsk />}
        <Plan />
      </div>
    </PageSection>
  );
}

/** Variant B's week: one swipeable set of meals, this week or next week's box. */
function WeekSectionB() {
  const { s } = useStore();
  const planHref = usePlanHref();
  const next = s.week === "next";
  return (
    <PageSection id="week" eyebrow={next ? "Next week · 5 – 11 Oct · your box" : "This week · 28 Sep – 4 Oct"} title={next ? "Next week's box" : "Your week of meals"} action={<SectionLink href={`${planHref}${MEALS_ANCHOR}`}>Edit in My Plan</SectionLink>}>
      <div className="space-y-6"><WeekMeals bare />{!FLAGS.hideWeekSearch && <SearchAsk />}</div>
    </PageSection>
  );
}

/** Variant B's Discover blocks, grouped under one section (sub-titles one step smaller). */
function DiscoverSection() {
  return (
    <PageSection id="discover" eyebrow="Discover every" title="New this season">
      <div className="space-y-10 [&_h2]:!text-[22px]">
        <div className="[&>section]:mx-0 [&>section]:rounded-[24px]"><SeasonalHero /></div>
        <MonthFavourite />
        <FullMenu />
        <TalkOfTheTable eve={FLAGS.bHomeFocus} />
        <Bundles eve={FLAGS.bHomeFocus} />
      </div>
    </PageSection>
  );
}

/** 4. Next delivery: one card with the box, the cut-off and the freezer status. */
function DeliverySection() {
  const { s } = useStore();
  if (boxInGreeting(s)) return null;
  return <DeliveryBand />;
}

/** Next delivery as a screen-wide dark band (LP/PDP style): date and cut-off, the box, the freezer, one primary action. */
function DeliveryBand() {
  const { s, set, toast, openSheet, openEve } = useStore();
  const planHref = usePlanHref();
  const d = s.delivery;
  const pr = boxPricing(s);
  const ms = CUTOFF.getTime() - NOW.getTime();
  const h = Math.floor(ms / 3.6e6), m = Math.round((ms % 3.6e6) / 6e4);
  const paused = d.status === "skipped" || d.status === "vacation";
  const title = d.status === "today" ? "Arrives today" : d.status === "cancelled" ? "No box on the way" : d.status === "vacation" ? "Your plan is on hold" : d.status === "skipped" ? "This box is skipped" : d.label;
  const where = FLAGS.slimDelivery ? "" : ` · ${ADDRESS}`;
  const line = d.status === "today" ? `Estimated ${d.window}${where}` : d.status === "cancelled" ? "Your plan, favourites and allergens stay saved." : d.status === "vacation" ? `Vacation mode until ${d.vacationUntil}. Your plan restarts on its own.` : d.status === "skipped" ? "No box this week. Your plan and rhythm are saved." : `${d.window}${where}`;
  const restart = () => { set((x) => { x.delivery = { ...DELIVERY_OPTIONS[0], status: "active", cadence: x.delivery.cadence }; }); toast("Your box is back on."); };
  const o = freezerOutlook(s);
  const link = "underline decoration-paper/40 underline-offset-4 hover:decoration-paper";
  return (
    <Band id="delivery" tone="bg-brown text-paper" label="Your next delivery">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start lg:gap-12">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-[11.5px] font-medium uppercase tracking-[.08em] text-paper/70">Coming up · your box</p>
            {d.status === "active" && <span className="inline-flex items-center gap-1.5 rounded-full bg-signal px-3 py-1 text-[12px] font-medium text-ink"><Icon name="clock" className="size-3.5" /> Edit until tonight, 23:59</span>}
          </div>
          <h2 className="mt-3 font-serif text-[36px] leading-[1.05] sm:text-[44px]">{title}</h2>
          <p className="mt-2 text-[14.5px] text-paper/80">{line}</p>
          {d.status === "active" && <p className="mt-1 text-[13px] text-paper/70">{h} h {m} min left to change meals, day or address</p>}
        </div>
        {/* In the slim copy an active box has nothing left on the right, so the column is skipped */}
        {!(FLAGS.slimDelivery && FLAGS.hideFreezerLine && FLAGS.deliveryActionsInGreeting && d.status === "active") && <div>
          {d.status !== "cancelled" && !paused && (
            <>
              {!FLAGS.slimDelivery && <>
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-[14.5px] font-medium">{pr.count} items in your box</p>
                <Link href={planHref} className={`text-[13px] text-paper/80 ${link}`}>{eur(pr.total)} · details</Link>
              </div>
              <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
                {pr.items.map(({ id, qty }) => (
                  <div key={id} className="relative shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={asset(dish(id).img)} alt={dish(id).name} className="size-16 rounded-2xl object-cover" />
                    {qty > 1 && <span className="absolute -right-1 -top-1 rounded-full bg-paper px-1.5 text-[11px] text-ink">×{qty}</span>}
                  </div>
                ))}
              </div>
              {pr.savings > 0 && <p className="mt-3 text-[13px] text-paper/80">You save {eur(pr.savings)} on this order.</p>}
              </>}
              {!isNewCustomer(s) && !FLAGS.hideFreezerLine && (
                <p className={`flex ${FLAGS.slimDelivery ? "" : "mt-3 border-t border-paper/15 pt-3"} flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-paper/80`}>
                  <Icon name="fridge" className="size-4" /> <b className="font-medium text-paper">{o.left} {o.left === 1 ? "meal" : "meals"}</b> in your freezer · lasts until {fmtDate(o.runsOut)}
                  {o.flag && !s.dismissed.includes(`freezer:${o.flag}`) && <Link href={`${planHref}#noticed`} className={`font-medium text-paper ${link}`}>{o.flag === "shortfall" ? "Runs out early. Eve has a fix" : "More than you need. Adjust"}</Link>}
                </p>
              )}
            </>
          )}
          {d.status === "today" ? (
            <div className="mt-5 grid grid-cols-2 gap-2">
              <button onClick={() => toast("Prototype: this would open the courier's tracking page.")} className="rounded-full bg-paper px-5 py-3 text-[14px] font-medium text-ink">Track delivery</button>
              <Link href={planHref} className="rounded-full border border-paper/40 px-5 py-3 text-center text-[14px] font-medium">See my box</Link>
            </div>
          ) : paused || d.status === "cancelled" ? (
            <button onClick={restart} className="mt-5 w-full rounded-full bg-paper px-5 py-3 text-[14px] font-medium text-ink lg:mt-0">{d.status === "cancelled" ? "Resume subscription" : d.status === "vacation" ? "I'm back early, restart now" : "Undo skip"}</button>
          ) : (
            <>
              {!FLAGS.slimDelivery && <Link href={`${planHref}${MEALS_ANCHOR}`} onClick={() => set((x) => { x.week = "next"; x.planView = "week"; })} className="mt-5 flex w-full items-center justify-center rounded-full bg-paper px-5 py-3 text-[14px] font-medium text-ink">Edit meals</Link>}
              {!FLAGS.deliveryActionsInGreeting && <DeliveryActions tone="dark" className="mt-4 justify-center" />}
            </>
          )}
        </div>}
      </div>
    </Band>
  );
}

function FreezerLine() {
  const { s } = useStore();
  const planHref = usePlanHref();
  if (isNewCustomer(s)) return null;
  const o = freezerOutlook(s);
  const flagged = o.flag && !s.dismissed.includes(`freezer:${o.flag}`);
  return (
    <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-line pt-3 text-[13px]">
      <Icon name="fridge" className="size-4 text-stone" />
      <span className="text-body"><b className="font-medium text-ink">{o.left} {o.left === 1 ? "meal" : "meals"}</b> in your freezer · lasts until {fmtDate(o.runsOut)}</span>
      {flagged && <Link href={`${planHref}#noticed`} className="font-medium text-ink underline decoration-line2 underline-offset-4">{o.flag === "shortfall" ? "Runs out early. Eve has a fix" : "More than you need. Adjust"}</Link>}
    </div>
  );
}

/** 5. Your month: rhythm, impact, Wrapped, perk ("Keep it going" + "Celebrate" in one place). */
function MonthSection() {
  return (
    <PageSection id="month" eyebrow="Keep it going" title="Your month with every">
      <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
        <Rhythm />
        <div className="space-y-4"><Impact noWrapped /><PerkCard /></div>
      </div>
    </PageSection>
  );
}

/** Every Wrapped as a screen-wide dark band (LP/PDP style). */
function WrappedBand() {
  const { p, openSheet } = useStore();
  const fav = dish(p.favourite);
  return (
    <Band id="wrapped" tone="bg-ink text-paper" label="Every Wrapped">
      <div className="grid items-center gap-8 sm:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
        <div className="max-w-[520px]">
          <p className="text-[11.5px] font-medium uppercase tracking-[.08em] text-paper/70">every Wrapped · September</p>
          <h2 className="mt-3 font-serif text-[36px] leading-[1.05] sm:text-[48px]">You&apos;re <em className="italic">{p.label}.</em></h2>
          <p className="mt-3 text-[15px] leading-relaxed text-paper/80">Your month in plants, favourites and time saved. Free, always.</p>
          <button onClick={() => openSheet({ kind: "wrapped" })} className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-paper px-5 py-3 text-[14px] font-medium text-ink">See your month <Icon name="chevron" className="size-4" /></button>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset(fav.img)} alt={`Your favourite: ${fav.name}`} className="order-first mx-auto size-48 rounded-full object-cover sm:order-none sm:size-64 lg:size-80" />
      </div>
    </Band>
  );
}

// =====================================================================================================
// MY PLAN
// =====================================================================================================

export function MyPlanA() { return <MyPlanSections />; }

/** My Plan for every variant. Variant A shows target numbers on the goal chips and keeps the discount milestones; B keeps the milestones; C stays simplest. */
export function MyPlanSections() {
  const { s } = useStore();
  const variant = variantOf(usePathname()).id;
  const isNew = isNewCustomer(s);
  const noticed = useNoticed();
  const moment = hasMoment(s);
  if (s.delivery.status === "cancelled") return <Cancelled milestones />;
  const nav = FLAGS.planGoalOrderOnly ? [{ id: "goal", label: "Goal" }, { id: "order", label: "Next order" }] : [
    { id: "goal", label: "Goal" },
    ...(noticed.length || moment ? [{ id: "noticed", label: "Eve noticed" }] : []),
    ...(!isNew ? [{ id: "meals", label: "Meals" }] : []),
    { id: "order", label: "Next order" },
    { id: "subscription", label: "Subscription" },
  ];
  return (
    <main className="mx-auto max-w-[1120px] px-4 pb-6 sm:px-6">
      {/* B only copy: no section tabs, the page is just goal and next order */}
      {!ONLY_B && <SectionNav items={nav} />}
      <div className="space-y-8 pt-6">
        {hasGoal(s) ? <PlanGoalSectionA /> : <PlanGoalSection />}
        {(noticed.length > 0 || moment) && <NoticedSection items={noticed} />}
        {!isNew && !FLAGS.planGoalOrderOnly && <MealsSection />}
        <OrderSection milestones={variantOf(usePathname()).id !== "c"} />
        {!FLAGS.planGoalOrderOnly && <SubscriptionSection />}
      </div>
    </main>
  );
}

/** 1. Your goal, with the 4-week progress folded in. */
function PlanGoalSection() {
  const { s, openSheet } = useStore();
  const [why, setWhy] = useState(false);
  const isNew = isNewCustomer(s);
  if (!hasGoal(s)) {
    return (
      <PageSection id="goal">
        <Surface>
          <p className="eyebrow">Your plan</p>
          <h1 className="mt-1 font-serif text-[30px] leading-tight text-ink sm:text-[34px]">{isNew ? "Your plan starts here" : "Your starter plan"}</h1>
          <p className="mt-2 max-w-[60ch] text-[14.5px] leading-relaxed text-body">{isNew ? "Your first box is on its way. Answer Eve's questions and she builds your meal plan around your goal, your week and what you like." : "Eve picked balanced, popular meals to get you started. Answer her questions and the plan is shaped around your goal."}</p>
          <Button className="mt-5" onClick={() => openSheet({ kind: "quiz" })}>Answer Eve&apos;s questions</Button>
        </Surface>
      </PageSection>
    );
  }
  const g = goalInfo(s.goal);
  const hist = weeklyHistory(s);
  const target = s.weeklyTarget;
  const month = hist.reduce((a, b) => a + b, 0);
  const pct = Math.round((month / (target * 4)) * 100);
  const household = s.quiz.household && s.quiz.household !== "me";
  // Target numbers openly in Variant A; one tap deep (chip drawer) in B and C
  const openNumbers = variantOf(usePathname()).id === "a";
  return (
    <PageSection id="goal">
      <Surface tone={goalBg(s.goal)}>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0">
            <div className="flex items-start justify-between gap-3">
              <p className="eyebrow">Your goal · {g.label}</p>
              <SectionLink onClick={() => openSheet({ kind: "quiz", goalOnly: true })}>Change goal</SectionLink>
            </div>
            <h1 className="mt-2 font-serif text-[30px] leading-[1.1] text-ink sm:text-[36px]">{g.title}</h1>
            <p className="mt-1 text-[13px] text-stone">{s.weeklyTarget} meals a week · plan for 1 person{household ? " · your box can still feed more people" : ""}{s.goalFrom ? ` · new goal from ${s.goalFrom}` : ""}</p>
            <p className={`mt-3 max-w-[62ch] text-[14.5px] leading-relaxed text-body ${why ? "" : "line-clamp-3"}`}>{g.message || g.hint}</p>
            <div className="mt-4 flex flex-wrap gap-2" aria-label="Your focus">
              {g.chips.map((c) => (
                <button key={c.key} onClick={() => openSheet({ kind: "chip", key: c.key })} className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1.5 text-[13px] font-medium text-ink hover:bg-white">
                  {c.label}{openNumbers && <span className="font-normal text-stone">· {c.target.split(" ").slice(0, 2).join(" ")}</span>}
                </button>
              ))}
            </div>
            <button onClick={() => setWhy((v) => !v)} aria-expanded={why} className="mt-4 flex items-center gap-1.5 text-[13px] font-medium text-ink">
              <Icon name="info" className="size-4" /> {why ? "Show less" : "Read more · why this works"} <Icon name="chevronDown" className={`size-3.5 transition ${why ? "rotate-180" : ""}`} />
            </button>
            {why && g.science && <p className="mt-2 max-w-[62ch] text-[13.5px] leading-relaxed text-body">{g.science}</p>}
            <DeepDiveNudge />
          </div>
          {/* Progress, folded into the goal */}
          <div className="rounded-[20px] bg-white/70 p-4">
            <p className="eyebrow">Progress</p>
            <div className="mt-3 grid grid-cols-4 items-end gap-2" style={{ height: 72 }} aria-hidden="true">
              {hist.map((n, i) => (
                <div key={i} className="flex h-full flex-col items-center justify-end gap-1">
                  <span className="text-[11px] text-stone">{n}/{target}</span>
                  <div className={`w-full max-w-[36px] rounded-t-md ${i === 3 ? "bg-ink" : "bg-ink/35"}`} style={{ height: Math.max(5, Math.min(1, n / target) * 52) }} />
                </div>
              ))}
            </div>
            <div className="mt-1 grid grid-cols-4 gap-2 text-center text-[10.5px] text-stone">{["3 wks", "2 wks", "Last", "This"].map((l) => <span key={l}>{l}</span>)}</div>
            <p className="mt-3 text-[14px] text-body"><b className="font-medium text-ink">{month} of {target * 4}</b> this month · {pct}% on track</p>
            <p className="mt-1 text-[12.5px] text-stone">Missed meals never count against you.</p>
          </div>
        </div>
      </Surface>
    </PageSection>
  );
}

type Noticed = { key: string; icon: "fridge" | "swap" | "plus" | "heart" | "spark"; text: string; why?: string; cta: string; run: () => void; dismiss: string };

/** One list for everything Eve flags: freezer gap/surplus, pre-delivery suggestions and plan signals (max 3). */
function useNoticed(): Noticed[] {
  const { s, set, toast, track } = useStore();
  const signals = useSignals();
  const pre = usePreDeliveryItems();
  const out: Noticed[] = [];
  if (!isNewCustomer(s) && s.delivery.status === "active") {
    const o = freezerOutlook(s);
    const key = `freezer:${o.flag}`;
    if (o.flag === "shortfall" && !s.dismissed.includes(key)) out.push({ key, icon: "fridge", text: `Your box runs out ${o.gapDays} days before the next one arrives.`, why: `Freezer: ${o.left} meals, lasts until ${fmtDate(o.runsOut)}.`, cta: "Bring delivery forward", dismiss: key, run: () => { set((d) => { d.delivery.date = "2026-10-01"; d.delivery.label = "Thu 1 Oct"; d.boxState = "aligned"; d.dismissed.push(key); }); track("SHORTFALL_bring_forward"); toast("Delivery moved to Thu 1 Oct. No gap now."); } });
    if (o.flag === "surplus" && !s.dismissed.includes(key)) out.push({ key, icon: "fridge", text: `You'll still have about ${o.leftAtDelivery} meals when the next box arrives.`, why: "Push the delivery, or eat a little more from your plan.", cta: "Push delivery a week", dismiss: key, run: () => { set((d) => { d.delivery.date = "2026-10-08"; d.delivery.label = "Thu 8 Oct"; d.dismissed.push(key); }); track("SURPLUS_push"); toast("Next delivery pushed to Thu 8 Oct."); } });
  }
  pre.forEach((x) => out.push({ key: x.k, icon: x.icon, text: x.t, why: x.why, cta: x.cta, run: x.run, dismiss: x.k }));
  signals.forEach((x) => out.push({ key: x.key, icon: "spark", text: x.text, cta: x.cta, run: x.run, dismiss: `sig:${x.key}` }));
  return out.slice(0, 3);
}

/** 2. Eve noticed: the one moment card (if any) plus at most three actionable rows. */
function NoticedSection({ items }: { items: Noticed[] }) {
  const { s, set } = useStore();
  return (
    <PageSection id="noticed" eyebrow="Eve noticed" title="Worth a look this week">
      <div className="space-y-3">
        {hasMoment(s) && <MomentCard place="plan" />}
        {items.length > 0 && (
          <Surface className="!p-0">
            <ul className="divide-y divide-line">
              {items.map((x) => (
                <li key={x.key} className="flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3.5 sm:px-5">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-offwhite text-ink"><Icon name={x.icon} className="size-4" /></span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[14.5px] text-ink">{x.text}</span>
                    {x.why && <span className="text-[12.5px] text-stone">{x.why}</span>}
                  </span>
                  <span className="flex items-center gap-1">
                    <Button size="sm" variant="outline" onClick={x.run}>{x.cta}</Button>
                    <button aria-label="Dismiss" onClick={() => set((d) => { d.dismissed.push(x.dismiss); })} className="grid size-8 place-items-center rounded-full text-stone hover:bg-offwhite"><Icon name="close" className="size-3.5" /></button>
                  </span>
                </li>
              ))}
            </ul>
          </Surface>
        )}
      </div>
    </PageSection>
  );
}

/** 3. Your meals: week ↔ calendar, the core of the page. */
function MealsSection() {
  const { s } = useStore();
  return (
    <PageSection id="meals" eyebrow="Your meals" title={s.planView === "week" ? "Week by week" : "Month view"} action={<PlanViewToggle />}>
      <Surface className="!pt-1 sm:!pt-2"><PlanViewBody /></Surface>
      {s.planView === "calendar" && s.calMonth === 1 && <div className="mt-3"><AheadBanner /></div>}
    </PageSection>
  );
}

/** 4. Next order: delivery, box, price, discounts, add-ons (the dark hero is folded in here). */
function OrderSection({ milestones = true }: { milestones?: boolean }) {
  const { s, openSheet } = useStore();
  const d = s.delivery;
  const today = d.status === "today";
  return (
    <PageSection id="order" eyebrow="Next order" title={today ? "Arrives today" : d.status === "vacation" ? "On hold" : d.status === "skipped" ? "This box is skipped" : d.label}
      action={!today && d.status === "active" ? <SectionLink onClick={() => openSheet({ kind: "delivery" })}>Change date</SectionLink> : undefined}>
      {/* Mobile: delivery + box → price → add-ons. Desktop: box and add-ons left, price right. */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
        <Surface className="lg:col-start-1">
          <DeliveryRow />
          <div className="mt-4 border-t border-line pt-4"><BoxCard editable={!today} flat /></div>
        </Surface>
        <Surface className="space-y-5 !px-0 sm:!px-2 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <Pricing upsell={!today} />
          {milestones && <div className="border-t border-line px-4 pt-5"><Milestones transparent /></div>}
        </Surface>
        {!today && <div className="lg:col-start-1"><Addons title="Add to your box" /></div>}
      </div>
    </PageSection>
  );
}

function DeliveryRow() {
  const { s, set, toast } = useStore();
  const d = s.delivery;
  const ms = CUTOFF.getTime() - NOW.getTime();
  const h = Math.floor(ms / 3.6e6), m = Math.round((ms % 3.6e6) / 6e4);
  if (d.status === "today") {
    return (
      <div className="space-y-3">
        <p className="text-[14.5px] text-body">Estimated {d.window} · {ADDRESS}</p>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[14px] text-ink">SMS updates
            <div className="flex rounded-full bg-offwhite p-0.5 text-[13px]" role="radiogroup" aria-label="SMS notifications">
              {[false, true].map((v) => (
                <button key={String(v)} role="radio" aria-checked={s.sms === v} onClick={() => { set((x) => { x.sms = v; }); toast(v ? "We'll text you when the courier is close." : "SMS updates off."); }}
                  className={`rounded-full px-3 py-1 font-medium ${s.sms === v ? "bg-ink text-paper" : "text-ink"}`}>{v ? "Yes" : "No"}</button>
              ))}
            </div>
          </div>
          <Button size="sm" variant="outline" onClick={() => toast("Prototype: this would open the courier's tracking page.")}><Icon name="truck" className="size-4" /> Track delivery</Button>
        </div>
      </div>
    );
  }
  if (d.status === "skipped" || d.status === "vacation") {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[14.5px] text-body">{d.status === "vacation" ? `Vacation mode until ${d.vacationUntil}. Your plan restarts on its own.` : "No box this week. Your plan and rhythm are saved."}</p>
        <Button size="sm" onClick={() => { set((x) => { x.delivery.status = "active"; x.delivery.vacationUntil = undefined; }); toast("Your box is back on."); }}>Restart deliveries</Button>
      </div>
    );
  }
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-[14.5px] text-body">{d.window} · {ADDRESS}</p>
      <span className="inline-flex items-center gap-1.5 rounded-full bg-signal px-3 py-1 text-[12.5px] font-medium text-ink"><Icon name="clock" className="size-3.5" /> {h} h {m} min left to edit</span>
    </div>
  );
}

/** 5. Subscription: settings, pause/skip/cancel, then referral last. */
function SubscriptionSection() {
  return (
    <PageSection id="subscription" eyebrow="Subscription" title="Your subscription">
      <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
        <Surface><SubscriptionDetails bare /></Surface>
        <Referral />
      </div>
    </PageSection>
  );
}

