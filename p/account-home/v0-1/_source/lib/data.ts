import { PRODUCTS } from "./catalog";

// All data in this prototype is mock data. No database, no API calls.

export const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const asset = (p: string) => (/^https?:/.test(p) ? p : `${BASE}${p}`);

/** Fixed "now" so countdowns and day states are stable in every demo. Tue 29 Sep 2026, 14:20. */
export const NOW = new Date(2026, 8, 29, 14, 20);

export type Allergen = "gluten" | "soy" | "nuts" | "sesame";
/** Which of a dish's three reason lines fits a goal best. */
export type ReasonKey = "plants" | "protein" | "time";
/** The 8 Phase-1 goals from the Miro board (05.10 Goal Generation Logic, updated 13.10). */
export type Goal = "balanced" | "gut" | "lose" | "maintain" | "lean" | "energy" | "muscle" | "postpartum";
export type SlotName = "breakfast" | "lunch" | "dinner";

export type Dish = {
  id: string;
  name: string;
  img: string;
  kind: "meal" | "breakfast" | "smoothie" | "addon";
  size?: string;
  minutes: number;
  plants: number;
  protein: number;
  fibre: number;
  kcal: number;
  carbs: number;
  fat: number;
  contains: Allergen[];
  tags: ("quick" | "high-protein" | "plant-rich" | "new" | "comfort")[];
  /** One reason line per goal, always in words, never a score. */
  reason: Record<ReasonKey, string>;
  why: string;
  helps: string;
  price: number;
};

export const DISHES: Dish[] = [
  {
    id: "dal", name: "Dal Delight", img: "/meals/dal-delight.jpg", kind: "meal",
    minutes: 6, plants: 8, protein: 18, fibre: 12, kcal: 460, carbs: 58, fat: 14,
    contains: [], tags: ["plant-rich", "comfort"],
    reason: {
      plants: "Eight plants in one warm bowl, lentils doing the heavy lifting",
      protein: "Red lentils bring protein and 12 g of fibre",
      time: "Six minutes from freezer to spoon",
    },
    why: "You kept Dal Delight both times it was in your box, and it fits a day where you want lunch sorted without thinking.",
    helps: "Lentils give slow-release energy, so the afternoon feels steadier. Turmeric, ginger and spinach add three more plants to your week.",
    price: 6.99,
  },
  {
    id: "paella", name: "Paella Del Sol", img: "/meals/paella.jpg", kind: "meal",
    minutes: 8, plants: 9, protein: 14, fibre: 9, kcal: 440, carbs: 66, fat: 11,
    contains: [], tags: ["plant-rich"],
    reason: {
      plants: "Nine plants, including three you haven't had this month",
      protein: "Chickpeas and peas for a gentle protein lift",
      time: "Eight minutes, one pan",
    },
    why: "It adds peppers, artichoke and saffron, three plants that aren't in your week yet.",
    helps: "More variety means a more varied gut microbiome. This one moves you closest to 30 plants this week.",
    price: 7.99,
  },
  {
    id: "taco", name: "Naked Taco", img: "/meals/naked-taco.jpg", kind: "meal",
    minutes: 7, plants: 10, protein: 20, fibre: 11, kcal: 480, carbs: 55, fat: 17,
    contains: ["soy"], tags: ["plant-rich", "high-protein"],
    reason: {
      plants: "Ten plants, the most in this week's menu",
      protein: "Black beans and soy mince, 20 g protein",
      time: "Seven minutes, no chopping",
    },
    why: "It's the most plant-varied dish on the menu, and you rated a similar bowl highly in August.",
    helps: "Beans, corn and peppers bring fibre and colour. It's filling without being heavy.",
    price: 6.99,
  },
  {
    id: "bolognese", name: "Brilliant Bolognese", img: "/meals/bolognese.jpg", kind: "meal",
    minutes: 6, plants: 7, protein: 24, fibre: 10, kcal: 510, carbs: 64, fat: 13,
    contains: ["gluten", "soy"], tags: ["high-protein", "comfort"],
    reason: {
      plants: "Seven plants hidden in a classic",
      protein: "24 g protein from lentils and soy",
      time: "Six minutes, the whole family eats it",
    },
    why: "It's a reorder favourite with households of two, and it keeps well for a second portion.",
    helps: "Lentils and soy together give a complete protein. Comfort food that still counts toward your plants.",
    price: 6.99,
  },
  {
    id: "arrabbiata", name: "Pasta Arrabbiata", img: "/meals/arrabbiata.jpg", kind: "meal",
    minutes: 5, plants: 6, protein: 16, fibre: 9, kcal: 420, carbs: 70, fat: 9,
    contains: ["gluten"], tags: ["quick"],
    reason: {
      plants: "Tomato, chilli and white beans, six plants",
      protein: "White beans make this more filling than it looks",
      time: "Five minutes, the quickest on the menu",
    },
    why: "It's the quickest meal on the menu, and Tuesdays are your busiest day.",
    helps: "Tomatoes cooked slowly give more lycopene. A lighter option for a late evening.",
    price: 6.99,
  },
  {
    id: "gnocchi", name: "Red Pesto Gnocchi", img: "/meals/red-pesto-gnocchi.jpg", kind: "meal",
    minutes: 7, plants: 6, protein: 12, fibre: 7, kcal: 470, carbs: 72, fat: 14,
    contains: ["gluten", "nuts"], tags: ["comfort", "new"],
    reason: {
      plants: "Sun-dried tomato, kale and basil, six plants",
      protein: "A cosy one, lighter on protein",
      time: "Seven minutes, straight from the freezer",
    },
    why: "It's new this month and close to dishes you loved. Something different for a slower evening.",
    helps: "A comfort dinner that still brings greens. Pair it with a smoothie in the morning for balance.",
    price: 6.99,
  },
  {
    id: "quinoa", name: "Sesame Quinoa Salad", img: "/meals/sesame-quinoa.jpg", kind: "meal",
    minutes: 6, plants: 9, protein: 22, fibre: 10, kcal: 490, carbs: 52, fat: 18,
    contains: ["soy", "sesame"], tags: ["high-protein", "plant-rich"],
    reason: {
      plants: "Nine plants, with edamame and red cabbage",
      protein: "Quinoa, edamame and tofu, 22 g protein",
      time: "Six minutes, good cold as well",
    },
    why: "It's high in protein and fibre, which is your focus, and it's good cold for a desk lunch.",
    helps: "Quinoa is one of the few plants with all nine essential amino acids.",
    price: 6.99,
  },
  {
    id: "beetroot", name: "Crunchy Beetroot Salad", img: "/meals/beetroot-salad.jpg", kind: "meal",
    minutes: 2, plants: 9, protein: 15, fibre: 11, kcal: 380, carbs: 44, fat: 15,
    contains: ["nuts"], tags: ["quick", "plant-rich"],
    reason: {
      plants: "Nine plants, no heating needed",
      protein: "Lentils and walnuts, 15 g protein",
      time: "Two minutes, just thaw overnight",
    },
    why: "It needs no heating, and you asked for lunches that work at the office.",
    helps: "Beetroot and walnuts add colour and healthy fats. Walnuts count as a plant too.",
    price: 6.99,
  },
  {
    id: "oats", name: "Berry Overnight Oats", img: "/meals/breakfast.jpg", kind: "breakfast",
    minutes: 0, plants: 5, protein: 11, fibre: 8, kcal: 330, carbs: 48, fat: 9,
    contains: ["gluten", "nuts"], tags: ["quick"],
    reason: {
      plants: "Oats, berries and seeds: five plants before 9 am",
      protein: "A breakfast with staying power",
      time: "Zero minutes, it's ready when you are",
    },
    why: "Breakfast is the slot you skip most. This one is ready when you open the fridge.",
    helps: "Oat fibre (beta-glucan) keeps you fuller for longer.",
    price: 5.9,
  },
  {
    id: "smoothie", name: "Green Glow Smoothie", img: "/meals/smoothie.jpg", kind: "smoothie",
    minutes: 2, plants: 6, protein: 8, fibre: 6, kcal: 220, carbs: 34, fat: 5,
    contains: [], tags: ["quick", "plant-rich"],
    reason: {
      plants: "Six plants in a glass, spinach you won't taste",
      protein: "A light start, with protein from hemp",
      time: "Add water, blend, done",
    },
    why: "It's an easy win toward 30 plants, and it's allergen-free.",
    helps: "Spinach, kiwi and mango bring vitamin C and folate.",
    price: 4.9,
  },
  // Add-ons (Figma "You may also like" / "Add to your box")
  ...([
    { id: "chili-oil", name: "Chili oil", img: "/figma/addon-chili-oil.png", size: "180 ml", price: 6.9, desc: "Smoky, crunchy, a spoon on anything" },
    { id: "miso", name: "Miso Paste", img: "/figma/addon-miso-paste.png", size: "200 g", price: 5.9, desc: "Umami for soups, dressings and bowls" },
    { id: "ginger", name: "Ginger Shots", img: "/meals/ginger-shot.jpg", size: "6 × 60 ml", price: 11.9, desc: "Six sharp little mornings" },
  ].map((a) => ({
    ...a, kind: "addon" as const, minutes: 0, plants: 0, protein: 0, fibre: 0, kcal: 0, carbs: 0, fat: 0,
    contains: [] as Allergen[], tags: [] as Dish["tags"],
    reason: { plants: a.desc, protein: a.desc, time: a.desc }, why: a.desc, helps: a.desc,
  }))),
];

