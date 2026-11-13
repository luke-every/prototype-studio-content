"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronRightIcon } from "@/components/icons";
import { BundleBoxCard } from "@/components/website/bundle-v3/BundleBoxCard";
import { BundleVariantSelectorPills } from "@/components/website/bundle-v3/BundleVariantSelectorPills";
import type { BundleVariant } from "@/components/website/bundle-v3/types";
import { BUNDLES } from "./bundles";
import { CompareSheet } from "./CompareSheet";
import { OverviewCard, OVERVIEW_ROW_COUNT } from "./OverviewCard";
import { formatPrice } from "@/lib/format";
import { interpolate } from "@/lib/translations";
import { usePublicTranslations } from "@/providers/PublicTranslationsProvider";

// TODO(lift): sample data — copied from the pdp-protein template; replace with prices from Shopify / Eversubs
// Same button as bundle-v3/BundleContent
const CTA_BUTTON = "w-full cursor-pointer rounded-[24px] bg-dark px-9 pt-[18px] pb-4 text-center font-sans text-[14px] leading-[14px] uppercase tracking-[2px] text-white";
const NAME = "The Protein Bundle";
// TODO(lift): sample data — the bundle this PDP is for, shown first in the compare sheet
const CURRENT = "protein";
const BACKGROUND = "#D7EBC2";
const VARIANTS: BundleVariant[] = [
  { id: 0, label: "Starter", meals: [], config: { bundlePrice: 124.85, mealCount: 12, amountOffPerBundle: 20, promoPercent: 20, amountOffFromPromo: 20.97, bundleDiscountedPrice: 83.88, mealDiscountedPrice: 6.99 } },
  { id: 1, label: "Complete", badge: "Most popular", meals: [], config: { bundlePrice: 160.8, mealCount: 16, amountOffPerBundle: 35, promoPercent: 20, amountOffFromPromo: 25.16, bundleDiscountedPrice: 100.64, mealDiscountedPrice: 6.29 } },
  { id: 2, label: "Max", meals: [], config: { bundlePrice: 197.25, mealCount: 20, amountOffPerBundle: 50, promoPercent: 20, amountOffFromPromo: 29.45, bundleDiscountedPrice: 117.8, mealDiscountedPrice: 5.89 } },
];

type Props = {
  /** "overview": the new bundle cards (as in the swipe layout), sheet open from the start, and a grey Compare button so it does not compete with Add to cart. "facts": the earlier fact cards. */
  cards?: "facts" | "overview";
};

/** The PDP's rail on its own, laid out as in bundle-v3/BundleContent: a coloured panel on mobile, a white card from lg. The hero's sticky bar is left out, so the CTA stays in the rail. */
export function BundleComparisonF({ cards = "facts" }: Props) {
  const overview = cards === "overview";
  const t = usePublicTranslations();
  const [sheetOpen, setSheetOpen] = useState<boolean>(overview);
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

        {/* Entry to the comparison: the nav's mobile "Explore all bundles" row */}
        <div className="mt-6 flex flex-col gap-4">
        {/* TODO(lift): replace with translation key */}
        <p className="font-sans text-sm leading-[18px] tracking-[-0.28px] text-near-black">Not the right fit? Explore our other bundles</p>
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          aria-label="Explore all bundles"
          className="flex w-full cursor-pointer items-center gap-2 rounded-xl border border-light-grey bg-white p-4 text-left"
        >
          <Image src="/img/BundleInclusions/compare.svg" alt="" width={24} height={24} className="shrink-0" />
          {/* TODO(lift): replace with translation key */}
          <span className="min-w-0 flex-1 font-sans text-sm font-medium leading-[18px] tracking-[-0.28px] text-near-black">Explore all bundles</span>
          <ChevronRightIcon size={8} className="shrink-0" />
        </button>
        </div>
      </aside>
      <CompareSheet rowCount={OVERVIEW_ROW_COUNT} open={sheetOpen} onClose={() => setSheetOpen(false)}>
        {[...BUNDLES].sort((a, b) => Number(b.key === CURRENT) - Number(a.key === CURRENT)).map((b) => (
          <OverviewCard key={b.key} b={b} layout="sheet" current={b.key === CURRENT} />
        ))}
      </CompareSheet>
    </section>
  );
}
