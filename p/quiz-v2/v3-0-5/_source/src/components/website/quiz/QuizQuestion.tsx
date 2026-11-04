import { OptionRow } from "./OptionRow";
import { QuizHeading } from "./QuizHeading";
import type { Question, QuestionOption, StepMotion } from "./types";

/** One random order per question per page load, so going back keeps it */
const ORDER: Record<string, QuestionOption[]> = {};

const CLOSERS = ["everything", "nothing", "no"];

function orderOf(question: Question): QuestionOption[] {
  if (!question.shuffle) return question.options;
  return (ORDER[question.id] ??= [
    ...question.options
      .filter((option) => !CLOSERS.includes(option.value))
      .sort(() => Math.random() - 0.5),
    ...question.options.filter((option) => CLOSERS.includes(option.value)),
  ]);
}

type Props = {
  question: Question;
  /** The values picked so far */
  picked: string[];
  motion: StepMotion;
  onSelect: (value: string) => void;
};

/** A question as a list of rows, whether one answer or several: a single choice moves on as soon as it is picked */
export function QuizQuestion({ question, picked, motion, onSelect }: Props) {
  return (
    <>
      <QuizHeading title={question.question} sub={question.sub} motion={motion} />
      <div className="mt-[26px] flex flex-col gap-3 pb-5">
        {orderOf(question).map((option, index) => (
          <OptionRow
            key={option.value}
            option={option}
            selected={picked.includes(option.value)}
            single={question.type !== "multi"}
            index={index}
            motion={motion}
            onSelect={() => onSelect(option.value)}
          />
        ))}
      </div>
    </>
  );
}
