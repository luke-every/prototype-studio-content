// TODO(lift): sample data — production builds this from Storyblok + Shopify (see src/lib/meals/meal-detail.ts)
import type { MealDetailApiResponse } from "@/lib/meals/meal-detail";

type SampleMeal = { slug: string; title: string; price: string; description: string; kcal: string; protein: string; carbs: string; fat: string; color: string };

export const SAMPLE_MEALS: SampleMeal[] = [
  { slug: "brilliant-bolognese", title: "Brilliant Bolognese", price: "8.99", description: "A rich, plant-based ragu with slow-cooked vegetables over penne.", kcal: "519", protein: "18", carbs: "68", fat: "16", color: "#E8C9B0" },
  { slug: "tikka-masala", title: "Tikka Masala", price: "9.99", description: "Creamy, mildly spiced tomato curry with basmati rice.", kcal: "491", protein: "23", carbs: "62", fat: "15", color: "#F0C87A" },
  { slug: "bami-goreng", title: "Bami Goreng", price: "9.99", description: "Indonesian-inspired fried noodles with vegetables and a sweet soy glaze.", kcal: "468", protein: "25", carbs: "58", fat: "13", color: "#D9B68F" },
  { slug: "red-curry", title: "Red Curry", price: "9.99", description: "Thai red curry with coconut milk, crunchy vegetables and jasmine rice.", kcal: "509", protein: "24", carbs: "60", fat: "17", color: "#E3A08A" },
];

const placeholder = (label: string, color: string): string =>
  `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="100%" height="100%" fill="${color}"/><text x="50%" y="50%" font-family="sans-serif" font-size="40" text-anchor="middle" dominant-baseline="middle" fill="#372d27">${label}</text></svg>`)}`;

const richText = (text: string): unknown => ({ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text }] }] });

export function sampleMealDetail(slug: string): MealDetailApiResponse {
  const meal = SAMPLE_MEALS.find((m) => m.slug === slug) ?? SAMPLE_MEALS[0];
  const index = SAMPLE_MEALS.indexOf(meal);
  return {
    story: {
      id: index + 1,
      uuid: `uuid-${meal.slug}`,
      name: meal.title,
      slug: meal.slug,
      full_slug: `products/${meal.slug}`,
      content: {
        _uid: `uid-${meal.slug}`,
        component: "product",
        kcal: meal.kcal,
        carbs: meal.carbs,
        fat: meal.fat,
        protein: meal.protein,
        image: { filename: placeholder(meal.title, meal.color), alt: meal.title },
        description: richText(meal.description),
        ingredients: richText("Vegetables, tomatoes, onion, carrot, celery, penne pasta, olive oil, garlic."),
        nutritional_values: richText(`Per serving: ${meal.kcal} kcal, ${meal.protein} g protein, ${meal.carbs} g carbs, ${meal.fat} g fat.`),
        preparation: richText("Heat in the microwave for 3 minutes or in a pan for 6 minutes. Stir halfway."),
        nutrition_filter: ["high-protein"],
        shopify_product: { plugin: "shopify", items: [] },
      },
    } as MealDetailApiResponse["story"],
    product: {
      id: `gid://shopify/Product/${1000 + index}`,
      title: meal.title,
      handle: meal.slug,
      image: placeholder(meal.title, meal.color),
      description: meal.description,
      productType: "Meal",
      tags: [],
      price: meal.price,
      compareAtPrice: null,
      sku: null,
      variantTitle: null,
      weight: 450,
      weightUnit: "GRAMS",
      currencyCode: "EUR",
    },
    rels: [],
    translatedSlugs: {},
    soldOut: false,
    filterDatasources: {
      nutritionFilter: [{ id: 1, name: "High protein", value: "high-protein", dimensionValue: "" }],
      spicinessFilter: [],
      recipeWithoutFilter: [],
    },
  };
}
