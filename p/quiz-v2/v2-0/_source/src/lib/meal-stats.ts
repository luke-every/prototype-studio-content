import type { EngineAnswers, Goal, Meal } from "./recommendation";

export type Stat = "prot" | "fib" | "kcal" | "sugar";

/** The nutrient each goal leans on */
const GOAL_STAT: Record<Goal, Stat> = { fitness: "prot", lose: "kcal", baby: "prot", gut: "fib", easy: "prot" };

const WATCH_STAT: Record<string, Stat> = { protein: "prot", fibre: "fib", sugar: "sugar", diabetes: "sugar", portions: "kcal" };

/**
 * The two numbers every meal card shows, the same two on every card so meals compare at a glance.
 * The first is always the goal's nutrient: protein for fitness, kcal for eating lighter. The second is
 * the first thing they said they look for that isn't the same number; with nothing to go on it is
 * protein, or fibre where protein already leads.
 */
export function statsFor(answers: EngineAnswers): Stat[] {
  const goal = GOAL_STAT[answers.goal];
  const second = answers.watch.map((w) => WATCH_STAT[w]).find((stat) => stat && stat !== goal);
  return [goal, second ?? (goal === "prot" ? "fib" : "prot")];
}

// TODO(lift): replace with translation keys
export function statText(meal: Meal, stat: Stat): string {
  if (stat === "kcal") return `${meal.kcal} kcal`;
  const grams = Math.round(meal[stat]);
  return { prot: `${grams} g protein`, fib: `${grams} g fibre`, sugar: `${grams} g sugar` }[stat];
}
