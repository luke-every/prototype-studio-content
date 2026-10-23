"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Drawer } from "@/components/shared/Drawer";
import { ImageFallback } from "@/components/shared/ImageFallback";
import { ArrowRightIcon, ChevronLeftIcon, CloseIcon } from "@/components/icons";
import { statText } from "@/lib/meal-stats";
import { PRESS } from "@/lib/press-classes";
import type { Meal } from "@/lib/recommendation";
import { RecipeDetail } from "./RecipeDetail";
import { SpiceBadge } from "./SpiceBadge";
import type { MenuItem, Products } from "./types";
import type { Box, BoxLine } from "./useBox";

/** Swapping one meal for another, or adding one to the box */
export type PickerMode = { kind: "swap"; line: BoxLine } | { kind: "add" };

type Props = {
  open: boolean;
  /** Kept while the sheet closes, so its content doesn't vanish on the way down */
  mode: PickerMode | null;
  box: Box;
  products: Products | null;
  /** The Storyblok slug for a meal, or "" */
  slugOf: (meal: Meal) => string;
  onPick: (meal: Meal) => void;
  onClose: () => void;
};

/** The engine's next best, shown big; everything else below */
const TOP = 4;

const ROUND_BUTTON = `absolute top-3.5 z-[3] flex size-8 cursor-pointer items-center justify-center rounded-full bg-white/92 text-near-black shadow-[0_1px_3px] shadow-near-black/14 ${PRESS}`;
const SECTION = "mx-6 mb-0 font-book text-2xl leading-[26px] tracking-[-0.48px] text-dark";
const PILL = `flex h-9 cursor-pointer items-center justify-center rounded-[30px] px-4 text-xs leading-4 font-medium tracking-[1.2px] uppercase ${PRESS} active:scale-[.96]`;

/**
 * Choosing a meal: the four best matches for this customer that aren't in the box, as cards to swipe
 * through, then every meal they can eat. Any meal opens to its recipe, with the same button at the foot.
 */
