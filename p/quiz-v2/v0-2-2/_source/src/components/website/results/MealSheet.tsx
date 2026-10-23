"use client";

import { useState } from "react";
import { Drawer } from "@/components/shared/Drawer";
import { CloseIcon, MinusIcon, PlusIcon, SwapIcon } from "@/components/icons";
import { PRESS } from "@/lib/press-classes";
import { RecipeDetail } from "./RecipeDetail";
import type { MenuItem, Products } from "./types";
import type { BoxLine } from "./useBox";

type Props = {
  open: boolean;
  /** The meal in the box, as it is now; null once it's been taken out */
  line: BoxLine | null;
  item: MenuItem | null;
  products: Products | null;
  /** No swap button when there's nothing to swap to */
  canSwap: boolean;
  /** 0 takes the meal out of the box */
  onQty: (qty: number) => void;
  onSwap: () => void;
  /** The swap choices are open over it, so Esc is theirs */
  covered: boolean;
  onClose: () => void;
};

const ROUND = `flex size-10 cursor-pointer items-center justify-center rounded-full text-dark ${PRESS} active:scale-90`;

/** A meal from the box: its recipe, with how many and a swap held at the foot of the sheet */
export function MealSheet({ open, line, item, products, canSwap, onQty, onSwap, covered, onClose }: Props) {
  /* keeps showing the last meal while the sheet plays its exit */
  const [shown, setShown] = useState<MenuItem | null>(item);
  if (item && item !== shown) setShown(item);
  const meal = item ?? shown;
  const qty = line?.qty ?? 0;

  return (
    <Drawer open={open} title={meal?.name ?? "Meal"} onClose={onClose} onEscape={covered ? () => {} : undefined} centeredOnWide>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className={`absolute top-6 right-6 z-[3] flex size-8 cursor-pointer items-center justify-center rounded-2xl bg-white/85 text-near-black ${PRESS} active:scale-90`}
      >
        <CloseIcon size={12} />
      </button>
      <div className="scrollbar-hide flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain">
        {meal && <RecipeDetail item={meal} products={products} />}
      </div>
      <div className="flex shrink-0 items-center gap-3 border-t border-light-grey bg-white px-6 pt-3 pb-5">
        <div className="flex items-center gap-1 rounded-full border border-light-grey-3">
          <button
            type="button"
            onClick={() => onQty(qty - 1)}
            disabled={qty === 0}
            aria-label={qty > 1 ? "One less" : "Take out of the box"}
            className={`${ROUND} disabled:cursor-not-allowed disabled:opacity-40`}
          >
            <MinusIcon size={12} />
          </button>
          <span aria-live="polite" className="min-w-5 text-center text-base leading-[22px] tracking-[-0.32px] text-dark">
            {qty}
          </span>
          <button type="button" onClick={() => onQty(qty + 1)} aria-label="One more" className={ROUND}>
            <PlusIcon size={12} />
          </button>
        </div>
        {canSwap && qty > 0 && (
          <button
            type="button"
            onClick={onSwap}
            className={`flex h-12 flex-1 cursor-pointer items-center justify-center gap-2 rounded-[30px] bg-dark text-xs leading-4 font-medium tracking-[1.8px] text-white uppercase ${PRESS} active:scale-[.975]`}
          >
            <SwapIcon size={16} />
            {/* TODO(lift): replace with translation key */}
            Swap this meal
          </button>
        )}
      </div>
    </Drawer>
  );
}
