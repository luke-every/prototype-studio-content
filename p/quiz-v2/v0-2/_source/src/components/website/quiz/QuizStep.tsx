import { primaryChallenge } from "@/lib/quiz-answers";
import { stepTravel } from "@/lib/step-motion";
import { AFFIRMATION_BY_GOAL, AFFIRMATION_CHALLENGE, AFFIRMATION_GOAL, QUESTIONS } from "./sample-data";
import { QuizAffirmation } from "./QuizAffirmation";
import { QuizBreak } from "./QuizBreak";
import { QuizIntro } from "./QuizIntro";
import { QuizQuestion } from "./QuizQuestion";
import { SatisfactionSlider } from "./SatisfactionSlider";
import type { Answers, QuestionId, StepKey, StepMotion } from "./types";

type Props = {
  step: StepKey;
  answers: Answers;
  motion: StepMotion;
  dir: "push" | "pop";
  onSelect: (id: QuestionId, value: string) => void;
  onSlide: (value: number) => void;
  onNext: () => void;
};

/** One step of the quiz: the page that arrives, or the copy of it that leaves. */
export function QuizStep({ step, answers, motion, dir, onSelect, onSlide, onNext }: Props) {
  const question = QUESTIONS.find((q) => q.id === step);
  const isIntro = step === "intro";
  const isSlider = question?.type === "slider";
  const moving = motion === "enter" || motion === "opening";

  let content: React.ReactNode = null;
  if (isIntro) {
    content = <QuizIntro motion={motion} onStart={onNext} />;
  } else if (step === "break") {
    content = <QuizBreak motion={motion} />;
  } else if (step === "aff-goal") {
    content = <QuizAffirmation affirmation={AFFIRMATION_BY_GOAL[answers.goal[0]] ?? AFFIRMATION_GOAL} motion={motion} />;
  } else if (step === "aff-chal") {
    const chosen = primaryChallenge(answers) ?? "time";
    content = <QuizAffirmation affirmation={AFFIRMATION_CHALLENGE[chosen]} motion={motion} />;
  } else if (question && isSlider) {
    const saved = answers.sat[0];
    content = (
      <SatisfactionSlider
        question={question}
        value={saved ? Number(saved) : null}
        motion={motion}
        onChange={onSlide}
      />
    );
  } else if (question) {
    content = (
      <QuizQuestion
        question={question}
        picked={answers[question.id]}
        motion={motion}
        onSelect={(value) => onSelect(question.id, value)}
      />
    );
  }

  const bodyWidth = isIntro ? "lg:pb-[30px]" : "lg:mx-auto lg:w-full lg:max-w-[544px]";
  return (
    <div
      data-qbody
      className={`flex flex-1 flex-col px-6 pt-[30px] ${isSlider ? "pb-[124px]" : "pb-[156px]"} ${bodyWidth}`}
    >
      <div
        className={`flex min-h-0 flex-1 flex-col ${step.startsWith("aff") || step === "break" ? "justify-center pb-[30px]" : ""} ${
          moving ? "animate-page-in" : ""
        }`}
        style={stepTravel(motion, dir)}
      >
        {content}
      </div>
    </div>
  );
}
