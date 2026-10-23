import type { IconProps } from "./types";

/** Solid filled bin (distinct from the stroked TrashIcon) — matches the cart-v2 QuantityPill glyph exactly. */
export function TrashFilledIcon({ size = 14, fill = "currentColor", className, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 13.9986 13.9986" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden {...rest}>
      <path d="M10.499 2.79972H13.9986V4.19958H12.5988V13.2987C12.5988 13.6853 12.2854 13.9986 11.8988 13.9986H2.09979C1.71323 13.9986 1.39986 13.6853 1.39986 13.2987V4.19958H0V2.79972H3.49965V0.699931C3.49965 0.313373 3.81303 0 4.19958 0H9.79903C10.1856 0 10.499 0.313373 10.499 0.699931V2.79972ZM11.1989 4.19958H2.79972V12.5988H11.1989V4.19958ZM4.89952 6.29938H6.29938V10.499H4.89952V6.29938ZM7.69924 6.29938H9.0991V10.499H7.69924V6.29938ZM4.89952 1.39986V2.79972H9.0991V1.39986H4.89952Z" fill={fill} />
    </svg>
  );
}
