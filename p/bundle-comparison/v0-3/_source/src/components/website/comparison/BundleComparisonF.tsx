"use client";

import { useState } from "react";
import { Button } from "@/components/shared/Button";
import { BundleBoxCard } from "@/components/website/bundle-v3/BundleBoxCard";
import { BundleVariantSelectorPills } from "@/components/website/bundle-v3/BundleVariantSelectorPills";
import type { BundleVariant } from "@/components/website/bundle-v3/types";
import { CompareSheet } from "./CompareSheet";
import { formatPrice } from "@/lib/format";
import { interpolate } from "@/lib/translations";
import { usePublicTranslations } from "@/providers/PublicTranslationsProvider";

// TODO(lift): sample data — copied from the pdp-protein template; replace with prices from Shopify / Eversubs
// Same button as bundle-v3/BundleContent
const CTA_BUTTON = "w-full cursor-pointer rounded-[24px] bg-dark px-9 pt-[18px] pb-4 text-center font-sans text-[14px] leading-[14px] uppercase tracking-[2px] text-white";
const NAME = "The Protein Bundle";
const BACKGROUND = "#D7EBC2";
const VARIANTS: BundleVariant[] = [
  { id: 0, label: "Starter", meals: [], config: { bundlePrice: 124.85, mealCount: 12, amountOffPerBundle: 20, promoPercent: 20, amountOffFromPromo: 20.97, bundleDiscountedPrice: 83.88, mealDiscountedPrice: 6.99 } },
  { id: 1, label: "Complete", badge: "Most popular", meals: [], config: { bundlePrice: 160.8, mealCount: 16, amountOffPerBundle: 35, promoPercent: 20, amountOffFromPromo: 25.16, bundleDiscountedPrice: 100.64, mealDiscountedPrice: 6.29 } },
  { id: 2, label: "Max", meals: [], config: { bundlePrice: 197.25, mealCount: 20, amountOffPerBundle: 50, promoPercent: 20, amountOffFromPromo: 29.45, bundleDiscountedPrice: 117.8, mealDiscountedPrice: 5.89 } },
];

/** The PDP's rail on its own, laid out as in bundle-v3/BundleContent: a coloured panel on mobile, a white card from lg. The hero's sticky bar is left out, so the CTA stays in the rail. */
export function BundleComparisonF() {
  const t = usePublicTranslations();
  const [sheetOpen, setSheetOpen] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<number>(VARIANTS[0].id);
  const selected = VARIANTS.find((v) => v.id === selectedId) ?? VARIANTS[0];
  const footnote = `${interpolate(t.bundle.stickyFromPerMeal, { price: formatPrice(selected.config.mealDiscountedPrice, "EUR") })} · ${t.bundle.skipOrCancelAnytime}`;

  return (
    <section className="rounded-t-[32px] px-6 pb-12 pt-8 lg:rounded-none lg:px-40 lg:py-24" style={{ backgroundColor: `${BACKGROUND}80` }}>
      <aside className="flex flex-col lg:mx-auto lg:w-[352px]">
        <div className="flex flex-col gap-4 lg:rounded-[32px] lg:bg-white lg:p-8 lg:shadow-[0_4px_16px_rgba(0,0,0,0.25)]">
          <h2 className="font-book text-[34px] leading-[34px] tracking-[-0.68px] text-dark">{t.bundle.boxContentsTitle}</h2>
          <div className="flex flex-col gap-4 lg:gap-6">
            <div className="pt-3">
              <BundleVariantSelectorPills variants={VARIANTS} selected={selected} onSelect={(v) => setSelectedId(v.id)} currencyCode="EUR" />
            </div>
            <BundleBoxCard title={NAME} variantConfiguration={selected.config} currencyCode="EUR" />
          </div>
          <div className="flex flex-col gap-3.5 pt-2 lg:mt-[21px] lg:pb-[13px]">
            {/* TODO(lift): fake add to cart */}
            <button type="button" aria-label={t.bundle.addToCart} className={CTA_BUTTON}>
              {t.bundle.addToCart}
            </button>
            <p className="text-center font-sans text-xs leading-[13px] tracking-[-0.24px] text-dark">{footnote}</p>
          </div>
        </div>

        {/* Entry to the comparison, styled like the quiz card on the bundles page */}
        <div className="mt-4 flex flex-col gap-3 rounded-xl border border-light-grey bg-white p-3 shadow-[4px_4px_8px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-4">
            <div className="relative h-[55px] w-[70px] shrink-0 overflow-hidden rounded-lg bg-off-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/img/quiz-card.png" alt="" className="absolute left-[-52.29%] top-[-20.32%] h-[180.12%] w-[178.9%] max-w-none" />
            </div>
            <div className="flex flex-col gap-0.5">
              {/* TODO(lift): replace with translation key */}
              <p className="font-sans text-sm font-medium leading-[15px] tracking-[-0.28px] text-dark">Not sure which bundle?</p>
              <p className="font-sans text-xs leading-4 tracking-[-0.24px] text-light-text">See all four side by side</p>
            </div>
          </div>
          <Button variant="dark" onClick={() => setSheetOpen(true)} sizeClassName="h-10 px-4 py-3" className="w-full justify-center font-sans text-xs font-medium uppercase leading-none tracking-[1.8px]" aria-label="Compare bundles">
            {/* TODO(lift): replace with translation key */}
            Compare bundles
          </Button>
        </div>
      </aside>
      <CompareSheet currentKey="protein" open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </section>
  );
}
