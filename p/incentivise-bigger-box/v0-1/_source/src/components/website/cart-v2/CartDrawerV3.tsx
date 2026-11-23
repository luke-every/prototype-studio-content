"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import {
  ChevronRightFilledIcon,
  CloseIcon,
  DeliveryTruckIcon,
  EmptyBoxIcon,
  ShieldCheckIcon,
  TrashFilledIcon,
} from "@/components/icons";
import { CartAddMeals } from "@/components/website/cart-v2/CartAddMeals";
import { BoxSavingsLadder } from "@/components/website/box-size/BoxSavingsLadder";
import type {
  BundleMeal,
  BundleVariant,
} from "@/components/website/bundle-v3/types";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { useModalFocusTrap } from "@/hooks/useModalFocusTrap";
import {
  BundlePriceBreakdown,
  type Gift,
} from "@/components/website/lp/BundlePriceBreakdown";
import { QuantityDiscountRow } from "@/components/website/lp/QuantityDiscountRow";
import { MealListModal } from "@/components/website/bundle-v3/MealListModal";
import { LineItem } from "@/components/website/lp/LineItem";
import { CART_GIFTS } from "@/lib/cart-gifts-sample";
import { COPY } from "@/lib/copy";
import { formatPrice } from "@/lib/format";
import { interpolate } from "@/lib/translations";
import { usePublicTranslations } from "@/providers/PublicTranslationsProvider";

/** How the cart nudges towards a bigger box. "today" is what cart-v2 does now: one small green line under the checkout button. */
export type CartNudge = "today" | "ladder" | "add" | "both" | "save" | "unlock" | "breakdown";

type Props = {
  open: boolean;
  onClose: () => void;
  /** The box in the cart, or null for an empty cart */
  box: BundleVariant | null;
  /** Every size on offer, for the step up */
  variants: BundleVariant[];
  name: string;
  image: string;
  nudge: CartNudge;
  /** Swaps the box in the cart for another size */
  onSwap: (variant: BundleVariant) => void;
  onClear: () => void;
  /** Opens one dish */
  onSelectMeal: (meal: BundleMeal) => void;
  currencyCode: string;
};

const HEADING =
  "font-book text-2xl leading-[28px] tracking-[-0.48px] text-dark";

// TODO(lift): sample data — free gifts come from the bundle's free-gift configuration
/** How many dishes the card shows as thumbnails before "+N" */
const PREVIEW_DISHES = 4;

const GIFTS: Gift[] = CART_GIFTS.map((g) => ({
  name: `${g.quantity}× ${g.title}`,
  image: g.image,
  listPrice: g.unitListPrice * g.quantity,
}));

/**
 * Extends `CartDrawerV2` (this folder): a copy to redesign the cart in, switched on with the studio's "Cart UI" control. Same props and
 * same `nudge` options as V2, so every cart variation can be flipped between old and new. Starts identical to V2; change it here, not in V2.
 */