/**
 * Discover-only dishes (Variant B "This month's favourite"). Kept out of DISHES so swap, search and plan
 * suggestions in the original variant stay exactly as they were.
 */
export const FEATURED: Dish[] = [
  {
    id: "peas-love", name: "Peas & Love", img: "/discover/peas-love.jpg", kind: "meal",
    minutes: 6, plants: 8, protein: 17, fibre: 11, kcal: 450, carbs: 58, fat: 13,
    contains: ["gluten"], tags: ["new", "plant-rich"],
    reason: {
      plants: "Peas, basil, broccoli and tomato: eight plants in one bowl",
      protein: "Pea pesto brings 17 g protein and 11 g fibre",
      time: "Six minutes, and it tastes like you tried",
    },
    why: "It's this month's favourite with customers who cook like you, and it's full of greens you haven't had this week.",
    helps: "Peas are an easy protein and fibre win. Basil and roasted greens add more plants to your week.",
    price: 6.99,
  },
];

export const dish = (id: string) => (DISHES.find((d) => d.id === id) ?? FEATURED.find((d) => d.id === id) ?? PRODUCTS.find((d) => d.id === id))!;

export const CATEGORIES = [
  { id: "breakfast", label: "Breakfast", img: "/discover/chip-breakfast.jpg", blurb: "A good morning sets the tone for your whole day. Give it a head start with our porridges and granolas.", link: "All breakfasts" },
  { id: "meals", label: "Lunch / Dinner", img: "/discover/chip-meals.jpg", blurb: "Ready in minutes, cooked by our chefs. Bowls, pastas and curries built around plants.", link: "All meals" },
  { id: "salads", label: "Salads", img: "/discover/chip-salads.jpg", blurb: "Crunchy, colourful and ready to thaw overnight. Lunch that works at your desk.", link: "All salads" },
  { id: "shots", label: "Shots", img: "/discover/chip-shots.jpg", blurb: "Ginger, turmeric and berry shots. A sharp little start to the morning.", link: "All shots" },
  { id: "smoothies", label: "Smoothies", img: "/discover/chip-smoothies.jpg", blurb: "Frozen, blended, done. Up to six plants in a glass.", link: "All smoothies" },
  { id: "sweet", label: "Sweet snacks", img: "/discover/chip-sweet-snacks.jpg", blurb: "Bites and bars for the 4 pm moment, without the crash.", link: "All sweet snacks" },
];

