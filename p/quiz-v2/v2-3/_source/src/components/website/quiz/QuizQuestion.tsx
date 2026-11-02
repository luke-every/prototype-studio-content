import { OptionRow } from "./OptionRow";
import { OptionTile } from "./OptionTile";
import { QuizHeading } from "./QuizHeading";
import type { Question, StepMotion } from "./types";

type Props = {
  question: Question;
  /** The values picked so far */
  picked: string[];
  motion: StepMotion;
  onSelect: (value: string) => void;
};

/** A question as a grid of tiles when it is a single choice with pictures, otherwise as a list of rows */
export function QuizQuestion({ question, picked, motion, onSelect }: Props) {
  /* a single choice with pictures is a grid of tiles; one of plain words is a list, like a multiple choice */
  const isGrid = question.type === "single" && question.options.every((option) => option.icon);
  return (
    <>
      <QuizHeading title={question.question} sub={question.sub} motion={motion} />
      <div className={`mt-[26px] pb-5 ${isGrid ? "grid grid-cols-2 gap-3" : "flex flex-col gap-3"}`}>
        {question.options.map((option, index) =>
          isGrid ? (
            <OptionTile
              key={option.value}
              option={option}
              selected={picked.includes(option.value)}
              index={index}
              motion={motion}
              onSelect={() => onSelect(option.value)}
            />
          ) : (
            <OptionRow
              key={option.value}
              option={option}
              selected={picked.includes(option.value)}
              index={index}
              motion={motion}
              onSelect={() => onSelect(option.value)}
            />
          ),
        )}
      </div>
    </>
  );
}
