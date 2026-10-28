"use client";

import { useState } from "react";
import { Drawer } from "@/components/shared/Drawer";
import { CloseFilledIcon, SwapIcon } from "@/components/icons";
import { quantityRate } from "@/lib/box-price";
import { allergensIn } from "./copy";
import { PRESS } from "@/lib/press-classes";
import { ConfirmSheet } from "./ConfirmSheet";
import { QtyStepper } from "./QtyStepper";
import { RecipeDetail } from "./RecipeDetail";
import { TierProgress } from "./TierProgress";
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

type Ask = "remove" | "less";

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
  /** What's being asked, kept while the question goes down; `asks` replays the bar each time it comes up */
  const [ask, setAsk] = useState<Ask>("remove");
  const [asks, setAsks] = useState<number>(0);
  if (!open && confirming) setConfirming(false);
  const askFirst = (next: Ask) => {
    setAsk(next);
    setAsks((n) => n + 1);
    setConfirming(true);
  };

  /* one meal fewer: does the discount step down? */
  const now = Math.round(quantityRate(items) * 100);
  const after = Math.round(quantityRate(items - 1) * 100);
  const drops = after < now;
  const costs = drops;
  // TODO(lift): replace with translation keys
  const what =
    ask === "remove"
      ? `${meal?.name ?? "This meal"} will be removed from your box.`
      : `One ${meal?.name ?? "meal"} will come out of your box.`;

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
      <div className="flex shrink-0 items-center gap-3 border-t border-light-grey bg-white px-6 pt-3 pb-5">
        <QtyStepper
          qty={qty}
          /* taking the last one out always asks; one fewer of several asks only when it costs them something */
          onLess={() => {
            if (qty <= 1) return askFirst("remove");
            if (costs) return askFirst("less");
            onQty(qty - 1);
          }}
          onMore={() => onQty(qty + 1)}
        />
        {canSwap && qty > 0 && (
          <button
            type="button"
            onClick={onSwap}
            className={`flex h-12 flex-1 cursor-pointer items-center justify-center gap-2 rounded-[30px] bg-dark text-xs leading-4 font-medium tracking-[1.8px] text-white uppercase ${PRESS} active:scale-[.975]`}
          >
            <SwapIcon size={16} />
            {/* TODO(lift): replace with translation key */}
            Swap
          </button>
        )}
      </div>
      {/* TODO(lift): replace with translation keys */}
      <ConfirmSheet
        open={confirming}
        title="Are you sure?"
        message={what}
        confirmLabel={ask === "remove" ? "Remove" : "Remove one"}
        cancelLabel="Cancel"
        onConfirm={() => {
          setConfirming(false);
          if (ask === "remove") onRemove();
          else onQty(qty - 1);
        }}
        onCancel={() => setConfirming(false)}
      >
        {costs && (
          <TierProgress
            key={asks}
            items={items}
            to={items - 1}
            label={`Your discount will drop to ${after}%`}
          />
        )}
      </ConfirmSheet>
    </Drawer>
  );
}
