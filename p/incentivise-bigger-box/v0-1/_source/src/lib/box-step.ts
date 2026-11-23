import type { BundleMeal, BundleVariant } from "@/components/website/bundle-v3/types";

/** What going up one box size means, worked out from the two boxes so no component does the sums. */
export type BoxStep = {
  next: BundleVariant;
  extraMeals: number;
  extraPrice: number;
  pricePerExtraMeal: number;
  extraSaving: number;
  /** Dishes in the next box that are not in this one */
  newDishes: BundleMeal[];
};

const saved = (v: BundleVariant): number => v.config.bundlePrice - v.config.bundleDiscountedPrice;

/** Share of the list price taken off, as a whole percent. */
export function savingPercent(v: BundleVariant): number {
  return Math.round((saved(v) / v.config.bundlePrice) * 100);
}

/** Smallest box first. */
export function bySize(variants: BundleVariant[]): BundleVariant[] {
  return [...variants].sort((a, b) => a.config.mealCount - b.config.mealCount);
}

/** Dishes in `box` that are not in `previous` (all of them when there is no previous box). */
export function addedDishes(box: BundleVariant, previous?: BundleVariant): BundleMeal[] {
  const had = new Set(previous?.meals.map((m) => m.id));
  return box.meals.filter((m) => !had.has(m.id));
}

/** The step from `selected` to the next size up, or null when it is already the biggest. */
export function stepUp(variants: BundleVariant[], selected: BundleVariant): BoxStep | null {
  const next = bySize(variants).find((v) => v.config.mealCount > selected.config.mealCount);
  if (!next) return null;
  const extraMeals = next.config.mealCount - selected.config.mealCount;
  const extraPrice = next.config.bundleDiscountedPrice - selected.config.bundleDiscountedPrice;
  return {
    next,
    extraMeals,
    extraPrice,
    pricePerExtraMeal: extraPrice / extraMeals,
    extraSaving: saved(next) - saved(selected),
    newDishes: addedDishes(next, selected),
  };
}

// TODO(lift): sample data — replace with the quantity-discount tiers from pricing (GTM Strategy: 10–14 −10%, 15–19 −15%, 20–24 −20%, 25+ −25%)
export const DISCOUNT_TIERS: { from: number; percent: number }[] = [
  { from: 10, percent: 10 },
  { from: 15, percent: 15 },
  { from: 20, percent: 20 },
  { from: 25, percent: 25 },
];

/** Index of the tier a meal count is in (the last tier whose start it has reached). */
export function tierIndex(meals: number): number {
  return DISCOUNT_TIERS.reduce((found, tier, i) => (meals >= tier.from ? i : found), 0);
}

/** How far along a bar of one column per tier a meal count sits, as a fraction: it moves through a tier's column as the count nears the next tier. */
export function tierProgress(meals: number): number {
  const i = tierIndex(meals);
  const next = DISCOUNT_TIERS[i + 1];
  const within = next ? (meals - DISCOUNT_TIERS[i].from) / (next.from - DISCOUNT_TIERS[i].from) : 0;
  return (i + within + 0.5) / DISCOUNT_TIERS.length;
}

/** What a bigger box adds to this one, dish by dish: a dish that is new, or one the box already has with another portion. Quantities add up to the extra meals. */
export function extraMeals(box: BundleVariant, next: BundleVariant): { meal: BundleMeal; qty: number; isNew: boolean }[] {
  return next.meals.flatMap((meal) => {
    const own = box.meals.find((m) => m.id === meal.id);
    const qty = (meal.qty ?? 1) - (own?.qty ?? 0);
    return qty > 0 ? [{ meal, qty, isNew: !own }] : [];
  });
}
