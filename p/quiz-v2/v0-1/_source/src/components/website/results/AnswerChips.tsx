import { CheckedIcon } from "@/components/icons";
import type { Answers, BundleKey, ChallengeId } from "../quiz/types";
import { CHALLENGE_TAG, GOAL_TAG, MAX_TAGS, WATCH_TAG } from "./sample-data";

type Props = {
  goal: BundleKey;
  answers: Answers;
  className?: string;
  style?: React.CSSProperties;
};

/** One goal, up to two challenges, up to two nutrition answers: four tags at most. */
function tagsFor(goal: BundleKey, answers: Answers): string[] {
  return [
    GOAL_TAG[goal],
    ...answers.challenges.slice(0, 2).map((id) => CHALLENGE_TAG[id as ChallengeId]),
    ...answers.watch.slice(0, 2).map((id) => WATCH_TAG[id]),
  ]
    .filter(Boolean)
    .slice(0, MAX_TAGS);
}

/** The quiz read back as chips: they wrap onto as many lines as they need */
export function AnswerChips({ goal, answers, className, style }: Props) {
  return (
    <div className={`-mt-3 mr-12 ml-6 flex flex-wrap gap-2 ${className ?? ""}`} style={style}>
      {tagsFor(goal, answers).map((tag) => (
        <span
          key={tag}
          className="flex items-center gap-[5px] rounded-full bg-dark/8 px-2 py-1 text-sm leading-5 tracking-[-0.28px] text-near-black"
        >
          <CheckedIcon size={14} className="shrink-0" />
          {tag}
        </span>
      ))}
    </div>
  );
}
