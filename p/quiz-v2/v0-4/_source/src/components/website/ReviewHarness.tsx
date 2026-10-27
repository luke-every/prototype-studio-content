"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { saveAnswers } from "@/lib/quiz-link";
import { REVIEW_MESSAGE } from "./Prototype";
import { QUESTIONS, SAMPLE_ANSWERS, SATISFACTION } from "./quiz/sample-data";
import type {
  Answers,
  Question,
  QuestionId,
  ResultsVariant,
} from "./quiz/types";

// TODO(lift): prototype review harness only — not part of the product

const START: Answers = { ...SAMPLE_ANSWERS, goal: ["gut"] };
/* D is set aside for now; its page still exists behind ?variant=d */
const VARIANTS: ResultsVariant[] = ["A", "B", "C", "H"];

/** Follow-up questions only count once the answer that opens them is picked */
const SHOWN_WHEN: Partial<Record<QuestionId, (answers: Answers) => boolean>> = {
  whyWeight: (answers) => answers.goal[0] === "portions",
  whyFitness: (answers) => answers.goal[0] === "protein",
  allergyWhich: (answers) => answers.allergy[0] === "yes",
};

const CHIP =
  "cursor-pointer rounded-full border px-3 py-1.5 text-left text-xs leading-4 tracking-[-0.24px] transition-colors duration-150";

/**
 * The prototype in a phone-sized frame, with every quiz answer on the side. The frame opens on the
 * results with the answers saved where the prototype keeps the last finished quiz; after that each
 * change is posted into it, so the results update in place. A frame rather than a box on the page,
 * so the prototype gets a real phone-sized viewport.
 */
export function ReviewHarness() {
  const [answers, setAnswers] = useState<Answers>(START);
  const [variant, setVariant] = useState<ResultsVariant>("A");
  const frameRef = useRef<HTMLIFrameElement>(null);
  /*
   * The frame loads once, on the answers saved below; after that, changes are posted into it. Its address is
   * this page's own folder, so it still finds the prototype when it is hosted under a sub-path (the studio);
   * it can only be known in the browser, so the frame waits for it.
   */
  const base = useSyncExternalStore(
    () => () => {},
    () => window.location.pathname.replace(/\/(results|review)\/?$/, "/"),
    () => null,
  );

  useEffect(() => {
    saveAnswers(answers);
    frameRef.current?.contentWindow?.postMessage(
      { type: REVIEW_MESSAGE, answers, variant },
      window.location.origin,
    );
  }, [answers, variant]);

  const pick = (question: Question, value: string) => {
    const current = answers[question.id];
    const next =
      question.type === "multi"
        ? current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value]
        : [value];
    setAnswers({ ...answers, [question.id]: next });
  };

  return (
    <div className="flex min-h-dvh flex-col bg-light-grey lg:h-dvh lg:flex-row">
      <aside className="scrollbar-hide border-b border-light-grey-2 bg-white p-6 lg:w-[360px] lg:shrink-0 lg:overflow-y-auto lg:border-r lg:border-b-0">
        <div className="flex items-center justify-between gap-4">
          <h1 className="m-0 font-book text-2xl leading-6.5 tracking-[-0.48px] text-dark">
            Quiz answers
          </h1>
          <button
            type="button"
            onClick={() => setAnswers(START)}
            className="cursor-pointer p-0 text-xs leading-4 font-medium tracking-[-0.24px] text-dark underline underline-offset-4"
          >
            Reset
          </button>
        </div>

        <fieldset className="m-0 mt-6 border-0 p-0">
          <legend className="mb-2 p-0 text-sm leading-[18px] font-medium tracking-[-0.28px] text-near-black">
            Results page
          </legend>
          <div className="flex gap-2">
            {VARIANTS.map((v) => (
              <button
                key={v}
                type="button"
                aria-pressed={variant === v}
                onClick={() => setVariant(v)}
                className={`${CHIP} min-w-10 text-center ${variant === v ? "border-dark bg-dark text-white" : "border-light-grey-3 text-dark"}`}
              >
                {v}
              </button>
            ))}
          </div>
        </fieldset>

        {QUESTIONS.filter(
          (question) => SHOWN_WHEN[question.id]?.(answers) ?? true,
        ).map((question) => (
          <fieldset key={question.id} className="m-0 mt-6 border-0 p-0">
            <legend className="mb-2 p-0 text-sm leading-[18px] font-medium tracking-[-0.28px] text-near-black">
              {question.question}
            </legend>
            {question.type === "slider" ? (
              <label className="flex items-center gap-3">
                <input
                  type="range"
                  min={1}
                  max={SATISFACTION.length}
                  value={Number(answers.sat[0] ?? 3)}
                  onChange={(e) =>
                    setAnswers({ ...answers, sat: [e.target.value] })
                  }
                  className="flex-1 accent-dark"
                />
                <span className="w-32 text-xs leading-4 tracking-[-0.24px] text-light-text">
                  {SATISFACTION[Number(answers.sat[0] ?? 3) - 1]?.label}
                </span>
              </label>
            ) : (
              <div className="flex flex-wrap gap-2">
                {question.options.map((option) => {
                  const on = answers[question.id].includes(option.value);
                  return (
                    <button
                      key={option.value}
                      type="button"
                      aria-pressed={on}
                      onClick={() => pick(question, option.value)}
                      className={`${CHIP} ${on ? "border-dark bg-dark text-white" : "border-light-grey-3 text-dark"}`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            )}
          </fieldset>
        ))}
      </aside>

      <main className="flex flex-1 items-center justify-center p-6">
        {base !== null && (
          <iframe
            ref={frameRef}
            src={`${base}?start=results&variant=a`}
            title="Prototype"
            className="block aspect-390/844 h-[min(844px,calc(100dvh-48px))] rounded-[40px] border-0 bg-white shadow-[0_24px_64px_-16px] shadow-near-black/25"
          />
        )}
      </main>
    </div>
  );
}
