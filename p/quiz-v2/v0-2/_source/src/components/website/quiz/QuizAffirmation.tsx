import Image from "next/image";
import { stepMotion } from "@/lib/step-motion";
import type { Affirmation, StepMotion } from "./types";

type Props = {
  affirmation: Affirmation;
  motion: StepMotion;
};

/** A pause between two questions that gives something back: a photograph, a claim and a line under it. */
export function QuizAffirmation({ affirmation, motion }: Props) {
  const image = stepMotion(motion, 120);
  const headline = stepMotion(motion, 210);
  const sub = stepMotion(motion, 255);
  const note = stepMotion(motion, 300);
  return (
    <div className="flex flex-col items-center text-center">
      <div className={`relative mb-7 aspect-square w-[270px] ${image.className}`} style={image.style}>
        <Image src={affirmation.image} alt="" fill sizes="270px" loading="eager" decoding="sync" className="object-cover" />
      </div>
      <h1
        className={`m-0 max-w-[19ch] font-book text-[27px] leading-8 tracking-[-0.54px] text-near-black ${headline.className}`}
        style={headline.style}
      >
        {affirmation.headline}
      </h1>
      {affirmation.sub && (
        <p
          className={`mt-3 max-w-[30ch] text-[15px] leading-5 tracking-[-0.3px] text-light-text ${sub.className}`}
          style={sub.style}
        >
          {affirmation.sub}
        </p>
      )}
      {affirmation.note && (
        <p
          className={`mt-3.5 max-w-[34ch] text-xs leading-4 tracking-[-0.24px] text-dark/50 ${note.className}`}
          style={note.style}
        >
          {affirmation.note}
        </p>
      )}
    </div>
  );
}
