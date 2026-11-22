import type { BundleSwitchItem, BundleVariant, VariantConfiguration } from "@/components/website/bundle-v3/types";
import { mealDetailsFromProduct } from "@/lib/bundle-meal-details";
import { railsFor } from "@/lib/box-menu";
import type { Products } from "@/lib/storyblok-products";
import { COPY } from "@/lib/copy";

// TODO(lift): sample data — replace with prices from Shopify / Eversubs
const BOXES: { id: number; label: string; badge?: string; config: VariantConfiguration }[] = [
  {
    id: 0,
    label: COPY.boxes[0].label,
    config: { bundlePrice: 124.85, mealCount: 12, amountOffPerBundle: 20, promoPercent: 20, amountOffFromPromo: 20.97, bundleDiscountedPrice: 83.88, mealDiscountedPrice: 6.99 },
  },
  {
    id: 1,
    label: COPY.boxes[1].label,
    badge: COPY.boxes[1].badge,
    config: { bundlePrice: 160.8, mealCount: 16, amountOffPerBundle: 35, promoPercent: 20, amountOffFromPromo: 25.16, bundleDiscountedPrice: 100.64, mealDiscountedPrice: 6.29 },
  },
  {
    id: 2,
    label: COPY.boxes[2].label,
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
  name: COPY.proteinBundle.name,
  headline: COPY.proteinBundle.headline,
  mealsKicker: COPY.proteinBundle.mealsKicker,
  mealsHeadline: { lead: COPY.proteinBundle.mealsHeadline.lead, italic: COPY.proteinBundle.mealsHeadline.italic },
  subheadline:
    COPY.proteinBundle.subheadline,
  // TODO(lift): sample data — replace with the live reviews.io rating
  rating: { label: COPY.proteinBundle.rating.label, average: 4.5 },
  backgroundColor: "#D7EBC2",
  bullets: [COPY.proteinBundle.bullets[0], COPY.proteinBundle.bullets[1], COPY.proteinBundle.bullets[2]],
  heroImage: COPY.images.proteinBundle.heroImage,
  heroImageMobile: COPY.images.proteinBundle.heroImageMobile,
  ctaFootnote: COPY.proteinBundle.ctaFootnote,
  avgProtein: "26",
  avgFibre: "11",
  avgKcal: "500",
  switchItems: [
    { id: "a", label: COPY.proteinBundle.switchItems[0].label, color: "#FFC273" },
    { id: "b", label: COPY.proteinBundle.switchItems[1].label, color: "#F8E8B7" },
    { id: "c", label: COPY.proteinBundle.switchItems[2].label, color: "#FFE0C2" },
  ] satisfies BundleSwitchItem[],
};
