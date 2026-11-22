"use client";

import { formatPrice } from "@/lib/format";
import { usePublicTranslations } from "@/providers/PublicTranslationsProvider";
import type { VariantConfiguration } from "./types";

type Props = {
  config: VariantConfiguration;
  currencyCode: string;
};

const ROW = "flex items-center justify-between gap-3 font-sans text-sm leading-[18px] tracking-[-0.28px]";

/**
 * New: nothing in every-website does this (looked in: production's src/components, by name).
 * Always-open price breakdown: line items, then the total with what the customer saves underneath.
 */
export function BundlePriceSummary({ config, currencyCode }: Props) {
  const t = usePublicTranslations();
  const { bundlePrice, bundleDiscountedPrice, amountOffPerBundle, promoPercent, amountOffFromPromo } = config;
  const saved = bundlePrice - bundleDiscountedPrice;

  return (
    <dl className="flex flex-col gap-2">
      <div className={`${ROW} text-dark`}>
        <dt>{t.bundle.boxPrice}</dt>
        <dd>{formatPrice(bundlePrice, currencyCode)}</dd>
      </div>
      {amountOffPerBundle > 0 && (
        <div className={`${ROW} text-dark/60`}>
          <dt>{t.bundle.quantityDiscount}</dt>
          <dd className="text-savings-green">-{formatPrice(amountOffPerBundle, currencyCode)}</dd>
        </div>
      )}
      {amountOffFromPromo > 0 && (
        <div className={`${ROW} text-dark/60`}>
          <dt>
            {t.bundle.discount} (-{promoPercent}%)
          </dt>
          <dd className="text-savings-green">-{formatPrice(amountOffFromPromo, currencyCode)}</dd>
        </div>
      )}
      <div className={`${ROW} text-dark/60`}>
        <dt>{t.bundle.shipping}</dt>
        <dd className="text-savings-green">{t.bundle.shippingFreeCapitalized}</dd>
      </div>
      <div className="mt-2 flex items-end justify-between gap-3 border-t border-light-grey pt-4">
        <div className="flex flex-col gap-0.5">
          {/* TODO(lift): replace with translation key */}
          <dt className="font-sans text-sm font-medium leading-[18px] tracking-[-0.28px] text-dark">Total</dt>
          {saved > 0 && (
            <span className="font-sans text-xs leading-4 tracking-[-0.24px] text-savings-green">
              {/* TODO(lift): replace with translation key */}
              You save {formatPrice(saved, currencyCode)}
            </span>
          )}
        </div>
        <dd className="font-book text-[34px] leading-[34px] tracking-[-0.68px] text-dark">{formatPrice(bundleDiscountedPrice, currencyCode)}</dd>
      </div>
    </dl>
  );
}
