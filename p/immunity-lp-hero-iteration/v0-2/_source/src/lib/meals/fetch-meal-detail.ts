import { sampleMealDetail } from "./sample-meals";
import type { MealDetailApiResponse } from "./meal-detail";
import { STORYBLOK_TOKEN } from "@/lib/storyblok-products";

// PROTOTYPE STAND-IN for GET /api/product (the meal detail modal's data). Production builds the response server-side
// from Storyblok + Shopify. A studio prototype is a static export, so there is no API route: the browser reads the
// product story from the public Storyblok CDN (no Shopify, so no price or sold-out state) and falls back to sample
// meals if the slug isn't published. Needs the storyblok-products kit (the CDN token lives in lib/storyblok-products.ts).
export async function fetchMealDetail(slug: string): Promise<MealDetailApiResponse> {
  const res = await fetch(
    `https://api.storyblok.com/v2/cdn/stories/products/${encodeURIComponent(slug)}?token=${STORYBLOK_TOKEN}&version=published`,
  );
  if (!res.ok) return sampleMealDetail(slug);
  const { story } = (await res.json()) as { story: MealDetailApiResponse["story"] };
  return {
    story,
    rels: [],
    translatedSlugs: {},
    soldOut: false,
    filterDatasources: { nutritionFilter: [], spicinessFilter: [], recipeWithoutFilter: [] },
  };
}
