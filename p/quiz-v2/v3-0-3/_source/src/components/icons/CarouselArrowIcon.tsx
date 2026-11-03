import type { IconProps } from "./types";

export function CarouselArrowIcon({ size = 12, stroke = "currentColor", className, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 12.0607 11.0607" fill="none" stroke={stroke} className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden {...rest}>
      <path d="M6.06066 10.5303L1.06066 5.53033L6.06066 0.53033M1.06066 5.53033H12.0607" strokeWidth="1.5" />
    </svg>
  );
}
