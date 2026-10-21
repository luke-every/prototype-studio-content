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

/** Port of every-website `src/components/website/bundle-v2/BundleVariantSelectorPills.tsx`, restyled to the box size design: plain `BundleVariant` props. */
export function BundleVariantSelectorPills({ variants, selected, onSelect, currencyCode }: Props) {
  const t = usePublicTranslations();
  const badge = variants.find((v) => v.badge);
  const badgeIndex = badge ? variants.indexOf(badge) : -1;

  return (
    <div className="relative flex w-full items-stretch gap-2 lg:max-w-[412px]">
      {variants.map((variant) => {
        const isSelected = variant.id === selected.id;
        return (
          <button
            key={variant.id}
            type="button"
            onClick={() => onSelect(variant)}
            aria-label={`${variant.config.mealCount} ${t.bundle.mealsUnit}`}
            aria-pressed={isSelected}
            className={`flex min-w-px flex-1 flex-col overflow-clip rounded-2xl bg-white text-center text-dark transition-colors ${
              isSelected ? "cursor-default border-[1.5px] border-near-black" : "cursor-pointer border-[1.5px] border-light-brown"
            }`}
          >
            <span className="flex w-full flex-1 flex-col gap-1.5 px-4 pt-5 pb-3.5">
              <span className="flex flex-col items-center">
                <span className="font-sans text-xl font-medium leading-6 tracking-[-0.4px]">{variant.config.mealCount}</span>
                <span className="font-sans text-base font-medium capitalize leading-5 tracking-[-0.32px]">{t.bundle.mealsUnit}</span>
              </span>
              <span className={`font-sans text-xs font-medium leading-4 tracking-[-0.24px] ${isSelected ? "" : "opacity-60"}`}>
                {formatPrice(variant.config.mealDiscountedPrice, currencyCode)} {t.bundle.perMealPill}
              </span>
            </span>
            {/* TODO(lift): sample data — meals per week; production sources it from the box configuration */}
            <span className="w-full bg-[#d7ebc2]/25 pt-1.5 pb-2 font-sans text-xs leading-4 tracking-[-0.24px]">{variant.config.mealCount / 4} /week</span>
          </button>
        );
      })}
      {badge && (
        <span
          className="absolute top-0 -translate-x-1/2 -translate-y-1/2 rounded bg-brown-border px-2 py-1 font-sans text-[10px] font-medium leading-[13px] text-white"
          style={{ left: `${((badgeIndex + 0.5) / variants.length) * 100}%` }}
        >
          {badge.badge}
        </span>
      )}
    </div>
  );
}
