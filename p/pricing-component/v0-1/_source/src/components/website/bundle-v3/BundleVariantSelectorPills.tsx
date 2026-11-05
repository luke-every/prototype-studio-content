"use client";

import { formatPrice } from "@/lib/format";
import { usePublicTranslations } from "@/providers/PublicTranslationsProvider";
import { SizePill } from "./SizePill";
import type { BundleVariant } from "./types";

type Props = {
  variants: BundleVariant[];
  selected: BundleVariant;
  onSelect: (variant: BundleVariant) => void;
  currencyCode: string;
  /** Bundle colour for the per-week band on each pill */
  tint?: string;
};

/** Port of every-website `src/components/website/bundle-v2/BundleVariantSelectorPills.tsx`, restyled to the box size design: plain `BundleVariant` props. */
export function BundleVariantSelectorPills({ variants, selected, onSelect, currencyCode, tint }: Props) {
  const t = usePublicTranslations();
  const badge = variants.find((v) => v.badge);
  const badgeIndex = badge ? variants.indexOf(badge) : -1;

  return (
    <div className="relative flex w-full items-stretch gap-2 lg:max-w-[412px]">
      {variants.map((variant) => {
        return (
          <SizePill
            key={variant.id}
            mealCount={variant.config.mealCount}
            mealsLabel={t.bundle.mealsUnit}
            perMeal={`${formatPrice(variant.config.mealDiscountedPrice, currencyCode)} ${t.bundle.perMealPill}`}
            perWeek={`${variant.config.mealCount / 4} /week`}
            selected={variant.id === selected.id}
            tint={tint}
            onSelect={() => onSelect(variant)}
          />
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
