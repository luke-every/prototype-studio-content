import type { IconProps } from "./types";

export function CarouselArrowMobileIcon({ size = 5.33333, stroke = "currentColor", className, ...rest }: IconProps) {
  return (
    <svg width={size} height={size * 1.75} viewBox="0 0 5.33333 9.33333" fill="none" stroke={stroke} className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden {...rest}>
      <path d="M4.66667 8.66667L0.666667 4.66667L4.66667 0.666667" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
