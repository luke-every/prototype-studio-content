"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Allergen, asset, goalBg, groupBg, Q1_GROUP, buildWeek, DAY_NAMES, dish, goalFromQuiz, goalInfo, missingQuestions, NEXT_MONDAY, persona,
  Quiz as QuizT, scheduleFromQuiz, THIS_MONDAY,
} from "@/lib/data";
import { useStore } from "@/lib/store";
import { FLAGS } from "@/lib/flags";
import { EveFigure } from "./eve-mark";
import { usePathname } from "next/navigation";
import { variantOf } from "./top";

/**
 * Eve quiz (Miro 02.10.2026 "Eve Quiz") in the visual style of the Figma "Website" onboarding quiz (node 5661:28220):
 * full-screen steps, back · progress · close bar, Newsreader headlines, option tiles and rows with an orange
 * selected state, the emoji satisfaction slider, sticky dark CONTINUE pill, paper-coloured interstitials,
 * the "Going over your responses" loader and the returning-user "Welcome back" screen.
 * Logic: only missing questions are asked; "Skip for now" just closes (no starter plan); then rhythm → goal → plan preview.
 */

type Step =
  | "q1" | "q1a" | "watch" | "satisfaction" | "challenges" | "household" | "meals" | "days" | "occasions"
  | "eater" | "picky" | "dislikes" | "fitness" | "cantHave";

/** Eve Account Quiz (Miro 13.10.2026): main path, and the postpartum path with "can't have" moved to Q3. */
const ORDER: Step[] = ["q1", "q1a", "fitness", "watch", "satisfaction", "challenges", "household", "meals", "days", "occasions", "eater", "picky", "dislikes"];
/** The questions that generate the goal (Miro 05.10 goal routing). */
const GOAL_STEPS: Step[] = ["q1", "q1a", "fitness"];
const ORDER_POSTPARTUM: Step[] = ["q1", "watch", "cantHave", "satisfaction", "challenges", "household", "meals", "days", "occasions", "eater", "picky"];

type Opt = { v: string; label: string; emoji?: string; img?: string; sub?: string };

const Q1: Opt[] = [
  { v: "eat", label: "Eating well & healthy", emoji: "🥗" },
  { v: "gut", label: "Support my gut", emoji: "🌱" },
  { v: "lose", label: "Lose weight", img: "/quiz/q1-lighter.png" },
  { v: "fitness", label: "Nutrition for fitness", img: "/quiz/q1-protein.png" },
  { v: "postpartum", label: "Post-partum", img: "/quiz/q1-baby.png" },
];
const Q1A: Opt[] = [
  { v: "lighter", label: "I want to feel lighter and have more energy", emoji: "🪶" },
  { v: "doctor", label: "My doctor or a health professional has recommended it", emoji: "🩺" },
  { v: "gained", label: "I've put on weight recently and want to get back on track", emoji: "🔁" },
  { v: "maintain", label: "I want to maintain my weight & feel more comfortable in my body", emoji: "🌿" },
];
const FITNESS: Opt[] = [
  { v: "lean", label: "Stay lean & healthy", emoji: "🏃" },
  { v: "muscle", label: "Build more muscle", emoji: "💪" },
  { v: "energy", label: "More energy overall", emoji: "⚡" },
];
const WATCH: Opt[] = [
  { v: "Getting more protein", label: "Getting more protein", emoji: "🧬" },
  { v: "Consuming more calories", label: "Consuming more calories", emoji: "🔥" },
  { v: "Eating more fibre", label: "Eating more fibre", emoji: "🫛" },
  { v: "Keeping portions in check", label: "Keeping portions in check", emoji: "🥣" },
  { v: "Lowering my sugar intake", label: "Lowering my sugar intake", emoji: "🍬" },
  { v: "Diabetes friendly food", label: "Diabetes friendly food", emoji: "🌟" },
  { v: "Eating more plant-based", label: "Eating more plant-based", emoji: "🥬" },
  { v: "Nothing in particular", label: "Nothing in particular", emoji: "🎲" },
];
const CHALLENGES: Opt[] = [
  { v: "Finding time to cook", label: "Finding time to cook", emoji: "🕰️" },
  { v: "Deciding what to eat", label: "Deciding what to eat", emoji: "🤔" },
  { v: "Eating a balanced diet", label: "Eating a balanced diet", emoji: "⚖️" },
  { v: "Wasting food", label: "Wasting food", emoji: "🗑️" },
  { v: "Cooking isn't my thing", label: "Cooking isn't my thing", emoji: "🍱" },
  { v: "Eating well on a budget", label: "Eating well on a budget", emoji: "💵" },
];
const HOUSEHOLD: Opt[] = [
  { v: "me", label: "Just me", emoji: "🧍" },
  { v: "partner", label: "Me and my partner", emoji: "👫" },
  { v: "family", label: "Family with kids", emoji: "👨‍👩‍👧" },
  { v: "roommates", label: "Me and my roommates", emoji: "🏠" },
  { v: "other", label: "Other", emoji: "✏️" },
];
const MEALS: Opt[] = [
  { v: "3", label: "3 meals a week", sub: "Start a routine", emoji: "🌱" },
  { v: "4", label: "4 meals a week", sub: "Build a routine", emoji: "🌿" },
  { v: "5", label: "5 meals a week", sub: "Make it your lifestyle", emoji: "🌳" },
];
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const OCC: Opt[] = [
  { v: "breakfast", label: "Breakfast", emoji: "🥐" },
  { v: "lunch", label: "Lunch", emoji: "🥗" },
  { v: "dinner", label: "Dinner", emoji: "🍲" },
  { v: "snacks", label: "Snacks", emoji: "🍎" },
];
const EATER: Opt[] = [
  { v: "I love trying new tastes", label: "I love trying new tastes", emoji: "🌶️" },
  { v: "I like sticking to my favourites", label: "I like sticking to my favourites", emoji: "❤️" },
  { v: "A mix of staples and new things", label: "A mix of staples and new things", emoji: "🔀" },
  { v: "I keep it simple - quick and easy", label: "I keep it simple - quick and easy", emoji: "⚡" },
];
const PICKY: Opt[] = [
  { v: "particular", label: "I'm quite particular — there's a fair bit I don't eat", emoji: "🧐" },
  { v: "few", label: "I enjoy most foods, with a few exceptions", emoji: "🙂" },
  { v: "anything", label: "I'll happily eat almost anything", emoji: "😋" },
];
const SAT = [
  { emoji: "😟", label: "Not satisfied" },
  { emoji: "🤔", label: "Could be better" },
  { emoji: "😅", label: "Somewhat satisfied" },
  { emoji: "☺️", label: "Mostly satisfied" },
  { emoji: "🤩", label: "Very satisfied" },
];
/** Eve per satisfaction level: cold → lazy → leaf → spoon → happy tummy. */
const SAT_EVE = ["cold", "lazy", "leaf", "spoon", "happy-tummy"];

