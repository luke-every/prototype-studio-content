import type { IconProps } from "./types";

/** Solid filled chevron (distinct from the stroked ChevronDownIcon) — matches the cart-v2 "Show meals" toggle glyph exactly. */
export function ChevronDownFilledIcon({ size = 10, fill = "currentColor", className, ...rest }: IconProps) {
  return (
    <svg width={size} height={size * (6.11125 / 10.0002)} viewBox="0 0 10.0002 6.11125" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden {...rest}>
      <path d="M5.00005 3.88894L8.88905 0L10.0002 1.11113L5.00005 6.11125L0 1.11113L1.11113 0L5.00005 3.88894Z" fill={fill} />
    </svg>
  );
}
