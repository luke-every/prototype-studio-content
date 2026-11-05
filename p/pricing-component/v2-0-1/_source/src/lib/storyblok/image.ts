/**
 * Returns a Storyblok CDN image URL resized to the given width (height auto).
 * Appends `/m/{width}x0` to the filename using Storyblok's image service.
 */
export function storyblokImageUrl(url: string | null | undefined, width: number): string | null {
  if (!url) return null;
  if (url.includes("/m/")) return url;
  if (!url.endsWith(".jpg") && !url.endsWith(".png")) return url;
  return `${url}/m/${width}x0`;
}

/**
 * Parses the original image dimensions embedded in a Storyblok asset URL.
 * Storyblok filenames follow the pattern: .../WIDTHxHEIGHT/filename.ext
 * Returns null if the dimensions cannot be parsed.
 */
export function storyblokImageDimensions(url: string | null | undefined): { width: number; height: number } | null {
  if (!url) return null;
  const match = url.match(/\/(\d+)x(\d+)\//);
  if (!match) return null;
  return { width: parseInt(match[1], 10), height: parseInt(match[2], 10) };
}

type StoryblokAssetLike = { filename?: string | null } | null | undefined;

/** Shape shared by every Storyblok product/content type carrying a singular `image` and/or plural `images` asset field. */
export type StoryblokImageFields = {
  image?: StoryblokAssetLike;
  images?: StoryblokAssetLike[] | null;
};

/** Filenames of every `images` entry with a non-empty filename, in order. */
export function storyblokImageFilenames(content: StoryblokImageFields): string[] {
  return (content.images ?? [])
    .map((img) => img?.filename)
    .filter((filename): filename is string => !!filename);
}

/**
 * Resolves a product's primary Storyblok image URL: the first valid `images` entry,
 * falling back to the singular `image` field. Resized to `width`. Null if neither is set.
 */
export function resolveStoryblokProductImage(content: StoryblokImageFields, width: number): string | null {
  const [first] = storyblokImageFilenames(content);
  return storyblokImageUrl(first ?? content.image?.filename ?? null, width);
}

/**
 * Resolves a product's secondary Storyblok image URL (the second `images` entry, if any),
 * resized to `width`. Null if there isn't one.
 */
export function resolveStoryblokSecondImage(content: StoryblokImageFields, width: number): string | null {
  const [, second] = storyblokImageFilenames(content);
  return storyblokImageUrl(second ?? null, width);
}

/**
 * Converts a Storyblok asset's focus field ("X0xY0:X1xY1", pixel coordinates in the
 * original image) into a CSS object-position value, so a `fill` + `object-cover` image
 * crops around the focal point instead of defaulting to a plain center crop. Falls back
 * to a centered position when the focus or the image's natural dimensions (parsed from
 * its Storyblok URL) are unavailable.
 */
export function storyblokFocalPosition(focus: string | undefined, url: string | null | undefined): string {
  const dims = storyblokImageDimensions(url);
  const match = focus?.match(/^(\d+)x(\d+):(\d+)x(\d+)$/);
  if (!dims || !match) return "50% 50%";
  const [x0, y0, x1, y1] = match.slice(1).map(Number);
  const xPct = (((x0 + x1) / 2) / dims.width) * 100;
  const yPct = (((y0 + y1) / 2) / dims.height) * 100;
  return `${xPct}% ${yPct}%`;
}
