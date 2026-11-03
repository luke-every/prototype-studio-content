import type { IconProps } from "./types";

/** Long right-pointing arrow (shaft + chevron head) — distinct from ArrowRightIcon's filled chevron glyph. */
export function ArrowRightLongIcon({ size = 16, stroke = "currentColor", className, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 15.0758 13.8258" fill="none" stroke={stroke} strokeWidth={1.875} className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden {...rest}>
      <path d="M7.49997 13.1629L13.74997 6.91291L7.49997 0.662913M13.74997 6.91291H0" />
    </svg>
  );
}