export const BUNDLES = [
  { id: "protein", eyebrow: "Fitness", name: "The Protein Bundle", img: "/discover/bundle-hero-protein.jpg", desc: "Enjoy 23g protein per meal, without planning your day around it.", price: "From €5.43 / meal", href: "/bundle-protein-bundle.html", tint: "from-[#d6ebc6]" },
  { id: "parent", eyebrow: "Lifestyle", name: "The New Parent Bundle", img: "/discover/bundle-hero-postpartum.jpg", desc: "Nutrient-dense meals for the postpartum weeks, when you need them most.", price: "From €5.20 / meal", href: "/bundle-postpartum-bundle.html", tint: "from-[#f5e3b3]" },
  { id: "portions", eyebrow: "Balance", name: "Perfect Portions", img: "/discover/bundle-hero-perfect-portions.jpg", desc: "Satisfying portions that keep you full, with protein and fibre in every bowl.", price: "From €5.10 / meal", href: "/bundle-perfect-portions-plan.html", tint: "from-[#e6dcef]" },
  { id: "better", eyebrow: "September drop", name: "Back to Better", img: "/discover/hero-back-to-better.jpg", desc: "Comforting meals for the season ahead, paired with high-fibre spirulina smoothies.", price: "From €5.30 / meal", href: "/bundle-back-to-better.html", tint: "from-[#f3d9c9]" },
];

export const POPULAR = ["bolognese", "arrabbiata", "gnocchi", "paella", "taco", "dal"];
export const ADDON_IDS = ["chili-oil", "miso", "ginger"];
export const sizeOf = (d: Dish) => d.size ?? (d.kind === "meal" ? "400 g · 1 serving" : d.kind === "smoothie" ? "250 ml · 1 serving" : "220 g · 1 serving");

export const ADDRESS = "Hermannstrasse 22, 12049 Berlin";
export const CARD = "Card ending: 9376";
export const REFERRAL_LINK = "https://r.infl.co/k5uVkbk4J";

export type Persona = {
  id: "anna" | "jonas" | "mia";
  name: string;
  code: string;
  segment: string;
  need: string;
  goal: Goal;
  goalLabel: string;
  exclude: Allergen[];
  showNumbers: boolean;
  rhythmMade: number; // of last 14 planned meals
  label: string; // Wrapped identity label
  /** Which slots hold an Every meal, per weekday index (0 = Monday). Always derived from the quiz answers. */
  schedule: Partial<Record<SlotName, number[]>>;
  favourite: string;
  /** Eve quiz answers on file (F0). Active customers have all of them. */
  quiz: Quiz;
};

// ---------- Eve quiz (Miro 02.10, Eve quiz for RC / NC who skipped acquisition) ----------
export type Quiz = {
  q1: "eat" | "gut" | "lose" | "fitness" | "postpartum" | null;
  /** Q1a for Lose weight: medical (doctor, gained) vs maintenance (lighter, maintain). */
  q1a: "lighter" | "doctor" | "gained" | "maintain" | null;
  /** Q1a for Nutrition for fitness. */
  fitness: "lean" | "muscle" | "energy" | null;
  watch: string[];
  satisfaction: number | null;
  challenges: string[];
  household: "me" | "partner" | "family" | "roommates" | "other" | null;
  householdOther: string;
  meals: 3 | 4 | 5 | null;
  days: number[] | null;
  occasions: ("breakfast" | "lunch" | "dinner" | "snacks")[] | null;
  eater: string | null;
  picky: "particular" | "few" | "anything" | null;
  dislikes: string;
  deep: { height?: string; weight?: string; age?: string; exercise?: string };
};

export const EMPTY_QUIZ: Quiz = { q1: null, q1a: null, fitness: null, householdOther: "", watch: [], satisfaction: null, challenges: [], household: null, meals: null, days: null, occasions: null, eater: null, picky: null, dislikes: "", deep: {} };

/** Goal routing (Miro 05.10, updated 13.10): Q1 plus its weight or fitness follow-up. Q2 only shapes meal picks. */
export function goalFromQuiz(q: Quiz): Goal {
  switch (q.q1) {
    case "gut": return "gut";
    case "lose": return q.q1a === "doctor" || q.q1a === "gained" ? "lose" : "maintain";
    case "fitness": return q.fitness === "muscle" ? "muscle" : q.fitness === "energy" ? "energy" : "lean";
    case "postpartum": return "postpartum";
    default: return "balanced";
  }
}

/**
 * Slot grid (Miro Step 1): Q6 meals/week spread over Q6a days (fallback Mon–Fri) and the main occasions
 * from Q7 (fallback lunch + dinner). Breakfast fills the chosen days if picked. Minimum floor of 3.
 */
