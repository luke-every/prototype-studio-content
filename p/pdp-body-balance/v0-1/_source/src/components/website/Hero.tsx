"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import { Button } from "@/components/shared/Button";
import { MerchantRating } from "@/components/website/homepage/MerchantRating";

type Props = {
  rating?: { label: string; average: number };
  /** First headline line; may contain <em> */
  headlineLine1: ReactNode;
  /** Second line, set in serif italic. The first of `headlineTaglines` when it is set. */
  headlineTagline: string;
  /** Phrases to type, hold and delete in turn when `taglineAnimation` is on */
  headlineTaglines?: string[];
  taglineAnimation?: boolean;
  subheadline: string;
  bullets: string[];
  /** Desktop image, left half. Also used on mobile when `heroImageMobile` is not set. */
  heroImage: string;
  heroImageMobile?: string;
  /** Natural size of the mobile image, which sets its aspect ratio; without it the image is a fixed 12.25rem tall */
  heroImageMobileSize?: { width: number; height: number };
  backgroundColor?: string;
  ctaLabel: string;
  ctaHref: string;
};

const TYPE_START_DELAY = 800;
const TYPE_SPEED = 42;
const DELETE_SPEED = 28;
const HOLD_DURATION = 2200;
const CYCLE_GAP = 120;

/** Types each phrase, holds it, deletes it, then moves to the next — looping forever. Matches the reference
 * site's exact timing (the reference site's hero-type-cycle script): 800ms initial delay, 42ms/char typing,
 * 2200ms hold, 28ms/char deleting, 120ms gap before the next phrase starts. When `enabled` is false, skips
 * the animation entirely and just shows the first phrase statically. */
