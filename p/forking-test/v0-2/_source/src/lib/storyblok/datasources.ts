// PROTOTYPE SHIM — not the production file. Same export names/signatures as every-website so callers lift back unchanged;
// swap this file for the real one when the code moves into the app.
// Types only. Production also fetches these from Storyblok.

export type GqlDatasourceEntry = {
  id: number;
  name: string;
  value: string;
  dimensionValue: string;
};

export type MealFilterDatasources = {
  nutritionFilter: GqlDatasourceEntry[];
  spicinessFilter: GqlDatasourceEntry[];
  recipeWithoutFilter: GqlDatasourceEntry[];
};
