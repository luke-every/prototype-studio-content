import Image from "next/image";
import { NARROW_INSET_CLASS } from "@/lib/section-width";

type Props = {
  headline: string;
  logos: { src: string; alt: string; width: number; height: number }[];
  /** Clears the PDP rail on desktop; off for full-width pages */
  narrow?: boolean;
};

/** How many times the logo set repeats before the seamless-loop duplicate is appended, so the seam is off screen. */
const REPEAT_COUNT = 3;
const BASE_DURATION_S = 30;

/** Port of every-website `src/components/website/featured-by/FeaturedByComponent.tsx`: plain props; an auto-scrolling logo strip using the `ticker` keyframe in globals.css. */
export function FeaturedByComponent({ headline, logos, narrow = true }: Props) {
  const repeated = Array.from({ length: REPEAT_COUNT }, () => logos).flat();
  const doubled = [...repeated, ...repeated];

  return (
    <section className={`flex w-full flex-col items-center gap-6 overflow-hidden bg-white pt-8 pb-16 lg:gap-8 lg:py-16 ${narrow ? NARROW_INSET_CLASS : ""}`}>
      <p className="px-8 text-center font-sans text-[18px] leading-5.5 tracking-[-0.36px] text-dark lg:text-2xl lg:leading-6.5 lg:tracking-[-0.48px]">{headline}</p>

      <div className="relative w-full lg:mx-auto lg:max-w-280">
        <div className="flex overflow-hidden">
          <div
            className="flex shrink-0 animate-[ticker_linear_infinite] items-center gap-18.25 pr-18.25 hover:[animation-play-state:paused]"
            style={{ animationDuration: `${BASE_DURATION_S * REPEAT_COUNT}s` }}
          >
            {doubled.map((logo, i) => (
              <div key={`${logo.alt}-${i}`} className="relative shrink-0" style={{ width: logo.width, height: logo.height }}>
                <Image src={logo.src} alt={logo.alt} fill unoptimized className="object-contain" sizes={`${logo.width}px`} />
              </div>
            ))}
          </div>
        </div>

        <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-linear-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-linear-to-l from-white to-transparent" />
      </div>
    </section>
  );
}
