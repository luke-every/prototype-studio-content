import type { IconProps } from "./types";

/** Long left-pointing arrow (shaft + chevron head), the mirror of ArrowRightLongIcon. */
export function ArrowLeftLongIcon({ size = 16, stroke = "currentColor", className, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 15.0758 13.8258" fill="none" stroke={stroke} strokeWidth={1.875} className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden {...rest}>
      <path d="M7.57583 0.662913L1.32583 6.91291L7.57583 13.1629M1.32583 6.91291H15.0758" />
    </svg>
  );
}
