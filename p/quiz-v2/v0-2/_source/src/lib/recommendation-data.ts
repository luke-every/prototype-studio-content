import type { Meal, Upsell } from "./recommendation";

// TODO(lift): sample data — replace with the Fact Sheet (fake = plant-based meat, priced a tier up) "ALL PRODUCTS" tab and Reviews.io ratings (21 Oct 2026)
export const MEALS: Meal[] = [
  { sku: "F4005Z", fake: false, name: "Green Forest Bowl", cat: "Signature Bowls", cuis: "Mediterranean", spice: "nein", kcal: 599, carb: 44.1, fib: 9.5, prot: 20.3, sugar: 4.5, contains: ["Cereals containing gluten"], rating: 4.42, reviews: 582 },
  { sku: "F4010Z", fake: false, name: "Dal Delight", cat: "Currys & Dals", cuis: "Indian", spice: "nein", kcal: 491, carb: 53.6, fib: 16.2, prot: 23.9, sugar: 10.4, contains: [], rating: 4.57, reviews: 658 },
  { sku: "F4011Z", fake: false, name: "Golden Curry", cat: "Currys & Dals", cuis: "Indian", spice: "nein", kcal: 480, carb: 51, fib: 14, prot: 14.5, sugar: 13, contains: [], rating: 4.64, reviews: 818 },
  { sku: "F4012Z", fake: false, name: "Green Boost", cat: "Signature Bowls", cuis: "Mediterranean", spice: "nein", kcal: 513, carb: 32.4, fib: 11.3, prot: 20.3, sugar: 8.1, contains: [], rating: 4.18, reviews: 489 },
  { sku: "F4015Z", fake: true, name: "Bami Goreng", cat: "Pasta & Noodles", cuis: "Asian", spice: "a little", kcal: 468, carb: 56.7, fib: 10.8, prot: 27, sugar: 9, contains: ["Cereals containing gluten", "Soybeans"], rating: 4.51, reviews: 635 },
  { sku: "F4016Z", fake: true, name: "Tikka Masala", cat: "Currys & Dals", cuis: "Indian", spice: "a little", kcal: 491, carb: 51.3, fib: 8.6, prot: 23.4, sugar: 10.4, contains: ["Soybeans"], rating: 4.56, reviews: 629 },
  { sku: "F4017Z", fake: true, name: "Better Butter Chicken", cat: "Currys & Dals", cuis: "Indian", spice: "nein", kcal: 460, carb: 50, fib: 9, prot: 23.5, sugar: 10.5, contains: ["Soybeans"], rating: 4.47, reviews: 116 },
  { sku: "F4018Z", fake: false, name: "Golden Glow Bowl", cat: "Signature Bowls", cuis: "Fusion", spice: "nein", kcal: 531, carb: 49.5, fib: 11.3, prot: 14.9, sugar: 13.1, contains: [], rating: 4.45, reviews: 74 },
  { sku: "F4027Z", fake: false, name: "Brilliant Bolognese", cat: "Pasta & Noodles", cuis: "Italian", spice: "nein", kcal: 520, carb: 81, fib: 10, prot: 20, sugar: 15.5, contains: ["Cereals containing gluten"], rating: 4.63, reviews: 767 },
  { sku: "F4028Z", fake: false, name: "Farmhouse Ratatouille", cat: "Signature Bowls", cuis: "Mediterranean", spice: "nein", kcal: 387, carb: 45.5, fib: 9, prot: 9.5, sugar: 18.9, contains: ["Cereals containing gluten"], rating: 4.42, reviews: 198 },
  { sku: "F4043Z", fake: false, name: "Peas & Love", cat: "Pasta & Noodles", cuis: "Italian", spice: "nein", kcal: 545, carb: 67, fib: 11.5, prot: 22, sugar: 9, contains: ["Cereals containing gluten"], rating: 4.59, reviews: 759 },
  { sku: "F4044Z", fake: false, name: "Naked Taco", cat: "Signature Bowls", cuis: "Latin American Food", spice: "very", kcal: 495, carb: 72.5, fib: 12.2, prot: 15.3, sugar: 14.4, contains: ["Mustard"], rating: 4.57, reviews: 343 },
  { sku: "F4068Z", fake: false, name: "Pasta Arrabbiata", cat: "Pasta & Noodles", cuis: "Italian", spice: "a little", kcal: 455, carb: 70.5, fib: 9.5, prot: 15.5, sugar: 13, contains: ["Cereals containing gluten"], rating: 4.3, reviews: 237 },
  { sku: "F4076Z", fake: false, name: "Garden Gnocchi", cat: "Pasta & Noodles", cuis: "Italian", spice: "nein", kcal: 468, carb: 72.9, fib: 9, prot: 15.8, sugar: 11.3, contains: ["Cereals containing gluten"], rating: 4.6, reviews: 312 },
  { sku: "F4088Z", fake: true, name: "Red Curry", cat: "Currys & Dals", cuis: "Asian", spice: "a little", kcal: 509, carb: 52.2, fib: 8.6, prot: 24.3, sugar: 15.3, contains: ["Cereals containing gluten", "Mustard", "Soybeans"], rating: 4.53, reviews: 253 },
  { sku: "F4092Z", fake: false, name: "Green Curry Noodles", cat: "Pasta & Noodles", cuis: "Asian", spice: "a little", kcal: 477, carb: 64.4, fib: 8.6, prot: 14, sugar: 8.1, contains: ["Cereals containing gluten", "Soybeans"], rating: 4.5, reviews: 270 },
  { sku: "F4097Z", fake: false, name: "Ramen Noodles", cat: "Pasta & Noodles", cuis: "Asian", spice: "a little", kcal: 440, carb: 63.3, fib: 9.4, prot: 18.2, sugar: 8.8, contains: ["Cereals containing gluten", "Soybeans"], rating: 3.9, reviews: 240 },
  { sku: "F4098Z", fake: false, name: "Potato Panorama", cat: "Signature Bowls", cuis: "Mediterranean", spice: "nein", kcal: 485, carb: 60, fib: 9, prot: 9, sugar: 14.5, contains: ["Cereals containing gluten"], rating: 4.22, reviews: 161 },
  { sku: "F4099Z", fake: false, name: "Coco Curry Pasta", cat: "Pasta & Noodles", cuis: "Fusion", spice: "nein", kcal: 540, carb: 71.1, fib: 11.7, prot: 18.5, sugar: 11.3, contains: ["Cereals containing gluten", "Soybeans"], rating: 4.33, reviews: 224 },
  { sku: "F4103Z", fake: false, name: "Mushroom Spätzle", cat: "Pasta & Noodles", cuis: "German", spice: "nein", kcal: 420, carb: 56, fib: 11, prot: 14, sugar: 11.5, contains: ["Cereals containing gluten", "Soybeans"], rating: 4.03, reviews: 215 },
  { sku: "F4104Z", fake: true, name: "Chili sin Carne", cat: "Signature Bowls", cuis: "Latin American Food", spice: "a little", kcal: 446, carb: 49.5, fib: 15.3, prot: 24.8, sugar: 16.7, contains: ["Mustard", "Soybeans"], rating: 4.36, reviews: 123 },
  { sku: "F4110Z", fake: true, name: "Paella Del Sol", cat: "Signature Bowls", cuis: "Mediterranean", spice: "nein", kcal: 445, carb: 48.5, fib: 11, prot: 19, sugar: 14, contains: ["Soybeans"], rating: 4.33, reviews: 52 },
  { sku: "F4111Z", fake: true, name: "Teriyaki Wok", cat: "Pasta & Noodles", cuis: "Asian", spice: "a little", kcal: 520, carb: 64, fib: 10, prot: 27, sugar: 13, contains: ["Cereals containing gluten", "Soybeans"], rating: 4.03, reviews: 65 },
  { sku: "F4112Z", fake: true, name: "Umami Rice", cat: "Signature Bowls", cuis: "Asian", spice: "nein", kcal: 423, carb: 59.4, fib: 10.8, prot: 27.5, sugar: 11.7, contains: ["Cereals containing gluten", "Soybeans"], rating: 4.31, reviews: 238 },
  { sku: "F4113Z", fake: true, name: "Nasi Goreng", cat: "Signature Bowls", cuis: "Asian", spice: "nein", kcal: 527, carb: 57.2, fib: 11.7, prot: 25.7, sugar: 9, contains: ["Cereals containing gluten", "Soybeans"], rating: 4.22, reviews: 45 },
  { sku: "F4114Z", fake: false, name: "Edamame Zen", cat: "Pasta & Noodles", cuis: "Asian", spice: "nein", kcal: 423, carb: 67.1, fib: 11.3, prot: 20.3, sugar: 13.1, contains: ["Cereals containing gluten", "Soybeans"], rating: 3.64, reviews: 146 },
  { sku: "F4116Z", fake: true, name: "Spätzle Goulash", cat: "Currys & Dals", cuis: "German", spice: "nein", kcal: 518, carb: 46.8, fib: 9.5, prot: 25.7, sugar: 10.4, contains: ["Cereals containing gluten", "Soybeans"], rating: 4.23, reviews: 39 },
  { sku: "F4117Z", fake: false, name: "Mushroom Gnocchi", cat: "Pasta & Noodles", cuis: "Italian", spice: "nein", kcal: 482, carb: 71.1, fib: 9.5, prot: 17.6, sugar: 12.2, contains: ["Cereals containing gluten", "Mustard", "Soybeans"], rating: 4.29, reviews: 41 },
  { sku: "F4118Z", fake: false, name: "Pasta Rustica", cat: "Pasta & Noodles", cuis: "Italian", spice: "nein", kcal: 383, carb: 52.7, fib: 8.1, prot: 14, sugar: 14, contains: ["Cereals containing gluten", "Soybeans"], rating: 4.18, reviews: 28 },
  { sku: "F4119Z", fake: true, name: "Japanese Sweet Curry", cat: "Currys & Dals", cuis: "Asian", spice: "very", kcal: 450, carb: 53, fib: 12, prot: 25, sugar: 17, contains: ["Cereals containing gluten", "Soybeans"], rating: 4.08, reviews: 26 },
  { sku: "F4120Z", fake: false, name: "Creamy Mango Curry", cat: "Currys & Dals", cuis: "Fusion", spice: "a little", kcal: 400, carb: 46, fib: 9.5, prot: 10.5, sugar: 21, contains: [], rating: 3.74, reviews: 27 },
  { sku: "F4123Z", fake: true, name: "Creamy Paprika Pasta", cat: "Pasta & Noodles", cuis: "Fusion", spice: "nein", kcal: 446, carb: 50.4, fib: 8.6, prot: 21.2, sugar: 11.3, contains: ["Cereals containing gluten", "Soybeans"], rating: 4.1, reviews: 29 },
  { sku: "F4124Z", fake: false, name: "Lemon Zucchini Gnocchi", cat: "Pasta & Noodles", cuis: "Fusion", spice: "nein", kcal: 473, carb: 67.5, fib: 10.4, prot: 14.9, sugar: 10.4, contains: ["Cereals containing gluten", "Mustard", "Soybeans"], rating: 4.09, reviews: 23 },
  { sku: "F4125Z", fake: true, name: "Creamy Fricassée", cat: "Signature Bowls", cuis: "German", spice: "nein", kcal: 450, carb: 59.9, fib: 8.6, prot: 20.7, sugar: 6.8, contains: ["Cereals containing gluten", "Soybeans"], rating: 4.1, reviews: 21 },
  { sku: "F5000Z", fake: false, name: "Peanut Noodles", cat: "Pasta & Noodles", cuis: "Asian", spice: "nein", kcal: 491, carb: 48.2, fib: 8.1, prot: 20.3, sugar: 12.6, contains: ["Cereals containing gluten", "Peanuts", "Soybeans"], rating: 4.12, reviews: 52 },
  { sku: "F5001Z", fake: true, name: "Creamy Peanut Curry", cat: "Currys & Dals", cuis: "Indian", spice: "nein", kcal: 513, carb: 46.8, fib: 7.2, prot: 24.8, sugar: 13.5, contains: ["Cereals containing gluten", "Peanuts", "Soybeans"], rating: 5, reviews: 5 },
  { sku: "F5002Z", fake: false, name: "Spiced Peanut Couscous", cat: "Currys & Dals", cuis: "Fusion", spice: "nein", kcal: 590, carb: 60.8, fib: 10.4, prot: 23.4, sugar: 19.8, contains: ["Cereals containing gluten", "Peanuts"], rating: 4, reviews: 8 },
  { sku: "F5003Z", fake: true, name: "Lemon Cashew Pasta", cat: "Pasta & Noodles", cuis: "Fusion", spice: "nein", kcal: 572, carb: 52.7, fib: 11.7, prot: 36.5, sugar: 9.9, contains: ["Celery", "Cereals containing gluten", "Soybeans", "Tree nuts"], rating: 3.83, reviews: 12 },
  { sku: "F5004Z", fake: true, name: "Paprika Thai Ragout", cat: "Pasta & Noodles", cuis: "Asian", spice: "very", kcal: 510, carb: 66.5, fib: 13, prot: 25, sugar: 11.5, contains: ["Cereals containing gluten", "Soybeans"], rating: 4.44, reviews: 18 },
  { sku: "F5005Z", fake: true, name: "Lemongrass Thai Ragout", cat: "Pasta & Noodles", cuis: "Asian", spice: "very", kcal: 445, carb: 64, fib: 8, prot: 20.5, sugar: 9.5, contains: ["Cereals containing gluten", "Sesame", "Soybeans"], rating: 4.49, reviews: 45 },
  { sku: "F5006Z", fake: true, name: "Smoky Lentil Stew", cat: "Currys & Dals", cuis: "Mediterranean", spice: "nein", kcal: 374, carb: 34.7, fib: 22.1, prot: 23.9, sugar: 9.9, contains: ["Cereals containing gluten", "Soybeans"], rating: 4.7, reviews: 20 },
  { sku: "F5007Z", fake: true, name: "Chimichurri Glow", cat: "Signature Bowls", cuis: "Latin American Food", spice: "nein", kcal: 522, carb: 55.8, fib: 10.4, prot: 31.5, sugar: 8.1, contains: ["Cereals containing gluten", "Soybeans"], rating: 4.6, reviews: 5 },
  { sku: "F6000Z", fake: false, name: "Sesame Fried Rice", cat: "Signature Bowls", cuis: "Asian", spice: "nein", kcal: 748, carb: 80.8, fib: 12.4, prot: 19.6, sugar: 12, contains: ["Cereals containing gluten", "Sesame", "Soybeans", "Tree nuts"], rating: 3.92, reviews: 24 },
  { sku: "F6001Z", fake: false, name: "Red Pesto Gnocchi", cat: "Pasta & Noodles", cuis: "Italian", spice: "nein", kcal: 597, carb: 71.2, fib: 17.6, prot: 16.4, sugar: 12.8, contains: ["Cereals containing gluten", "Tree nuts"], rating: 3.75, reviews: 20 },
  { sku: "F6002Z", fake: false, name: "Pearl Pasta Salad", cat: "Salads", cuis: "Mediterranean", spice: "nein", kcal: 440, carb: 47.2, fib: 13.2, prot: 18.8, sugar: 11.6, contains: ["Cereals containing gluten", "Mustard", "Soybeans", "Tree nuts"], rating: 4.5, reviews: 12 },
  { sku: "F6003Z", fake: false, name: "Sesame Quinoa Salad", cat: "Salads", cuis: "Mediterranean", spice: "nein", kcal: 525, carb: 56.7, fib: 19.6, prot: 20.3, sugar: 13.3, contains: ["Sesame", "Soybeans"], rating: 3.67, reviews: 12 },
  { sku: "F6005Z", fake: false, name: "Crunchy Beetroot Salad", cat: "Salads", cuis: "Mediterranean", spice: "nein", kcal: 434, carb: 43.1, fib: 22.8, prot: 14, sugar: 7.7, contains: ["Tree nuts"], rating: 4.5, reviews: 10 },
];

