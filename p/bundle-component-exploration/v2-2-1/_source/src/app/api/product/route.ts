import { NextResponse } from "next/server";
import { sampleMealDetail } from "./sample-meals";
import type { MealDetailApiResponse } from "@/lib/meals/meal-detail";
import { STORYBLOK_TOKEN } from "@/lib/storyblok-products";

// PROTOTYPE STAND-IN for GET /api/product?slug=<slug>&locale=<locale>[&id=<gid>] (the meal detail modal's data).
// Production builds the response from Storyblok + Shopify. Here, in order:
//   1. MEALS_API_BASE set (e.g. a deployed every-website): forward the request to that app's real /api/product.
//   2. Otherwise read the product story from the public Storyblok CDN (no Shopify, so no price or sold-out state).
//   3. If the slug isn't published there, fall back to the sample meals.
// Needs the storyblok-products kit (the CDN token lives in lib/storyblok-products.ts).
export async function GET(request: Request): Promise<NextResponse> {
  const url = new URL(request.url);
  const base = process.env.MEALS_API_BASE;
  if (base) {
    const upstream = await fetch(`${base}/api/product${url.search}`, { cache: "no-store" });
    return NextResponse.json(await upstream.json(), { status: upstream.status });
  }

  const slug = url.searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });

  const res = await fetch(
    `https://api.storyblok.com/v2/cdn/stories/products/${encodeURIComponent(slug)}?token=${STORYBLOK_TOKEN}&version=published`,
    { next: { revalidate: 300 } },
  );
  if (res.ok) {
    const { story } = (await res.json()) as { story: MealDetailApiResponse["story"] };
    const detail: MealDetailApiResponse = {
      story,
      rels: [],
      translatedSlugs: {},
      soldOut: false,
      filterDatasources: { nutritionFilter: [], spicinessFilter: [], recipeWithoutFilter: [] },
    };
    return NextResponse.json(detail);
  }
  return NextResponse.json(sampleMealDetail(slug));
}
