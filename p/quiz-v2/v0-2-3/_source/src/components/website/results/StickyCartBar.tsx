"use client";

import { Button } from "@/components/shared/Button";

type Props = {
  visible: boolean;
  /** "20 meals · €143,82", or what's still needed */
  summary: string;
  /** Under the minimum, the button waits */
  disabled: boolean;
  onAdd: () => void;
};

/** The bar that keeps checkout one tap away once the hero has gone, and stands down while the page's own button is on screen */
export function StickyCartBar({ visible, summary, disabled, onAdd }: Props) {
  return (
    <div
      className={`absolute inset-x-0 bottom-0 z-[14] flex items-center gap-4 bg-white px-4 pt-3 pb-5 shadow-[0_-2px_10px] shadow-dark/12 [transition:opacity_450ms_var(--ease-ui),translate_550ms_var(--ease-swing)] ${
        visible ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-[90px] opacity-0"
      }`}
    >
      <p aria-live="polite" className="m-0 min-w-0 flex-1 text-sm leading-[18px] font-medium tracking-[-0.28px] text-dark">
        {summary}
      </p>
      <Button
        type="button"
        variant="dark"
        onClick={onAdd}
        disabled={disabled}
        aria-label="Add to cart"
        sizeClassName="h-11 px-6"
        className="shrink-0 justify-center rounded-[30px] text-xs font-medium tracking-[1.8px] uppercase transition-[scale,opacity] duration-[240ms] ease-spring active:scale-[.975] active:duration-[90ms] active:ease-out disabled:cursor-not-allowed disabled:opacity-40"
      >
        {/* TODO(lift): replace with translation key */}
        Add to cart
      </Button>
    </div>
  );
}
