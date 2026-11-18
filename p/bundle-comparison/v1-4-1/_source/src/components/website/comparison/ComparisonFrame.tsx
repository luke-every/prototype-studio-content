"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRightIcon } from "@/components/icons";
import { useShortViewport } from "@/hooks/useShortViewport";
import { copy } from "./copy";

/** Share of the page scrolled before the mobile quiz bar slides in. */
const SHOW_AFTER = 0.2;

/** The sticky quiz bar on a phone: a full-width white bar with a photo, the quiz title and line, and a chevron. Whole bar is the link. On a short phone viewport (see useShortViewport) it shrinks to a mini bar: a 40×40 photo and one line, "Take our quiz and find your bundle". */
function QuizBar({ mini }: { mini: boolean }) {
  return (
    <Link
      href="#"
      className={`mx-auto flex w-full max-w-[430px] items-center gap-3 px-4 ${mini ? "py-2" : "py-4"}`}
      aria-label="Start the quiz"
    >
      <div className={`relative shrink-0 overflow-hidden ${mini ? "size-10 rounded-xl" : "h-[60px] w-20 rounded-[18px]"}`}>
        <Image src="/img/quiz-sticky.png" alt="" fill sizes="80px" className="object-cover" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {mini ? (
          <p className="font-sans text-sm font-medium leading-[19px] tracking-[-0.28px] text-dark">{copy("quiz.mini")}</p>
        ) : (
          <>
            <p className="font-sans text-sm font-medium leading-[15px] tracking-[-0.28px] text-dark">{copy("quiz.title")}</p>
            <p className="font-sans text-sm leading-[19px] tracking-[-0.28px] text-light-text">{copy("quiz.line")}</p>
          </>
        )}
      </div>
      <ChevronRightIcon size={10} />
    </Link>
  );
}

/** The section shell every comparison variant shares: the "Discover our bundles" heading row with the quiz card (a sticky bottom bar on mobile). */
export function ComparisonFrame({ children, footerBelow = false, stickyQuiz = true }: { children: ReactNode; /** A footer follows the section, so it does not need the tall bottom gap that clears the sticky quiz card on a phone. */ footerBelow?: boolean; /** The quiz card as a sticky bar at the bottom of a phone. Off on a short page that shows the quiz in the page instead. */ stickyQuiz?: boolean }) {
  const [showBar, setShowBar] = useState<boolean>(false);
  const mini = useShortViewport();

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
    <section className={`w-full overflow-x-clip px-4 pt-10 lg:py-16 ${footerBelow ? "pb-12" : "pb-[160px]"}`}>
      <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-8 lg:gap-14">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex max-w-[640px] flex-col gap-3">
            <h2 className="font-book text-[34px] leading-[34px] tracking-[-0.68px] text-dark lg:text-[48px] lg:leading-[50px] lg:tracking-[-0.96px]">{copy("intro.heading")}</h2>
            <p className="font-sans text-sm leading-[19px] tracking-[-0.28px] text-light-text">{copy("intro.body")}</p>
          </div>
        </div>

        {children}

      </div>

      {stickyQuiz && (
      <div
        className={`fixed inset-x-0 bottom-0 z-40 bg-white shadow-[0_-2px_6px_rgba(55,45,39,0.12)] transition-transform duration-300 ease-out lg:hidden ${showBar ? "translate-y-0" : "translate-y-full"}`}
        aria-hidden={!showBar}
        inert={!showBar}
      >
        <QuizBar mini={mini} />
      </div>
      )}
    </section>
  );
}
