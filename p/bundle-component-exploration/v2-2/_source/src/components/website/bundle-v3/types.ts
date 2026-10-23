// Front-end-only shapes for the PDP bundle module. Production derives these from Storyblok bundle variants,
// Shopify products and the discount tiers; prototypes pass them in as plain props.

export type VariantConfiguration = {
  bundlePrice: number;
  mealCount: number;
  amountOffPerBundle: number;
  /** Promo percentage applied after the quantity discount, e.g. 20 */
  promoPercent: number;
  amountOffFromPromo: number;
  bundleDiscountedPrice: number;
  mealDiscountedPrice: number;
};

export type BundleMeal = {
  id: string;
  handle: string;
  title: string;
  image: string;
  /** Plain-text ingredients, for the "View all meals" list */
  ingredients?: string;
  protein?: number;
  fibre?: number;
  kcal?: number;
  /** How many of this meal are in the box; the list repeats it that many times */
  qty?: number;
  /** Product type the meal sits under, e.g. "Main meals", for the shelves layout */
  section?: string;
  /** What the dish is built on ("Rice", "Pasta/Noodles", "Legume", "Potato"), for splitting a meals-only box into shelves */
  base?: string;
  /** Three or so key ingredients, e.g. ["Carrots", "Bok choy", "Wood ear mushroom"] */
  keyIngredients?: string[];
};

export type BundleVariant = {
  id: number;
  label: string;
  badge?: string;
  /** Selected first, like is_default on a Storyblok bundle variant */
  isDefault?: boolean;
  config: VariantConfiguration;
  meals: BundleMeal[];
};

export type BundleSwitchItem = {
  id: string;
  label: string;
  color: string;
  href?: string;
};
