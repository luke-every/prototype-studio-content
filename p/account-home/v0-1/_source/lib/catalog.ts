// The full Every menu as shown on every-foods.com/en/account/all-meals (read 30 Sep 2026, logged-in account).
// Names, descriptions, prices, macros, ratings, badges and category membership are copied from the live page.
// Images are hotlinked from Every's public CDNs (Storyblok / Shopify); nothing is downloaded or stored here.
// Allergens, base, spiciness and "recipe without" tags are NOT on the live cards; they are derived from the
// product name/description for the prototype and must not be read as real allergen information.

import type { Allergen, Dish } from "./data";

export type CatId = "latest" | "pasta" | "curries" | "signature" | "protein" | "breakfast" | "sweet" | "toppings" | "merch";

export const CATS: { id: CatId; label: string }[] = [
  { id: "latest", label: "Latest Additions" },
  { id: "pasta", label: "Pasta & Noodles" },
  { id: "curries", label: "Curries & Dals" },
  { id: "signature", label: "Signature Bowls" },
  { id: "protein", label: "High Protein Bowls" },
  { id: "breakfast", label: "Breakfast" },
  { id: "sweet", label: "Sweet Snacks" },
  { id: "toppings", label: "Toppings" },
  { id: "merch", label: "Merch" },
];

const SB = "https://a.storyblok.com/f/291086118523370/";
const SH = "https://cdn.shopify.com/s/files/1/0228/6528/1104/files/";
const img = (p: string) => (p.startsWith("SHOP:") ? `${SH}${p.slice(5)}?width=600` : `${SB}${p}/m/600x0`);

