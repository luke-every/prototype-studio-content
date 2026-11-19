import type { BundleMeal } from "@/components/website/bundle-v3/types";
import type { Product } from "@/lib/storyblok-products";

const num = (value: string | null | undefined): number | undefined => {
  const n = parseFloat(String(value ?? "").replace(",", "."));
  return Number.isNaN(n) ? undefined : n;
};

/** The ingredients and macros the full-menu modal lists for a meal, read from its live product. Empty until the product has loaded. */
export function mealDetailsFromProduct(product: Product | undefined): Pick<BundleMeal, "ingredients" | "protein" | "fibre" | "kcal"> {
  const macro = (label: string): number | undefined => num(product?.macros.find(([, l]) => l === label)?.[0]);
  return {
    ingredients: product?.ingredients.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
    protein: macro("PROTEIN"),
    fibre: macro("FIBRE"),
    kcal: num(product?.kcal),
  };
}
