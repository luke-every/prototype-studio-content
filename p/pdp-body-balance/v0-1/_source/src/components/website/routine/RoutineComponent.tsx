"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import { CarouselArrowIcon, CarouselArrowMobileIcon } from "@/components/icons";
import { usePublicTranslations } from "@/providers/PublicTranslationsProvider";
import { RoutineComponentV2 } from "./RoutineComponentV2";

type Props = {
  eyebrow: string;
  /** May contain <em> for the serif italic part */
  headline: ReactNode;
  slides: string[];
  pillars: { icon?: string; title: string; body: string }[];
  backgroundColor?: string;
  /**
   * Fill of the round pillar markers. TODO(lift): needs a prop on RoutineComponent, production hardcodes #ffe473.
   */
  markerColor?: string;
  /** "V2" is the PDP redesign (see RoutineComponentV2). Default V1, the slideshow. */
  version?: "V1" | "V2";
  /** V2 only: clears the PDP rail on desktop */
  narrow?: boolean;
};

function RoutineSlideshow({ slides }: { slides: string[] }) {
  const t = usePublicTranslations();
  const [index, setIndex] = useState<number>(0);
  if (slides.length === 0) return null;

  return (
    <div className="relative aspect-[345/243.86] w-full overflow-hidden rounded-xl bg-light-grey lg:aspect-4/3 lg:h-auto">
      <Image src={slides[index]} alt="" fill className="object-cover" sizes="(max-width: 1023px) 100vw, 50vw" />
      {slides.length > 1 && (
        <>
          <button
            type="button"
            aria-label={t.homepage.carousel.prevSlideAriaLabel}
            onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
            className="absolute left-3 top-1/2 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/75 text-dark backdrop-blur-[2px]"
          >
            <CarouselArrowMobileIcon className="lg:hidden" />
            <CarouselArrowIcon size={16} className="hidden lg:block" />
          </button>
          <button
            type="button"
            aria-label={t.homepage.carousel.nextSlideAriaLabel}
            onClick={() => setIndex((i) => (i + 1) % slides.length)}
            className="absolute right-3 top-1/2 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/75 text-dark backdrop-blur-[2px]"
          >
            <CarouselArrowMobileIcon className="rotate-180 lg:hidden" />
            <CarouselArrowIcon size={16} className="hidden rotate-180 lg:block" />
          </button>
          <div className="absolute bottom-3.5 left-1/2 flex -translate-x-1/2 items-center gap-1.5" role="tablist" aria-label="Slideshow pages">
            {slides.map((src, i) => (
              <button
                key={src}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`cursor-pointer rounded-full transition-all ${i === index ? "size-2.25 bg-white" : "size-1.75 bg-white/50"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/** Port of every-website `src/components/website/routine/RoutineComponent.tsx`: plain props instead of the Storyblok blok; dispatches to V2 the same way. */
export function RoutineComponent({ eyebrow, headline, slides, pillars, backgroundColor, markerColor = "#FFE473", version = "V1", narrow }: Props) {
  if (version === "V2") {
    return <RoutineComponentV2 eyebrow={eyebrow} headline={headline} slides={slides} pillars={pillars} backgroundColor={backgroundColor ?? "#FFE473"} narrow={narrow} />;
  }

  return (
    <section className="w-full rounded-4xl px-6 pt-8 pb-16 lg:px-40 lg:py-16" style={{ backgroundColor: backgroundColor ?? "#FFFFFF" }}>
      <div className="flex flex-col gap-6 lg:mx-auto lg:max-w-280 lg:flex-row lg:items-start lg:gap-20">
        <div className="lg:order-1 lg:w-130 lg:shrink-0">
          <RoutineSlideshow slides={slides} />
        </div>

        <div className="flex flex-col gap-4 lg:order-2 lg:flex-1">
          <div className="flex flex-col gap-3">
            <p className="font-sans text-xs font-medium tracking-[-0.24px] text-dark">{eyebrow}</p>
            <h2 className="font-book text-2xl leading-6.5 tracking-[-0.48px] text-dark lg:text-[48px] lg:leading-12.5 lg:tracking-[-0.96px] [&_em]:font-book-italic">{headline}</h2>
          </div>

          <ul className="relative flex flex-col gap-8">
            {pillars.length > 1 && <div className="absolute bottom-8 left-4 top-8 w-0.5 bg-dark/92" aria-hidden="true" />}
            {pillars.map((pillar) => (
              <li key={pillar.title} className="relative flex items-center gap-10">
                <span className="relative flex size-8 shrink-0 items-center justify-center rounded-2xl shadow-[0px_4px_7px_rgba(55,45,39,0.18)]" style={{ backgroundColor: markerColor }}>
                  {pillar.icon && <Image src={pillar.icon} alt="" width={24} height={24} unoptimized className="size-6 object-contain" />}
                </span>
                <span className="flex flex-col gap-0.5">
                  <span className="font-sans text-base font-medium leading-5.5 tracking-[-0.32px] text-dark lg:leading-4.5">{pillar.title}</span>
                  <span className="font-sans text-xs leading-4 tracking-[-0.24px] text-dark lg:leading-3.25">{pillar.body}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