export function scheduleFromQuiz(q: Quiz): Partial<Record<SlotName, number[]>> {
  const days = q.days && q.days.length ? [...q.days].sort() : [0, 1, 2, 3, 4];
  const occ = q.occasions && q.occasions.length ? q.occasions : ["lunch", "dinner"];
  const mainsOcc = (occ.filter((o) => o === "lunch" || o === "dinner") as SlotName[]);
  const mains: SlotName[] = mainsOcc.length ? mainsOcc : ["lunch", "dinner"];
  const target = Math.max(3, q.meals ?? 3);
  const out: Partial<Record<SlotName, number[]>> = { breakfast: [], lunch: [], dinner: [] };
  let placed = 0;
  for (let round = 0; placed < target && round < 3; round++) {
    for (const d of days) {
      if (placed >= target) break;
      const slot = mains[(round + days.indexOf(d)) % mains.length];
      if (!out[slot]!.includes(d)) { out[slot]!.push(d); placed++; }
    }
  }
  if (occ.includes("breakfast")) out.breakfast = days;
  return out;
}

/** Questions still missing from the quiz on file (F0: only ask what's missing). */
export function missingQuestions(q: Quiz) {
  const m: string[] = [];
  if (!q.q1) m.push("q1");
  if (q.q1 === "lose" && !q.q1a) m.push("q1a");
  if (q.q1 === "fitness" && !q.fitness) m.push("fitness");
  if (!q.watch.length) m.push("watch");
  if (q.satisfaction === null) m.push("satisfaction");
  if (!q.challenges.length) m.push("challenges");
  if (!q.household) m.push("household");
  if (!q.meals) m.push("meals");
  if (!q.days) m.push("days");
  if (!q.occasions) m.push("occasions");
  if (!q.eater) m.push("eater");
  if (!q.picky) m.push("picky");
  return m;
}

type PersonaSeed = Omit<Persona, "schedule">;

const SEEDS: PersonaSeed[] = [
  {
    id: "anna", name: "Anna", code: "M2.1", segment: "Lapsed",
    need: "Fears the restart loop; no failing mode.",
    goal: "gut", goalLabel: "Healthy gut",
    exclude: [], showNumbers: false, rhythmMade: 11,
    label: "The Steady One", favourite: "dal",
    quiz: { q1: "gut", q1a: null, fitness: null, householdOther: "", watch: ["Eating more plant-based"], satisfaction: 3, challenges: ["Deciding what to eat"], household: "partner", meals: 5, days: [0, 1, 2, 3], occasions: ["lunch", "dinner"], eater: "A mix of staples and new things", picky: "anything", dislikes: "", deep: {} },
  },
  {
    id: "jonas", name: "Jonas", code: "M1.2", segment: "Overwhelmed",
    need: "Needs it to fit a chaotic life; low-effort nudges.",
    goal: "maintain", goalLabel: "Maintain weight",
    exclude: [], showNumbers: false, rhythmMade: 7,
    label: "The Quick Starter", favourite: "arrabbiata",
    quiz: { q1: "lose", q1a: "lighter", fitness: null, householdOther: "", watch: ["Keeping portions in check"], satisfaction: 2, challenges: ["Finding time to cook"], household: "me", meals: 5, days: [0, 1, 2, 3, 4], occasions: ["lunch"], eater: "I keep it simple - quick and easy", picky: "few", dislikes: "mushrooms", deep: {} },
  },
  {
    id: "mia", name: "Mia", code: "M2.3", segment: "Lapsed",
    need: "Wants depth and data; upgrade, not a new project.",
    goal: "muscle", goalLabel: "Build muscle",
    exclude: ["soy"], showNumbers: true, rhythmMade: 13,
    label: "The Explorer", favourite: "paella",
    quiz: { q1: "fitness", q1a: null, fitness: "muscle", householdOther: "", watch: ["Getting more protein", "Consuming more calories"], satisfaction: 4, challenges: ["Eating a balanced diet"], household: "me", meals: 4, days: [0, 1, 2, 3, 4], occasions: ["breakfast", "lunch", "dinner"], eater: "I love trying new tastes", picky: "anything", dislikes: "", deep: { exercise: "3–4 times a week" } },
  },
];

/** The plan always comes from the answers on file: one source of truth for quiz, plan and goal. */
export const PERSONAS: Persona[] = SEEDS.map((p) => ({ ...p, schedule: scheduleFromQuiz(p.quiz) }));

export const persona = (id: Persona["id"]) => PERSONAS.find((p) => p.id === id)!;

export const allowed = (p: Persona, d: Dish) => !d.contains.some((a) => p.exclude.includes(a));

/** How well a dish fits a goal (goal pool ordering). Mirrors the per-goal rules on the spec board. */
export const fitScore = (goal: Goal, d: Dish) => {
  const lentil = /dal|lentil|beetroot|bolognese/i.test(`${d.id} ${d.name}`);
  switch (goal) {
    // Variety leads, no macro thresholds
    case "balanced": return d.plants + (d.kcal >= 400 && d.kcal <= 600 ? 4 : 0);
    // Fibre first (11 g+), plant diversity second
    case "gut": return d.fibre * 2 + d.plants + (d.fibre >= 11 ? 6 : 0);
    // Protein 20 g+, fibre 12 g+, ≤520 kcal; deprioritise calorie-dense + low protein + low fibre
    case "lose": return (d.protein >= 20 ? 10 : 0) + (d.fibre >= 12 ? 8 : 0) + (d.kcal <= 520 ? 6 : -8) + d.protein / 4 + d.fibre / 4;
    // Protein 18 g+, fibre 8 g+, 450–600 kcal, full variety
    case "maintain": return (d.protein >= 18 ? 8 : 0) + (d.fibre >= 8 ? 5 : 0) + (d.kcal >= 450 && d.kcal <= 600 ? 5 : 0) + d.plants / 2;
    // Protein 25 g+ first, carbs present
    case "lean": return (d.protein >= 25 ? 15 : 0) + d.protein / 2 + (d.kcal >= 450 && d.kcal <= 600 ? 4 : 0) + d.fibre / 4;
    // 500 kcal+, carbs 70 g+, nothing under 450 kcal
    case "energy": return (d.kcal < 450 ? -50 : 0) + d.kcal / 25 + d.carbs / 5 + (d.protein >= 20 ? 4 : 0);
    // Protein 25 g+ AND 500 kcal+, nothing under 450 kcal
    case "muscle": return (d.kcal < 450 ? -50 : 0) + (d.protein >= 25 ? 10 : 0) + (d.kcal >= 500 ? 10 : 0) + d.protein / 2 + d.carbs / 10;
    // Lentil dishes first (iron, folate), 500 kcal+, protein 20 g+, fibre 12 g+
    case "postpartum": return (lentil ? 12 : 0) + (d.kcal >= 500 ? 5 : 0) + (d.protein >= 20 ? 5 : 0) + (d.fibre >= 12 ? 5 : 0) + d.fibre / 3;
  }
};

