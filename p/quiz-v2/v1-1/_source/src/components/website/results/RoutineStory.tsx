"use client";

import { CloseIcon } from "@/components/icons";
import { Drawer } from "@/components/shared/Drawer";
import type { Routine } from "./routine";
import { stripCites } from "./sources";
import type { BoxLine } from "./useBox";

type SheetProps = {
  routine: Routine;
  lines: BoxLine[];
  open: boolean;
  /** The opening paragraph; off where the page has already shown it */
  intro?: boolean;
  onClose: () => void;
};

/**
 * The full story, told as chapters: one per rule we picked their meals by, each with the rule as its
 * heading, why it matters, and the evidence from their own meals set large at its foot.
 */
// TODO(lift): unconfirmed — needs a named reviewer and cited sources before this ships
export function RoutineSheet({
  routine,
  lines,
  open,
  intro = true,
  onClose,
}: SheetProps) {
  return (
    <Drawer
      open={open}
      title={routine.recommendation}
      onClose={onClose}
      centeredOnWide
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-6 right-6 z-[3] flex size-8 cursor-pointer items-center justify-center rounded-2xl bg-off-white text-near-black transition-[scale] duration-[240ms] ease-spring active:scale-90 active:duration-[90ms] active:ease-out"
      >
        <CloseIcon size={12} />
      </button>
      <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pt-8 pb-10">
        <header className="pr-12">
          <p className="m-0 text-xs leading-4 font-medium tracking-[-0.24px] text-light-text">
            {routine.storyTitle}
          </p>
          <h2 className="mt-2 mb-0 font-book text-[28px] leading-[30px] tracking-[-0.56px] text-dark">
            {routine.recommendation}
          </h2>
        </header>
        {intro && (
          <p className="mt-4 mb-0 text-base leading-[22px] tracking-[-0.32px] text-dark">
            {routine.storyIntro}
          </p>
        )}

        {routine.principles.map((principle) => {
          const stat = principle.stat(lines);
          return (
            <article
              key={principle.did}
              className="mt-8 border-t border-light-grey pt-8"
            >
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-light-brown text-xl leading-none"
                >
                  {principle.icon}
                </span>
                <h3 className="m-0 font-book text-lg leading-[22px] tracking-[-0.36px] text-dark">
                  {principle.did}
                </h3>
              </div>
              <p className="mt-4 mb-0 text-base leading-[22px] tracking-[-0.32px] text-dark">
                {stripCites(principle.long)}
              </p>
              <div className="mt-5 rounded-2xl bg-light-brown px-4 py-3">
                {/* TODO(lift): replace with translation key */}
                <p className="m-0 text-xs leading-4 font-medium tracking-[-0.24px] text-light-text">
                  In your routine
                </p>
                <p className="mt-1 mb-0 flex items-baseline gap-2">
                  <span className="font-book text-[28px] leading-8 tracking-[-0.56px] text-dark">
                    {stat.value}
                  </span>
                  <span className="text-sm leading-[18px] tracking-[-0.28px] text-dark">
                    {stat.label}
                  </span>
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </Drawer>
  );
}
