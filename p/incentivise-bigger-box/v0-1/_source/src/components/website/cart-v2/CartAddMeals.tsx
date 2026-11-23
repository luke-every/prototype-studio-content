"use client";

import Image from "next/image";
import type {
  BundleMeal,
  BundleVariant,
} from "@/components/website/bundle-v3/types";
import { COPY } from "@/lib/copy";
import { DISCOUNT_TIERS, extraMeals, stepUp, tierIndex } from "@/lib/box-step";
import { formatPrice } from "@/lib/format";
import { interpolate } from "@/lib/translations";

type Props = {
  variants: BundleVariant[];
  selected: BundleVariant;
  /** The size the box was before the extra meals were added, while they can still be taken back */
  undoTo: BundleVariant | null;
  onAdd: (next: BundleVariant) => void;
  onUndo: () => void;
  /** Opens one dish */
  onSelectMeal: (meal: BundleMeal) => void;
  currencyCode: string;
  /** What the offer leads with: the plain per-meal line, the per-meal saving, or the discount level the next size unlocks */
  framing?: "extra" | "perMeal" | "unlock";
};

/**
 * New: nothing in every-website does this. A quiet offer under the box card: the shopper's gain is a lower price on every
 * meal in the box (the total still updates below) plus the extra dishes, which are shown and open on tap. One small button
 * adds them and the add can be taken back straight away.
 * Bundles come in fixed sizes, so "add" swaps the box for the next size up (a prototype-only shortcut, `TODO(lift)`).
 */
export function CartAddMeals({
  variants,
  selected,
  undoTo,
  onAdd,
  onUndo,
  onSelectMeal,
  currencyCode,
  framing = "extra",
}: Props) {
  const c = COPY.boxNudge;
  const step = stepUp(variants, selected);
  const extras = step ? extraMeals(selected, step.next) : [];
  const offer = !undoTo && step !== null;
  const money = (n: number): string =>
    formatPrice(n, currencyCode, { space: true });

  return (
    <div className="flex flex-col">
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${offer ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          {step && (
            <div className="flex flex-col gap-3 rounded-xl bg-light-grey/40 p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-0.5">
                  <p className="font-sans text-xs font-medium leading-4 tracking-[-0.24px] text-dark">
                    {framing === "unlock"
                      ? interpolate(c.unlockTitle, {
                          percent:
                            DISCOUNT_TIERS[
                              tierIndex(step.next.config.mealCount)
                            ].percent,
                        })
                      : interpolate(
                          framing === "perMeal" ? c.saveTitle : c.addTitle,
                          {
                            saving: money(
                              selected.config.mealDiscountedPrice -
                                step.next.config.mealDiscountedPrice,
                            ),
                          },
                        )}
                  </p>
                  <p className="flex items-baseline gap-1.5 font-sans text-xs leading-4 tracking-[-0.24px] text-dark/65">
                    {framing === "unlock" && (
                      <span>
                        {interpolate(c.unlockFrom, {
                          percent:
                            DISCOUNT_TIERS[tierIndex(selected.config.mealCount)]
                              .percent,
                        })}
                      </span>
                    )}
                    {framing !== "unlock" && (
                      <span className="line-through">
                        {money(selected.config.mealDiscountedPrice)}
                      </span>
                    )}
                    <span className="text-savings-green">
                      {interpolate(c.addPrice, {
                        price: money(step.next.config.mealDiscountedPrice),
                      })}
                    </span>
                  </p>
                </div>
                <button
                  type="button"
                  tabIndex={offer ? 0 : -1}
                  onClick={() => onAdd(step.next)}
                  className="shrink-0 cursor-pointer rounded-full border border-dark px-4 py-2 font-sans text-xs leading-4 tracking-[-0.24px] text-dark transition-colors hover:bg-dark hover:text-white"
                >
                  {interpolate(
                    framing === "extra" ? c.addAction : c.saveAction,
                    { n: step.next.config.mealCount },
                  )}
                </button>
              </div>
              <div className="flex items-center justify-between gap-3">
                <ul className="flex gap-2">
                  {extras.map(({ meal, isNew }) => {
                    const portions =
                      step.next.meals.find((m) => m.id === meal.id)?.qty ?? 1;
                    return (
                      <li key={meal.id}>
                        <button
                          type="button"
                          tabIndex={offer ? 0 : -1}
                          onClick={() => onSelectMeal(meal)}
                          aria-label={
                            isNew
                              ? meal.title
                              : `${meal.title}, ${portions} portions`
                          }
                          className="relative block size-12 cursor-pointer overflow-hidden rounded-lg bg-light-grey"
                        >
                          <Image
                            src={meal.image}
                            alt=""
                            fill
                            unoptimized
                            className="object-cover object-left-top"
                            sizes="48px"
                          />
                          {!isNew && (
                            <span className="absolute right-0.5 bottom-0.5 rounded bg-white/90 px-1 font-sans text-[10px] leading-[13px] text-dark">
                              {portions}×
                            </span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
                {framing === "unlock" && (
                  <p className="flex flex-col text-right font-sans text-xs leading-4 tracking-[-0.24px] text-dark/65">
                    <span>
                      {interpolate(c.unlockExtras, { count: step.extraMeals })}
                    </span>
                    <span>
                      {interpolate(c.unlockExtraPrice, {
                        price: money(step.extraPrice),
                      })}
                    </span>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${undoTo ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <div className="flex items-center justify-between rounded-xl bg-light-grey/40 px-3 py-2">
            <span className="font-sans text-xs font-medium leading-4 tracking-[-0.24px] text-dark">
              {interpolate(framing === "extra" ? c.addedNote : c.savedNote, {
                n: selected.config.mealCount,
              })}
            </span>
            <button
              type="button"
              tabIndex={undoTo ? 0 : -1}
              onClick={onUndo}
              className="cursor-pointer font-sans text-xs leading-4 tracking-[-0.24px] text-dark underline underline-offset-2"
            >
              {c.undo}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
