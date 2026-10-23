"use client";

import { useRef, useState } from "react";
import { Drawer } from "@/components/shared/Drawer";
import { ChevronLeftIcon, CloseIcon } from "@/components/icons";
import { PRESS } from "@/lib/press-classes";
import { mealCount, menuFor } from "@/lib/box-menu";
import type { BundleKey } from "../quiz/types";
import { MealTile } from "./MealTile";
import { RecipeDetail } from "./RecipeDetail";
import type { MenuItem, Products } from "./types";

type Props = {
  open: boolean;
  bundle: BundleKey;
  products: Products | null;
  sizeIdx: number;
  onClose: () => void;
};

const ROUND_BUTTON = `absolute top-3.5 z-[3] flex size-8 cursor-pointer items-center justify-center rounded-full bg-white/92 text-near-black shadow-[0_1px_3px] shadow-near-black/14 ${PRESS}`;

/** What "See all 16 meals" opens: the same cards, all of them. A dish opens as the next page across, so Back returns to the menu. */
export function MenuSheet({ open, bundle, products, sizeIdx, onClose }: Props) {
  const [page, setPage] = useState<MenuItem | null>(null);
  const [pageOn, setPageOn] = useState<boolean>(false);
  const clearTimer = useRef<number | null>(null);
  const menu = menuFor(bundle, products, sizeIdx);

  const openPage = (item: MenuItem) => {
    if (clearTimer.current !== null) window.clearTimeout(clearTimer.current);
    setPage(item);
    setPageOn(true);
  };

  const goBack = () => {
    setPageOn(false);
    clearTimer.current = window.setTimeout(() => setPage(null), 460);
  };

  return (
    <Drawer
      open={open}
      title="All meals"
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
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className={`${ROUND_BUTTON} right-4 active:scale-90 ${pageOn ? "top-6 right-6 rounded-2xl bg-white/85 shadow-none" : ""}`}
      >
        <CloseIcon size={pageOn ? 12 : 22} />
      </button>
      <div className="relative flex-1 overflow-hidden">
        <div
          className={`absolute inset-0 flex flex-col bg-white [transition:translate_420ms_var(--ease-swing),opacity_420ms_var(--ease-ui)] ${
            pageOn ? "-translate-x-[26%] opacity-45" : "translate-x-0 opacity-100"
          }`}
        >
          <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pt-3.5 pb-10">
            {/* TODO(lift): replace with translation key */}
            <h2 className="m-0 font-book text-[34px] leading-[34px] tracking-[-0.68px] text-dark">
              All {mealCount(menu, products)} meals
            </h2>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {menu.map((item) => (
                <MealTile key={item.name} item={item} fluid onOpen={openPage} />
              ))}
            </div>
          </div>
        </div>
        <div
          className={`absolute inset-0 flex flex-col bg-white [transition:translate_420ms_var(--ease-swing),opacity_420ms_var(--ease-ui)] ${
            pageOn ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="scrollbar-hide flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain">
            {page && <RecipeDetail item={page} products={products} />}
          </div>
        </div>
      </div>
    </Drawer>
  );
}
