/**
 * Every user-facing string on the bundle comparison, in one place, in the order the copy doc lists them. The copy doc (a Claude doc) is filled from this file and its approved changes are written back here.
 * `en` is the live English. `de` is the German, left out until it has been written. `where` says which screen and element the string is on, for the copywriter.
 * Keys read as area.thing and are the translation keys for production. `{price}` style placeholders are filled in by the component.
 * Visible text only: aria-labels are not here yet.
 */
export type CopyEntry = { en: string; de?: string; where: string };

const entries = {
  // 1. Page intro
  "intro.heading": { en: "Discover our bundles", where: "Heading above the four bundle cards" },
  "intro.body": { en: "All of our meals are 100% plant-based, chef-designed and nutritionist-checked, then delivered frozen and ready in under 10 minutes.", where: "Line under the heading" },

  // 2. Immunity card
  "bundle.immunity.name": { en: "Immunity Bundle", where: "Name, the tag at the top of the card (also used in the navigation)" },
  "bundle.immunity.headline": { en: "Warming meals for the colder months", where: "Headline under the picture" },
  "bundle.immunity.firstPoint": { en: "Immunity support", where: "First point, before the price" },
  "bundle.immunity.includesTitle": { en: "Includes main meals & cold-pressed shots", where: "What's included: title" },
  "bundle.immunity.includesText": { en: "Free ginger shot cubes with vitamin A and C, plus an every tote bag.", where: "What's included: line under the title" },

  // 3. Protein card
  "bundle.protein.name": { en: "Protein Bundle", where: "Name, the tag at the top of the card (also used in the navigation)" },
  "bundle.protein.headline": { en: "Our most protein-packed meals", where: "Headline under the picture" },
  "bundle.protein.firstPoint": { en: "Ø 26 g protein /meal", where: "First point, before the price" },
  "bundle.protein.includesTitle": { en: "Includes main meals", where: "What's included: title" },
  "bundle.protein.includesText": { en: "Free Planted. Pulled Protein packs and Boonian Crumble to boost protein intake.", where: "What's included: line under the title" },

  // 4. Body Balance card
  "bundle.body-balance.name": { en: "Body Balance Bundle", where: "Name, the tag at the top of the card (also used in the navigation)" },
  "bundle.body-balance.headline": { en: "Delicious meals, perfectly portioned", where: "Headline under the picture" },
  "bundle.body-balance.firstPoint": { en: "Ø 468 kcal /meal", where: "First point, before the price" },
  "bundle.body-balance.includesTitle": { en: "Includes a full routine", where: "What's included: title" },
  "bundle.body-balance.includesText": { en: "Main meals, plus porridge, muesli and smoothies to start the day. Raw cake bites for in between.", where: "What's included: line under the title" },

  // 5. Postpartum card
  "bundle.new-parent.name": { en: "Postpartum Bundle", where: "Name, the tag at the top of the card (also used in the navigation)" },
  "bundle.new-parent.headline": { en: "Nourishing meals for recent parents", where: "Headline under the picture" },
  "bundle.new-parent.firstPoint": { en: "All mealtimes covered", where: "First point, before the price" },
  "bundle.new-parent.includesTitle": { en: "Includes a full routine", where: "What's included: title" },
  "bundle.new-parent.includesText": { en: "Main meals, plus a mix of smoothies, breakfast granola, and a variety of snack balls and crumbles.", where: "What's included: line under the title" },

  // 6. Shared by all four cards
  "card.pricePoint": { en: "From {price} /meal", where: "Price, after the first point. Keep {price}, the page fills it in" },
  "card.nutritionProtein": { en: "Ø Protein", where: "Nutrition tile label" },
  "card.nutritionFibre": { en: "Ø Fibre", where: "Nutrition tile label" },
  "card.nutritionKcal": { en: "Ø kcal", where: "Nutrition tile label" },
  "card.seeDetails": { en: "See more details", where: "Link that opens the details" },
  "card.hideDetails": { en: "Hide details", where: "Link that closes the details" },
  "card.continue": { en: "Continue", where: "Button at the bottom of the card" },
  "card.currentBundle": { en: "Current bundle", where: "Button on the bundle you are already on (compare sheet only)" },

  // 7. Navigation
  "bundle.immunity.navLine": { en: "Vitamins for colder months", where: "Immunity card, line under the name" },
  "bundle.protein.navLine": { en: "More protein in every meal", where: "Protein card, line under the name" },
  "bundle.body-balance.navLine": { en: "Calorie-conscious meals", where: "Body Balance card, line under the name" },
  "bundle.new-parent.navLine": { en: "Nourishing, for new parents", where: "Postpartum card, line under the name" },
  "nav.exploreAll": { en: "Explore all bundles", where: "Last tile, title (also the button on the product page)" },
  "nav.exploreAllLine": { en: "Compare the details", where: "Last tile, line under the title (desktop)" },

  // 8. Quiz and build your own box
  "quiz.title": { en: "Unsure where to start?", where: "Quiz card and the sticky quiz bar, title" },
  "quiz.line": { en: "Get matched in 30s with our quiz", where: "Quiz card and the sticky quiz bar, line under the title" },
  "quiz.mini": { en: "Take our quiz and find your bundle", where: "Sticky quiz bar on a short viewport, replaces the title and line" },
  "quiz.button": { en: "Take the quiz", where: "Quiz card, button" },
  "build.title": { en: "Build your own box", where: "Build your own card, title" },
  "build.line": { en: "Find your perfect fit with over 30+ meals", where: "Build your own card, line under the title" },
  "build.button": { en: "Choose my meals", where: "Build your own card, button" },

  // 9. Product page and compare sheet
  "pdp.otherBundlesPrompt": { en: "Not the right fit? Explore our other bundles", where: "Product page, line above the Explore all bundles button" },
  "compareSheet.heading": { en: "Compare bundles", where: "Heading of the compare sheet" },
} satisfies Record<string, Omit<CopyEntry, "de"> & { de?: string }>;

export type CopyKey = keyof typeof entries;
export const COPY: Record<CopyKey, CopyEntry> = entries;

/** The English for one string. Switch to the German here when the prototype gets a language control. */
export function copy(key: CopyKey): string {
  return COPY[key].en;
}

export type BundleCopyField = "name" | "headline" | "firstPoint" | "includesTitle" | "includesText" | "navLine";

/** The string for one field of one bundle (key from bundles.ts). */
export function bundleCopy(bundleKey: string, field: BundleCopyField): string {
  return copy(`bundle.${bundleKey}.${field}` as CopyKey);
}
