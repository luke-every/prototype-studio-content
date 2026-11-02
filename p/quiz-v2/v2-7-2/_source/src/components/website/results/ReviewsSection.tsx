"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { ReviewsIoIcon, StarIcon } from "@/components/icons";

type Review = {
  name: string;
  verified: boolean;
  /** Small tag at the top right, e.g. "Meal prep" */
  title?: string;
  rating: number;
  comments: string;
};

// TODO(lift): sample data — replace with the reviews.io feed
const REVIEWS: Review[] = [
  {
    name: "Firstname L.",
    verified: true,
    title: "Meal prep",
    rating: 5,
    comments:
      "Placeholder review copy. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    name: "Firstname M.",
    verified: true,
    title: "Quick dinners",
    rating: 5,
    comments: "Placeholder review copy. Short and sweet.",
  },
  {
    name: "Firstname S.",
    verified: true,
    rating: 4,
    comments:
      "Placeholder review copy. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    name: "Firstname K.",
    verified: false,
    title: "Weight loss",
    rating: 4.5,
    comments:
      "Placeholder review copy. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
];
// TODO(lift): sample data — the average from reviews.io
const AVERAGE = 4.5;

/** Fill percentage (0, 50 or 100) for the star at `index`, so a 4.4 average shows 4 full stars and a half. */
const starFillPercent = (rating: number, index: number): number => {
  const diff = rating - index;
  if (diff >= 0.75) return 100;
  if (diff >= 0.25) return 50;
  return 0;
};

/** 5-star row with half-star fills: a clipped orange star over the empty-coloured one. */
function Stars({ rating, emptyColor }: { rating: number; emptyColor: string }) {
  return (
    <div
      className="flex origin-left scale-75 items-center gap-0.5"
      aria-label={`${rating.toFixed(1)} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, i) => {
        const percent = starFillPercent(rating, i);
        return (
          <div key={i} className="relative">
            <StarIcon fill={emptyColor} />
            {percent > 0 && (
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${percent}%` }}
                aria-hidden
              >
                <StarIcon fill="var(--color-signal-orange)" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const [expanded, setExpanded] = useState<boolean>(false);
  /* line-clamp-2 cuts in CSS only, so whether it cut anything off can only be read back from the page */
  const [isTruncated, setIsTruncated] = useState<boolean>(false);
  const quoteRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const el = quoteRef.current;
    if (!el) return;
    setIsTruncated(el.scrollHeight > el.clientHeight);
  }, [review.comments]);

  return (
    <div className="flex w-[280px] shrink-0 flex-col gap-2 rounded-[14px] border border-dark/6 bg-white p-[17px] shadow-[0px_1px_1.5px] shadow-dark/6">
      <div className="flex items-center justify-between gap-2 pb-[5px]">
        <div className="flex flex-col">
          <span className="text-xs leading-4 font-medium tracking-[-0.24px] text-dark">
            {review.name}
          </span>
          {/* TODO(lift): replace with translation key */}
          {review.verified && (
            <span className="text-xs leading-4 tracking-[-0.24px] text-dark">
              Verified purchase
            </span>
          )}
        </div>
        {review.title && (
          <span className="shrink-0 rounded bg-light-orange px-2 py-1 text-[8px] leading-[13px] tracking-[-0.16px] whitespace-nowrap text-near-black uppercase">
            {review.title}
          </span>
        )}
      </div>

      <Stars rating={review.rating} emptyColor="var(--color-light-grey)" />

      <p
        ref={quoteRef}
        className={`m-0 text-xs leading-4 tracking-[-0.24px] text-dark ${expanded ? "" : "line-clamp-2"}`}
      >
        &ldquo;{review.comments}&rdquo;
      </p>

      {isTruncated && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          aria-expanded={expanded}
          className="cursor-pointer self-start bg-transparent p-0 text-xs leading-4 tracking-[-0.24px] text-dark underline underline-offset-2 hover:opacity-70"
        >
          {/* TODO(lift): replace with translation keys */}
          {expanded ? "Read less" : "Read more"}
        </button>
      )}
    </div>
  );
}

/** From the bundle page: "Over 200,000 happy customers", the reviews to swipe through, and the reviews.io rating */
export function ReviewsSection() {
  return (
    <section className="mt-14 flex flex-col gap-4">
      {/* TODO(lift): replace with translation key */}
      <h2 className="m-0 mx-6 font-book-italic text-lg leading-[20px] tracking-[-0.36px] text-dark">
        Over 200,000 happy customers
      </h2>

      <a
        href="https://www.reviews.io/company-reviews/store/every-foods.com"
        target="_blank"
        rel="noopener"
        className="mx-6 inline-flex w-fit items-center gap-[9px]"
      >
        <Stars rating={AVERAGE} emptyColor="var(--color-light-grey-2)" />
        <span className="text-xs font-medium tracking-[-0.24px] whitespace-nowrap text-dark">
          {/* TODO(lift): replace with translation key */}
          Excellent&nbsp;&nbsp;·&nbsp;&nbsp;{AVERAGE.toFixed(1)} / 5
        </span>
        <span className="h-[13px] w-px shrink-0 bg-dark" aria-hidden />
        <ReviewsIoIcon size={98} className="shrink-0" />
      </a>

      <div className="scrollbar-hide flex items-stretch gap-5 overflow-x-auto px-6 pb-2">
        {REVIEWS.map((review) => (
          <ReviewCard key={review.name} review={review} />
        ))}
      </div>
    </section>
  );
}
