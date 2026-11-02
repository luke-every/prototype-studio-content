"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { BundleStarRating } from "./BundleStarRating";
import type { BundleReview } from "./types";

type Props = {
  review: BundleReview;
};

/** Port of every-website `src/components/website/bundle-v2/BundleReviewCard.tsx`: plain `BundleReview` props instead of the reviews.io `Review`. */
export function BundleReviewCard({ review }: Props) {
  const [expanded, setExpanded] = useState<boolean>(false);
  // line-clamp is CSS only, so whether it cut anything off can only be read back from the DOM.
  const [isTruncated, setIsTruncated] = useState<boolean>(false);
  const quoteRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const el = quoteRef.current;
    if (!el) return;
    setIsTruncated(el.scrollHeight > el.clientHeight);
  }, [review.comments]);

  return (
    <div className="flex w-[280px] shrink-0 flex-col gap-2 self-start rounded-[14px] border border-light-grey bg-white p-[17px] shadow-[0px_1px_1.5px_rgba(55,45,39,0.06)]">
      <div className="flex items-center justify-between gap-2 pb-[5px]">
        <div className="flex flex-col">
          <span className="font-sans text-xs font-medium leading-4 tracking-[-0.24px] text-dark">{review.name}</span>
          {/* TODO(lift): replace with translation key */}
          <span className="font-sans text-xs leading-4 tracking-[-0.24px] text-dark">Verified purchase</span>
        </div>
        {review.title && (
          <span className="shrink-0 whitespace-nowrap rounded bg-light-orange px-2 py-1 font-sans text-[8px] uppercase leading-[13px] tracking-[-0.16px] text-near-black">
            {review.title}
          </span>
        )}
      </div>

      <BundleStarRating rating={review.rating} emptyClassName="text-light-grey" />

      <p ref={quoteRef} className={`font-sans text-xs leading-4 tracking-[-0.24px] text-dark ${expanded ? "" : "line-clamp-2"}`}>
        &ldquo;{review.comments}&rdquo;
      </p>

      {isTruncated && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          aria-expanded={expanded}
          aria-label={expanded ? "Read less" : "Read more"}
          className="cursor-pointer self-start font-sans text-xs leading-4 tracking-[-0.24px] text-dark underline underline-offset-2 hover:opacity-70"
        >
          {/* TODO(lift): replace with translation key */}
          {expanded ? "Read less" : "Read more"}
        </button>
      )}
    </div>
  );
}
