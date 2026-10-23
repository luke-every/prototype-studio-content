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

// TODO(lift): fake — a prototype convenience so switching variants keeps the quiz just taken; production holds answers in the session
const SAVED_KEY = "quiz-v2:answers";

/** The last quiz finished in this browser, kept so every results variant can show the same answers */
export function saveAnswers(answers: Answers): void {
  try {
    window.localStorage.setItem(SAVED_KEY, JSON.stringify(answers));
  } catch {
    /* storage off or full: variants fall back to the sample answers */
  }
}

const VARIANT_KEY = "quiz-v2:variant";

// TODO(lift): fake — prototype convenience, like the saved answers
/** The results variant this tab last showed, so switching variant in the studio can go straight to results */
export function lastVariant(): ResultsVariant | null {
  try {
    return window.sessionStorage.getItem(VARIANT_KEY) as ResultsVariant | null;
  } catch {
    return null;
  }
}

export function rememberVariant(variant: ResultsVariant): void {
  try {
    window.sessionStorage.setItem(VARIANT_KEY, variant);
  } catch {
    /* storage off: switching variant lands where "Start at" says */
  }
}

function savedAnswers(): Answers | null {
  try {
    const raw = window.localStorage.getItem(SAVED_KEY);
    const parsed = raw ? (JSON.parse(raw) as Partial<Answers>) : null;
    return parsed?.goal ? { ...EMPTY_ANSWERS, ...parsed } : null;
  } catch {
    return null;
  }
}

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
 * (the Prototype Studio controls in public/studio.json write the same parameters). Unknown or missing
 * values fall back to the defaults, so a bare link opens the homepage.
 *
 *   ?variant=a|b|c|d   ?start=quiz|loader|results   ?step=1..13 or a step name like whyWeight (with start=quiz)
 *   ?bundle=postpartum   ?challenge=budget   ?allergy=yes (adds the allergy follow-up)
 */
export function parseQuizLink(search: string, previous: ResultsVariant | null = null): QuizLink {
  const params = new URLSearchParams(search);
  const get = (...keys: string[]): string | null => {
    for (const key of keys) {
      const value = params.get(key);
      if (value !== null) return value.trim().toLowerCase();
    }
    return null;
  };

  const asked = (get("variant", "v") ?? "a").toUpperCase();
  const variant: ResultsVariant = (["A", "B", "C", "D"] as const).find((v) => v === asked) ?? "A";
  const challenge = challengeFrom(get("challenge"));
  const bundle = BUNDLE_ALIASES[get("bundle", "goal") ?? ""] ?? DEFAULT_BUNDLE;

  /* the sample answers stand in for whichever challenge wasn't asked for on the link */
  const sample: Answers = { ...SAMPLE_ANSWERS, challenges: challenge ? [challenge] : SAMPLE_ANSWERS.challenges };

  /* switching variant is a request to see that variant's results: go there unless the link asks for a quiz step */
  const switched = previous !== null && previous !== variant;
  const asks = get("start", "at");
  const start = switched && (asks === null || asks === "home") ? "results" : asks;
  /* the loader is the last step, and where that is depends on the answers */
  const loadStep = (answers: Answers) => stepsFor(answers).length - 1;
  /* the quiz they last finished, if there is one; the sample answers otherwise */
  const saved = savedAnswers();
  if (start === "results" || start === "result") {
    const answers = saved ?? { ...sample, goal: [bundle] };
    return { variant, entry: { step: loadStep(answers), answers, results: true } };
  }
  if (start === "loader" || start === "loading") {
    const answers = saved ?? sample;
    return { variant, entry: { step: loadStep(answers), answers, results: false } };
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
