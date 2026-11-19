import type { IconProps } from "./types";

export function CloseFilledIcon({ size = 10, fill = "#110D0A", className, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" fill="none" className={className} aria-hidden {...rest}>
      <path d="M9.27153 0.203567L10 0.931191L5.93119 5L9.79727 8.86608L10 9.06965L9.06965 10L8.86608 9.79727L5 5.93035L0.931191 10L0.203567 9.27238L0 9.06965L4.06965 5L0.203567 1.13392L0 0.931191L0.203567 0.728466L0.728466 0.203567L0.931191 0L1.13392 0.203567L5 4.06881L8.86608 0.203567L9.06881 0L9.27153 0.203567Z" fill={fill} />
    </svg>
  );
}
