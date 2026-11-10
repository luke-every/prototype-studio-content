"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/shared/Button";

/** Share of the page scrolled before the mobile quiz bar slides in. */
const SHOW_AFTER = 0.2;

function QuizCard({ className }: { className: string }) {
  return (
    <div className={`items-center gap-4 rounded-xl border border-light-grey bg-white p-3 shadow-[4px_4px_8px_rgba(0,0,0,0.04)] ${className}`}>
      <div className="relative h-[55px] w-[70px] shrink-0 overflow-hidden rounded-lg bg-off-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/quiz-card.png" alt="" className="absolute left-[-52.29%] top-[-20.32%] h-[180.12%] w-[178.9%] max-w-none" />
      </div>
      <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
        <div className="flex w-[159px] flex-col gap-0.5 lg:w-auto">
          {/* TODO(lift): replace with translation key */}
          <p className="font-sans text-sm font-medium leading-[15px] tracking-[-0.28px] text-dark">Unsure where to start?</p>
          <p className="font-sans text-xs leading-4 tracking-[-0.24px] text-light-text">Get matched to the right bundle for you</p>
        </div>
        <Button variant="dark" href="#" sizeClassName="h-10 px-4 py-3" className="shrink-0 font-sans text-xs font-medium uppercase leading-none tracking-[1.8px]" aria-label="Start the quiz">
          {/* TODO(lift): replace with translation key */}
          Start the quiz
        </Button>
      </div>
    </div>
  );
}

/** The section shell every comparison variant shares: the "Discover our bundles" heading row with the quiz card (a sticky bottom bar on mobile). */
export function ComparisonFrame({ children }: { children: ReactNode }) {
  const [showBar, setShowBar] = useState<boolean>(false);

  useEffect(() => {
    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setShowBar(scrollable > 0 && window.scrollY / scrollable >= SHOW_AFTER);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="w-full px-4 pb-[160px] pt-10 lg:py-16">
      <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-8 lg:gap-14">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex max-w-[640px] flex-col gap-3">
            {/* TODO(lift): replace with translation key */}
            <h2 className="font-book text-[34px] leading-[34px] tracking-[-0.68px] text-dark lg:text-[48px] lg:leading-[50px] lg:tracking-[-0.96px]">Discover our bundles</h2>
            {/* TODO(lift): replace with translation key */}
            <p className="font-sans text-sm leading-[19px] tracking-[-0.28px] text-light-text">
              All of our meals are 100% plant-based, chef-designed and nutritionist-checked, then delivered frozen and ready in under 10 minutes.
            </p>
          </div>
        </div>

        {children}

        <QuizCard className="hidden w-full lg:flex" />
      </div>

      <div
        className={`fixed inset-x-0 bottom-0 z-40 p-3 transition-transform duration-300 ease-out lg:hidden ${showBar ? "translate-y-0" : "translate-y-full"}`}
        aria-hidden={!showBar}
        inert={!showBar}
      >
        <QuizCard className="flex" />
      </div>
    </section>
  );
}
