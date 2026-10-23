type Props = {
  /** e.g. "Excellent" */
  label: string;
  average: number;
};

const STAR_SIZE = 16;
const STAR_PATH = "M8 1l1.854 3.756L14 5.528l-3 2.922.708 4.128L8 10.5l-3.708 2.078L5 8.45 2 5.528l4.146-.772L8 1z";

/** Static, front-end-only "onColor" variation of MerchantRating: white stars filled dark up to the average, no reviews.io fetch. */
export function MerchantRating({ label, average }: Props) {
  return (
    <div className="inline-flex items-center gap-1.5">
      <div className="flex items-center gap-0.5" aria-label={`${average.toFixed(1)} out of 5 stars`}>
        {[...Array(5)].map((_, i) => {
          const fillPct = Math.max(0, Math.min(1, average - i)) * 100;
          return (
            <span key={i} className="relative" style={{ width: STAR_SIZE, height: STAR_SIZE }}>
              <svg width={STAR_SIZE} height={STAR_SIZE} viewBox="0 0 16 16" fill="#FFFFFF" className="absolute inset-0">
                <path d={STAR_PATH} />
              </svg>
              <svg
                width={STAR_SIZE}
                height={STAR_SIZE}
                viewBox="0 0 16 16"
                fill="currentColor"
                className="absolute inset-0 text-dark"
                style={{ clipPath: `inset(0 ${100 - fillPct}% 0 0)` }}
              >
                <path d={STAR_PATH} />
              </svg>
            </span>
          );
        })}
      </div>
      <span className="font-sans text-xs font-medium leading-4 tracking-[-0.24px] text-dark lg:leading-3.25">
        {label} · {average.toFixed(1)} / 5
      </span>
    </div>
  );
}
