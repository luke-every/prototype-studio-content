"use client";

import { memo, useState } from "react";
import { PlusIcon } from "@/components/icons/PlusIcon";
import { MinusIcon } from "@/components/icons/MinusIcon";
import { TrashIcon } from "@/components/icons/TrashIcon";
import { useTranslations } from "@/providers/TranslationsProvider";

type MealQuantityButtonProps = {
  maxQuantity?: number;
  soldOut?: boolean;
  disabled?: boolean;
  /**
   * Return `false` to veto the UI update (useful when opening a modal before applying).
   */
  onChange?: (quantity: number) => void | boolean;
  initialQuantity?: number;
  /** Switch to pill sizing/rounding (matches `Button` look). */
  shape?: "default" | "pill";
  /** Optional override for the active (quantity > 0) container classes. */
  activeClassName?: string;
};

export const MealQuantityButton = memo(function MealQuantityButton({
  maxQuantity = Infinity,
  soldOut = false,
  disabled = false,
  onChange,
  initialQuantity = 0,
  shape = "default",
  activeClassName,
}: MealQuantityButtonProps) {
  const t = useTranslations();
  const [shaking, setShaking] = useState<boolean>(false);
  // Treat `initialQuantity` as the source of truth (controlled by parent/store).
  const quantity = initialQuantity;

  function increment() {
    if (quantity >= maxQuantity) {
      setShaking(true);
      return;
    }
    const next = quantity + 1;
    const ok = onChange?.(next);
    if (ok === false) return;
  }

  function decrement(e: React.MouseEvent) {
    e.stopPropagation();
    const next = Math.max(0, quantity - 1);
    const ok = onChange?.(next);
    if (ok === false) return;
  }

  function handlePlusActive(e: React.MouseEvent) {
    e.stopPropagation();
    increment();
  }

  const active = quantity > 0;

  const containerShape =
    shape === "pill"
      ? "rounded-full px-4 py-2"
      : "rounded-lg h-8 px-4";

  if (soldOut) {
    return (
      <div className={`w-full ${containerShape} flex items-center justify-center bg-light-grey`}>
        <span className="text-sm text-light-text">{t.shared.mealQuantity.soldOut}</span>
      </div>
    );
  }

  if (!active) {
    return (
      <button
        type="button"
        onClick={increment}
        onAnimationEnd={() => setShaking(false)}
        aria-label={t.shared.mealQuantity.addToOrder}
        disabled={disabled}
        className={`w-full ${containerShape} flex items-center justify-center bg-light-grey cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${shaking ? "animate-shake" : ""}`}
      >
        <PlusIcon />
      </button>
    );
  }

  return (
    <div
      onAnimationEnd={() => setShaking(false)}
      className={`w-full ${containerShape} flex items-center justify-between ${activeClassName ?? "bg-dark"} ${shaking ? "animate-shake" : ""}`}
    >
      <button
        type="button"
        onClick={decrement}
        aria-label={t.shared.mealQuantity.removeOne}
        disabled={disabled}
        className="cursor-pointer text-white disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {quantity <= 1 ? <TrashIcon /> : <MinusIcon />}
      </button>

      <span className="animate-pop text-sm font-medium text-white w-4 text-center leading-none">
        {quantity}
      </span>

      <button
        type="button"
        onClick={handlePlusActive}
        aria-label={t.shared.mealQuantity.addOne}
        disabled={disabled || quantity >= maxQuantity}
        className="cursor-pointer text-white disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <PlusIcon />
      </button>
    </div>
  );
});
