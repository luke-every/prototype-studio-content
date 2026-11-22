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
  /**
   * "v3" is the PDP rail: struck price before the final one, no box-price row, savings-green shipping, open on
   * mobile and closed on desktop until toggled. "v2" keeps the box-price row, shows the final price first and
   * starts open at every width, which is what the LP draws. Defaults to v3.
   */
  design?: "v2" | "v3";
};

const ROW = "flex items-center justify-between gap-3 border-t border-[#bdb3a9] px-4 pt-3 pb-[11px]";
const LABEL = "font-sans text-xs font-medium leading-4 tracking-[-0.24px] text-dark";
const FIGURE = "font-sans text-sm font-medium leading-[15px] tracking-[-0.28px] whitespace-nowrap";

/** Port of every-website `src/components/website/bundle-v2/BundleOrderSummary.tsx` (both `design` values): plain props instead of discount tiers, free gifts and the cart. */
export function BundleBoxCard({ title, variantConfiguration, currencyCode, design = "v3" }: Props) {
  const t = usePublicTranslations();
  const isV3 = design === "v3";
  const [toggled, setToggled] = useState<boolean | null>(null);
  const isDefault = toggled === null;
  const open = toggled ?? true;
  const bodyRows = isV3 && isDefault ? "grid-rows-[1fr] lg:grid-rows-[0fr]" : open ? "grid-rows-[1fr]" : "grid-rows-[0fr]";
  const chevronTurn = isV3 && isDefault ? "rotate-180 lg:rotate-0" : open ? "rotate-180" : "";

  const { bundlePrice, bundleDiscountedPrice, amountOffPerBundle, promoPercent, amountOffFromPromo } = variantConfiguration;
  const hasDiscount = bundleDiscountedPrice < bundlePrice;

  const handleToggle = () => {
    // First click on the v3 card: ask the viewport what is on screen now, since "open on mobile, closed on desktop" is CSS only.
    if (isV3 && isDefault) {
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
        aria-expanded={isV3 && isDefault ? undefined : open}
        aria-controls="bundle-order-summary-body"
        aria-label={title}
        className={`flex cursor-pointer items-center justify-between bg-white/60 px-4 ${isV3 ? "py-4" : "py-3.5"}`}
      >
        <span className={`font-sans text-sm font-medium leading-[15px] tracking-[-0.28px] text-dark ${isV3 ? "text-left" : ""}`}>{title}</span>
        <div className="flex items-center gap-2">
          {isV3 && hasDiscount && (
            <span className="font-sans text-xs leading-4 text-dark/60 line-through whitespace-nowrap">{formatPrice(bundlePrice, currencyCode)}</span>
          )}
          <span className={`font-sans font-medium text-dark whitespace-nowrap ${isV3 ? "text-sm leading-[15px] tracking-[-0.28px]" : "text-base leading-[22px] tracking-[-0.32px]"}`}>
            {formatPrice(bundleDiscountedPrice, currencyCode)}
          </span>
          {!isV3 && hasDiscount && (
            <span className="font-sans text-xs leading-4 text-dark/60 line-through whitespace-nowrap">{formatPrice(bundlePrice, currencyCode)}</span>
          )}
          <ChevronDownIcon size={16} className={`shrink-0 transition-transform duration-200 ${chevronTurn}`} />
        </div>
      </button>

      <div id="bundle-order-summary-body" className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${bodyRows}`}>
        <div className="flex flex-col overflow-hidden bg-white/45">
          {!isV3 && (
            <div className={ROW}>
              <span className={LABEL}>{t.bundle.boxPrice}</span>
              <div className="flex items-center gap-2">
                {hasDiscount && (
                  <span className="font-sans text-xs leading-4 text-dark/50 line-through whitespace-nowrap">{formatPrice(bundlePrice, currencyCode)}</span>
                )}
                <span className={`${FIGURE} text-dark`}>{formatPrice(bundleDiscountedPrice, currencyCode)}</span>
              </div>
            </div>
          )}
          {/* v2 lists the percentage discount first, v3 the quantity discount */}
          {!isV3 && amountOffFromPromo > 0 && (
            <div className={ROW}>
              <span className={LABEL}>
                {t.bundle.discount} (-{promoPercent}%)
              </span>
              <span className={`${FIGURE} text-savings-green`}>-{formatPrice(amountOffFromPromo, currencyCode)}</span>
            </div>
          )}
          {amountOffPerBundle > 0 && (
            <div className={ROW}>
              <span className={LABEL}>{t.bundle.quantityDiscount}</span>
              <span className={`${FIGURE} text-savings-green`}>-{formatPrice(amountOffPerBundle, currencyCode)}</span>
            </div>
          )}
          {isV3 && amountOffFromPromo > 0 && (
            <div className={ROW}>
              <span className={LABEL}>
                {t.bundle.discount} (-{promoPercent}%)
              </span>
              <span className={`${FIGURE} text-savings-green`}>-{formatPrice(amountOffFromPromo, currencyCode)}</span>
            </div>
          )}
          <div className={ROW}>
            <span className={LABEL}>{t.bundle.shipping}</span>
            <span className={isV3 ? `${FIGURE} text-savings-green` : "font-sans text-sm leading-[19px] tracking-[-0.28px] text-dark"}>{t.bundle.shippingFreeCapitalized}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
