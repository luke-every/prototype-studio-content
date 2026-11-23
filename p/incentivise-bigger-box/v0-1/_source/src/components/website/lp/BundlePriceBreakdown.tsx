"use client";

import { useState, type ReactNode } from "react";
import type { VariantConfiguration } from "@/components/website/bundle-v3/types";
import { formatPrice } from "@/lib/format";
import { LineItem } from "./LineItem";
import { RowItems } from "./RowItems";

export type Gift = { name: string; image: string; listPrice: number };

type Props = {
  title: string;
  variantConfiguration: VariantConfiguration;
  currencyCode: string;
  /** Free gifts listed under the title, each with its struck-through list price */
  gifts?: Gift[];
  /** Fixed contents (no size pills): shows the per-meal price and a checklist under the title */
  includes?: string[];
  /** "accordion" folds the discounts into one row (the pricing prototype); "list" shows each as its own row */
  discounts?: "accordion" | "list";
  /** The "You save" pill on the total row, for when it is shown somewhere else (the cart footer) */
  hideSavingBadge?: boolean;
  /** Show each gift's thumbnail; off when the gifts are pictured somewhere else (the cart's box card) */
  giftImages?: boolean;
  /** Small print under the total, one line each (VAT, recurring total) */
  totalNotes?: string[];
  /** Replaces the plain quantity-discount row in the "list" layout (the tier progress variant) */
  quantityRow?: ReactNode;
};

// TODO(lift): sample data — shipping list price; replace with the shipping rate
const SHIPPING_PRICE = 5.99;

/** New, no production counterpart: the LP price breakdown (Figma "Price breakdown", built from LineItem + RowItems). Free gifts are not in the baseline. */
export function BundlePriceBreakdown({
  title,
  variantConfiguration,
  currencyCode,
  gifts,
  includes,
  discounts = "accordion",
  hideSavingBadge = false,
  giftImages = true,
  totalNotes,
  quantityRow,
}: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const {
    bundlePrice,
    bundleDiscountedPrice,
    amountOffPerBundle,
    promoPercent,
    amountOffFromPromo,
    mealDiscountedPrice,
  } = variantConfiguration;
  const saved = bundlePrice - bundleDiscountedPrice;
  const price = (n: number): string => formatPrice(n, currencyCode);

  return (
    <div className="overflow-clip rounded-2xl bg-white">
      <RowItems>
        <LineItem variant="title" label={title} value={price(bundlePrice)} />
        {includes && (
          <>
            {/* TODO(lift): replace with translation key */}
            <p className="mt-1 font-sans text-xs leading-4 tracking-[-0.24px] text-dark">
              {price(mealDiscountedPrice)} per meal
            </p>
            <ul className="mt-3 flex flex-col gap-2 font-sans text-sm leading-[19px] tracking-[-0.28px] text-light-text">
              {includes.map((item) => (
                <li key={item} className="flex gap-2">
                  <span
                    aria-hidden
                    className="w-[13px] shrink-0 text-xs leading-[19px]"
                  >
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </>
        )}
        {gifts && (
          <div className="mt-3 flex flex-col gap-2">
            {gifts.map((gift) => (
              // TODO(lift): sample data — gifts come from the bundle's free-gift configuration
              <LineItem
                key={gift.name}
                image={giftImages ? gift.image : undefined}
                label={gift.name}
                strikeValue={price(gift.listPrice)}
                value="Free"
                valueTone="green"
              />
            ))}
          </div>
        )}
      </RowItems>

      {discounts === "list" ? (
        <RowItems>
          <div className="flex flex-col gap-2">
            {/* TODO(lift): replace with translation key */}
            {amountOffPerBundle > 0 &&
              (quantityRow ?? (
                <LineItem
                  label={`Qty discount (${Math.round((amountOffPerBundle / bundlePrice) * 100)}%)`}
                  value={`-${price(amountOffPerBundle)}`}
                  valueTone="green"
                />
              ))}
            {amountOffFromPromo > 0 && (
              <LineItem
                label={`First box discount (${promoPercent}%)`}
                value={`-${price(amountOffFromPromo)}`}
                valueTone="green"
              />
            )}
          </div>
        </RowItems>
      ) : (
        <RowItems
          expanded={open}
          onToggle={() => setOpen(!open)}
          detailsId="bundle-discount-details"
          toggleLabel="Discounts"
          details={
            <>
              {/* TODO(lift): replace with translation key */}
              {amountOffPerBundle > 0 && (
                <LineItem
                  variant="muted"
                  label={`Qty discount (${Math.round((amountOffPerBundle / bundlePrice) * 100)}%)`}
                  value={`-${price(amountOffPerBundle)}`}
                />
              )}
              {amountOffFromPromo > 0 && (
                <LineItem
                  variant="muted"
                  label={`First box discount (${promoPercent}%)`}
                  value={`-${price(amountOffFromPromo)}`}
                />
              )}
            </>
          }
        >
          {/* TODO(lift): replace with translation key */}
          <LineItem
            accordion
            open={open}
            label={`Discounts (${Math.round((saved / bundlePrice) * 100)}%)`}
            value={`-${price(saved)}`}
            valueTone="green"
          />
        </RowItems>
      )}

      <RowItems>
        {/* TODO(lift): replace with translation key */}
        <LineItem
          label="Shipping"
          strikeValue={price(SHIPPING_PRICE)}
          value="FREE"
          valueTone="green"
        />
      </RowItems>

      <RowItems variant="total">
        {/* TODO(lift): replace with translation key */}
        <LineItem
          variant="total"
          label="Total Price"
          badge={hideSavingBadge ? undefined : `You save ${price(saved)}`}
          value={price(bundleDiscountedPrice)}
        />
        {totalNotes && (
          <div className="mt-1 flex flex-col font-sans text-xs leading-[13px] tracking-[-0.24px] text-brown">
            {totalNotes.map((note) => (
              <span key={note}>{note}</span>
            ))}
          </div>
        )}
      </RowItems>
    </div>
  );
}
