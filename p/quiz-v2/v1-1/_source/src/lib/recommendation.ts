import type { Answers } from "@/components/website/quiz/types";
import { FREE_FROM_12, MEALS, UPSELLS } from "./recommendation-data";

/*
 * The V2 onboarding-quiz recommendation logic, ported from engine.html (Notion: "Recommendation Logic -
 * [V2] NC Onboarding Quiz"). It picks meals and recommended add-ons from the quiz answers.
 *
 * The box only ever holds meals. Add-ons (breakfast, smoothies, shots, protein, treats) are recommendations:
 * nothing but meals is ever put in the box for the customer; an add-on goes in only when they choose it.
 * The spec's breakfast and shot pack in every box are left out on purpose for that reason.
 * Margin and COGS are left out: they never fed the selection. Prices are in box-price.ts.
 */

export type Goal = "fitness" | "lose" | "baby" | "easy" | "gut";
type Spice = "not" | "ok" | "medium" | "very";
type Watch = "protein" | "fibre" | "sugar" | "diabetes";
type Household = "me" | "partner" | "family" | "room";

export type Meal = {
  sku: string;
  /** Plant-based meat, priced a tier up */
  fake: boolean;
  name: string;
  /** Menu category: Pasta & Noodles, Currys & Dals, Signature Bowls or Salads */
  cat: string;
  cuis: string;
  spice: "nein" | "a little" | "very";
  kcal: number;
  carb: number;
  fib: number;
  prot: number;
  sugar: number;
  contains: string[];
  rating: number;
  reviews: number;
};

export type Upsell = {
  name: string;
  /** The Storyblok product it shows as */
  slug: string;
  /** List price */
  price: number;
  sugar: number;
  treat: boolean;
  contains: string[];
};

export type EngineAnswers = {
  goal: Goal;
  house: Household;
  spice: Spice;
  cuisines: string[];
  allergies: string[];
  watch: Watch[];
};

export type Recommendation = {
  /** Meals in rank order, with how many of each go in the box */
  lines: { meal: Meal; qty: number }[];
  /**
   * So few meals avoid their allergens that not even 15 could be built with repeats: the box is every meal
   * they can eat, or the allergen-safe box when none at all can be eaten
   */
  fallback: boolean;
  /** Every eligible meal by rank, low-rated ones last: what a swap or an added meal can come from */
  pool: Meal[];
  /** Recommended add-ons in order (keys of UPSELLS), each with the answer that earned it. Never pre-added */
  addOns: { key: string; why: string }[];
  /** How well each eligible meal fits the answers, 0–1, by SKU: the overall score and the signals behind it */
  fit: Record<string, Fit>;
};

/** `cuis` and `nutr` are null when the customer gave no answer that scores them */
export type Fit = { score: number; goal: number; qual: number; spice: number; cuis: number | null; nutr: number | null };

const WEIGHTS = { goal: 0.25, qual: 0.25, spice: 0.15, cuis: 0.15, nutr: 0.1 };
const HOLD_RATING = 3.8;
const HOLD_MIN_REVIEWS = 50;
const NEW_REVIEWS = 20;
const NEW_CAP = 2;
const MAX_PER_MEAL = 2;
/** A box that can't be filled steps down through these; below them, it's every meal they can eat */
const BOX_STEPS = [20, 18, 16, 15];
const LOW_SUGAR_MAX = 5;

const SPICE_MATRIX: Record<Spice, Record<Meal["spice"], number>> = {
  not: { nein: 1, "a little": 0.3, very: 0 },
  ok: { nein: 1, "a little": 0.7, very: 0.2 },
  medium: { nein: 0.6, "a little": 1, very: 0.4 },
  very: { nein: 0.4, "a little": 0.8, very: 1 },
};

/** Which of protein, fibre and kcal a goal already scores, so the "watch" answers don't count them twice */
const GOAL_USES: Record<Goal, string[]> = {
  fitness: ["prot", "fib"],
  lose: ["prot", "fib", "kcal"],
  baby: ["prot", "fib"],
  easy: ["prot", "fib", "kcal"],
  gut: ["prot", "fib", "kcal"],
};

// TODO(lift): sample data — goal criteria are a draft from the Eve goal framework, not yet approved (O5)
function goalCriteria(meal: Meal, goal: Goal): boolean[] {
  switch (goal) {
    case "fitness":
      return [meal.prot >= 25, meal.fib >= 8];
    case "lose":
      return [meal.prot >= 20, meal.fib >= 8, meal.kcal < 520];
    case "baby":
      return [meal.prot >= 20, meal.fib >= 12];
    case "easy":
      return [
        meal.prot >= 15,
        meal.fib >= 8,
        meal.kcal >= 400 && meal.kcal <= 600,
        meal.carb >= 45 && meal.carb <= 80,
      ];
    case "gut":
      return [meal.prot >= 15, meal.fib >= 12, meal.kcal >= 400 && meal.kcal <= 600];
  }
}

