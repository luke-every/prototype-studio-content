// PROTOTYPE SHIM — not the production file. Same export names/signatures as every-website so callers lift back unchanged;
// swap this file for the real one when the code moves into the app.
// Types only. Production builds this response server-side from Storyblok + Shopify + datasources (/api/product).
// The story types below are copied verbatim from all-meals/data.ts, with the Storyblok-client types simplified.

import type { Market } from "@/lib/market";
import type { Locale } from "@/lib/locale";
import type { ProductDisplayDetails } from "@/lib/shopify/bundles";
import type { MealFilterDatasources } from "@/lib/storyblok/datasources";

export type { Review } from "@/lib/reviewsio/client";
export type { SbShopifyItem };

type SbBlok = { _uid: string; component: string; id?: string };
type SbMetatags = { title?: string; description?: string };
type SbStory<T> = { id: number; uuid: string; name: string; slug: string; full_slug: string; content: T };
type StoryblokRichtext = unknown;
export type { Market };

type SbShopifyItem = {
  id: string;
  sku?: string | null;
  name: string;
  type?: string;
  image: string;
  handle: string;
  variants?: unknown;
  description?: string;
};

type SbShopifyPlugin = {
  items: SbShopifyItem[];
  plugin: string;
};

// Storyblok asset field shape (image uploads).
export type SbAsset = {
  id?: number | null;
  alt?: string | null;
  filename: string | null;
  fieldtype?: string;
};

export type SbProductContent = SbBlok & {
  /** Bundle stories reuse this type. V3 renders its own `header_body`, so the page must not. */
  version?: string;
  component: "product";
  kcal: string;
  carbs: string;
  fat: string;
  protein: string;
  /** Optional — most existing product stories haven't been back-filled with this field yet. */
  fibre?: string;
  label?: string;
  // Hex background colour for the label badge, set per-product in Storyblok (field name as authored in the CMS).
  label_background?: string;
  short_description?: string;
  price?: string;
  rating?: number;
  // Storyblok asset image for the product (higher resolution than Shopify plugin image).
  image?: SbAsset;
  // When present, images[0] is the default card image and images[1] is shown on hover.
  images?: SbAsset[];
  // Rich text fields used on the meal detail page.
  description?: unknown;
  highlights?: unknown;
  ingredients?: unknown;
  nutritional_values?: unknown;
  preparation?: unknown;
  // Product weight in grams (e.g., "450").
  product_weight?: string;
  shopify_product: SbShopifyPlugin;
  // Can be "" (empty string) when not set in Storyblok
  shopify_product_dev?: SbShopifyPlugin | "" | null;
  shopify_product_da?: SbShopifyPlugin | "" | null;
  shopify_product_bnl?: SbShopifyPlugin | "" | null;
  shopify_product_ch?: SbShopifyPlugin | "" | null;
  // Optional market-specific Shopify plugin fields in Storyblok, e.g. shopify_product_de
  [key: `shopify_product_${string}`]: SbShopifyPlugin | "" | null | undefined;
  // Per-market stock status, one of the `stock-status` datasource values. Absent on every product
  // story that predates the field — see resolveStockStatus for the fallback chain.
  stock_status?: string | null;
  stock_status_dev?: string | null;
  stock_status_da?: string | null;
  stock_status_bnl?: string | null;
  stock_status_ch?: string | null;
  [key: `stock_status_${string}`]: string | null | undefined;
  base_filter?: string;
  nutrition_filter?: string[];
  trition_filter?: string[]; // typo on some products in Storyblok
  spiciness_filter?: string;
  recipe_without_filter?: string[];
  metatags?: SbMetatags;
  body?: SbBlok[];
  header_body?: SbBlok[];
  header_richtext?: StoryblokRichtext;
};

export type SbProductStory = SbStory<SbProductContent>;

export type MealDetailData = {
  story: SbProductStory;
  product?: ProductDisplayDetails;
  rels: unknown[];
  translatedSlugs: Partial<Record<Locale, string>>;
  soldOut: boolean;
};

/** Shape of the /api/product response — meal detail data plus the filter datasources for translating tags. */
export type MealDetailApiResponse = MealDetailData & { filterDatasources: MealFilterDatasources };
