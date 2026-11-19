import type { IconProps } from "./types";

export function PencilIcon({ size = 12, className, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden {...rest}>
      <path d="M6.59967 2.55228L9.42807 5.38073L2.82843 11.9804H0V9.15193L6.59967 2.55228ZM7.54247 1.60947L8.95667 0.19526C9.21707 -0.0650867 9.63913 -0.0650867 9.89947 0.19526L11.7851 2.08088C12.0455 2.34123 12.0455 2.76334 11.7851 3.02369L10.3709 4.4379L7.54247 1.60947Z" fill="currentColor" />
    </svg>
  );
}
