"use client";

import { ArrowRightLongIcon, CloseIcon } from "@/components/icons";

type Props = {
  /** How far through the quiz, 0 to 100 */
  progress: number;
  /** Held to the 544px column on a wide screen, as the questions are */
  narrow: boolean;
  onBack: () => void;
  onClose: () => void;
};

/**
 * Back on the left, the progress track in the middle, close on the right. One bar, not seven: the
 * fill is a shape that travels along a single track, so the movement itself carries the progress.
 */
export function QuizStepper({ progress, narrow, onBack, onClose }: Props) {
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
        className="flex size-10 shrink-0 cursor-pointer items-center justify-center text-dark"
      >
        <ArrowRightLongIcon size={14} className="rotate-180" />
      </button>
      <div className="h-[9px] flex-1 overflow-hidden rounded-full bg-light-grey-2/50">
        <i
          className="block h-full rounded-full bg-dark transition-[width] duration-[750ms] ease-enter"
          style={{ width: `${progress}%` }}
        />
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
