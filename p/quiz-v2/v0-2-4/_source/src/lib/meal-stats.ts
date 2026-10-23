import type { EngineAnswers, Goal, Meal } from "./recommendation";

export type Stat = "prot" | "fib" | "kcal" | "sugar";

/** The nutrient each goal leans on */
const GOAL_STAT: Record<Goal, Stat> = { fitness: "prot", lose: "kcal", baby: "prot", gut: "fib", easy: "prot" };

const WATCH_STAT: Record<string, Stat> = { protein: "prot", fibre: "fib", sugar: "sugar", diabetes: "sugar" };

/**
 * The two numbers every meal card shows, the same two on every card so meals compare at a glance.
 * Eating lighter always leads with kcal. Otherwise what they said they look for comes first, then the
 * goal's nutrient, then protein and fibre to fill: gut health with less sugar shows sugar and fibre, a
 * new parent with nothing to watch shows protein and fibre.
 */
export function statsFor(answers: EngineAnswers): Stat[] {
  const watch = answers.watch.flatMap((w) => WATCH_STAT[w] ?? []);
  const goal = GOAL_STAT[answers.goal];
  const order: Stat[] = answers.goal === "lose" ? ["kcal", ...watch] : [...watch, goal];
  return [...new Set([...order, "prot", "fib"] as Stat[])].slice(0, 2);
}

// TODO(lift): replace with translation keys
export function statText(meal: Meal, stat: Stat): string {
  if (stat === "kcal") return `${meal.kcal} kcal`;
  const grams = Math.round(meal[stat]);
  return { prot: `${grams} g protein`, fib: `${grams} g fibre`, sugar: `${grams} g sugar` }[stat];
}
