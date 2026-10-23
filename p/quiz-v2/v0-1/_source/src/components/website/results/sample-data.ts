import type { BundleKey, ChallengeId } from "../quiz/types";
import type { BoxBreakdown, BoxPlanInfo, BoxSize, Headline } from "./types";

/** Each bundle owns a photo prefix: <prefix>1 … <prefix>4 in public/img. */
export const PHOTO_PREFIX: Record<BundleKey, string> = {
  protein: "p",
  portions: "pp",
  postpartum: "postp",
  better: "bb",
};

/** Variant A's hero carousel has photographs of its own: va-<prefix>1 … N as WebP. */
export const HERO_COUNT: Record<BundleKey, number> = {
  protein: 6,
  better: 7,
  postpartum: 9,
  portions: 9,
};

/** The marquees run <prefix>1 … 4 on a loop, on every bundle. */
export const MARQUEE_COUNT = 4;

// TODO(lift): sample data — each bundle's colour comes from the CMS; none of these has a design token
export const BUNDLE_COLOR: Record<BundleKey, string> = {
  protein: "#D0E9C0",
  portions: "#F2E5F4",
  postpartum: "#F8E8B7",
  better: "#FFC273",
};

// TODO(lift): sample data — replace with the bundle copy from the CMS
export const BUNDLE_NAME: Record<BundleKey, string> = {
  protein: "The Protein Bundle",
  portions: "The Perfect Portions Plan",
  postpartum: "The Postpartum Bundle",
  better: "The Back to Better Bundle",
};

// TODO(lift): sample data — replace with the bundle copy from the CMS
/** The subhead under the hero. Variant B drops "ready in under 10 minutes" from the protein one. */
export const BUNDLE_SUB: Record<BundleKey, string> = {
  protein:
    "Hearty meals built on legumes, beans and whole grains. Around 23 g protein in each, without the effort.",
  portions:
    "Whole-ingredient meals, measured to the portion, around 500 kcal each, with breakfasts, mains and snacks all included.",
  postpartum: "Plant-based meals, breakfasts and snacks for the whole day, with around 19 g protein in every meal.",
  better: "Nourishing meals made with seasonal produce, with around 20 g protein and 11 g fibre in each.",
};

export const BUNDLE_SUB_B: Record<BundleKey, string> = {
  ...BUNDLE_SUB,
  protein: BUNDLE_SUB.protein,
};

// TODO(lift): sample data — replace with the quiz-to-tag copy from the CMS
/** The quiz read back as action statements: one goal, at most two challenges, at most two nutrition answers. */
export const GOAL_TAG: Record<BundleKey, string> = {
  protein: "Hitting your protein",
  portions: "Eating lighter",
  postpartum: "Recovering well",
  better: "Eating on autopilot",
};

export const CHALLENGE_TAG: Record<ChallengeId, string> = {
  time: "Short on time",
  decide: "Decision fatigue",
  balance: "Eating balanced",
  waste: "Cutting food waste",
  cooking: "Skipping the cooking",
  budget: "Eating on a budget",
};

/** "Nothing in particular" is deliberately absent: it produces no tag. */
export const WATCH_TAG: Record<string, string> = {
  protein: "More protein",
  fibre: "More fibre",
  portions: "Portion control",
  sugar: "Less sugar",
  plants: "More plant-based",
};

export const MAX_TAGS = 4;

// TODO(lift): sample data — replace with the promo from the CMS
export const PROMO = "20% off automatically applied";
export const SUBLINE = "Skip or cancel anytime";

// TODO(lift): sample data — replace with the challenge copy from the CMS
/** Variant B's second headline speaks to the challenge picked first. */
export const CHALLENGE_HEADLINE: Record<ChallengeId, Headline> = {
  time: { lead: "For days when ", italic: "there’s no time to cook." },
  decide: { lead: "For days ", italic: "you don’t know what to eat." },
  balance: { lead: "For days when eating well ", italic: "takes too much thought." },
  waste: { lead: "For when good food ", italic: "keeps ending up in the bin." },
  cooking: { lead: "For when cooking ", italic: "just isn’t your thing." },
  budget: { lead: "Good meals, ", italic: "at a price that works for you." },
};

