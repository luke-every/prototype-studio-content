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

export function BundleVariantSelectorPills({ variants, selected, onSelect, currencyCode }: Props) {
  const t = usePublicTranslations();

  return (
    <div className="flex w-full items-stretch gap-2">
      {variants.map((variant) => {
        const isSelected = variant.id === selected.id;
        return (
          <button
            key={variant.id}
            type="button"
            onClick={() => onSelect(variant)}
            aria-label={`${variant.config.mealCount} ${t.bundle.mealsUnit}`}
            aria-pressed={isSelected}
            className={`relative flex min-w-px flex-1 flex-col items-center gap-0.5 rounded-2xl border px-[10px] py-[20px] text-center transition-colors ${
              isSelected
                ? "cursor-default border-dark bg-white shadow-[0px_4px_16px_rgba(55,45,39,0.12)]"
                : "cursor-pointer border-light-grey-3 bg-white/40"
            }`}
          >
            <span className="font-book text-xl leading-5 tracking-[-0.4px] text-dark">{variant.config.mealCount}</span>
            <span className="font-sans text-xs uppercase leading-4 tracking-[-0.24px] text-dark">{t.bundle.mealsUnit}</span>
            <span className="pt-0.5 font-sans text-xs font-medium leading-4 tracking-[-0.24px] text-dark">
              {formatPrice(variant.config.mealDiscountedPrice, currencyCode)} {t.bundle.perMealPill}
            </span>
            <span className="pt-1 font-book text-xs leading-[17px] text-dark">{variant.label}</span>
            {variant.badge && (
              <div className="absolute -top-[13px] left-1/2 -translate-x-1/2">
                <span className="inline-block rounded bg-brown-border px-2 py-1 text-[8px] uppercase leading-[13px] tracking-[-0.16px] text-white">
                  {variant.badge}
                </span>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
