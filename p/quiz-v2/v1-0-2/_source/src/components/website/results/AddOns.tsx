"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ImageFallback } from "@/components/shared/ImageFallback";
import { Drawer } from "@/components/shared/Drawer";
import { ChevronLeftIcon, CloseIcon, PlusIcon } from "@/components/icons";
import { addOnTotal, euro } from "@/lib/box-price";
import { PRESS } from "@/lib/press-classes";
import { UPSELLS } from "@/lib/recommendation-data";
import { addOnReason, ALLERGEN_SHORT, listOf } from "./copy";
import { RecipeDetail } from "./RecipeDetail";
import type { MenuItem, Products } from "./types";
import type { Box } from "./useBox";

type Props = {
  box: Box;
  products: Products | null;
  onOpen: (item: MenuItem) => void;
  /** The full list is up, so Esc is its to take */
  onSheetChange: (open: boolean) => void;
};

// TODO(lift): sample data — replace with the add-on categories from the CMS
/** Every add-on, by what kind of thing it is, for the full list */
const GROUPS: [string, string[]][] = [
  ["Protein", ["boonian", "planted"]],
  ["Breakfast", ["porridge", "redberry", "muesli", "granola"]],
  ["Smoothies", ["dg3", "mt3", "tb3"]],
  ["Ritual cubes", ["herbal", "ginger", "turmeric", "berrycubes"]],
  ["Snacks & treats", ["bites", "crumbles", "chocball"]],
  ["Extras", ["chili"]],
];

/** What an add-on costs if it goes in now: it counts towards the box, so the box's discount applies to it too */
const priceOf = (box: Box, key: string) =>
  addOnTotal([key], box.units + box.added.length + (box.added.includes(key) ? 0 : 1));

/** The add-ons the engine recommends for these answers, each with why, each one tap to add or to read more */
export function AddOns({ box, products, onOpen, onSheetChange }: Props) {
  const [all, setAll] = useState<boolean>(false);
  const showAll = (next: boolean) => {
    setAll(next);
    onSheetChange(next);
  };
  const open = (key: string) => {
    const item = UPSELLS[key];
    onOpen({ name: item.name, image: products?.[item.slug]?.image ?? "", slug: item.slug, qty: 1 });
  };
  const offers = box.recommendation.addOns;
  if (!offers.length) return null;
  return (
    <section>
      {/* TODO(lift): replace with translation keys */}
      <h2 className="mx-6 my-0 font-book text-[28px] leading-[30px] tracking-[-0.56px] text-dark">Add-ons for you</h2>
      <ul className="scrollbar-hide m-0 mt-5 flex list-none snap-x gap-3 overflow-x-auto scroll-px-6 px-6 pb-1">
        {offers.map(({ key, why }) => {
          const item = UPSELLS[key];
          const product = products?.[item.slug];
          return (
            <li key={key} className="flex w-[168px] shrink-0 snap-start flex-col">
              <button
                type="button"
                onClick={() => open(key)}
                aria-label={`${item.name} — details`}
                className={`block cursor-pointer p-0 text-left ${PRESS} active:scale-[.97]`}
              >
                <span className="relative block aspect-square overflow-hidden rounded-2xl bg-light-grey">
                  {product?.image ? (
                    <Image src={product.image} alt="" fill sizes="168px" className="object-cover" />
                  ) : (
                    <ImageFallback />
                  )}
                </span>
                <span className="mt-2 block text-base leading-[22px] tracking-[-0.32px] text-near-black">{item.name}</span>
                <span className="mt-0.5 block text-xs leading-4 tracking-[-0.24px] text-light-text">
                  {addOnReason(key, why)}
                </span>
              </button>
              <span className="mt-auto flex items-center justify-between gap-2 pt-2.5">
                <span className="text-sm leading-[18px] tracking-[-0.28px] text-dark">+{euro(priceOf(box, key))}</span>
                <AddToggle box={box} itemKey={key} />
              </span>
            </li>
          );
        })}
      </ul>
      <div className="mx-6 mt-6">
        <button
          type="button"
          onClick={() => showAll(true)}
          className={`flex h-12 w-full cursor-pointer items-center justify-center rounded-[30px] border border-light-grey-3 bg-white text-xs leading-4 font-medium tracking-[1.8px] text-dark uppercase ${PRESS} active:scale-[.975]`}
        >
          {/* TODO(lift): replace with translation key */}
          View all add-ons
        </button>
      </div>
      <AllAddOns box={box} products={products} open={all} onClose={() => showAll(false)} />
    </section>
  );
}

/** Add or take out, the same pill on the cards and in the full list */
function AddToggle({ box, itemKey }: { box: Box; itemKey: string }) {
  const on = box.added.includes(itemKey);
  const { name } = UPSELLS[itemKey];
  return (
    <button
      type="button"
      onClick={() => box.toggleAddOn(itemKey)}
      aria-pressed={on}
      aria-label={on ? `Remove ${name}` : `Add ${name}`}
      className={`flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-3.5 text-xs leading-4 font-medium tracking-[-0.24px] transition-[background-color,color,border-color,scale] duration-[240ms] ease-spring active:scale-[.94] active:duration-[90ms] ${
        on ? "border-dark bg-dark text-white" : "border-light-grey-3 bg-white text-dark"
      }`}
    >
      {on ? <span aria-hidden>✓</span> : <PlusIcon size={12} />}
      {/* TODO(lift): replace with translation key */}
      {on ? "Added" : "Add"}
    </button>
  );
}

type AllProps = {
  box: Box;
  products: Products | null;
  open: boolean;
  onClose: () => void;
};

