import type { IconProps } from "./types";

export function CloseIcon({ size = 18, fill = "none", stroke = "currentColor", className, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden {...rest}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
