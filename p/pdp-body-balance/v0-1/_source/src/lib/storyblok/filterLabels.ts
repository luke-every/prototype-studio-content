import type { MealFilterDatasources } from "@/lib/storyblok/datasources";

/** Maps each filter datasource entry's raw `value`/`name` slug to its translated display text. */
export function buildFilterLabelLookup(datasources: MealFilterDatasources): Map<string, string> {
  const lookup = new Map<string, string>();
  const entries = [
    ...datasources.nutritionFilter,
    ...datasources.spicinessFilter,
    ...datasources.recipeWithoutFilter,
  ];
  for (const entry of entries) {
    const label = entry.dimensionValue || entry.name;
    lookup.set(entry.value.toLowerCase(), label);
    lookup.set(entry.name.toLowerCase(), label);
  }
  return lookup;
}