/** One of the Eve brand illustrations (Air board "Eve (brand character)"), transparent line art. */
function EveArt({ name, className = "", strong = false, level }: { name: string; className?: string; strong?: boolean; level?: number }) {
  // "icon-…" = a storytelling icon from the Air board (thinner, so shown smaller than Eve)
  const icon = name.startsWith("icon-");
  const src = asset(icon ? `/eve/${name}.png` : `/eve/eve-${name}.png`);
  const still = useReducedMotion();
  if (!FLAGS.quizSplash) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt="" aria-hidden="true" className={`block w-auto object-contain ${className} ${icon ? "scale-[.72]" : ""}`} />;
  }
  // Each illustration starts on its own blob, then slowly morphs through the others
  const start = [...name].reduce((a, c) => a + c.charCodeAt(0), 0) % SPLASH.length;
  const loop = [0, 1, 2, 0].map((k) => SPLASH[(start + k) % SPLASH.length]);
  // Satisfaction scale: the splash grows and deepens with the score (level 1–5)
  const grow = level ? 0.86 + level * 0.05 : 1;
  const alpha = level ? 0.2 + level * 0.05 : 0.32;
  const flag = strong ? { "data-strong": "" } : {};
  return (
    <span className={`relative block w-fit ${className}`} aria-hidden="true">
      <span className="absolute left-1/2 top-[54%] h-[66%] w-[66%] transition-transform duration-500" style={{ transform: `translate(-50%, -50%) scale(${grow})` }}>
        <svg viewBox="0 0 200 200" className="eve-splash size-full overflow-visible text-orange" {...flag}>
          <path d={loop[0]} fill="currentColor" fillOpacity={alpha}>
            {!still && <animate attributeName="d" dur="7s" repeatCount="indefinite" values={loop.join(";")} calcMode="spline" keySplines="0.45 0 0.55 1;0.45 0 0.55 1;0.45 0 0.55 1" />}
          </path>
          <circle cx="182" cy="30" r="6" fill="currentColor" fillOpacity={0.45} />
          <circle cx="20" cy="172" r="4" fill="currentColor" fillOpacity={0.45} />
        </svg>
      </span>
      <span className="eve-enter relative block h-full" {...flag}>
        <span className="eve-idle block h-full" {...(icon ? { "data-icon": "" } : {})}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" className={`block h-full w-auto object-contain ${icon ? "scale-[.72]" : ""}`} />
        </span>
      </span>
    </span>
  );
}

/** Orange splashes behind the quiz illustrations (design-system orange). Same command structure so they can morph. */
const SPLASH = [
  "M100 20C150 18 184 56 180 100C176 146 140 182 96 180C52 178 18 144 20 100C22 56 54 22 100 20Z",
  "M104 24C146 14 188 50 178 98C168 144 146 176 100 182C56 188 14 150 22 102C30 58 62 32 104 24Z",
  "M96 18C144 24 176 60 182 104C188 148 138 184 92 176C48 168 16 136 24 92C30 52 60 14 96 18Z",
];

function useReducedMotion() {
  const [r, setR] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setR(m.matches);
    const on = () => setR(m.matches);
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);
  return r;
}

/**
 * Personalised facts (slim copy). Wording is taken from the Miro goals board (05.10.2026): the science snippets,
 * motivational messages, "every's contribution" and the catalogue averages. No new claims.
 */
const GOAL_FACT: Record<string, { head: string; sub: string; art: string }> = {
  balanced: { head: "Consistent, balanced eating is one of the strongest long-term predictors of wellbeing.", sub: "Not perfection, not tracking, just variety. Every meal in your plan covers all the main food groups.", art: "icon-bowl" },
  gut: { head: "Eating 30+ different plants a week is linked to greater microbiome diversity.", sub: "every meals average 6–8 plant sources per dish, so three a week already cover roughly 20 of your 30.", art: "icon-gut" },
  lose: { head: "Protein and fibre are the two nutrients most consistently linked to feeling full.", sub: "Your plan puts both first at every meal, without asking you to track, count or restrict.", art: "happy-tummy" },
  maintain: { head: "People who keep a healthy weight long-term eat a varied, satisfying diet, not a perfect one.", sub: "Three meals a week from every means three decisions already made well.", art: "icon-variety" },
  lean: { head: "Protein works best spread across the week, not in one big meal.", sub: "Every high-protein meal in your plan hits 25 g+. Four a week give you around 100 g from your main meals.", art: "icon-protein" },
  energy: { head: "Carbohydrates are your body's preferred fuel for training, not something to avoid.", sub: "Four meals a week from every cover around 2,000 calories of solid, whole-food energy.", art: "icon-kcal" },
  muscle: { head: "Building muscle while training needs enough protein and enough calories, together.", sub: "Four meals a week from every give you 100 g+ protein and 2,000+ calories from whole, plant-based food.", art: "icon-protein" },
  postpartum: { head: "Iron, folate and enough calories are the nutrients that matter most after birth.", sub: "Lentil dishes, the strongest iron and folate sources on the menu, come first in your plan.", art: "icon-dal" },
};

/** A catalogue fact for the first thing they watch for (board: catalogue averages per portion). */
function watchFact(watch: string[]) {
  const w = watch.find((x) => x !== "Nothing in particular");
  switch (w) {
    case "Getting more protein": return "You watch your protein: every meals average 20 g per portion.";
    case "Consuming more calories": return "You want more energy: every meals average about 490 kcal, and go up to 750.";
    case "Eating more fibre": return "You watch your fibre: every meals average 11 g per portion.";
    case "Keeping portions in check": return "You keep portions in check: each meal is one measured portion, about 490 kcal on average.";
    case "Lowering my sugar intake": return "You watch your sugar: every meals average about 12 g per portion.";
    case "Eating more plant-based": return "You want more plants: every dish is fully plant-based, with 6–8 plant sources.";
    default: return null;
  }
}

/** Interstitial after Q4, one per challenge (Figma benefit screens). */
const BENEFIT: Record<string, { title: string; sub: string; img: string; eve: string }> = {
  "Finding time to cook": { title: "All of our meals are ready in 10 minutes", sub: "No prep, no planning.", img: dish("gnocchi").img, eve: "icon-stopwatch" },
  "Deciding what to eat": { title: "All the planning is done for you", sub: "A routine that runs itself.", img: dish("paella").img, eve: "lazy" },
  "Eating a balanced diet": { title: "Every meal is pre-portioned and balanced.", sub: "Containing around 20 ingredients.", img: dish("quinoa").img, eve: "cubes" },
  "Wasting food": { title: "Meals are delivered to your door", sub: "Frozen. Ready when you are.", img: dish("dal").img, eve: "icon-delivery" },
  "Cooking isn't my thing": { title: "All cooking is done for you, by us.", sub: "Heat, plate, done. All in under 10 minutes.", img: dish("bolognese").img, eve: "spoon" },
  "Eating well on a budget": { title: "From just 5,43 € per meal", sub: "Your plan is flexible: skip or cancel anytime.", img: dish("taco").img, eve: "happy" },
};

