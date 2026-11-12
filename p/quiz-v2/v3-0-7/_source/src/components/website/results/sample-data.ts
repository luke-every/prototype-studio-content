// TODO(lift): sample data — replace with the promo from the CMS
export const PROMO = "20% off your first order – automatically applied";

// TODO(lift): sample data — replace with the FAQ from the CMS
export const FAQ: [question: string, answer: string][] = [
  [
    "Can I choose my own dishes?",
    "Yes! You can choose your own meals and swap or replace with just one click before you order. You can also change your meals each delivery.",
  ],
  [
    "How does the subscription work?",
    "Simply choose your meals and pick your preferred delivery date and frequency. Your box will arrive at your door, ready to enjoy. Our subscription is fully flexible, so you can update your box size, swap meals, adjust your delivery schedule, skip a box or cancel anytime – all to fit your routine.",
  ],
  [
    "How many meals can I store in my freezer?",
    "Even a small freezer usually fits around 12 meals easily. The packaging is compact and stackable, so you can keep meals ready without needing extra space. You can also keep meals in the fridge for 1–2 days before eating.",
  ],
  [
    "How does delivery work?",
    "The day before your delivery date, we pack your order and hand it to our shipping partner. Meals are shipped frozen using sustainable insulation and cooling elements, and you’ll get a tracking link with your delivery window.",
  ],
  [
    "Do I need to plan the meals in advance?",
    "No. The meals are ready in under 10 minutes and require no planning: just heat and eat, whatever your day looks like.",
  ],
  [
    "Does my delivery arrive frozen?",
    "Yes. Your meals are packed in an insulated box with dry ice, keeping them frozen throughout delivery, whatever the weather. Avoid touching the dry ice directly when unpacking, as it is extremely cold. Then simply store your meals in the freezer, or in the fridge for 1–2 days.",
  ],
];

// TODO(lift): sample data — replace with the reviews.io API; the same three reviews as the bundle test's reviews shim
export const SAMPLE_REVIEWS: {
  name: string;
  rating: number;
  comments: string;
}[] = [
  {
    name: "Florence M.",
    rating: 5,
    comments:
      "Fresh, tasty and ready in minutes. It has made my weeknights so much easier.",
  },
  {
    name: "Frank P.",
    rating: 5,
    comments:
      "A high share of vegetables and it keeps me full without feeling heavy.",
  },
  {
    name: "Claudia K.",
    rating: 4,
    comments: "Great variety. The best frozen food I have tried.",
  },
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
  kcal: "540",
  ingredients:
    "Pasta, peas, romanesco, broccoli, basil pesto, semi-dried tomatoes, pumpkin seeds, lemon",
};

// TODO(lift): sample data — replace with the ingredients section from the CMS; the design shows a video (ingredients_hp_video.mp4), this is its still frame
export const INGREDIENTS = {
  eyebrow: "INGREDIENTS",
  body: "Vegetables can lose up to 90% of their vitamins within days of harvest. Ours are flash-frozen within hours – locking in the vitamins, minerals and macros your body actually needs. Nothing artificial, no preservatives.",
  note: "It's 30°C+ — your food still arrives frozen.",
  image: "img/ingredients.png",
  experts: {
    title: "Approved and recommended by experts",
    experts: [
      {
        image: "img/expert-christin.png",
        name: "Christin Price-Gewiehs",
        credentials: "Health Coach, Sports Scientist & Nutritionist",
        quote:
          "As a health coach, sports scientist, and nutritionist, I have been working with people who want to optimally support their bodies which includes practical, high-quality, and honest nutrition. As every is made from the best ingredients and provide wholesome satiety, it is the ideal solution for anyone who wants to eat quickly, healthily, and mindfully – without compromises.",
      },
      {
        image: "img/expert-felicitas.png",
        name: "Felicitas Döring",
        credentials: "Mom & Certified Pilates",
        quote:
          "The meals from Every taste incredibly delicious—and for me, as a Pilates trainer and mom, they’re perfect because I can prepare a super healthy, nutrient-rich, high-protein meal in just a few minutes without having to think about it. Truly the best thing that could have happened for my everyday life.",
      },
      {
        image: "img/expert-lisa.png",
        name: "Lisa & Sebastian Vavra",
        credentials: "MSc Psychologists",
        quote:
          "As nutrition psychologists who stand for stress-free, mindful self-care, we value Every Foods as a genuine everyday aid. Warm, nutrient-rich, uncomplicated and fully aligned with our body peace philosophy.",
      },
    ],
  },
};
