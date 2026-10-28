"use client";

import { Button } from "@/components/shared/Button";

type Props = {
  visible: boolean;
  /** How many meals, said on a line of its own */
  meals: number;
  /** How many add-ons are in the box, said after the meals when there are any */
  addOns: number;
  /** What they pay, after discounts, and the same box at list price, struck through beside it */
  total: string;
  was: string;
  /** An empty box can't be checked out, so the button waits */
  disabled: boolean;
  onAdd: () => void;
};

/** The bar, dark so it stands off the page, that keeps checkout one tap away once the hero has gone, and stands down while the page's own button is on screen */
export function StickyCartBar({
  visible,
  meals,
  addOns,
  total,
  was,
  disabled,
  onAdd,
}: Props) {
  return (
    <div
      className={`absolute inset-x-0 bottom-0 z-[14] flex items-center gap-4 bg-dark px-6 pt-3 pb-5 shadow-[0_-2px_10px] shadow-dark/12 [transition:opacity_450ms_var(--ease-ui),translate_550ms_var(--ease-swing)] ${
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-[90px] opacity-0"
      }`}
    >
      {/* TODO(lift): replace with translation keys */}
      <div aria-live="polite" className="flex min-w-0 flex-1 flex-col gap-0.5">
        {disabled ? (
          <p className="m-0 text-sm leading-[18px] font-medium tracking-[-0.28px] text-white">
            Add a meal to check out
          </p>
        ) : (
          <>
            <p className="m-0 text-xs leading-4 tracking-[-0.24px] text-white/70">
              {meals} {meals === 1 ? "meal" : "meals"}
              {addOns > 0 &&
                `, ${addOns} ${addOns === 1 ? "add-on" : "add-ons"}`}
            </p>
            <p className="m-0 flex items-baseline gap-2 text-base leading-[22px] font-medium tracking-[-0.32px] text-white">
              {total}
              <s className="text-sm leading-[18px] font-normal tracking-[-0.28px] text-white/60">
                {was}
              </s>
            </p>
          </>
        )}
      </div>
      <Button
        type="button"
        variant="white"
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
