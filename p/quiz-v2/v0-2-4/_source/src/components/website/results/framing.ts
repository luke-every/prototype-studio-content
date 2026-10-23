import type { EngineAnswers } from "@/lib/recommendation";
import type { Answers } from "../quiz/types";
import { boxHeat, orList } from "./highlights";
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
  partner: ["For ", "you and your partner"],
  family: ["For ", "your family"],
  room: ["For ", "you and your housemates"],
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

/** "For you and your partner, building muscle through busy weeks, with more fibre and less sugar." */
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

/** What gets in their way, as what they get to skip: it follows a plain "without" */
const WITHOUT: Record<string, string> = {
  time: "finding the time to cook",
  decide: "deciding what's for dinner",
  balance: "planning every meal",
  waste: "wasting food",
  cooking: "cooking a thing",
  budget: "the takeaway bill",
};

/** "Made to help you build muscle, without finding the time to cook." */
function whyHeadline(answers: Answers): Headline {
  const goal = answers.goal[0] ?? "protein";
  const phrases = GOAL_DO[goal] ?? GOAL_DO.protein;
  const why = goal === "protein" ? answers.whyFitness[0] : goal === "portions" ? answers.whyWeight[0] : undefined;
  const doing = (why && phrases[why]) || phrases._;
  const without = WITHOUT[answers.challenges[0] ?? ""] ?? "the effort";
  return ["Made to help you ", a(doing), ", without ", a(without), "."];
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

/** Who they are, as tags: who's eating, what they're working towards, their week, what's hard */
const FOR_WHO: Record<EngineAnswers["house"], string> = {
  me: "Meals for one",
  partner: "Meals for two",
  family: "Meals for the family",
  room: "Meals for the house",
};

const WEEK_IS: Record<string, string> = {
  work: "Busy weeks",
  training: "Training weeks",
  family: "Family time",
  friends: "Out with friends",
};

const NO_MORE: Record<string, string> = {
  time: "No time to cook",
  decide: "No more deciding",
  balance: "No meal planning",
  waste: "No wasted food",
  cooking: "No cooking",
  budget: "No takeaway bills",
};

function identityTags(answers: Answers, engine: EngineAnswers): string[] {
  const doing = goalDoing(answers);
  const week = answers.week.map((w) => WEEK_IS[w]).find(Boolean);
  const hard = NO_MORE[answers.challenges[0] ?? ""];
  return [FOR_WHO[engine.house], doing.charAt(0).toUpperCase() + doing.slice(1), ...(week ? [week] : []), ...(hard ? [hard] : [])];
}

function joined(items: string[]): Headline {
  return items.flatMap((item, i) => (i === 0 ? [a(item)] : [i === items.length - 1 ? " and " : ", ", a(item)]));
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

/* ---------- the tags under "What's in your box" ---------- */

const CUISINE: Record<string, string> = { "Latin American Food": "Latin" };
const HEAT = ["Mostly mild", "A little heat", "Plenty of heat"];

/** The ranking leans on this nutrient, so the box was picked for it. Never "high protein": that's a regulated claim */
const PICKED_FOR: Record<Nutrient, string> = {
  prot: "Picked for protein",
  fib: "Picked for fibre",
  sugar: "Picked for less sugar",
  kcal: "Picked for lighter meals",
};

/** Each tag is only said when it's true of this box. Allergens have a panel of their own (AllergenNote) */
export function tagsFor(framing: Framing, answers: Answers, box: Box): string[] {
  const { engine, lines, units } = box;
  const loved = lines.reduce((n, line) => n + (engine.cuisines.includes(line.meal.cuis) ? line.qty : 0), 0);
  const cuisine = loved / Math.max(units, 1) >= 1 / 3 ? [`Lots of ${orList(engine.cuisines.map((c) => CUISINE[c] ?? c))}`] : [];
  const heat = HEAT[boxHeat(lines) - 1];
  if (framing === 2) {
    /* the hero carries their preferences here, so the tags carry the box's nutrition */
    return nutrientsFor(answers, engine).map((n) =>
      n === "kcal" ? `Ø ${nutrientAverage(lines, n)} kcal` : `Ø ${nutrientAverage(lines, n)} g ${NUTRIENT_LABEL[n].slice(2).toLowerCase()}`,
    );
  }
  if (framing === 3) return identityTags(answers, engine);
  /* what the box was picked around: the goal's nutrient, else the first thing they look for */
  const asked = answers.watch.some((w) => WATCH_NUTRIENT[w]);
  const focus = engine.goal !== "easy" || asked ? [PICKED_FOR[nutrientsFor(answers, engine)[0]]] : [];
  return ["100% plant-based", ...focus, heat, ...cuisine];
}


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
