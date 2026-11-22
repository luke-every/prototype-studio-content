/**
 * How wide a section renders on desktop.
 *
 * The PDP reserves a 4-column rail down the right (Figma 4474:57729), so its sections run 8 of
 * the 12 columns: 736 content + 32 gutter + 352 rail inside the 1120 band. Every other page runs
 * the full 12. The page says which it wants; a section's own Storyblok `width` option can override.
 */

/** What the page asks of its sections. The products route passes "narrow" for the V3 PDP. */
export type PageWidth = "narrow" | "full";

/**
 * Resolve a section's Storyblok `width` option against the page it is on.
 *
 * - unset / empty — inherit the page. The default, so a section added to the PDP later still
 *   clears the rail without anyone setting a field
 * - "narrow" / "full" — force it either way. Compared case-insensitively, because the option
 *   stores lowercase values but its display names are Full / Narrow and editors type those into
 *   the JSON view
 */
export function resolveSectionWidth(width: string | undefined, page: PageWidth = "full"): PageWidth {
  const value = width?.trim().toLowerCase();
  if (value === "narrow" || value === "full") return value;
  return page;
}

/**
 * Desktop right padding for a narrowed section that is padded from the viewport edge, i.e. one
 * whose horizontal padding sits on its full-width root.
 *
 * Up to a 1440 viewport that is a flat 544: 352 rail + 32 gutter + the 160 page margin the rail is
 * itself inset by. It is the WHOLE inset, not an amount to add to the section's own padding,
 * because the rail's left edge sits at `width - 512` however much padding the section has.
 *
 * Above 1440 the rail does not stay 512 from the viewport edge. It lives in a centred 1440 band,
 * so its left edge is at `50% + 208px` (720 - 160 - 352). Content has to stop at `50% + 176px` to
 * keep the 32 gutter, i.e. pad by `50% - 176px`. max() takes whichever is larger, so nothing
 * changes at or below 1440 and wide screens stop overrunning the card. Found at 1604, a 50px
 * overrun, after the first cut was only ever measured up to 1440.
 */
export const NARROW_INSET_CLASS = "lg:pr-[max(544px,calc(50%-176px))]";

/**
 * The same, for a section whose padding sits on an inner container that is itself centred in the
 * 1440 band (GlobalPillarsV2). That container's right edge already tracks the rail at any width,
 * so the flat 544 is right everywhere and the growth above would open the gutter.
 */
export const NARROW_INSET_BAND_CLASS = "lg:pr-[544px]";

/**
 * Desktop LEFT padding for a narrowed section that is padded from the viewport edge.
 *
 * The mirror of NARROW_INSET_CLASS. Up to a 1440 viewport it is the flat 160 page margin. Above it
 * the rest of the page - the hero, the bundle module, the reviews band and the rail - all live in a
 * centred 1440 band, so their content starts at `50% - 560px` (720 - 160). A flat 160 measured from
 * the viewport edge drifts away from them: at 1920 the reviews start at 400 and a flat-160 section
 * at 160, a 233px step between two stacked sections (Juliano, review on #472). max() keeps 1440 and
 * below exactly as it was, so only wide screens move.
 */
export const NARROW_LEFT_CLASS = "lg:pl-[max(10rem,calc(50%-560px))]";
