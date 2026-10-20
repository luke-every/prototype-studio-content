import { ReviewsIoIcon } from "@/components/icons";
import { BundleReviewCard } from "./BundleReviewCard";
import { BundleStarRating } from "./BundleStarRating";
import type { BundleReview } from "./types";

type Props = {
  headline: string;
  reviews: BundleReview[];
  rating: { label: string; average: number };
};

/**
 * Port of every-website `src/components/website/bundle-v2/BundleReviewsSection.tsx`: plain props, no reviews.io fetch,
 * and no resting-height measuring (cards size to their own text). The coloured band around it lives in the page, as in
 * `bundle-v3/BundleContent.tsx`.
 */
export function BundleReviewsSection({ headline, reviews, rating }: Props) {
  return (
    <div className="flex w-full flex-col gap-4">
      <h2 className="font-book-italic text-lg leading-5 tracking-[-0.36px] text-dark">{headline}</h2>

      <div className="flex gap-5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {reviews.map((review, i) => (
          <BundleReviewCard key={`${review.name}-${i}`} review={review} />
        ))}
      </div>

      <a
        href="https://www.reviews.io/company-reviews/store/every-foods.com"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Read our reviews on reviews.io"
        className="inline-flex w-fit items-center gap-[9px]"
      >
        <BundleStarRating rating={rating.average} emptyClassName="text-light-grey-2" />
        <span className="whitespace-nowrap font-sans text-xs font-medium tracking-[-0.24px] text-dark">
          {rating.label}&nbsp;&nbsp;·&nbsp;&nbsp;{rating.average.toFixed(1)} / 5
        </span>
        <span className="h-[13px] w-px shrink-0 bg-dark" aria-hidden />
        <ReviewsIoIcon size={98} className="shrink-0" />
      </a>
    </div>
  );
}
