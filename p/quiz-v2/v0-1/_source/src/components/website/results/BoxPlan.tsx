"use client";

import { Button } from "@/components/shared/Button";
import type { BundleKey } from "../quiz/types";
import { PriceBreakdown } from "./PriceBreakdown";
import { BOX_BREAKDOWN, BUNDLE_NAME, PLANS, SUBLINE } from "./sample-data";
import { SizePill } from "./SizePill";

type Props = {
  bundle: BundleKey;
  sizeIdx: number;
  /** Variant B sits the plan on a tint of the bundle's colour */
  tinted: boolean;
  /** Wraps the page's own Add to cart, so the sticky bar can stand down while it is on screen */
  buyRef: React.Ref<HTMLDivElement>;
  onSizeChange: (index: number) => void;
  onAdd: () => void;
};

/** Box size and price: the size pills, the breakdown, and the page's own Add to cart. */
export function BoxPlan({ bundle, sizeIdx, tinted, buyRef, onSizeChange, onAdd }: Props) {
  const plan = PLANS[bundle];
  const active = Math.min(sizeIdx, plan.sizes.length - 1);
  const size = plan.sizes[active];
  return (
    <div
      className={`flex flex-col gap-4 rounded-b-[32px] px-6 pt-6 pb-12 ${
        tinted ? "bg-[color-mix(in_srgb,var(--bundle)_50%,white)]" : "bg-white"
      }`}
    >
      <h2 className="m-0 font-book text-[34px] leading-[34px] tracking-[-0.68px] text-dark">{plan.title}</h2>
      {plan.pills !== false && (
        <div className="flex gap-2 pt-3">
          {plan.sizes.map((option, i) => (
            <SizePill key={i} size={option} index={i} selected={i === active} onSelect={() => onSizeChange(i)} />
          ))}
        </div>
      )}
      <PriceBreakdown
        name={BUNDLE_NAME[bundle].replace(/^The /, "")}
        size={size}
        box={BOX_BREAKDOWN[bundle]}
        sizeIdx={active}
      />
      <div ref={buyRef} className="flex flex-col items-center gap-4 pt-2">
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
          from {size.per} / meal · {SUBLINE}
        </p>
      </div>
    </div>
  );
}
