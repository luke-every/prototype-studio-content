import type { IconProps } from "./types";

export function ThirtyDaysIcon({ size, className }: IconProps) {
  const s = size ?? 22;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      <path
        d="M12 2l1.8 1.4 2.2-.6 1 2 2.2.4.2 2.3 1.8 1.4-.8 2.1.8 2.1-1.8 1.4-.2 2.3-2.2.4-1 2-2.2-.6L12 22l-1.8-1.4-2.2.6-1-2-2.2-.4-.2-2.3L2.8 15l.8-2.1-.8-2.1 1.8-1.4.2-2.3 2.2-.4 1-2 2.2.6L12 2z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 12l1.5 1.5 2.5-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
