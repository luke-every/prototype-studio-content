import type { IconProps } from "./types";

export function GenericCardIcon({ width = 38, height = 27, className, ...rest }: IconProps & { width?: number; height?: number }) {
  return (
    <svg width={width} height={height} viewBox="0 0 38 27" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden {...rest}>
      <rect x="0.5" y="0.5" width="37" height="26" rx="2.5" stroke="#9CA3AF" strokeOpacity="0.2" />
      <rect x="0.5" y="5" width="37" height="4.5" fill="#9CA3AF" />
      <rect x="4.5" y="14" width="9" height="3" rx="0.75" fill="#D1D5DB" />
      <rect x="4.5" y="19.5" width="6" height="1.5" rx="0.75" fill="#D1D5DB" />
    </svg>
  );
}
