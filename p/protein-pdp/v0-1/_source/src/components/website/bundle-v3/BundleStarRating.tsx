import { StarIcon } from "@/components/icons";
import { starFillPercent } from "./starFillPercent";

type Props = {
  rating: number;
  /** Text colour class for the empty stars, e.g. "text-light-grey". Production passes a hex `emptyColor`. */
  emptyClassName: string;
};

/** Port of every-website `src/components/website/bundle-v2/BundleStarRating.tsx`: 5 stars with half fills, a clipped orange star over the empty one. Colours come from tokens (currentColor) instead of hex. */
export function BundleStarRating({ rating, emptyClassName }: Props) {
  return (
    <div className="flex items-center gap-0.5 scale-75 origin-left" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const percent = starFillPercent(rating, i);
        return (
          <div key={i} className={`relative ${emptyClassName}`}>
            <StarIcon fill="currentColor" />
            {percent > 0 && (
              <div className="absolute inset-0 overflow-hidden text-signal-orange" style={{ width: `${percent}%` }} aria-hidden>
                <StarIcon fill="currentColor" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
