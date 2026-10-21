import type { IconProps } from "./types";

export function ArrowRightIcon({ size = 16, fill = "none", stroke = "currentColor", className, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill={fill} stroke={stroke} className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden {...rest}>
      <path d="M8.88894 8.00007L5 4.11108L6.11113 2.99996L11.1113 8.00007L6.11113 13.0001L5 11.889L8.88894 8.00007Z" fill="#372D27"/>
    </svg>
  );
}
