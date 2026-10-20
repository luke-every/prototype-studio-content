import type { BundleSwitchItem, BundleVariant, VariantConfiguration } from "@/components/website/bundle-v3/types";
import { mealDetailsFromProduct } from "@/lib/bundle-meal-details";
import { railsFor } from "@/lib/box-menu";
import type { Products } from "@/lib/storyblok-products";

// TODO(lift): sample data — replace with prices from Shopify / Eversubs
const BOXES: { id: number; label: string; badge?: string; config: VariantConfiguration }[] = [
  {
    id: 0,
    label: "Starter",
    config: { bundlePrice: 124.85, mealCount: 12, amountOffPerBundle: 20, promoPercent: 20, amountOffFromPromo: 20.97, bundleDiscountedPrice: 83.88, mealDiscountedPrice: 6.99 },
  },
  {
    id: 1,
    label: "Complete",
    badge: "Most popular",
    config: { bundlePrice: 160.8, mealCount: 16, amountOffPerBundle: 35, promoPercent: 20, amountOffFromPromo: 25.16, bundleDiscountedPrice: 100.64, mealDiscountedPrice: 6.29 },
  },
  {
    id: 2,
    label: "Max",
    config: { bundlePrice: 197.25, mealCount: 20, amountOffPerBundle: 50, promoPercent: 20, amountOffFromPromo: 29.45, bundleDiscountedPrice: 117.8, mealDiscountedPrice: 5.89 },
  },
];

/** Variants with each box's meals read from the live products. Meals stay empty until `products` loads. */
export function proteinVariants(products: Products | null): BundleVariant[] {
  return BOXES.map((box) => ({
    ...box,
    meals: (railsFor("protein", products, box.id) ?? [])
      .flatMap((rail) => rail.items)
      .map((item) => ({
        id: item.slug,
        handle: item.slug,
        title: item.name,
        image: item.image,
        ...mealDetailsFromProduct(products?.[item.slug]),
        qty: item.qty,
      })),
  }));
}

// TODO(lift): sample data — copied from the live protein-bundle-v2 story; replace with the bundle copy from the CMS
export const PROTEIN_BUNDLE = {
  name: "The Protein Bundle",
  headline: "The Protein Bundle",
  mealsKicker: "THE PROTEIN BUNDLE",
  mealsHeadline: { lead: "Our most protein-packed ", italic: "meals." },
  subheadline:
    "Eating high-protein doesn't mean cooking the same three dishes every week. The Protein Bundle packs our most protein-rich meals: satisfying, full of flavour and with an average of 26 g plant-based protein per dish.",
  // TODO(lift): sample data — replace with the live reviews.io rating
  rating: { label: "Excellent", average: 4.5 },
  backgroundColor: "#CDE8F7",
  bullets: ["Delivered frozen to your door", "Ready in under 10 minutes", "Flexible plan: Skip or cancel anytime"],
  heroImage: "https://a.storyblok.com/f/291086118523370/2944x1344/808791ae9a/protein-hero-desktop.png",
  heroImageMobile: "https://a.storyblok.com/f/291086118523370/1572x1664/9eaa290502/protein-hero-mobile.png",
  ctaFootnote: "5,89 € / meal · Skip or cancel anytime",
  avgProtein: "26",
  avgFibre: "11",
  avgKcal: "500",
  switchItems: [
    { id: "a", label: "The Immunity Bundle", color: "#FFC273" },
    { id: "b", label: "The Postpartum Bundle", color: "#F8E8B7" },
    { id: "c", label: "The Perfect Portions Plan", color: "#FFE0C2" },
  ] satisfies BundleSwitchItem[],
};
