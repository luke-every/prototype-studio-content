// PROTOTYPE SHIM — not the production file. Same export names/signatures as every-website so callers lift back unchanged;
// swap this file for the real one when the code moves into the app.
// Types only. Production also holds the Shopify Admin queries.

export type ProductDisplayDetails = {
  id: string;
  title: string;
  handle: string;
  image: string | null;
  description: string | null;
  productType: string;
  tags: string[];
  price: string | null;
  compareAtPrice: string | null;
  sku: string | null;
  variantTitle: string | null;
  weight: number | null;
  weightUnit: string | null;
  currencyCode: string;
};
