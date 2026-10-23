"use client";

import { useState } from "react";
import { ChevronDownIcon } from "@/components/icons";
import { formatPrice } from "@/lib/format";
import { usePublicTranslations } from "@/providers/PublicTranslationsProvider";
import type { VariantConfiguration } from "./types";

type Props = {
  title: string;
  variantConfiguration: VariantConfiguration;
  currencyCode: string;
};

const ROW = "flex items-center justify-between gap-3 border-t border-[#bdb3a9] px-4 pt-3 pb-[11px]";
const LABEL = "font-sans text-xs font-medium leading-4 tracking-[-0.24px] text-dark";
const FIGURE = "font-sans text-sm font-medium leading-[15px] tracking-[-0.28px] whitespace-nowrap";

/** The price summary from BundleOrderSummary (design v3): struck price before the final one, no box-price row. Open on mobile, closed on desktop until toggled. */
export function BundleBoxCard({ title, variantConfiguration, currencyCode }: Props) {
  const t = usePublicTranslations();
  const [toggled, setToggled] = useState<boolean | null>(null);
  const isDefault = toggled === null;
  const open = toggled ?? true;
  const bodyRows = isDefault ? "grid-rows-[1fr] lg:grid-rows-[0fr]" : open ? "grid-rows-[1fr]" : "grid-rows-[0fr]";
  const chevronTurn = isDefault ? "rotate-180 lg:rotate-0" : open ? "rotate-180" : "";

  const { bundlePrice, bundleDiscountedPrice, amountOffPerBundle, promoPercent, amountOffFromPromo } = variantConfiguration;
  const hasDiscount = bundleDiscountedPrice < bundlePrice;

  const handleToggle = () => {
    // First click: ask the viewport what is on screen now, since "open on mobile, closed on desktop" is CSS only.
    if (isDefault) {
      setToggled(window.matchMedia("(min-width: 64rem)").matches);
      return;
    }
    setToggled(!open);
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-[#bdb3a9]">
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={isDefault ? undefined : open}
        aria-controls="bundle-order-summary-body"
        aria-label={title}
        className="flex cursor-pointer items-center justify-between bg-white/60 px-4 py-4"
      >
        <span className="text-left font-sans text-sm font-medium leading-[15px] tracking-[-0.28px] text-dark">{title}</span>
        <div className="flex items-center gap-2">
          {hasDiscount && (
            <span className="font-sans text-xs leading-4 text-dark/60 line-through whitespace-nowrap">
              {formatPrice(bundlePrice, currencyCode)}
            </span>
          )}
          <span className={`${FIGURE} text-dark`}>{formatPrice(bundleDiscountedPrice, currencyCode)}</span>
          <ChevronDownIcon size={16} className={`shrink-0 transition-transform duration-200 ${chevronTurn}`} />
        </div>
      </button>

      <div id="bundle-order-summary-body" className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${bodyRows}`}>
        <div className="flex flex-col overflow-hidden bg-white/45">
          {amountOffPerBundle > 0 && (
            <div className={ROW}>
              <span className={LABEL}>{t.bundle.quantityDiscount}</span>
              <span className={`${FIGURE} text-savings-green`}>-{formatPrice(amountOffPerBundle, currencyCode)}</span>
            </div>
          )}
          {amountOffFromPromo > 0 && (
            <div className={ROW}>
              <span className={LABEL}>
                {t.bundle.discount} (-{promoPercent}%)
              </span>
              <span className={`${FIGURE} text-savings-green`}>-{formatPrice(amountOffFromPromo, currencyCode)}</span>
            </div>
          )}
          <div className={ROW}>
            <span className={LABEL}>{t.bundle.shipping}</span>
            <span className={`${FIGURE} text-savings-green`}>{t.bundle.shippingFreeCapitalized}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
