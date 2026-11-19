"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchProductReviewsClient, type Review } from "@/lib/reviewsio/client";
import { captureError } from "@/lib/error";

type UseProductReviewsResult = {
  reviews: Review[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  loadMore: () => void;
};

export function useProductReviews(sku: string | null | undefined, perPage = 10): UseProductReviewsResult {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [resultSku, setResultSku] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  const loading = sku != null && resultSku !== sku;

  useEffect(() => {
    if (!sku) return;
    let active = true;
    const controller = new AbortController();

    // Reviews.io indexes by a 6-char base SKU shared across meal variants, same normalization
    // fetchMealRating/fetchMealRatings apply — matches on a full variant SKU would return nothing.
    fetchProductReviewsClient(sku.slice(0, 6), 1, perPage, controller.signal)
      .then((r) => {
        if (!active) return;
        setReviews(r.reviews);
        setTotal(r.total);
        setPage(1);
        setResultSku(sku);
      })
      .catch((e: unknown) => {
        if (!active) return;
        captureError(e instanceof Error ? e : new Error("useProductReviews fetch failed"), {
          tags: { hook: "useProductReviews" },
        });
        setReviews([]);
        setTotal(0);
        setPage(1);
        setResultSku(sku);
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [sku, perPage]);

  const hasMore = reviews.length < total;

  const loadMore = useCallback(() => {
    if (!sku || loading || loadingMore || !hasMore) return;
    const nextPage = page + 1;

    setLoadingMore(true);
    fetchProductReviewsClient(sku.slice(0, 6), nextPage, perPage)
      .then((r) => {
        setReviews((prev) => [...prev, ...r.reviews]);
        setTotal(r.total);
        setPage(nextPage);
      })
      .catch((e: unknown) => {
        captureError(e instanceof Error ? e : new Error("useProductReviews loadMore failed"), {
          tags: { hook: "useProductReviews" },
        });
      })
      .finally(() => setLoadingMore(false));
  }, [sku, page, perPage, loading, loadingMore, hasMore]);

  return { reviews, loading, loadingMore, hasMore, loadMore };
}
