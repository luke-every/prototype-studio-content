import type { IconProps } from "./types";

export function PauseCancelIcon({ size, className }: IconProps) {
  const s = size ?? 20;
  return (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      <rect x="5" y="4" width="3" height="12" rx="0" fill="currentColor" />
      <rect x="12" y="4" width="3" height="12" rx="0" fill="currentColor" />
    </svg>
  );
}
