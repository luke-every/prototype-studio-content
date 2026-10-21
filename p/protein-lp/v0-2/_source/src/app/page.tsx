"use client";

import { useMemo } from "react";
import { Headline } from "@/components/shared/Headline";
import { BundleStickyBar } from "@/components/website/bundle-v3/BundleStickyBar";
import { FaqComponent } from "@/components/website/faq/FaqComponent";
import { FeaturedByComponent } from "@/components/website/featured-by/FeaturedByComponent";
import { Footer } from "@/components/website/Footer";
import { FrozenIngredientsComponent } from "@/components/website/ingredients/FrozenIngredientsComponent";
import { GlobalSubscribeSectionV2 } from "@/components/website/homepage/GlobalSubscribeSectionV2";
import { ExpertReviewsCarouselV2 } from "@/components/website/homepage/GlobalReviewsCarousel";
import { HeaderV2 } from "@/components/website/HeaderV2";
import { BundleSection } from "@/components/website/lp/BundleSection";
import { BelowHeroUsp } from "@/components/website/BelowHeroUsp";
import { Hero } from "@/components/website/Hero";
import { RoutineComponent } from "@/components/website/routine/RoutineComponent";
import { BUNDLE, FAQ, FOUNDATION, HERO, INGREDIENTS, LP_GREEN, LP_NEWSLETTER_GREEN, LP_RATING, NEWSLETTER, RETAILERS, REVIEWS, ROUTINE, STICKY, lpVariants } from "@/lib/lp-protein-sample";
import { useProducts } from "@/hooks/useProducts";
import { FOOTER, NAV_ITEMS } from "@/lib/site-chrome-sample";

// The LP frame in Figma is mobile only. Every section here is a port of a production component, so each brings its production desktop layout.
export default function ProteinLp() {
  const products = useProducts();
  const variants = useMemo(() => lpVariants(products), [products]);

  return (
    <>
      {/* TODO(lift): fake cart — count stays 0 */}
      <HeaderV2 navItems={NAV_ITEMS} logoSrc="Logo.png" />
      <main>
        <Hero
          rating={LP_RATING}
          headlineLine1={HERO.headlineLine1}
          headlineTagline={HERO.headlineTagline}
          subheadline={HERO.subheadline}
          bullets={HERO.bullets}
          heroImage={HERO.desktopImage}
          heroImageMobile={HERO.image}
          heroImageMobileSize={{ width: 1572, height: 1664 }}
          backgroundColor={LP_GREEN}
          ctaLabel={HERO.ctaLabel}
          ctaHref={HERO.ctaHref}
        />
        <BelowHeroUsp headline={FOUNDATION.headline} subheadline={FOUNDATION.body} image={FOUNDATION.image} />
        <BundleSection
          kicker={BUNDLE.kicker}
          name={BUNDLE.name}
          headline={BUNDLE.headline}
          subheadline={BUNDLE.subheadline}
          avgProtein={BUNDLE.avgProtein}
          avgFibre={BUNDLE.avgFibre}
          avgKcal={BUNDLE.avgKcal}
          boxHeadline={BUNDLE.boxHeadline}
          variants={variants}
          defaultVariantId={BUNDLE.defaultVariantId}
          reviews={REVIEWS}
          rating={LP_RATING}
          backgroundColor={LP_GREEN}
        />
        <RoutineComponent
          eyebrow={ROUTINE.eyebrow}
          headline={<Headline {...ROUTINE.headline} />}
          slides={ROUTINE.slides}
          pillars={ROUTINE.pillars}
          markerColor={LP_GREEN}
        />
        <FrozenIngredientsComponent
          eyebrow={INGREDIENTS.eyebrow}
          headline={<Headline {...INGREDIENTS.headline} />}
          body={INGREDIENTS.body}
          summerNote={INGREDIENTS.note}
          posterImage={INGREDIENTS.image}
        >
          <ExpertReviewsCarouselV2 title={INGREDIENTS.experts.title} experts={INGREDIENTS.experts.experts} embedded />
        </FrozenIngredientsComponent>
        <FeaturedByComponent headline={RETAILERS.headline} logos={RETAILERS.logos} narrow={false} />
        <FaqComponent eyebrow={FAQ.eyebrow} headline={<Headline {...FAQ.headline} />} items={FAQ.items} narrow={false} />
        <GlobalSubscribeSectionV2
          strapline={NEWSLETTER.strapline}
          title={<Headline {...NEWSLETTER.headline} />}
          subtitle={NEWSLETTER.body}
          footnote={NEWSLETTER.footnote}
          placeholder={NEWSLETTER.placeholder}
          submitLabel={NEWSLETTER.submitLabel}
          backgroundColor={LP_NEWSLETTER_GREEN}
          narrow={false}
        />
      </main>
      {/* The design's footer rating is 4.46 */}
      <Footer {...FOOTER} rating={{ average: 4.46 }} />
      <BundleStickyBar label={STICKY.label} footnote={STICKY.footnote} backgroundColor={LP_GREEN} hideOnDesktop={false} />
    </>
  );
}
