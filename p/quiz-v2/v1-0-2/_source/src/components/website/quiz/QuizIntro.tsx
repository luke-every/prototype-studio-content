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

/** What's ahead: a photograph, then the three parts of the quiz. On a wide screen, a larger photograph beside it. */
export function QuizIntro({ motion, onStart }: Props) {
  const image = stepMotion(motion, 0, "intro");
  const title = stepMotion(motion, 0, "intro");
  const cta = stepMotion(motion, 225, "intro");
  return (
    <div className="flex flex-1 flex-col justify-end gap-4 lg:flex-row lg:items-center lg:justify-start lg:gap-16">
      <Image
        src="img/introRoutine.png"
        alt=""
        width={211}
        height={167}
        /* the leaving copy of this step mounts a fresh <img>; lazy loading and async decoding make it flash */
        loading="eager"
        decoding="sync"
        className={`h-[167px] w-[211px] rounded-[18px] object-cover lg:h-auto lg:w-[min(480px,45%)] lg:shrink-0 lg:aspect-300/320 ${image.className}`}
        style={image.style}
      />
      <div className="flex flex-col gap-4 lg:max-w-[480px] lg:flex-1">
        {/* TODO(lift): replace with translation key */}
        <h1
          className={`m-0 font-book text-[37px] leading-[43px] tracking-[-0.74px] text-near-black lg:text-[48px] lg:leading-[50px] lg:tracking-[-0.96px] ${title.className}`}
          style={title.style}
        >
          Let’s build your
          <br />
          new routine
        </h1>
        <QuizSections current={1} motion={motion} kind="intro" delayMs={90} />
        {/* the in-copy button is for the wide layout only */}
        <div className={`mt-4 hidden lg:block ${cta.className}`} style={cta.style}>
          <Button
            type="button"
            variant="dark"
            onClick={onStart}
            aria-label="Lets go"
            sizeClassName="h-14 px-8"
            className="justify-center text-sm font-bold tracking-[.11em] uppercase active:bg-near-black"
          >
            {/* TODO(lift): replace with translation key */}
            Lets go
          </Button>
        </div>
      </div>
    </div>
  );
}
