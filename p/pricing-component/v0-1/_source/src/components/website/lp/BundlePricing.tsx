"use client";

import { useState } from "react";
import { BundleVariantSelectorPills } from "@/components/website/bundle-v3/BundleVariantSelectorPills";
import type { BundleVariant } from "@/components/website/bundle-v3/types";
import { BundleCta } from "./BundleCta";
import { BundlePriceBreakdown, type Gift } from "./BundlePriceBreakdown";

type Props = {
  title: string;
  heading: { lead: string; italic?: string };
  backgroundColor: string;
  variants: BundleVariant[];
  gifts?: Gift[];
  includes?: string[];
};

/** New, no production counterpart: one bundle's pricing block (Figma "Others": size pills when there is more than one, price breakdown, add to cart). */
export function BundlePricing({ title, heading, backgroundColor, variants, gifts, includes }: Props) {
  const [selectedId, setSelectedId] = useState<number>(variants.find((v) => v.badge)?.id ?? variants[0].id);
  const selected = variants.find((v) => v.id === selectedId) ?? variants[0];

  return (
    <section className="w-full rounded-[32px] px-6 pt-8 pb-16 lg:px-40 lg:pt-16 lg:pb-32" style={{ backgroundColor }}>
      <div className="flex flex-col gap-4 lg:mx-auto lg:max-w-[766px]">
        <h2 className="font-book text-[34px] leading-[34px] tracking-[-0.68px] text-dark">
          {heading.lead}
          {heading.italic && <span className="font-book-italic">{heading.italic}</span>}
        </h2>
        {variants.length > 1 && (
          <div className="pt-3">
            <BundleVariantSelectorPills variants={variants} selected={selected} onSelect={(v) => setSelectedId(v.id)} currencyCode="EUR" tint={backgroundColor} />
          </div>
        )}
        <BundlePriceBreakdown title={title} variantConfiguration={selected.config} currencyCode="EUR" gifts={gifts} includes={includes} />
        <BundleCta />
      </div>
    </section>
  );
}
