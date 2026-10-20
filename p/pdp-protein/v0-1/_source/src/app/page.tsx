"use client";

import { useMemo } from "react";
import { HeaderV2 } from "@/components/website/HeaderV2";
import { ProductHeroV2 } from "@/components/website/product-hero/ProductHeroV2";
import { BundleContent } from "@/components/website/bundle-v3/BundleContent";
import { BundleReviewsSection } from "@/components/website/bundle-v3/BundleReviewsSection";
import type { BundleReview } from "@/components/website/bundle-v3/types";
import { ExpertReviewsCarouselV2 } from "@/components/website/homepage/GlobalReviewsCarousel";
import { FaqComponent } from "@/components/website/faq/FaqComponent";
import { FeaturedByComponent } from "@/components/website/featured-by/FeaturedByComponent";
import { GlobalImageTextV2 } from "@/components/website/image-text/GlobalImageTextV2";
import { GlobalPillarsV2 } from "@/components/website/pillars/GlobalPillarsV2";
import { RoutineComponent } from "@/components/website/routine/RoutineComponent";
import { GlobalSubscribeSectionV2 } from "@/components/website/homepage/GlobalSubscribeSectionV2";
import { GlobalUspGridV2 } from "@/components/website/usp-grid/GlobalUspGridV2";
import { Footer } from "@/components/website/Footer";
import { useProducts } from "@/hooks/useProducts";
import { useMealDetail } from "@/providers/MealDetailProvider";
import { PROTEIN_BUNDLE, proteinVariants } from "@/lib/protein-bundle-sample";
import { FOOTER, NAV_ITEMS } from "@/lib/site-chrome-sample";
import { AFTER_A_FEW_WEEKS, EXPERTS, FAQ, FEATURED_BY, IMAGE_TEXT, INGREDIENTS, ROUTINE, SUBSCRIBE, USP_GRID } from "@/lib/protein-page-sample";

// TODO(lift): sample data — replace with the live reviews.io reviews for the bundle SKU
const SAMPLE_REVIEWS: BundleReview[] = [
  { name: "Sophie M.", title: "Protein Bundle", rating: 5, comments: "I actually look forward to lunch now. 30g of protein and it tastes like proper restaurant food. The red curry is unreal." },
  { name: "Daan V.", title: "Protein Bundle", rating: 5, comments: "Training four times a week and this makes hitting my protein target effortless. Ready in minutes, no washing up." },
  { name: "Lena K.", title: "Protein Bundle", rating: 4, comments: "Great variety and the portions keep me full all afternoon. Would love a few more spicy options." },
  { name: "Tom H.", title: "Protein Bundle", rating: 5, comments: "Never thought plant-based meals could be this filling. The bami goreng bowl is my favourite." },
  { name: "Marie L.", title: "Protein Bundle", rating: 5, comments: "Delivery was fast, everything arrived frozen solid and the meals heat up perfectly. Easy to skip a week when I travel." },
];

export default function Home() {
  const p = PROTEIN_BUNDLE;
  const products = useProducts();
  const { openMeal } = useMealDetail();
  const variants = useMemo(() => proteinVariants(products), [products]);

  return (
    <>
      {/* TODO(lift): fake cart — count stays 0 */}
      <HeaderV2 navItems={NAV_ITEMS} logoSrc="/Logo.png" />
      {/* `relative` is the containing block for the desktop rail overlay. */}
      <main className="relative">
        <BundleContent
          name={p.name}
          kicker={p.mealsKicker}
          headline={p.mealsHeadline}
          variants={variants}
          backgroundColor={p.backgroundColor}
          avgProtein={p.avgProtein}
          avgFibre={p.avgFibre}
          avgKcal={p.avgKcal}
          switchItems={p.switchItems}
          onSelectMeal={(meal) => openMeal(meal.id, meal.handle, { hideQuantityButton: true, heroImage: meal.image })}
          hero={
            <ProductHeroV2
              rating={p.rating}
              headline={p.headline}
              subheadline={p.subheadline}
              bullets={p.bullets}
              heroImage={p.heroImage}
              heroImageMobile={p.heroImageMobile}
              backgroundColor={p.backgroundColor}
              ctaLabel="Add to cart"
              ctaFootnote={p.ctaFootnote}
            />
          }
        />
        {/* TODO(lift): replace with translation key */}
        <section className="w-full rounded-b-[32px] lg:mt-16 lg:rounded-[32px]" style={{ backgroundColor: `${p.backgroundColor}80` }}>
          <div className="mx-auto max-w-[1440px] px-6 pt-12 pb-16 lg:px-40 lg:pt-16 lg:pb-32">
            <div className="lg:max-w-[calc(100%-384px)]">
              <BundleReviewsSection headline="Over 200,000 happy customers" reviews={SAMPLE_REVIEWS} rating={p.rating} />
            </div>
          </div>
        </section>

        {/* The sections stay at the PDP's narrow width so the sticky rail runs down beside them. */}
        <div className="flex flex-col gap-4 pt-4 lg:gap-6 lg:pt-6">
          <GlobalUspGridV2 headline={USP_GRID.headline} items={USP_GRID.items} />
          <GlobalPillarsV2 eyebrow={INGREDIENTS.eyebrow} headline={INGREDIENTS.headline} items={INGREDIENTS.items} backgroundColor={INGREDIENTS.backgroundColor}>
            <ExpertReviewsCarouselV2 title={EXPERTS.title} experts={EXPERTS.experts} embedded />
          </GlobalPillarsV2>
          <GlobalImageTextV2 headline={IMAGE_TEXT.headline} body={IMAGE_TEXT.body} image={IMAGE_TEXT.image} />
          <GlobalPillarsV2
            eyebrow={AFTER_A_FEW_WEEKS.eyebrow}
            headline={AFTER_A_FEW_WEEKS.headline}
            items={AFTER_A_FEW_WEEKS.items}
            iconStyle="circle"
            dividers
            backgroundColor={AFTER_A_FEW_WEEKS.backgroundColor}
          />
          <FeaturedByComponent headline={FEATURED_BY.headline} logos={FEATURED_BY.logos} />
          <RoutineComponent version="V2" eyebrow={ROUTINE.eyebrow} headline={ROUTINE.headline} slides={[ROUTINE.image]} pillars={ROUTINE.pillars} backgroundColor={ROUTINE.backgroundColor} />
          <FaqComponent eyebrow={FAQ.eyebrow} headline={FAQ.headline} items={FAQ.items} />
          <GlobalSubscribeSectionV2 {...SUBSCRIBE} backgroundOpacity="50" />
        </div>
      </main>
      <Footer {...FOOTER} rating={p.rating} />
    </>
  );
}
