import { stepMotion } from "@/lib/step-motion";
import type { StepMotion } from "./types";

type Props = {
  motion: StepMotion;
};

/** A pause between two sections of the quiz: one line, and the Continue in the footer. */
export function QuizBreak({ motion }: Props) {
  const headline = stepMotion(motion, 120);
  return (
    <h1
      className={`m-0 mx-auto max-w-[16ch] text-center font-book text-[33px] leading-[38px] tracking-[-0.66px] text-near-black ${headline.className}`}
      style={headline.style}
    >
      {/* TODO(lift): replace with translation key */}
      Great! Now let’s talk about your food preferences
    </h1>
  );
}
