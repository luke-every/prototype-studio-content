import type { IconProps } from "./types";

/** "30 days money-back guarantee" glyph exported from the cart-v2 Box Summary Figma design (distinct from ThirtyDaysIcon, used elsewhere). */
export function ShieldCheckIcon({ size = 24, stroke = "currentColor", className, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden {...rest}>
      <path
        transform="translate(3 1)"
        d="M9 21C9 21 17 17 17 11V4L9 1L1 4V11C1 17 9 21 9 21Z"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        transform="translate(8 8)"
        d="M9 1L3.5 6.5L1 4"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
