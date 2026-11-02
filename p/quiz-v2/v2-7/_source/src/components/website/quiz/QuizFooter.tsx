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
export function QuizFooter({
  step,
  holdContinue,
  tone,
  leaving = false,
  onNext,
}: Props) {
  const isIntro = step === "intro";
  /* a single choice moves on by itself when picked, so it has no Continue */
  const isSingle = QUESTIONS.find((question) => question.id === step)?.type === "single";
  /* the email step's two buttons: the first sends its form, which sits in the step above */
  const isEmail = step === "email";
  const motion = leaving ? "animate-foot-leave" : "animate-foot-in";
  /* a single choice has no button to sit on, so its ground is clear; it stays a gradient, only transparent, so the next step's fades in with the page instead of switching on */
  const ground = leaving
    ? ""
    : isSingle
      ? "bg-linear-to-b from-white/0 to-white/0"
      : tone === "white"
        ? "bg-linear-to-b from-white/0 to-white to-60%"
        : "bg-linear-to-b from-light-grey/0 to-light-grey to-60%";
  return (
    <div
      className={`pointer-events-none absolute inset-x-0 bottom-0 z-[12] flex items-center gap-3 px-6 pt-16 pb-6 transition-colors duration-[800ms] ease-ui lg:px-[calc((100%-544px)/2+24px)] ${ground} ${
        isIntro ? "lg:hidden" : ""
      } ${isEmail ? "flex-col" : ""}`}
    >
      {isSingle ? (
        <span className="h-14 flex-1" />
      ) : isEmail ? (
        <>
          {/* TODO(lift): replace with translation keys */}
          <Button
            type="submit"
            form="quiz-email"
            variant="dark"
            aria-label="Continue"
            sizeClassName="h-14 px-8"
            className={`w-full justify-center text-sm font-bold tracking-[.11em] uppercase transition-[opacity,translate,background-color] duration-300 ease-ui active:bg-near-black ${motion} ${
              leaving ? "pointer-events-none" : "pointer-events-auto"
            }`}
          >
            Continue
          </Button>
          <button
            type="button"
            onClick={onNext}
            aria-label="Skip"
            className={`cursor-pointer p-2 text-[15px] leading-5 tracking-[-0.3px] text-light-text underline underline-offset-4 ${motion} ${
              leaving ? "pointer-events-none" : "pointer-events-auto"
            }`}
          >
            Skip
          </button>
        </>
      ) : (
        <Button
          type="button"
          variant="dark"
          onClick={onNext}
          aria-label={isIntro ? "Lets go" : "Continue"}
          sizeClassName="h-14 px-8"
          className={`flex-1 justify-center text-sm font-bold tracking-[.11em] uppercase transition-[opacity,translate,background-color] duration-300 ease-ui active:bg-near-black ${motion} ${
            holdContinue
              ? "pointer-events-none translate-y-1.5 opacity-0"
              : leaving
                ? "pointer-events-none"
                : "pointer-events-auto"
          }`}
        >
          {/* TODO(lift): replace with translation key */}
          {isIntro ? "Lets go" : "Continue"}
        </Button>
      )}
    </div>
  );
}
