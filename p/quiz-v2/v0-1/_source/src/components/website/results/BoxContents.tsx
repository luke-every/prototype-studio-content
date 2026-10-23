"use client";

import { Button } from "@/components/shared/Button";
import { mealCount, menuFor, placeholderRails, railsFor } from "@/lib/box-menu";
import type { BundleKey } from "../quiz/types";
import { MealTile } from "./MealTile";
import { AVERAGES, MEALS_ARE_RAILS, MENU_SHOWN } from "./sample-data";
import type { MenuItem, Products } from "./types";

type Props = {
  bundle: BundleKey;
  products: Products | null;
  sizeIdx: number;
  /** Variant B sits the box on a tint of the bundle's colour */
  tinted: boolean;
  onOpenRecipe: (item: MenuItem) => void;
  onOpenMenu: () => void;
};

/** What's in your box: a grid of dishes for the bundles that are meals, one rail per section for those that mix product types. */
export function BoxContents({ bundle, products, sizeIdx, tinted, onOpenRecipe, onOpenMenu }: Props) {
  const rails = railsFor(bundle, products, sizeIdx) ?? placeholderRails();
  const menu = menuFor(bundle, products, sizeIdx);
  return (
    <div
      className={`pb-8 ${
        tinted ? "rounded-t-[32px] bg-[color-mix(in_srgb,var(--bundle)_50%,white)] pt-16" : "bg-white pt-12"
      }`}
    >
      {/* TODO(lift): replace with translation key */}
      <h2 className="mx-6 mt-0 mb-4 font-book text-[34px] leading-[34px] tracking-[-0.68px] text-near-black">
        What’s in your box
      </h2>
      <div
        className={`mx-6 mb-6 flex flex-col items-center gap-3 rounded-2xl px-[18px] pt-4 pb-5 ${
          tinted ? "bg-white/50" : "bg-[color-mix(in_srgb,var(--bundle)_25%,transparent)]"
        }`}
      >
        {/* TODO(lift): replace with translation key */}
        <p className="m-0 text-sm leading-[19px] font-medium tracking-[-0.28px] text-dark">Average per meal</p>
        <div className="flex w-full">
          {AVERAGES.map(([value, unit, label]) => (
            <div key={label} className="flex flex-1 flex-col items-center gap-1">
              <span className="flex items-baseline gap-0.5 text-dark">
                <b className="font-book text-[34px] leading-[34px] font-normal tracking-[-0.68px]">{value}</b>
                <s className="text-sm leading-[19px] tracking-[-0.28px] no-underline">{unit}</s>
              </span>
              <span className="text-sm leading-[19px] tracking-[-0.28px] text-dark/60">{label}</span>
            </div>
          ))}
        </div>
      </div>
      {MEALS_ARE_RAILS[bundle] ? (
        rails.map((rail) => (
          <div key={rail.heading} className="pb-8">
            <p className="mx-6 mt-0 mb-3 text-xl leading-[22px] tracking-[-0.4px] text-near-black">{rail.heading}</p>
            <div className="scrollbar-hide flex scroll-pl-6 items-start gap-3 overflow-x-auto px-6">
              {rail.items.map((item) => (
                <MealTile key={item.name} item={item} onOpen={onOpenRecipe} />
              ))}
            </div>
          </div>
        ))
      ) : (
        <>
          <div className="mx-6 grid grid-cols-2 gap-3">
            {menu.slice(0, MENU_SHOWN).map((item) => (
              <MealTile key={item.name} item={item} fluid onOpen={onOpenRecipe} />
            ))}
          </div>
          <Button
            type="button"
            onClick={onOpenMenu}
            aria-label={`See all ${mealCount(menu, products)} meals`}
            sizeClassName="h-10"
            className={`mx-6 mt-4 w-[calc(100%-48px)] justify-center rounded-[30px] border-[.5px] border-dark text-xs font-medium tracking-[1.8px] text-near-black transition-[scale] duration-[240ms] ease-spring active:scale-[.98] active:duration-[90ms] active:ease-out`}
          >
            {/* TODO(lift): replace with translation key */}
            SEE ALL {mealCount(menu, products)} MEALS
          </Button>
        </>
      )}
    </div>
  );
}
