// PROTOTYPE SHIM — not the production file. Same export names/signatures as every-website so callers lift back unchanged;
// swap this file for the real one when the code moves into the app.
// Production calls the reviews.io API. This returns fixed sample data so the rating and review UI has something to show.

export type RatingStats = { average: number; count: number };

export type Review = {
  reviewer: {
    first_name: string;
    last_name: string;
    verified_buyer?: string;
  };
  rating: number;
  comments: string;
  date_created: string;
  title?: string;
};

// TODO(lift): sample data — replace with the reviews.io API
const SAMPLE_REVIEWS: Review[] = [
  { reviewer: { first_name: "Florence", last_name: "M.", verified_buyer: "yes" }, rating: 5, comments: "Fresh, tasty and ready in minutes. It has made my weeknights so much easier.", date_created: "2026-09-12 10:00:00" },
  { reviewer: { first_name: "Frank", last_name: "P.", verified_buyer: "yes" }, rating: 5, comments: "A high share of vegetables and it keeps me full without feeling heavy.", date_created: "2026-08-30 18:30:00" },
  { reviewer: { first_name: "Claudia", last_name: "K.", verified_buyer: "yes" }, rating: 4, comments: "Great variety. The best frozen food I have tried.", date_created: "2026-08-14 12:15:00" },
];

export async function fetchMealRating(sku: string, signal?: AbortSignal): Promise<RatingStats | null> {
  void sku;
  void signal;
  return { average: 4.6, count: SAMPLE_REVIEWS.length * 120 };
}

export async function fetchProductReviewsClient(
  sku: string,
  page = 1,
  perPage = 10,
  signal?: AbortSignal,
): Promise<{ reviews: Review[]; total: number }> {
  void sku;
  void signal;
  const start = (page - 1) * perPage;
  return { reviews: SAMPLE_REVIEWS.slice(start, start + perPage), total: SAMPLE_REVIEWS.length };
}
