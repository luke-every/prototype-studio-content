"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/shared/Button";
import {
  HANDOVER_CLEAR_MS,
  HANDOVER_DONE_MS,
  HANDOVER_REVEAL_MS,
  LOAD_BUILD_MS,
  LOAD_LINES,
  LOAD_MS,
  LOAD_PHASE_IN_MS,
  LOAD_STARTS,
  LOAD_TICK_AFTER_MS,
  LOAD_WAITS_FOR_TAP,
} from "./sample-data";

type Props = {
  /** Hidden behind the opaque overlay, the results page takes the question's place */
  onBuildResults: () => void;
  /** The overlay has taken the results' colour: the sheet swaps to its results chrome */
  onHandover: () => void;
  /** The overlay has cleared: the results hero starts to arrive */
  onReveal: () => void;
  /** The overlay is no longer needed */
  onDone: () => void;
};

/**
 * A full-bleed overlay that carries the colour story itself: it washes in over the question just
 * answered, and at the end crossfades to the results page's colour so the results are already the
 * right colour when it clears. The sheet's --bundle variable is the colour it fades to.
 */
export function QuizLoader({ onBuildResults, onHandover, onReveal, onDone }: Props) {
  const [shown, setShown] = useState<boolean>(false);
  const [phaseIn, setPhaseIn] = useState<boolean>(false);
  const [linesIn, setLinesIn] = useState<number>(0);
  const [linesDone, setLinesDone] = useState<number>(0);
  const [ready, setReady] = useState<boolean>(false);
  const [handed, setHanded] = useState<boolean>(false);
  const [cleared, setCleared] = useState<boolean>(false);

  const timers = useRef<number[]>([]);
  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);

  const callbacks = useRef({ onBuildResults, onHandover, onReveal, onDone });
  useEffect(() => {
    callbacks.current = { onBuildResults, onHandover, onReveal, onDone };
  });

  /* the last beat: the overlay takes the results page's colour and clears, and the hero arrives behind it */
  const handover = useCallback(() => {
    setReady(false);
    setHanded(true);
    callbacks.current.onHandover();
    later(() => setCleared(true), HANDOVER_CLEAR_MS);
    /* the overlay fades while the hero rises underneath, so the two crossfade */
    later(() => callbacks.current.onReveal(), HANDOVER_REVEAL_MS);
    later(() => callbacks.current.onDone(), HANDOVER_DONE_MS);
  }, [later]);

  useEffect(() => {
    const timerIds = timers.current;
    /* 0.0s — the overlay washes over the answer that was just tapped, then the picture and title arrive */
    const frame = requestAnimationFrame(() => setShown(true));
    later(() => setPhaseIn(true), LOAD_PHASE_IN_MS);
    later(() => callbacks.current.onBuildResults(), LOAD_BUILD_MS);
    /* the lines are paced to fill the 4s, the last tick landing just inside it */
    LOAD_STARTS.forEach((start, i) => {
      later(() => setLinesIn(i + 1), start);
      later(() => setLinesDone(i + 1), start + LOAD_TICK_AFTER_MS);
    });
    later(LOAD_WAITS_FOR_TAP ? () => setReady(true) : handover, LOAD_MS);
    return () => {
      cancelAnimationFrame(frame);
      timerIds.forEach(window.clearTimeout);
    };
  }, [later, handover]);

  return (
    <div
      className={`absolute inset-0 z-30 flex flex-col items-center justify-center text-near-black [transition:opacity_700ms_var(--ease-ui),background-color_900ms_var(--ease-ui),color_900ms_var(--ease-ui)] ${
        shown && !cleared ? "opacity-100" : "opacity-0"
      } ${handed ? "bg-(--bundle)" : "bg-light-grey"}`}
    >
      {/* picture, title and checklist move as one group */}
      <div
        className={`flex flex-col items-center ${
          phaseIn
            ? "translate-x-0 opacity-100 blur-none [transition:opacity_670ms_var(--ease-enter),translate_670ms_var(--ease-enter),filter_670ms_var(--ease-enter)]"
            : "translate-x-18 opacity-0 blur-(--enter-blur) [transition:opacity_670ms_var(--ease-enter),translate_670ms_var(--ease-enter),filter_670ms_var(--ease-enter)]"
        }`}
      >
        {/* Two drawings on the same bounds, stacked so they read as one: the base holds still and the heart drifts */}
        <div className="relative mb-8 aspect-142/160 w-[min(46%,142px)]">
          <Image src="img/EveBase.svg" alt="" fill sizes="142px" />
          <Image src="img/EveHeart.svg" alt="" fill sizes="142px" className="animate-heart-float" />
        </div>
        {/* TODO(lift): replace with translation key */}
        <h1 className="mb-[26px] max-w-[14ch] text-center font-book text-[30px] leading-[35px] tracking-[-0.6px]">
          Looking at your answers
        </h1>
        <div className="flex flex-col items-start gap-[13px]">
          {LOAD_LINES.map((line, i) => (
            <div
              key={line}
              className={`flex items-center gap-[11px] text-[15px] leading-5 tracking-[-0.3px] text-near-black/66 [transition:opacity_670ms_var(--ease-enter),translate_670ms_var(--ease-enter),filter_670ms_var(--ease-enter)] ${
                i < linesIn ? "translate-x-0 opacity-100 blur-none" : "translate-x-8 opacity-0 blur-(--enter-blur)"
              }`}
            >
              <span className="relative size-[19px] shrink-0" aria-hidden>
                <span
                  className={`absolute inset-0 animate-load-spin rounded-full border-2 border-near-black/18 border-t-signal-orange transition-opacity duration-300 ${
                    i < linesDone ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`absolute inset-0 flex items-center justify-center rounded-full bg-signal-orange text-[10px] text-white [transition:opacity_350ms_var(--ease-spring),scale_350ms_var(--ease-spring)] ${
                    i < linesDone ? "scale-100 opacity-100" : "scale-[.4] opacity-0"
                  }`}
                >
                  ✓
                </span>
              </span>
              {/* TODO(lift): replace with translation key */}
              <span>{line}</span>
            </div>
          ))}
        </div>
      </div>
      {/* the button that hands over to the results, in the quiz's own footer spot */}
      <div
        className={`absolute inset-x-0 bottom-0 flex px-6 pb-6 transition-opacity duration-300 ease-ui ${
          ready ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <Button
          type="button"
          variant="dark"
          onClick={handover}
          aria-label="Continue to my result"
          sizeClassName="h-14 px-8"
          className="flex-1 justify-center text-sm font-bold tracking-[.11em] uppercase active:bg-near-black"
        >
          {/* TODO(lift): replace with translation key */}
          Continue to my result
        </Button>
      </div>
    </div>
  );
}