// [id, name, desc, price, oldPrice, protein, kcal, carbs, fat, rating, badge, categories, image]
type Row = [string, string, string, number, number | null, number | null, number | null, number | null, number | null, number, string | null, string, string];
// Category codes: L latest · P pasta · C curries · S signature · H high-protein · B breakfast · W sweet · T toppings · M merch
const ROWS: Row[] = [
  ["korean-fried-rice", "Korean Fried Rice", "Korean fried rice with veggies & plant protein", 7.99, 9.99, 25.7, 423, 48.6, 11.3, 0, "New", "LS", "2000x2000/eeab783438/korean-fried-rice.jpg"],
  ["clean-green-bowl", "Clean Green Bowl", "Green bowl with quinoa, broccoli & edamame", 6.99, 8.99, 23, 401, 46.8, 10.8, 0, "New", "LS", "2000x2000/8a9e68d46b/clean-green-bowl.jpg"],
  ["balsamic-tomato-pan", "Balsamic Tomato Pan", "Spelt with balsamic tomato & sweet potato", 6.99, 8.99, 16.2, 482, 59.9, 17.6, 0, "New", "LS", "1080x1080/f662cc47d9/balsamic-tomato-pan-topshot.png"],
  ["spiced-peanut-couscous", "Spiced Peanut Couscous", "Couscous with peanut, veggies & chickpeas", 6.99, 8.99, 23.4, 590, 60.7, 25.6, 3.5, "New", "LS", "2000x2000/c5ff773afd/every_peanut_couscous_nuts-en.png"],
  ["lemon-cashew-pasta", "Lemon Cashew Pasta", "Lemon cashew pasta with veggies & protein", 7.99, 9.99, 36.4, null, 52.6, 21.15, 4.0, "New", "LP", "2000x2000/814f8ba60a/every_lemon_cashew_pasta-nuts-en.png"],
  ["chimichurri-glow", "Chimichurri Glow", "Chimichurri bowl with quinoa & veggies", 6.99, 8.99, 31.5, 522, 55.8, 16.6, 5.0, "New", "LS", "2000x2000/abf28e694b/2026-05-06-every5051.jpg"],
  ["creamy-peanut-curry", "Creamy Peanut Curry", "Peanut curry with veggies & plant protein", 7.99, 9.99, 24.75, 513, 46.8, 23.4, 5.0, "New", "LC", "2000x2000/9f2fb45051/nuts-en-creamy-peanut-curry.png"],
  ["quinoa", "Sesame Quinoa Salad", "Fresh quinoa salad with sesame & roasted veg", 6.99, 8.99, 20.3, 525, 56.7, 19.6, 3.8, "New", "LS", "2000x2000/9027ac901d/en-sesame-quinoa-salad_1.jpg"],
  ["pearl-pasta-salad", "Pearl Pasta Salad", "Pearl pasta with vegetables and mustard Dijon sauce.", 6.99, 8.99, 18.8, 440, 47.2, 16.8, 4.8, "New", "LS", "2000x2000/b739d08f22/en-pearl-pasta-salad-website_1.jpg"],
  ["beetroot", "Crunchy Beetroot Salad", "Beetroot salad with rice & citrus crunch", 6.99, 8.99, 14, 434, 43, 17.8, 4.8, "New", "LS", "2000x2000/82d759fb6f/en-crunchy-beetroot-salad.jpg"],
  ["lemon-zucchini-gnocchi", "Lemon Zucchini Gnocchi", "Lemon gnocchi with zucchini & mushrooms", 6.99, 8.99, 14.9, 473, 67.5, 13.5, 4.1, "New", "LP", "SHOP:2026-03-24_Every27212.jpg"],
  ["gnocchi", "Red Pesto Gnocchi", "Gnocchi with red pesto & cashew crunch", 6.99, 8.99, 19.6, 597, 80.8, 23.6, 3.8, "Source of Fiber", "LP", "2000x2000/cae495c20d/en-red-pest-gnocchi.png"],
  ["sesame-fried-rice", "Sesame Fried Rice", "Sesame rice with veggies & nutty crunch", 6.99, 8.99, 19.6, 748, 80.8, 35.6, 3.6, "New", "LS", "2000x2000/c94c9e3b8a/sesame-fried-rice-en.jpg"],
  ["creamy-fricassee", "Creamy Fricassée", "Creamy fricassee with rice & planted.pulled", 7.99, 9.99, 20.7, 450, 59.9, 12.2, 4.1, "New", "LS", "SHOP:2026-03-24_Every27230.jpg"],
  ["creamy-paprika-pasta", "Creamy Paprika Pasta", "Creamy paprika pasta with plant-based protein", 7.99, 9.99, 21.2, 446, 50.4, 15.8, 4.0, "New", "LP", "SHOP:2026-03-24Every27162.jpg"],
  ["lemongrass-thai-ragout", "Lemongrass Thai Ragout", "Lemongrass stew with noodles and Boonian.", 7.99, 9.99, 20.5, 445, 64, 10, 4.5, "Source of Fiber", "LP", "2000x2000/857085e081/lemongrass-thai-ragout-en.jpg"],
  ["paprika-thai-ragout", "Paprika Thai Ragout", "Lentil Boonian stew with bell peppers and spices.", 7.99, 9.99, 25, 510, 66.5, 13, 4.3, "Source of Protein", "LP", "0x0/d46e4c86a9/every_thai_pepper_bolo_v4.png"],
  ["peanut-noodles", "Peanut Noodles", "Noodles in peanut butter sauce with vegetables.", 6.99, 8.99, 20.3, 491, 48.2, 23.4, 4.1, "Source of Protein", "LP", "2000x2000/f67455450d/peanut-noodles-contains-nuts-en.jpg"],
  ["pasta-rustica", "Pasta Rustica", "Penne with veggies in tomato sauce.", 6.99, 8.99, 14, 385, 52.7, 11.3, 4.2, "Source of Protein", "P", "0x0/04af65c913/pastacaponata_topshot_ff75d90f-260a-4d2e-a3b9-bac7e84f5cf8.png"],
  ["mushroom-gnocchi", "Mushroom Gnocchi", "Gnocchi with mushrooms, lentils & creamy sauce.", 6.99, 8.99, 17.6, 484, 71.1, 12.2, 4.2, "Source of Protein", "P", "0x0/c17bed4d96/mushroom_gnocchi_topshot.png"],
  ["spaetzle-goulash", "Spätzle Goulash", "Savory spätzle with mushrooms & peppers.", 7.99, 9.99, 25.7, 518, 46.8, 23, 4.2, "Source of Protein", "P", "0x0/8c703d64c1/goulash_topshot.png"],
  ["ramen-noodles", "Ramen Noodles", "Soy-infused noodle soup with veggies", 6.99, 8.99, 18.2, 440, 63.3, 10.5, 3.9, "Source of Protein", "P", "0x0/bdf37f33af/ramennoodles_1c4054dc-a239-4701-b301-e66b6a145da5.png"],
  ["teriyaki-wok", "Teriyaki Wok", "Asian noodles with planted.pulled & edamame.", 7.99, 9.99, 16.5, 590, 55, 31, 4.0, "High Protein", "P", "0x0/da86ac72a4/01_teriyakiwoktopshot.png"],
  ["mushroom-spaetzle", "Mushroom Spätzle", "Creamy spätzle with mushrooms & hearty veggies", 6.99, 8.99, 16, 430, 54.5, 14, 4.0, "Source of Protein", "P", "0x0/e5c282b2b6/01_mushroomspaetzle.png"],
  ["bami-goreng", "Bami Goreng", "Pak choi-noodle stir fry & planted.pulled.", 7.99, 9.99, 25, 468, 56.7, 12.2, 4.5, "High Protein", "P", "SHOP:01_BamiGoreng.png"],
  ["arrabbiata", "Pasta Arrabbiata", "Spicy pasta with cherry tomatoes & chili", 6.99, 8.99, 14, 410, 63.5, 9, 4.3, "Source of Protein", "P", "0x0/b2fb696a4d/01_pastaarrabbiatta.png"],
  ["coco-curry-pasta", "Coco Curry Pasta", "Creamy coconut curry pasta with broccoli", 6.99, 8.99, 18.5, 541, 71.1, 17.6, 4.3, "Source of Protein", "P", "0x0/a0b997ee2f/01_cococurrypasta.png"],
  ["bolognese", "Brilliant Bolognese", "Vegan Bolognese with lentil-aubergine ragù", 6.99, 8.99, 18, 519, 81, 10.5, 4.6, "Source of Protein", "P", "SHOP:BrilliantBolognese.png"],
  ["peas-love", "Peas & Love", "Creamy pea-basil pasta, romanesco & tomatoes", 6.99, 8.99, 22, 546, 67, 18.5, 4.6, "Source of Fiber", "P", "SHOP:Peas_Love.png"],
  ["green-curry-noodles", "Green Curry Noodles", "Fragrant curry noodles, cauliflower & spinach.", 6.99, 8.99, 14, 477, 64.4, 16.2, 4.5, "50%+ Veggie", "P", "SHOP:GreenCurryNoodles.png"],
  ["garden-gnocchi", "Garden Gnocchi", "Gnocchi with garden veggies and herb pesto", 6.99, 8.99, 15.8, 468, 72.9, 10.8, 4.6, null, "P", "SHOP:01_GardenGnocchi.png"],
  ["edamame-zen", "Edamame Zen", "Noodles with pak choi, wild rice & edamame.", 6.99, 8.99, 20.3, 423, 67.1, 5.4, 3.6, "Source of Protein", "P", "0x0/690c01d50e/2_925ca011-9bf4-458f-a57f-759aba4204fd.jpg"],
  ["japanese-sweet-curry", "Japanese Sweet Curry", "Curry with planted.pulled, vegetables, & potatoes.", 7.99, 9.99, 25, 450, 53, 12.5, 4.1, "New", "C", "0x0/ed1b8fd649/every_japanese_sweet_curry_v2.png"],
  ["creamy-mango-curry", "Creamy Mango Curry", "Creamy curry with mango & wild rice.", 6.99, 8.99, 10.5, 398, 46, 17, 3.7, "Source of Fiber", "C", "0x0/0c992ae049/creamymangocurry_topshot.png"],
  ["better-butter-chicken", "Better Butter Chicken", "Creamy Butter Chicken with planted.pulled.", 7.99, 9.99, 24, 470, 50, 18, 4.5, "High Protein", "C", "0x0/ed603ad938/01_betterbutterchicken.png"],
  ["tikka-masala", "Tikka Masala", "Creamy, spicy rice, peppers & planted.pulled.", 7.99, 9.99, 23.4, 491, 51.3, 19.4, 4.6, "High Protein", "C", "SHOP:01_TikkaMasala.png"],
  ["red-curry", "Red Curry", "Mild red curry with planted.pulled.", 7.99, 9.99, 24.3, 509, 52.2, 20.7, 4.5, "Source of Protein", "C", "1625x1625/1e11b7b600/01_redcurry.png"],
  ["golden-curry", "Golden Curry", "Creamy chickpea curry with pumpkin & spinach", 6.99, 8.99, 14.5, 423, 51, 21, 4.6, "Source of Protein", "C", "SHOP:01_GoldenCurry.png"],
  ["dal", "Dal Delight", "Lentil Dal with carrots, beans & sweet potato", 6.99, 8.99, 23.9, 493, 53.6, 18, 4.6, "High Fiber", "C", "SHOP:01_DalDelight.png"],
  ["green-boost", "Green Boost", "Green veggie mix with chickpeas, mint & mango", 6.99, 8.99, 20.3, 513, 32.4, 31.1, 4.2, "Source of Protein", "S", "SHOP:01_GreenBoost.png"],
  ["smoky-lentil-stew", "Smoky Lentil Stew", "Lentil Boonian stew with bell peppers and spices.", 7.99, 9.99, 23.9, 384, 34.7, 10.4, 4.7, "High Protein", "S", "0x0/eeb5ef6e86/every_smokey_lentil_stew_v3.png"],
  ["farmhouse-ratatouille", "Farmhouse Ratatouille", "Spelt with grilled vegetables in tomato sauce.", 6.99, 8.99, 9.5, 463, 45.9, 24.8, 4.4, "Source of Fiber", "S", "0x0/c39e289edb/farmhouseratatouille_topshot.png"],
  ["nasi-goreng", "Nasi Goreng", "Basmati rice with veg & planted.pulled.", 7.99, 9.99, 25.7, 527, 57.2, 18.9, 4.2, "Source of Protein", "S", "0x0/85de22ee4a/4_7b8707de-bfed-4e24-ab1d-830c08fcf71a.jpg"],
  ["umami-rice", "Umami Rice", "Veggie-rice stir fry with planted.pulled.", 7.99, 9.99, 27.9, 424, 59.4, 5.9, 4.3, "High Protein", "S", "3125x3125/95e1156a7d/umami-rice.avif"],
  ["paella", "Paella Del Sol", "Mediterranean paella with olives & tomatoes.", 7.99, 9.99, 19, 445, 48.5, 17.5, 4.4, "Source of Protein", "S", "0x0/f66f3d4250/01_paelladelsoltopshot.png"],
  ["golden-glow-bowl", "Golden Glow Bowl", "Bright, spiced & nourishing bowl", 6.99, 8.99, 16.5, 590, 55, 31, 4.5, "Source of Protein", "S", "0x0/e08bdb83f9/01_goldenglowbowl.png"],
  ["chili-sin-carne", "Chili sin Carne", "Hearty vegan chili with planted.pulled.", 7.99, 9.99, 24.8, 446, 49.5, 13.1, 4.3, "High Protein", "S", "0x0/14b2f5dabf/01_chili_sin_carne.png"],
  ["potato-panorama", "Potato Panorama", "Mediterranean sweet potato and spelt bowl", 6.99, 8.99, 8.6, 441, 54, 19.4, 4.2, "Source of Fiber", "S", "0x0/29b3a70674/01_potatopanorama.png"],
  ["green-forest-bowl", "Green Forest Bowl", "Asparagus & porcini on creamy, garlicky spelt", 6.99, 8.99, 18, 532, 42.2, 32, 4.4, null, "S", "SHOP:01_ForestGreen.png"],
  ["taco", "Naked Taco", "Tex-Mex rice-bean mix with tomatoes & corn", 6.99, 8.99, 15.3, 494, 72.5, 13.1, 4.6, "Source of Protein", "S", "SHOP:01_NakedTaco.png"],
  ["forest-green-hp", "Forest Green (High Protein)", "Asparagus & porcini on creamy, garlicky spelt & vegan pulled meat", 9.68, 11.68, null, null, null, null, 4.2, null, "H", "1000x1000/9e846fd449/protein-forest-green-planted.png"],
  ["coco-curry-hp", "Coco Curry Pasta (High Protein)", "Creamy coconut curry pasta with Boonian", 9.68, 11.68, null, null, null, null, 4.8, null, "H", "1000x1000/1967c4e2b4/protein-coco-curry-pasta-boonian.png"],
  ["green-curry-hp", "Green Curry Noodles (High Protein)", "Fragrant curry noodles with Boonian", 9.68, 11.68, null, null, null, null, 4.6, null, "H", "1000x1000/7b9baae98b/protein-green-curry-noodles-with-boonian.png"],
  ["berry-shot-set", "Berry Boost Shot Set", "7 x Slow-juiced berries with pomegranate & spices", 12.22, null, null, null, null, null, 5.0, null, "B", "2000x2000/d557780ee4/en-berry-roots-sale.jpg"],
  ["ginger-shot-set", "Ginger Glow Shot Set", "7 x Spicy slow-juiced ginger with lemon balm and ginseng", 12.22, null, null, null, null, null, 5.0, null, "B", "2000x2000/1bb9bff7f4/en-ginger-glow-sale.jpg"],
  ["red-berry-porridge", "Red Berry Porridge", "Fruity overnight oats with raspberries and protein.", 12.99, null, 19, 381, 42, 10, 4.0, "High Protein", "B", "2000x2000/711b9784b9/en-red-berry-ono.jpg"],
  ["apple-cinnamon-porridge", "Apple Cinnamon Porridge", "Creamy overnight oats with real apple, cinnamon, quinoa and seeds.", 11.99, null, null, null, null, null, 5.0, "High Fiber", "B", "2000x2000/72ba6d36c0/en-apple-cinnamon-ono.jpg"],
  ["vanilla-hazelnut-muesli", "Vanilla Hazelnut Müsli", "Nourishing nut muesli with seeds & nuts.", 11.99, null, null, null, null, null, 4.8, "High Fiber", "B", "SHOP:Untitled_design_2.png"],
  ["pistachio-pecan-granola", "Pistachio Pecan Granola", "Baked granola with pistachios & nuts.", 12.99, null, null, null, null, null, 4.8, "High Fiber", "B", "SHOP:12_328872d5-d22d-4612-af32-3f89896207d2.png"],
  ["triple-berry-smoothie", "Triple Berry Smoothie", "Berry blend with açaí", 3.99, null, 2, 153, 28.7, 1.5, 4.2, "High Fiber", "B", "SHOP:17_2ce98e76-f97b-4b9b-a106-7ee414bb9101.png"],
  ["spirulina-glow-smoothie", "Spirulina Glow Smoothie", "Blue smoothie with fig, lime & spirulina.", 3.99, null, 3.1, 195, 26.9, 7.2, 4.0, "Source of Fiber", "B", "SHOP:Untitled_design_12.png"],
  ["daily-greens-smoothie", "Daily Greens Smoothie", "Refreshing apple, spinach, and tangy lime", 3.99, null, 5.7, 167, 31.1, 1.1, 3.9, "High Fiber", "B", "SHOP:18_db331f3d-26ad-438f-a0f4-b48bd4516404.png"],
  ["mango-tango-smoothie", "Mango Tango Smoothie", "Tropical mango and passion fruit", 3.99, null, 1.7, 188, 31.8, 5, 4.5, "Source of Fiber", "B", "SHOP:16_9fcc93b1-1d21-4820-93ec-bec0399f6b36.png"],
  ["berry-boost-shot", "Berry Boost Shot", "Slow-juiced berries with pomegranate & spices", 3.49, null, 2.6, 94, 24.4, 1, 5.0, "High Fiber", "B", "SHOP:21.png"],
  ["ginger-glow-shot", "Ginger Glow Shot", "Spicy slow-juiced ginger with lemon balm and ginseng", 3.49, null, 1.2, 56, 8.6, 0.6, 4.0, "High Fiber", "B", "SHOP:19_e92722ef-6bec-4bc4-aec0-104790ad9fa6.png"],
  ["golden-roots-shot", "Golden Roots Shot", "Slow-juiced turmeric shot with citrus and honey", 3.49, null, 1.2, 56, 8.6, 0.6, 4.2, "High Fiber", "B", "SHOP:20.png"],
  ["raw-cake-bites", "Raw Cake Bites", "Amazingly delicious sweet treats can be made from a small number of simple organic ingredients.", 17.99, null, null, null, null, null, 5.0, "New", "W", "2000x2000/e39c93df43/en-raw-cakes.png"],
  ["lime-mint-ice-cream", "Lime-Mint Ice-Cream", "Vegan Sorbet with lime, mint & coconut – 420ml", 6.49, null, 1.26, 353, 67.2, 6.3, 5.0, null, "W", "SHOP:Untitled_design_18.png"],
  ["lemon-cake-ball", "Lemon Cake Ball", "Lemon ball with vanilla & almonds.", 2.19, null, 2.1, 100, 11, 4.5, 5.0, "Source of Fiber", "W", "SHOP:25.png"],
  ["cinnamon-bun-ball", "Swedish Cinnamon Bun Ball", "Nordic cinnamon ball organic & vegan.", 2.19, null, 2.5, 110, 11, 6, 5.0, null, "W", "SHOP:26_e6f85990-d2cf-4208-ad06-38403333b8ad.png"],
  ["chocolate-ball", "Swedish Chocolate Ball", "Cacao ball with coffee & coconut flakes.", 2.19, null, 1.9, 120, 9, 8.3, 5.0, null, "W", "SHOP:24_f80ecb0c-a3ef-4fa9-9164-7957ecf4c8f2.png"],
  ["pick-me-up-bundle", "Pick-Me-Up Bundle", "3 snack balls, full of energy for on the go!", 6.19, null, null, null, null, null, 5.0, null, "W", "1890x1890/a78d453c80/pick-me-up-bundle.jpg"],
  ["apple-crumble", "Apple Crumble", "No-bake with apple & cashew crunch.", 2.49, null, 3.3, 160, 19, 8, 5.0, null, "W", "SHOP:27.png"],
  ["raspberry-crumble", "Raspberry Crumble", "No-bake treat with raspberry & nut butter.", 2.49, null, 3.5, 180, 18, 8.8, 5.0, null, "W", "SHOP:29_f125ff93-b2cb-45d6-9854-ba856f08d3bc.png"],
  ["blueberry-crumble", "Blueberry White Chocolate Crumble", "No-bake with white choc & blueberries.", 2.49, null, 3.5, 180, 18, 8.8, 5.0, null, "W", "SHOP:28.png"],
  ["boonian-crumbles", "Boonian Crumbles Protein", "Savory extra protein for every meal.", 2.69, null, 17.4, 208, 12.4, 9.8, 4.3, "17g Protein", "T", "SHOP:Zutaten_Crumbles_Protein.png"],
  ["planted-pulled", "Planted.Pulled Protein", "Tender extra protein for every meal.", 2.69, null, 19.2, 130, 2, 4.2, 4.8, null, "T", "SHOP:Zutaten_Pulled_Protein.png"],
  ["tote-bag", "every Tote Bag", "Carry your essentials in style!", 27.99, 29.99, null, null, null, null, 5.0, null, "M", "SHOP:DSC03110forwebsite.jpg"],
];

