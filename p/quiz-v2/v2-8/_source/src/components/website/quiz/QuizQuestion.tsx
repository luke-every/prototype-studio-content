import { OptionRow } from "./OptionRow";
import { QuizHeading } from "./QuizHeading";
import type { Question, StepMotion } from "./types";

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
        {question.options.map((option, index) => (
          <OptionRow
            key={option.value}
            option={option}
            selected={picked.includes(option.value)}
            index={index}
            motion={motion}
            onSelect={() => onSelect(option.value)}
          />
        ))}
      </div>
    </>
  );
}
