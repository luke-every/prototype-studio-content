import Image from "next/image";
import { stepMotion } from "@/lib/step-motion";
import { QuizSections } from "./QuizSections";
import type { StepMotion } from "./types";

type Props = {
  motion: StepMotion;
};

/** The pause between the two parts: a photograph and the intro's list again, one part further on, and the Continue in the footer. */
export function QuizBreak({ motion }: Props) {
  const image = stepMotion(motion, 0);
  const headline = stepMotion(motion, 120);
  return (
    <div className="flex flex-1 flex-col justify-end gap-4">
      <Image
        src="img/introTastes.jpg"
        alt=""
        width={271}
        height={214}
        loading="eager"
        decoding="sync"
        className={`h-[214px] w-[271px] rounded-[18px] object-cover ${image.className}`}
        style={image.style}
      />
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
