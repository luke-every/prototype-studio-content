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
import { RoutineComponentV3 } from "@/components/website/routine/RoutineComponentV3";
import { GlobalSubscribeSectionV2 } from "@/components/website/homepage/GlobalSubscribeSectionV2";
import { GlobalUspGridV2 } from "@/components/website/usp-grid/GlobalUspGridV2";
import { CalorieDeficitSection, type DeficitVariant } from "@/components/website/explore/CalorieDeficitSection";
import { SatisfyingSection, type SatisfyingVariant } from "@/components/website/explore/SatisfyingSection";
import { Footer } from "@/components/website/Footer";
import { useProducts } from "@/hooks/useProducts";
import { useMealDetail } from "@/providers/MealDetailProvider";
import { BodyBalanceLp } from "@/components/lp/BodyBalanceLp";
import { useControl } from "@/lib/studio-controls";
import { portionsVariants } from "@/lib/perfect-portions-sample";
import { FOOTER, NAV_ITEMS } from "@/lib/site-chrome-sample";
import { AFTER_A_FEW_WEEKS, BODY_BALANCE, EXPERTS, FAQ, FEATURED_BY, IMAGE_TEXT, INGREDIENTS, ROUTINE, SUBSCRIBE, USP_GRID } from "@/lib/body-balance-page-sample";

// TODO(lift): sample data — replace with the live reviews.io reviews for the bundle SKU
const SAMPLE_REVIEWS: BundleReview[] = [
  { name: "Katharina", title: "Perfect Portions Plan", rating: 5, comments: "The meals are fresh, delicious, and healthy – ideal for my anti-inflammatory diet, which I've been able to consistently stick to for 10 weeks." },
  { name: "Frank P.", title: "Perfect Portions Plan", rating: 5, comments: "You feel satisfied and energized, not stuffed and sluggish. That’s great." },
  { name: "Paul S.", title: "Perfect Portions Plan", rating: 5, comments: "These regular, balanced meals gave me more energy throughout my day. My digestion has noticeably improved, and I have fewer cravings between meals." },
  { name: "Zachary K.", title: "Perfect Portions Plan", rating: 5, comments: "I was skeptical at first as most meal prep offers taste like cat food. But I'm eating better, I have more time to do other things, and i'm losing weight." },
  { name: "Claudia", title: "Perfect Portions Plan", rating: 5, comments: "Very tasty and varied dishes! Ingredients like vegetables taste incredibly fresh! Dishes are also perfect for diet phases or healthy meals after sport." },
];

function BodyBalancePdp() {
  const p = BODY_BALANCE;
  const products = useProducts();
  const { openMeal } = useMealDetail();
  const variants = useMemo(() => portionsVariants(products), [products]);
  const deficit = useControl("deficit");
  const satisfying = useControl("satisfying");

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
          {deficit !== "off" && <CalorieDeficitSection variant={deficit as DeficitVariant} />}
          {satisfying !== "off" && <SatisfyingSection variant={satisfying as SatisfyingVariant} />}
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
          <RoutineComponentV3
            headline={<>Your routine.<br />Your rules.</>}
            pillars={[
              { title: "Start when you’re ready.", body: "Choose your box size and first delivery date. We’ll curate your first box, delivered frozen and ready to store." },
              { title: "Stay in control.", body: "Pause, skip or adjust in a few clicks. Swap meals from your second box, and cancel anytime." },
            ]}
          />
          <FaqComponent eyebrow={FAQ.eyebrow} headline={FAQ.headline} items={FAQ.items} />
          <GlobalSubscribeSectionV2 {...SUBSCRIBE} backgroundOpacity="50" />
        </div>
      </main>
      <Footer {...FOOTER} rating={p.rating} />
    </>
  );
}

// The studio's "Page" control picks which design this is: the product page, or the landing page.
export default function Home() {
  return useControl("page") === "lp" ? <BodyBalanceLp /> : <BodyBalancePdp />;
}
