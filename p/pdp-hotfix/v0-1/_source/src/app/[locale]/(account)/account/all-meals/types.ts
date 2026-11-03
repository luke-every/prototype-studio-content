// Shared types used by both server (data.ts) and client (AllMealsClient, FilterSortDrawer).
// This file must NOT import anything server-only (next/headers, next/server, etc.).

export type MealLabel = {
  text: string;
  /** Hex color from the product's own `label_background` field in Storyblok — absent until an editor sets one. */
  color?: string;
};

export type Meal = {
  id: string;
  /** Shopify Product GID from Storyblok shopify plugin (temporary key for subscription sync) */
  shopifyProductId: string | null;
  sku: string | null;
  productType: string | null;
  variantTitle: string | null;
  /** Shopify product handle (slug), used to open the meal detail modal. */
  handle: string | null;
  title: string;
  subtitle: string;
  price: string | null;
  priceEur: number | null;
  protein: string | null;
  kcal: string | null;
  carbs: string | null;
  fats: string | null;
  rating: number | null;
  reviewCount: number | null;
  image: string;
  /** Shown on hover in place of `image`, when Storyblok's `images` field has a second entry. */
  secondImage?: string | null;
  weightGrams?: number | null;
  isAddon: boolean;
  soldOut?: boolean;
  tags?: string[];
  label?: MealLabel | null;
};

export type BundleItem = {
  uuid: string;
  title: string | null;
  fullSlug: string;
  image: string | null;
  imageAlt: string | null;
  description: string | null;
};

export type MealCategory = {
  id: string;
  /** Storyblok blok `id` field used as the URL hash anchor (e.g. "bestseller"). Falls back to `id` (_uid) when absent. */
  anchor?: string;
  label: string;
  meals: Meal[];
  bundleItems?: BundleItem[];
};

export type FilterOption = {
  id: string;
  label: string;
};

export type FilterSection = {
  id: string;
  label: string;
  options: FilterOption[];
  footnote?: string;
};

