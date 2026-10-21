"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { CheckedIcon } from "@/components/icons";
import { formatPrice } from "@/lib/format";
import { interpolate } from "@/lib/translations";
import { usePublicTranslations } from "@/providers/PublicTranslationsProvider";
import { BundleBoxCard } from "./BundleBoxCard";
import { BundleMealGrid } from "./BundleMealGrid";
import { BundleMealShelves } from "./BundleMealShelves";
import { MealListModal } from "./MealListModal";
import { MenuModal } from "./MenuModal";
import { BundleNutritionStats } from "./BundleNutritionStats";
import { BundleSwitcher } from "./BundleSwitcher";
import { BundleVariantSelectorPills } from "./BundleVariantSelectorPills";
import type { MealDetailOpts } from "@/providers/MealDetailProvider";
import type { BundleMeal, BundleSwitchItem, BundleVariant } from "./types";

type Props = {
  hero: ReactNode;
  /** Section rendered directly under the hero */
  belowHero?: ReactNode;
  /** Reviews, shown under the meals on the same background */
  reviews?: ReactNode;
  variants: BundleVariant[];
  name: string;
  /** Small label above the meals headline */
  kicker?: string;
  /** Grey line under the meals headline */
  subhead?: string;
  /** "shelves" splits the meals into one row per product type; default is the 2×2 carousel */
  mealsLayout?: "carousel" | "shelves";
  /** Tighter sides below desktop: 16px around the meals section, with the heading and stats inset 8px more so only the carousel gets the extra room */
  tightPadding?: boolean;
  /** Nutrition tiles above the meals carousel instead of below; the menu button stays below it */
  statsAbove?: boolean;
  /** "outlined": white bordered nutrition tiles and a solid black "See the full menu" button */
  statsDesign?: "default" | "outlined";
  /** The line under the name on the circle card */
  cardDetail?: "kcal" | "ingredients";
  /** Meals per carousel page: 4 (2×2) or 1; 6 is a static 2×3 grid of the first six */
  mealsPerPage?: 1 | 4 | 6;
  /** Meal card style in the 2×2 carousel */
  mealCard?: "image" | "circle" | "outlined";
  /** Teaser grid: last row cut in half and faded, the menu button then the tiles beneath it, and a new "Perfect Portions Menu" modal with a meal-count switcher */
  menuPreview?: boolean;
  /** menuPreview: options for the recipe page opened inside the menu modal */
  mealOpts?: (meal: BundleMeal) => MealDetailOpts;
  /** menuPreview: open the menu modal on first render (a link to that screen) */
  openMenuOnLoad?: boolean;
  /** menuPreview: swipe between recipes inside the menu modal */
  swipeMenu?: boolean;
  /** Chips under the meals headline, in the style of the quiz results page */
  tags?: string[];
  /** Meals headline: the lead, then the part set in italic */
  headline: { lead: string; italic: string };
  backgroundColor: string;
  avgProtein: string;
  avgFibre: string;
  avgKcal: string;
  switchItems?: BundleSwitchItem[];
  currencyCode?: string;
  /** Called when a meal tile is clicked; the page decides what opens. */
  onSelectMeal?: (meal: BundleMeal, meals: BundleMeal[]) => void;
};

