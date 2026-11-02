import type { IconProps } from "./types";

export function EmptyBoxIcon({ size, className, ...rest }: IconProps) {
  const s = size ?? 48;
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 511.99 511.99"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      fill="currentColor"
      {...rest}
    >
      <g>
        <path d="m446.822 213.631-190.827-63.256-190.827 63.256-65.158 103.498 59.984 19.884v110.007l196 64.97 196-64.97v-110.007l59.984-19.884zm-57.5 12.545-133.327 44.195-133.327-44.195 133.327-44.195zm-343.52 74.527 35.627-56.592 151.67 50.276-35.626 56.591zm44.193 46.255 120.345 39.892 30.655-48.693v137.256l-151-50.054zm181 128.454v-137.256l30.655 48.693 120.345-39.892v78.401zm43.522-124.433-35.626-56.591 151.67-50.276 35.627 56.592z" />
        <path d="m240.995 0h30v100.174h-30z" />
        <path d="m122.952 31.63h30v100.174h-30z" transform="matrix(.866 -.5 .5 .866 -22.376 79.924)" />
        <path d="m323.951 66.717h100.174v30h-100.174z" transform="matrix(.5 -.866 .866 .5 116.249 364.784)" />
      </g>
    </svg>
  );
}
