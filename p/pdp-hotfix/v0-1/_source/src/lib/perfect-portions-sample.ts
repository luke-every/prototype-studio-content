import type { NavItem } from "@/components/website/nav-types";
import type { BundleSwitchItem, BundleVariant, VariantConfiguration } from "@/components/website/bundle-v3/types";
import { railsFor } from "@/lib/box-menu";
import type { Products } from "@/lib/storyblok-products";

// TODO(lift): sample data — replace with prices from Shopify / Eversubs (figures from the quiz's PLANS.portions)
const BOX: VariantConfiguration = {
  bundlePrice: 236.75,
  mealCount: 20,
  amountOffPerBundle: 50,
  promoPercent: 20,
  amountOffFromPromo: 37.35,
  bundleDiscountedPrice: 149.4,
  mealDiscountedPrice: 7.47,
};

/** The two make-ups of the one 20-meal box. Indexes match BOX_CONTENTS.portions. */
export const PORTIONS_BOXES: { id: number; label: string; badge?: string }[] = [
  { id: 0, label: "Starter" },
  { id: 1, label: "Complete", badge: "Most popular" },
];

const num = (value: string | null | undefined): number | undefined => {
  const n = parseFloat(String(value ?? "").replace(",", "."));
  return Number.isNaN(n) ? undefined : n;
};

/** Variants with each box's meals read from the live products. Meals stay empty until `products` loads. */
export function portionsVariants(products: Products | null): BundleVariant[] {
  return PORTIONS_BOXES.map((box) => ({
    ...box,
    config: BOX,
    meals: (railsFor("portions", products, box.id) ?? [])
      .flatMap((rail) => rail.items)
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
        };
      }),
  }));
}

// TODO(lift): sample data — replace with the bundle copy from the CMS (quiz BUNDLE_NAME / BUNDLE_SUB)
export const PERFECT_PORTIONS = {
  name: "The Perfect Portions Plan",
  headline: "Perfect portions, zero guesswork.",
  mealsKicker: "THE PERFECT PORTIONS PLAN",
  mealsHeadline: { lead: "Delicious meals, ", italic: "perfectly portioned." },
  subheadline:
    "Lose weight without counting, weighing or tracking. Every meal, breakfast and snack is pre-portioned, balanced and rich in protein and fibre to keep you satisfied. Enjoy a variety of everyday favourites, from pasta to rice dishes.",
  // TODO(lift): sample data — replace with the live reviews.io rating
  rating: { label: "Excellent", average: 4.4 },
  backgroundColor: "#F2E5F4",
  bullets: ["Delivered frozen to your door", "Ready in under 10 minutes", "Flexible plan: Skip or cancel anytime"],
  ctaFootnote: "Only 5,51 € / meal · Skip or cancel anytime",
  heroImage: "/img/hero-portions.png",
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
