"use client";

import { Button } from "@/components/shared/Button";
import { QUESTIONS } from "./sample-data";
import type { StepKey } from "./types";

type Props = {
  step: StepKey;
  /** Continue holds its space before it is earned, so the question above it never shifts */
  holdContinue: boolean;
  /** Which ground the footer fades into */
  tone: "grey" | "white";
  /** The copy of the old footer, animating out */
  leaving?: boolean;
  onNext: () => void;
};

/**
 * Pinned to the bottom of the sheet. It fades from nothing into the quiz's own ground rather than
 * sitting on a hard band, so content passing under it reads as "there is more to scroll".
 */
export function QuizFooter({ step, holdContinue, tone, leaving = false, onNext }: Props) {
  const isIntro = step === "intro";
  /* a single choice moves on by itself when picked, so it has no Continue */
  const isSingle = QUESTIONS.find((question) => question.id === step)?.type === "single";
  const motion = leaving ? "animate-foot-leave" : "animate-foot-in";
  const ground = leaving
    ? ""
    : tone === "white"
      ? "bg-linear-to-b from-white/0 to-white to-60%"
      : "bg-linear-to-b from-light-grey/0 to-light-grey to-60%";
  return (
    <div
      className={`pointer-events-none absolute inset-x-0 bottom-0 z-[12] flex items-center gap-3 px-6 pt-16 pb-6 transition-colors duration-[800ms] ease-ui lg:px-[calc((100%-544px)/2+24px)] ${ground} ${
        isIntro ? "lg:hidden" : ""
      }`}
    >
      {isSingle ? (
        <span className="h-14 flex-1" />
      ) : (
        <Button
          type="button"
          variant="dark"
          onClick={onNext}
          aria-label={isIntro ? "Start" : "Continue"}
          sizeClassName="h-14 px-8"
          className={`flex-1 justify-center text-sm font-bold tracking-[.11em] uppercase transition-[opacity,translate,background-color] duration-300 ease-ui active:bg-near-black ${motion} ${
            holdContinue ? "pointer-events-none translate-y-1.5 opacity-0" : leaving ? "pointer-events-none" : "pointer-events-auto"
          }`}
        >
          {/* TODO(lift): replace with translation key */}
          {isIntro ? "Start" : "Continue"}
        </Button>
      )}
    </div>
  );
}
