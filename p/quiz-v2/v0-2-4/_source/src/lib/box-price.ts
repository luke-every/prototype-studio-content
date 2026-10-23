import type { Meal } from "./recommendation";
import { UPSELLS } from "./recommendation-data";

/** Price per meal from this many meals up: [from, plant-based, plant-based meat] */
// TODO(lift): sample data — replace with the pricing sheet ("New Logic Bundle Master" tiers, DE)
const TIERS: [number, number, number][] = [
  [25, 6.74, 7.49],
  [20, 7.19, 7.99],
  [15, 7.64, 8.49],
  [12, 8.09, 8.99],
  [10, 7.99, 8.99],
  [3, 8.99, 9.99],
];

/** The first-order discount, on meals and add-ons alike */
const FIRST_ORDER = 0.2;

export type BoxPrice = {
  /** What the customer pays */
  total: number;
  /** The same box at list prices */
  was: number;
  /** Saved by the first-order discount and by the quantity tier */
  firstOrder: number;
  quantity: number;
  /** The average price of a meal in the box, after the discount: meals differ (plant-based meat costs more) */
  perMeal: number;
};

function mealPrice(meal: Meal, units: number): number {
  const tier = TIERS.find(([from]) => units >= from);
  if (!tier) return meal.fake ? 9.99 : 8.99;
  return meal.fake ? tier[2] : tier[1];
}

function addOnPrice(key: string, units: number): number {
  const item = UPSELLS[key];
  const tier = [25, 20, 15, 12].find((from) => units >= from);
  return (tier && item.tiers?.[tier]) || item.price;
}

/** Meals at the box's quantity tier, the breakfast, shot and any add-ons at the same tier, then 20% off */
export function boxPrice(lines: { meal: Meal; qty: number }[], extras: string[]): BoxPrice {
  const units = lines.reduce((n, l) => n + l.qty, 0);
  const mealGross = lines.reduce((sum, l) => sum + l.qty * mealPrice(l.meal, units), 0);
  const gross = mealGross + extras.reduce((sum, key) => sum + addOnPrice(key, units), 0);
  const was =
    lines.reduce((sum, l) => sum + l.qty * (l.meal.fake ? 9.99 : 8.99), 0) +
    extras.reduce((sum, key) => sum + UPSELLS[key].price, 0);
  return {
    total: gross * (1 - FIRST_ORDER),
    was,
    firstOrder: gross * FIRST_ORDER,
    quantity: was - gross,
    perMeal: (mealGross * (1 - FIRST_ORDER)) / units,
  };
}

/** €6,41 — DE formatting */
export function euro(value: number): string {
  return `€${value.toFixed(2).replace(".", ",")}`;
}

/** What an add-on adds to the total: at the box's tier, after the first-order discount */
export function addOnTotal(keys: string[], units: number): number {
  return keys.reduce((sum, key) => sum + addOnPrice(key, units), 0) * (1 - FIRST_ORDER);
}
