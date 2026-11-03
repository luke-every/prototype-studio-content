/** Port of every-website `src/components/website/bundle-v2/starFillPercent.ts`. */
export function starFillPercent(rating: number, index: number): number {
  const diff = rating - index;
  if (diff >= 0.75) return 100;
  if (diff >= 0.25) return 50;
  return 0;
}
