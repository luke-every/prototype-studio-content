import { stepMotion } from "@/lib/step-motion";
import { QuizSections } from "./QuizSections";
import type { StepMotion } from "./types";

type Props = {
  motion: StepMotion;
};

/** The pause between the two parts: the intro's list again, one part further on, and the Continue in the footer. */
export function QuizBreak({ motion }: Props) {
  const headline = stepMotion(motion, 120);
  const sub = stepMotion(motion, 165);
  return (
    <div className="flex flex-col">
      {/* TODO(lift): replace with translation key */}
      <h1
        className={`m-0 font-book text-[33px] leading-[38px] tracking-[-0.66px] text-near-black ${headline.className}`}
        style={headline.style}
      >
        Great! Now, your food
      </h1>
      {/* TODO(lift): replace with translation key */}
      <p className={`mt-3 mb-0 text-[15px] leading-5 tracking-[-0.3px] text-light-text ${sub.className}`} style={sub.style}>
        A few questions on what you like to eat.
      </p>
      <div className="mt-6">
        <QuizSections current={2} motion={motion} kind="step" delayMs={210} />
      </div>
    </div>
  );
}
