import type { BundleMeal, BundleReview, BundleVariant } from "@/components/website/bundle-v3/types";
import { mealDetailsFromProduct } from "@/lib/bundle-meal-details";
import type { Products } from "@/lib/storyblok-products";
import type { ExpertReview } from "@/components/website/homepage/GlobalReviewsCarousel";

// TODO(lift): sample data — copied from the Figma LP frame (8YuV1x4IlYbPcgK0H4nMG5, node 5039:98390); replace with the CMS page
// Relative (no leading slash) so it resolves under the studio's sub-path.
const IMG = "img/lp";

export const LP_GREEN = "#D0E9C0";
export const LP_NEWSLETTER_GREEN = "#D7EBC2";
export const LP_RATING = { label: "Excellent", average: 4.5 };

export const HERO = {
  image: `${IMG}/hero-mobile.png`,
  // The Figma frame was captured mid-typewriter, which is where the "/" in front of the 23 comes from
  headlineLine1: "The Protein Bundle with",
  headlineTagline: "23 g protein per meal.",
  // TODO(lift): sample data — the LP's own desktop image; this is the PDP hero from the live protein-bundle-v2 story
  desktopImage: "https://a.storyblok.com/f/291086118523370/2944x1344/808791ae9a/protein-hero-desktop.png",
  subheadline: "Chef-crafted meals built on legumes, beans and whole grains. Delivered frozen, ready in under 10 minutes.",
  bullets: ["Ø 23 g plant protein per meal", "Ø 11 g fibre to keep you full", "Flexible plan: Skip or cancel anytime"],
  ctaLabel: "Discover bundle",
  ctaHref: "#bundle",
};

export const FOUNDATION = {
  headline: "The easiest way to eat well.",
  body: "Deciding, shopping, cooking – eating well is a daily job. every takes care of it, so you can enjoy protein-packed, delicious meals instead.",
  image: `${IMG}/foundation.png`,
};

// TODO(lift): sample data — the design's 16 meals (images from Figma, slugs of the live products); replace with the bundle's meals from Storyblok
const MEAL_LIST: { title: string; slug: string }[] = [
  { title: "Peas & Love", slug: "peas-love" },
  { title: "Coco Curry Pasta", slug: "coco-curry-pasta" },
  { title: "Pasta Arrabbiata", slug: "pasta-arrabbiata" },
  { title: "Naked Taco", slug: "naked-taco" },
  { title: "Brilliant Bolognese", slug: "brilliant-bolognese" },
  { title: "Peanut Noodles", slug: "peanut-noodles" },
  { title: "Creamy Paprika Pasta", slug: "creamy-paprika-pasta" },
  { title: "Creamy Fricassée", slug: "creamy-fricassee" },
  { title: "Lemongrass Thai Ragout", slug: "lemongrass-thai-ragout" },
  { title: "Paprika Thai Ragout", slug: "paprika-thai-ragout" },
  { title: "Lemon Zucchini Gnocchi", slug: "lemon-zucchini-gnocchi" },
  { title: "Sesame Fried Rice", slug: "sesame-fried-rice" },
  { title: "Green Forest Bowl", slug: "forest-green-bowl" },
  { title: "Dal Delight", slug: "dal-delight-bowl" },
  { title: "Paella Del Sol", slug: "paella-del-sol" },
  { title: "Red Pesto Gnocchi", slug: "red-pesto-gnocchi" },
];

/** The 16 meals, with ingredients and macros from the live products once they have loaded. */
function lpMeals(products: Products | null): BundleMeal[] {
  return MEAL_LIST.map(({ title, slug }, i) => ({
    id: slug,
    handle: slug,
    title,
    image: `${IMG}/meal-${String(i + 1).padStart(2, "0")}.png`,
    ...mealDetailsFromProduct(products?.[slug]),
  }));
}

