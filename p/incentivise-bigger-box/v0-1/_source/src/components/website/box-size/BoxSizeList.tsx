"use client";

import Image from "next/image";
import type { BundleMeal, BundleVariant } from "@/components/website/bundle-v3/types";
import { COPY } from "@/lib/copy";
import { bySize, extraMeals } from "@/lib/box-step";
import { formatPrice } from "@/lib/format";
import { interpolate } from "@/lib/translations";

type Props = {
  variants: BundleVariant[];
  selected: BundleVariant;
  onSelect: (variant: BundleVariant) => void;
  /** Opens one dish */
  onSelectMeal?: (meal: BundleMeal) => void;
  currencyCode: string;
};

/**
 * New: nothing in every-website does this. The size pills as a stacked list. The size picked opens to say what it adds
 * to the size below ("Everything in 12 meals, plus") and shows only those dishes, tappable, so the menu isn't repeated here:
 * it is already in the grid above. The smallest size has nothing to add, so it doesn't open.
 */
export function BoxSizeList({ variants, selected, onSelect, onSelectMeal, currencyCode }: Props) {
  const c = COPY.boxNudge;
  const sizes = bySize(variants);
  return (
    <div className="flex flex-col gap-2" role="radiogroup">
      {sizes.map((v, i) => {
        const isSelected = v.id === selected.id;
        const previous = sizes[i - 1];
        const extras = previous ? extraMeals(previous, v) : [];
        const open = isSelected && extras.length > 0;
        return (
          <div
            key={v.id}
            className={`overflow-hidden rounded-2xl border transition-[border-color,box-shadow,background-color] duration-200 ${
              isSelected ? "border-dark bg-white shadow-[0px_4px_16px_rgba(55,45,39,0.12)]" : "border-light-grey-3 bg-white/40"
            }`}
          >
            <button
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelect(v)}
              aria-label={`${v.config.mealCount} meals`}
              className="flex w-full cursor-pointer items-center gap-3 px-4 py-4 text-left"
            >
              <span className={`flex size-4 shrink-0 items-center justify-center rounded-full border ${isSelected ? "border-dark" : "border-light-grey-3"}`}>
                <span className={`size-2 rounded-full bg-dark transition-opacity duration-200 ${isSelected ? "opacity-100" : "opacity-0"}`} />
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="font-book text-xl leading-5 tracking-[-0.4px] text-dark">{v.config.mealCount} meals</span>
                <span className="font-sans text-xs leading-4 tracking-[-0.24px] text-dark/65">{v.label}</span>
              </span>
              {v.badge && <span className="rounded bg-brown-border px-2 py-1 text-[8px] uppercase leading-[13px] tracking-[-0.16px] text-white">{v.badge}</span>}
              <span className="font-sans text-sm font-medium leading-[18px] tracking-[-0.28px] text-dark">
                {formatPrice(v.config.mealDiscountedPrice, currencyCode)} {c.perMeal}
              </span>
            </button>
            <div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
              <div className="overflow-hidden">
                <div className="flex flex-col gap-3 px-4 pb-4">
                  <span className="font-sans text-xs font-medium leading-4 tracking-[-0.24px] text-dark">{interpolate(c.listIntro, { n: previous?.config.mealCount ?? 0 })}</span>
                  <ul className="grid grid-cols-4 gap-2">
                    {extras.map(({ meal, isNew }) => (
                      <li key={meal.id} className="flex min-w-0 flex-col gap-1">
                        <button type="button" tabIndex={open ? 0 : -1} onClick={() => onSelectMeal?.(meal)} aria-label={meal.title} className="relative block aspect-square cursor-pointer overflow-hidden rounded-xl bg-light-grey">
                          <Image src={meal.image} alt="" fill unoptimized className="object-cover object-left-top" sizes="80px" />
                          {!isNew && (
                            <span className="absolute right-1 bottom-1 left-1 rounded bg-white/90 px-1 py-0.5 text-center font-sans text-[10px] leading-[13px] tracking-[-0.2px] text-dark">{c.extraPortion}</span>
                          )}
                        </button>
                        <span className="line-clamp-2 font-sans text-xs leading-4 tracking-[-0.24px] text-dark">{meal.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
