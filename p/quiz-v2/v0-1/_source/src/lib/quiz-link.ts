import { EMPTY_ANSWERS, QUESTIONS, SAMPLE_ANSWERS, stepsFor } from "@/components/website/quiz/sample-data";
import type { Answers, BundleKey, ChallengeId, QuizEntry, ResultsVariant } from "@/components/website/quiz/types";

export type QuizLink = {
  variant: ResultsVariant;
  /** null opens on the homepage */
  entry: QuizEntry | null;
};

const BUNDLE_ALIASES: Record<string, BundleKey> = {
  p: "protein",
  protein: "protein",
  pp: "portions",
  portions: "portions",
  perfect: "portions",
  lighter: "portions",
  postp: "postpartum",
  postpartum: "postpartum",
  parent: "postpartum",
  bb: "better",
  better: "better",
};

const CHALLENGE_ALIASES: Record<string, ChallengeId> = {
  time: "time",
  cook: "time",
  decide: "decide",
  deciding: "decide",
  balance: "balance",
  balanced: "balance",
  waste: "waste",
  wasting: "waste",
  cooking: "cooking",
  budget: "budget",
};

const DEFAULT_BUNDLE: BundleKey = "protein";

/** The full wording of a challenge also works: ?challenge=wasting food */
function challengeFrom(value: string | null): ChallengeId | null {
  if (!value) return null;
  const byLabel = QUESTIONS.find((question) => question.id === "challenges")?.options.find(
    (option) => option.label.toLowerCase() === value,
  );
  return (byLabel?.value as ChallengeId | undefined) ?? CHALLENGE_ALIASES[value] ?? null;
}

/**
 * There are no on-page controls in this build, so the query string is how a test session is set up
 * (the Prototype Studio controls in studio.json write the same parameters). Unknown or missing
 * values fall back to the defaults, so a bare link is variant A from the homepage.
 *
 *   ?variant=a|b   ?start=quiz|loader|results   ?step=1..13 or a step name like whyWeight (with start=quiz)
 *   ?bundle=postpartum   ?challenge=budget   ?allergy=yes (adds the allergy follow-up)
 */
export function parseQuizLink(search: string): QuizLink {
  const params = new URLSearchParams(search);
  const get = (...keys: string[]): string | null => {
    for (const key of keys) {
      const value = params.get(key);
      if (value !== null) return value.trim().toLowerCase();
    }
    return null;
  };

  const variant: ResultsVariant = get("variant", "v") === "b" ? "B" : "A";
  const challenge = challengeFrom(get("challenge"));
  const bundle = BUNDLE_ALIASES[get("bundle", "goal") ?? ""] ?? DEFAULT_BUNDLE;

  /* the sample answers stand in for whichever challenge wasn't asked for on the link */
  const sample: Answers = { ...SAMPLE_ANSWERS, challenges: challenge ? [challenge] : SAMPLE_ANSWERS.challenges };

  const start = get("start", "at");
  /* the loader is the last step, and where that is depends on the answers */
  const loadStep = (answers: Answers) => stepsFor(answers).length - 1;
  if (start === "results" || start === "result") {
    const answers = { ...sample, goal: [bundle] };
    return { variant, entry: { step: loadStep(answers), answers, results: true } };
  }
  if (start === "loader" || start === "loading") {
    return { variant, entry: { step: loadStep(sample), answers: sample, results: false } };
  }
  if (start === "quiz") {
    /* ?step=3 opens mid-quiz with the sample answers filled in so the affirmations have content; the goal and
       allergy follow-ups only exist for some answers, so ?bundle and ?allergy set those for a link to them */
    const answers: Answers = {
      ...sample,
      goal: get("bundle", "goal") ? [bundle] : [],
      allergy: get("allergy") === "yes" ? ["yes"] : sample.allergy,
    };
    const steps = stepsFor(answers);
    const named = steps.findIndex((key) => key.toLowerCase() === get("step"));
    const step = named > 0 ? named : Number(get("step"));
    if (Number.isInteger(step) && step > 0 && step < steps.length - 1) {
      return { variant, entry: { step, answers, results: false } };
    }
    return { variant, entry: { step: 0, answers: EMPTY_ANSWERS, results: false } };
  }
  return { variant, entry: null };
}
