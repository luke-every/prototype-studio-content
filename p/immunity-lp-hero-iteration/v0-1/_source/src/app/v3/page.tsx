import { BelowHeroUsp } from "@/components/website/BelowHeroUsp";
import { HeroV3 } from "@/components/website/HeroV3";
import { PromoBar } from "@/components/website/PromoBar";
import { ResultsNav } from "@/components/website/ResultsNav";
import { NAV_ITEMS } from "@/lib/site-chrome-sample";
import { FOUNDATION, HERO, LP_RATING } from "@/lib/lp-protein-sample";

const V3_BUNDLE = "#F6A27C";

export default function ProteinLpV3() {
  return (
    <div className="relative bg-white" style={{ "--bundle": V3_BUNDLE } as React.CSSProperties}>
      {/* TODO(lift): fake cart — count stays 0. TODO(lift): replace with translation key */}
      <ResultsNav
        light
        navItems={NAV_ITEMS}
        logoSrc="/Logo.png"
        banner={<PromoBar emoji="🍂" text="20% off your first order + free every tote bag" paddingClassName="pt-2.5 pb-2.5" backgroundClassName="bg-dark" />}
      />
      <main>
        <HeroV3
          rating={LP_RATING}
          headlineLine1={HERO.headlineLine1}
          headlineTagline={HERO.headlineTagline}
          subheadline={HERO.subheadline}
          bullets={HERO.bullets}
          image="/img/lp/hero-autumn-v3.png"
          imageSize={{ width: 780, height: 528 }}
          ctaLabel={HERO.ctaLabel}
          ctaHref={HERO.ctaHref}
        />
        <BelowHeroUsp headline={FOUNDATION.headline} subheadline={FOUNDATION.body} image={FOUNDATION.image} />
      </main>
    </div>
  );
}