function useTypewriterCycle(phrases: string[], enabled: boolean) {
  const [display, setDisplay] = useState("");
  const [phase, setPhase] = useState<"typing" | "holding" | "deleting">("typing");
  const cycleKey = phrases.join("␟");

  useEffect(() => {
    if (!enabled) return;
    if (phrases.length === 0) return;

    let cancelled = false;
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const intervals: ReturnType<typeof setInterval>[] = [];

    function typePhrase(text: string, onDone: () => void) {
      setPhase("typing");
      let i = 0;
      const interval = setInterval(() => {
        i += 1;
        setDisplay(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          onDone();
        }
      }, TYPE_SPEED);
      intervals.push(interval);
    }

    function deletePhrase(text: string, onDone: () => void) {
      setPhase("deleting");
      let remaining = text.length;
      const interval = setInterval(() => {
        remaining -= 1;
        setDisplay(text.slice(0, remaining));
        if (remaining <= 0) {
          clearInterval(interval);
          onDone();
        }
      }, DELETE_SPEED);
      intervals.push(interval);
    }

    function cycle(index: number) {
      if (cancelled) return;
      typePhrase(phrases[index], () => {
        if (cancelled) return;
        setPhase("holding");
        timeouts.push(
          setTimeout(() => {
            if (cancelled) return;
            deletePhrase(phrases[index], () => {
              if (cancelled) return;
              timeouts.push(setTimeout(() => cycle((index + 1) % phrases.length), CYCLE_GAP));
            });
          }, HOLD_DURATION)
        );
      });
    }

    timeouts.push(
      setTimeout(() => {
        if (cancelled) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          setDisplay(phrases[0]);
          setPhase("holding");
          return;
        }
        cycle(0);
      }, TYPE_START_DELAY)
    );

    return () => {
      cancelled = true;
      timeouts.forEach(clearTimeout);
      intervals.forEach(clearInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- cycleKey (a stable string) is the real dependency; phrases is derived from it each render.
  }, [cycleKey, enabled]);

  if (!enabled) return { display: phrases[0] ?? "", showCursor: false };
  return { display, showCursor: phase !== "holding" };
}

/**
 * Port of every-website `src/components/website/Hero.tsx` (`hero`): plain props instead of the Storyblok blok and market.
 * The typewriter hook is copied as it is. The button is the shared Button rather than SbButton.
 */
export function Hero({
  rating,
  headlineLine1,
  headlineTagline,
  headlineTaglines,
  taglineAnimation = false,
  subheadline,
  bullets,
  heroImage,
  heroImageMobile,
  heroImageMobileSize,
  backgroundColor = "#FFE473",
  ctaLabel,
  ctaHref,
}: Props) {
  const mobileImage = heroImageMobile ?? heroImage;
  const taglines = headlineTaglines?.length ? headlineTaglines : [headlineTagline];
  const { display: typedTagline, showCursor } = useTypewriterCycle(taglines, taglineAnimation);

  return (
    <section className="w-full overflow-hidden rounded-b-4xl" style={{ backgroundColor }}>
      <div className="flex flex-col lg:flex-row lg:items-center">
        <div
          className={`relative w-full shrink-0 overflow-hidden lg:hidden ${heroImageMobileSize ? "" : "h-49"}`}
          style={heroImageMobileSize ? { aspectRatio: `${heroImageMobileSize.width} / ${heroImageMobileSize.height}` } : undefined}
        >
          <Image src={mobileImage} alt="" fill className="object-cover" priority sizes="100vw" />
        </div>
        <div className="relative hidden shrink-0 overflow-hidden lg:block lg:h-225 lg:w-1/2">
          <Image src={heroImage} alt="" fill className="object-cover" priority sizes="50vw" />
        </div>

        <div className="flex flex-col gap-4 px-6 pt-12 pb-16 lg:w-1/2 lg:justify-center lg:pt-0 lg:pr-40 lg:pb-12 lg:pl-20">
          <div className="flex flex-col gap-3">
            {rating && <MerchantRating label={rating.label} average={rating.average} />}

            <h1 className="flex flex-col tracking-[-0.68px] text-dark">
              <span className="font-book text-[34px] leading-8.5 lg:text-[48px] lg:leading-12.5 lg:tracking-[-0.96px] [&_em]:font-book-italic">{headlineLine1}</span>
              {/* Grid-stacks every phrase (invisible) in the same cell so the row auto-sizes to the tallest wrapped phrase. */}
              <span className="relative grid font-book-italic text-[34px] leading-8.5 lg:text-[48px] lg:leading-12.5 lg:tracking-normal">
                {taglines.map((phrase, i) => (
                  <span key={`${phrase}-${i}`} aria-hidden="true" className="invisible col-start-1 row-start-1">
                    {phrase}
                  </span>
                ))}
                <span aria-hidden="true" className="col-start-1 row-start-1">
                  {typedTagline}
                  {showCursor && <span className="ml-0.5 animate-pulse">|</span>}
                </span>
                <span className="sr-only">{taglines[0]}</span>
              </span>
            </h1>
          </div>

          <p className="max-w-125 font-sans text-sm leading-4.75 tracking-[-0.28px] text-dark lg:text-lg lg:leading-[1.4] lg:tracking-[-0.36px]">{subheadline}</p>

          <ul className="mb-2 flex flex-col gap-2 lg:gap-1.25">
            {bullets.map((bullet) => (
              <li key={bullet} className="flex items-center gap-2">
                <span className="font-sans text-xs leading-4 tracking-[-0.24px] text-dark lg:leading-3.25" aria-hidden="true">✓</span>
                <span className="font-sans text-sm leading-4.75 tracking-[-0.28px] text-dark lg:leading-4.5">{bullet}</span>
              </li>
            ))}
          </ul>

          {/* data-hero-cta is what the sticky bar watches */}
          <div data-hero-cta className="w-full lg:w-auto">
            <Button
              variant="dark"
              href={ctaHref}
              aria-label={ctaLabel}
              sizeClassName="w-full justify-center px-7 py-3.5 lg:w-auto"
              className="font-sans text-xs font-medium uppercase leading-none tracking-[1.8px]"
            >
              {ctaLabel}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
