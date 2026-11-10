import type { ReactNode } from "react";

type Props = {
  open: boolean;
  id?: string;
  children: ReactNode;
  /** Classes applied only while closed, e.g. a negative margin that cancels a parent's flex gap. */
  closedClassName?: string;
};

/** Animates height and opacity open and closed (grid-rows 0fr to 1fr). Closed content stays mounted but is hidden from focus and screen readers. */
export function Collapse({ open, id, children, closedClassName = "" }: Props) {
  return (
    <div
      id={id}
      className={`grid transition-[grid-template-rows,opacity,margin] duration-300 ease-out ${open ? "grid-rows-[1fr] opacity-100" : `grid-rows-[0fr] opacity-0 ${closedClassName}`}`}
      aria-hidden={!open}
      inert={!open}
    >
      <div className="min-h-0 overflow-hidden">{children}</div>
    </div>
  );
}
