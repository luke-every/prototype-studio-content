import type { IconProps } from "./types";

/** "No spam" bell-off glyph exported from the GlobalSubscribeSectionV2 Figma design (newsletter disclaimer row). */
export function BellOffIcon({ size = 16, stroke = "currentColor", className, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden {...rest}>
      <path d="M2.67337 0.500133C2.55755 0.875874 2.49911 1.26695 2.50004 1.66013C2.50004 6.3268 0.500039 7.66013 0.500039 7.66013H9.83337" stroke={stroke} strokeLinecap="round" strokeLinejoin="round" transform="translate(1.5 3.6728)" />
      <path d="M6.72005 4.50594C6.72113 3.78131 6.52534 3.07001 6.15361 2.448C5.78188 1.82599 5.24816 1.31664 4.60947 0.974362C3.97078 0.632084 3.2511 0.469731 2.52732 0.504647C1.80354 0.539563 1.10283 0.770435 0.500053 1.1726" stroke={stroke} strokeLinecap="round" strokeLinejoin="round" transform="translate(5.2808 0.828)" />
      <path d="M0.921522 3.83333C0.624942 2.74761 0.48354 1.62536 0.501522 0.500001" stroke={stroke} strokeLinecap="round" strokeLinejoin="round" transform="translate(11.4984 4.8328)" />
      <path d="M2.80675 0.500083C2.68954 0.702134 2.52131 0.86985 2.3189 0.986436C2.11649 1.10302 1.887 1.16439 1.65342 1.16439C1.41983 1.16439 1.19034 1.10302 0.987931 0.986436C0.785521 0.86985 0.617289 0.702134 0.500083 0.500083" stroke={stroke} strokeLinecap="round" strokeLinejoin="round" transform="translate(6.3464 13.5)" />
      <path d="M0.5 0.5L15.1667 15.1667" stroke={stroke} strokeLinecap="round" strokeLinejoin="round" transform="translate(0.1672 0.1672)" />
    </svg>
  );
}
