// PROTOTYPE SHIM — not the production file. Same export names/signatures as every-website so callers lift back unchanged;
// swap this file for the real one when the code moves into the app.
// Production sends these to GA4/GTM/Meta. Prototypes track nothing.

export type TrackableProduct = {
  id?: string;
  sku?: string;
  title?: string;
  price?: number;
  compareAtPrice?: number;
  quantity?: number;
  type?: string;
  variantTitle?: string;
  index?: number;
  imageUrl?: string;
  url?: string;
  isUpsell?: boolean;
  currencyCode?: string;
  // TODO: add discount + coupon per item — Gatsby calculates these from the discounts array per item
};

export function trackSelectItem(product: TrackableProduct): void {
  void product;
}
export function trackAddToCart(products: TrackableProduct | TrackableProduct[]): void {
  void products;
}
export function trackRemoveFromCart(products: TrackableProduct | TrackableProduct[]): void {
  void products;
}
