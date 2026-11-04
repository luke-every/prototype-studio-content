import type { IconProps } from "./types";

export function UncheckedIcon({ size = 20, className, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden className={className} {...rest}>
      <circle cx="10" cy="10" r="9" stroke="#D1CBC4" strokeWidth="1.5" />
    </svg>
  );
}
