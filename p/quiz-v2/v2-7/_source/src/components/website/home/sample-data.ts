// TODO(lift): sample data — replace with the homepage facts from the CMS
export const FACTS: [percent: string, label: string][] = [
  ["82%", "better digestion"],
  ["73%", "more steady energy"],
  ["62%", "less stress around food"],
  ["80%", "positive lifestyle changes"],
];

// TODO(lift): sample data — replace with the homepage steps from the CMS
export const HOW_IT_WORKS: [title: string, copy: string][] = [
  ["Pick your meals", "Choose from 40+ dishes every month."],
  ["Delivered to your door. Frozen.", "Flash-frozen at peak freshness."],
  ["Ready in 10 minutes", "No prep, no planning. Just heat and eat."],
];

export type HomeMeal = {
  eyebrow: string;
  name: string;
  price: string;
  was: string;
  tags: string[];
  macros: [value: string, label: string][];
  image: string;
};

// TODO(lift): sample data — replace with the featured meals from Storyblok / Shopify
export const HOME_MEALS: HomeMeal[] = [
  {
    eyebrow: "TONIGHT’S PICK",
    name: "Brilliant Bolognese",
    price: "€7.19",
    was: "€8.99",
    tags: ["HIGH PROTEIN", "GUT-FRIENDLY"],
    macros: [
      ["20g", "PROTEIN"],
      ["519", "KCAL"],
      ["5 min", "READY"],
    ],
    image: "img/hp-meal1.jpg",
  },
  {
    eyebrow: "CHEF’S PICK",
    name: "Tikka Masala",
    price: "€7.99",
    was: "€9.49",
    tags: ["HIGH PROTEIN", "HIGH FIBRE"],
    macros: [
      ["19g", "PROTEIN"],
      ["486", "KCAL"],
      ["5 min", "READY"],
    ],
    image: "img/hp-meal2.jpg",
  },
];

// TODO(lift): sample data — the "how it works" section's green has no design token
export const HOW_IT_WORKS_COLOR = "#DCDFB9";
