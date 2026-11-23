"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ChevronDownFilledIcon, CloseIcon, DeliveryTruckIcon, EmptyBoxIcon, ShieldCheckIcon } from "@/components/icons";
import { FOOTER } from "@/lib/site-chrome-sample";
import { GiftBoxCard } from "@/components/website/cart-v2/GiftBoxCard";
import { CART_GIFTS, giftRetailTotal } from "@/lib/cart-gifts-sample";
import { CartAddMeals } from "@/components/website/cart-v2/CartAddMeals";
import { BoxSavingsLadder } from "@/components/website/box-size/BoxSavingsLadder";
import type { BundleMeal, BundleVariant } from "@/components/website/bundle-v3/types";
import { QuantityPill } from "@/components/website/cart-v2/QuantityPill";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { useModalFocusTrap } from "@/hooks/useModalFocusTrap";
import { DISCOUNT_TIERS, stepUp, tierIndex } from "@/lib/box-step";
import { formatPrice } from "@/lib/format";
import { interpolate } from "@/lib/translations";
import { usePublicTranslations } from "@/providers/PublicTranslationsProvider";

/** How the cart nudges towards a bigger box. "today" is what cart-v2 does now: one small green line under the checkout button. */
export type CartNudge = "today" | "ladder" | "add" | "both" | "save" | "unlock";

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

const RULE = "my-4 h-px w-full shrink-0 rounded-[12px] border-t border-b border-light-grey";
const AMOUNT = "font-book text-lg leading-[18px] tracking-[-0.36px]";
const LABEL = "font-sans text-base leading-[22px] tracking-[-0.32px] text-near-black";

/**
 * Port of every-website `src/components/website/cart-v2/CartDrawerV2.tsx`, `BundleBoxCard.tsx`, `BoxSummary.tsx` and
 * `StickyCheckoutFooter.tsx` as one prop-driven drawer: one bundle line, no store, gifts, add-ons or codes. The
 * `nudge` options are New: nothing in every-website does this (cart-v2 only has the green hint).
 */
