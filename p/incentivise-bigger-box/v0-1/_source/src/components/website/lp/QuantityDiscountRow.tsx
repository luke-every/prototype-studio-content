"use client";

import type { BundleVariant } from "@/components/website/bundle-v3/types";
import { DISCOUNT_TIERS, stepUp, tierIndex, tierProgress } from "@/lib/box-step";
import { COPY } from "@/lib/copy";
import { formatPrice } from "@/lib/format";
import { interpolate } from "@/lib/translations";

type Props = {
  variants: BundleVariant[];
  selected: BundleVariant;
  /** Switches the box to the next size when the "add N more" line is tapped */
  onSelect: (variant: BundleVariant) => void;
  currencyCode: string;
};

/**
 * New: nothing in every-website does this. The quantity-discount row of the price breakdown, with the tier progress
 * from the account area's next-box card (title and amount, "12 meals · add 3 more for 15%", a bar with a dot per tier).
 */
export function QuantityDiscountRow({ variants, selected, onSelect, currencyCode }: Props) {
  const c = COPY.boxNudge;
  const { bundlePrice, amountOffPerBundle, mealCount } = selected.config;
  const step = stepUp(variants, selected);
  const current = tierIndex(mealCount);
  const sub = "font-sans text-sm leading-[19px] tracking-[-0.28px] text-light-text";

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3 font-sans text-sm leading-[19px] tracking-[-0.28px]">
        {/* TODO(lift): replace with translation key */}
        <span className="text-dark">
          {interpolate(c.qtyTitle, { percent: Math.round((amountOffPerBundle / bundlePrice) * 100) })}
        </span>
        <span className="font-medium text-savings-green">-{formatPrice(amountOffPerBundle, currencyCode)}</span>
      </div>
      {step ? (
        <button
          type="button"
          onClick={() => onSelect(step.next)}
          className={`w-fit cursor-pointer text-left transition-colors hover:text-dark ${sub}`}
        >
          {interpolate(c.qtyNext, {
            n: mealCount,
            next: step.next.config.mealCount,
            percent: DISCOUNT_TIERS[tierIndex(step.next.config.mealCount)].percent,
          })}
        </button>
      ) : (
        <p className={sub}>{interpolate(c.qtyTop, { n: mealCount })}</p>
      )}
      <div className="relative h-1 rounded-full bg-dark/10">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-signal-orange transition-[width] duration-300 ease-out"
          style={{ width: `${tierProgress(mealCount) * 100}%` }}
        />
        {DISCOUNT_TIERS.map((tier, i) => (
          <span
            key={tier.from}
            className={`absolute top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full ${i <= current ? "bg-dark" : "bg-dark/25"}`}
            style={{ left: `${((i + 0.5) / DISCOUNT_TIERS.length) * 100}%` }}
          />
        ))}
      </div>
    </div>
  );
}