export function MealPicker({ open, mode, box, products, slugOf, onPick, onClose }: Props) {
  const [page, setPage] = useState<Meal | null>(null);
  const [pageOn, setPageOn] = useState<boolean>(false);
  const [modeSeen, setModeSeen] = useState<PickerMode | null>(mode);
  const clearTimer = useRef<number | null>(null);
  const allRef = useRef<HTMLHeadingElement>(null);

  /* each opening starts on the list */
  if (mode !== modeSeen) {
    setModeSeen(mode);
    setPage(null);
    setPageOn(false);
  }

  const openPage = (meal: Meal) => {
    if (clearTimer.current !== null) window.clearTimeout(clearTimer.current);
    setPage(meal);
    setPageOn(true);
  };
  const goBack = () => {
    setPageOn(false);
    clearTimer.current = window.setTimeout(() => setPage(null), 460);
  };

  const swapping = mode?.kind === "swap" ? mode.line.meal : null;
  const choosable = box.recommendation.pool.filter((meal) => meal.sku !== swapping?.sku);
  const top = choosable.filter((meal) => box.qtyOf(meal) === 0).slice(0, TOP);
  /* everything new first, in rank order; meals already in the box (the top-ranked ones) come after */
  const others = choosable.filter((meal) => !top.includes(meal));
  const rest = [...others.filter((meal) => box.qtyOf(meal) === 0), ...others.filter((meal) => box.qtyOf(meal) > 0)];
  // TODO(lift): replace with translation keys
  const action = mode?.kind === "swap" ? "Swap in" : "Add";

  const imageOf = (meal: Meal): string => products?.[slugOf(meal)]?.image ?? "";
  const photo = (meal: Meal, sizes: string) =>
    imageOf(meal) ? <Image src={imageOf(meal)} alt="" fill sizes={sizes} className="object-cover" /> : <ImageFallback />;
  const stats = (meal: Meal) => box.stats.map((stat) => statText(meal, stat)).join(" · ");
  // TODO(lift): replace with translation key
  /* name and rating on one line, as on the cards in the box */
  const title = (meal: Meal, big: boolean) => (
    <span className={`flex items-baseline justify-between gap-2 ${big ? "mt-3" : "mt-2"}`}>
      <span
        className={`min-w-0 text-near-black ${big ? "text-lg leading-6 tracking-[-0.36px]" : "text-base leading-[22px] tracking-[-0.32px]"}`}
      >
        {meal.name}
      </span>
      <span className="shrink-0 text-xs leading-4 tracking-[-0.24px] text-dark" aria-label={`Rated ${meal.rating} out of 5`}>
        ★ {meal.rating.toFixed(1).replace(".", ",")}
      </span>
    </span>
  );
  const inBox = (meal: Meal) =>
    box.qtyOf(meal) > 0 && (
      <span className="absolute top-2 left-2 rounded-full bg-dark px-2 py-0.5 text-xs leading-4 font-medium tracking-[-0.24px] text-white">
        {/* TODO(lift): replace with translation key */}
        In your box{box.qtyOf(meal) > 1 ? ` ×${box.qtyOf(meal)}` : ""}
      </span>
    );
  const pageItem: MenuItem | null = page ? { name: page.name, image: imageOf(page), slug: slugOf(page), qty: 1 } : null;

  return (
    <Drawer
      open={open}
      title={swapping ? `Swap ${swapping.name}` : "Add a meal"}
      onClose={onClose}
      onEscape={() => (pageOn ? goBack() : onClose())}
      size="tall"
    >
      {!pageOn && <span className="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-sm bg-light-grey-2" />}
      <button
        type="button"
        onClick={goBack}
        aria-label="Back"
        className={`${ROUND_BUTTON} left-4 [transition:opacity_250ms_var(--ease-ui),scale_300ms_var(--ease-spring)] ${
          pageOn ? "pointer-events-auto scale-100 opacity-100" : "pointer-events-none scale-[.8] opacity-0"
        }`}
      >
        <ChevronLeftIcon size={7} stroke="currentColor" />
      </button>
      <button type="button" onClick={onClose} aria-label="Close" className={`${ROUND_BUTTON} right-4 active:scale-90`}>
        <CloseIcon size={22} />
      </button>

      <div className="relative flex-1 overflow-hidden">
        <div
          className={`absolute inset-0 flex flex-col bg-white [transition:translate_420ms_var(--ease-swing),opacity_420ms_var(--ease-ui)] ${
            pageOn ? "-translate-x-[26%] opacity-45" : "translate-x-0 opacity-100"
          }`}
        >
          <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto overscroll-contain pt-3.5 pb-10">
            {/* TODO(lift): replace with translation keys */}
            <h2 className="mx-6 my-0 pr-10 font-book text-[28px] leading-[30px] tracking-[-0.56px] text-dark">
              {swapping ? (
                <>
                  Swap <i className="font-book-italic">{swapping.name}</i>
                </>
              ) : (
                "Add a meal"
              )}
            </h2>

            <h3 className={`${SECTION} mt-7`}>Recommended for you</h3>
            <p className="mx-6 mt-1 mb-0 text-sm leading-[18px] tracking-[-0.28px] text-light-text">Based on your tastes</p>

            <ul className="scrollbar-hide m-0 mt-4 flex list-none snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-6 px-6 pb-1">
              {top.map((meal) => (
                <li key={meal.sku} className="flex w-[78%] shrink-0 snap-start flex-col">
                  <button
                    type="button"
                    onClick={() => openPage(meal)}
                    aria-label={`${meal.name} — recipe details`}
                    className={`block cursor-pointer p-0 text-left ${PRESS} active:scale-[.98]`}
                  >
                    <span className="relative block aspect-square overflow-hidden rounded-2xl bg-light-grey">
                      {photo(meal, "300px")}
                      <SpiceBadge spice={meal.spice} />
                    </span>
                    {title(meal, true)}
                    <span className="mt-0.5 block text-xs leading-4 tracking-[-0.24px] text-light-text">{stats(meal)}</span>
                  </button>
                  <span className="mt-2.5 flex">
                    <button
                      type="button"
                      onClick={() => onPick(meal)}
                      aria-label={`${action} ${meal.name}`}
                      className={`${PILL} bg-dark text-white`}
                    >
                      {action}
                    </button>
                  </span>
                </li>
              ))}
              <li className="flex w-[40%] shrink-0 snap-start">
                <button
                  type="button"
                  onClick={() => allRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
                  className={`flex w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl bg-light-grey p-4 text-center ${PRESS} active:scale-[.98]`}
                >
                  <span className="flex size-10 items-center justify-center rounded-full bg-white text-dark">
                    <ArrowRightIcon size={16} />
                  </span>
                  {/* TODO(lift): replace with translation key */}
                  <span className="text-sm leading-[18px] tracking-[-0.28px] text-dark">See all {rest.length} meals</span>
                </button>
              </li>
            </ul>

            <h3 ref={allRef} className={`${SECTION} mt-10 flex scroll-mt-4 items-baseline justify-between`}>
              {/* TODO(lift): replace with translation key */}
              All meals
              <span className="font-sans text-sm leading-[18px] tracking-[-0.28px] text-light-text">{rest.length}</span>
            </h3>
            <ul className="mx-6 mt-4 grid list-none grid-cols-2 gap-x-3 gap-y-5 p-0">
              {rest.map((meal) => (
                <li key={meal.sku} className="min-w-0">
                  <button
                    type="button"
                    onClick={() => openPage(meal)}
                    aria-label={`${meal.name} — recipe details`}
                    className={`block w-full cursor-pointer p-0 text-left ${PRESS} active:scale-[.97]`}
                  >
                    <span className="relative block aspect-square overflow-hidden rounded-2xl bg-light-grey">
                      {photo(meal, "165px")}
                      {inBox(meal)}
                      <SpiceBadge spice={meal.spice} />
                    </span>
                    {title(meal, false)}
                    <span className="mt-0.5 block text-xs leading-4 tracking-[-0.24px] text-light-text">{stats(meal)}</span>
                  </button>
                  <span className="mt-2.5 flex">
                    <button
                      type="button"
                      onClick={() => onPick(meal)}
                      aria-label={`${action} ${meal.name}`}
                      className={`${PILL} border border-light-grey-3 bg-white text-dark`}
                    >
                      {action}
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className={`absolute inset-0 flex flex-col bg-white [transition:translate_420ms_var(--ease-swing),opacity_420ms_var(--ease-ui)] ${
            pageOn ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="scrollbar-hide flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain">
            {pageItem && <RecipeDetail item={pageItem} products={products} />}
          </div>
          {page && (
            <div className="border-t border-light-grey px-6 pt-3 pb-5">
              <button
                type="button"
                onClick={() => onPick(page)}
                className={`${PILL} h-12 w-full bg-dark text-white`}
              >
                {/* TODO(lift): replace with translation key */}
                {action === "Add" ? "Add to box" : `${action} ${page.name}`}
              </button>
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
}
