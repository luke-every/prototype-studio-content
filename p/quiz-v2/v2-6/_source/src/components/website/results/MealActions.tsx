"use client";

import { useEffect, useState } from "react";
import { SwapIcon } from "@/components/icons";
import { quantityRate } from "@/lib/box-price";
import { PRESS } from "@/lib/press-classes";
import { ConfirmSheet } from "./ConfirmSheet";
import { QtyStepper } from "./QtyStepper";
import { TierProgress } from "./TierProgress";

type Props = {
  /** Its sheet is up; the question goes down with it */
  open: boolean;
  name: string;
  /** How many of it are in the box now */
  qty: number;
  /** No swap button when there's nothing to swap to */
  canSwap: boolean;
  /** Changes how many; never 0 */
  onQty: (qty: number) => void;
  /** Takes the meal out of the box, once they've confirmed */
  onRemove: () => void;
  onSwap: () => void;
  /** Products in the box (meals and add-ons), which set the quantity discount */
  items: number;
  /** The question is up, so Esc is its to take */
  onAsking?: (asking: boolean) => void;
};

type Ask = "remove" | "less";

/** What a meal in the box can do, held at the foot of its sheet: how many, a swap, and the question before taking one out */
export function MealActions({
  open,
  name,
  qty,
  canSwap,
  onQty,
  onRemove,
  onSwap,
  items,
  onAsking,
}: Props) {
  const [confirming, setConfirming] = useState<boolean>(false);
  /** What's being asked, kept while the question goes down; `asks` replays the bar each time it comes up */
  const [ask, setAsk] = useState<Ask>("remove");
  const [asks, setAsks] = useState<number>(0);
  if (!open && confirming) setConfirming(false);
  useEffect(() => onAsking?.(confirming), [confirming, onAsking]);
  const askFirst = (next: Ask) => {
    setAsk(next);
    setAsks((n) => n + 1);
    setConfirming(true);
  };

  /* one meal fewer: does the discount step down? */
  const now = Math.round(quantityRate(items) * 100);
  const after = Math.round(quantityRate(items - 1) * 100);
  const costs = after < now;
  // TODO(lift): replace with translation keys
  const what =
    ask === "remove"
      ? `${name} will be removed from your box.`
      : `One ${name} will come out of your box.`;

  return (
    <>
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
    </>
  );
}