const CODE: Record<string, CatId> = { L: "latest", P: "pasta", C: "curries", S: "signature", H: "protein", B: "breakfast", W: "sweet", T: "toppings", M: "merch" };

const has = (s: string, ...w: string[]) => w.some((x) => s.includes(x));

/** Prototype-only tag derivation from name + description (see header note). */
function derive(name: string, desc: string, cats: CatId[]) {
  const t = `${name} ${desc}`.toLowerCase();
  const contains: Allergen[] = [];
  if (has(t, "pasta", "noodle", "gnocchi", "spätzle", "spaetzle", "couscous", "spelt", "ramen", "wok", "porridge", "oats", "müsli", "granola", "penne", "cake", "crumble", "bami")) contains.push("gluten");
  if (has(t, "soy", "edamame", "teriyaki", "tofu", "ramen", "korean", "nasi", "bami", "umami", "boonian")) contains.push("soy");
  if (has(t, "peanut", "cashew", "nut", "hazelnut", "pistachio", "pecan", "almond", "pesto")) contains.push("nuts");
  if (has(t, "sesame")) contains.push("sesame");
  const base: string[] = [];
  if (has(t, "rice", "paella", "nasi", "risotto")) base.push("Rice");
  if (has(t, "pasta", "noodle", "gnocchi", "spätzle", "penne", "couscous", "ramen", "wok", "bami")) base.push("Pasta/Noodle");
  if (has(t, "potato")) base.push("Potato");
  if (has(t, "lentil", "dal", "chickpea", "bean", "boonian", "chili")) base.push("Legume");
  const spice = has(t, "arrabbiata", "chili", "spicy", "tikka") ? "Very spicy" : has(t, "curry", "korean", "spiced", "thai", "goreng", "goulash") ? "Medium spicy" : "Not spicy";
  const without = ["Garlic", "Onion", "Coriander", "Cumin", "Paprika", "Pepper", "Cayennepepper", "Ginger", "Chili", "Mushroom"].filter((w) => {
    const k = w.toLowerCase().replace("cayennepepper", "cayenne");
    if (k === "garlic" || k === "onion") return !cats.some((c) => ["pasta", "curries", "signature", "protein"].includes(c)); // savoury meals assumed to contain both
    if (k === "pepper") return !has(t, "pepper", "paprika");
    if (k === "chili") return !has(t, "chili", "arrabbiata", "spicy");
    if (k === "mushroom") return !has(t, "mushroom", "porcini");
    if (k === "cumin") return !has(t, "curry", "dal", "chili", "spiced", "tikka");
    if (k === "coriander") return !has(t, "thai", "curry", "tikka", "taco");
    return !has(t, k);
  });
  return { contains, base, spice, without };
}

