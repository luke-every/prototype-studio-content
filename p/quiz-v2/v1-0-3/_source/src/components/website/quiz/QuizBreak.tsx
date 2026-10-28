import { stepMotion } from "@/lib/step-motion";
import { QuizSections } from "./QuizSections";
import type { StepMotion } from "./types";

type Props = {
  motion: StepMotion;
};

/** The pause between the two parts: the intro's list again, one part further on, and the Continue in the footer. */
export function QuizBreak({ motion }: Props) {
  const headline = stepMotion(motion, 120);
  return (
    <div className="flex flex-1 flex-col justify-end gap-4">
      {/* TODO(lift): replace with translation key */}
      <h1
        className={`m-0 font-book text-[37px] leading-[43px] tracking-[-0.74px] text-near-black ${headline.className}`}
        style={headline.style}
      >
        Great! Now let’s talk
        <br />
        your tastes
      </h1>
      <QuizSections current={2} motion={motion} kind="step" delayMs={210} />
    </div>
  );
}
