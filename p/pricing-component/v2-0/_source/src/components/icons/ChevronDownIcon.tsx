import type { IconProps } from "./types";

export function ChevronDownIcon({ size = 9, fill = "none", stroke = "currentColor", className, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 9 7" fill={fill} xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden {...rest}>
      <path d="M0.919922 0.919373L4.30702 4.91937L7.91992 0.919373" stroke={stroke} strokeWidth="1.83871" strokeLinecap="round"/>
    </svg>
  );
}
