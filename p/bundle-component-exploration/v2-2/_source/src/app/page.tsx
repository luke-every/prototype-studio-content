"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { HeaderV2 } from "@/components/website/HeaderV2";
import { BelowHeroUsp } from "@/components/website/BelowHeroUsp";
import type { BundleReview } from "@/components/website/bundle-v3/BundleReviewCard";
import { BundleReviewsSection } from "@/components/website/bundle-v3/BundleReviewsSection";
import { HeroV2 } from "@/components/website/HeroV2";
import { BundleContent } from "@/components/website/bundle-v3/BundleContent";
import type { BundleMeal } from "@/components/website/bundle-v3/types";
import { useMealDetail, type MealDetailOpts } from "@/providers/MealDetailProvider";
import { useProducts } from "@/hooks/useProducts";
import { INGREDIENT_IMAGE_PATHS, ingredientImage } from "@/lib/meals/ingredientImages";
import { menuSlugs } from "@/lib/box-menu";
import { VARIANTS } from "@/lib/variants";
import { NAV_ITEMS, PERFECT_PORTIONS, PORTIONS_BOXES, portionsVariants } from "@/lib/perfect-portions-sample";

// TODO(lift): sample data — placeholder reviews
const SAMPLE_REVIEWS: BundleReview[] = [
  { name: "Firstname L.", verified: true, title: "Meal prep", rating: 5, comments: "Placeholder review copy. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
  { name: "Firstname M.", verified: true, title: "Quick dinners", rating: 5, comments: "Placeholder review copy. Short and sweet." },
  { name: "Firstname S.", verified: true, rating: 4, comments: "Placeholder review copy. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." },
  { name: "Firstname K.", verified: false, title: "Weight loss", rating: 4.5, comments: "Placeholder review copy. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur." },
];

function Pdp() {
  const searchParams = useSearchParams();
  const p = { ...PERFECT_PORTIONS, ...VARIANTS[searchParams.get("v") ?? ""] };
  // ?screen=menu or ?screen=recipe opens the page on that screen, so each can be linked to (Prototype Studio's flow).
  const screen = searchParams.get("screen");
  const products = useProducts();
  const { openMeal } = useMealDetail();
  const exploreMode = "exploreMeals" in p ? p.exploreMeals : undefined;
  const hintShown = useRef<boolean>(false);
  // Swiping calls openMeal again from an old closure; the provider closes the modal if it sees a stale pathname, so always call the latest.
  const openMealRef = useRef(openMeal);
  useEffect(() => {
    openMealRef.current = openMeal;
  }, [openMeal]);
  const mealImages = "mealImages" in p ? p.mealImages : undefined;
  // The products take a few requests to arrive and the grid waits for them, so the six visible cards' photos start loading now.
  useEffect(() => {
    const box = PORTIONS_BOXES.find((b) => b.isDefault) ?? PORTIONS_BOXES[0];
    menuSlugs("portions", box.id).slice(0, 6).forEach((slug) => {
      const photo = mealImages?.[slug];
      if (photo) new window.Image().src = photo;
    });
  }, [mealImages]);
  const variants = useMemo(
    () =>
      portionsVariants(products).map((variant) => ({
        ...variant,
        meals: variant.meals.map((meal) => ({ ...meal, image: mealImages?.[meal.id] ?? meal.image })),
      })),
    [products, mealImages],
  );

  // Fixed at load (the server render only needs a placeholder; paths are resolved on click): opening a meal rewrites the URL, which would move what a relative path points at.
  const [root] = useState<string>(() => (typeof document === "undefined" ? "http://localhost/" : document.baseURI));
  const abs = (path: string): string => new URL(path, root).href;
  // The recipe modal's ingredient photos are small, but only start loading when a modal opens; fetch them now so they are cached by then.
  // The modal asks for the absolute URL (a recipe's URL rewrites the page's base), so the same one is requested here.
  useEffect(() => {
    INGREDIENT_IMAGE_PATHS.forEach((path) => {
      new window.Image().src = new URL(path, root).href;
    });
  }, [root]);
  const mealOpts = (m: BundleMeal): MealDetailOpts => ({
    hideQuantityButton: true,
    heroImage: abs(m.image),
    ingredientImage: (name) => {
      const src = ingredientImage(name);
      return src && abs(src);
    },
    imageOverride: "modalImages" in p && p.modalImages?.[m.id] ? abs(p.modalImages[m.id]) : undefined,
    imageRatio: "modalImageRatio" in p ? p.modalImageRatio : undefined,
    descriptionOverride: "modalDescriptions" in p ? p.modalDescriptions?.[m.id] : undefined,
    descriptionClassName: "modalDescriptions" in p ? "text-light-text" : undefined,
    curatedTags: "curatedTags" in p ? p.curatedTags : undefined,
  });

  const selectMeal = (meal: BundleMeal, meals: BundleMeal[]): void => {
    const items = meals.map((m) => ({ id: m.id, handle: m.handle, title: m.title, image: abs(m.image), previewImage: mealOpts(m).imageOverride }));
    // TODO(lift): fake first-open check — production remembers it in localStorage
    const showHint = exploreMode === "swipe" && !hintShown.current;
    hintShown.current = true;
    const show = (index: number): void => {
      const item = items[index];
      openMealRef.current(item.id, item.handle, {
        ...mealOpts(meals[index]),
        explore: exploreMode ? { mode: exploreMode, items, index, showHint, onGo: show } : undefined,
      });
    };
    show(items.findIndex((m) => m.id === meal.id));
  };

  // The recipe screen: the first meal, opened once the meals have loaded.
  const recipeOpened = useRef<boolean>(false);
  useEffect(() => {
    const meals = (variants.find((v) => v.isDefault) ?? variants[0])?.meals;
    if (screen !== "recipe" || recipeOpened.current || !meals?.length) return;
    recipeOpened.current = true;
    selectMeal(meals[0], meals);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once, when the meals arrive
  }, [screen, variants]);

  return (
    <>
      {/* TODO(lift): fake cart — count stays 0 */}
      <HeaderV2 navItems={NAV_ITEMS} logoSrc="Logo.png" />
      {/* `relative` is the containing block for the desktop rail overlay. */}
      <main className="relative">
      <BundleContent
        name={p.name}
        kicker={p.mealsKicker}
        subhead={"mealsSubhead" in p ? p.mealsSubhead : undefined}
        tags={"mealsTags" in p ? p.mealsTags : undefined}
        mealsLayout={"mealsLayout" in p ? p.mealsLayout : undefined}
        mealCard={"mealCard" in p ? p.mealCard : undefined}
        mealOpts={mealOpts}
        swipeMenu={exploreMode === "swipe"}
        menuPreview={"menuPreview" in p ? p.menuPreview : undefined}
        tightPadding={"tightPadding" in p ? p.tightPadding : undefined}
        statsDesign={"statsDesign" in p ? p.statsDesign : undefined}
        mealsPerPage={"mealsPerPage" in p ? p.mealsPerPage : undefined}
        statsAbove={"statsAbove" in p ? p.statsAbove : undefined}
        cardDetail={"cardDetail" in p ? p.cardDetail : undefined}
        headline={p.mealsHeadline}
        variants={variants}
        backgroundColor={p.backgroundColor}
        avgProtein={p.avgProtein}
        avgFibre={p.avgFibre}
        avgKcal={p.avgKcal}
        switchItems={p.switchItems}
        onSelectMeal={selectMeal}
        openMenuOnLoad={screen === "menu"}
        hero={
          <HeroV2
            rating={p.rating}
            headline={p.headline}
            subheadline={p.subheadline}
            bullets={p.bullets}
            heroImage={p.heroImage}
            backgroundColor={p.backgroundColor}
            ctaLabel="Discover bundle"
          />
        }
        reviews={
          // TODO(lift): sample data — replace with the reviews.io reviews for the bundle SKU
          <BundleReviewsSection reviews={SAMPLE_REVIEWS} rating={{ average: 4.5 }} />
        }
        belowHero={
          // TODO(lift): sample data — replace with the landing page CMS copy and photo
          <BelowHeroUsp
            headline="The easiest way to eat well."
            subheadline="Deciding, shopping, cooking – eating well is a daily job. every takes care of it, so you can enjoy nutritious and delicious meals instead."
            image={{ src: "img/below-hero.png" }}
          />
        }
      />
      </main>
    </>
  );
}

export default function Home() {
  // useSearchParams needs a Suspense boundary for the static export
  return (
    <Suspense>
      <Pdp />
    </Suspense>
  );
}
