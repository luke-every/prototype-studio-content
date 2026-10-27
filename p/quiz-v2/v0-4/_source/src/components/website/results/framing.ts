import type { EngineAnswers } from "@/lib/recommendation";
import type { Answers } from "../quiz/types";
import { boxHeat } from "./highlights";
import type { Box, BoxLine } from "./useBox";

/**
 * Three ways to share the quiz out over the hero headline, the hero's three numbers and the tags under
 * "What's in your box". Variants A, B and C each use one.
 *
 * 1 · You:   headline = who + goal (+ your week) + what you watch; numbers = nutrition; tags = food
 * 2 · Why:   headline = goal + what's hard;                       numbers = preferences; tags = nutrition
 * 3 · Food:  headline = taste + what you watch;                   numbers = nutrition; tags = who you are
 *
 * Every headline is built from slots: each answer maps to a phrase written to fit its slot, and a slot
 * with no answer drops out, so the sentence reads naturally whatever was picked.
 */
export type Framing = 1 | 2 | 3;

/** A headline: plain words, and the phrases that came from their answers (set apart on the page) */
export type Headline = (string | { answer: string })[];

const a = (answer: string) => ({ answer });

// TODO(lift): replace with translation keys — one key per slot phrase

/* ---------- 1 · You ---------- */

/** Who it's for: the lead-in stays plain, only the people are set apart */
const WHO: Record<EngineAnswers["house"], [lead: string, who: string]> = {
  me: ["Meals for ", "one"],
  partner: ["Meals for ", "you and your partner"],
  family: ["Meals for ", "your family"],
  room: ["Meals for ", "you and your housemates"],
};

/** The goal as something they're doing. Weight is said softly, the doctor never */
const GOAL_DOING: Record<string, Record<string, string> & { _: string }> = {
  protein: {
    muscle: "building muscle",
    lean: "staying lean",
    energy: "keeping your energy up",
    full: "staying full for longer",
    meatless: "getting protein without meat",
    _: "fuelling your training",
  },
  portions: { energy: "feeling lighter", regain: "getting back on track", maintain: "keeping things balanced", _: "eating lighter" },
  postpartum: { _: "eating well as a new parent" },
  better: { _: "eating more balanced" },
  gut: { _: "looking after your gut" },
};

/** Their week, as when it happens; "a bit of everything" says nothing, so it drops out */
const WEEK_WHEN: Record<string, string> = {
  work: "through busy weeks",
  training: "around your training",
  family: "around family time",
  friends: "between nights out",
};

/** What they look for. Diabetes is never said, and everything is plant-based, so that isn't either */
const WATCH_MORE: Record<string, string> = {
  protein: "more protein",
  fibre: "more fibre",
  portions: "right-sized portions",
  sugar: "less sugar",
};

function goalDoing(answers: Answers): string {
  const goal = answers.goal[0] ?? "protein";
  const phrases = GOAL_DOING[goal] ?? GOAL_DOING.protein;
  const why = goal === "protein" ? answers.whyFitness[0] : goal === "portions" ? answers.whyWeight[0] : undefined;
  return (why && phrases[why]) || phrases._;
}

/** "Meals for you and your partner, building muscle through busy weeks, with more fibre and less sugar." */
function youHeadline(answers: Answers, engine: EngineAnswers): Headline {
  const week = answers.week.map((w) => WEEK_WHEN[w]).find(Boolean);
  const watch = answers.watch.flatMap((w) => WATCH_MORE[w] ?? []);
  return [
    WHO[engine.house][0],
    a(WHO[engine.house][1]),
    ", ",
    a(goalDoing(answers)),
    ...(week ? [" ", a(week)] : []),
    ...(watch.length ? [", with ", ...joined(watch)] : []),
    ".",
  ];
}

/* ---------- 2 · Why ---------- */

const GOAL_DO: Record<string, Record<string, string> & { _: string }> = {
  protein: {
    muscle: "build muscle",
    lean: "stay lean",
    energy: "keep your energy up",
    full: "stay full for longer",
    meatless: "get your protein without meat",
    _: "fuel your training",
  },
  portions: { energy: "feel lighter", regain: "get back on track", maintain: "keep things balanced", _: "eat lighter" },
  postpartum: { _: "eat well as a new parent" },
  better: { _: "eat more balanced" },
  gut: { _: "look after your gut" },
};

