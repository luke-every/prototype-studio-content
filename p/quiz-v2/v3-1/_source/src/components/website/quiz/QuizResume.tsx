"use client";

import Image from "next/image";
import { CheckedIcon } from "@/components/icons";
import { Button } from "@/components/shared/Button";
import { PHOTO } from "../results/ProfileHero";
import { QUESTIONS } from "./sample-data";
import { QuizStepper } from "./QuizStepper";
import type { Answers } from "./types";

type Props = {
  /** They left the quiz part way, or finished it and came back */
  kind: "started" | "done";
  answers: Answers;
  /** On to the quiz where they left it, or to their results */
  onContinue: () => void;
  onStartOver: () => void;
  onClose: () => void;
};

// TODO(lift): sample data — four photos from the site's own library
const COLLAGE = [
  "hero/fitness01.png",
  "hero/PerfectPortionsHero-01.png",
  "hero/PostPartumHero-01.png",
  "img/bb1.jpg",
];

const BUTTON =
  "h-14 w-full justify-center text-sm font-bold tracking-[.11em] uppercase active:bg-near-black active:text-white";

const labelOf = (id: "goal" | "challenges", answers: Answers): string[] => {
  const options = QUESTIONS.find((question) => question.id === id)?.options ?? [];
  return answers[id].flatMap((value) => options.find((option) => option.value === value)?.label ?? []);
};

/**
 * "Welcome back", when the quiz is opened again: part way through it asks to carry on or start over; once
 * finished, it shows the plan they made and asks to go back to it or start over.
 */
export function QuizResume({ kind, answers, onContinue, onStartOver, onClose }: Props) {
  const goal = answers.goal[0];
  const photo = PHOTO[goal] ?? PHOTO.better;
  /* TODO(lift): replace with translation keys */
  return (
    <>
      <QuizStepper sections={[0, 0]} narrow={false} intro onBack={onClose} onClose={onClose} />
      <div className="scrollbar-hide flex min-h-0 flex-1 flex-col justify-center overflow-y-auto px-6 py-6 lg:mx-auto lg:w-full lg:max-w-[544px]">
        {kind === "started" ? (
          <div className="flex flex-col items-center gap-8 text-center">
            <div className="grid h-[315px] w-[302px] max-w-full grid-cols-2 grid-rows-2 gap-2 overflow-hidden rounded-3xl">
              {COLLAGE.map((src) => (
                <div key={src} className="relative bg-white">
                  <Image src={src} alt="" fill sizes="151px" unoptimized className="object-cover" />
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="m-0 font-book text-[37px] leading-[43px] tracking-[-0.74px] text-near-black">
                Welcome back
              </h1>
              <p className="m-0 text-base leading-6 tracking-[-0.32px] text-light-text">
                Pick up where you left off and we’ll help you find your match.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <h1 className="m-0 pr-[15%] font-book text-[37px] leading-[43px] tracking-[-0.74px] text-near-black">
              Looks like you’ve been here before
            </h1>
            <div className="flex flex-col gap-4 rounded-[28px] border border-dark/10 bg-linear-to-b from-(--goal-surface) to-white to-50% px-5 py-6">
              <div className="flex flex-col gap-3">
                <p className="m-0 text-[10px] leading-3 font-medium tracking-[1.2px] text-dark uppercase">
                  Your personalised plan
                </p>
                <p className="m-0 font-book text-[22px] leading-6 tracking-[-0.44px] text-dark">
                  {labelOf("goal", answers)[0]}
                </p>
                <div className="flex flex-wrap gap-2">
                  {labelOf("challenges", answers).slice(0, 3).map((label) => (
                    <span
                      key={label}
                      className="flex items-center gap-1 rounded-full bg-dark/8 px-2 py-1 text-sm leading-[19px] tracking-[-0.28px] text-near-black"
                    >
                      <CheckedIcon size={10} />
                      {label}
                    </span>
                  ))}
                </div>
              </div>
              <div className="relative h-[200px] overflow-hidden rounded-[14px] bg-white">
                <Image src={photo(1)} alt="" fill sizes="344px" unoptimized className="object-cover" />
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex shrink-0 flex-col gap-3 px-6 pb-6 lg:mx-auto lg:w-full lg:max-w-[544px]">
        <Button type="button" variant="dark" onClick={onContinue} aria-label={kind === "done" ? "Continue to my plan" : "Continue"} sizeClassName="px-8" className={BUTTON}>
          {kind === "done" ? "Continue to my plan" : "Continue"}
        </Button>
        <Button type="button" variant="white" onClick={onStartOver} aria-label="Start over" sizeClassName="px-8" className={BUTTON}>
          Start over
        </Button>
      </div>
    </>
  );
}
