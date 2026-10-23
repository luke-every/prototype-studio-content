import type { BundleKey } from "@/components/website/quiz/types";
import { HERO_COUNT, MARQUEE_COUNT, PHOTO_PREFIX } from "@/components/website/results/sample-data";

/*
 * Paths into public/ are relative ("img/p1.jpg", no leading slash): the prototype is served from a
 * sub-path by Prototype Studio, so an absolute "/img/…" would miss it.
 */

/** The shared pool of lifestyle photographs: p1 … p4, pp1 … */
export function bundlePhoto(key: BundleKey, n: number): string {
  return `img/${PHOTO_PREFIX[key]}${n}.jpg`;
}

/** Variant A's hero carousel: va-<prefix>1 … N */
export function heroPhotos(key: BundleKey): string[] {
  return Array.from({ length: HERO_COUNT[key] }, (_, i) => `img/va-${PHOTO_PREFIX[key]}${i + 1}.webp`);
}

/** The marquee set, twice, so the loop closes on itself */
export function marqueePhotos(key: BundleKey): string[] {
  const set = Array.from({ length: MARQUEE_COUNT }, (_, i) => bundlePhoto(key, i + 1));
  return [...set, ...set];
}

/** The placeholder dishes borrow from meal1 … meal6, repeating from the top after that */
export function mealPhoto(n: number, count: number = 6): string {
  return `img/meal${((n - 1) % count) + 1}.jpg`;
}
