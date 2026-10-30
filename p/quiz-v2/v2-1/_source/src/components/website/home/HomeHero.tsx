"use client";

import Link from "next/link";
import { Button } from "@/components/shared/Button";
import { PRESS } from "@/lib/press-classes";
import { HomeNav } from "./HomeNav";

type Props = {
  navSolid: boolean;
  navRef: React.Ref<HTMLDivElement>;
  imageRef: React.Ref<HTMLDivElement>;
  /** Wraps the call to action, so the page can tell when it has scrolled out of sight */
  ctaRef: React.Ref<HTMLDivElement>;
  onOpenQuiz: () => void;
};

export function HomeHero({ navSolid, navRef, imageRef, ctaRef, onOpenQuiz }: Props) {
  return (
    <>
      {/* the navigation sits over the photograph and travels with the page */}
      <div ref={navRef} className="sticky top-0 z-20">
        <HomeNav solid={navSolid} />
      </div>

      <section className="-mt-[72px] rounded-b-[32px] bg-light-orange pb-8">
        <div ref={imageRef} className="relative h-[550px] overflow-hidden bg-white">
          {/* The clip plays itself, silently and without controls. Its first frame is the poster. */}
          <video
            className="pointer-events-none absolute inset-0 block size-full object-cover"
            poster="img/hp-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            <source src="img/hero.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-x-6 bottom-4 z-[2] flex flex-col gap-3">
            <p className="m-0 flex items-center gap-1.5">
              {/* four and a half of five: the orange row is clipped to 90% of its width */}
              <span
                className="relative block w-[90px] overflow-hidden text-base leading-4 tracking-[2px] text-white/35"
                aria-hidden
              >
                ★★★★★
                <span className="absolute left-0 top-0 w-[90%] overflow-hidden whitespace-nowrap text-signal-orange">
                  ★★★★★
                </span>
              </span>
              {/* TODO(lift): replace with translation key */}
              <span className="text-xs leading-4 font-medium tracking-[-0.24px] text-white">
                Excellent &nbsp;&middot;&nbsp; 4.5 / 5
              </span>
            </p>
            {/* TODO(lift): replace with translation key */}
            <h1 className="m-0 font-book text-[34px] leading-[34px] tracking-[-0.68px] text-white">
              Feel-good food.
              <br />
              Ready in your freezer.
            </h1>
          </div>
          {/* the photograph dissolves into the peach it sits on, over the last 48px */}
          <span className="absolute inset-x-0 bottom-0 h-12 bg-linear-to-b from-light-orange/0 via-light-orange via-[79.5%] to-light-orange" />
        </div>

        <div className="px-6 pt-2">
          {/* TODO(lift): replace with translation key */}
          <p className="mb-4 text-sm leading-[19px] tracking-[-0.28px] text-dark">
            Wholefood, plant-based meals. Crafted by chefs. On your table in minutes.
          </p>
          <ul className="m-0 flex list-none flex-col gap-2 p-0">
            {/* TODO(lift): replace with translation key */}
            {[
              "Delicious meals – only a few clicks away",
              "From 5,43€ per meal",
              "Flexible plan: Skip or cancel anytime",
            ].map((text) => (
              <li key={text} className="flex items-baseline gap-2">
                <i className="w-[13px] shrink-0 text-xs leading-4 not-italic text-dark">&#10003;</i>
                <span className="text-sm leading-[19px] tracking-[-0.28px] text-dark">{text}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-col items-center gap-6 py-6">
            <div ref={ctaRef} className="w-full">
              <Button
                type="button"
                variant="primary"
                onClick={onOpenQuiz}
                aria-label="Find your routine"
                sizeClassName="px-7 py-3.5"
                className={`w-full justify-center text-sm leading-[14px] tracking-[2px] text-near-black uppercase ${PRESS} active:scale-[.98]`}
              >
                {/* TODO(lift): replace with translation key */}
                Find your routine
              </Button>
            </div>
            {/* TODO(lift): replace with translation key */}
            <Link href="#" aria-label="Pick your meals" className="text-sm leading-[19px] tracking-[-0.28px] text-near-black underline">
              Pick your meals
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
