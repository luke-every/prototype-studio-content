/**
 * Press feedback lives on the press itself: the element scales down while the finger is held and
 * springs back the instant it lifts. Add the scale per element, e.g. `${PRESS} active:scale-[.97]`.
 */
export const PRESS = "transition-[scale] duration-[240ms] ease-spring active:duration-[90ms] active:ease-out";
