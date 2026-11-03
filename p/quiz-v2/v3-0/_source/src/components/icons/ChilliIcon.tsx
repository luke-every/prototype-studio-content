import type { IconProps } from "./types";

export function ChilliIcon({ size = 18, fill = "currentColor", className, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} className={className} aria-hidden {...rest}>
      <path d="M15.6 7.1c-3.9.3-6.2 2.9-7.4 6.7-1.1 3.4-3 5.2-5.2 5.9 6.2 2 12.6-.6 14.6-5.6 1-2.5.5-5-2-7Z" />
      <path d="M15.4 7c.2-1.8 1.3-3.1 3.2-3.6.3-.1.6.1.6.4s-.1.5-.4.6c-1.3.4-2 1.2-2.2 2.5.9.3 1.7.1 2.4-.5.2-.2.5-.2.7 0s.2.5 0 .7c-1.1 1-2.6 1.2-4 .6-.2-.1-.3-.4-.3-.7Z" />
    </svg>
  );
}
