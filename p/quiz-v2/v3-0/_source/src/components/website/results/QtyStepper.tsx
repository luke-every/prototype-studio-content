"use client";

import { useState } from "react";
import { MinusIcon, PlusIcon, TrashIcon } from "@/components/icons";
import { PRESS } from "@/lib/press-classes";

type Props = {
  qty: number;
  onLess: () => void;
  onMore: () => void;
};

const ROUND = `flex size-10 cursor-pointer items-center justify-center rounded-full text-dark ${PRESS} active:scale-90`;

/** How many of a meal: a bin at one (a minus above), the count and a plus; the count pops when it changes */
export function QtyStepper({ qty, onLess, onMore }: Props) {
  /* the number pops on each change, but not when it first appears */
  const [seen, setSeen] = useState<number>(qty);
  const [changes, setChanges] = useState<number>(0);
  if (qty !== seen) {
    setSeen(qty);
    setChanges((n) => n + 1);
  }

  return (
    <div className="flex items-center gap-1 rounded-full border border-light-grey-3">
      <button
        type="button"
        onClick={onLess}
        disabled={qty === 0}
        aria-label={qty > 1 ? "One less" : "Take out of the box"}
        className={`${ROUND} disabled:cursor-not-allowed disabled:opacity-40`}
      >
        {qty > 1 ? <MinusIcon size={12} /> : <TrashIcon size={16} />}
      </button>
      <span
        key={changes}
        aria-live="polite"
        className={`inline-block min-w-5 text-center text-base leading-[22px] tracking-[-0.32px] text-dark ${changes ? "animate-pop" : ""}`}
      >
        {qty}
      </span>
      <button
        type="button"
        onClick={onMore}
        aria-label="One more"
        className={ROUND}
      >
        <PlusIcon size={12} />
      </button>
    </div>
  );
}
