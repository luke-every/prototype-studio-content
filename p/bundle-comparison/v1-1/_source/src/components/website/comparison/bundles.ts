import type { CSSProperties } from "react";

export type Macro = { protein: number; fibre: number; kcal: number };
export type MacroKey = keyof Macro;
export type Gift = { name: string; image: string };
export type Includes = { breakfast: boolean; mains: boolean; snacks: boolean };

export type Bundle = {
  key: string;
  title: string;
  story: string;
  /** A few words, for tight spaces like the mobile menu cards. */
  shortStory: string;
  image: string;
  /** The newer hero shot (transparent, wider than tall), shown when the studio control "images" is "new". */
  heroImage: string;
  /** Where the product shot sits inside the coloured tile (percentages so it scales with the tile). */
  art: CSSProperties;
  includes: Includes;
  /** How many come in the box, per meal type, as shown to customers (box sizes). Left out where unknown. */
  counts?: Partial<Record<keyof Includes, string>>;
  /** Free gifts that come with the bundle (names only). */
  gifts: Gift[];
  macros: Macro;
  /** The one macro shown when space is tight (the mobile menu cards). */
  keyMacro: MacroKey;
  /** Bundle brand colours, as the CMS would supply them. */
  colors: { tile: string; storyText: string };
};

// TODO(lift): counts: Protein's 12 / 16 / 20 and New Parent's 16 + 14 + 10 come from the Storyblok variants; the same sizes for Immunity and Weight Balance are assumed (confirm)
// TODO(lift): sample data — replace with Storyblok bundles + bundle master data (story, what's included, free gifts, macros per meal, brand colours)
/** The bundle photos are near-square and fill the tile; each box size crops them a little rather than letterboxing. */
const FILL_ART: CSSProperties = { inset: 0 };
export const BUNDLES: Bundle[] = [
  {
    key: "immunity",
    title: "Immunity Bundle",
    story: "Everyday meals with the vitamins you need through the colder months",
    shortStory: "Vitamins for colder months",
    image: "/img/immunity.png",
    heroImage: "/img/heronew/immunity.png",
    art: FILL_ART,
    includes: { breakfast: false, mains: true, snacks: true },
    counts: { mains: "12 / 16 / 20" },
    gifts: [{ name: "Ginger Cubes Pack", image: "/img/gift-ginger-cubes.png" }, { name: "every Tote Bag", image: "/img/gift-tote-bag.png" }],
    macros: { protein: 20, fibre: 13, kcal: 500 },
    keyMacro: "fibre",
    colors: { tile: "rgba(246,162,124,0.24)", storyText: "#cf744b" },
  },
  {
    key: "protein",
    title: "Protein Bundle",
    story: "Filling plant-based meals that fit around a busy week",
    shortStory: "More protein in every meal",
    image: "/img/protein.png",
    heroImage: "/img/heronew/protein.png",
    art: FILL_ART,
    includes: { breakfast: false, mains: true, snacks: false },
    counts: { mains: "12 / 16 / 20" },
    gifts: [{ name: "Planted. Pulled Protein", image: "/img/gift-planted-protein.png" }, { name: "Boonian Crumble Protein", image: "/img/gift-boonian.png" }],
    macros: { protein: 30, fibre: 8, kcal: 550 },
    keyMacro: "protein",
    colors: { tile: "rgba(215,235,194,0.5)", storyText: "#6a8849" },
  },
  {
    key: "body-balance",
    title: "Body Balance Bundle",
    story: "Calorie-conscious meals that make healthy habits easier to keep",
    shortStory: "Calorie-conscious meals",
    image: "/img/perfect.png",
    heroImage: "/img/heronew/body.png",
    art: FILL_ART,
    includes: { breakfast: true, mains: true, snacks: true },
    counts: { mains: "12 / 16 / 20" },
    gifts: [{ name: "Daily Greens Smoothie", image: "/img/gift-smoothie.png" }],
    macros: { protein: 23, fibre: 11, kcal: 499 },
    keyMacro: "kcal",
    // storyText darkened from #b89fbc so the headline on the white card reads as clearly as the others
    colors: { tile: "rgba(242,229,244,0.6)", storyText: "#8e6994" },
  },
  {
    key: "new-parent",
    title: "Postpartum Bundle",
    story: "Nourishing meals and snacks for the busy first months with a baby",
    shortStory: "Nourishing, for new parents",
    image: "/img/newparent.png",
    heroImage: "/img/heronew/parents.png",
    art: FILL_ART,
    includes: { breakfast: true, mains: true, snacks: true },
    counts: { mains: "16", breakfast: "14", snacks: "10" },
    gifts: [],
    macros: { protein: 20, fibre: 11, kcal: 540 },
    keyMacro: "protein",
    colors: { tile: "rgba(248,232,183,0.5)", storyText: "#98740a" },
  },
];

export const INCLUDE_ROWS: { label: string; key: keyof Includes }[] = [
  { label: "Breakfast", key: "breakfast" },
  { label: "Main meals", key: "mains" },
  { label: "Snacks", key: "snacks" },
];


/** Whether this bundle leads a macro: highest protein, highest fibre, lowest kcal. */
export function isLeader(bundle: Bundle, key: MacroKey): boolean {
  const values = BUNDLES.map((b) => b.macros[key]);
  const best = key === "kcal" ? Math.min(...values) : Math.max(...values);
  return bundle.macros[key] === best;
}

// TODO(lift): sample data — how much of the bundle colour the gradient card starts with, where full strength is too much
const GRADIENT_TOP: Record<string, number> = { immunity: 0.8 };
/** The gradient card background (studio control "card"): the bundle colour at the top, fading to white at the bottom. */
export function cardGradient(bundle: Bundle): string {
  const top = bundle.colors.tile.replace(/,\s*([\d.]+)\)$/, (_, a: string) => `,${Number(a) * (GRADIENT_TOP[bundle.key] ?? 1)})`);
  return `linear-gradient(${top}, var(--color-white))`;
}
