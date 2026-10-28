import type { IconProps } from "./types";

export function UndoIcon({ size = 18, className, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden {...rest}>
      <circle cx="12" cy="12" r="12" fill="currentColor" />
      <path d="M8.5 10.5h5a3 3 0 0 1 0 6H11M10.5 8 8 10.5l2.5 2.5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
