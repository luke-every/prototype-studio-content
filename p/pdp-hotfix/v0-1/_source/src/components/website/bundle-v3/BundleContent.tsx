"use client";

import { useMemo, useState, type ReactNode } from "react";
import { formatPrice } from "@/lib/format";
import { interpolate } from "@/lib/translations";
import { usePublicTranslations } from "@/providers/PublicTranslationsProvider";
import { BundleBoxCard } from "./BundleBoxCard";
import { BundleMealGrid } from "./BundleMealGrid";
import { MealListModal } from "./MealListModal";
import { BundleNutritionStats } from "./BundleNutritionStats";
import { BundleStickyBar } from "./BundleStickyBar";
import { BundleSwitcher } from "./BundleSwitcher";
import { BundleVariantSelectorPills } from "./BundleVariantSelectorPills";
import type { BundleMeal, BundleSwitchItem, BundleVariant, FreeGift } from "./types";

type Props = {
  hero: ReactNode;
  variants: BundleVariant[];
  name: string;
  /** Small label above the meals headline */
  kicker?: string;
  /** Grey line under the meals headline */
  subhead?: string;
  /** Meals headline: the lead, then the part set in italic */
  headline: { lead: string; italic: string };
  backgroundColor: string;
  avgProtein: string;
  avgFibre: string;
  avgKcal: string;
  switchItems?: BundleSwitchItem[];
  currencyCode?: string;
  /** Called when a meal tile is clicked; the page decides what opens. */
  onSelectMeal?: (meal: BundleMeal) => void;
};

// TODO(lift): sample data — replace with the free gifts from the bundle's discount tiers (placeholder image too)
const SAMPLE_GIFTS: FreeGift[] = [
  { id: "gift-1", title: "Protein shaker", image: "/img/hero-portions.png", quantity: 1, price: 12 },
  { id: "gift-2", title: "Recipe booklet", image: "/img/hero-portions.png", quantity: 1, price: 8 },
];

const CTA_BUTTON = "w-full cursor-pointer rounded-[24px] bg-dark px-9 pt-[18px] pb-4 text-center font-sans text-[14px] leading-[14px] uppercase tracking-[2px] text-white";