/** What the plan does, shown on the quiz's first screen (plan onboarding for new customers). */
const PLAN_POINTS = [
  "A weekly plan built on your goal",
  "No logging, meals count on their day",
  "A one-minute check-in each week",
];

function applies(step: Step, q: QuizT) {
  if (step === "q1a") return q.q1 === "lose";
  if (step === "fitness") return q.q1 === "fitness";
  if (step === "dislikes") return q.picky !== "anything";
  return true;
}

type Screen =
  | { k: "intro" } | { k: "q"; step: Step } | { k: "usp" } | { k: "benefit" }
  | { k: "loading" } | { k: "rhythm" } | { k: "goal" } | { k: "preview" };

/** `goalOnly` ("Adjust goal"): only the questions that generate the goal (Q1 + its weight or fitness follow-up), then the goal screen. */
export function Quiz({ onClose, goalOnly = false }: { onClose: () => void; goalOnly?: boolean }) {
  const { s, p, set, toast, track } = useStore();
  const missing = missingQuestions(s.quiz);
  // "Welcome back" only when some answers are already on file and a few are missing
  const answeredAny = !!s.quiz.q1 || s.quiz.watch.length > 0 || !!s.quiz.meals || !!s.quiz.household;
  const returning = answeredAny && missing.length > 0;
  const [q, setQ] = useState<QuizT>(() => structuredClone(s.quiz));
  const exclude: Allergen[] = s.exclude;
  const [mode, setMode] = useState<"missing" | "all">(returning ? "missing" : "all");
  const order = q.q1 === "postpartum" ? ORDER_POSTPARTUM : ORDER;
  const steps = useMemo(() => goalOnly ? GOAL_STEPS.filter((st) => applies(st, q)) : order.filter((st) => applies(st, q) && (mode === "all" || missing.includes(st) || ((st === "dislikes" || st === "cantHave") && missing.includes("picky")))), [q, mode, missing, order, goalOnly]);
  const variant = variantOf(usePathname()).id;
  const [showTargets, setShowTargets] = useState(variant === "a");

  // Screen sequence: intro → questions with two interstitials (after Q1: stat, after Q4: benefit) → loader → plan screens
  const flow = useMemo<Screen[]>(() => {
    if (goalOnly) return [...steps.map((st) => ({ k: "q" as const, step: st })), { k: "goal" as const }];
    const out: Screen[] = [{ k: "intro" }];
    steps.forEach((st) => {
      out.push({ k: "q", step: st });
      // Personalised: the fact follows the goal questions (Q1 + follow-up), so it can speak to the goal
      const lastGoalQ = steps.filter((x) => GOAL_STEPS.includes(x)).pop();
      if (mode === "all" && (FLAGS.personalisedFacts ? st === lastGoalQ : st === "q1")) out.push({ k: "usp" });
      if (st === "challenges" && q.challenges.length) out.push({ k: "benefit" });
    });
    out.push({ k: "loading" }, { k: "rhythm" }, { k: "goal" }, { k: "preview" });
    return out;
  }, [steps, mode, q.challenges.length, goalOnly]);
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState<"fwd" | "back">("fwd");
  const screen = flow[Math.min(idx, flow.length - 1)];
  const qCount = flow.filter((x) => x.k !== "intro").length;

  const goal = goalFromQuiz(q);
  const g = goalInfo(goal);
  const preview = buildWeek({ ...persona(s.personaId), goal, exclude, schedule: scheduleFromQuiz(q) }, NEXT_MONDAY);

  const go = (n: number) => { setDir(n > idx ? "fwd" : "back"); setIdx(Math.max(0, Math.min(flow.length - 1, n))); };
  const next = () => go(idx + 1);
  const back = () => (idx === 0 ? onClose() : go(idx - 1));
  const upd = (patch: Partial<QuizT>) => setQ((x) => ({ ...x, ...patch }));
  const toggle = <T,>(arr: T[] | null, v: T) => ((arr ?? []).includes(v) ? (arr ?? []).filter((x) => x !== v) : [...(arr ?? []), v]);
  // Single-select screens auto-advance after a short beat so the selection is visible (Figma annotation, 0.6 s).
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const pickAndGo = (patch: Partial<QuizT>, advance = true) => {
    upd(patch);
    if (timer.current) clearTimeout(timer.current);
    if (advance) timer.current = setTimeout(() => { setDir("fwd"); setIdx((i) => i + 1); }, 600);
  };

  const answered = (st: Step) => {
    switch (st) {
      case "q1": return !!q.q1;
      case "q1a": return !!q.q1a;
      case "fitness": return !!q.fitness;
      case "watch": return q.watch.length > 0;
      case "satisfaction": return q.satisfaction !== null;
      case "challenges": return q.challenges.length > 0;
      case "household": return !!q.household && (q.household !== "other" || !!q.householdOther.trim());
      case "meals": return !!q.meals;
      case "occasions": return !!q.occasions?.length;
      case "eater": return !!q.eater;
      case "picky": return !!q.picky;
      default: return true;
    }
  };

  const finish = () => {
    const sched = scheduleFromQuiz(q);
    set((d) => {
      d.quiz = { ...q, days: q.days?.length ? q.days : [0, 1, 2, 3, 4] };
      d.goal = goal; d.planGoal = goal; d.goalFrom = null;
      d.weeklyTarget = q.meals ?? g.baseMeals;
      const pp = { ...persona(d.personaId), goal, exclude, schedule: sched };
      d.weeks.this = buildWeek(pp, THIS_MONDAY);
      d.weeks.next = buildWeek(pp, NEXT_MONDAY, 2);
      d.planConfirmed = true;
      if (d.customer === "new") d.customer = "active";
      d.sheet = null;
    });
    track("onboarding:set_up_first_week");
    toast("Your first week is set up. You'll find it in My Plan.");
  };
  // Skip just closes: nothing is built, no starter plan. Eve's questions stay available from Home and My Plan.
  /** Adjust goal: save the goal answers; a different goal shapes the plan from the next order (1 Oct). */
  const applyGoal = () => {
    const changed = goal !== s.goal;
    set((d) => {
      d.quiz = { ...d.quiz, q1: q.q1, q1a: q.q1a, fitness: q.fitness };
      if (changed) {
        d.goal = goal;
        d.goalFrom = "1 Oct";
        d.weeklyTarget = Math.max(goalInfo(goal).baseMeals, d.weeklyTarget);
        d.weeks.next = buildWeek({ ...persona(d.personaId), goal, exclude: d.exclude, schedule: scheduleFromQuiz(d.quiz) }, NEXT_MONDAY, 2);
      }
      d.sheet = null;
    });
    track(changed ? `adjust_goal:${goal}` : "adjust_goal:kept");
    toast(changed ? `Goal updated: ${g.label}. Your plan follows it from 1 Oct.` : `Your goal stays ${g.label.toLowerCase()}.`);
  };

  const skip = () => {
    set((d) => { d.sheet = null; });
    track("onboarding:skipped");
    toast("No problem. Eve's questions are here whenever you're ready.");
  };

  // ---------- Intro / returning ----------
  if (screen.k === "intro") {
    if (returning && mode === "missing") {
      return (
        <Shell tone="paper" onClose={onClose} hideNav cta={<>
          <Cta onClick={next}>Continue</Cta>
          <Cta variant="light" onClick={() => { setMode("all"); setQ(structuredClone(s.quiz)); }}>Start over</Cta>
        </>}>
          <Center>
            {FLAGS.eveIllustrations ? <EveArt name={FLAGS.quizSplash ? "happy" : "happy-tummy"} className="mx-auto h-[240px]" /> : <Collage />}
            <h1 className="mt-10 text-center font-quiz text-[37px] leading-[1.16] tracking-[-0.01em] text-quiz-ink">Welcome back</h1>
            <p className="mx-auto mt-2 max-w-[32ch] text-center text-[16px] leading-6 text-quiz-muted">Pick up where you left off. Eve only asks the {steps.length} {steps.length === 1 ? "question" : "questions"} she doesn&apos;t know yet.</p>
            <button onClick={skip} className="mx-auto mt-4 block text-[13px] text-quiz-muted underline underline-offset-4">Skip for now</button>
          </Center>
        </Shell>
      );
    }
    return (
      <Shell tone="paper" onClose={onClose} hideNav cta={<Cta onClick={next}>Let&apos;s go</Cta>} ctaDesktopInline>
        <div className="mx-auto flex min-h-full max-w-[960px] flex-col items-center justify-center gap-8 px-6 pb-36 pt-2 lg:flex-row lg:gap-14 lg:pb-10">
          {FLAGS.eveIllustrations ? <EveArt name={FLAGS.quizSplash ? "happy" : "happy-tummy"} className="mx-auto h-[200px] lg:mx-0 lg:h-[320px]" /> : <Collage small />}
          <div className={`text-center lg:max-w-[400px] lg:text-left ${FLAGS.quizSplash ? "eve-stage-text" : ""}`}>
            <h1 className="font-quiz text-[37px] leading-[1.16] tracking-[-0.01em] text-quiz-ink"><span className="lg:hidden">Just a few questions.</span><span className="hidden lg:inline">Let&apos;s find your routine</span></h1>
            <p className="mt-2 text-[16px] leading-6 text-quiz-muted">Tell us a bit about how you eat, and Eve builds your weekly meal plan around it.</p>
            {/* Plan onboarding (replaces the old 3-card intro for new customers) */}
            <ul className="mx-auto mt-6 w-fit space-y-2.5 text-left lg:mx-0">
              {PLAN_POINTS.map((x) => (
                <li key={x} className="flex items-center gap-3 text-[15px] text-quiz-ink"><CheckDot /> {x}</li>
              ))}
            </ul>
            <div className="mt-7 hidden lg:block"><Cta onClick={next} inline>Let&apos;s go</Cta></div>
            <button onClick={skip} className="mt-4 text-[13px] text-quiz-muted underline underline-offset-4">Skip for now</button>
          </div>
        </div>
      </Shell>
    );
  }

  const nav = { onBack: back, onClose, progress: idx / qCount, dir, k: idx };

  // ---------- Interstitials ----------
  if (screen.k === "usp") {
    return (
      <Shell tone="paper" {...nav} cta={<Cta onClick={next}>Continue</Cta>}>
        <Center>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {FLAGS.eveIllustrations ? <EveArt name={FLAGS.personalisedFacts ? GOAL_FACT[goal].art : "happy"} className="mx-auto h-[240px]" strong /> : <img src={asset("/quiz/usp.jpg")} alt="" className="mx-auto h-[286px] w-[270px] rounded-2xl object-cover" />}
          {FLAGS.personalisedFacts ? (
            <>
              <p className="mt-8 text-center text-[12px] font-medium uppercase tracking-[.15em] text-quiz-muted">For {goalInfo(goal).label.toLowerCase()}</p>
              <h2 className="mt-2 text-center font-quiz text-[29px] leading-[1.16] tracking-[-0.01em] text-quiz-ink">{GOAL_FACT[goal].head}</h2>
              <p className="mx-auto mt-3 max-w-[36ch] text-center text-[14.5px] leading-[22px] text-quiz-muted">{GOAL_FACT[goal].sub}</p>
            </>
          ) : (
            <>
              <h2 className="mt-8 text-center font-quiz text-[31px] leading-[1.16] tracking-[-0.01em] text-quiz-ink">80% of every customers noticed positive lifestyle changes after 3 months</h2>
              <p className="mx-auto mt-2 max-w-[36ch] text-center text-[14px] leading-[22px] text-quiz-muted">*Self-reported experiences from participants in our 3-month plan consuming every 5x/week.</p>
            </>
          )}
        </Center>
      </Shell>
    );
  }

  if (screen.k === "benefit") {
    const b = BENEFIT[q.challenges[0]] ?? BENEFIT["Deciding what to eat"];
    return (
      <Shell tone="paper" {...nav} cta={<Cta onClick={next}>Continue</Cta>}>
        <Center>
          {FLAGS.eveIllustrations ? <EveArt name={b.eve} className="mx-auto h-[220px]" strong /> : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={asset(b.img)} alt="" className="mx-auto h-[210px] w-[198px] rounded-2xl object-cover" />
          )}
          <h2 className="mt-8 text-center font-quiz text-[27px] leading-[1.18] text-quiz-ink">{b.title}</h2>
          <p className="mx-auto mt-2 max-w-[36ch] text-center text-[14px] leading-[22px] text-quiz-muted">{FLAGS.personalisedFacts ? watchFact(q.watch) ?? b.sub : b.sub}</p>
        </Center>
      </Shell>
    );
  }

  if (screen.k === "loading") return <Loading q={q} onDone={next} />;

  // ---------- Plan screens (F1), same visual language ----------
  if (screen.k === "rhythm") {
    const situation = [
      q.household === "partner" ? "Eating with your partner" : q.household === "family" ? "Feeding a family" : q.household === "other" ? "A household of your own kind" : "Eating on your own",
      q.challenges[0]?.toLowerCase(),
    ].filter(Boolean).join(", ");
    const below = (q.meals ?? 3) < g.baseMeals;
    return (
      <Shell tone="paper" {...nav} cta={<Cta onClick={next}>Continue</Cta>}>
        <Head title={`Thanks, ${p.name}.`} sub={`${situation}: that's exactly what every is good at. Eve built your plan around it.`} />
        <div className="rounded-2xl bg-white p-6 text-center">
          <p className="text-[12px] font-medium uppercase tracking-[.15em] text-quiz-muted">Your rhythm</p>
          <p className="mt-2 font-quiz text-[64px] leading-none text-quiz-ink">{q.meals ?? g.baseMeals}</p>
          <p className="mt-1 text-[15px] text-quiz-muted">meals a week from every</p>
          {g.message && <p className="mx-auto mt-4 max-w-[34ch] text-[14px] leading-relaxed text-quiz-ink/80">{g.message}</p>}
        </div>
        {below && (
          <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl border border-quiz-line bg-white p-4 text-[14px] text-quiz-ink">
            <span>For {g.label.toLowerCase()}, {g.baseMeals} a week tends to work better. Your plan works either way.</span>
            <button onClick={() => upd({ meals: g.baseMeals as 3 | 4 | 5 })} className="shrink-0 rounded-full border border-orange px-3 py-1.5 text-[12px] font-medium text-quiz-ink">Make it {g.baseMeals}</button>
          </div>
        )}
      </Shell>
    );
  }

  if (screen.k === "goal") {
    return (
      <Shell tone="paper" {...nav} cta={goalOnly ? <>
        <Cta onClick={applyGoal}>{goal !== s.goal ? "Update my goal" : "Keep this goal"}</Cta>
        <Cta variant="light" onClick={() => go(0)}>Change my answers</Cta>
      </> : <>
        <Cta onClick={next}>Show my plan</Cta>
        <Cta variant="light" onClick={() => { setMode("all"); go(1); }}>Change goal</Cta>
      </>}>
        <div className={`mt-4 rounded-[24px] p-5 ${goalBg(goal)}`}>
          <p className="text-[12px] font-medium uppercase tracking-[.15em] text-stone">{goalOnly ? (goal !== s.goal ? `Your new goal · was ${goalInfo(s.goal).label}` : "Your goal stays") : "Your goal"}</p>
          <h2 className="mt-2 font-quiz text-[31px] leading-[1.16] tracking-[-0.01em] text-ink">{g.label}</h2>
          <p className="mt-2 text-[14px] leading-snug text-body">{g.hint}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {g.chips.map((c) => (
              <span key={c.key} className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1.5 text-[14px] text-ink"><CheckDot dark /> {c.label}</span>
            ))}
          </div>
        </div>
        {/* Target macros: shown openly in Variant A, one tap deep in B and C (Victor, 13 Oct 2026) */}
        {variant !== "a" && (
          <button onClick={() => setShowTargets((v) => !v)} aria-expanded={showTargets} className="mt-5 flex items-center gap-1.5 text-[14px] font-medium text-quiz-ink underline decoration-quiz-line underline-offset-4">
            {showTargets ? "Hide your targets" : "See your targets"}
          </button>
        )}
        {showTargets && <>
          <div className="mt-5 overflow-hidden rounded-2xl bg-white">
            <p className="px-4 pt-4 text-[12px] font-medium uppercase tracking-[.15em] text-quiz-muted">Your targets per main meal</p>
            <ul className="divide-y divide-quiz-line/70 px-4">
              {g.chips.map((c) => (
                <li key={c.key} className="py-3">
                  <div className="flex items-baseline justify-between gap-3"><span className="text-[15px] text-quiz-ink">{c.label}</span><span className="text-right text-[15px] font-medium text-quiz-ink">{c.target}</span></div>
                  <p className="mt-0.5 text-[13px] leading-snug text-quiz-muted">{c.why}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-3 rounded-2xl bg-white p-4">
            <p className="text-[13px] font-medium text-quiz-muted">every&apos;s contribution at {g.baseMeals} meals a week</p>
            <ul className="mt-2 space-y-1">{g.contribution.map((x) => <li key={x} className="flex items-center gap-2 text-[14.5px] text-quiz-ink"><CheckDot /> {x}</li>)}</ul>
          </div>
        </>}
        {g.science && <p className="mt-5 text-[14px] leading-relaxed text-quiz-muted">{g.science}</p>}
        <p className="mt-2 text-[12.5px] text-quiz-muted">Directions, not limits. Nothing to log or count.</p>
        {goalOnly && goal !== s.goal && <p className="mt-2 text-[12.5px] text-quiz-muted">This week stays as it is. Your loves, dislikes and history stay; the new goal shapes your plan from your next order (1 Oct).</p>}
      </Shell>
    );
  }

  if (screen.k === "preview") {
    const firstMeals = preview.flatMap((d, di) => d.slots.filter((x) => x.dishId).map((x) => ({ di, x }))).slice(0, 6);
    const tags = [`${q.meals ?? g.baseMeals} meals a week`, ...g.chips.slice(0, 2).map((c) => c.label), q.challenges[0] ?? null].filter(Boolean) as string[];
    return (
      <Shell tone="paper" {...nav} cta={<>
        <Cta onClick={finish}>Set up my first week</Cta>
        <Cta variant="light" onClick={() => { setMode("all"); go(1); }}>Change something</Cta>
      </>}>
        <Head title="Here's your first week" />
        <div className="overflow-hidden rounded-[24px] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.06),0_18px_50px_rgba(0,0,0,0.08)]">
          <div className={`px-5 pb-4 pt-5 ${goalBg(goal)}`}>
            <p className="text-[11px] font-medium uppercase tracking-[.15em] text-quiz-ink/70">Your best match</p>
            <p className="mt-1 font-quiz text-[24px] leading-tight text-quiz-ink">{g.title}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {tags.map((t) => <span key={t} className="inline-flex items-center gap-1 rounded-full bg-white/70 px-2.5 py-1 text-[13px] text-ink"><CheckDot dark /> {t}</span>)}
            </div>
          </div>
          <ul className="divide-y divide-quiz-line/70 px-5">
            {firstMeals.map(({ di, x }, k) => {
              const d = dish(x.dishId!);
              return (
                <li key={`${di}${x.slot}`} className="flex items-center gap-3 py-3 animate-drop-in" style={{ animationDelay: `${k * 120}ms` }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={asset(d.img)} alt="" className="size-14 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] text-quiz-muted">{DAY_NAMES[di]} · <span className="capitalize">{x.slot}</span></p>
                    <p className="truncate text-[15px] text-quiz-ink">{d.name}</p>
                    <p className="line-clamp-1 text-[12.5px] text-quiz-muted">{d.reason[g.reasonKey]}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </Shell>
    );
  }

  // ---------- Questions ----------
  const st = screen.step;
  const isLastQ = !flow.slice(idx + 1).some((x) => x.k === "q");
  const autoAdvance = ["q1", "q1a", "fitness", "meals", "eater", "picky"].includes(st) || (st === "household" && q.household !== "other");
  const cta = !autoAdvance || answered(st) ? (
    <>
      <Cta onClick={next} disabled={!answered(st)}>{isLastQ ? (goalOnly ? "Show my goal" : "Build my plan") : "Continue"}</Cta>
      {(st === "days" || st === "dislikes" || st === "cantHave") && <Cta variant="light" onClick={() => { if (st === "days") upd({ days: null }); else upd({ dislikes: "" }); next(); }}>Skip this question</Cta>}
    </>
  ) : undefined;

  return (
    <Shell tone="white" {...nav} cta={cta}>
      {st === "q1" && <>
        <Head title="What's your main goal right now?" />
        <Tiles opts={Q1} value={q.q1} tint={(v) => groupBg(Q1_GROUP[v])} onPick={(v) => pickAndGo({ q1: v as QuizT["q1"], q1a: null, fitness: null })} />
      </>}
      {st === "q1a" && <><Head title="What's driving your focus on weight right now?" sub="This helps Eve set the right tone. It stays private." /><Rows opts={Q1A} values={q.q1a ? [q.q1a] : []} onPick={(v) => pickAndGo({ q1a: v as QuizT["q1a"] })} /></>}
      {st === "fitness" && <><Head title="What's driving your focus on fitness right now?" /><Rows opts={FITNESS} values={q.fitness ? [q.fitness] : []} onPick={(v) => pickAndGo({ fitness: v as QuizT["fitness"] })} /></>}
      {st === "cantHave" && <>
        <Head title="Anything you can't have in your meals?" sub="Tell us in your own words - e.g. ‘no mushrooms or onions’. We'll steer your plan away from them. You can always adjust later." />
        <textarea rows={4} value={q.dislikes} onChange={(e) => upd({ dislikes: e.target.value })} aria-label="Anything you can't have" className="w-full rounded-2xl border border-quiz-line bg-white px-4 py-3.5 text-[15px] outline-none focus:border-orange" />
      </>}
      {st === "watch" && <><Head title="Anything you watch for in food?" sub="Pick as many as you like" /><Rows multi opts={WATCH} values={q.watch} onPick={(v) => upd({ watch: v === "Nothing in particular" ? (q.watch.includes(v) ? [] : [v]) : toggle(q.watch.filter((x) => x !== "Nothing in particular"), v) })} /></>}
      {st === "satisfaction" && <Satisfaction value={q.satisfaction} onChange={(n) => upd({ satisfaction: n })} />}
      {st === "challenges" && <><Head title="What are your biggest challenges when it comes to eating?" sub="Pick as many as you like" /><Rows multi opts={CHALLENGES} values={q.challenges} onPick={(v) => upd({ challenges: toggle(q.challenges, v) })} /></>}
      {st === "household" && <><Head title="How many people will eat every with you?" sub="Your plan is built for you. Your box can still feed more people." /><Tiles opts={HOUSEHOLD} value={q.household} onPick={(v) => pickAndGo({ household: v as QuizT["household"] }, v !== "other")} />
        {q.household === "other" && <input autoFocus value={q.householdOther} onChange={(e) => upd({ householdOther: e.target.value })} placeholder="Tell us who's eating" aria-label="Who eats every with you" className="mt-4 w-full rounded-2xl border border-quiz-line bg-white px-4 py-3.5 text-[15px] outline-none focus:border-orange" />}</>}
      {st === "meals" && <><Head title="How many healthy meals a week would you like every to take care of?" /><Rows opts={MEALS.map((m) => ({ ...m, badge: q.q1 && goalInfo(goalFromQuiz(q)).baseMeals === Number(m.v) ? "Fits your goal" : undefined }))} values={q.meals ? [String(q.meals)] : []} onPick={(v) => pickAndGo({ meals: Number(v) as 3 | 4 | 5 })} /></>}
      {st === "days" && <><Head title="On which days would you possibly like a healthy meal already sorted?" sub="Pick as many as you like. Skip it and Eve plans Monday to Friday." /><Rows multi opts={DAYS.map((d, i) => ({ v: String(i), label: d }))} values={(q.days ?? []).map(String)} onPick={(v) => upd({ days: toggle(q.days, Number(v)).sort() })} /></>}
      {st === "occasions" && <><Head title="Where would you like every to support you with healthy eating?" sub="Pick as many as you like" /><Rows multi opts={OCC} values={q.occasions ?? []} onPick={(v) => upd({ occasions: toggle(q.occasions, v as "breakfast") })} /></>}
      {st === "eater" && <><Head title="What type of eater are you?" /><Tiles opts={EATER} value={q.eater} onPick={(v) => pickAndGo({ eater: v })} /></>}
      {st === "picky" && <><Head title="When it comes to food, which sounds most like you?" /><Rows opts={PICKY} values={q.picky ? [q.picky] : []} onPick={(v) => pickAndGo({ picky: v as QuizT["picky"] })} /></>}
      {st === "dislikes" && <>
        <Head title="Anything you'd rather not have in your meals?" sub="Tell us in your own words - e.g. ‘no mushrooms or onions’. We'll steer your plan away from them. You can always adjust later." />
        <textarea rows={4} value={q.dislikes} onChange={(e) => upd({ dislikes: e.target.value })} aria-label="Anything you'd rather not have" className="w-full rounded-2xl border border-quiz-line bg-white px-4 py-3.5 text-[15px] outline-none focus:border-orange" />
        <p className="mt-3 text-[13px] text-quiz-muted">Optional. Allergies are set separately in Preferences, as recipes without gluten, soy, nuts or sesame.</p>
      </>}
    </Shell>
  );
}

// ---------- Building blocks (Figma: Step navigation, StepHead, Selector, Slider, StickyAction) ----------

function Shell({ tone, children, cta, onClose, onBack, progress = 0, hideNav = false, dir = "fwd", k = 0, ctaDesktopInline = false }: {
  tone: "white" | "paper"; children: React.ReactNode; cta?: React.ReactNode; onClose: () => void; onBack?: () => void;
  progress?: number; hideNav?: boolean; dir?: "fwd" | "back"; k?: number; ctaDesktopInline?: boolean;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [onClose]);
  const bg = tone === "paper" ? "bg-quiz-paper" : "bg-white";
  const fade = tone === "paper" ? "from-quiz-paper/0 to-quiz-paper" : "from-white/0 to-white";
  return (
    <div className={`fixed inset-0 z-50 flex flex-col ${bg} animate-fade-in`} role="dialog" aria-modal="true" aria-label="Eve's questions">
      <div className={`mx-auto flex h-20 w-full shrink-0 items-center gap-6 px-4 pb-4 pt-6 ${hideNav ? "" : "max-w-[560px]"}`}>
        <button onClick={onBack} aria-label="Back" className={`grid size-10 place-items-center text-quiz-ink ${hideNav ? "invisible" : ""}`}>
          <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5m6-6-6 6 6 6" /></svg>
        </button>
        <div className={`h-[9px] flex-1 overflow-hidden rounded-full bg-quiz-line ${hideNav ? "invisible" : ""}`} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}>
          <div className="h-full rounded-full bg-brown transition-[width] duration-500 ease-out" style={{ width: `${Math.max(8, progress * 100)}%` }} />
        </div>
        <button onClick={onClose} aria-label="Close" className="grid size-10 place-items-center text-quiz-ink">
          <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div key={k} className={`mx-auto min-h-full w-full ${hideNav ? "" : "max-w-[560px] px-6 pb-40"} ${dir === "fwd" ? "animate-step-fwd" : "animate-step-back"}`}>{children}</div>
      </div>
      {cta && (
        <div className={`pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-b ${fade} p-6 ${ctaDesktopInline ? "lg:hidden" : ""}`}>
          <div className="pointer-events-auto mx-auto flex max-w-[512px] flex-col gap-3">{cta}</div>
        </div>
      )}
    </div>
  );
}

function Center({ children }: { children: React.ReactNode }) {
  // eve-stage: headline and copy fade up just after the illustration lands (slim copy)
  return <div className={`flex min-h-[calc(100dvh-14rem)] flex-col justify-center px-6 py-6 ${FLAGS.quizSplash ? "eve-stage" : ""}`}>{children}</div>;
}

function Head({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="pb-6 pt-4">
      <h2 className="font-quiz text-[31px] leading-[1.16] tracking-[-0.01em] text-quiz-ink">{title}</h2>
      {sub && <p className="mt-2 text-[14px] leading-snug text-quiz-muted">{sub}</p>}
    </div>
  );
}

function Cta({ children, onClick, disabled, variant = "dark", inline = false }: { children: React.ReactNode; onClick: () => void; disabled?: boolean; variant?: "dark" | "light"; inline?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className={`flex h-10 items-center justify-center rounded-[30px] px-6 text-[12px] font-medium uppercase tracking-[.15em] transition active:scale-[.98] disabled:opacity-35 ${inline ? "inline-flex" : "w-full"} ${variant === "dark" ? "bg-brown text-white" : "bg-white text-quiz-ink"}`}>
      {children}
    </button>
  );
}

function Box({ on }: { on: boolean }) {
  return on ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={asset("/quiz/check.svg")} alt="" className="size-4 shrink-0" />
  ) : <span className="size-4 shrink-0 rounded-[4px] border border-quiz-line" />;
}

function CheckDot({ dark = false }: { dark?: boolean }) {
  return (
    <span className={`grid size-3.5 shrink-0 place-items-center rounded-full ${dark ? "bg-quiz-ink/80" : "bg-orange"}`}>
      <svg viewBox="0 0 12 12" className="size-2.5" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m3 6.2 2 2 4-4.4" /></svg>
    </span>
  );
}

/** Figma Selector tiles: 2 columns, 177 px tall, picture or emoji, orange 2 px border + check when selected. */
function Tiles({ opts, value, onPick, tint }: { opts: Opt[]; value: string | null; onPick: (v: string) => void; tint?: (v: string) => string }) {
  return (
    <div className="grid grid-cols-2 gap-4" role="radiogroup">
      {opts.map((o) => {
        const on = value === o.v;
        return (
          <button key={o.v} role="radio" aria-checked={on} onClick={() => onPick(o.v)}
            className={`relative flex h-[177px] flex-col items-center justify-center gap-2 rounded-2xl p-5 text-center transition ${tint ? tint(o.v) : "bg-white"} ${on ? "border-2 border-orange" : tint ? "border border-transparent hover:border-quiz-dot" : "border border-quiz-line hover:border-quiz-dot"}`}>
            <span className="grid h-20 w-full place-items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {o.img ? <img src={asset(o.img)} alt="" className="max-h-20 max-w-[120px] object-contain drop-shadow-[2px_3px_4px_rgba(0,0,0,0.12)]" /> : <span className="text-[52px] leading-none">{o.emoji}</span>}
            </span>
            <span className="text-[15px] leading-tight text-quiz-ink">{o.label}</span>
            {on && <span className="absolute right-[11px] top-[11px]"><Box on /></span>}
          </button>
        );
      })}
    </div>
  );
}

/** Figma option rows: emoji, label, square checkbox; selected = orange border + orange check. */
function Rows({ opts, values, onPick, multi = false }: { opts: (Opt & { badge?: string })[]; values: string[]; onPick: (v: string) => void; multi?: boolean }) {
  return (
    <div className="space-y-2" role={multi ? "group" : "radiogroup"}>
      {opts.map((o) => {
        const on = values.includes(o.v);
        return (
          <button key={o.v} role={multi ? "checkbox" : "radio"} aria-checked={on} onClick={() => onPick(o.v)}
            className={`flex min-h-[52px] w-full items-center gap-3 rounded-xl bg-white py-3 text-left transition ${on ? "border-2 border-orange px-[15px]" : "border border-quiz-line px-4 hover:border-quiz-dot"}`}>
            {o.emoji && <span className="text-[20px] leading-none">{o.emoji}</span>}
            <span className="min-w-0 flex-1 text-[15px] leading-snug text-quiz-ink">
              {o.label}{o.sub && <span className="text-quiz-muted"> — {o.sub}</span>}
            </span>
            {o.badge && <span className="shrink-0 rounded-full bg-[#ffe6d6] px-2 py-0.5 text-[11px] text-[#9a4a1c]">{o.badge}</span>}
            <Box on={on} />
          </button>
        );
      })}
    </div>
  );
}

/** Figma satisfaction step: big emoji, label, orange gradient slider with five stops. */
function Satisfaction({ value, onChange }: { value: number | null; onChange: (n: number) => void }) {
  const pos = value ? (value - 1) / 4 : 0.5;
  return (
    <div className="flex min-h-[calc(100dvh-16rem)] flex-col">
      <Head title="How satisfied are you with how you eat?" />
      <div className="grid flex-1 place-items-center">{FLAGS.eveIllustrations
        ? <EveArt key={value ?? 0} name={value ? SAT_EVE[value - 1] : "leaf"} level={value ?? undefined} className={`h-[200px] ${FLAGS.quizSplash ? "" : "animate-drop-in"} ${value ? "" : "opacity-50"}`} />
        : <span key={value ?? 0} className="text-[124px] leading-none animate-drop-in" aria-hidden="true">{value ? SAT[value - 1].emoji : "😶"}</span>}</div>
      <p className="mb-8 h-[22px] text-center text-[16px] font-medium tracking-[-0.02em] text-black/80" aria-live="polite">{value ? SAT[value - 1].label : "Slide or tap to answer"}</p>
      <div className="relative h-12">
        <div className="absolute inset-0 rounded-full bg-[#ccc]/20" />
        {value && <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-l from-orange/80 to-orange/50 transition-all" style={{ width: `calc(${pos} * (100% - 48px) + 48px)` }} />}
        <div className="absolute inset-0 flex items-center justify-between">
          {[1, 2, 3, 4, 5].map((n) => <span key={n} className="grid size-12 place-items-center"><span className="size-2 rounded-full bg-quiz-dot" /></span>)}
        </div>
        {value && <div className="absolute top-0 size-12 rounded-full bg-orange shadow-[0_2px_6px_rgba(255,125,52,0.4)] transition-all" style={{ left: `calc(${pos} * (100% - 48px))` }} />}
        <input type="range" min={1} max={5} step={1} value={value ?? 3} onChange={(e) => onChange(Number(e.target.value))} onClick={(e) => onChange(Number((e.target as HTMLInputElement).value))}
          aria-label="Satisfaction from 1 to 5" aria-valuetext={value ? SAT[value - 1].label : "Not answered"} className="absolute inset-0 h-12 w-full cursor-pointer opacity-0" />
      </div>
      <div className="mt-4 flex justify-between text-[13px] text-quiz-ink/60"><span>Not satisfied</span><span>Very satisfied</span></div>
    </div>
  );
}

/** Intro collage (Figma introImage): four photos, 24 px outer radius, 8 px gaps. */
function Collage({ small = false }: { small?: boolean }) {
  return (
    <div className={`mx-auto grid shrink-0 grid-cols-2 grid-rows-2 gap-2 overflow-hidden rounded-[24px] lg:mx-0 lg:h-[400px] lg:w-[384px] ${small ? "h-[220px] w-[211px]" : "h-[315px] w-[302px]"}`}>
      <div className="relative overflow-hidden bg-[#f6cfa6]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset("/quiz/c-woman.png")} alt="" className="absolute left-[-152%] top-[-30%] h-auto w-[404%] max-w-none" />
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={asset("/quiz/c-water.jpg")} alt="" className="size-full object-cover" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={asset("/quiz/c-table.jpg")} alt="" className="size-full object-cover object-[50%_70%]" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={asset("/quiz/c-plates.jpg")} alt="" className="size-full object-cover object-[50%_20%]" />
    </div>
  );
}

/** Figma "Going over your responses": Eve with a checklist that ticks through, then moves on. */
/** Loading: Eve "cooks up" the plan, one pose per finished step. */
const LOAD_EVE = ["spoon", "pan", "cubes", "happy"];

function Loading({ q, onDone }: { q: QuizT; onDone: () => void }) {
  const items = [
    goalInfo(goalFromQuiz(q)).label,
    q.challenges[0] ?? "Your week",
    q.watch[0] && q.watch[0] !== "Nothing in particular" ? q.watch[0] : `${q.meals ?? 3} meals a week`,
  ];
  const [done, setDone] = useState(0);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;
  useEffect(() => {
    const t = done >= items.length ? setTimeout(() => doneRef.current(), 500) : setTimeout(() => setDone((d) => d + 1), 750);
    return () => clearTimeout(t);
  }, [done, items.length]);
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-quiz-paper px-6 animate-fade-in" role="dialog" aria-modal="true" aria-label="Going over your responses">
      {FLAGS.quizSplash ? <EveArt key={done} name={LOAD_EVE[done % LOAD_EVE.length]} className="h-36" /> : <EveFigure pose="wave" className="h-36 w-auto" />}
      <h2 className="mt-6 text-center font-quiz text-[31px] leading-[1.16] text-quiz-ink">Going over your responses</h2>
      <ul className="mt-4 space-y-1.5" aria-live="polite">
        {items.map((t, i) => (
          <li key={`${i}${t}`} className={`flex items-center gap-2 text-[15px] transition ${i <= done ? "text-quiz-muted" : "text-quiz-muted/40"}`}>
            {i < done ? <CheckDot /> : i === done ? <span className="size-3.5 animate-spin rounded-full border-2 border-orange/30 border-t-orange" /> : <span className="size-3.5" />}
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Optional depth questions (Miro DQ1–DQ4), offered as a nudge on the plan for weight and fitness goals. */
export function DeepDive({ onClose }: { onClose: () => void }) {
  const { s, set, toast } = useStore();
  const [deep, setDeep] = useState(s.quiz.deep);
  const [unit, setUnit] = useState<"kg" | "lbs">("kg");
  const field = (k: "height" | "weight" | "age", label: string, suffix: React.ReactNode) => (
    <label className="block">
      <span className="text-[15px] text-quiz-ink">{label} <span className="text-quiz-muted">(optional)</span></span>
      <div className="mt-2 flex items-center gap-3">
        <input inputMode="numeric" value={deep[k] ?? ""} onChange={(e) => setDeep({ ...deep, [k]: e.target.value })} className="w-full rounded-xl border border-quiz-line bg-white px-4 py-3 text-[15px] outline-none focus:border-orange" />
        {suffix}
      </div>
    </label>
  );
  return (
    <Shell tone="white" onClose={onClose} onBack={onClose} progress={1} cta={<>
      <Cta onClick={() => { set((d) => { d.quiz.deep = deep; d.dismissed.push("deep"); d.sheet = null; }); toast("Thanks. Eve will use this quietly, in the background."); }}>Save</Cta>
      <Cta variant="light" onClick={() => { set((d) => { d.dismissed.push("deep"); d.sheet = null; }); }}>No thanks</Cta>
    </>}>
      <Head title="Want Eve to fine-tune the direction?" sub="Only if you want it. Eve uses this for direction, never for numbers on your screen, and you can delete it any time." />
      <div className="space-y-5">
        {field("height", "What is your height?", <span className="text-[14px] text-quiz-muted">cm</span>)}
        {field("weight", "What is your current weight?", (
          <div className="flex rounded-full bg-quiz-paper p-0.5 text-[13px]" role="radiogroup" aria-label="Weight unit">
            {(["kg", "lbs"] as const).map((u) => <button key={u} role="radio" aria-checked={unit === u} onClick={() => setUnit(u)} className={`rounded-full px-3 py-1.5 ${unit === u ? "bg-white text-quiz-ink shadow-e1" : "text-quiz-muted"}`}>{u}</button>)}
          </div>
        ))}
        {field("age", "How old are you?", <span className="text-[14px] text-quiz-muted">years</span>)}
        <div>
          <p className="mb-2 text-[15px] text-quiz-ink">How often do you exercise in a typical week?</p>
          <Rows opts={["Rarely or never", "1–2 times a week", "3–4 times a week", "5 or more times a week", "It varies a lot depending on the week"].map((o) => ({ v: o, label: o }))} values={deep.exercise ? [deep.exercise] : []} onPick={(v) => setDeep({ ...deep, exercise: v })} />
        </div>
      </div>
    </Shell>
  );
}
