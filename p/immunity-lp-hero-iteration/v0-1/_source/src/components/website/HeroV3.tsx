"use client";

import Image from "next/image";
import { Button } from "@/components/shared/Button";
import { useTypewriterCycle } from "./Hero";
import { MerchantRating } from "./homepage/MerchantRating";

type Props = {
  rating: { label: string; average: number };
  headlineLine1: string;
  headlineTagline: string;
  subheadline: string;
  bullets: string[];
  image: string;
  imageSize: { width: number; height: number };
  ctaLabel: string;
  ctaHref: string;
};

/** The image runs full width at its own ratio up to 264px tall, then scales inside that box. The rating and headline sit over its lower edge on a fade into the hero's colour (--bundle). */
export function HeroV3({ rating, headlineLine1, headlineTagline, subheadline, bullets, image, imageSize, ctaLabel, ctaHref }: Props) {
  const { display, showCursor } = useTypewriterCycle([headlineTagline], true);

  return (
    <section className="w-full overflow-hidden rounded-b-4xl bg-(--bundle)">
      <div className="relative max-h-66 w-full overflow-hidden" style={{ aspectRatio: `${imageSize.width} / ${imageSize.height}` }}>
        <Image src={image} alt="" fill className="object-cover" priority sizes="100vw" />
      </div>

      <div className="relative -mt-28 flex flex-col gap-4 px-6 pt-12 pb-8">
        {/* the fade only covers the part over the image */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-28 bg-[linear-gradient(to_top,var(--bundle),color-mix(in_srgb,var(--bundle)_0%,transparent))]"
        />
        <div className="relative flex flex-col gap-2">
          <MerchantRating label={rating.label} average={rating.average} />
          <h1 className="pr-4 font-book text-[34px] leading-[34px] tracking-[-0.68px] text-dark">
            {headlineLine1}{" "}
            {/* The words not typed yet stay in the line, hidden, so the wrapping is the finished headline's from the first letter and nothing jumps or breaks early. */}
            <i className="font-book-italic">
              <span aria-hidden="true">
                {display}
                {showCursor && (
                  /* a plain inline span with an out-of-flow cursor: an inline-block here would let the line break in the middle of a word */
                  <span className="relative">
                    <span className="absolute left-0.5 animate-pulse">|</span>
                  </span>
                )}
                <span className="invisible">{headlineTagline.slice(display.length)}</span>
              </span>
              <span className="sr-only">{headlineTagline}</span>
            </i>
          </h1>
          <p className="max-w-125 font-sans text-sm leading-4.75 tracking-[-0.28px] text-dark">{subheadline}</p>
        </div>

        <ul className="relative flex flex-col gap-2">
          {bullets.map((bullet) => (
            <li key={bullet} className="flex items-center gap-2">
              <span className="font-sans text-xs leading-4 tracking-[-0.24px] text-dark" aria-hidden="true">✓</span>
              <span className="font-sans text-sm leading-4.75 tracking-[-0.28px] text-dark">{bullet}</span>
            </li>
          ))}
        </ul>

        <div className="relative w-full">
          <Button
            variant="dark"
            href={ctaHref}
            aria-label={ctaLabel}
            sizeClassName="w-full justify-center px-8 py-3.5"
            className="font-sans text-xs font-medium uppercase leading-none tracking-[1.8px]"
          >
            {ctaLabel}
          </Button>
        </div>
      </div>
    </section>
  );
}
