import type { IconProps } from "./types";

export function ChevronRightIcon({ size = 10, stroke = "#372D27", className, ...rest }: IconProps) {
  return (
    <svg width={size} height={size * 1.6} viewBox="0 0 10 16" fill="none" className={className} aria-hidden {...rest}>
      <path d="M1.5 1L8.5 8L1.5 15" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
