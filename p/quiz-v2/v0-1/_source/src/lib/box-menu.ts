import { BOX_CONTENTS, BUNDLE_MENU } from "@/components/website/results/menu-data";
import {
  PLACEHOLDER_MEAL_COUNT,
  PLACEHOLDER_MENU,
  PLACEHOLDER_RAILS,
} from "@/components/website/results/sample-data";
import type { BundleKey } from "@/components/website/quiz/types";
import type { MenuItem, Products, Rail } from "@/components/website/results/types";
import { mealPhoto } from "./photos";

/**
 * A bundle's rails for the size picked, empty rails dropped — or null while the live data isn't
 * there, so callers fall back to the placeholders.
 */
export function railsFor(key: BundleKey, products: Products | null, sizeIdx: number): Rail[] | null {
  if (!products) return null;
  const sizes = BOX_CONTENTS[key];
  const inBox = sizes[Math.min(sizeIdx, sizes.length - 1)];
  return BUNDLE_MENU[key]
    .map(([heading, slugs]) => ({
      heading,
      items: slugs
        .filter((slug) => products[slug] && (!inBox || inBox[slug]))
        .map((slug): MenuItem => ({
          name: products[slug].name,
          image: products[slug].image,
          slug,
          qty: inBox?.[slug] ?? 1,
        })),
    }))
    .filter((rail) => rail.items.length > 0);
}

/** The placeholder rails, whose missing pictures borrow from the meal pool */
export function placeholderRails(): Rail[] {
  return PLACEHOLDER_RAILS.map(([heading, items]) => ({
    heading,
    items: items.map(([name, image], i) => ({
      name,
      image: image ?? mealPhoto(i + 1, PLACEHOLDER_MEAL_COUNT),
      slug: "",
      qty: 1,
    })),
  }));
}

/** The grid bundles' dishes — live or placeholder */
export function menuFor(key: BundleKey, products: Products | null, sizeIdx: number): MenuItem[] {
  const live = railsFor(key, products, sizeIdx);
  if (live) return live.flatMap((rail) => rail.items);
  return PLACEHOLDER_MENU.map(([name, n]) => ({
    name,
    image: mealPhoto(n, PLACEHOLDER_MEAL_COUNT),
    slug: "",
    qty: 1,
  }));
}

/** How many meals the box holds — duplicates counted, smoothies and snacks not. Placeholders count one each. */
export function mealCount(items: MenuItem[], products: Products | null): number {
  return items.reduce((n, item) => n + (!products?.[item.slug] || products[item.slug].meal ? item.qty : 0), 0);
}
