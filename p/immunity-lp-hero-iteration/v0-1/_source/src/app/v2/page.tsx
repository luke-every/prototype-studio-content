import { BelowHeroUsp } from "@/components/website/BelowHeroUsp";
import { Hero } from "@/components/website/Hero";
import { PromoBar } from "@/components/website/PromoBar";
import { ResultsNav } from "@/components/website/ResultsNav";
import { NAV_ITEMS } from "@/lib/site-chrome-sample";
import { FOUNDATION, HERO, LP_GREEN, LP_RATING } from "@/lib/lp-protein-sample";

export default function ProteinLpV2() {
  return (
    <div className="relative bg-white" style={{ "--bundle": LP_GREEN } as React.CSSProperties}>
      {/* TODO(lift): fake cart — count stays 0. TODO(lift): replace with translation key */}
      <ResultsNav navItems={NAV_ITEMS} logoSrc="/Logo.png" bannerBelow banner={<PromoBar emoji="🍂" text="20% off your first order + free every tote bag" paddingClassName="pt-2 pb-3" />} />
      <main>
        <div className="relative bg-white">
          {/* dark ground only behind the hero's top corners */}
          <div className="absolute inset-x-0 top-0 h-8 bg-[color-mix(in_srgb,black_80%,var(--bundle))]" />
          <div className="relative overflow-hidden rounded-t-[32px]">
            <Hero
              rating={LP_RATING}
              headlineLine1={HERO.headlineLine1}
              headlineTagline={HERO.headlineTagline}
              taglineAnimation
              subheadline={HERO.subheadline}
              bullets={HERO.bullets}
              heroImage={HERO.desktopImage}
              heroImageMobile={HERO.image}
              heroImageMobileSize={{ width: 780, height: 604 }}
              backgroundColor={LP_GREEN}
              ctaLabel={HERO.ctaLabel}
              ctaHref={HERO.ctaHref}
            />
          </div>
        </div>
        <BelowHeroUsp headline={FOUNDATION.headline} subheadline={FOUNDATION.body} image={FOUNDATION.image} />
      </main>
    </div>
  );
}
