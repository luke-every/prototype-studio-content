import type { IconProps } from "./types";

export function ArrowLeftIcon({ size = 16, fill = "none", stroke = "currentColor", className, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill={fill} stroke={stroke} className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden {...rest}>
      <path d="M7.11106 8.00007L11 4.11108L9.88887 2.99996L4.88867 8.00007L9.88887 13.0001L11 11.889L7.11106 8.00007Z" fill="currentColor"/>
    </svg>
  );
}
