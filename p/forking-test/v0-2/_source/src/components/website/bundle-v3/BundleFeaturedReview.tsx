import { ReviewsIoIcon } from "@/components/icons";
import { BundleStarRating } from "./BundleStarRating";
import type { BundleReview } from "./types";

type Props = {
  review: BundleReview;
  rating: { label: string; average: number };
};

/**
 * New: nothing in every-website does this (looked in: production's src/components, by name).
 * One highlighted review: stars, the quote as the lead, who said it, and a single rating line below.
 */
export function BundleFeaturedReview({ review, rating }: Props) {
  return (
    <div className="flex w-full flex-col gap-4">
      <figure className="flex flex-col gap-6 rounded-[24px] bg-white p-6 lg:p-8">
        <BundleStarRating rating={review.rating} emptyClassName="text-light-grey" />
        <blockquote className="font-book text-[24px] leading-[28px] tracking-[-0.48px] text-dark lg:text-[28px] lg:leading-8 lg:tracking-[-0.56px]">
          &ldquo;{review.comments}&rdquo;
        </blockquote>
        <figcaption className="flex flex-col gap-0.5 border-t border-light-grey pt-4">
          <span className="font-sans text-sm font-medium leading-[18px] tracking-[-0.28px] text-dark">{review.name}</span>
          {/* TODO(lift): replace with translation key */}
          <span className="font-sans text-xs leading-4 tracking-[-0.24px] text-dark/60">Verified purchase</span>
        </figcaption>
      </figure>

      <a
        href="https://www.reviews.io/company-reviews/store/every-foods.com"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Read our reviews on reviews.io"
        className="inline-flex w-fit items-center gap-[9px]"
      >
        <span className="whitespace-nowrap font-sans text-xs font-medium tracking-[-0.24px] text-dark">
          {rating.label}&nbsp;&nbsp;·&nbsp;&nbsp;{rating.average.toFixed(1)} / 5
        </span>
        <span className="h-[13px] w-px shrink-0 bg-dark" aria-hidden />
        <ReviewsIoIcon size={98} className="shrink-0" />
      </a>
    </div>
  );
}
