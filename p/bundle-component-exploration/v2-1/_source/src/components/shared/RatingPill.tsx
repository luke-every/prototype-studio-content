"use client";

import { useSkuRating } from "@/hooks/useSkuRating";

type Props = {
  /** The key the rating is looked up by: the product sku, or the story slug in the prototype */
  sku: string;
};

/** The small grey star rating that sits beside a meal's title. Renders nothing until the rating is known. */
export function RatingPill({ sku }: Props) {
  const { rating } = useSkuRating(sku);
  if (!rating) return null;
  return (
    <span className="flex items-center gap-0.5 rounded-full bg-[#f4f4f4] px-2 py-1 font-sans text-xs leading-4 tracking-[-0.24px] text-black" aria-label={`Rated ${rating.average.toFixed(1)} from ${rating.count} reviews`}>
      <span aria-hidden="true" className="text-[#ff7d34]">★</span>
      {rating.average.toFixed(1)}
      <span className="text-black/60">({rating.count.toLocaleString()})</span>
    </span>
  );
}
