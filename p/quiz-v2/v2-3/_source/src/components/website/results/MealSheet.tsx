"use client";

import { useState } from "react";
import { Drawer } from "@/components/shared/Drawer";
import { CloseFilledIcon } from "@/components/icons";
import { allergensIn } from "./copy";
import { PRESS } from "@/lib/press-classes";
import { MealActions } from "./MealActions";
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
  /** Changes how many; never 0 */
  onQty: (qty: number) => void;
  /** Takes the meal out of the box, once they've confirmed */
  onRemove: () => void;
  onSwap: () => void;
  /** The swap choices are open over it, so Esc is theirs */
  covered: boolean;
  /** Products in the box (meals and add-ons), which set the quantity discount */
  items: number;
  /** What they avoid, said on the recipe; the box is free from all 14 when `fallback` */
  allergens: string[];
  fallback: boolean;
  onClose: () => void;
};

/** A meal from the box: its recipe, with how many and a swap held at the foot of the sheet */
export function MealSheet({
  open,
  line,
  item,
  products,
  canSwap,
  onQty,
  onRemove,
  onSwap,
  covered,
  items,
  allergens,
  fallback,
  onClose,
}: Props) {
  /* keeps showing the last meal while the sheet plays its exit */
  const [shown, setShown] = useState<MenuItem | null>(item);
  if (item && item !== shown) setShown(item);
  const meal = item ?? shown;
  const qty = line?.qty ?? 0;
  const [confirming, setConfirming] = useState<boolean>(false);

  return (
    <Drawer
      open={open}
      title={meal?.name ?? "Meal"}
      onClose={onClose}
      onEscape={covered || confirming ? () => {} : undefined}
      centeredOnWide
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className={`absolute top-6 right-6 z-[3] flex size-8 cursor-pointer items-center justify-center rounded-2xl bg-white/85 text-near-black ${PRESS} active:scale-90`}
      >
        <span className="relative flex size-4 items-center justify-center">
          <CloseFilledIcon size={10} />
        </span>
      </button>
      <div className="scrollbar-hide flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain">
        {meal && (
          <RecipeDetail
            item={meal}
            products={products}
            allergens={allergens}
            containing={line ? allergensIn(line.meal, allergens) : []}
            fallback={fallback}
          />
        )}
      </div>
      <MealActions
        open={open}
        name={meal?.name ?? "This meal"}
        qty={qty}
        canSwap={canSwap}
        onQty={onQty}
        onRemove={onRemove}
        onSwap={onSwap}
        items={items}
        onAsking={setConfirming}
      />
    </Drawer>
  );
}