export function CartDrawerV3({
  open,
  onClose,
  box,
  variants,
  name,
  image,
  nudge,
  onSwap,
  onClear,
  onSelectMeal,
  currencyCode,
}: Props) {
  const t = usePublicTranslations();
  const c = t.cart;
  const n = COPY.cartNew;
  const dialogRef = useRef<HTMLDivElement>(null);
  const [mealsOpen, setMealsOpen] = useState<boolean>(false);
  // The size the box was before "add the extra meals", while that can still be undone.
  const [undoTo, setUndoTo] = useState<BundleVariant | null>(null);

  // Paused while the meal list is open over the cart, so Escape closes only the list.
  useModalFocusTrap(open && !mealsOpen, dialogRef, onClose);
  useBodyScrollLock(open);

  const money = (n: number): string =>
    formatPrice(n, currencyCode, { space: true });
  const config = box?.config;
  const lineMeals = box?.meals ?? [];

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] bg-black/40 transition-opacity duration-300 ${open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={c.ariaLabel}
        inert={!open}
        className={`fixed top-0 right-0 z-[60] h-dvh w-full max-w-[480px] overflow-y-auto overscroll-contain bg-white outline-none transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Zero-height, so the page starts with "Your order"; the button stays 24px from the top and right while the cart scrolls. */}
        <div className="sticky top-6 z-10 flex h-0 justify-end pr-6">
          <button
            type="button"
            onClick={onClose}
            aria-label={c.closeAriaLabel}
            className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-light-grey text-dark"
          >
            <CloseIcon size={12} />
          </button>
        </div>

        {!box || !config ? (
          <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
            <EmptyBoxIcon size={40} />
            <p className="mt-3 font-sans text-base text-near-black">
              {c.empty}
            </p>
          </div>
        ) : (
          <div className="flex flex-col pb-[200px]">
            <section className="flex flex-col gap-4 px-6 pt-12 pb-8">
              <h2 className={HEADING}>{n.orderTitle}</h2>
              <div className="flex flex-col gap-3">
                {nudge === "ladder" || nudge === "both" ? (
                  <div className="rounded-xl border border-light-grey px-3 py-3">
                    <BoxSavingsLadder
                      variants={variants}
                      selected={box}
                      onSelect={(v) => {
                        setUndoTo(null);
                        onSwap(v);
                      }}
                    />
                  </div>
                ) : null}
                <div className="w-full overflow-hidden rounded-2xl border border-light-grey bg-white">
                  <div className="flex items-center gap-4 p-4">
                    <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-light-grey">
                      <Image
                        src={image}
                        alt={name}
                        fill
                        unoptimized
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <span className="font-sans text-sm font-medium leading-[18px] tracking-[-0.28px] text-near-black">
                        {name}
                      </span>
                      <button
                        type="button"
                        onClick={onClear}
                        aria-label={n.removeAriaLabel}
                        className="flex size-6 cursor-pointer items-center justify-start text-light-text transition-colors hover:text-dark"
                      >
                        <TrashFilledIcon size={16} />
                      </button>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <span className="font-sans text-sm font-medium leading-[18px] tracking-[-0.28px] text-near-black">
                        {money(config.bundleDiscountedPrice)}
                      </span>
                      <span className="font-sans text-xs leading-4 tracking-[-0.24px] text-light-text line-through">
                        {money(config.bundlePrice)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center border-t border-light-grey px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setMealsOpen(true)}
                      aria-haspopup="dialog"
                      className="flex min-w-0 cursor-pointer items-center gap-3 text-left"
                    >
                      <span className="flex shrink-0 items-center -space-x-2">
                        {lineMeals.slice(0, PREVIEW_DISHES).map((meal) => (
                          <span
                            key={meal.id}
                            className="relative size-8 overflow-hidden rounded-full bg-light-grey ring-2 ring-white"
                          >
                            <Image
                              src={meal.image}
                              alt=""
                              fill
                              unoptimized
                              className="object-cover object-left-top"
                              sizes="32px"
                            />
                          </span>
                        ))}
                        {lineMeals.length > PREVIEW_DISHES && (
                          <span className="relative flex size-8 items-center justify-center rounded-full bg-light-grey font-sans text-xs leading-4 tracking-[-0.24px] text-dark ring-2 ring-white">
                            +{lineMeals.length - PREVIEW_DISHES}
                          </span>
                        )}
                      </span>
                      <span className="flex items-center gap-1 font-sans text-sm leading-[18px] tracking-[-0.28px] text-light-text">
                        {interpolate(n.seeAllMeals, {
                          count: config.mealCount,
                        })}
                        <ChevronRightFilledIcon size={10} />
                      </span>
                    </button>
                  </div>
                  <ul className="flex flex-col gap-3 border-t border-light-grey px-4 py-4">
                    {GIFTS.map((gift) => (
                      <li key={gift.name} className="flex items-center gap-3">
                        <Image
                          src={gift.image}
                          alt=""
                          width={40}
                          height={40}
                          className="size-10 shrink-0 rounded-lg object-cover"
                        />
                        <span className="min-w-0 flex-1 font-sans text-sm leading-[18px] tracking-[-0.28px] text-near-black">
                          {gift.name}
                        </span>
                        <span className="font-sans text-sm font-medium leading-[18px] tracking-[-0.28px] text-savings-green">
                          {n.free}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {(nudge === "add" ||
                  nudge === "both" ||
                  nudge === "save" ||
                  nudge === "unlock") && (
                  <CartAddMeals
                    framing={
                      nudge === "save"
                        ? "perMeal"
                        : nudge === "unlock"
                          ? "unlock"
                          : "extra"
                    }
                    variants={variants}
                    selected={box}
                    undoTo={undoTo}
                    onAdd={(next) => {
                      setUndoTo(box);
                      onSwap(next);
                    }}
                    onUndo={() => {
                      if (undoTo) onSwap(undoTo);
                      setUndoTo(null);
                    }}
                    onSelectMeal={onSelectMeal}
                    currencyCode={currencyCode}
                  />
                )}
              </div>
            </section>

            <section className="flex flex-col gap-4 px-6">
              <h2 className={HEADING}>{n.summaryTitle}</h2>
              {/* Same breakdown as the pricing-component prototype (copied into ../lp) */}
              <div className="rounded-2xl border border-light-grey">
                <BundlePriceBreakdown
                  title={name}
                  variantConfiguration={config}
                  discounts="list"
                  hideSavingBadge
                  gifts={GIFTS}
                  giftImages={false}
                  totalNotes={[c.summaryInclVat]}
                  quantityRow={
                    nudge === "breakdown" ? (
                      <QuantityDiscountRow
                        variants={variants}
                        selected={box}
                        onSelect={(v) => {
                          setUndoTo(null);
                          onSwap(v);
                        }}
                        currencyCode={currencyCode}
                      />
                    ) : undefined
                  }
                  currencyCode={currencyCode}
                />
              </div>
            </section>

            <section className="px-6 pt-8">
              <ul className="divide-y divide-light-grey overflow-hidden rounded-2xl border border-light-grey">
                {[
                  {
                    Icon: ShieldCheckIcon,
                    title: n.guaranteeTitle,
                    text: n.guaranteeText,
                    tile: "bg-savings-green/20",
                  },
                  {
                    Icon: DeliveryTruckIcon,
                    title: n.deliveryTitle,
                    text: n.deliveryText,
                    tile: "bg-light-grey/60",
                  },
                ].map(({ Icon, title, text, tile }) => (
                  <li key={title} className="flex items-center gap-4 p-4">
                    <span
                      className={`flex size-10 shrink-0 items-center justify-center rounded-xl text-dark ${tile}`}
                    >
                      <Icon size={20} />
                    </span>
                    <div className="flex min-w-0 flex-col gap-0.5">
                      <span className="font-sans text-sm font-medium leading-[18px] tracking-[-0.28px] text-dark">
                        {title}
                      </span>
                      <span className="font-sans text-xs leading-4 tracking-[-0.24px] text-light-text">
                        {text}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        )}
      </div>

      {box && config && (
        <div
          inert={!open}
          className={`fixed right-0 bottom-0 z-[61] w-full max-w-[480px] bg-white shadow-[0px_-2px_6px_rgba(55,45,39,0.12)] transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex w-full flex-col gap-3 p-6">
            <LineItem
              variant="total"
              badgeTone="soft"
              matchLabelToValue
              label={n.totalPrice}
              badge={interpolate(n.savingBadge, {
                amount: money(
                  config.bundlePrice - config.bundleDiscountedPrice,
                ),
              })}
              value={money(config.bundleDiscountedPrice)}
            />
            {/* TODO(lift): fake checkout */}
            <button
              type="button"
              aria-label={c.checkoutAriaLabel}
              className="w-full cursor-pointer rounded-[24px] bg-signal-orange px-9 pt-[18px] pb-4 text-center font-sans text-[14px] leading-[14px] tracking-[2px] text-dark uppercase"
            >
              {n.checkout}
            </button>
          </div>
        </div>
      )}
      <MealListModal
        open={mealsOpen}
        meals={lineMeals}
        onClose={() => setMealsOpen(false)}
        onSelectMeal={(meal) => {
          setMealsOpen(false);
          onSelectMeal(meal);
        }}
        layer="z-[70]"
      />
    </>
  );
}
