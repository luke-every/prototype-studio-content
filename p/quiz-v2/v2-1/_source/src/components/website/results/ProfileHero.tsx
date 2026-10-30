import { CheckedIcon } from "@/components/icons";
import { QUESTIONS } from "../quiz/sample-data";
import type { Answers, QuestionId } from "../quiz/types";
import { PhotoMarquee } from "./PhotoMarquee";

type Props = {
  answers: Answers;
};

// TODO(lift): sample data — replace with the household phrasing from the CMS
const WITH: Record<string, string> = {
  alone: "Just you",
  partner: "You and your partner",
  family: "You and your family",
  roommates: "You and your housemates",
};

// TODO(lift): sample data — short names for what drives their goal; the quiz's own wording is a full sentence
const DRIVER: Record<string, Record<string, string>> = {
  whyFitness: {
    muscle: "Build muscle",
    lean: "Stay lean & healthy",
    energy: "More energy",
    full: "Stay full for longer",
    meatless: "Protein without meat",
  },
  whyWeight: {
    energy: "Lighter, more energy",
    doctor: "Doctor recommended",
    regain: "Back on track",
    maintain: "Feel comfortable",
  },
};

/* the marquee's set per goal (v1's variant B); gut has none of its own yet, so it borrows the balanced diet's */
const PHOTO_PREFIX: Record<string, string> = {
  protein: "p",
  portions: "pp",
  postpartum: "postp",
  better: "bb",
  gut: "bb",
};

const labelOf = (id: QuestionId, value: string | undefined) =>
  QUESTIONS.find((question) => question.id === id)?.options.find(
    (option) => option.value === value,
  )?.label;

/** A-1's hero under the title: who it is for, their goal and what drives it, their week, then the photographs drifting past */
export function ProfileHero({ answers }: Props) {
  const goal = answers.goal[0];
  const why =
    goal === "protein"
      ? "whyFitness"
      : goal === "portions"
        ? "whyWeight"
        : null;
  const tags = [
    WITH[answers.household[0]],
    goal === "portions" ? "Eat lighter" : labelOf("goal", goal),
    why && DRIVER[why][answers[why][0]],
    labelOf("week", answers.week[0]),
  ].filter((tag): tag is string => Boolean(tag));
  const set = Array.from(
    { length: 4 },
    (_, i) => `img/${PHOTO_PREFIX[goal] ?? "bb"}${i + 1}.jpg`,
  );

  return (
    <div className="flex flex-col gap-4">
      <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
        {tags.map((tag) => (
          <li
            key={tag}
            className="flex items-center gap-[5px] rounded-full bg-dark/8 px-2 py-1 text-sm leading-5 tracking-[-0.28px] text-near-black"
          >
            <CheckedIcon size={14} className="shrink-0" />
            {tag}
          </li>
        ))}
      </ul>
      {/* out to the hero's edges, past its padding */}
      <PhotoMarquee photos={[...set, ...set]} className="-mx-6" />
    </div>
  );
}
