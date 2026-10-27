"use client";

import Image from "next/image";
import { Button } from "@/components/shared/Button";
import { stepMotion } from "@/lib/step-motion";
import { QuizSections } from "./QuizSections";
import type { StepMotion } from "./types";

type Props = {
  motion: StepMotion;
  onStart: () => void;
};

/** What's ahead: the two parts of the quiz and the box they end with. On a wide screen, a photograph beside it. */
export function QuizIntro({ motion, onStart }: Props) {
  const image = stepMotion(motion, 0, "intro");
  const title = stepMotion(motion, 0, "intro");
  const sub = stepMotion(motion, 45, "intro");
  const cta = stepMotion(motion, 225, "intro");
  return (
    <div className="flex flex-1 flex-col lg:flex-row lg:items-center lg:gap-16">
      <Image
        src="img/introImage.png"
        alt=""
        width={300}
        height={320}
        className={`hidden aspect-300/320 object-cover lg:block lg:w-[min(480px,45%)] lg:shrink-0 ${image.className}`}
        style={image.style}
      />
      <div className="flex flex-col lg:max-w-[480px] lg:flex-1">
        {/* TODO(lift): replace with translation key */}
        <h1
          className={`m-0 font-book text-[33px] leading-[38px] tracking-[-0.66px] text-near-black lg:text-[48px] lg:leading-[50px] lg:tracking-[-0.96px] ${title.className}`}
          style={title.style}
        >
          Let’s build your box
        </h1>
        {/* TODO(lift): replace with translation key */}
        <p
          className={`mt-3 mb-0 text-[15px] leading-5 tracking-[-0.3px] text-light-text ${sub.className}`}
          style={sub.style}
        >
          Two quick parts, then your meals.
        </p>
        <div className="mt-6">
          <QuizSections current={1} motion={motion} kind="intro" delayMs={90} />
        </div>
        {/* the in-copy button is for the wide layout only */}
        <div className={`mt-8 hidden lg:block ${cta.className}`} style={cta.style}>
          <Button
            type="button"
            variant="dark"
            onClick={onStart}
            aria-label="Start"
            sizeClassName="h-14 px-8"
            className="justify-center text-sm font-bold tracking-[.11em] uppercase active:bg-near-black"
          >
            {/* TODO(lift): replace with translation key */}
            Start
          </Button>
        </div>
      </div>
    </div>
  );
}
