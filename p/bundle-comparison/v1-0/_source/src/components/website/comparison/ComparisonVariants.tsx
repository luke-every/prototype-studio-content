"use client";

import { Footer } from "@/components/website/Footer";
import { HeaderV2 } from "@/components/website/HeaderV2";
import type { NavItem } from "@/components/website/nav-types";
import { NAV_ITEMS } from "@/lib/nav-sample";
import { FOOTER } from "@/lib/site-chrome-sample";
import { useControl } from "@/lib/studio-controls";
import { BundleComparison } from "./BundleComparison";
import { BundleComparisonA } from "./BundleComparisonA";
import { BundleComparisonE } from "./BundleComparisonE";
import { BundleComparisonF } from "./BundleComparisonF";
import { BundleComparisonH } from "./BundleComparisonH";
import { BundleMenuGrid } from "./BundleMenuGrid";
import { BundleMenuGridI } from "./BundleMenuGridI";
import { BundleMenuPager } from "./BundleMenuPager";
import { BundleMenuRows } from "./BundleMenuRows";
import { BundleOverview } from "./BundleOverview";

// The mobile menu's Bundles dropdown (open by default) shows bundle cards instead of text links: F and L stack them in a grid, G pages through them.
// On desktop the same cards drop down on hover, side by side.
const withBundles = (panel: NavItem["panel"], megaPanel: NavItem["megaPanel"]): NavItem[] =>
  NAV_ITEMS.map((item) => (item.label === "Bundles" ? { ...item, panel, megaPanel, defaultOpen: true } : item));
// A and B: the same rows in the mobile menu and the desktop dropdown.
const NAV_ROWS = withBundles(<BundleMenuRows />, <BundleMenuRows />);
const NAV_F = withBundles(<BundleMenuGrid />, <BundleMenuGrid columns={4} />);
const NAV_G = withBundles(<BundleMenuPager />, <BundleMenuPager desktop />);
const NAV_L = withBundles(<BundleMenuGridI />, <BundleMenuGridI columns={4} />);

/** Picks the design variation from the studio "variant" control: A, B and PDP. */
export function ComparisonVariants() {
  const design = useControl("variant");
  const variant = design;
  return (
    <>
      <HeaderV2 navItems={variant === "f" ? NAV_F : variant === "g" ? NAV_G : variant === "l" ? NAV_L : variant === "a" || variant === "b" ? NAV_ROWS : NAV_ITEMS} logoSrc="/Logo.png" overlay={false} />
      <main>
        {variant === "f" || variant === "g" || variant === "l" ? (
          // F, G and L are about the nav: the page body is just a pointer to it.
          <section className="px-4 py-24 text-center">
            <p className="font-sans text-base leading-[22px] tracking-[-0.32px] text-light-text">
              <span className="lg:hidden">Open the mobile menu to see the bundles.</span>
              <span className="hidden lg:inline">Hover over Bundles in the navigation to see them.</span>
            </p>
          </section>
        ) : variant === "b" ? (
          <BundleOverview layout="swipe" />
        ) : variant === "c" ? (
          <BundleComparisonF key="c" cards="overview" />
        ) : variant === "d" ? (
          <BundleComparisonA />
        ) : variant === "e" ? (
          <BundleComparison mobileLayout="scroll" />
        ) : variant === "h" ? (
          <BundleComparisonE />
        ) : variant === "i" ? (
          <BundleComparisonF key="i" />
        ) : variant === "j" ? (
          <BundleComparison mobileLayout="scroll" lifestyle />
        ) : variant === "k" ? (
          <BundleComparisonH />
        ) : (
          <BundleOverview layout="stacked" />
        )}
      </main>
      {/* A and B: the site footer, with room under it on a phone for the sticky quiz card */}
      {(variant === "a" || variant === "b") && (
        <div className="pb-24 lg:pb-0">
          {/* TODO(lift): sample data — rating comes from Reviews.io */}
          <Footer {...FOOTER} rating={{ average: 4.5 }} />
        </div>
      )}
    </>
  );
}
