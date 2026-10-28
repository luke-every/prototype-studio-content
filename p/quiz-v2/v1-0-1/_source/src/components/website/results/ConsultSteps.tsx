"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/shared/Button";
import { stepMotion, stepTravel } from "@/lib/step-motion";
import { QuizStepper } from "../quiz/QuizStepper";
import type { Headline } from "./framing";
import { HeadlineWords } from "./ResultsHero";
import type { Routine } from "./routine";

type Props = {
  headline: Headline;
  routine: Routine;
  /** Both steps seen, or skipped: the results take over */
  onDone: () => void;
};

/** The steps fade off the results over this long */
const LEAVE_MS = 500;

const EYEBROW = "m-0 text-xs leading-4 font-medium tracking-[-0.24px] text-light-text";

/**
 * D's consultation: two more steps of the quiz between the loader and the results, on the quiz's own
 * ground and with its stepper, so it reads as the quiz answering back. First what we heard, as one
 * sentence; then what their body needs and the rules we picked their meals by. The results are there
 * underneath when the last step leaves.
 */
export function ConsultSteps({ headline, routine, onDone }: Props) {
  const [step, setStep] = useState<1 | 2>(1);
  const [dir, setDir] = useState<"push" | "pop">("push");
  const [leaving, setLeaving] = useState<boolean>(false);
  const doneTimer = useRef<number | null>(null);
  useEffect(() => () => {
    if (doneTimer.current !== null) window.clearTimeout(doneTimer.current);
  }, []);

  const go = (next: 1 | 2) => {
    setDir(next > step ? "push" : "pop");
    setStep(next);
  };
  const finish = () => {
    setLeaving(true);
    doneTimer.current = window.setTimeout(onDone, LEAVE_MS);
  };
  /* the first step rises up out of the loader; after that, steps cross sideways as the quiz's do */
  const travel = step === 1 && dir === "push" ? stepTravel("opening", "push") : stepTravel("enter", dir);
  const rise = (delay: number) => stepMotion("enter", delay);

  return (
    <div
      className={`absolute inset-0 z-[20] flex flex-col bg-light-grey [transition:opacity_500ms_var(--ease-ui),translate_500ms_var(--ease-swing)] ${
        leaving ? "pointer-events-none translate-y-6 opacity-0" : "opacity-100"
      }`}
    >
      <div className="scrollbar-hide relative flex flex-1 flex-col overflow-y-auto overscroll-contain">
        <QuizStepper sections={[1, step === 2 ? 1 : 0]} narrow onBack={() => step === 2 && go(1)} onClose={finish} />
        <div key={step} className="flex flex-1 flex-col px-6 pt-[30px] pb-[156px] lg:mx-auto lg:w-full lg:max-w-[544px]" style={travel}>
          {step === 1 ? (
            <div className="flex flex-1 flex-col justify-center pb-[30px]">
              {/* TODO(lift): replace with translation keys */}
              <p className={`${EYEBROW} ${rise(60).className}`} style={rise(60).style}>
                Here&rsquo;s what we heard
              </p>
              <HeadlineWords
                headline={headline}
                className={`mt-4 mb-0 font-book text-[33px] leading-[46px] tracking-[-0.66px] text-near-black ${rise(140).className}`}
                style={rise(140).style}
              />
            </div>
          ) : (
            <>
              {/* TODO(lift): replace with translation key */}
              <p className={`${EYEBROW} ${rise(60).className}`} style={rise(60).style}>
                Our recommendation
              </p>
              <h1
                className={`mt-3 mb-0 font-book text-[31px] leading-9 tracking-[-0.62px] text-near-black ${rise(120).className}`}
                style={rise(120).style}
              >
                {routine.picked}
              </h1>
              <p className={`mt-3 mb-0 text-[15px] leading-5 tracking-[-0.3px] text-light-text ${rise(180).className}`} style={rise(180).style}>
                {routine.storyIntro}
              </p>
              <ul className="m-0 mt-7 flex list-none flex-col gap-3 p-0">
                {routine.principles.map((principle, i) => {
                  const motion = rise(260 + i * 70);
                  return (
                    <li key={principle.did} className={`flex items-center gap-4 rounded-2xl bg-white p-4 ${motion.className}`} style={motion.style}>
                      <span
                        aria-hidden
                        className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-light-grey text-[22px] leading-none"
                      >
                        {principle.icon}
                      </span>
                      <div className="min-w-0">
                        <p className="m-0 text-base leading-[22px] font-medium tracking-[-0.32px] text-near-black">{principle.did}</p>
                        <p className="mt-1 mb-0 text-sm leading-[18px] tracking-[-0.28px] text-light-text">{principle.short}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>
      </div>
      {/* the quiz footer: fades from nothing into the ground, so content passing under it reads as "there is more" */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[12] flex bg-linear-to-b from-light-grey/0 to-light-grey to-60% px-6 pt-16 pb-6 lg:px-[calc((100%-544px)/2+24px)]">
        <Button
          type="button"
          variant="dark"
          onClick={() => (step === 1 ? go(2) : finish())}
          aria-label={step === 1 ? "Continue" : "See my box"}
          sizeClassName="h-14 px-8"
          className="pointer-events-auto flex-1 justify-center text-sm font-bold tracking-[.11em] uppercase active:bg-near-black"
        >
          {/* TODO(lift): replace with translation keys */}
          {step === 1 ? "Continue" : "See my box"}
        </Button>
      </div>
    </div>
  );
}
