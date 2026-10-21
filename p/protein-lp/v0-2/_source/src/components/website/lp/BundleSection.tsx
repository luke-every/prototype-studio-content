"use client";

import { useState } from "react";
import { BundleMealGrid } from "@/components/website/bundle-v3/BundleMealGrid";
import { BundleNutritionStats } from "@/components/website/bundle-v3/BundleNutritionStats";
import { BundleReviewsSection } from "@/components/website/bundle-v3/BundleReviewsSection";
import { BundleVariantSelectorPills } from "@/components/website/bundle-v3/BundleVariantSelectorPills";
import { MealListModal } from "@/components/website/bundle-v3/MealListModal";
import type { BundleMeal, BundleReview, BundleVariant } from "@/components/website/bundle-v3/types";
import { BundlePriceBreakdown } from "./BundlePriceBreakdown";
import { useMealDetail } from "@/providers/MealDetailProvider";

type Props = {
  kicker: string;
  name: string;
  headline: { lead: string; italic: string };
  subheadline: string;
  avgProtein: string;
  avgFibre: string;
  avgKcal: string;
  boxHeadline: { lead: string; italic: string };
  variants: BundleVariant[];
  defaultVariantId: number;
  reviews: { headline: string; reviews: BundleReview[] };
  rating: { label: string; average: number };
  backgroundColor: string;
};

/** The LP bundle block, composed from the shared bundle components: meal grid, macros, size pills, order summary (v2 design) and reviews. */
/** New, no production counterpart: composes the shared bundle-v3 ports for the LP. */
export function BundleSection({ kicker, name, headline, subheadline, avgProtein, avgFibre, avgKcal, boxHeadline, variants, defaultVariantId, reviews, rating, backgroundColor }: Props) {
  const [selectedId, setSelectedId] = useState<number>(defaultVariantId);
  const selected = variants.find((v) => v.id === selectedId) ?? variants[0];
  const [showMealList, setShowMealList] = useState<boolean>(false);
  const { openMeal } = useMealDetail();
  const handleSelectMeal = (meal: BundleMeal): void => openMeal(meal.id, meal.handle, { hideQuantityButton: true, heroImage: meal.image });

  return (
    <section id="bundle" className="w-full scroll-mt-4 rounded-[32px] px-6 pt-8 pb-16 lg:px-40 lg:pt-16 lg:pb-32" style={{ backgroundColor }}>
      <div className="flex flex-col gap-12 lg:mx-auto lg:max-w-280 lg:gap-16">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 lg:max-w-3xl">
            <div className="flex flex-col gap-3">
              <span className="font-sans text-xs font-medium uppercase leading-4 tracking-[-0.24px] text-dark/65">{kicker}</span>
              <h2 className="font-book text-[34px] leading-[34px] tracking-[-0.68px] text-dark lg:text-[48px] lg:leading-12.5 lg:tracking-[-0.96px]">
                {headline.lead}
                <span className="font-book-italic">{headline.italic}</span>
              </h2>
            </div>
            <p className="font-sans text-sm leading-[19px] tracking-[-0.28px] text-dark lg:text-lg lg:leading-[1.4] lg:tracking-[-0.36px]">{subheadline}</p>
          </div>

          {/* The grid pads its own left edge (16px + the 8px gap), so it runs out to the screen edges. */}
          <div className="-mx-6 lg:mx-0">
            <BundleMealGrid meals={selected.meals} onSelectMeal={handleSelectMeal} />
          </div>

          <BundleNutritionStats
            tileColor="rgba(55,45,39,0.06)"
            avgProtein={avgProtein}
            avgFibre={avgFibre}
            avgKcal={avgKcal}
            mealCount={selected.config.mealCount}
            onViewAll={() => setShowMealList(true)}
          />
        </div>

        <div className="flex flex-col gap-4 lg:max-w-[766px]">
          <h2 className="font-book text-[34px] leading-[34px] tracking-[-0.68px] text-dark lg:text-[48px] lg:leading-12.5 lg:tracking-[-0.96px]">
            {boxHeadline.lead}
            <span className="font-book-italic">{boxHeadline.italic}</span>
          </h2>
          <div className="pt-3">
            <BundleVariantSelectorPills variants={variants} selected={selected} onSelect={(v) => setSelectedId(v.id)} currencyCode="EUR" />
          </div>
          <BundlePriceBreakdown title={`${name} Bundle`}variantConfiguration={selected.config} currencyCode="EUR" />
        </div>

        {/* Runs out to the screen edge so the next card peeks */}
        <div className="-mr-6 lg:mr-0">
          <BundleReviewsSection headline={reviews.headline} reviews={reviews.reviews} rating={rating} />
        </div>
      </div>

      <MealListModal
        open={showMealList}
        meals={selected.meals.flatMap((m) => Array.from({ length: m.qty ?? 1 }, () => m))}
        onClose={() => setShowMealList(false)}
        onSelectMeal={(meal) => {
          setShowMealList(false);
          handleSelectMeal(meal);
        }}
      />
    </section>
  );
}
