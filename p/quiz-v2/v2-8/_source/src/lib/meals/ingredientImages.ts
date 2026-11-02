// PROTOTYPE DEVIATION: photos for the recipe modal's key ingredients, matched by the name in the story's highlights.
// TODO(lift): replace with each ingredient's image from the CMS

const FILES = [
  "BOONIAN crumbles", "Hokkaido pumpkin", "Romanesco", "Soy & vegetable broth", "Thai paste", "almonds", "aromatic spices", "asparagus", "basil", "beetroot", "bell pepper", "black beans", "bok choy",
  "broccoli", "carrots", "cashews", "cauliflower", "cherry tomatoes", "chickpeas", "chili", "chimichurri", "coconut milk", "couscous", "edamame", "fried onions", "gnocchi",
  "green beans", "green curry", "hazelnuts", "lemon tahini dressing", "lemon", "lemongrass", "lentils", "mango", "mint", "mung bean sprouts", "mushrooms", "olives",
  "pak choi", "paprika", "peanut paste", "peanuts", "pearl pasta", "peas", "pistachios", "planted.pulled", "potatoes", "pumpkin seeds", "quinoa",
  "red rice", "roasted eggplant", "savoy cabbage", "sesame oil", "snap peas", "snow peas", "soybeans", "spinach", "spätzle", "sweet corn", "sweet potato",
  "tomato sauce", "turmeric & ginger", "wild rice", "yellow carrots", "zucchini",
];

// Story names that differ from a file name
const ALIASES: Record<string, string> = {
  "boonian": "BOONIAN crumbles",
  "chilli": "chili",
  "soy and vegetable broth": "Soy & vegetable broth",
  "bell peppers": "bell pepper",
  "grilled bell pepper": "bell pepper",
  "grilled zucchini": "zucchini",
  "green/string beans": "green beans",
  "string beans": "green beans",
  "lemongrass purée": "lemongrass",
  "mu-err-mushrooms": "wood ear/Mu-Err mushrooms",
  "wood ear mushroom": "wood ear/Mu-Err mushrooms",
  "wood-ear mushroom": "wood ear/Mu-Err mushrooms",
  "planted": "planted.pulled",
  "plant-based protein": "planted.pulled",
  "soybean kernels": "soybeans",
  "turmeric": "turmeric & ginger",
  "wildreis": "wild rice",
  "sweet potatoes": "sweet potato",
  "eggplant": "roasted eggplant",
  "kale": "placeholder-1",
  "parsnip": "placeholder-3",
};

const clean = (name: string): string => name.trim().replace(/:$/, "").toLowerCase();
const byName = new Map(FILES.map((f) => [f.toLowerCase(), f]));

/** The photo path (relative to the site root) for a key ingredient, or undefined when there isn't one yet. */
export function ingredientImage(name: string): string | undefined {
  const key = clean(name);
  const file = ALIASES[key] ?? byName.get(key) ?? byName.get(key.replace(/s$/, "")) ?? byName.get(`${key}s`);
  if (!file) return undefined;
  return encodeURI(`img/ingredients/${file}.webp`);
}

/** Every ingredient photo, so they can all be fetched up front (about 1MB in total). */
export const INGREDIENT_IMAGE_PATHS: string[] = FILES.map((f) => encodeURI(`img/ingredients/${f}.webp`));