// TODO(lift): sample data — nutrition-watch thresholds are provisional until O7 is decided
function watchCriteria(answers: EngineAnswers): ((meal: Meal) => boolean)[] {
  const uses = GOAL_USES[answers.goal];
  const criteria: ((meal: Meal) => boolean)[] = [];
  if (answers.watch.includes("protein") && !uses.includes("prot")) criteria.push((m) => m.prot >= 20);
  if (answers.watch.includes("fibre") && !uses.includes("fib")) criteria.push((m) => m.fib >= 10);
  if (answers.watch.includes("sugar")) criteria.push((m) => m.sugar <= 10);
  return criteria;
}

/** Review quality 0–1 across established meals, smoothed towards the catalogue average; new meals sit at 0.5 */
const QUALITY = (() => {
  const smoothed = (m: Meal) => (m.reviews * m.rating + 30 * 4.44) / (m.reviews + 30);
  const established = MEALS.filter((m) => m.reviews >= NEW_REVIEWS).map(smoothed);
  const lo = Math.min(...established);
  const hi = Math.max(...established);
  return new Map(MEALS.map((m) => [m.sku, m.reviews < NEW_REVIEWS ? 0.5 : (smoothed(m) - lo) / (hi - lo)]));
})();

const isNew = (m: Meal) => m.reviews < NEW_REVIEWS;
const isHeld = (m: Meal) => m.rating < HOLD_RATING && m.reviews >= HOLD_MIN_REVIEWS;

function itemOk(key: string, allergies: string[], lowSugar: boolean): boolean {
  const item = UPSELLS[key];
  if (item.contains.some((a) => allergies.includes(a))) return false;
  return !(lowSugar && (item.sugar > LOW_SUGAR_MAX || item.treat));
}

/** Up to 3 slots — goal, preference, treat — each filled from its first option that passes every filter */
function addOnsFor(answers: EngineAnswers): Recommendation["addOns"] {
  const { allergies, goal } = answers;
  const lowSugar = answers.watch.includes("sugar") || answers.watch.includes("diabetes");
  const protein = ["boonian", "planted"];
  const used = new Set<string>();
  const slots: { items: string[]; why: string }[] = [];
  const free = (items: string[]) => items.every((key) => itemOk(key, allergies, lowSugar) && !used.has(key));

  const pick = (options: string[][], why: string) => {
    const items = options.find(free);
    if (!items) return;
    items.forEach((key) => used.add(key));
    slots.push({ items, why });
  };

  const goalOptions: Record<Goal, string[][]> = {
    fitness: [protein, ["porridge"]],
    lose: [["dg3"], ["herbal"]],
    baby: [["porridge", "mt3"], ["porridge", "herbal"], ["herbal"]],
    easy: [["bites"], ["mt3"], ["herbal"]],
    gut: [["porridge", "tb3"], ["porridge", "herbal"], ["herbal"]],
  };
  pick(goalOptions[goal], goal);

  const preferences: [string[], string][] = [];
  if (answers.spice === "medium" || answers.spice === "very") preferences.push([["chili"], "Likes spicy food"]);
  if (answers.watch.includes("protein") && goal !== "fitness") preferences.push([protein, "More protein"]);
  if (answers.watch.includes("fibre")) preferences.push([["porridge"], "More fibre"]);
  const preferred = preferences.find(([items]) => free(items));
  if (preferred) pick([preferred[0]], preferred[1]);

  /* no treat for weight loss or low sugar */
  if (goal !== "lose" && !lowSugar) {
    if (answers.house === "family") pick([["bites"], ["mt3"]], "Family with kids");
    else pick([["crumbles"], ["chocball"]], "Treat");
  }

  return slots.flatMap(({ items, why }) => items.map((key) => ({ key, why })));
}