export const BUNDLE = {
  kicker: "MADE FOR ACTIVE DAYS",
  name: "Protein",
  headline: { lead: "The Protein ", italic: "Bundle" },
  subheadline:
    "High-protein eating usually means two things: the same three meals on repeat or another shake. This bundle is neither. From hearty curries to creamy pasta: our most protein-packed dishes, built to keep you full with protein and fibre in every meal.",
  avgProtein: "23",
  avgFibre: "11",
  avgKcal: "450",
  boxHeadline: { lead: "Choose your ", italic: "box size" },
  defaultVariantId: 1,
};

// TODO(lift): sample data — prices; replace with Shopify / Eversubs. Box price = per-meal list price × meals, then quantity discount, then 20% promo.
const BOXES: Omit<BundleVariant, "meals">[] = [
  {
    id: 0,
    label: "Start your routine",
    config: { bundlePrice: 115.38, mealCount: 12, amountOffPerBundle: 12.48, promoPercent: 20, amountOffFromPromo: 20.58, bundleDiscountedPrice: 82.32, mealDiscountedPrice: 6.86 },
  },
  {
    id: 1,
    label: "Build your habit",
    badge: "POPULAR",
    config: { bundlePrice: 153.84, mealCount: 16, amountOffPerBundle: 32, promoPercent: 20, amountOffFromPromo: 24.37, bundleDiscountedPrice: 97.47, mealDiscountedPrice: 6.09 },
  },
  {
    id: 2,
    label: "Make it your lifestyle",
    config: { bundlePrice: 192.3, mealCount: 20, amountOffPerBundle: 50.55, promoPercent: 20, amountOffFromPromo: 28.35, bundleDiscountedPrice: 113.4, mealDiscountedPrice: 5.67 },
  },
];

/** The three box sizes. 12 meals shows the first twelve of the sixteen. */
export function lpVariants(products: Products | null): BundleVariant[] {
  const meals = lpMeals(products);
  return BOXES.map((box) => ({ ...box, meals: box.config.mealCount === 12 ? meals.slice(0, 12) : meals }));
}

export const STICKY = { label: "Add to cart", footnote: "from 5,43€ / meal · Skip or cancel anytime" };

