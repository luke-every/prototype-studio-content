import { StarIcon } from "@/components/icons";

type Props = {
  rating: number;
  emptyColor: string;
};

/** Fill percentage (0, 50 or 100) for the star at `index`, so a 4.4 average shows 4 full stars and a half. */
const starFillPercent = (rating: number, index: number): number => {
  const diff = rating - index;
  if (diff >= 0.75) return 100;
  if (diff >= 0.25) return 50;
  return 0;
};

/** 5-star row with half-star fills: a clipped orange star over the empty-coloured one. */
export function BundleStarRating({ rating, emptyColor }: Props) {
  return (
    <div className="flex items-center gap-0.5 scale-75 origin-left" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const percent = starFillPercent(rating, i);
        return (
          <div key={i} className="relative">
            <StarIcon fill={emptyColor} />
            {percent > 0 && (
              <div className="absolute inset-0 overflow-hidden" style={{ width: `${percent}%` }} aria-hidden>
                <StarIcon fill="#FF7D34" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
