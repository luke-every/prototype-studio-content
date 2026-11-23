"use client";

import type { BundleVariant } from "@/components/website/bundle-v3/types";
import { COPY } from "@/lib/copy";
import { DISCOUNT_TIERS, stepUp, tierIndex, tierProgress } from "@/lib/box-step";
import { interpolate } from "@/lib/translations";

type Props = {
  variants: BundleVariant[];
  selected: BundleVariant;
  onSelect: (variant: BundleVariant) => void;
};

/**
 * New: nothing in every-website does this (cart-v2 has only the green hint). The discount tiers as a quiet bar at the top of the cart:
 * a column per tier with its percentage and where it starts, filled to where the box sits, and one line about the next
 * tier that switches the box to the next size when tapped.
 */
export function BoxSavingsLadder({ variants, selected, onSelect }: Props) {
  const c = COPY.boxNudge;
  const step = stepUp(variants, selected);
  const current = tierIndex(selected.config.mealCount);
  const last = DISCOUNT_TIERS.length - 1;
  const line = "font-sans text-xs font-medium leading-4 tracking-[-0.24px] text-dark";

  return (
    <div className="flex flex-col gap-2">
      {step ? (
        <button type="button" onClick={() => onSelect(step.next)} className={`cursor-pointer text-left ${line}`}>
          {interpolate(c.ladderTitle, { n: step.extraMeals, percent: DISCOUNT_TIERS[tierIndex(step.next.config.mealCount)].percent })}
        </button>
      ) : (
        <p className={line}>{c.ladderTop}</p>
      )}
      <div className="flex flex-col gap-1.5">
        <div className="relative h-1 rounded-full bg-dark/10">
          <div className="absolute inset-y-0 left-0 rounded-full bg-dark/50 transition-[width] duration-300 ease-out" style={{ width: `${tierProgress(selected.config.mealCount) * 100}%` }} />
          {DISCOUNT_TIERS.map((tier, i) => (
            <span
              key={tier.from}
              className={`absolute top-1/2 size-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full ${i <= current ? "bg-white" : "bg-dark/25"}`}
              style={{ left: `${((i + 0.5) / DISCOUNT_TIERS.length) * 100}%` }}
            />
          ))}
        </div>
        <div className="flex">
          {DISCOUNT_TIERS.map((tier, i) => (
            <div key={tier.from} className="flex min-w-px flex-1 flex-col items-center text-center font-sans text-xs leading-4 tracking-[-0.24px]">
              <span className="font-medium text-dark">{interpolate(c.ladderOff, { percent: tier.percent })}</span>
              <span className="text-dark/65">{interpolate(i === last ? c.ladderMealsPlus : c.ladderMeals, { n: tier.from })}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