// TODO(lift): sample data — replace with the live reviews.io reviews
export const REVIEWS: { headline: string; reviews: BundleReview[] } = {
  headline: "Over 200,000 happy customers",
  reviews: [
    { name: "Gabriela Bossard", title: "CONVENIENCE", rating: 5, comments: "Every meal from Every tastes so delicious to me. And knowing that I’m getting enough protein…" },
    { name: "Mala", title: "TAG", rating: 5, comments: "Healthy food that’s so easy to prepare. Perfect for a high-protein vegan diet. I love it!" },
    { name: "Name, City", title: "TAG", rating: 5, comments: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod..." },
    { name: "Name, City ", title: "TAG", rating: 5, comments: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod..." },
  ],
};

export const ROUTINE = {
  slides: [`${IMG}/routine-1.png`, `${IMG}/routine-2.png`, `${IMG}/routine-3.png`, `${IMG}/routine-4.png`],
  eyebrow: "YOUR ROUTINE",
  headline: { lead: "Every detail. ", italic: "Thought through." },
  pillars: [
    { icon: `${IMG}/pillar-1.svg`, title: "30 plants a week.", body: "The easy way to add more variety to your plate." },
    { icon: `${IMG}/pillar-2.svg`, title: "Frozen within hours of harvest.", body: "To preserve the highest amount of nutrients." },
    { icon: `${IMG}/pillar-3.svg`, title: "Delivered to your door.", body: "No shopping, no carrying." },
    { icon: `${IMG}/pillar-4.svg`, title: "Ready under 10 minutes.", body: "From freezer to table. No prep, no planning." },
  ],
};

export const INGREDIENTS = {
  eyebrow: "INGREDIENTS",
  headline: { lead: "Can frozen food ", italic: "really be fresh?" },
  body: "Vegetables can lose up to 90% of their vitamins within days of harvest. Ours are flash-frozen within hours – locking in the vitamins, minerals and macros your body actually needs. Nothing artificial, no preservatives.",
  note: "It's 30°C+ — your food still arrives frozen.",
  // TODO(lift): the design shows a video (ingredients_hp_video.mp4); this is its still frame
  image: `${IMG}/ingredients.png`,
  experts: {
    title: "Approved and recommended by experts",
    experts: [
      {
        image: `${IMG}/expert-christin.png`,
        name: "Christin Price-Gewiehs",
        credentials: "Health Coach, Sports Scientist & Nutritionist",
        quote:
          "As a health coach, sports scientist, and nutritionist, I have been working with people who want to optimally support their bodies which includes practical, high-quality, and honest nutrition. As every is made from the best ingredients and provide wholesome satiety, it is the ideal solution for anyone who wants to eat quickly, healthily, and mindfully – without compromises.",
      },
      {
        image: `${IMG}/expert-felicitas.png`,
        name: "Felicitas Döring",
        credentials: "Mom & Certified Pilates",
        quote:
          "The meals from Every taste incredibly delicious—and for me, as a Pilates trainer and mom, they’re perfect because I can prepare a super healthy, nutrient-rich, high-protein meal in just a few minutes without having to think about it. Truly the best thing that could have happened for my everyday life.",
      },
      {
        image: `${IMG}/expert-lisa.png`,
        name: "Lisa & Sebastian Vavra",
        credentials: "MSc Psychologists",
        quote:
          "As nutrition psychologists who stand for stress-free, mindful self-care, we value Every Foods as a genuine everyday aid. Warm, nutrient-rich, uncomplicated and fully aligned with our body peace philosophy.",
      },
    ] satisfies ExpertReview[],
  },
};

export const RETAILERS = {
  headline: "Curious to try? You can also find us here!",
  logos: [
    { src: `${IMG}/rewe.png`, alt: "REWE", width: 48, height: 48 },
    { src: `${IMG}/wolt.png`, alt: "Wolt", width: 48, height: 48 },
    { src: `${IMG}/picnic.png`, alt: "Picnic", width: 48, height: 48 },
    { src: `${IMG}/knuspr.png`, alt: "Knuspr", width: 100, height: 45 },
    { src: `${IMG}/crisp.png`, alt: "Crisp", width: 100, height: 35 },
  ],
};

// The design shows the questions only; the answers are the live protein-bundle-v2 FAQ copy for the same questions.
export const FAQ = {
  eyebrow: "COMMON QUESTIONS",
  headline: { lead: "Everything you ", italic: "want to know" },
  items: [
    { question: "Is the protein content enough to support my goals?", answer: "Each meal contains 26g of protein from whole-food sources. Whether that covers your full daily needs depends on factors like body weight, activity level and how many meals you eat throughout the day." },
    { question: "Do I still need protein shakes or supplements?", answer: "That depends on your body weight, activity level and individual protein target. A useful starting point: most guidelines recommend around 0.8–1.6 g of protein per kg of body weight per day. Each meal in this bundle provides 26 g – a meaningful contribution, but whether it covers your full daily needs depends on how many meals you have and what else you eat throughout the day." },
    { question: "Can I swap meals?", answer: "Yes. From your second order onwards, you can adjust your selection directly in your account. For your first box, we've curated a selection of our best meals, based on protein and fibre content." },
    { question: "How does the subscription work?", answer: "Simply choose your box size, select your meals and pick your preferred delivery date and frequency. Your box will arrive at your door, ready to enjoy. Our subscription is fully flexible, so you can update your box size, swap meals, adjust your delivery schedule, skip a box or cancel anytime – all to fit your routine." },
    { question: "How many meals can I store in my freezer?", answer: "Even a small freezer usually fits around 12 meals easily. The packaging is compact and stackable, so you can keep meals ready without needing extra space. You can also keep meals in the fridge for 1–2 days before eating." },
  ],
};

export const NEWSLETTER = {
  strapline: "DON’T MISS A BITE",
  headline: { lead: "Good food. ", italic: "Every day." },
  body: "Be the first to hear about new dishes, seasonal recipes and limited bundles. Straight to your inbox. No spam. Unsubscribe anytime.",
  placeholder: "Your email address...",
  submitLabel: "Subscribe",
  footnote: "No spam, ever. Unsubscribe with one click at any time.",
};
