"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { BundleStarRating } from "./BundleStarRating";
import { usePublicTranslations } from "@/providers/PublicTranslationsProvider";

export type BundleReview = {
  name: string;
  verified: boolean;
  /** Small tag at the top right, e.g. "Meal prep" */
  title?: string;
  rating: number;
  comments: string;
};

type Props = {
  review: BundleReview;
};

export function BundleReviewCard({ review }: Props) {
  const t = usePublicTranslations();
  const [expanded, setExpanded] = useState<boolean>(false);
  // line-clamp-2 truncates in CSS only, so whether it cut anything off can only be read back from the DOM.
  const [isTruncated, setIsTruncated] = useState<boolean>(false);
  const quoteRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const el = quoteRef.current;
    if (!el) return;
    setIsTruncated(el.scrollHeight > el.clientHeight);
  }, [review.comments]);

  return (
    <div className="bg-white border border-dark/6 rounded-[14px] shrink-0 w-[280px] p-[17px] flex flex-col gap-2 shadow-[0px_1px_1.5px_rgba(55,45,39,0.06)]">
      <div className="flex items-center justify-between gap-2 pb-[5px]">
        <div className="flex flex-col">
          <span className="font-sans font-medium text-xs tracking-[-0.24px] leading-4 text-dark">{review.name}</span>
          {review.verified && <span className="font-sans text-xs tracking-[-0.24px] leading-4 text-dark">{t.bundle.verifiedPurchase}</span>}
        </div>
        {review.title && (
          <span className="shrink-0 bg-light-orange text-[#110D0A] text-[8px] tracking-[-0.16px] leading-[13px] px-2 py-1 rounded whitespace-nowrap uppercase">
            {review.title}
          </span>
        )}
      </div>

      <BundleStarRating rating={review.rating} emptyColor="#EEEAE6" />

      <p ref={quoteRef} className={`font-sans text-xs tracking-[-0.24px] leading-4 text-dark ${expanded ? "" : "line-clamp-2"}`}>
        &ldquo;{review.comments}&rdquo;
      </p>

      {isTruncated && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          aria-expanded={expanded}
          className="self-start font-sans text-xs tracking-[-0.24px] leading-4 text-dark underline underline-offset-2 hover:opacity-70 cursor-pointer"
        >
          {expanded ? t.bundle.readLess : t.bundle.readMore}
        </button>
      )}
    </div>
  );
}