/* the same round buttons and sliding pages as MealPicker, so going into an item feels the same everywhere */
const ROUND_BUTTON = `absolute top-3.5 z-[3] flex size-8 cursor-pointer items-center justify-center rounded-full bg-white/92 text-near-black shadow-[0_1px_3px] shadow-near-black/14 ${PRESS}`;
const LAYER = "absolute inset-0 flex flex-col bg-white [transition:translate_420ms_var(--ease-swing),opacity_420ms_var(--ease-ui)]";

/**
 * Every add-on, by kind, each one tap to add or to open. Opening one slides its page in over the list,
 * in the same sheet, as MealPicker does. The recommended ones say so; one that holds something they
 * avoid says what, rather than being hidden, so the choice stays theirs.
 */
function AllAddOns({ box, products, open, onClose }: AllProps) {
  const [page, setPage] = useState<string | null>(null);
  const [pageOn, setPageOn] = useState<boolean>(false);
  const clearTimer = useRef<number | null>(null);
  const openPage = (key: string) => {
    if (clearTimer.current !== null) window.clearTimeout(clearTimer.current);
    setPage(key);
    setPageOn(true);
  };
  const goBack = () => {
    setPageOn(false);
    clearTimer.current = window.setTimeout(() => setPage(null), 460);
  };
  /* each opening starts on the list: the page goes once the sheet is down */
  const close = () => {
    onClose();
    goBack();
  };

  const recommended = new Set(box.recommendation.addOns.map((offer) => offer.key));
  const addedCount = box.added.length;
  const pageItem: MenuItem | null = page
    ? { name: UPSELLS[page].name, image: products?.[UPSELLS[page].slug]?.image ?? "", slug: UPSELLS[page].slug, qty: 1 }
    : null;
  const pageAdded = page !== null && box.added.includes(page);

  return (
    <Drawer open={open} title="All add-ons" onClose={close} onEscape={() => (pageOn ? goBack() : close())} size="tall">
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
      <button type="button" onClick={close} aria-label="Close" className={`${ROUND_BUTTON} right-4 active:scale-90`}>
        <CloseIcon size={22} />
      </button>

      <div className="relative flex-1 overflow-hidden">
        <div className={`${LAYER} ${pageOn ? "-translate-x-[26%] opacity-45" : "translate-x-0 opacity-100"}`}>
          <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pt-8 pb-8">
            {/* TODO(lift): replace with translation keys */}
            <h2 className="m-0 pr-12 font-book text-[28px] leading-[30px] tracking-[-0.56px] text-dark">All add-ons</h2>
            <p className="mt-2 mb-0 text-sm leading-[18px] tracking-[-0.28px] text-light-text">
              {addedCount ? `${addedCount} added to your box` : "Added to your first box at the same discount"}
            </p>
            {GROUPS.map(([group, keys]) => (
              <section key={group} className="mt-8">
                <h3 className="m-0 text-xs leading-4 font-medium tracking-[-0.24px] text-light-text">{group}</h3>
                <ul className="m-0 mt-3 flex list-none flex-col p-0">
                  {keys.map((key) => {
                    const item = UPSELLS[key];
                    const image = products?.[item.slug]?.image;
                    const avoided = item.contains.filter((a) => box.engine.allergies.includes(a)).map((a) => ALLERGEN_SHORT[a] ?? a);
                    return (
                      <li key={key} className="flex items-center gap-3 border-b border-light-grey py-3 last:border-b-0">
                        <button
                          type="button"
                          onClick={() => openPage(key)}
                          aria-label={`${item.name} — details`}
                          className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 p-0 text-left"
                        >
                          <span className="relative size-16 shrink-0 overflow-hidden rounded-[14px] bg-light-grey">
                            {image ? <Image src={image} alt="" fill sizes="64px" className="object-cover" /> : <ImageFallback />}
                          </span>
                          <span className="min-w-0">
                            <span className="block text-sm leading-[18px] font-medium tracking-[-0.28px] text-near-black">{item.name}</span>
                            <span className="mt-0.5 block text-sm leading-[18px] tracking-[-0.28px] text-dark">+{euro(priceOf(box, key))}</span>
                            {/* TODO(lift): replace with translation keys */}
                            {recommended.has(key) && (
                              <span className="mt-1 inline-block rounded-full bg-light-brown px-2 py-0.5 text-xs leading-4 tracking-[-0.24px] text-dark">
                                Recommended
                              </span>
                            )}
                            {avoided.length > 0 && (
                              <span className="mt-1 block text-xs leading-4 tracking-[-0.24px] text-light-text">Contains {listOf(avoided)}</span>
                            )}
                          </span>
                        </button>
                        <AddToggle box={box} itemKey={key} />
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        </div>

        <div className={`${LAYER} ${pageOn ? "translate-x-0" : "translate-x-full"}`}>
          <div className="scrollbar-hide flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain">
            {pageItem && <RecipeDetail item={pageItem} products={products} />}
          </div>
          {page && (
            <div className="border-t border-light-grey px-6 pt-3 pb-5">
              <button
                type="button"
                onClick={() => box.toggleAddOn(page)}
                aria-pressed={pageAdded}
                className={`flex h-12 w-full cursor-pointer items-center justify-center rounded-[30px] text-xs leading-4 font-medium tracking-[1.2px] uppercase ${PRESS} active:scale-[.975] ${
                  pageAdded ? "border border-light-grey-3 bg-white text-dark" : "bg-dark text-white"
                }`}
              >
                {/* TODO(lift): replace with translation keys */}
                {pageAdded ? "Remove from box" : `Add to box · +${euro(priceOf(box, page))}`}
              </button>
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
}
