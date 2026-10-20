// PROTOTYPE STAND-IN for GET /api/product?slug=<slug> (the meal detail modal's data), run client-side
// instead of behind a server route so the prototype stays a static build. Production builds this
// response server-side from Storyblok + Shopify (see src/lib/meals/meal-detail.ts).
import type { MealDetailApiResponse } from "@/lib/meals/meal-detail";
import { STORYBLOK_TOKEN } from "@/lib/storyblok-products";
import { sampleMealDetail } from "./sample-meal-detail";

export async function fetchMealDetail(slug: string): Promise<MealDetailApiResponse | null> {
  const res = await fetch(
    `https://api.storyblok.com/v2/cdn/stories/products/${encodeURIComponent(slug)}?token=${STORYBLOK_TOKEN}&version=published`,
  );
  if (res.ok) {
    const { story } = (await res.json()) as { story: MealDetailApiResponse["story"] };
    return {
      story,
      rels: [],
      translatedSlugs: {},
      soldOut: false,
      filterDatasources: { nutritionFilter: [], spicinessFilter: [], recipeWithoutFilter: [] },
    };
  }
  return sampleMealDetail(slug);
}