/** The goal as what the meals help them do: "build muscle", "look after your gut" */
function goalDo(answers: Answers): string {
  const goal = answers.goal[0] ?? "protein";
  const phrases = GOAL_DO[goal] ?? GOAL_DO.protein;
  const why = goal === "protein" ? answers.whyFitness[0] : goal === "portions" ? answers.whyWeight[0] : undefined;
  return (why && phrases[why]) || phrases._;
}

/** What gets in their way, as what they get to skip: it follows a plain "without" */
const WITHOUT: Record<string, string> = {
  time: "finding the time to cook",
  decide: "deciding what's for dinner",
  balance: "planning every meal",
  waste: "wasting food",
  cooking: "cooking a thing",
  budget: "the takeaway bill",
};

/**
 * "Made to help you build muscle, without finding the time to cook." The goal, and the challenge they
 * tapped first as what they get to skip; with no challenge, their week instead ("…, through busy weeks"),
 * so the sentence keeps two of their answers; with neither, the goal alone.
 */
export function whyHeadline(answers: Answers): Headline {
  const doing = goalDo(answers);
  const without = WITHOUT[answers.challenges[0] ?? ""];
  if (without) return ["Made to help you ", a(doing), ", without ", a(without), "."];
  const week = answers.week.map((w) => WEEK_WHEN[w]).find(Boolean);
  return ["Made to help you ", a(doing), ...(week ? [", ", a(week)] : []), "."];
}

/* ---------- 3 · Food ---------- */

const SPICE_IS: Record<EngineAnswers["spice"], string> = {
  not: "not spicy",
  ok: "not too spicy",
  medium: "a little spicy",
  very: "properly spicy",
};

/** "Plant-based meals that are [a little spicy], leaning [Italian], with [more fibre] and [less sugar]." */
function foodHeadline(answers: Answers, engine: EngineAnswers): Headline {
  const cuisines = engine.cuisines.map((c) => CUISINE[c] ?? c);
  const watch = answers.watch.flatMap((w) => WATCH_MORE[w] ?? []);
  return [
    "Plant-based meals that are ",
    a(SPICE_IS[engine.spice]),
    ...(cuisines.length ? [", leaning ", ...joined(cuisines)] : []),
    ...(watch.length ? [", with ", ...joined(watch)] : []),
    ".",
  ];
}

function joined(items: string[]): Headline {
  return items.flatMap((item, i) => (i === 0 ? [a(item)] : [i === items.length - 1 ? " and " : ", ", a(item)]));
}

/* ---------- the headline angles, side by side (reference only) ---------- */

/** The spice as the word before "meals" */
const SPICE_MEALS: Record<EngineAnswers["spice"], string> = {
  not: "Mild",
  ok: "Gently spiced",
  medium: "A little spicy",
  very: "Properly spicy",
};

// TODO(lift): prototype reference only — the angles proposed for A's sentence, for the Heroes page
/**
 * Five ways to say their answers in the hero, each the goal plus one or two others, from the same
 * phrases as the live sentences. A missing answer drops its part, so every one still reads.
 */
export function headlineAngles(answers: Answers, engine: EngineAnswers): { label: string; headline: Headline }[] {
  const doing = goalDo(answers);
  const goingOn = goalDoing(answers);
  const without = WITHOUT[answers.challenges[0] ?? ""];
  const week = answers.week.map((w) => WEEK_WHEN[w]).find(Boolean);
  const cuisines = engine.cuisines.map((c) => CUISINE[c] ?? c).slice(0, 2);
  const who = WHO[engine.house][1];
  return [
    { label: "1 · Goal + challenge — the problem, solved (live on A)", headline: whyHeadline(answers) },
    {
      label: "2 · Goal + week — it fits your life",
      headline: [a(goingOn.charAt(0).toUpperCase() + goingOn.slice(1)), ...(week ? [", made easy ", a(week)] : []), "."],
    },
    {
      label: "3 · Goal + taste — food first",
      headline: ["Meals to ", a(doing), ", ", a(SPICE_IS[engine.spice]), ...(cuisines.length ? [" and leaning ", ...joined(cuisines)] : []), "."],
    },
    {
      label: "4 · Goal + challenge + taste — the full promise",
      headline: [a(SPICE_MEALS[engine.spice]), " meals to ", a(doing), ...(without ? [", without ", a(without)] : []), "."],
    },
    { label: "5 · Household + goal — calm and factual", headline: ["Meals for ", a(who), ", to ", a(doing), "."] },
  ];
}

