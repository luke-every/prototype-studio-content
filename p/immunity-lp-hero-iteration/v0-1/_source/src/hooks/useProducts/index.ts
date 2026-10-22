"use client";

import { useEffect, useState } from "react";
import { apiFetch, isRedirect } from "@/lib/api-client";
import { STORYBLOK_PAGE_SIZE, STORYBLOK_URL, storiesToProducts, type Products, type Story } from "@/lib/storyblok-products";


/**
 * The dishes, from Storyblok. Null until they have loaded, or for good if the request fails, in which
 * case the placeholder menu shows instead.
 */
export function useProducts(): Products | null {
  const [products, setProducts] = useState<Products | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const stories: Story[] = [];
      /* 105 products and counting: keep reading pages until one comes back short */
      for (let page = 1; ; page++) {
        const result = await apiFetch<{ stories: Story[] }>(STORYBLOK_URL + page);
        if (isRedirect(result) || !result.ok) return;
        stories.push(...result.data.stories);
        if (result.data.stories.length < STORYBLOK_PAGE_SIZE) break;
      }
      if (!cancelled) setProducts(storiesToProducts(stories));
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return products;
}
