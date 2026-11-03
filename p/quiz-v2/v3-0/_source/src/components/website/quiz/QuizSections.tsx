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

/** The quiz as a numbered list, so it's clear what's done, what's next and what it ends with: a tick for a part done, dark for the one starting, light for the rest */
export function QuizSections({ current, motion, kind, delayMs }: Props) {
  return (
    <ol className="m-0 flex list-none flex-col gap-2 p-0">
      {SECTIONS.map((section, i) => {
        const number = i + 1;
        const done = number < current;
        const row = stepMotion(motion, delayMs + i * 45, kind);
        const marker =
          number <= current ? "bg-dark text-white" : "bg-light-brown text-dark";
        return (
          <li
            key={section.title}
            className={`flex items-center gap-3 rounded-2xl bg-white p-3 ${row.className}`}
            style={row.style}
          >
            <span
              aria-hidden
              className={`flex size-10 shrink-0 items-center justify-center rounded-2xl font-book text-lg leading-8 tracking-[-0.36px] ${marker}`}
            >
              {done ? "✓" : number}
            </span>
            <div className="flex flex-col gap-0.5 text-sm tracking-[-0.28px] text-near-black">
              <p className="m-0 leading-[15px] font-medium">
                {section.title}
                {/* TODO(lift): replace with translation key */}
                {done && <span className="sr-only"> (done)</span>}
              </p>
              <p className="m-0 leading-[19px] opacity-60">{section.sub}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
