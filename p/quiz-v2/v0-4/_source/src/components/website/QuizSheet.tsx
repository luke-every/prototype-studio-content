"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { saveAnswers } from "@/lib/quiz-link";
import { QuizFooter } from "./quiz/QuizFooter";
import { QuizLoader } from "./quiz/QuizLoader";
import { QuizStep } from "./quiz/QuizStep";
import { QuizStepper } from "./quiz/QuizStepper";
import { AUTO_ADVANCE_MS, QUESTIONS, sectionProgress, stepsFor } from "./quiz/sample-data";
import type { Answers, QuestionId, QuizEntry, ResultsVariant, StepKey } from "./quiz/types";
import { HeroesPage } from "./results/HeroesPage";
import { RecipeSheet } from "./results/RecipeSheet";
import { ResultsPage } from "./results/ResultsPage";
import type { MenuItem, Products, ResultsPageProps } from "./results/types";

/** A to D are the results pages (see ResultsPage); H is the reference sheet of the old C and D heroes */
const PAGES: Record<ResultsVariant, (props: ResultsPageProps) => React.ReactNode> = {
  A: ResultsPage,
  B: (props) => <ResultsPage {...props} iteration="B" />,
  C: (props) => <ResultsPage {...props} iteration="C" />,
  D: (props) => <ResultsPage {...props} iteration="D" />,
  H: HeroesPage,
};

type Props = {
  entry: QuizEntry;
  variant: ResultsVariant;
  open: boolean;
  /** Opened by the link, so it is already up rather than rising */
  instant: boolean;
  products: Products | null;
  onClose: () => void;
};

/** The step that has just left, kept for a moment so it can animate out over the one arriving */
type Ghost = {
  step: StepKey;
  answers: Answers;
  dir: "push" | "pop";
  top: number;
  height: number;
};

const LEAVE_MS = 450;

const isQuestion = (step: StepKey): boolean => QUESTIONS.some((question) => question.id === step);

/**
 * The quiz sheet: it comes up over the homepage and goes back down into it. It holds a run of the
 * quiz, from the intro to the results, and is rebuilt for each run.
 */
