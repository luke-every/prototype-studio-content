import { CheckedIcon } from "@/components/icons";
import type { Answers } from "../quiz/types";
import { PhotoMarquee } from "./PhotoMarquee";

const MAX_TAGS = 4;

type Props = {
  answers: Answers;
  /** The row of tags under the title; the old A leaves it out, as its taste profile says who it is for */
  showTags?: boolean;
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
    steady: "Keep weight steady",
    few: "Lose a few kilos",
    lots: "Lose weight",
    doctor: "Doctor-led plan",
  },
};

/* the marquee's four photos per goal, numbered from 1; gut has none of its own yet, so it borrows the balanced diet's */
export const PHOTO: Record<string, (n: number) => string> = {
  protein: (n) => `hero/fitness0${n}.png`,
  portions: (n) => `hero/PerfectPortionsHero-0${n}.png`,
  postpartum: (n) => `hero/PostPartumHero-0${n}.png`,
  better: (n) => `img/bb${n}.jpg`,
  gut: (n) => `img/bb${n}.jpg`,
};

// TODO(lift): sample data — short tag names, so a tag doesn't just repeat the quiz's wording
const GOAL: Record<string, string> = {
  protein: "Fitness",
  portions: "Eat lighter",
  postpartum: "New parent",
  better: "Balanced diet",
  gut: "Gut health",
};
const WEEK: Record<string, string> = {
  work: "Busy workdays",
  family: "Family life",
  training: "Regular training",
  friends: "Social lifestyle",
};
const WATCH: Record<string, string> = {
  protein: "More protein",
  fibre: "More fibre",
  portions: "Right-sized portions",
  sugar: "Less sugar",
  plants: "More plants",
};

/**
 * The tags under A's title, four at most: who it is for (not just them), goal, sub-goal (fitness, eat lighter),
 * then what's left from their week and what they look for. Those are picked lifestyle, nutrition, lifestyle,
 * nutrition, so a nutrition tag always gets a place and a missing kind leaves its room to the other; shown lifestyle first
 */
export function profileTags(answers: Answers): string[] {
  const goal = answers.goal[0];
  const why =
    goal === "protein"
      ? "whyFitness"
      : goal === "portions"
        ? "whyWeight"
        : null;
  /* "a bit of everything", "nothing specific" and diabetes have no name here, so they never show */
  const week = answers.week.flatMap((value) => WEEK[value] ?? []);
  const watch = answers.watch.flatMap((value) => WATCH[value] ?? []);
  const lead = [
    answers.household[0] === "alone" ? undefined : WITH[answers.household[0]],
    GOAL[goal],
    why ? DRIVER[why][answers[why][0]] : undefined,
  ].filter((tag): tag is string => Boolean(tag));
  const room = MAX_TAGS - lead.length;
  const picked = new Set(
    Array.from({ length: Math.max(week.length, watch.length) }, (_, i) => [
      week[i],
      watch[i],
    ])
      .flat()
      .filter((tag): tag is string => Boolean(tag))
      .slice(0, room),
  );
  return [
    ...lead,
    ...week.filter((tag) => picked.has(tag)),
    ...watch.filter((tag) => picked.has(tag)),
  ];
}

/** A's hero under the title: the tags, the photographs drifting past */
export function ProfileHero({ answers, showTags = true }: Props) {
  const goal = answers.goal[0];
  const tags = profileTags(answers);
  const photo = PHOTO[goal] ?? PHOTO.better;
  const set = Array.from({ length: 4 }, (_, i) => photo(i + 1));

  return (
    <div className="flex flex-col gap-4">
      {showTags && (
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
      )}
      {/* out to the hero's edges, past its padding */}
      <PhotoMarquee photos={[...set, ...set]} className="-mx-6" />
    </div>
  );
}
