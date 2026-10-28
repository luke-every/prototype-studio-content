"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { saveAnswers } from "@/lib/quiz-link";
import { REVIEW_MESSAGE, type ReviewFlow } from "./Prototype";
import { HEADLINE_ANGLES, type HeadlineAngle } from "./results/framing";
import { QUESTIONS, SAMPLE_ANSWERS } from "./quiz/sample-data";
import type {
  Answers,
  Question,
  QuestionId,
  ResultsVariant,
} from "./quiz/types";

// TODO(lift): prototype review harness only — not part of the product

const START: Answers = { ...SAMPLE_ANSWERS, goal: ["gut"] };
/* E (the stepped consultation) is set aside for now; its page still exists behind ?variant=e */
const FLOW: { value: ReviewFlow; label: string }[] = [
  { value: "home", label: "Start" },
  { value: "loader", label: "Loader" },
  { value: "results", label: "Results" },
];
const VARIANTS: ResultsVariant[] = ["A", "B", "C", "D", "H"];

/* what each results page is, and the bet it makes; the rest have none yet */
const BRIEFS: Partial<
  Record<ResultsVariant, { overview: string; hypothesis: string; risk: string }>
> = {
  A: {
    overview:
      "The same content as B, told as a report: your profile (what you told us, in one sentence), our recommendation (the same three facts, built out), then your routine, the box. It answers why am I seeing this, what am I getting and how much it costs, in that order. Brand claims sit lower, near the price.",
    hypothesis:
      "If we play their answers back as a profile before we recommend, the page feels like a consultation that knows them instead of a product page. That should build more trust than B's single headline, with only the structure changed.",
    risk: "More scientific and less lifestyle than usual. The profile reads best straight after the quiz, and the middle section depends on the goal like B's.",
  },
  B: {
    overview:
      "It leads with personalisation: the hero relays back what they told us, using their goal and the challenge it gets them past, so it's clear this is made for them. Then an educational block takes their goal and mixes facts about it with how we chose their meals, so we tell a strong story that fits their lifestyle. It sells a routine, more than just meals.",
    hypothesis:
      "If the page first relays back what they told us, then pairs facts about their goal with how we chose their meals, people see a routine built for their lifestyle, not a list of meals. They trust the recommendation more and understand why these meals are theirs.",
    risk: "It leans on the goal, which people may pick lightly since we have no baseline for it. The facts need checking and must stay high-level, never our own best practice.",
  },
};

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
  const [angle, setAngle] = useState<HeadlineAngle>("identity");
  /** Where the frame is in the flow; `run` counts taps, so choosing the loader again replays it */
  const [flow, setFlow] = useState<{ value: ReviewFlow; run: number }>({ value: "results", run: 0 });
  const [panelOpen, setPanelOpen] = useState<boolean>(true);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const brief = BRIEFS[variant];
  const [openIds, setOpenIds] = useState<QuestionId[]>(["goal"]);
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
      { type: REVIEW_MESSAGE, answers, variant, angle, flow: flow.value, run: flow.run },
      window.location.origin,
    );
  }, [answers, variant, angle, flow]);

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
    <div className="relative flex min-h-dvh flex-col bg-light-grey lg:h-dvh lg:flex-row lg:overflow-hidden">
      {/* slides out to the left, and the frame's side of the page widens as it goes */}
      <aside
        inert={!panelOpen}
        className={`scrollbar-hide border-b border-light-grey-2 bg-white p-6 transition-[margin-left] duration-500 ease-ui lg:w-[360px] lg:shrink-0 lg:overflow-y-auto lg:border-r lg:border-b-0 ${
          panelOpen ? "lg:ml-0" : "max-lg:hidden lg:-ml-[360px]"
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          <h1 className="m-0 font-book text-2xl leading-6.5 tracking-[-0.48px] text-dark">
            Quiz answers
          </h1>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setAnswers(START)}
              className="cursor-pointer p-0 text-xs leading-4 font-medium tracking-[-0.24px] text-dark underline underline-offset-4"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => setPanelOpen(false)}
              aria-label="Hide controls"
              className="cursor-pointer p-0 text-xs leading-4 font-medium tracking-[-0.24px] text-dark underline underline-offset-4"
            >
              Hide
            </button>
          </div>
        </div>

        <fieldset className="m-0 mt-6 border-0 p-0">
          <legend className="mb-2 p-0 text-sm leading-[18px] font-medium tracking-[-0.28px] text-near-black">
            Flow
          </legend>
          <div className="flex gap-2">
            {FLOW.map((point) => (
              <button
                key={point.value}
                type="button"
                aria-pressed={flow.value === point.value}
                onClick={() => setFlow((current) => ({ value: point.value, run: current.run + 1 }))}
                className={`${CHIP} text-center ${flow.value === point.value ? "border-dark bg-dark text-white" : "border-light-grey-3 text-dark"}`}
              >
                {point.label}
              </button>
            ))}
          </div>
        </fieldset>

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
                onClick={() => {
                  setVariant(v);
                  /* a results page is only on show at the results, so from the start or the loader this goes there */
                  setFlow((current) =>
                    current.value === "results" ? current : { value: "results", run: current.run + 1 },
                  );
                }}
                className={`${CHIP} min-w-10 text-center ${variant === v ? "border-dark bg-dark text-white" : "border-light-grey-3 text-dark"}`}
              >
                {v}
              </button>
            ))}
          </div>
          {brief && (
            <div className="mt-4 flex flex-col gap-3 rounded-2xl bg-light-brown p-4 text-xs leading-4 tracking-[-0.24px] text-near-black">
              {(
                [
                  ["Overview", brief.overview],
                  ["Hypothesis", brief.hypothesis],
                  ["Notes", brief.risk],
                ] as const
              ).map(([label, text]) => (
                <div key={label}>
                  <p className="m-0 font-medium text-light-text">{label}</p>
                  <p className="m-0 mt-1">{text}</p>
                </div>
              ))}
            </div>
          )}
        </fieldset>

        {variant === "B" && (
          <fieldset className="m-0 mt-6 border-0 p-0">
            <legend className="mb-2 p-0 text-sm leading-[18px] font-medium tracking-[-0.28px] text-near-black">
              Headline
            </legend>
            <div className="flex flex-wrap gap-2">
              {HEADLINE_ANGLES.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  aria-pressed={angle === item.value}
                  onClick={() => setAngle(item.value)}
                  className={`${CHIP} ${angle === item.value ? "border-dark bg-dark text-white" : "border-light-grey-3 text-dark"}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </fieldset>
        )}

        {/* TODO(lift): the shared Accordion can't start open or animate, so these are their own */}
        <div className="mt-6">
          {QUESTIONS.filter(
            (question) =>
              question.type !== "slider" &&
              (SHOWN_WHEN[question.id]?.(answers) ?? true),
          ).map((question) => {
            const isOpen = openIds.includes(question.id);
            return (
              <div key={question.id} className="border-t border-light-grey-2">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() =>
                    setOpenIds(
                      isOpen
                        ? openIds.filter((id) => id !== question.id)
                        : [...openIds, question.id],
                    )
                  }
                  className="flex w-full cursor-pointer items-center justify-between gap-4 py-4 text-left text-sm leading-[18px] font-medium tracking-[-0.28px] text-near-black"
                >
                  {question.question}
                  <span
                    aria-hidden
                    className={`shrink-0 text-lg leading-none transition-transform duration-300 ease-ui ${isOpen ? "rotate-45" : ""}`}
                  >
                    +
                  </span>
                </button>
                <div
                  inert={!isOpen}
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-ui ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                >
                  <div className="overflow-hidden">
                    <div className="flex flex-wrap gap-2 pb-4">
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
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </aside>

      <button
        type="button"
        onClick={() => setPanelOpen(true)}
        aria-label="Show controls"
        inert={panelOpen}
        className={`${CHIP} absolute top-4 left-4 z-10 bg-white text-dark shadow-[0_1px_3px] shadow-near-black/14 ${
          panelOpen ? "pointer-events-none opacity-0" : "opacity-100 delay-300"
        }`}
      >
        Controls
      </button>

      <main className="flex flex-1 items-center justify-center p-6">
        {base !== null && (
          <iframe
            ref={frameRef}
            src={`${base}?start=results&variant=a`}
            title="Prototype"
            className="block h-[min(844px,calc(100dvh-48px))] w-[390px] max-w-full rounded-[40px] border-0 bg-white shadow-[0_24px_64px_-16px] shadow-near-black/25"
          />
        )}
      </main>
    </div>
  );
}
