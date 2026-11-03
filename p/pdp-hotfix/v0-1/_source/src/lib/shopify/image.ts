/**
 * Returns a Shopify CDN image URL resized to the given width.
 * - If the URL already contains `_x{n}` before the extension, replaces it.
 * - Otherwise inserts `_x{size}` before the extension.
 *
 * Works for both Storyblok-synced Shopify images (_x140 pattern) and
 * raw Shopify Admin API featuredImage URLs (no size suffix).
 */
export function shopifyImageUrl(url: string | null | undefined, size: number): string | null {
  if (!url) return null;
  if (/_x\d+(\.\w+)/.test(url)) {
    return url.replace(/_x\d+(\.\w+)/, `_x${size}$1`);
  }
  return url.replace(/(\.\w+)(\?|$)/, `_x${size}$1$2`);
}