export type Product = Dish & {
  desc: string;
  oldPrice: number | null;
  rating: number;
  badge: string | null;
  cats: CatId[];
  base: string[];
  spice: string;
  without: string[];
  hasMacros: boolean;
};

export const PRODUCTS: Product[] = ROWS.map(([id, name, desc, price, oldPrice, protein, kcal, carbs, fat, rating, badge, codes, image]) => {
  const cats = [...codes].map((c) => CODE[c]);
  const d = derive(name, desc, cats);
  const kind: Dish["kind"] = cats.includes("breakfast") ? (has(name.toLowerCase(), "smoothie") ? "smoothie" : "breakfast") : cats.some((c) => ["sweet", "toppings", "merch"].includes(c)) ? "addon" : "meal";
  const plants = kind === "meal" ? Math.max(4, Math.round(desc.split(/,|&| and | with /).length * 2)) : kind === "addon" ? 0 : 3;
  return {
    id, name, desc, img: img(image), kind,
    minutes: kind === "meal" ? 6 : kind === "addon" ? 0 : 2,
    plants,
    protein: protein ?? 0, fibre: 0, kcal: kcal ?? 0, carbs: carbs ?? 0, fat: fat ?? 0,
    contains: d.contains,
    tags: badge === "New" ? ["new"] : [],
    reason: { plants: desc, protein: protein ? `${protein} g protein · ${desc.toLowerCase()}` : desc, time: kind === "meal" ? `Ready in about 6 minutes · ${desc.toLowerCase()}` : desc },
    why: desc,
    helps: protein ? `${protein} g protein${kcal ? `, ${kcal} kcal` : ""} per portion. Plant-based, frozen at peak freshness.` : "Plant-based, made by the Every kitchen.",
    price, oldPrice, rating, badge, cats,
    base: d.base, spice: d.spice, without: d.without,
    hasMacros: protein !== null,
  };
});

export const product = (id: string) => PRODUCTS.find((p) => p.id === id);