/** The box for these answers: 15 meals for one person, 20 for two or more */
export function recommend(answers: EngineAnswers): Recommendation {
  const { allergies } = answers;
  const criteria = watchCriteria(answers);
  const weights = {
    ...WEIGHTS,
    cuis: answers.cuisines.length ? WEIGHTS.cuis : 0,
    nutr: criteria.length ? WEIGHTS.nutr : 0,
  };
  const total = weights.goal + weights.qual + weights.spice + weights.cuis + weights.nutr;

  const fit: Record<string, Fit> = {};
  const ranked = MEALS.filter((m) => !m.contains.some((a) => allergies.includes(a)))
    .map((meal) => {
      const met = goalCriteria(meal, answers.goal);
      const goal = met.filter(Boolean).length / met.length;
      const qual = QUALITY.get(meal.sku) ?? 0.5;
      const spice = SPICE_MATRIX[answers.spice][meal.spice];
      const cuis = answers.cuisines.includes(meal.cuis) ? 1 : 0;
      const nutr = criteria.length ? criteria.filter((f) => f(meal)).length / criteria.length : 0;
      const score = (weights.goal * goal + weights.qual * qual + weights.spice * spice + weights.cuis * cuis + weights.nutr * nutr) / total;
      fit[meal.sku] = { score, goal, qual, spice, cuis: weights.cuis ? cuis : null, nutr: weights.nutr ? nutr : null };
      return { meal, score, goal, qual, spice };
    })
    .sort((a, b) => b.score - a.score || b.goal - a.goal || b.qual - a.qual || b.spice - a.spice || a.meal.sku.localeCompare(b.meal.sku))
    .map((r) => r.meal);

  /* low-rated meals never enter the box; new meals past the cap move behind the established ones */
  const order: Meal[] = [];
  const later: Meal[] = [];
  ranked
    .filter((m) => !isHeld(m))
    .forEach((m) => {
      if (isNew(m) && order.filter(isNew).length >= NEW_CAP) later.push(m);
      else order.push(m);
    });
  order.push(...later);

  const build = (target: number) => {
    const pick = order.slice(0, target);
    const qty = new Map(pick.map((m) => [m.sku, 1]));
    let units = pick.length;
    for (let pass = 2; pass <= MAX_PER_MEAL && units < target; pass++) {
      for (const m of pick) {
        if (units >= target) break;
        qty.set(m.sku, pass);
        units++;
      }
    }
    return units >= target ? { pick, qty, units } : null;
  };

  let target: number = answers.house === "me" ? 15 : 20;
  let built = build(target);
  while (!built) {
    const next = BOX_STEPS.find((n) => n < target);
    if (next === undefined) break;
    target = next;
    built = build(target);
  }
  /*
   * Not even 15 with repeats: there's no minimum order, and a smaller box beats none, so it's every meal
   * they can eat, each as often as a meal may come. Only with no meal at all is it the allergen-safe box.
   */
  const limited = !built;
  if (!built && order.length) built = build(order.length * MAX_PER_MEAL);

  const pool = [...ranked.filter((m) => !isHeld(m)), ...ranked.filter(isHeld)];
  const lines = built
    ? built.pick.map((meal) => ({ meal, qty: built.qty.get(meal.sku) ?? 1 }))
    : FREE_FROM_12.map(([sku, qty]) => ({ meal: MEALS.find((m) => m.sku === sku) as Meal, qty }));
  return { lines, fallback: limited, pool, addOns: addOnsFor(answers), fit };
}

const GOALS: Record<string, Goal> = { protein: "fitness", portions: "lose", postpartum: "baby", better: "easy", gut: "gut" };
const HOUSEHOLDS: Record<string, Household> = { alone: "me", partner: "partner", family: "family", roommates: "room" };
const SPICES: Record<string, Spice> = { very: "very", medium: "medium", can: "ok", no: "not" };
const CUISINES: Record<string, string> = {
  asian: "Asian",
  indian: "Indian",
  italian: "Italian",
  german: "German",
  latin: "Latin American Food",
};
const ALLERGENS: Record<string, string> = {
  gluten: "Cereals containing gluten",
  soy: "Soybeans",
  mustard: "Mustard",
  nuts: "Tree nuts",
  sesame: "Sesame",
  celery: "Celery",
};
const WATCHES: Record<string, Watch> = { protein: "protein", fibre: "fibre", sugar: "sugar", diabetes: "diabetes" };

/**
 * The quiz answers in the engine's terms. Skipped questions take the defaults, as bundleOf does for the goal.
 * "Right-sized portions", "More plant-based", "Other" allergies and "Not sure" have no engine rule yet.
 */
export function engineAnswers(answers: Answers): EngineAnswers {
  const allergic = answers.allergy[0] === "yes";
  return {
    goal: GOALS[answers.goal[0]] ?? "fitness",
    house: HOUSEHOLDS[answers.household[0]] ?? "me",
    spice: SPICES[answers.spicy[0]] ?? "ok",
    cuisines: answers.cuisine.flatMap((c) => CUISINES[c] ?? []),
    allergies: allergic ? answers.allergyWhich.flatMap((a) => ALLERGENS[a] ?? []) : [],
    watch: answers.watch.flatMap((w) => WATCHES[w] ?? []),
  };
}
