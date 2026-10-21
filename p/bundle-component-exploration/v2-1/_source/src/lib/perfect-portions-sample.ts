import type { NavItem } from "@/components/website/nav-types";
import type { BundleSwitchItem, BundleVariant, VariantConfiguration } from "@/components/website/bundle-v3/types";
import { railsFor } from "@/lib/box-menu";
import type { Products } from "@/lib/storyblok-products";

// TODO(lift): sample data — replace with prices from Shopify / Eversubs. Only the per-meal price is known, so the box total is meals × price and there is no discount breakdown.
const boxConfig = (mealCount: number, mealPrice: number): VariantConfiguration => {
  const total = Math.round(mealCount * mealPrice * 100) / 100;
  return { bundlePrice: total, mealCount, amountOffPerBundle: 0, promoPercent: 0, amountOffFromPromo: 0, bundleDiscountedPrice: total, mealDiscountedPrice: mealPrice };
};

/** The two make-ups of the plan. Indexes match BOX_CONTENTS.portions. */
export const PORTIONS_BOXES: { id: number; label: string; config: VariantConfiguration; badge?: string; isDefault?: boolean }[] = [
  { id: 0, label: "Perfect Portions Plan Starter", config: boxConfig(20, 6.01) },
  { id: 1, label: "Perfect Portions Plan Complete", config: boxConfig(22, 6.28), badge: "Most popular", isDefault: true },
];

const num = (value: string | null | undefined): number | undefined => {
  const n = parseFloat(String(value ?? "").replace(",", "."));
  return Number.isNaN(n) ? undefined : n;
};

/** Variants with each box's meals read from the live products. Meals stay empty until `products` loads. */
export function portionsVariants(products: Products | null): BundleVariant[] {
  return PORTIONS_BOXES.map((box) => ({
    ...box,
    meals: (railsFor("portions", products, box.id) ?? [])
      .flatMap((rail) => rail.items.map((item) => ({ ...item, section: rail.heading })))
      // Main meals first; breakfast and snacks (the add-ons) follow, in their usual order. Array.sort is stable.
      .sort((a, b) => Number(a.section !== "Main meals") - Number(b.section !== "Main meals"))
      .map((item) => {
        const product = products?.[item.slug];
        const macro = (label: string): number | undefined => num(product?.macros.find(([, l]) => l === label)?.[0]);
        return {
          id: item.slug,
          handle: item.slug,
          title: item.name,
          image: item.image,
          ingredients: product?.ingredients.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
          protein: macro("PROTEIN"),
          fibre: macro("FIBRE"),
          kcal: num(product?.kcal),
          qty: item.qty,
          section: item.section,
          base: product?.base ?? undefined,
          keyIngredients: product?.keyIngredients,
        };
      }),
  }));
}

// TODO(lift): sample data — replace with the bundle copy from the CMS (quiz BUNDLE_NAME / BUNDLE_SUB)
export const PERFECT_PORTIONS = {
  name: "The Perfect Portions Plan",
  headline: { lead: "The Perfect Portions Plan: ", italic: "Pre-portioned meals to reach your goals." },
  mealsKicker: "THE PERFECT PORTIONS PLAN",
  mealsHeadline: { lead: "Delicious meals, ", italic: "perfectly portioned." },
  subheadline:
    "Chef-crafted, well-balanced meals built on legumes, vegetables and whole grains. Pre-portioned, delivered frozen, ready in under 10 minutes.",
  // TODO(lift): sample data — replace with the live reviews.io rating
  rating: { label: "Excellent", average: 4.5 },
  backgroundColor: "#F2E5F4",
  bullets: ["Ø 21g plant protein per meal", "Ø 12g fibre to keep you full", "Flexible plan: Skip or cancel anytime"],
  // Paths into public/ are relative (no leading slash): the studio serves this from a sub-path, so "/img/…" would miss.
  heroImage: "img/hero-landing.jpg",
  avgProtein: "20",
  avgFibre: "9",
  avgKcal: "500",
  switchItems: [
    { id: "a", label: "The Perfect Portions Plan", color: "#F2E5F4" },
    { id: "b", label: "The Back to Better Bundle", color: "#FFC273" },
    { id: "c", label: "The Postpartum Bundle", color: "#F8E8B7" },
    { id: "d", label: "The Protein Bundle", color: "#D0E9C0" },
  ] satisfies BundleSwitchItem[],
};

// TODO(lift): sample data — replace with the header's nav from the CMS
export const NAV_ITEMS: NavItem[] = [
  { label: "Bundles", href: "#", items: PERFECT_PORTIONS.switchItems.map((i) => ({ label: i.label, href: "#" })) },
  { label: "All meals", href: "#" },
  { label: "How it works", href: "#" },
  { label: "About", href: "#" },
];