// ---------- Weeks ----------
export const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
export const THIS_MONDAY = new Date(2026, 8, 28);
export const NEXT_MONDAY = addDays(THIS_MONDAY, 7);
export const TODAY_INDEX = 1; // Tuesday

export type Slot = { slot: SlotName; dishId: string | null };
export type Day = { date: string; slots: Slot[] };

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const MEAL_ORDER: Record<Persona["id"], string[]> = {
  anna: ["dal", "arrabbiata", "paella", "taco", "beetroot", "bolognese", "quinoa", "gnocchi"],
  jonas: ["arrabbiata", "beetroot", "dal", "bolognese", "taco", "paella", "gnocchi"],
  mia: ["quinoa", "dal", "taco", "paella", "beetroot", "bolognese", "gnocchi", "arrabbiata"],
};

export function buildWeek(p: Persona, monday: Date, offset = 0): Day[] {
  // Persona order as the tiebreak, goal fit first: the plan leans toward what matters most right now.
  const meals = MEAL_ORDER[p.id].map(dish).filter((d) => allowed(p, d) && d.kind === "meal")
    .map((d, i) => ({ d, i })).sort((a, b) => fitScore(p.goal, b.d) - fitScore(p.goal, a.d) || a.i - b.i).map((x) => x.d);
  const breakfasts = ["smoothie", "oats"].map(dish).filter((d) => allowed(p, d));
  let m = offset;
  let b = offset;
  return DAY_NAMES.map((_, i) => {
    const slots: Slot[] = (["breakfast", "lunch", "dinner"] as SlotName[]).map((slot) => {
      const on = p.schedule[slot]?.includes(i);
      if (!on) return { slot, dishId: null };
      if (slot === "breakfast") return { slot, dishId: breakfasts[b++ % breakfasts.length].id };
      return { slot, dishId: meals[m++ % meals.length].id };
    });
    return { date: iso(addDays(monday, i)), slots };
  });
}

export const fmtDay = (isoDate: string, opts: Intl.DateTimeFormatOptions = { weekday: "short", day: "numeric", month: "short" }) => {
  const [y, mo, d] = isoDate.split("-").map(Number);
  return new Date(y, mo - 1, d).toLocaleDateString("en-GB", opts);
};

// ---------- Rhythm history (last 28 days) ----------
export type RhythmDay = { date: string; state: "made" | "planned" | "none" | "away" | "today" };

export function buildRhythm(p: Persona): RhythmDay[] {
  // Deterministic pattern: planned days follow the schedule; "made" count matches rhythmMade over the last 14 planned.
  const days: RhythmDay[] = [];
  const start = addDays(NOW, -27);
  const plannedIdx = new Set<number>();
  Object.values(p.schedule).forEach((arr) => arr?.forEach((i) => plannedIdx.add(i)));
  const planned: number[] = [];
  for (let i = 0; i < 28; i++) {
    const d = addDays(start, i);
    const wd = (d.getDay() + 6) % 7;
    if (plannedIdx.has(wd) && i < 27) planned.push(i);
  }
  const last14 = planned.slice(-14);
  const missCount = 14 - p.rhythmMade;
  const missed = new Set(last14.filter((_, k) => (k * 7 + 3) % 14 < missCount));
  for (let i = 0; i < 28; i++) {
    const d = addDays(start, i);
    let state: RhythmDay["state"] = "none";
    if (i === 27) state = "today";
    else if (p.id === "anna" && i >= 3 && i <= 8) state = "away";
    else if (planned.includes(i)) state = missed.has(i) ? "planned" : "made";
    days.push({ date: iso(d), state });
  }
  return days;
}

// ---------- Delivery ----------
export const DELIVERY_OPTIONS = [
  { date: "2026-10-01", label: "Thu 1 Oct", window: "08:00–12:00" },
  { date: "2026-10-02", label: "Fri 2 Oct", window: "08:00–12:00" },
  { date: "2026-10-03", label: "Sat 3 Oct", window: "09:00–13:00" },
];
export const CUTOFF = new Date(2026, 8, 29, 23, 59);

export const PLANT_TARGET = 30;

export type ChipKey = "plants" | "fibre" | "protein" | "kcal" | "carbs" | "fat" | "iron" | "folate";
export type GoalChip = { key: ChipKey; label: string; target: string; why: string; how: string };

/**
 * The 8 goals from the Miro board "05.10.2026: Goal Generation Logic & Nutritional Macros & Science Snippets"
 * (as updated 13.10.2026). Targets are the board's per-main-meal targets; "contribution" is the board's
 * "every's contribution at N meals/week". Copy the board hasn't filled in yet (empty or duplicated messages
 * and snippets, quiz completion and plan reveal messages) is left out on purpose until it's written.
 */
