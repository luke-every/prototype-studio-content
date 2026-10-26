"use client";

import { useState } from "react";
import { CloseIcon } from "@/components/icons";
import { Drawer } from "@/components/shared/Drawer";
import type { Routine } from "./routine";
import type { BoxLine } from "./useBox";

type Props = {
  routine: Routine;
  lines: BoxLine[];
  /** The full story is up, so Esc is its to take */
  onSheetChange: (open: boolean) => void;
};

/**
 * What we did for their goal, as three highlights: what we did and one line on why it matters. The
 * full story opens in a sheet: the reasoning in full, and a number from their own box for each.
 */
export function RoutineStory({ routine, lines, onSheetChange }: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const show = (next: boolean) => {
    setOpen(next);
    onSheetChange(next);
  };

  return (
    <section className="mx-6 pt-12">
      <h2 className="m-0 font-book text-[28px] leading-[30px] tracking-[-0.56px] text-dark">{routine.title}</h2>
      <ul className="m-0 mt-6 flex list-none flex-col gap-6 p-0">
        {routine.principles.map((principle) => (
          <li key={principle.did} className="flex items-center gap-4">
            <span
              aria-hidden
              className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-light-brown text-[22px] leading-none"
            >
              {principle.icon}
            </span>
            <div className="min-w-0">
              <p className="m-0 text-base leading-[22px] font-medium tracking-[-0.32px] text-near-black">{principle.did}</p>
              <p className="mt-1 mb-0 text-sm leading-[18px] tracking-[-0.28px] text-light-text">{principle.short}</p>
            </div>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => show(true)}
        className="mt-6 cursor-pointer p-0 text-sm leading-[18px] font-medium tracking-[-0.28px] text-dark underline underline-offset-4"
      >
        {/* TODO(lift): replace with translation key */}
        Read the full story
      </button>

      <Drawer open={open} title={routine.storyTitle} onClose={() => show(false)} centeredOnWide>
        <button
          type="button"
          onClick={() => show(false)}
          aria-label="Close"
          className="absolute top-6 right-6 z-[3] flex size-8 cursor-pointer items-center justify-center rounded-2xl bg-off-white text-near-black transition-[scale] duration-[240ms] ease-spring active:scale-90 active:duration-[90ms] active:ease-out"
        >
          <CloseIcon size={12} />
        </button>
        <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pt-8 pb-8">
          <h2 className="m-0 pr-12 font-book text-2xl leading-6.5 tracking-[-0.48px] text-dark">{routine.storyTitle}</h2>
          <p className="mt-3 mb-0 text-base leading-[22px] tracking-[-0.32px] text-dark">{routine.storyIntro}</p>
          {routine.principles.map((principle) => (
            <div key={principle.did} className="mt-8">
              <h3 className="m-0 text-base leading-[22px] font-medium tracking-[-0.32px] text-near-black">{principle.did}</h3>
              <p className="mt-2 mb-0 text-sm leading-5 tracking-[-0.28px] text-dark">{principle.long}</p>
              <p className="mt-3 mb-0 inline-flex rounded-full bg-light-brown px-3 py-1.5 text-xs leading-4 tracking-[-0.24px] text-dark">
                {principle.proof(lines)}
              </p>
            </div>
          ))}
          {/* TODO(lift): unconfirmed — needs a named reviewer and sources before this ships */}
          <p className="mt-10 mb-0 text-xs leading-4 tracking-[-0.24px] text-light-text">Written with our nutrition team.</p>
        </div>
      </Drawer>
    </section>
  );
}
