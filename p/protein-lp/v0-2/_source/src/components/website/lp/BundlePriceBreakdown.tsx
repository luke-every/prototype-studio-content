"use client";

import { useState } from "react";
import { ChevronDownIcon } from "@/components/icons";
import type { VariantConfiguration } from "@/components/website/bundle-v3/types";
import { formatPrice } from "@/lib/format";

type Props = {
  title: string;
  variantConfiguration: VariantConfiguration;
  currencyCode: string;
};

const ROW = "flex items-center justify-between gap-3 px-4 py-[14px] font-sans text-sm leading-[19px] tracking-[-0.28px] text-dark";

// TODO(lift): sample data — shipping list price; replace with the shipping rate
const SHIPPING_PRICE = 5.99;

/** New, no production counterpart: the LP price breakdown (box size design). */
export function BundlePriceBreakdown({ title, variantConfiguration, currencyCode }: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const { bundlePrice, bundleDiscountedPrice, amountOffPerBundle, promoPercent, amountOffFromPromo } = variantConfiguration;
  const saved = bundlePrice - bundleDiscountedPrice;

  return (
    <div className="overflow-clip rounded-2xl border border-light-brown bg-white">
      <div className={`${ROW} border-b border-light-brown`}>
        <span>{title}</span>
        <span className="text-near-black">{formatPrice(bundlePrice, currencyCode)}</span>
      </div>

      <div className="border-b border-light-brown">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="bundle-discount-details"
          aria-label="Discounts"
          className={`${ROW} w-full cursor-pointer`}
        >
          {/* TODO(lift): replace with translation key */}
          <span className="flex items-center gap-1">
            Discounts
            <ChevronDownIcon size={10} className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
          </span>
          <span className="font-medium text-savings-green">-{formatPrice(saved, currencyCode)}</span>
        </button>
        <div id="bundle-discount-details" className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
          <div className="overflow-hidden">
            <div className="flex flex-col gap-2 px-4 pb-[14px] font-sans text-sm leading-[19px] tracking-[-0.28px] text-dark/60">
              {/* TODO(lift): replace with translation key */}
              {amountOffPerBundle > 0 && (
                <div className="flex justify-between">
                  <span>Qty discount ({Math.round((amountOffPerBundle / bundlePrice) * 100)}%)</span>
                  <span>-{formatPrice(amountOffPerBundle, currencyCode)}</span>
                </div>
              )}
              {amountOffFromPromo > 0 && (
                <div className="flex justify-between">
                  <span>First box discount ({promoPercent}%)</span>
                  <span>-{formatPrice(amountOffFromPromo, currencyCode)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={`${ROW} border-b border-light-brown`}>
        {/* TODO(lift): replace with translation key */}
        <span>Shipping</span>
        <span className="flex gap-1.5">
          <span className="text-near-black line-through opacity-60">{formatPrice(SHIPPING_PRICE, currencyCode)}</span>
          <span className="font-medium text-savings-green">FREE</span>
        </span>
      </div>

      <div className="flex items-center justify-between px-4 py-5">
        {/* TODO(lift): replace with translation key */}
        <span className="font-sans text-base font-medium leading-[22px] tracking-[-0.32px] text-dark">Total Price</span>
        <span className="flex items-center gap-2">
          <span className="rounded bg-savings-green px-1.5 py-0.5 font-sans text-xs font-medium leading-4 tracking-[-0.24px] text-white">You save {formatPrice(saved, currencyCode)}</span>
          <span className="font-sans text-xl font-bold leading-[22px] tracking-[-0.4px] text-dark">{formatPrice(bundleDiscountedPrice, currencyCode)}</span>
        </span>
      </div>
    </div>
  );
}
