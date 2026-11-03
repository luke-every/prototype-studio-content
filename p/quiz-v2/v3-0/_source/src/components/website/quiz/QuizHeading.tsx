import { stepMotion } from "@/lib/step-motion";
import type { StepMotion } from "./types";

type Props = {
  title: string;
  sub: string;
  motion: StepMotion;
};

/** A question's headline and the line under it */
export function QuizHeading({ title, sub, motion }: Props) {
  const heading = stepMotion(motion, 120);
  const subline = stepMotion(motion, 165);
  return (
    <>
      <h1
        className={`m-0 pr-[15%] font-book text-[31px] leading-9 tracking-[-0.62px] text-near-black ${heading.className}`}
        style={heading.style}
      >
        {title}
      </h1>
      <p
        className={`mt-2.5 mb-0 text-[15px] leading-5 tracking-[-0.3px] text-light-text ${subline.className}`}
        style={subline.style}
      >
        {sub}
      </p>
    </>
  );
}
