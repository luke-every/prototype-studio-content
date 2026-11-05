"use client";

import { useEffect } from "react";
import { STORYBLOK_TOKEN } from "@/lib/storyblok-products";
import type { MealDetailApiResponse } from "@/lib/meals/meal-detail";

/**
 * TODO(lift): fake — a static export has no /api/product route, so in the exported build the meal modal's request is
 * answered here, straight from the public Storyblok CDN (same data as the route). Dev keeps using the real route.
 */
export function StaticProductApi() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    const originalFetch = window.fetch;
    window.fetch = async (input, init) => {
      const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
      if (!url.includes("/api/product")) return originalFetch(input, init);
      const slug = new URL(url, window.location.href).searchParams.get("slug");
      const res = await originalFetch(
        `https://api.storyblok.com/v2/cdn/stories/products/${encodeURIComponent(slug ?? "")}?token=${STORYBLOK_TOKEN}&version=published`,
      );
      if (!res.ok) return res;
      const { story } = (await res.json()) as { story: MealDetailApiResponse["story"] };
      const detail: MealDetailApiResponse = {
        story,
        rels: [],
        translatedSlugs: {},
        soldOut: false,
        filterDatasources: { nutritionFilter: [], spicinessFilter: [], recipeWithoutFilter: [] },
      };
      return Response.json(detail);
    };
    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  return null;
}
