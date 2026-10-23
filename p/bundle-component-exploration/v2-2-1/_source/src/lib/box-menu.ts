import { BOX_CONTENTS, BUNDLE_MENU, type BundleKey } from "@/lib/bundle-composition";
import type { Products } from "@/lib/storyblok-products";

/** A dish in a rail or the grid, with how many sit in the box. */
export type MenuItem = { name: string; image: string; slug: string; qty: number };

export type Rail = { heading: string; items: MenuItem[] };

/**
 * A bundle's rails for the size picked (index into BOX_CONTENTS[key]), empty rails dropped.
 * Null until the products have loaded, so callers can show a placeholder meanwhile.
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

/** How many meals the box holds: duplicates counted, smoothies and snacks not. */
export function mealCount(items: MenuItem[], products: Products | null): number {
  return items.reduce((n, item) => n + (!products?.[item.slug] || products[item.slug].meal ? item.qty : 0), 0);
}

/** The slugs of a bundle's grid in display order (main meals first), known without the products: so their photos can start loading before the products do. */
export function menuSlugs(key: BundleKey, sizeIdx: number): string[] {
  const sizes = BOX_CONTENTS[key];
  const inBox = sizes[Math.min(sizeIdx, sizes.length - 1)];
  return BUNDLE_MENU[key]
    .map(([heading, slugs]) => ({ main: heading === "Main meals", slugs: slugs.filter((slug) => !inBox || inBox[slug]) }))
    .sort((a, b) => Number(!a.main) - Number(!b.main))
    .flatMap((rail) => rail.slugs);
}
