"use client";

import Image from "next/image";
import { InfoIcon } from "@/components/icons";
import type { BundleMeal } from "./types";

type Props = {
  meals: BundleMeal[];
  /** What a tile click does, e.g. open a meal modal. */
  onSelectMeal?: (meal: BundleMeal) => void;
  /** A chip on a dish already in the box, by meal id: e.g. it comes with more portions in a bigger box. */
  marks?: Record<string, string>;
  /** Dishes only a bigger box has: shown after the box's own, dimmed, each with the chip text that says which box. */
  previews?: { meal: BundleMeal; label: string }[];
};

const TILES_PER_PAGE = 4;

/** Port of every-website `src/components/website/bundle-v2/BundleMealGrid.tsx` (`design="v3"`): plain `BundleMeal` items instead of Shopify products. */
export function BundleMealGrid({ meals, onSelectMeal, marks, previews = [] }: Props) {
  if (meals.length === 0) return null;

  const tile = ({ meal, label, preview }: { meal: BundleMeal; label?: string; preview?: boolean }, index: number) => (
    <button
      key={`${meal.id}-${index}`}
      type="button"
      onClick={() => onSelectMeal?.(meal)}
      aria-label={`View details for ${meal.title}`}
      className={`group relative aspect-square cursor-pointer overflow-hidden rounded-[18px] bg-light-grey ${preview ? "border border-dashed border-dark/40" : ""}`}
    >
      <Image src={meal.image} alt={meal.title} fill className={`object-cover transition-opacity duration-300 ${preview ? "opacity-60" : ""}`} sizes="240px" />
      {label && (
        <span className="absolute bottom-2 left-2 rounded bg-white/90 px-2 py-1 font-sans text-[10px] leading-[13px] tracking-[-0.2px] text-dark">{label}</span>
      )}
      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-[rgba(55,45,39,0.65)] to-[rgba(55,45,39,0)] to-55% p-2.5 opacity-0 transition-opacity group-hover:opacity-100">
        <span className="font-sans text-xs font-medium text-light-grey">{meal.title}</span>
      </div>
      <div className="absolute bottom-2 right-2 flex size-7 items-center justify-center rounded-full bg-white/[0.82] backdrop-blur-[2px]">
        <InfoIcon className="h-3.5 w-3.5 text-dark" />
      </div>
    </button>
  );

  const items = [...meals.map((meal) => ({ meal, label: marks?.[meal.id] })), ...previews.map(({ meal, label }) => ({ meal, label, preview: true }))];
  const pages: (typeof items)[] = [];
  for (let i = 0; i < items.length; i += TILES_PER_PAGE) pages.push(items.slice(i, i + TILES_PER_PAGE));

  return (
    <div className="w-auto overflow-hidden">
      <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="w-4 max-w-4 shrink-0 snap-start lg:hidden" />
        {pages.map((page, i) => (
          <div key={i} className="grid w-[calc(100vw-48px)] max-w-[360px] shrink-0 snap-start grid-cols-2 grid-rows-2 gap-2 lg:w-[480px] lg:max-w-[480px]">
            {page.map(tile)}
          </div>
        ))}
        <div className="w-4 max-w-4 shrink-0 snap-start lg:hidden" />
      </div>
    </div>
  );
}
