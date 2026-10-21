import Image from "next/image";
import { MerchantRating } from "@/components/website/homepage/MerchantRating";

type Props = {
  rating?: { label: string; average: number };
  /** The lead, then the part set in italic */
  headline: { lead: string; italic: string };
  subheadline: string;
  bullets?: string[];
  heroImage: string;
  backgroundColor: string;
  ctaLabel: string;
  onCtaClick?: () => void;
};

/** Front-end-only port of HeroV2 (the landing page hero): no Storyblok blok, no video, no live rating, no sticky CTA bar. */
export function HeroV2({ rating, headline, subheadline, bullets = [], heroImage, backgroundColor, ctaLabel, onCtaClick }: Props) {
  return (
    <section className="relative flex min-h-dvh w-full flex-col overflow-hidden rounded-b-[32px] lg:grid lg:grid-cols-2 lg:items-stretch" style={{ backgroundColor }}>
      {/* Text column first in DOM order so keyboard and screen-reader users reach the headline before the photo; -order-1 below puts the photo first visually. */}
      <div className="flex w-full flex-none flex-col items-start gap-6 px-6 py-12 lg:flex-1 lg:justify-center lg:px-20">
        <div className="flex flex-col items-start gap-4">
          <div className="flex flex-col items-start gap-3">
            {rating && <MerchantRating label={rating.label} average={rating.average} />}
            <h1 className="max-w-195 font-book text-[34px] leading-[34px] tracking-[-0.68px] text-dark lg:text-[48px] lg:leading-[50px] lg:tracking-[-0.96px]">
              {headline.lead}
              <span className="font-book-italic">{headline.italic}</span>
            </h1>
          </div>
          <p className="max-w-125 font-sans text-sm leading-[19px] tracking-[-0.28px] text-dark lg:text-lg lg:leading-[1.4] lg:tracking-[-0.36px]">
            {subheadline}
          </p>
          {bullets.length > 0 && (
            <ul className="flex flex-col gap-2">
              {bullets.map((bullet) => (
                <li key={bullet} className="flex items-center gap-2 font-sans text-sm leading-[19px] tracking-[-0.28px] text-dark">
                  <span className="shrink-0 text-xs" aria-hidden="true">✓</span>
                  {bullet}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="w-full lg:w-auto">
          <button
            type="button"
            onClick={onCtaClick}
            aria-label={ctaLabel}
            className="w-full cursor-pointer rounded-[24px] bg-dark px-7 py-3.5 text-center font-sans text-[14px] uppercase leading-[14px] tracking-[2px] text-white lg:w-auto"
          >
            {ctaLabel}
          </button>
        </div>
      </div>

      <div className="relative -order-1 min-h-80 flex-1 overflow-hidden">
        <Image src={heroImage} alt="" fill priority sizes="(max-width: 1023px) 100vw, 50vw" className="object-cover object-top lg:object-center" />
      </div>
    </section>
  );
}
