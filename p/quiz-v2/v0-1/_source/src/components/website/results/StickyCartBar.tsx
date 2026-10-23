"use client";

import { Button } from "@/components/shared/Button";
import { SUBLINE } from "./sample-data";

type Props = {
  visible: boolean;
  /** The price per meal for the size picked */
  per: string;
  onAdd: () => void;
};

/** The bar that follows the page once the hero has gone, and stands down while the page's own Add to cart is on screen. */
export function StickyCartBar({ visible, per, onAdd }: Props) {
  return (
    <div
      className={`absolute inset-x-0 bottom-0 z-[14] flex flex-col gap-4 bg-(--bundle) px-4 pt-4 pb-5 shadow-[0_-2px_6px] shadow-dark/12 [transition:opacity_450ms_var(--ease-ui),translate_550ms_var(--ease-swing)] ${
        visible ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-[90px] opacity-0"
      }`}
    >
      <Button
        type="button"
        variant="dark"
        onClick={onAdd}
        aria-label="Add to cart"
        sizeClassName="h-10"
        className="w-full justify-center rounded-[30px] text-xs font-medium tracking-[1.8px] uppercase transition-[scale] duration-[240ms] ease-spring active:scale-[.975] active:duration-[90ms] active:ease-out"
      >
        {/* TODO(lift): replace with translation key */}
        Add to cart
      </Button>
      {/* TODO(lift): replace with translation key */}
      <p className="m-0 text-center text-xs leading-4 tracking-[-0.24px] text-dark">
        from {per} / meal · {SUBLINE}
      </p>
    </div>
  );
}
