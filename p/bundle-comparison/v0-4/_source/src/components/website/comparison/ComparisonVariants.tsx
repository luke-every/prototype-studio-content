"use client";

import { HeaderV2 } from "@/components/website/HeaderV2";
import type { NavItem } from "@/components/website/nav-types";
import { NAV_ITEMS } from "@/lib/nav-sample";
import { useControl } from "@/lib/studio-controls";
import { BundleComparison } from "./BundleComparison";
import { BundleComparisonA } from "./BundleComparisonA";
import { BundleComparisonE } from "./BundleComparisonE";
import { BundleComparisonF } from "./BundleComparisonF";
import { BundleComparisonH } from "./BundleComparisonH";
import { BundleMenuGrid } from "./BundleMenuGrid";
import { BundleMenuGridI } from "./BundleMenuGridI";
import { BundleMenuPager } from "./BundleMenuPager";

// The mobile menu's Bundles dropdown (open by default) shows bundle cards instead of text links: C stacks them in a grid, D pages through them.
// On desktop the same cards drop down on hover, side by side.
const withBundles = (panel: NavItem["panel"], megaPanel: NavItem["megaPanel"]): NavItem[] =>
  NAV_ITEMS.map((item) => (item.label === "Bundles" ? { ...item, panel, megaPanel, defaultOpen: true } : item));
const NAV_C = withBundles(<BundleMenuGrid />, <BundleMenuGrid columns={4} />);
const NAV_D = withBundles(<BundleMenuPager />, <BundleMenuPager desktop />);
const NAV_I = withBundles(<BundleMenuGridI />, <BundleMenuGridI columns={4} />);

/** Picks the design variation from the studio "variant" control (defaults to the current design). */
export function ComparisonVariants() {
  const variant = useControl("variant");
  return (
    <>
      <HeaderV2 navItems={variant === "c" ? NAV_C : variant === "d" ? NAV_D : variant === "i" ? NAV_I : NAV_ITEMS} logoSrc="/Logo.png" overlay={false} />
      <main>
        {variant === "c" || variant === "d" || variant === "i" ? (
          // C, D and I are about the nav: the page body is just a pointer to it.
          <section className="px-4 py-24 text-center">
            <p className="font-sans text-base leading-[22px] tracking-[-0.32px] text-light-text">
              <span className="lg:hidden">Open the mobile menu to see the bundles.</span>
              <span className="hidden lg:inline">Hover over Bundles in the navigation to see them.</span>
            </p>
          </section>
        ) : variant === "e" ? (
          <BundleComparisonE />
        ) : variant === "f" ? (
          <BundleComparisonF />
        ) : variant === "g" ? (
          <BundleComparison mobileLayout="scroll" lifestyle />
        ) : variant === "h" ? (
          <BundleComparisonH />
        ) : variant === "b" ? (
          <BundleComparison mobileLayout="scroll" />
        ) : (
          <BundleComparisonA />
        )}
      </main>
    </>
  );
}