export function CartDrawerV2({ open, onClose, box, variants, name, image, nudge, onSwap, onClear, onSelectMeal, currencyCode }: Props) {
  const t = usePublicTranslations();
  const c = t.cart;
  const dialogRef = useRef<HTMLDivElement>(null);
  const [mealsOpen, setMealsOpen] = useState<boolean>(false);
  const [qty, setQty] = useState<number>(1);
  // The size the box was before "add the extra meals", while that can still be undone.
  const [undoTo, setUndoTo] = useState<BundleVariant | null>(null);

  useModalFocusTrap(open, dialogRef, onClose);
  useBodyScrollLock(open);

  const step = box ? stepUp(variants, box) : null;
  const money = (n: number): string => formatPrice(n, currencyCode, { space: true });
  const config = box?.config;
  const lineMeals = box?.meals ?? [];

  const handleDecrement = (): void => {
    if (qty > 1) setQty(qty - 1);
    else onClear();
  };

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
        <div className="sticky top-0 z-10 border-b border-light-grey bg-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="font-book-italic text-[34px] leading-[38px] text-dark">{c.title}</span>
              {config && (
                <span className="rounded-[4px] bg-light-orange px-3 py-1.5 font-sans text-xs leading-[13px] tracking-[-0.24px] text-near-black">
                  {interpolate(c.titleBadge_other, { count: config.mealCount * qty })}
                </span>
              )}
            </div>
            <button type="button" onClick={onClose} aria-label={c.closeAriaLabel} className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-light-grey/85 text-dark">
              <CloseIcon size={12} />
            </button>
          </div>
          {box && (nudge === "ladder" || nudge === "both") && (
            <div className="mt-4 rounded-xl border border-light-grey px-3 py-3">
              <BoxSavingsLadder
                variants={variants}
                selected={box}
                onSelect={(v) => {
                  setUndoTo(null);
                  onSwap(v);
                }}
              />
            </div>
          )}
        </div>

        {!box || !config ? (
          <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
            <EmptyBoxIcon size={40} />
            <p className="mt-3 font-sans text-base text-near-black">{c.empty}</p>
          </div>
        ) : (
          <div className="flex flex-col pb-[200px]">
            <div className="flex flex-col gap-4 px-6 py-4">
              <div className="w-full rounded-[12px] border border-light-grey bg-light-brown p-3 shadow-[0px_4px_6px_rgba(0,0,0,0.25)]">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="relative size-[60px] shrink-0 overflow-hidden rounded-[12px] bg-light-grey">
                      <Image src={image} alt={name} fill unoptimized className="object-cover" sizes="60px" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="font-sans text-sm font-medium leading-[15px] tracking-[-0.28px] text-near-black">{name}</span>
                      <span className="font-book text-lg leading-[18px] tracking-[-0.36px] text-near-black">{interpolate(c.mealsCount_other, { count: config.mealCount })}</span>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <span className={`${AMOUNT} text-near-black`}>{money(config.bundleDiscountedPrice * qty)}</span>
                    <span className={`${AMOUNT} text-light-text line-through`}>{money(config.bundlePrice * qty)}</span>
                  </div>
                </div>
                <div className="mt-3 mb-1 border-b border-light-grey-3" />
                <div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${mealsOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                  <div className="overflow-hidden">
                    <div className="flex flex-col">
                      {lineMeals.map((meal) => (
                        <div key={meal.id}>
                          <div className="flex items-center gap-3 py-3">
                            <div className="relative size-[60px] shrink-0 overflow-hidden rounded-[12px] bg-light-grey">
                              <Image src={meal.image} alt="" fill unoptimized className="object-cover" sizes="60px" />
                            </div>
                            <span className="flex-1 font-sans text-sm font-medium leading-[15px] tracking-[-0.28px] text-dark">{meal.title}</span>
                            <span className="font-sans text-sm font-medium leading-[15px] text-light-text">×{(meal.qty ?? 1) * qty}</span>
                          </div>
                          <div className="border-b border-light-grey-3" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <button type="button" onClick={() => setMealsOpen(!mealsOpen)} aria-expanded={mealsOpen} className="flex cursor-pointer items-center gap-1 font-sans text-xs font-medium leading-[16px] tracking-[-0.24px] text-dark">
                    <ChevronDownFilledIcon size={10} className={`transition-transform duration-200 ${mealsOpen ? "rotate-180" : ""}`} />
                    {mealsOpen ? c.hideMeals : c.showMeals}
                  </button>
                  <QuantityPill quantity={qty} isSyncing={false} onDecrement={handleDecrement} onIncrement={() => setQty(qty + 1)} decrementAriaLabel={c.bundleDecreaseQty} incrementAriaLabel={c.bundleIncreaseQty} />
                </div>
              </div>

              {CART_GIFTS.map((gift) => (
                <GiftBoxCard key={gift.title} title={gift.title} quantity={gift.quantity} image={gift.image} listPrice={gift.unitListPrice * gift.quantity} currencyCode={currencyCode} />
              ))}

              {(nudge === "add" || nudge === "both" || nudge === "save" || nudge === "unlock") && (
                <CartAddMeals
                  framing={nudge === "save" ? "perMeal" : nudge === "unlock" ? "unlock" : "extra"}
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

            <div className="w-full px-6 pt-4 pb-8">
              <p className="mb-4 font-sans text-lg leading-[22px] tracking-[-0.36px] text-dark">{c.boxSummaryTitle}</p>
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <span className="font-sans text-base leading-[22px] tracking-[-0.32px] text-light-text">
                    {c.groupBundle} · {interpolate(c.mealsCount_other, { count: config.mealCount * qty })}
                  </span>
                  <span className={`${AMOUNT} text-light-text`}>{money(config.bundlePrice * qty)}</span>
                </div>
                <div className="flex items-start justify-between">
                  <span className="font-sans text-base leading-[22px] tracking-[-0.32px] text-light-text">
                    {c.groupComplimentary} · {interpolate(c.giftsCount_other, { count: CART_GIFTS.reduce((n, g) => n + g.quantity, 0) })}
                  </span>
                  <span className={`${AMOUNT} text-savings-green`}>{c.summaryShippingFree}</span>
                </div>
              </div>
              <div className={RULE} />
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className={LABEL}>{c.summaryQuantityDiscount}</span>
                  <span className={`${AMOUNT} text-savings-green`}>-{money(config.amountOffPerBundle * qty)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={LABEL}>
                    {t.bundle.discount} (-{config.promoPercent}%)
                  </span>
                  <span className={`${AMOUNT} text-savings-green`}>-{money(config.amountOffFromPromo * qty)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={LABEL}>{c.summaryShipping}</span>
                  <span className={`${AMOUNT} text-savings-green`}>{c.summaryShippingFree}</span>
                </div>
              </div>
              <div className={RULE} />
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <span className={LABEL}>{c.summaryFirstOrderTotal}</span>
                  <div className="flex flex-col font-sans text-xs leading-[13px] tracking-[-0.24px] text-brown">
                    <span>{c.summaryInclVat}</span>
                    <span>{c.summaryRecurringNote}</span>
                  </div>
                </div>
                <span className={`${AMOUNT} text-near-black`}>{money(config.bundleDiscountedPrice * qty)}</span>
              </div>
              <div className={RULE} />
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <DeliveryTruckIcon size={24} className="shrink-0 text-light-text" />
                  <span className="font-sans text-sm leading-[19px] text-light-text">{c.chooseDeliveryDate}</span>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheckIcon size={24} className="shrink-0 text-light-text" />
                  <span className="font-sans text-sm leading-[19px] text-light-text">{c.summaryMoneyBack}</span>
                </div>
              </div>
              <div className={RULE} />
              {/* TODO(lift): sample data — payment icons come from the cart CMS (payment_icons) */}
              <div className="flex items-center gap-3">
                {FOOTER.payments.map((payment) => (
                  <div key={payment.label} className="relative h-5 w-7 shrink-0">
                    <Image src={payment.icon} alt={payment.label} fill unoptimized className="object-contain" sizes="28px" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {box && config && (
        <div
          inert={!open}
          className={`fixed right-0 bottom-0 z-[61] w-full max-w-[480px] bg-white shadow-[0px_-2px_6px_rgba(55,45,39,0.12)] transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex w-full flex-col gap-4 p-4">
            <div className="flex items-end justify-between">
              <span className="font-sans text-xs font-medium leading-[16px] tracking-[-0.24px] text-light-text">{c.bundleMonthlyDelivery}</span>
              <div className="flex items-end gap-2">
                <span className="font-book text-lg leading-[18px] tracking-[-0.36px] text-near-black">{money(config.bundleDiscountedPrice * qty)}</span>
                <span className="font-book text-lg leading-[18px] tracking-[-0.36px] text-light-text line-through">{money(config.bundlePrice * qty + giftRetailTotal())}</span>
              </div>
            </div>
            {/* TODO(lift): fake checkout */}
            <button type="button" aria-label={c.checkoutAriaLabel} className="w-full cursor-pointer rounded-[24px] bg-signal-orange px-9 pt-[18px] pb-4 text-center font-sans text-[14px] leading-[14px] tracking-[2px] text-dark uppercase">
              {c.checkout}
            </button>
            {nudge === "today" && (
              <p className="text-center font-sans text-xs leading-[16px] text-savings-green">
                {step ? interpolate(c.discountHintPercent_other, { count: step.extraMeals, percent: DISCOUNT_TIERS[tierIndex(step.next.config.mealCount)].percent }) : c.discountHintMaxed}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
