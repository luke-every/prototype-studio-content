"use client";

import { formatPrice } from "@/lib/format";
import { usePublicTranslations } from "@/providers/PublicTranslationsProvider";
import type { BundleVariant } from "./types";

type Props = {
  variants: BundleVariant[];
  selected: BundleVariant;
  onSelect: (variant: BundleVariant) => void;
  currencyCode: string;
};

/**
 * New: nothing in every-website does this (looked in: production's src/components, by name).
 * Stacked radio list for picking a box size: one row per size, the per-meal price on the right.
 */
export function BundleSizeList({ variants, selected, onSelect, currencyCode }: Props) {
  const t = usePublicTranslations();

  return (
    <div role="radiogroup" aria-label={t.bundle.boxContentsTitle} className="flex flex-col gap-2">
      {variants.map((variant) => {
        const isSelected = variant.id === selected.id;
        return (
          <button
            key={variant.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={`${variant.config.mealCount} ${t.bundle.mealsUnit}`}
            onClick={() => onSelect(variant)}
            className={`flex w-full cursor-pointer items-center gap-3 rounded-2xl border bg-white p-4 text-left transition-colors duration-200 ${
              isSelected ? "border-dark" : "border-light-grey hover:border-dark/40"
            }`}
          >
            <span
              className={`flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-200 ${isSelected ? "border-dark" : "border-dark/30"}`}
              aria-hidden="true"
            >
              <span className={`size-2.5 rounded-full bg-dark transition-transform duration-200 ${isSelected ? "scale-100" : "scale-0"}`} />
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="flex items-center gap-2">
                <span className="font-sans text-sm font-medium leading-[18px] tracking-[-0.28px] text-dark">
                  {variant.config.mealCount} {t.bundle.mealsUnit}
                </span>
                {variant.badge && (
                  <span className="rounded bg-brown-border px-2 py-1 font-sans text-[8px] uppercase leading-[8px] tracking-[-0.16px] text-white">{variant.badge}</span>
                )}
              </span>
              <span className="font-sans text-xs leading-4 tracking-[-0.24px] text-dark/60">{variant.label}</span>
            </span>
            <span className="shrink-0 whitespace-nowrap text-right font-sans text-sm font-medium leading-[18px] tracking-[-0.28px] text-dark">
              {formatPrice(variant.config.mealDiscountedPrice, currencyCode)}
              <span className="text-xs font-normal leading-4 tracking-[-0.24px] text-dark/60"> {t.bundle.perMealPill}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