export const GOALS: {
  id: Goal; group: string; label: string; short: string; hint: string; baseMeals: number;
  reasonKey: ReasonKey; chips: GoalChip[]; title: string; message: string; science: string; quotes: string[];
  contribution: string[]; daily: { protein: number; fibre: number; kcal: number };
}[] = [
  {
    id: "balanced", group: "Eat well", label: "Balanced & healthy eating", short: "Balanced eating", baseMeals: 3, reasonKey: "time",
    hint: "Eat consistently and feel good. A varied, balanced diet that fits real life.",
    title: "Your balanced plan",
    chips: [
      { key: "kcal", label: "Energy", target: "450–600 kcal per meal", why: "Energy balance: not a deficit, not a surplus.", how: "Near-full menu, about 45 of 48 dishes." },
      { key: "carbs", label: "Carbs", target: "50–80 g per meal", why: "Your main energy source, for brain and muscle.", how: "No macro filtering, variety leads." },
      { key: "protein", label: "Protein", target: "15–20 g per meal", why: "Satiety, muscle maintenance, cell repair.", how: "37 of 48 dishes hit 15 g+." },
      { key: "fibre", label: "Fibre", target: "8–10 g per meal", why: "Digestive health, stable blood sugar.", how: "46 of 48 dishes hit 8 g+." },
    ],
    message: "",
    science: "Consistent, balanced eating is one of the strongest long-term predictors of wellbeing: not perfection, not tracking, just variety. Every meal in your plan covers all the main food groups. Three meals a week already handled.",
    quotes: [],
    contribution: ["Fibre: ~33 g a week", "Protein: ~60 g a week", "Energy: ~1,461 kcal a week"],
    daily: { protein: 60, fibre: 28, kcal: 2000 },
  },
  {
    id: "gut", group: "Eat well", label: "Healthy gut", short: "Healthy gut", baseMeals: 3, reasonKey: "plants",
    hint: "Eat a varied, balanced diet consistently. Support gut health, stable energy and long-term wellbeing.",
    title: "Your plants-first plan",
    chips: [
      { key: "fibre", label: "Fibre", target: "8–12 g per meal", why: "Gut microbiome diversity, digestive health, stable blood sugar.", how: "High-fibre dishes (11 g+) come first." },
      { key: "plants", label: "Plant variety", target: "5–8 plants per dish, 30+ a week", why: "The strongest population-level predictor of gut health.", how: "All dishes are plant-based, rotated across the menu." },
      { key: "protein", label: "Protein", target: "15–20 g per meal", why: "Satiety, muscle maintenance, cell repair.", how: "Consistent, not obsessive." },
    ],
    message: "Your plan is built around eating a wide variety of plants consistently — at least 5 different plant sources per meal, across the whole week. Research shows that eating 30+ different plants per week is one of the strongest predictors of gut health and long-term energy. every meals average 6–8 plant sources per dish. Three meals a week from every already covers roughly 20 of your 30.",
    science: "Eating 30+ different plant sources per week is linked to greater microbiome diversity and more stable energy levels. Your plan is designed to get you there without counting a thing.",
    quotes: ["Variety beats perfection.", "Three plants you didn't have last week. That's the whole trick.", "Steady, not strict.", "Your gut likes routine and variety at the same time."],
    contribution: ["Fibre: ~33 g a week", "Protein: ~60 g a week", "Energy: ~1,461 kcal a week"],
    daily: { protein: 60, fibre: 28, kcal: 2000 },
  },
  {
    id: "lose", group: "Weight", label: "Lose weight", short: "Lose weight", baseMeals: 3, reasonKey: "protein",
    hint: "Sustainable weight loss through satiety, not restriction. Preserve muscle while reducing body fat gradually.",
    title: "Your weight-loss plan",
    chips: [
      { key: "protein", label: "Protein", target: "25–35 g per meal", why: "Satiety and muscle preservation in a calorie deficit.", how: "Dishes with 20 g+ come first." },
      { key: "fibre", label: "Fibre", target: "10–15 g per meal", why: "Slows digestion and extends fullness.", how: "12 g+ wherever possible." },
      { key: "kcal", label: "Energy", target: "400–550 kcal per meal", why: "A moderate deficit, not aggressive restriction.", how: "Dishes over 520 kcal only when protein or fibre justifies them." },
    ],
    message: "Your plan isn't a diet. It's replacing the decisions that usually trip you up with ones that are already made and already good.",
    science: "Protein and fibre are the two nutrients most consistently linked to satiety. Your plan prioritises both at every meal - without asking you to track, count, or restrict.",
    quotes: ["Already made, already good.", "Full and fine, that's the goal.", "No restriction, just good defaults.", "One good decision you didn't have to make."],
    contribution: ["Protein: ~72 g a week", "Fibre: ~49 g a week", "Energy: ~1,312 kcal a week"],
    daily: { protein: 100, fibre: 30, kcal: 1600 },
  },
  {
    id: "maintain", group: "Weight", label: "Maintain weight", short: "Maintain weight", baseMeals: 3, reasonKey: "protein",
    hint: "Maintain a healthy weight effortlessly. Smart, consistent eating without making food a project.",
    title: "Your steady plan",
    chips: [
      { key: "protein", label: "Protein", target: "18–25 g per meal", why: "Muscle maintenance and satiety.", how: "Dishes with 18 g+ come first." },
      { key: "fibre", label: "Fibre", target: "8–12 g per meal", why: "Digestive health, steady energy, mild satiety support.", how: "8 g+ wherever possible." },
      { key: "kcal", label: "Energy", target: "450–600 kcal per meal", why: "Gentle balance: not a deficit, not a surplus.", how: "Full menu variety." },
    ],
    message: "Your plan isn't about restriction — it's about making the good choice the easy choice. Three meals a week from every means three decisions already made well. The rest of your eating doesn't need to change.",
    science: "The research on sustainable weight maintenance consistently points to the same thing: consistency, not restriction. People who maintain a healthy weight long-term tend to eat a varied, satisfying diet — not a perfect one. Your plan is built around that.",
    quotes: ["Good choice, easy choice.", "Consistency is the whole plan.", "The 80 is already sorted.", "Nothing to keep up with, just meals."],
    contribution: ["Energy: ~1,458 kcal a week", "Protein: ~60 g a week", "Fibre: ~34 g a week"],
    daily: { protein: 75, fibre: 28, kcal: 2000 },
  },
  {
    id: "lean", group: "Fitness", label: "Stay lean & healthy", short: "Stay lean", baseMeals: 4, reasonKey: "protein",
    hint: "Support muscle recovery through consistent protein across the week.",
    title: "Your protein plan",
    chips: [
      { key: "protein", label: "Protein", target: "25–40 g per meal", why: "Muscle protein synthesis, best when spread across meals.", how: "Built from the high-protein dishes (25 g+), two at a time." },
      { key: "kcal", label: "Energy", target: "450–600 kcal per meal", why: "Too little energy holds back recovery.", how: "Most dishes sit in this range." },
      { key: "carbs", label: "Carbs", target: "50–80 g per meal", why: "Primary fuel for training.", how: "Carb-containing dishes are not deprioritised." },
      { key: "fibre", label: "Fibre", target: "8–10 g per meal", why: "Gut health, recovery, digestion.", how: "46 of 48 dishes hit 8 g+." },
    ],
    message: "Your plan is built around consistent protein - not one high-protein meal, but protein distributed across the week so your muscles have what they need when they need it. Every high-protein meal in your plan hits 25g+. Four of these a week from every gives you 100g of protein just from your main meals.",
    science: "",
    quotes: ["Fuel the work you're putting in.", "Recovery starts with dinner.", "Steady protein, steady progress.", "Training days, sorted."],
    contribution: ["Protein: ~113 g a week", "Energy: ~2,096 kcal a week", "Carbs: ~220 g a week"],
    daily: { protein: 135, fibre: 25, kcal: 2500 },
  },
  {
    id: "energy", group: "Fitness", label: "More energy", short: "More energy", baseMeals: 4, reasonKey: "time",
    hint: "Enough calories and carbs for consistent training performance and recovery.",
    title: "Your fuel plan",
    chips: [
      { key: "kcal", label: "Energy", target: "500–700 kcal per meal", why: "Under-fuelling reduces training output and recovery.", how: "Dishes under 450 kcal are left out." },
      { key: "carbs", label: "Carbs", target: "70–100 g per meal", why: "Primary fuel for exercise.", how: "Carb-rich dishes come first." },
      { key: "protein", label: "Protein", target: "20–30 g per meal", why: "Recovery and muscle maintenance.", how: "20 g+ still matters." },
      { key: "fat", label: "Fat", target: "15–25 g per meal", why: "Energy density, fat-soluble vitamins.", how: "Balanced, not trimmed." },
    ],
    message: "Your plan is built around fuelling active days - enough calories to train, recover, and not run on empty by 4pm. Every meal in your plan is calorie-adequate without being heavy. Four meals a week from every covers around 2,000 calories of solid, whole-food energy.",
    science: "Carbohydrates are your body's preferred fuel for training - not something to avoid. Your plan keeps calories adequate so you can train well, recover properly, and not run on empty by mid-afternoon. Food is fuel. Your plan treats it that way.",
    quotes: ["Food is fuel.", "Not running on empty today.", "Enough is the goal.", "Train, eat, recover, repeat."],
    contribution: ["Energy: ~2,324 kcal a week", "Protein: ~89 g a week", "Carbs: ~272 g a week"],
    daily: { protein: 110, fibre: 28, kcal: 2800 },
  },
  {
    id: "muscle", group: "Fitness", label: "Build muscle", short: "Build muscle", baseMeals: 4, reasonKey: "protein",
    hint: "Support muscle building and training performance at the same time.",
    title: "Your build plan",
    chips: [
      { key: "protein", label: "Protein", target: "30–40 g per meal", why: "Muscle protein synthesis.", how: "Dishes with 25 g+ and 500 kcal+ come first." },
      { key: "kcal", label: "Energy", target: "550–700 kcal per meal", why: "A deficit holds back muscle building, even with enough protein.", how: "Dishes under 450 kcal are left out." },
      { key: "carbs", label: "Carbs", target: "70–100 g per meal", why: "Training fuel.", how: "65–70 g carbs per meal on average." },
      { key: "fat", label: "Fat", target: "18–25 g per meal", why: "Energy density and hormonal function.", how: "Balanced, not trimmed." },
    ],
    message: "Building and fuelling at the same time is the hardest combination to get right. Your plan balances high protein with adequate calories — so you're not sacrificing one for the other. Four meals a week from every gives you 100g+ protein and 2,000+ calories from whole, plant-based food.",
    science: "Building muscle and maintaining training performance at the same time requires both: enough protein for synthesis, and enough calories to prevent your body from breaking muscle down for fuel. Cut calories too hard while training and you lose what you're trying to build. Your plan doesn't ask you to choose.",
    quotes: ["You don't have to choose.", "Build and fuel.", "Strong week ahead.", "Recovery is part of training."],
    contribution: ["Protein: ~117 g a week", "Energy: ~2,128 kcal a week", "Carbs: ~252 g a week"],
    daily: { protein: 135, fibre: 28, kcal: 3100 },
  },
  {
    id: "postpartum", group: "Postpartum", label: "Support postpartum", short: "Postpartum", baseMeals: 3, reasonKey: "plants",
    hint: "Support recovery, replenish nutrient stores and, if breastfeeding, sustain milk production.",
    title: "Your postpartum plan",
    chips: [
      { key: "iron", label: "Iron", target: "3–5 mg per meal", why: "Depleted during pregnancy and delivery; prevents fatigue.", how: "Lentil-based dishes come first." },
      { key: "folate", label: "Folate", target: "100–150 µg per meal", why: "Cell production; supports the baby via breast milk.", how: "Lentils and greens are prioritised." },
      { key: "kcal", label: "Energy", target: "500–650 kcal per meal", why: "Milk production, recovery, fatigue prevention.", how: "Adequate, not restricted." },
      { key: "protein", label: "Protein", target: "20–25 g per meal", why: "Tissue repair and milk protein.", how: "20 g+ per meal." },
      { key: "fibre", label: "Fibre", target: "10–12 g per meal", why: "Digestive comfort, a common postpartum concern.", how: "High-fibre dishes come first." },
    ],
    message: "Your plan is built around what your body actually needs right now - which is different from standard healthy eating. Whether you're breastfeeding or recovering, the focus is on iron-rich foods, folate, and enough calories to sustain you through this stage. Every meal in your plan is chosen with that in mind.",
    science: "Iron, folate, and adequate calories are the three nutrients most critical in the postpartum period. Your plan prioritises all three from whole plant-based sources.",
    quotes: ["One less thing to think about.", "Looked after, today too.", "Nourished, not perfect.", "Small meals, big help."],
    contribution: ["Protein: ~72–97 g a week", "Energy: ~1,311–1,748 kcal a week", "Fibre: ~53–71 g a week"],
    daily: { protein: 78, fibre: 28, kcal: 2250 },
  },
];
export const goalInfo = (g: Goal) => GOALS.find((x) => x.id === g)!;
/** Goal group colour (background) — pair only with ink, body or stone text for WCAG 2.1 AA. */
const GOAL_BG: Record<string, string> = { "Eat well": "bg-goal-eat", Weight: "bg-goal-weight", Fitness: "bg-goal-fitness", Postpartum: "bg-goal-postpartum" };
export const goalBg = (g: Goal) => GOAL_BG[goalInfo(g).group];
export const groupBg = (group: string) => GOAL_BG[group];
/** Q1 answer → goal group colour (quiz tiles). */
export const Q1_GROUP: Record<string, string> = { eat: "Eat well", gut: "Eat well", lose: "Weight", fitness: "Fitness", postpartum: "Postpartum" };