/** Front-end-only port of the bundle-v3 module: local state instead of the cart store, discounts and Shopify. Reviews are left out. */
export function BundleContent({ hero, belowHero, reviews, variants, name, kicker, subhead, tags, mealsLayout = "carousel", tightPadding = false, statsDesign, statsAbove = false, cardDetail, mealsPerPage, mealCard, menuPreview = false, mealOpts, swipeMenu = false, openMenuOnLoad = false, headline, backgroundColor, avgProtein, avgFibre, avgKcal, switchItems = [], currencyCode = "EUR", onSelectMeal }: Props) {
  const t = usePublicTranslations();
  const [selectedId, setSelectedId] = useState<number>((variants.find((v) => v.isDefault) ?? variants[0]).id);
  const selected = variants.find((v) => v.id === selectedId) ?? variants[0];
  const [showMealList, setShowMealList] = useState<boolean>(openMenuOnLoad);
  const [showStickyBar, setShowStickyBar] = useState<boolean>(false);
  const bundleRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [gridSeen, setGridSeen] = useState<boolean>(false);

  // The sticky bar slides in once the bundle block enters the viewport, and stays while it is on screen or scrolled past.
  useEffect(() => {
    const target = bundleRef.current;
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyBar(entry.isIntersecting || entry.boundingClientRect.top < 0),
      { threshold: 0 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  // Once the meal grid scrolls into view, the six visible meals' modal photos are fetched so they are cached by the first tap.
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || gridSeen) return;
    const observer = new IntersectionObserver(([entry]) => entry.isIntersecting && setGridSeen(true));
    observer.observe(grid);
    return () => observer.disconnect();
  }, [gridSeen]);

  const uniqueMeals = useMemo<BundleMeal[]>(() => Array.from(new Map(selected.meals.map((m) => [m.id, m])).values()), [selected]);

  // The full menu shows every dish the biggest box holds, whichever size is picked on the page.
  const menuMeals = useMemo<BundleMeal[]>(() => {
    const unique = variants.map((v) => Array.from(new Map(v.meals.map((m) => [m.id, m])).values()));
    return unique.reduce((best, meals) => (meals.length > best.length ? meals : best), uniqueMeals);
  }, [variants, uniqueMeals]);

  useEffect(() => {
    if (!gridSeen) return;
    uniqueMeals.slice(0, 6).forEach((m) => {
      const photo = mealOpts?.(m).imageOverride;
      if (photo) new window.Image().src = photo;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run when the grid is seen, and again when the meals arrive; mealOpts is a new function every render
  }, [gridSeen, uniqueMeals]);

  // Half strength of the bundle colour, as in the design (rgba(…, 0.5) over the white page).
  const boxBackground = `${backgroundColor}80`;
  // The same colour with the white page behind it already blended in: the opaque stand-in the meal fade ends in.
  const boxBackgroundOpaque = `#${[1, 3, 5].map((i) => Math.round((parseInt(backgroundColor.slice(i, i + 2), 16) + 255) / 2).toString(16).padStart(2, "0")).join("")}`;
  // Tight: 16px sides at every width; heading and stats sit 8px further in than the carousel, which is what gives the carousel its room.
  const sides = tightPadding ? "px-4 lg:px-40" : "px-6 md:px-8 lg:px-40";
  // TODO(lift): fake add to cart
  const handleAddToCart = (): void => {};
  const footnote = `${interpolate(t.bundle.stickyFromPerMeal, { price: formatPrice(selected.config.mealDiscountedPrice, currencyCode) })} · ${t.bundle.skipOrCancelAnytime}`;

  return (
    <div className="flex flex-col gap-0">
      <div className="flex flex-col">
        <div className="flex flex-col lg:min-h-[960px] [&>section]:lg:flex-1">{hero}</div>
        {belowHero}

        {/* Meals, box contents (mobile) and reviews share the box background. */}
        <div ref={bundleRef} className="w-full rounded-[32px]" style={{ backgroundColor: boxBackground }}>
        <div className="w-full">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-12 lg:gap-16">
            <div className="flex flex-col gap-6">
              <div className={`flex flex-col gap-4 ${sides} pt-12 lg:pt-16`}>
                <div className={`flex flex-col gap-3 ${tightPadding ? "pl-2 pr-[calc(8%+8px)] lg:px-0" : "pr-[8%]"}`}>
                  {kicker && <span className="font-sans text-xs font-medium uppercase tracking-[-0.24px] text-dark/65">{kicker}</span>}
                  <h2 className="font-book text-[34px] leading-[34px] tracking-[-0.68px] text-dark lg:text-[48px] lg:leading-[50px] lg:tracking-[-0.96px]">
                    {headline.lead}
                    <span className="italic">{headline.italic}</span>
                  </h2>
                  {subhead && <p className="font-sans text-base leading-[22px] tracking-[-0.32px] text-light-text">{subhead}</p>}
                  {tags && tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {tags.map((tag) => (
                        <span key={tag} style={{ backgroundColor: `${backgroundColor}80` }} className="flex items-center gap-[3px] rounded-full px-2 py-1 font-sans text-sm leading-5 tracking-[-0.28px] text-near-black">
                          <CheckedIcon size={12} className="shrink-0" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {statsAbove && (
                <div className={sides}>
                  <div className={`flex flex-col ${tightPadding ? "px-2 lg:px-0" : ""}`}>
                    <BundleNutritionStats
                      part="tiles"
                      design={statsDesign}
                      tileColor="#FFFFFF"
                      avgProtein={avgProtein}
                      avgFibre={avgFibre}
                      avgKcal={avgKcal}
                      mealCount={selected.config.mealCount}
                      onViewAll={() => setShowMealList(true)}
                    />
                  </div>
                </div>
              )}

              <div ref={gridRef} className={`md:pb-8 ${tightPadding ? "px-0 lg:px-40" : "lg:px-40"} lg:pb-0`}>
                <div>
                  {mealsLayout === "shelves" ? (
                    <BundleMealShelves meals={uniqueMeals} onSelectMeal={(meal) => onSelectMeal?.(meal, uniqueMeals)} />
                  ) : (
                    <BundleMealGrid fadeColor={boxBackgroundOpaque} meals={uniqueMeals} onSelectMeal={(meal) => onSelectMeal?.(meal, uniqueMeals)} card={mealCard} wide={tightPadding} perPage={mealsPerPage} cardDetail={cardDetail} preview={menuPreview} />
                  )}
                </div>
              </div>

              <div className={`${sides} pb-8 lg:pb-12`}>
                <div className={`flex flex-col ${tightPadding ? "px-2 lg:px-0" : ""}`}>
                  {menuPreview && (
                    <div className="pb-6">
                      <BundleNutritionStats
                        part="tiles"
                        design={statsDesign}
                        tileColor="#FFFFFF"
                        avgProtein={avgProtein}
                        avgFibre={avgFibre}
                        avgKcal={avgKcal}
                        mealCount={selected.config.mealCount}
                        onViewAll={() => setShowMealList(true)}
                      />
                    </div>
                  )}
                  <BundleNutritionStats
                    part={statsAbove || menuPreview ? "button" : "all"}
                    design={statsDesign}
                    tileColor="#FFFFFF"
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

        {/* What's in your box: box size, price breakdown and add to cart, above the reviews at every width. */}
        <div className="mx-auto max-w-[1440px] px-6 pt-8 pb-12 lg:px-40 lg:pt-12 lg:pb-16">
          <aside className="flex flex-col gap-6 lg:max-w-[560px]">
            <div className="flex flex-col gap-4">
              <h2 className="font-book text-[34px] leading-[34px] tracking-[-0.68px] text-dark">{t.bundle.boxContentsTitle}</h2>

              <div className="flex flex-col gap-4 lg:gap-6">
                <div className="pt-3">
                  <BundleVariantSelectorPills variants={variants} selected={selected} onSelect={(v) => setSelectedId(v.id)} currencyCode={currencyCode} />
                </div>
                <BundleBoxCard title={name} variantConfiguration={selected.config} currencyCode={currencyCode} />
              </div>

              {/* On mobile the sticky bar carries the add to cart. */}
              <div className="hidden lg:mt-[21px] lg:flex lg:flex-col lg:gap-3.5">
                <button type="button" onClick={handleAddToCart} aria-label={t.bundle.addToCart} className="w-full cursor-pointer rounded-[24px] bg-dark px-9 pt-[18px] pb-4 text-center font-sans text-[14px] leading-[14px] uppercase tracking-[2px] text-white">
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

        {reviews && <div className="mx-auto max-w-[1440px] px-6 pb-16 lg:px-40 lg:pb-32">{reviews}</div>}
        </div>
      </div>

      <div
        aria-hidden={!showStickyBar}
        inert={!showStickyBar}
        className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${showStickyBar ? "translate-y-0 shadow-[0_-2px_12px_rgba(55,45,39,0.12)]" : "translate-y-full shadow-none"}`}
        style={{ backgroundColor }}
      >
        <div className="mx-auto flex max-w-[430px] flex-col gap-1.5 px-4 py-3.5">
          <button type="button" onClick={handleAddToCart} aria-label={t.bundle.addToCart} className="w-full cursor-pointer rounded-full bg-dark py-3.5 text-center font-sans text-[15px] font-medium text-white">
            {t.bundle.addToCart}
          </button>
          <p className="text-center font-sans text-xs text-dark/70">{footnote}</p>
        </div>
      </div>

      {menuPreview ? (
        <MenuModal
          open={showMealList}
          meals={menuMeals}
          onClose={() => setShowMealList(false)}
          mealOpts={(meal) => mealOpts?.(meal) ?? {}}
          swipe={swipeMenu}
        />
      ) : (
        <MealListModal
          open={showMealList}
          meals={selected.meals.flatMap((m) => Array.from({ length: m.qty ?? 1 }, () => m))}
          onClose={() => setShowMealList(false)}
          onSelectMeal={(meal) => {
            setShowMealList(false);
            onSelectMeal?.(meal, uniqueMeals);
          }}
        />
      )}
    </div>
  );
}
