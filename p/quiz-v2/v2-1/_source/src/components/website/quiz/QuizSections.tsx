import { stepMotion } from "@/lib/step-motion";
import { SECTIONS } from "./sample-data";
import type { StepMotion } from "./types";

type Props = {
  /** The part about to start: 1 on the intro, 2 at the break */
  current: 1 | 2;
  motion: StepMotion;
  kind: "step" | "intro";
  delayMs: number;
};

/** The quiz as a numbered list, so it's clear what's done, what's next and what it ends with */
export function QuizSections({ current, motion, kind, delayMs }: Props) {
  return (
    <ol className="m-0 flex list-none flex-col gap-2 p-0">
      {SECTIONS.map((section, i) => {
        const number = i + 1;
        const done = number < current;
        const row = stepMotion(motion, delayMs + i * 45, kind);
        const marker = done
          ? "bg-signal-orange text-white"
          : number === current
            ? "bg-near-black text-white"
            : "border border-light-grey-3 bg-white text-light-text";
        return (
          <li
            key={section.title}
            className={`relative flex items-center gap-4 rounded-2xl p-3 ${done ? "bg-white/50" : "bg-white"} ${row.className}`}
            style={row.style}
          >
            {/* the timeline: a line down the numbers, through the gap between the cards */}
            <span
              aria-hidden
              className={`absolute left-[22px] w-px bg-light-grey-3 ${i === 0 ? "top-1/2" : "top-0"} ${
                i === SECTIONS.length - 1 ? "bottom-1/2" : "-bottom-2"
              }`}
            />
            <span
              aria-hidden
              className={`relative flex size-[22px] shrink-0 items-center justify-center rounded-full text-xs leading-none font-medium ${marker}`}
            >
              {done ? "✓" : number}
            </span>
            <div className="flex flex-col gap-0.5 text-sm tracking-[-0.28px]">
              <p
                className={`m-0 leading-[15px] font-medium ${done ? "text-light-text" : "text-near-black"}`}
              >
                {section.title}
                {/* TODO(lift): replace with translation key */}
                {done && <span className="sr-only"> (done)</span>}
              </p>
              <p className={`m-0 leading-[19px] ${done || number > current ? "text-light-text" : "text-near-black opacity-60"}`}>{section.sub}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
