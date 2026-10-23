"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { apiFetch, isRedirect } from "@/lib/api-client";
import { STORYBLOK_PAGE_SIZE, STORYBLOK_URL, storiesToProducts, type Products, type Story } from "@/lib/storyblok-products";


// TODO(lift): fake cache — production gets the products from its own API route and cache
const CACHE_KEY = "products-cache";

/**
 * The dishes, from Storyblok. Null until they have loaded, or for good if the request fails, in which
 * case the placeholder menu shows instead.
 */
export function useProducts(): Products | null {
  const [products, setProducts] = useState<Products | null>(null);

  // The last response, from localStorage, before the first paint: a return visit shows the menu straight away (the server render
  // can't read it, so this runs on the client only) and the request below then refreshes it quietly.
  useLayoutEffect(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reading an external store (localStorage) that the server render can't
      if (cached) setProducts(JSON.parse(cached) as Products);
    } catch {
      // unreadable or unavailable storage: carry on to the request
    }
  }, []);

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
      if (cancelled) return;
      const fresh = storiesToProducts(stories);
      setProducts(fresh);
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(fresh));
      } catch {
        // storage full or blocked: the next visit just waits for the request
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return products;
}
