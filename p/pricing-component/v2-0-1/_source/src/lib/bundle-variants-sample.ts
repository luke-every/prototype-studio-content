import type { Gift } from "@/components/website/lp/BundlePriceBreakdown";
import type { BundleVariant } from "@/components/website/bundle-v3/types";

const r2 = (n: number): number => Math.round(n * 100) / 100;

// TODO(lift): sample data — prices; replace with Shopify / Eversubs. List price = per-meal list price × meals, then quantity discount (10% / 15% / 20%), then 15% first-box promo (of list price).
function box(id: number, mealCount: number, listPerMeal: number, badge?: string): BundleVariant {
  const bundlePrice = r2(mealCount * listPerMeal);
  const qtyPercent = mealCount >= 20 ? 20 : mealCount >= 15 ? 15 : 10;
  const amountOffPerBundle = r2((bundlePrice * qtyPercent) / 100);
  const amountOffFromPromo = r2(bundlePrice * 0.15);
  const bundleDiscountedPrice = r2(bundlePrice - amountOffPerBundle - amountOffFromPromo);
  return {
    id,
    label: `${mealCount} meals`,
    badge,
    config: { bundlePrice, mealCount, amountOffPerBundle, promoPercent: 15, amountOffFromPromo, bundleDiscountedPrice, mealDiscountedPrice: r2(bundleDiscountedPrice / mealCount) },
    meals: [],
  };
}

type BundleVariantSample = {
  slug: string;
  title: string;
  heading: { lead: string; italic?: string };
  backgroundColor: string;
  variants: BundleVariant[];
  gifts?: Gift[];
  includes?: string[];
};

const SIZE_HEADING = { lead: "Choose your ", italic: "box size" };

// TODO(lift): sample data — bundle colours, copy and gifts come from the CMS
export const BUNDLE_VARIANT_SAMPLES: BundleVariantSample[] = [
  {
    slug: "perfect",
    title: "The Perfect Portions Plan",
    heading: SIZE_HEADING,
    backgroundColor: "#f2e5f4",
    variants: [box(0, 12, 241.75 / 22), box(1, 22, 241.75 / 22, "POPULAR")],
    gifts: [{ name: "2x Daily Greens Smoothies", image: "/img/gifts/greens-smoothies.png", listPrice: 10.99 }],
  },
  {
    slug: "immunity",
    title: "The Immunity Bundle",
    heading: SIZE_HEADING,
    backgroundColor: "#f6d3c0",
    variants: [box(0, 12, 139.85 / 20), box(1, 15, 139.85 / 20, "POPULAR"), box(2, 20, 139.85 / 20)],
    gifts: [
      { name: "1x Ginger Cubes Pack", image: "/img/gifts/ginger-cubes.png", listPrice: 10.99 },
      { name: "1x every Tote Bag", image: "/img/gifts/tote-bag.png", listPrice: 9.95 },
    ],
  },
  {
    slug: "postpartum",
    title: "The Postpartum Bundle",
    heading: { lead: "What’s in your box?" },
    backgroundColor: "#fbf4dd",
    variants: [box(0, 16, 210.47 / 16)],
    includes: ["16 meals for lunch or dinner", "6 Smoothies (2 × Green, 2 × Pitaya, 2 × Mango)", "1 Pistachio Pecan Granola", "4 Snack Balls", "6 Snack Crumbles"],
  },
];