export function headlineFor(framing: Framing, answers: Answers, engine: EngineAnswers): Headline {
  if (framing === 1) return youHeadline(answers, engine);
  if (framing === 2) return whyHeadline(answers);
  return foodHeadline(answers, engine);
}

/* ---------- the three numbers: nutrition only ---------- */

export type Nutrient = "prot" | "fib" | "sugar" | "kcal";

const GOAL_NUTRIENT: Record<EngineAnswers["goal"], Nutrient> = { fitness: "prot", baby: "prot", easy: "prot", lose: "kcal", gut: "fib" };
const WATCH_NUTRIENT: Record<string, Nutrient> = { protein: "prot", fibre: "fib", sugar: "sugar", portions: "kcal" };

/** The goal's nutrient leads, then what they look for, then protein, fibre and kcal to fill three */
export function nutrientsFor(answers: Answers, engine: EngineAnswers): Nutrient[] {
  const order: Nutrient[] = [GOAL_NUTRIENT[engine.goal], ...answers.watch.flatMap((w) => WATCH_NUTRIENT[w] ?? []), "prot", "fib", "kcal"];
  return [...new Set(order)].slice(0, 3);
}

export const NUTRIENT_LABEL: Record<Nutrient, string> = {
  prot: "Ø Protein",
  fib: "Ø Fibre",
  sugar: "Ø Sugar",
  kcal: "Ø kcal",
};

/** A hero number: the value, its unit set small beside it, and the label under it. `heat` shows chillies instead */
export type HeroTile = { key: string; value: number | string; unit: string; label: string; heat?: 1 | 2 | 3 };

/** The three hero numbers: the box's nutrition, or for "why" its preferences */
export function heroTilesFor(framing: Framing, answers: Answers, box: Box): HeroTile[] {
  if (framing === 2) return preferenceTiles(box);
  return nutrientsFor(answers, box.engine).map((nutrient) => ({
    key: nutrient,
    value: nutrientAverage(box.lines, nutrient),
    unit: nutrient === "kcal" ? "" : "g",
    label: NUTRIENT_LABEL[nutrient],
  }));
}

/** Per meal, a meal that's in twice counting twice */
export function nutrientAverage(lines: BoxLine[], nutrient: Nutrient): number {
  const units = lines.reduce((n, line) => n + line.qty, 0);
  return Math.round(lines.reduce((sum, line) => sum + line.meal[nutrient] * line.qty, 0) / Math.max(units, 1));
}

/** The box in three facts: how many meals, how hot they are, and that they're all plant-based */
function preferenceTiles(box: Box): HeroTile[] {
  const heat = boxHeat(box.lines);
  return [
    { key: "meals", value: box.units, unit: "", label: "meals" },
    { key: "heat", value: "", unit: "", label: HEAT[heat - 1], heat },
    { key: "plant", value: 100, unit: "%", label: "plant-based" },
  ];
}

/* ---------- names, as the page says them ---------- */

const CUISINE: Record<string, string> = { "Latin American Food": "Latin" };
const HEAT = ["Mostly mild", "A little heat", "Plenty of heat"];

/* ---------- their taste, as keywords ---------- */

// TODO(lift): replace with translation keys
const SPICE_KEYWORD: Record<EngineAnswers["spice"], string> = {
  not: "Not spicy",
  ok: "A little spice",
  medium: "Medium spicy",
  very: "Very spicy",
};

/**
 * What they told us about their food, in their words: spice, each cuisine they love, what they look
 * for, each allergen they avoid. Never the goal or diabetes. "Medium spicy – Italian – More fibre – No gluten"
 */
export function tasteKeywords(answers: Answers, engine: EngineAnswers, allergens: string[]): string {
  const look = answers.watch.flatMap((w) => WATCH_MORE[w] ?? []).map((w) => w.charAt(0).toUpperCase() + w.slice(1));
  const words = [
    SPICE_KEYWORD[engine.spice],
    ...engine.cuisines.map((c) => CUISINE[c] ?? c),
    ...look,
    ...allergens.map((a) => `No ${a}`),
  ];
  return words.join(" – ");
}