/** Check-in quote for a week; goals without board copy yet get a neutral line. */
export const goalQuote = (g: Goal, n: number) => { const q = goalInfo(g).quotes; return q.length ? q[n % q.length] : "Small steps count."; };
/** Reason line for a dish. Without a goal (new customer, no quiz yet) it stays goal-neutral. */
export const reasonFor = (d: Dish, g: Goal | null) => (g ? d.reason[goalInfo(g).reasonKey] : d.reason.time);

// Dev-only guard: a persona's goal, meals a week and plan must follow from its quiz answers.
if (process.env.NODE_ENV !== "production") {
  for (const p of PERSONAS) {
    const goal = goalFromQuiz(p.quiz);
    if (goal !== p.goal) console.warn(`[persona] ${p.name}: goal "${p.goal}" but the quiz gives "${goal}"`);
    if (goalInfo(p.goal).label !== p.goalLabel) console.warn(`[persona] ${p.name}: goalLabel "${p.goalLabel}" doesn't match "${goalInfo(p.goal).label}"`);
    const mains = (["lunch", "dinner"] as SlotName[]).reduce((a, s) => a + (p.schedule[s]?.length ?? 0), 0);
    if (p.quiz.meals && mains !== Math.max(3, p.quiz.meals)) console.warn(`[persona] ${p.name}: ${mains} main meals planned, quiz says ${p.quiz.meals}`);
  }
}

