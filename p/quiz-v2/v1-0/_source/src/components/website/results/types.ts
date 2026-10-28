import type { Answers } from "../quiz/types";
import type { HeadlineAngle } from "./framing";



export type BoxSize = {
  n: number;
  per: string;
  total: string;
  was: string;
  disc: string;
  qty: string;
  /** Label under the number, MEALS unless stated */
  label?: string;
  /** Third line on the pill; the generic one for its position when absent */
  tagline?: string;
  popular?: boolean;
};

export type BoxBreakdown = {
  note?: string;
  gift?: string;
  /** One list for the box, or one per size pill */
  items?: string[][];
  addon?: { name: string; price: string; image: string };
};

/** A dish in a rail or the grid: [name, image, slug, quantity in the box] */
export type MenuItem = {
  name: string;
  image: string;
  slug: string;
  qty: number;
};

export type Product = {
  name: string;
  image: string;
  /** The Shopify SKU, which is how the recommendation engine knows the dish. Empty when Storyblok has none */
  sku: string;
  /** Portion weight in grams, when Storyblok has it */
  weight: number | null;
  /** A meal counts towards "N meals"; smoothies, snacks and breakfast do not */
  meal: boolean;
  description: string;
  /** Storyblok's one-line description, what the recipe leads with; empty on a few products */
  shortDescription: string;
  macros: [string | null, string][];
  /** Per portion, from the nutrition table's energy row */
  kcal: string | null;
  /** The highlights as ingredient and why it's there, for the recipe's key-ingredient cards */
  keyIngredients: { name: string; text: string }[];
  ingredients: string;
  nutrition: string;
  preparation: string;
  highlights: string;
  tags: string[];
  /** The recipe modal's tags: the bundle test's curated set, at most 10 in a fixed order (see lib/meals/curatedTags) */
  curatedTags: string[];
  /** "No garlic" and the like, shown under the ingredients; soy and gluten are left to the curated tags */
  withoutTags: string[];
};

export type Products = Record<string, Product>;


/** What every results page variant receives from the quiz sheet */
export type ResultsPageProps = {
  answers: Answers;
  products: Products | null;
  /** The sheet is showing its results chrome: the navigation has arrived */
  chrome: boolean;
  /** The loader has cleared: the hero's elements arrive */
  revealed: boolean;
  /** Arrived without a loader, so nothing animates in */
  instant: boolean;
  cartCount: number;
  onAdd: (meals: number) => void;
  /** Opens the shared recipe sheet for a product by its Storyblok slug */
  onOpenRecipe: (item: MenuItem) => void;
  /** Which sentence A says in the hero (review harness only) */
  angle?: HeadlineAngle;
  /** A sheet of the page's own is up, so Esc is its to take, not the quiz sheet's */
  onPickerChange: (open: boolean) => void;
  onLogo: () => void;
};