/** Add-on prices at the 12, 15, 20 and 25-meal tiers */
const SMOOTHIE = { 12: 11.69, 15: 11.04, 20: 10.39, 25: 9.74 };
const CUBES = { 12: 17.99, 15: 16.99, 20: 15.99, 25: 14.99 };
const BREAKFAST_1499 = { 12: 13.49, 15: 12.74, 20: 11.99, 25: 11.24 };
const BREAKFAST_1399 = { 12: 12.59, 15: 11.89, 20: 11.19, 25: 10.49 };

// TODO(lift): sample data — replace with the add-on sheet (allergens, sugar per serving) and the pricing sheet (DE)
export const UPSELLS: Record<string, Upsell> = {
  boonian: { name: "Boonian Crumbles Protein", slug: "boonian-crumble-protein", price: 2.69, sugar: 2.0, treat: false, contains: ["Soybeans"] },
  planted: { name: "Planted. Pulled Protein", slug: "planted-pulled-protein", price: 2.69, sugar: 0.7, treat: false, contains: ["Soybeans"] },
  dg3: { name: "Daily Greens smoothie 3-pack", slug: "daily-greens-trio", price: 12.99, tiers: SMOOTHIE, sugar: 28.5, treat: false, contains: [] },
  mt3: { name: "Mango Tango smoothie 3-pack", slug: "mango-tango-trio", price: 12.99, tiers: SMOOTHIE, sugar: 28.0, treat: false, contains: [] },
  tb3: { name: "Triple Berry smoothie 3-pack", slug: "triple-berry-trio", price: 12.99, tiers: SMOOTHIE, sugar: 26.1, treat: false, contains: [] },
  herbal: { name: "Herbal Ritual Cubes", slug: "herbal-ritual-cubes", price: 19.99, tiers: CUBES, sugar: 1.7, treat: false, contains: [] },
  ginger: { name: "Ginger Ritual Cubes", slug: "ginger-ritual-cubes", price: 19.99, tiers: CUBES, sugar: 3.0, treat: false, contains: [] },
  turmeric: { name: "Turmeric Ritual Cubes", slug: "turmeric-ritual-cubes", price: 19.99, tiers: CUBES, sugar: 3.0, treat: false, contains: [] },
  berrycubes: { name: "Berry Ritual Cubes", slug: "berry-ritual-cubes", price: 19.99, tiers: CUBES, sugar: 2.4, treat: false, contains: [] },
  redberry: { name: "Red Berry Porridge", slug: "red-berry-porridge", price: 14.99, tiers: BREAKFAST_1499, sugar: 4.7, treat: false, contains: ["Soybeans"] },
  granola: { name: "Pistachio Pecan Granola", slug: "pistachio-pecan-granola", price: 14.99, tiers: BREAKFAST_1499, sugar: 6.0, treat: false, contains: ["Tree nuts", "Sesame"] },
  muesli: { name: "Vanilla Hazelnut Müsli", slug: "vanilla-hazelnut-muesli", price: 13.99, tiers: BREAKFAST_1399, sugar: 4.6, treat: false, contains: ["Soybeans", "Tree nuts"] },
  porridge: { name: "Apple Cinnamon Porridge", slug: "apple-cinnamon-porridge", price: 13.99, tiers: BREAKFAST_1399, sugar: 4.7, treat: false, contains: [] },
  bites: { name: "Épique 9 Bites Box", slug: "raw-cakes-9-bites-box", price: 17.99, sugar: 4.2, treat: true, contains: ["Tree nuts", "Peanuts", "Sesame"] },
  chili: { name: "Chili Crisp Oil", slug: "chili-crisp-oil", price: 8.99, sugar: 0.4, treat: false, contains: ["Cereals containing gluten", "Soybeans", "Sesame"] },
  crumbles: { name: "3 crumbles", slug: "crumble-crush-bundle", price: 7.47, sugar: 10.2, treat: true, contains: [] },
  chocball: { name: "Swedish Chocolate Ball", slug: "swedish-chocolate-ball", price: 2.19, sugar: 4.0, treat: true, contains: [] },
};

/** Meal SKUs in the allergen-safe "Free From 12" box: none of the 14 EU allergens. Proposal for O14 */
// TODO(lift): sample data — replace with the fallback bundle once O14 is decided
export const FREE_FROM_12: [sku: string, qty: number][] = [
  ["F4011Z", 3],
  ["F4010Z", 3],
  ["F4018Z", 2],
  ["F4012Z", 2],
  ["F4120Z", 2],
];
