// TODO(lift): sample data — replace with the promo from the CMS
export const PROMO = "20% off your first order – automatically applied";

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
