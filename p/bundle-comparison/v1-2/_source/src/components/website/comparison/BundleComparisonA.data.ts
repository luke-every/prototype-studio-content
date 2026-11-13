/** The comparable facts per bundle, all from real sources (see notes on each line). Image, title and tile colour come from bundles.ts. */
export type BundleFacts = {
  /** Matches `key` in bundles.ts. */
  key: string;
  /** The value prop, as a headline. */
  headline: string;
  /** Average per meal, meals only (no add-ons). */
  protein: number;
  kcal: number;
  /** Breakfasts and snacks come in the box as well as main meals. */
  allDay: boolean;
  /** Free extra in the first box, if any. */
  extra?: { name: string; image: string };
};

// TODO(lift): sample data — replace with Storyblok bundle fields and the nutrition fact sheet.
// Sources, read 10 Nov 2026:
// - Storyblok CDN (content_type=bundle): products/protein-bundle-v2, products/immunity-bundle, products/perfect-portions-plan-v2, products/postpartum-bundle-v2, plus their bundle_variant stories
// - Notion "Bundle Macros Audit" (24 Sep 2026): per-meal averages from the product fact sheet, meals only
// - Notion "Bundles Overview Page": compare who it's for, nutrition, meal types and gifts; leave out price and box size
export const FACTS: BundleFacts[] = [
  {
    key: "immunity",
    // Storyblok immunity-bundle description_v2: "wholesome, warming meals"
    headline: "Warming meals for the colder months",
    // Storyblok immunity-bundle hero + editorial_text: "21 g of protein"; avg_kcal 500 (not in the fact-sheet audit)
    protein: 21,
    kcal: 500,
    allDay: false,
    // Storyblok immunity-bundle description_v2: "a week's supply of 7 FREE immunity shots with ginger, vitamin A & vitamin C"
    extra: { name: "7 ginger shots", image: "/img/gift-ginger-cubes.png" },
  },
  {
    key: "protein",
    // Storyblok protein-bundle-v2 editorial_public_title_v2
    headline: "Our most protein-packed meals",
    // Macros Audit: 25.6 g protein, 513 kcal per meal
    protein: 26,
    kcal: 513,
    // Shopify bundle description: protein-rich main dishes only
    allDay: false,
    // No current free extra found in Storyblok (the popsicle line in its description is leftover summer copy)
  },
  {
    key: "body-balance",
    // Storyblok perfect-portions-plan-v2 editorial_public_title_v2
    headline: "Delicious meals, perfectly portioned",
    // Macros Audit: 19.8 g protein, 468 kcal per meal (live page shows 450)
    protein: 20,
    kcal: 468,
    // Storyblok variant "Perfect Portions Plan Complete": 20 meals, 20 breakfasts, 10 snack balls and crumbles
    allDay: true,
    // Same variant: "2 FREE Green Smoothies"
    extra: { name: "2 green smoothies", image: "/img/gift-smoothie.png" },
  },
  {
    key: "new-parent",
    // Prototype copy, not from Storyblok: the live title ("Everyone asks about the baby. This one's for you") doesn't say what the bundle is
    headline: "Nourishing meals for recent parents",
    // Macros Audit: 19.7 g protein, 507 kcal per meal (live page shows 23 g / 450)
    protein: 20,
    kcal: 507,
    // Storyblok variant "Wochenbett Bundle": 16 meals + 14 breakfasts + 10 snacks
    allDay: true,
  },
];