// TODO(lift): sample data — replace with the challenge cards from the CMS
/** The first two cards are written for the challenge picked first; the last two are the same for everybody. */
export const CHALLENGE_CARDS: Record<ChallengeId, [string, string][]> = {
  time: [
    ["Cooked by chefs, so you don’t have to.", "Protein built into every meal, from real food, not shakes."],
    ["No prep needed.", "Around +20 clean ingredients, all prepared for you."],
  ],
  decide: [
    ["Chosen by chefs, not by you.", "Every meal is chosen for you."],
    ["One dish, everything included.", "Around +20 clean ingredients, all prepared for you."],
  ],
  balance: [
    ["Chef-created, nutritionist-checked.", "Every meal is thoughtfully balanced for you."],
    ["5+ vegetables in every meal.", "Balanced meals made from whole foods, not isolated nutrients."],
  ],
  waste: [
    ["Portioned by chefs, not guessed by you.", "Exact amounts, so nothing is left over."],
    ["Every ingredient gets used.", "Around 20 real ingredients, with nothing left to waste."],
  ],
  cooking: [
    ["Cooked by chefs, so you don’t have to.", "No cooking skills needed. It’s already done for you."],
    ["Real ingredients, all prepared for you.", "Around +20 clean ingredients, all prepared for you."],
  ],
  budget: [
    ["Chef-cooked food, without the restaurant price.", "No tip built into the price."],
    ["Real ingredients, nothing wasted.", "Around 20 whole ingredients, all used."],
  ],
};

export const SHARED_CARDS: [string, string][] = [
  ["Flash-frozen at peak freshness.", "Vitamins and minerals locked in — no preservatives."],
  ["10 minutes, start to finish.", "No chopping, no pans. Just heat and eat."],
];

/** One picture per position in the rail, the same four whichever challenge the copy is written for. */
export const CARD_IMAGES: string[] = ["img/card1.png", "img/card2.png", "img/card3.png", "img/card4.png"];

// TODO(lift): sample data — replace with the average nutrition from the CMS
export const AVERAGES: [value: string, unit: string, label: string][] = [
  ["23", "g", "Protein"],
  ["11", "g", "Fibre"],
  ["450", "kcal", "Calories"],
];

/** Bundles drawn as rails rather than a grid of meals */
export const MEALS_ARE_RAILS: Record<BundleKey, boolean> = {
  protein: false,
  better: false,
  portions: true,
  postpartum: true,
};

export const MENU_SHOWN = 6;

// TODO(lift): sample data — the placeholder menu shown until the live one loads
/** [name, which photograph: meal1 … meal6] */
export const PLACEHOLDER_MENU: [string, number][] = [
  ["Bami Goreng", 1],
  ["Better Butter Chicken", 4],
  ["Peas & Love", 2],
  ["Chimichurri Glow", 3],
  ["Chana Masala", 5],
  ["Green Thai Curry", 6],
  ["Chili sin Carne", 2],
  ["Daily Greens Bowl", 1],
  ["Moroccan Chickpea Stew", 3],
  ["Red Lentil Dahl", 4],
  ["Sweet Potato Katsu", 5],
  ["Miso Ramen Bowl", 6],
  ["Tuscan Bean Stew", 1],
  ["Harissa Couscous", 2],
  ["Black Bean Chilli", 3],
  ["Coconut Rice & Greens", 4],
];

export const PLACEHOLDER_MEAL_COUNT = 6;

// TODO(lift): sample data — the placeholder rails shown until the live menu loads
/** [heading, [name, image or null to borrow from the meal pool]] */
export const PLACEHOLDER_RAILS: [string, [string, string | null][]][] = [
  [
    "Breakfast",
    [
      ["Berry Oat Bowl", "img/bfast1.jpg"],
      ["Cacao Porridge", "img/bfast2.jpg"],
      ["Green Smoothie Bowl", "img/bfast3.jpg"],
    ],
  ],
  [
    "Main meals",
    [
      ["Bami Goreng", null],
      ["Better Butter Chicken", null],
      ["Peas & Love", null],
      ["Chimichurri Glow", null],
      ["Chana Masala", null],
      ["Green Thai Curry", null],
    ],
  ],
  [
    "Snacks",
    [
      ["Spirulina Glow Smoothie", "img/snack1.jpg"],
      ["Protein Bites", "img/snack2.jpg"],
      ["Roasted Chickpeas", "img/snack3.jpg"],
    ],
  ],
];

