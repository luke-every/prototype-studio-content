import type { IconProps } from "./types";

export function PlusFilledIcon({ size = 10, fill = "currentColor", className, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" fill="none" className={className} aria-hidden {...rest}>
      <path d="M5.75949 4.25358H10V5.70552H5.75949V10H4.21941V5.70552H0V4.25358H4.21941V0H5.75949V4.25358Z" fill={fill} />
    </svg>
  );
}
