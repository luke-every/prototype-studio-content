import { BundleReviewCard, type BundleReview } from "./BundleReviewCard";
import { BundleStarRating } from "./BundleStarRating";
import { ReviewsIoIcon } from "@/components/icons";
import { usePublicTranslations } from "@/providers/PublicTranslationsProvider";

type Props = {
  reviews: BundleReview[];
  rating: { average: number };
};

/** Front-end-only port of BundleReviewsSection: no reviews.io fetch, no loading state, no equal-height measuring. */
export function BundleReviewsSection({ reviews, rating }: Props) {
  const t = usePublicTranslations();

  return (
    <div className="flex flex-col gap-4 w-full">
      <h2 className="font-book-italic text-lg leading-[20px] tracking-[-0.36px] text-dark">{t.bundle.reviewsHeadline}</h2>

      <div className="flex items-stretch gap-5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {reviews.map((review) => (
          <BundleReviewCard key={review.name} review={review} />
        ))}
      </div>

      <a href="https://www.reviews.io/company-reviews/store/every-foods.com" target="_blank" rel="noopener" className="inline-flex items-center gap-[9px] w-fit">
        <BundleStarRating rating={rating.average} emptyColor="#E2DBD0" />
        <span className="font-sans font-medium text-xs tracking-[-0.24px] text-dark whitespace-nowrap">
          {t.bundle.excellent}&nbsp;&nbsp;·&nbsp;&nbsp;{rating.average.toFixed(1)} / 5
        </span>
        <span className="w-px h-[13px] bg-dark shrink-0" aria-hidden />
        <ReviewsIoIcon size={98} className="shrink-0" />
      </a>
    </div>
  );
}