// TODO(lift): sample data — replace with the bundle content section from the CMS
export const CONTENT_HEADLINE: Record<BundleKey, Headline> = {
  protein: { lead: "When protein is sorted,", italic: "the rest gets easier.", lineBreak: true },
  portions: { lead: "When eating is sorted,", italic: "losing weight gets easier.", lineBreak: true },
  postpartum: { lead: "The weeks will change.", italic: "The food keeps up.", lineBreak: true },
  better: { lead: "When eating is sorted,", italic: "the rest gets easier.", lineBreak: true },
};

// TODO(lift): sample data — replace with the bundle content section from the CMS
/** Four points per bundle: [bold lead, supporting line] */
export const CONTENT_POINTS: Record<BundleKey, [string, string][]> = {
  protein: [
    ["30 plants a week.", "The easy way to add more variety to your plate."],
    ["Frozen within hours of harvest.", "To preserve the highest amount of nutrients."],
    ["Delivered to your door.", "No shopping, no carrying."],
    ["Ready under 10 minutes.", "From freezer to table. No prep, no planning."],
  ],
  portions: [
    ["Perfect portions.", "Meals designed with balanced portions, so staying on track takes care of itself."],
    ["Real ingredients only.", "Fresh, whole foods with no unnecessary additives or preservatives."],
    ["Feel satisfied for longer.", "A balanced combination of plant protein, fibre, complex carbs and healthy fats."],
    ["More plants, more variety.", "At least 6 vegetables in every meal for more nutrients in your day."],
  ],
  postpartum: [
    ["Fresh whole foods only.", "100% natural: no additives or preservatives."],
    ["Balanced meals.", "A good balance of plant proteins, fibre, complex carbs and good fats."],
    ["At least 6 varied veggies per meal.", "More variety on your plate, more nutrients in your day."],
    ["Chef designed. Nutritionist approved.", "No sacrificing taste for nutrition. You can have both."],
  ],
  better: [
    [
      "Balanced meals.",
      "A nourishing combination of plant protein, fibre, complex carbs and healthy fats to keep your meals balanced and satisfying.",
    ],
    ["Real ingredients only.", "Fresh, whole foods with no unnecessary additives or preservatives."],
    [
      "More plants, more variety.",
      "Seasonal vegetables and a variety of plant-based ingredients for more nutrients and flavour in every meal.",
    ],
    [
      "Chef-created. Nutritionist-approved.",
      "Delicious meals designed to make healthy eating easy without compromising on taste.",
    ],
  ],
};

// TODO(lift): sample data — replace with prices from Shopify / Eversubs
export const SIZES: BoxSize[] = [
  { n: 12, per: "6,86€", total: "82,32€", was: "115,38€", disc: "-20,58€", qty: "-12,48€" },
  { n: 16, per: "6,09€", total: "97,47€", was: "153,84€", disc: "-24,37€", qty: "-32,00€", popular: true },
  { n: 20, per: "5,67€", total: "113,40€", was: "192,30€", disc: "-28,35€", qty: "-50,55€" },
];

/** The third line on each size pill, by position */
export const SIZE_TAGLINES: [string, string][] = [
  ["Start your", "routine"],
  ["Build your", "habit"],
  ["Make it your", "lifestyle"],
];

// TODO(lift): sample data — replace with prices from Shopify / Eversubs
/** How the box is chosen. Perfect Portions offers one size in two make-ups; Postpartum has no size to pick. */
export const PLANS: Record<BundleKey, BoxPlanInfo> = {
  protein: { title: "Choose your box size", sizes: SIZES },
  better: { title: "Choose your box size", sizes: SIZES },
  portions: {
    title: "Choose your box size",
    sizes: [
      {
        n: 20,
        label: "MEALS",
        per: "5,47€",
        total: "149,40€",
        was: "236,75€",
        disc: "-37,35€",
        qty: "-50,00€",
        tagline: "Starter",
      },
      {
        n: 20,
        label: "MEALS +",
        per: "5,47€",
        total: "149,40€",
        was: "236,75€",
        disc: "-37,35€",
        qty: "-50,00€",
        tagline: "Complete",
        popular: true,
      },
    ],
  },
  postpartum: {
    title: "Finalise your box",
    pills: false,
    sizes: [{ n: 16, per: "5,43€", total: "142,78€", was: "210,47€", disc: "-35,69€", qty: "-32,00€" }],
  },
};

