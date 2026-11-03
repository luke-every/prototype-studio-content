import { useTranslations } from "@/providers/TranslationsProvider";
import { interpolate } from "@/lib/translations";

const STAR_PATH = "M8 1l1.854 3.756L14 5.528l-3 2.922.708 4.128L8 10.5l-3.708 2.078L5 8.45 2 5.528l4.146-.772L8 1z";

type Props = {
  average: number;
  size?: number;
};

export function PartialFillStars({ average, size = 16 }: Props) {
  const t = useTranslations();
  return (
    <div className="flex items-center gap-0.5" aria-label={interpolate(t.shared.starRating.ariaLabel, { average: average.toFixed(1) })}>
      {[...Array(5)].map((_, i) => {
        const fillPct = Math.max(0, Math.min(1, average - i)) * 100;
        return (
          <span key={i} className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} viewBox="0 0 16 16" fill="#EEEAE6" className="absolute inset-0">
              <path d={STAR_PATH} />
            </svg>
            <svg
              width={size}
              height={size}
              viewBox="0 0 16 16"
              fill="#FF7D34"
              className="absolute inset-0"
              style={{ clipPath: `inset(0 ${100 - fillPct}% 0 0)` }}
            >
              <path d={STAR_PATH} />
            </svg>
          </span>
        );
      })}
    </div>
  );
}
