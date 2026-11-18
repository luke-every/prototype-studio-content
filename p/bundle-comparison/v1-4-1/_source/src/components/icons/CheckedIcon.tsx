import type { IconProps } from "./types";

export function CheckedIcon({ size = 20, className, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden className={className} {...rest}>
      <circle cx="10" cy="10" r="10" fill="#372d27" />
      <path d="M5.5 10.5L8.5 13.5L14.5 7.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
