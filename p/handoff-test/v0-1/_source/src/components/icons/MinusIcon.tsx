import type { IconProps } from "./types";

export function MinusIcon({ size = 16, className, ...rest }: IconProps & { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...rest}
    >
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

