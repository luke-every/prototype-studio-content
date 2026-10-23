"use client";

import Image from "next/image";
import { Button } from "@/components/shared/Button";
import { stepMotion } from "@/lib/step-motion";
import type { StepMotion } from "./types";

type Props = {
  motion: StepMotion;
  onStart: () => void;
};

/** One photograph filling the step with the words under it; on a wide screen, the photograph beside them. */
export function QuizIntro({ motion, onStart }: Props) {
  const image = stepMotion(motion, 0, "intro");
  const title = stepMotion(motion, 0, "intro");
  const sub = stepMotion(motion, 45, "intro");
  const cta = stepMotion(motion, 90, "intro");
  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center lg:flex-row lg:gap-16 lg:text-left">
      <Image
        src="img/introImage.png"
        alt=""
        width={300}
        height={320}
        className={`mx-auto mb-10 aspect-300/320 w-[300px] max-w-full object-cover lg:m-0 lg:w-[min(480px,45%)] lg:shrink-0 ${image.className}`}
        style={image.style}
      />
      <div className="contents lg:flex lg:flex-col lg:items-start">
        {/* TODO(lift): replace with translation key */}
        <h1
          className={`m-0 max-w-[16ch] font-book text-[33px] leading-[38px] tracking-[-0.66px] text-near-black lg:max-w-none lg:text-[48px] lg:leading-[50px] lg:tracking-[-0.96px] ${title.className}`}
          style={title.style}
        >
          Let’s start with you
        </h1>
        {/* TODO(lift): replace with translation key */}
        <p
          className={`mt-3 mb-0 max-w-[30ch] text-[15px] leading-5 tracking-[-0.3px] text-light-text lg:max-w-none ${sub.className}`}
          style={sub.style}
        >
          Tell us how you eat. We’ll build your bundle around it.
        </p>
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
