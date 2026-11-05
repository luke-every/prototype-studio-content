import type { ReactNode } from "react";

type Props = {
  /** The always-visible LineItem (the accordion header when `details` is set) */
  children: ReactNode;
  /** Extra LineItems shown when `expanded` */
  details?: ReactNode;
  expanded?: boolean;
  onToggle?: () => void;
  /** Id for aria-controls on the toggle */
  detailsId?: string;
  toggleLabel?: string;
  /** "total" is the last row: roomier padding, no bottom divider */
  variant?: "default" | "total";
};

/** New, no production counterpart: Figma "RowItems" (Bundle Component). A LineItem row with divider, expandable when `details` is passed. */
export function RowItems({ children, details, expanded = false, onToggle, detailsId, toggleLabel, variant = "default" }: Props) {
  const isTotal = variant === "total";
  const padding = isTotal ? "px-4 py-5" : "px-4 pt-3.5 pb-[14.5px]";
  const divider = isTotal ? "" : "border-b border-light-brown";

  if (!details) {
    return <div className={`${padding} ${divider}`}>{children}</div>;
  }

  return (
    <div className={`flex flex-col ${padding} ${divider}`}>
      <button type="button" onClick={onToggle} aria-expanded={expanded} aria-controls={detailsId} aria-label={toggleLabel} className="w-full cursor-pointer text-left">
        {children}
      </button>
      <div id={detailsId} className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <div className="flex flex-col gap-2 pt-2">{details}</div>
        </div>
      </div>
    </div>
  );
}