// TODO(lift): sample data — replace with the box contents from the CMS
/** What the breakdown says the box holds, per bundle. Protein is meals only, so it lists nothing. */
export const BOX_BREAKDOWN: Record<BundleKey, BoxBreakdown> = {
  protein: {},
  better: { addon: { name: "2 x Spirulina Glow Smoothies", price: "6,49€", image: "img/addon1.jpg" } },
  postpartum: {
    note: "Flexible, no food size",
    gift: "Treat yourself or someone else",
    items: [
      [
        "16 meals for lunch or dinner",
        "6 Smoothies (2 × Green, 2 × Pitaya, 2 × Mango)",
        "1 Pistachio Pecan Granola",
        "4 Snack Balls",
        "6 Snack Crumbles",
      ],
    ],
  },
  /* one list per size pill: Starter is the meals alone, Complete the lot */
  portions: {
    items: [
      ["20 meals for lunch or dinner"],
      [
        "20 meals for lunch or dinner",
        "1 Apple Cinnamon Porridge",
        "1 Vanilla Hazelnut Granola",
        "9er Box Raw Bite Cakes",
        "2x Pitaya Mango Smoothie",
      ],
    ],
  },
};

// TODO(lift): sample data — replace with the FAQ from the CMS
export const FAQ: [question: string, answer: string][] = [
  [
    "Can I choose my own dishes?",
    "Yes! You can choose your own meals when building your box, and swap or replace them any time with just one click through your account.",
  ],
  [
    "How do I prepare the dishes?",
    "Simply heat and enjoy — each meal is fully cooked and ready in minutes, straight from the freezer to your table.",
  ],
  [
    "How many dishes fit in a standard freezer?",
    "Our meals are packaged in practical, flexible pouches, so they stack efficiently. A small, built-in freezer compartment fits at least 8 pouches, while a larger freezer can easily hold 20 meals or more depending on how they’re arranged.",
  ],
  [
    "Can I pause or cancel my subscription at any time?",
    "Yes, there is no minimum commitment period — you can pause or cancel your subscription at any time.",
  ],
  [
    "Are the dishes already portioned for one person?",
    "Yes, every meal is portioned as a single serving, ready to heat and enjoy.",
  ],
  [
    "How long do the dishes keep in the freezer?",
    "Thanks to flash-freezing, our meals stay fresh in your freezer for several months — just check the best-before date on the pack.",
  ],
  [
    "Is there a minimum subscription period?",
    "No, there’s no minimum subscription period — you’re free to skip, pause, or cancel whenever you like.",
  ],
  [
    "How does delivery work?",
    "The day before your delivery date, we pack your order and hand it to our shipping partner. Meals are shipped frozen using sustainable insulation and cooling elements, and you’ll get a tracking link with your delivery window.",
  ],
];

// TODO(lift): sample data — replace with the other bundles from the CMS
/** The way out at the foot of the results: every bundle but the one being looked at. */
export const OTHER_BUNDLES: { key: BundleKey; eyebrow: string; name: string; copy: string }[] = [
  {
    key: "protein",
    eyebrow: "FITNESS",
    name: "The Protein Bundle",
    copy: "Our most protein-rich meals, built on legumes, beans and whole grains.",
  },
  {
    key: "postpartum",
    eyebrow: "LIFESTYLE",
    name: "The New Parent Bundle",
    copy: "Nutrient-dense meals, breakfasts and snacks for the whole day.",
  },
  {
    key: "portions",
    eyebrow: "FITNESS",
    name: "The Perfect Portions Plan",
    copy: "Whole-ingredient meals, measured to the portion, around 500 kcal each.",
  },
  {
    key: "better",
    eyebrow: "FITNESS",
    name: "The Back to Better Bundle",
    copy: "Nourishing meals made with seasonal produce, balanced without the thinking.",
  },
];

export const OTHER_BUNDLE_PRICE = "From €5.43 / meal";

// TODO(lift): sample data — one sentence stands in for every dish; the real descriptions come from the CMS
export const PLACEHOLDER_RECIPE = {
  body: "An ode to pesto, with a twist: blended green peas create an indulgent creaminess, complemented by flavorful basil.",
  macros: [
    ["22", "PROTEIN"],
    ["11", "FIBRE"],
    ["67", "CARBS"],
    ["19", "FAT"],
  ] as [string, string][],
  ingredients: "Pasta, peas, romanesco, broccoli, basil pesto, semi-dried tomatoes, pumpkin seeds, lemon",
};
