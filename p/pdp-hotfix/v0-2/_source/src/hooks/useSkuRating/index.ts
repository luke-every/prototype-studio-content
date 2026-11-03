"use client";

import { useEffect, useState } from "react";
import { fetchMealRating, type RatingStats } from "@/lib/reviewsio/client";
import { captureError } from "@/lib/error";

type UseSkuRatingResult = {
  rating: RatingStats | null;
  loading: boolean;
};

export function useSkuRating(sku: string | null | undefined): UseSkuRatingResult {
  const [rating, setRating] = useState<RatingStats | null>(null);
  const [resultSku, setResultSku] = useState<string | null>(null);

  const loading = sku != null && resultSku !== sku;

  useEffect(() => {
    if (!sku) return;
    let active = true;
    const controller = new AbortController();

    fetchMealRating(sku, controller.signal)
      .then((r) => {
        if (!active) return;
        setRating(r);
        setResultSku(sku);
      })
      .catch((e: unknown) => {
        if (!active) return;
        captureError(e instanceof Error ? e : new Error("useSkuRating fetch failed"), {
          tags: { hook: "useSkuRating" },
        });
        setRating(null);
        setResultSku(sku);
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [sku]);

  return { rating, loading };
}