/** Title and sub-line for "Your week", written from the meals actually in that week (no fixed theme copy). */
const SHORT: Record<string, string> = { dal: "dal", paella: "paella", taco: "tacos", bolognese: "bolognese", arrabbiata: "arrabbiata", gnocchi: "gnocchi", "peas-love": "pea pesto pasta", quinoa: "quinoa", beetroot: "beetroot" };
const SALADS = ["quinoa", "beetroot"];
const NUM = ["no", "one", "two", "three", "four", "five", "six", "seven"];
const listOf = (xs: string[]) => xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`;
export function weekCopy(dishIds: string[]) {
  const meals = [...new Set(dishIds)].map(dish).filter((d) => d && d.kind === "meal");
  const warm = meals.filter((d) => !SALADS.includes(d.id));
  const salads = meals.filter((d) => SALADS.includes(d.id));
  const warmPart = warm.length > 3 ? `${NUM[warm.length] ?? warm.length} warm bowls` : listOf(warm.map((d) => SHORT[d.id] ?? d.name.toLowerCase()));
  const saladPart = salads.length === 1 ? "a crisp salad" : salads.length ? `${NUM[salads.length]} crisp salads` : "";
  const t = [warmPart, saladPart].filter(Boolean).join(warm.length > 0 && warm.length <= 3 && warm.length > 1 ? ", plus " : " and ");
  const title = t ? t.charAt(0).toUpperCase() + t.slice(1) : "Your meals";
  const plants = meals.reduce((a, d) => a + d.plants, 0);
  const minutes = Math.max(0, ...meals.map((d) => d.minutes));
  const sub = meals.length ? `${plants} plants across ${meals.length} meals, and none takes more than ${minutes} minutes to heat.` : "";
  return { title, sub };
}
