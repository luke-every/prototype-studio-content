import type { IconProps } from "./types";

/** An open box with three orange rays, for "build your own box". The rays are signal orange; the box takes its colour from `stroke`. */
export function BuildBoxIcon({ size = 48, fill = "none", stroke = "currentColor", className, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill={fill} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden {...rest}>
      <path d="M24 2v5M14 4l2.5 4M34 4l-2.5 4" stroke="#ff7d34" />
      <path d="M8 22 24 16l16 6-16 6ZM8 22l-3-7 16-4 3 5M40 22l3-7-16-4-3 5M8 22v14l16 8 16-8V22M24 28v16" stroke={stroke} />
    </svg>
  );
}
