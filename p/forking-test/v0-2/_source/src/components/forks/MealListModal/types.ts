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
};

export type BundleVariant = {
  id: number;
  label: string;
  badge?: string;
  config: VariantConfiguration;
  meals: BundleMeal[];
};

export type BundleSwitchItem = {
  id: string;
  label: string;
  color: string;
  href?: string;
};

export type BundleReview = {
  name: string;
  /** Short badge, e.g. the product reviewed */
  title?: string;
  rating: number;
  comments: string;
};
