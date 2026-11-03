"use client";

import { StarIcon } from "@/components/icons";
import { useTranslations } from "@/providers/TranslationsProvider";
import { interpolate } from "@/lib/translations";

type Props = {
  average?: number;
  count?: number | null;
  layout?: "stacked" | "inline";
  loading?: boolean;
};

export function StarRating({ average, count, layout = "inline", loading }: Props) {
  const t = useTranslations();
  if (loading) {
    if (layout === "stacked") {
      return (
        <div className="flex flex-col items-center gap-1 animate-pulse" aria-hidden>
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-4 h-4 rounded-sm bg-gray-200" />
            ))}
          </div>
          <div className="h-3 w-20 rounded bg-gray-200" />
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2 animate-pulse" aria-hidden>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-4 h-4 rounded-sm bg-gray-200" />
          ))}
        </div>
        <div className="h-3 w-7 rounded bg-gray-200" />
        <div className="h-3 w-24 rounded bg-gray-200" />
      </div>
    );
  }

  if (average == null) return null;

  const filled = Math.round(average);

  const stars = (
    <div className="flex items-center gap-0.5" aria-label={interpolate(t.shared.starRating.ariaLabel, { average: average.toFixed(1) })}>
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon key={i} fill={i < filled ? "#FBD64D" : "#E5E7EB"} />
      ))}
    </div>
  );

  if (layout === "stacked") {
    return (
      <div className="flex flex-col items-center gap-1">
        {stars}
        {count != null && count > 0 && (
          <span className="text-sm text-light-text">{interpolate(t.shared.starRating.reviews, { count: count.toLocaleString() })}</span>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {stars}
      <span className="font-sans font-bold text-[13px] text-near-black leading-[20px]">
        {average.toFixed(2)}
      </span>
      {count != null && count > 0 && (
        <span className="font-sans text-[12.6px] text-near-black leading-[20px]">
          ({interpolate(t.shared.starRating.reviews, { count: count.toLocaleString() })})
        </span>
      )}
    </div>
  );
}
