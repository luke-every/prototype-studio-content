import type { IconProps } from "./types";

export function SwapIcon({ size = 18, fill = "none", stroke = "currentColor", className, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden {...rest}>
      <path d="M4 8h14m0 0-4-4m4 4-4 4M20 16H6m0 0 4-4m-4 4 4 4" />
    </svg>
  );
}
