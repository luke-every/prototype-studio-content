import type { IconProps } from "./types";

export function TranslationIcon({ size = 20, className, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden {...rest}>
      <path d="M5 8l6 6" />
      <path d="M4 6h7M7 4v2" />
      <path d="M2 18h8l2-4h8" />
      <path d="M18 6h4" />
      <path d="M20 4v8" />
      <rect x="12" y="12" width="10" height="8" rx="1" />
    </svg>
  );
}
