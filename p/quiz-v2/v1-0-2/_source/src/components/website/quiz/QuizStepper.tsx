"use client";

import { ArrowRightLongIcon, CloseIcon } from "@/components/icons";

type Props = {
  /** How far through each part of the quiz, 0 to 1: about you, then your food */
  sections: [number, number];
  /** Held to the 544px column on a wide screen, as the questions are */
  narrow: boolean;
  /** The intro shows only the close button */
  intro?: boolean;
  onBack: () => void;
  onClose: () => void;
};

/**
 * Back on the left, the progress track in the middle, close on the right. One track per part of the
 * quiz, matching the intro's list: the first fills through "about you", the second through "your food".
 */
export function QuizStepper({ sections, narrow, intro = false, onBack, onClose }: Props) {
  const overall = Math.round(((sections[0] + sections[1]) / 2) * 100);
  return (
    <div
      className={`relative z-[3] flex shrink-0 items-center gap-6 px-4 pt-6 ${
        narrow ? "lg:mx-auto lg:w-full lg:max-w-[544px]" : ""
      }`}
    >
      <button
        type="button"
        onClick={onBack}
        aria-label="Back"
        className={`flex size-10 shrink-0 cursor-pointer items-center justify-center text-dark ${intro ? "invisible" : ""}`}
      >
        <ArrowRightLongIcon size={14} className="rotate-180" />
      </button>
      {/* TODO(lift): replace with translation key */}
      <div
        role="progressbar"
        aria-label="Quiz progress"
        aria-valuenow={overall}
        aria-valuemin={0}
        aria-valuemax={100}
        className={`flex h-[9px] flex-1 gap-1.5 ${intro ? "invisible" : ""}`}
      >
        {sections.map((fill, i) => (
          <div key={i} className="h-full flex-1 overflow-hidden rounded-full bg-light-grey-2/50">
            <i
              className="block h-full rounded-full bg-dark transition-[width] duration-[750ms] ease-enter"
              style={{ width: `${fill * 100}%` }}
            />
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="flex size-10 shrink-0 cursor-pointer items-center justify-center text-near-black"
      >
        <CloseIcon size={22} />
      </button>
    </div>
  );
}