export function QuizSheet({ entry, variant, open, instant, products, onClose }: Props) {
  const [entered, setEntered] = useState<boolean>(instant);
  const [stepIdx, setStepIdx] = useState<number>(entry.step);
  const [dir, setDir] = useState<"push" | "pop">("push");
  const [answers, setAnswers] = useState<Answers>(entry.answers);
  /* answers handed in from outside replace the run's own (the review page changes them live) */
  const [entrySeen, setEntrySeen] = useState<QuizEntry>(entry);
  if (entry !== entrySeen) {
    setEntrySeen(entry);
    setAnswers(entry.answers);
    setStepIdx(entry.step);
  }
  const [ghost, setGhost] = useState<Ghost | null>(null);
  /** The first step rises with the sheet rather than sideways */
  const [opening, setOpening] = useState<boolean>(true);

  /* the way out of the quiz: the loader, then the results built behind it */
  const [built, setBuilt] = useState<boolean>(entry.results);
  const [chrome, setChrome] = useState<boolean>(entry.results);
  const [revealed, setRevealed] = useState<boolean>(entry.results);
  const [loaderGone, setLoaderGone] = useState<boolean>(entry.results);

  const [cartCount, setCartCount] = useState<number>(0);
  const [recipe, setRecipe] = useState<MenuItem | null>(null);
  /** The results have a sheet of their own up, which takes Esc first */
  const [pickerUp, setPickerUp] = useState<boolean>(false);

  const screenRef = useRef<HTMLDivElement>(null);
  const advanceTimer = useRef<number | null>(null);
  const ghostTimer = useRef<number | null>(null);

  const steps = stepsFor(answers);
  const step: StepKey = steps[stepIdx];
  const isLoad = step === "load";
  /* the loader washes over the last question where it stands, so nothing leaves */
  const bodyStep: StepKey = isLoad ? steps[steps.length - 2] : step;
  const overlayUp = recipe !== null || pickerUp;
  const Page = PAGES[variant];

  /* rise on the frame after mounting, so the sheet has somewhere to rise from */
  useEffect(() => {
    if (instant) return;
    const frame = requestAnimationFrame(() => requestAnimationFrame(() => setEntered(true)));
    return () => cancelAnimationFrame(frame);
  }, [instant]);

  useEffect(
    () => () => {
      if (advanceTimer.current !== null) window.clearTimeout(advanceTimer.current);
      if (ghostTimer.current !== null) window.clearTimeout(ghostTimer.current);
    },
    [],
  );

  /* Esc closes the sheet, unless a layer above it takes the key first */
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !overlayUp) onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, overlayUp, onClose]);

  /**
   * Leaving and arriving cross over. The next step is rendered at once and the old one is kept as a
   * copy on top of it, animating out while the new one animates in.
   */
  const go = (target: number, list: StepKey[] = steps) => {
    const next = Math.max(0, Math.min(target, list.length - 1));
    const screen = screenRef.current;
    const body = screen?.querySelector<HTMLElement>("[data-qbody]");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const direction = next >= stepIdx ? "push" : "pop";
    if (screen && body && list[next] !== "load" && !isLoad && !reduced) {
      setGhost({
        step,
        answers,
        dir: direction,
        top: body.offsetTop - screen.scrollTop,
        height: body.offsetHeight,
      });
      if (ghostTimer.current !== null) window.clearTimeout(ghostTimer.current);
      ghostTimer.current = window.setTimeout(() => setGhost(null), LEAVE_MS + 50);
    }
    if (advanceTimer.current !== null) {
      window.clearTimeout(advanceTimer.current);
      advanceTimer.current = null;
    }
    setRecipe(null);
    setDir(direction);
    setStepIdx(next);
    setOpening(false);
    if (screen) screen.scrollTop = 0;
  };

  const select = (id: QuestionId, value: string) => {
    const question = QUESTIONS.find((q) => q.id === id);
    if (question?.type === "multi") {
      /* order matters on the challenges: the first one tapped is the dominant one */
      const picked = answers[id].includes(value) ? answers[id].filter((v) => v !== value) : [...answers[id], value];
      setAnswers({ ...answers, [id]: picked });
      return;
    }
    const picked = { ...answers, [id]: [value] };
    setAnswers(picked);
    if (advanceTimer.current === null) {
      const from = stepIdx;
      advanceTimer.current = window.setTimeout(() => {
        advanceTimer.current = null;
        /* the pick can add or drop a follow-up question, so the way on is read from the new answers */
        go(from + 1, stepsFor(picked));
      }, AUTO_ADVANCE_MS);
    }
  };

  const addToCart = (meals: number) => {
    setCartCount((count) => count + meals);
    // TODO(lift): fake — nothing is bought here; production adds the box to the cart
    toast("Added — this is a prototype.");
  };

  const buildResults = useCallback(() => {
    saveAnswers(answers);
    setBuilt(true);
  }, [answers]);
  const handover = useCallback(() => setChrome(true), []);
  const reveal = useCallback(() => setRevealed(true), []);
  const loaderDone = useCallback(() => setLoaderGone(true), []);

  const question = QUESTIONS.find((q) => q.id === bodyStep);
  const holdContinue =
    question?.type === "multi" ? answers[question.id].length === 0 : question?.type === "slider" ? answers.sat.length === 0 : false;
  const ground = chrome ? "bg-(--bundle)" : isQuestion(bodyStep) && !isLoad ? "bg-white" : "bg-light-grey";
  const footTone = isQuestion(bodyStep) ? "white" : "grey";

  return (
    <div
      aria-hidden={!open}
      className={`absolute inset-0 z-40 flex flex-col [transition:background-color_800ms_var(--ease-ui),translate_620ms_var(--ease-swing),visibility_620ms] ${ground} ${
        open && entered ? "visible translate-y-0" : "invisible translate-y-full"
      }`}
      /* the colour the loader fades to and the results sit on: the brand's warm neutral */
      style={{ "--bundle": "var(--color-light-brown)" } as React.CSSProperties}
    >
      {!built && (
        <>
          <div ref={screenRef} className="scrollbar-hide relative flex flex-1 flex-col overflow-x-hidden overflow-y-auto overscroll-contain">
            <QuizStepper
              sections={sectionProgress(steps, stepIdx)}
              narrow={bodyStep !== "intro"}
              onBack={() => (stepIdx <= 0 ? onClose() : go(stepIdx - 1))}
              onClose={onClose}
            />
            <QuizStep
              key={bodyStep}
              step={bodyStep}
              answers={answers}
              motion={isLoad ? "still" : opening ? "opening" : "enter"}
              dir={dir}
              onSelect={select}
              onSlide={(value) => setAnswers({ ...answers, sat: [String(value)] })}
              onNext={() => go(stepIdx + 1)}
            />
            {ghost && (
              <div
                className="pointer-events-none absolute inset-x-0 z-[2] flex flex-col"
                style={{ top: ghost.top, height: ghost.height }}
                aria-hidden
              >
                <QuizStep
                  step={ghost.step}
                  answers={ghost.answers}
                  motion="leave"
                  dir={ghost.dir}
                  onSelect={select}
                  onSlide={() => {}}
                  onNext={() => {}}
                />
              </div>
            )}
          </div>
          <QuizFooter
            key={bodyStep}
            step={bodyStep}
            holdContinue={holdContinue}
            tone={footTone}
            onNext={() => go(stepIdx + 1)}
          />
          {ghost && (
            <QuizFooter
              step={ghost.step}
              holdContinue={false}
              tone={isQuestion(ghost.step) ? "white" : "grey"}
              leaving
              onNext={() => {}}
            />
          )}
        </>
      )}

      {built && (
        <Page
          answers={answers}
          products={products}
          chrome={chrome}
          revealed={revealed}
          instant={entry.results}
          cartCount={cartCount}
          onAdd={addToCart}
          onOpenRecipe={setRecipe}
          onPickerChange={setPickerUp}
          onLogo={onClose}
        />
      )}

      {isLoad && !loaderGone && (
        <QuizLoader onBuildResults={buildResults} onHandover={handover} onReveal={reveal} onDone={loaderDone} />
      )}

      <RecipeSheet item={recipe} products={products} onClose={() => setRecipe(null)} />
    </div>
  );
}

