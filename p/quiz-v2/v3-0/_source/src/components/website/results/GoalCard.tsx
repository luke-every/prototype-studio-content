import { CheckedIcon } from "@/components/icons";
import type { Goal } from "@/lib/recommendation";

type Props = {
  engineGoal: Goal;
};

// TODO(lift): sample data — the ranges follow the draft goal criteria in lib/recommendation.ts; replace with the approved ones
const TARGETS: Record<Goal, string[]> = {
  fitness: ["Protein · 20 g+ per meal", "Fibre · 8 g+ per meal"],
  lose: [
    "Protein · 20 g+ per meal",
    "Fibre · 8 g+ per meal",
    "Energy · under 520 kcal per meal",
  ],
  baby: ["Protein · 20 g+ per meal", "Fibre · 12 g+ per meal"],
  easy: [
    "Energy · 400–600 kcal per meal",
    "Carbs · 45–80 g per meal",
    "Protein · 15 g+ per meal",
  ],
  gut: [
    "Fibre · 12 g+ per meal",
    "Protein · 15 g+ per meal",
    "Energy · 400–600 kcal per meal",
  ],
};

// TODO(lift): sample data — replace with the goal's name from the CMS
const GOAL_NAME: Record<Goal, string> = {
  fitness: "Nutrition for fitness",
  lose: "Eating lighter",
  baby: "Eating well as a new parent",
  easy: "A more balanced diet",
  gut: "A healthier gut",
};

/** C's hero: the goal called out, the plan introduced, and what we held every meal to for it, as the quiz's tags */
export function GoalCard({ engineGoal }: Props) {
  return (
    <div className="flex flex-col gap-5">
      {/* TODO(lift): replace with translation keys */}
      <div className="flex flex-col gap-2">
        <p className="m-0 text-sm leading-[18px] tracking-[1.4px] text-light-text uppercase">
          {GOAL_NAME[engineGoal]}
        </p>
        <h1 className="m-0 font-book text-[34px] leading-[34px] tracking-[-0.68px] text-dark">
          Your personalised plan
        </h1>
      </div>
      <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
        {TARGETS[engineGoal].map((target) => (
          <li
            key={target}
            className="flex items-center gap-[5px] rounded-full bg-dark/8 px-2 py-1 text-sm leading-5 tracking-[-0.28px] text-near-black"
          >
            <CheckedIcon size={14} className="shrink-0" />
            {target}
          </li>
        ))}
      </ul>
    </div>
  );
}
