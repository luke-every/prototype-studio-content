"use client";

import { useRef, useState } from "react";
import { stepMotion } from "@/lib/step-motion";
import { QuizHeading } from "./QuizHeading";
import { SATISFACTION, SATISFACTION_BLANK, SLIDER_KNOB_PX, SLIDER_POINTS } from "./sample-data";
import type { Question, StepMotion } from "./types";

type Props = {
  question: Question;
  /** The point picked before, 1 to 5, or null before the knob has been touched */
  value: number | null;
  motion: StepMotion;
  onChange: (value: number) => void;
};

/** The five faces, then the neutral one held for before the knob is touched */
const FACES: string[] = [...SATISFACTION.map((point) => point.face), SATISFACTION_BLANK];

const HALF_KNOB = SLIDER_KNOB_PX / 2;
const LAST_POINT = SLIDER_POINTS - 1;

/** Where a point sits along the rail, as a CSS length */
const pointLeft = (n: number): string => `calc((100% - ${SLIDER_KNOB_PX}px) * ${(n - 1) / LAST_POINT})`;

/**
 * Five points on a slider of its own: the knob is dragged freely and snaps to the nearest point
 * when it is let go, so it feels continuous but always lands on an answer. It does not advance on
 * its own; Continue appears once the knob is let go.
 */
export function SatisfactionSlider({ question, value, motion, onChange }: Props) {
  const [val, setVal] = useState<number>(value ?? 3);
  const [started, setStarted] = useState<boolean>(value !== null);
  /** The knob's x while it is held, in px; null when it rests on a point */
  const [dragX, setDragX] = useState<number | null>(null);
  /** The face that has just been swapped in, which pops */
  const [popped, setPopped] = useState<number | null>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);

  const wrap = stepMotion(motion, 210);
  const faceIndex = started ? val - 1 : FACES.length - 1;
  const dragging = dragX !== null;

  /* while it is moving, the label and the face follow the nearest point */
  const preview = (n: number) => {
    /* the first touch always counts, even on the middle point the knob starts on */
    if (n === val && started) return;
    setStarted(true);
    setVal(n);
    setPopped(n - 1);
  };

  const move = (clientX: number) => {
    const rail = railRef.current;
    if (!rail) return;
    const rect = rail.getBoundingClientRect();
    const span = rect.width - SLIDER_KNOB_PX;
    const x = Math.max(0, Math.min(span, clientX - rect.left - HALF_KNOB));
    setDragX(x);
    preview(Math.round((x / span) * LAST_POINT) + 1);
  };

  const release = () => {
    if (!dragging) return;
    setDragX(null);
    onChange(val);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const step = e.key === "ArrowRight" || e.key === "ArrowUp" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowDown" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const n = Math.max(1, Math.min(SLIDER_POINTS, val + step));
    if (n === val) return;
    preview(n);
    onChange(n);
  };

  return (
    <>
      <QuizHeading title={question.question} sub={question.sub} motion={motion} />
      <div className={`flex min-h-0 flex-1 flex-col ${wrap.className}`} style={wrap.style}>
        {/* the face sits in the middle of whatever space is going */}
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <div className="relative size-[150px]" aria-hidden>
            {FACES.map((face, i) => (
              <span
                key={face}
                className={`absolute inset-0 flex size-full items-center justify-center text-[132px] leading-none ${
                  i === faceIndex ? "scale-100 opacity-100 blur-none" : "scale-[.86] opacity-0 blur-[11px]"
                } ${i === popped && i === faceIndex ? "animate-art-pop" : ""}`}
              >
                {face}
              </span>
            ))}
          </div>
        </div>
        {/* the answer and the slider sit at the foot of the step */}
        <div className="shrink-0">
          <p className="mb-[18px] min-h-5 text-center text-[15px] leading-5 tracking-[-0.3px] text-near-black">
            {started ? SATISFACTION[val - 1].label : " "}
          </p>
          <div
            ref={railRef}
            className={`relative h-12 touch-none select-none ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              knobRef.current?.focus({ preventScroll: true });
              move(e.clientX);
            }}
            onPointerMove={(e) => {
              if (dragging) move(e.clientX);
            }}
            onPointerUp={release}
            onPointerCancel={release}
          >
            <div className="absolute inset-0 overflow-hidden rounded-3xl bg-light-grey-2" />
            <div className="pointer-events-none absolute inset-0 z-[1]">
              {Array.from({ length: SLIDER_POINTS }, (_, i) => (
                <i
                  key={i}
                  className="absolute top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-dark/26"
                  style={{ left: `calc(${HALF_KNOB}px + (100% - ${SLIDER_KNOB_PX}px) * ${i / LAST_POINT})` }}
                />
              ))}
            </div>
            {/* the fill runs from the far left to the middle of the knob */}
            <div
              className={`absolute inset-y-0 left-0 z-[2] min-w-12 rounded-full bg-linear-to-r from-signal-orange/60 to-signal-orange ${
                dragging ? "" : "transition-[width] duration-[520ms] ease-spring"
              }`}
              style={{ width: dragging ? `${dragX + HALF_KNOB}px` : `calc(${pointLeft(val)} + ${HALF_KNOB}px)` }}
            />
            <div
              ref={knobRef}
              role="slider"
              tabIndex={0}
              aria-label={question.question}
              aria-valuemin={1}
              aria-valuemax={SLIDER_POINTS}
              aria-valuenow={val}
              aria-valuetext={SATISFACTION[val - 1].label}
              onKeyDown={onKeyDown}
              className={`group/knob absolute top-0 z-[3] size-12 outline-none ${
                dragging ? "" : "transition-[left] duration-[520ms] ease-spring"
              }`}
              style={{ left: dragging ? `${dragX}px` : pointLeft(val) }}
            >
              <span
                className={`block size-full rounded-full bg-white shadow-[0_2px_10px] shadow-near-black/22 transition-[scale] duration-[340ms] ease-spring group-focus-visible/knob:ring-3 group-focus-visible/knob:ring-signal-orange/45 ${
                  dragging ? "scale-[1.16]" : ""
                }`}
              />
            </div>
          </div>
          {/* TODO(lift): replace with translation key */}
          <div className="mt-2.5 flex justify-between text-[13.5px] leading-[18px] tracking-[-0.27px] text-light-text">
            <span>Not satisfied</span>
            <span>Very satisfied</span>
          </div>
        </div>
      </div>
    </>
  );
}
