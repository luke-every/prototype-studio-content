import type { Meal } from "@/lib/recommendation";
import type { BoxLine } from "./useBox";

/** A meal's portions count once each */
function perMeal(lines: BoxLine[], value: (meal: Meal) => number): number {
  const units = lines.reduce((n, line) => n + line.qty, 0);
  return lines.reduce((sum, line) => sum + value(line.meal) * line.qty, 0) / Math.max(units, 1);
}

const HEAT: Record<Meal["spice"], number> = { nein: 0, "a little": 1, very: 2 };

/** How hot the box is overall, as 1–3 chillies */
export function boxHeat(lines: BoxLine[]): 1 | 2 | 3 {
  const heat = perMeal(lines, (meal) => HEAT[meal.spice]);
  return heat < 0.34 ? 1 : heat < 1 ? 2 : 3;
}

/** "a, b or c" */
export function orList(items: string[]): string {
  return items.length < 2 ? (items[0] ?? "") : `${items.slice(0, -1).join(", ")} or ${items.at(-1)}`;
}
