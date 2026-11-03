import type { Meal } from "./recommendation";
import { UPSELLS } from "./recommendation-data";

/** Quantity discount: from this many products in the box (meals and add-ons), this much off */
// TODO(lift): sample data — replace with the pricing source (Shopify)
export const QUANTITY: [number, number][] = [
  [25, 0.25],
  [20, 0.2],
  [15, 0.15],
  [10, 0.1],
];

/** The first-order discount, taken after the quantity discount */
const FIRST_ORDER = 0.2;

export type BoxPrice = {
  /** What the customer pays */
  total: number;
  /** The same box at list prices */
  was: number;
  /** The quantity discount's rate, 0 below 10 products */
  quantityRate: number;
  /** Saved by the quantity discount and by the first-order discount */
  quantity: number;
  firstOrder: number;
  /** The average price of a meal in the box, after both discounts: meals differ (plant-based meat costs more) */
  perMeal: number;
};

const listPrice = (meal: Meal): number => (meal.fake ? 9.99 : 8.99);

export function quantityRate(products: number): number {
  return QUANTITY.find(([from]) => products >= from)?.[1] ?? 0;
}

/** Everything at list price, the quantity discount on the lot, then 20% off what's left */
export function boxPrice(lines: { meal: Meal; qty: number }[], extras: string[]): BoxPrice {
  const units = lines.reduce((n, l) => n + l.qty, 0);
  const rate = quantityRate(units + extras.length);
  const mealsWas = lines.reduce((sum, l) => sum + l.qty * listPrice(l.meal), 0);
  const was = mealsWas + extras.reduce((sum, key) => sum + UPSELLS[key].price, 0);
  const afterQuantity = was * (1 - rate);
  return {
    total: afterQuantity * (1 - FIRST_ORDER),
    was,
    quantityRate: rate,
    quantity: was * rate,
    firstOrder: afterQuantity * FIRST_ORDER,
    perMeal: units ? (mealsWas * (1 - rate) * (1 - FIRST_ORDER)) / units : 0,
  };
}

/** What one meal costs in a box of this many products, after both discounts, as the box's average per meal is worked out */
export function mealPrice(meal: Meal, products: number): number {
  return listPrice(meal) * (1 - quantityRate(products)) * (1 - FIRST_ORDER);
}

/** €6,41 — DE formatting */
export function euro(value: number): string {
  return `€${value.toFixed(2).replace(".", ",")}`;
}

/** What add-ons cost in a box of this many products, after both discounts */
export function addOnTotal(keys: string[], products: number): number {
  return keys.reduce((sum, key) => sum + UPSELLS[key].price, 0) * (1 - quantityRate(products)) * (1 - FIRST_ORDER);
}
