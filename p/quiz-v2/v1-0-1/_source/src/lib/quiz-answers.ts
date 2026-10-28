import type { Answers, BundleKey, ChallengeId } from "@/components/website/quiz/types";

const BUNDLES: BundleKey[] = ["protein", "portions", "postpartum", "better"];

/** The goal is what routes them to a box: one goal, one bundle. Protein when nothing was picked. */
export function bundleOf(answers: Answers): BundleKey {
  // TODO(lift): fake — gut health has no bundle of its own yet, so it routes to Back to Better
  const goal = answers.goal[0] === "gut" ? "better" : answers.goal[0];
  return BUNDLES.find((bundle) => bundle === goal) ?? "protein";
}

/** The first challenge tapped is the dominant one: it decides the challenge affirmation and the challenge content on the results. */
export function primaryChallenge(answers: Answers): ChallengeId | null {
  return (answers.challenges[0] as ChallengeId | undefined) ?? null;
}