/** Port of every-website `src/components/website/bundle-v3/BundleContent.tsx`: local state instead of the cart store, discounts and Shopify. Reviews are left out (see BundleReviewsSection). */
export function BundleContent({ hero, variants, name, kicker, subhead, headline, backgroundColor, avgProtein, avgFibre, avgKcal, switchItems = [], currencyCode = "EUR", onSelectMeal }: Props) {
  const t = usePublicTranslations();
  const [selectedId, setSelectedId] = useState<number>(variants[0].id);
  const selected = variants.find((v) => v.id === selectedId) ?? variants[0];
  const [showMealList, setShowMealList] = useState<boolean>(false);
  const uniqueMeals = useMemo<BundleMeal[]>(() => Array.from(new Map(selected.meals.map((m) => [m.id, m])).values()), [selected]);

  // Half strength of the bundle colour, as in the design (rgba(…, 0.5) over the white page).
  const boxBackground = `${backgroundColor}80`;
  // TODO(lift): fake add to cart
  const handleAddToCart = (): void => {};
  const footnote = `${interpolate(t.bundle.stickyFromPerMeal, { price: formatPrice(selected.config.mealDiscountedPrice, currencyCode) })} · ${t.bundle.skipOrCancelAnytime}`;

  return (
    <div className="flex flex-col gap-0">
      <div className="flex flex-col">
        <div className="flex flex-col lg:min-h-[960px] [&>section]:lg:flex-1">{hero}</div>

        <div className="w-full bg-white">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-12 lg:gap-16">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4 px-6 pt-8 md:px-8 lg:px-40 lg:pt-16">
                <div className="flex flex-col gap-3 lg:max-w-[calc(100%-384px)]">
                  {kicker && <span className="font-sans text-xs font-medium uppercase tracking-[-0.24px] text-dark/65">{kicker}</span>}
                  <h2 className="font-book text-[34px] leading-[34px] tracking-[-0.68px] text-dark lg:text-[48px] lg:leading-[50px] lg:tracking-[-0.96px]">
                    {headline.lead}
                    <span className="italic">{headline.italic}</span>
                  </h2>
                  {subhead && <p className="font-sans text-[14px] leading-[19px] tracking-[-0.28px] text-light-text">{subhead}</p>}
                </div>
              </div>

              <div className="md:pb-8 lg:px-40 lg:pb-0">
                <div className="lg:max-w-[calc(100%-384px)]">
                  <BundleMealGrid meals={uniqueMeals} onSelectMeal={onSelectMeal} />
                </div>
              </div>

              <div className="px-6 pb-16 md:px-8 lg:px-40 lg:pb-32">
                <div className="flex flex-col lg:max-w-[calc(100%-384px)]">
                  <BundleNutritionStats
                    tileColor={boxBackground}
                    avgProtein={avgProtein}
                    avgFibre={avgFibre}
                    avgKcal={avgKcal}
                    mealCount={selected.config.mealCount}
                    onViewAll={() => setShowMealList(true)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* The rail. On desktop it is lifted into an overlay over the whole section (relies on the page's `relative` wrapper). */}
        <div className="rounded-t-[32px] px-6 pt-8 lg:rounded-none lg:p-0" style={{ backgroundColor: boxBackground }}>
          <div className="lg:pointer-events-none lg:absolute lg:inset-0 lg:z-20">
            <div className="lg:mx-auto lg:h-full lg:max-w-[1440px] lg:px-40 lg:pt-[calc(4rem+var(--header-overlay-h,138px))]">
              <aside className="flex flex-col gap-6 lg:pointer-events-auto lg:sticky lg:top-[calc(1rem+var(--header-overlay-h,138px))] lg:ml-auto lg:w-[352px] lg:pb-6">
                <div className="flex flex-col gap-4 lg:max-h-[calc(100vh-2.5rem-var(--header-overlay-h,138px))] lg:rounded-[32px] lg:bg-white lg:p-8 lg:shadow-[0_4px_16px_rgba(0,0,0,0.25)]">
                  <h2 className="shrink-0 font-book text-[34px] leading-[34px] tracking-[-0.68px] text-dark">{t.bundle.boxContentsTitle}</h2>

                  <div className="flex flex-col gap-4 lg:min-h-0 lg:gap-6 lg:overflow-y-auto lg:overscroll-contain">
                    <div className="shrink-0 pt-3">
                      <BundleVariantSelectorPills variants={variants} selected={selected} onSelect={(v) => setSelectedId(v.id)} currencyCode={currencyCode} />
                    </div>
                    <BundleBoxCard title={name} variantConfiguration={selected.config} currencyCode={currencyCode} gifts={SAMPLE_GIFTS} />
                    <div aria-hidden="true" className="pointer-events-none sticky bottom-0 -mt-4 hidden h-8 shrink-0 bg-gradient-to-t from-white to-transparent lg:-mt-6 lg:block" />
                  </div>

                  <div className="hidden lg:mt-[21px] lg:flex lg:shrink-0 lg:flex-col lg:gap-3.5 lg:pb-[13px]">
                    <button type="button" onClick={handleAddToCart} aria-label={t.bundle.addToCart} className={CTA_BUTTON}>
                      {t.bundle.addToCart}
                    </button>
                    <p className="text-center font-sans text-xs leading-[13px] tracking-[-0.24px] text-dark">{footnote}</p>
                  </div>
                </div>

                <div className="lg:hidden">
                  {/* TODO(lift): replace with translation key */}
                  <BundleSwitcher headline="Not the right bundle for you?" items={switchItems} />
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>

      <BundleStickyBar label={t.bundle.addToCart} footnote={footnote} backgroundColor={backgroundColor} onAddToCart={handleAddToCart} />

      <MealListModal
        open={showMealList}
        meals={selected.meals.flatMap((m) => Array.from({ length: m.qty ?? 1 }, () => m))}
        onClose={() => setShowMealList(false)}
        onSelectMeal={(meal) => {
          setShowMealList(false);
          onSelectMeal?.(meal);
        }}
      />
    </div>
  );
}
