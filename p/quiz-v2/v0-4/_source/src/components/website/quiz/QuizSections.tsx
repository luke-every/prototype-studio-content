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
    <ol className="m-0 list-none p-0">
      {SECTIONS.map((section, i) => {
        const number = i + 1;
        const done = number < current;
        const row = stepMotion(motion, delayMs + i * 45, kind);
        const marker = done
          ? "bg-signal-orange text-white"
          : number === current
            ? "bg-dark text-white"
            : "border border-light-grey-3 text-light-text";
        return (
          <li
            key={section.title}
            className={`flex items-start gap-4 border-b border-light-grey-2 py-4 last:border-b-0 ${row.className}`}
            style={row.style}
          >
            <span
              aria-hidden
              className={`flex size-8 shrink-0 items-center justify-center rounded-full font-book text-base leading-none ${marker}`}
            >
              {done ? "✓" : number}
            </span>
            <div className="pt-1">
              <p
                className={`m-0 text-base leading-[22px] font-medium tracking-[-0.32px] ${done ? "text-light-text" : "text-near-black"}`}
              >
                {section.title}
                {/* TODO(lift): replace with translation key */}
                {done && <span className="sr-only"> (done)</span>}
              </p>
              <p className="m-0 text-sm leading-[18px] tracking-[-0.28px] text-light-text">{section.sub}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
