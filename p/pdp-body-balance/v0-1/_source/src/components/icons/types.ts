import type { SVGProps } from "react";

export type IconProps = SVGProps<SVGSVGElement> & {
  /** Size in pixels; sets both width and height */
  size?: number;
};
