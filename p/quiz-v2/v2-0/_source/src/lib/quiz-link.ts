import { EMPTY_ANSWERS, QUESTIONS, SAMPLE_ANSWERS, stepsFor } from "@/components/website/quiz/sample-data";
import type { Answers, BundleKey, ChallengeId, QuizEntry, ResultsVariant } from "@/components/website/quiz/types";

export type QuizLink = {
  variant: ResultsVariant;
  /** null opens on the homepage */
  entry: QuizEntry | null;
};

/* gut health is a goal without a bundle of its own (see bundleOf), but a link can still ask for it */
const BUNDLE_ALIASES: Record<string, BundleKey | "gut"> = {
  gut: "gut",
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

/**
 * Every answer but the goal (?bundle) and the slider can be set from the link, as ?<question>=<value>, the way
 * the studio's controls do; a multiple choice takes its values joined by commas (?watch=fibre,sugar, or ?watch=
 * for none). What the link leaves out stays as the sample answers have it. `set` says the link set any, so the
 * quiz last finished in this browser steps aside for them.
 */
function answersFromLink(get: (...keys: string[]) => string | null): { answers: Answers; set: boolean } {
  const answers: Answers = { ...SAMPLE_ANSWERS };
  let set = false;
  for (const question of QUESTIONS) {
    if (question.id === "goal" || question.type === "slider") continue;
    const value = get(question.id);
    if (value === null) continue;
    const known = (item: string) => question.options.some((option) => option.value === item);
    if (question.type === "multi") {
      answers[question.id] = value.split(",").filter(known);
      set = true;
    } else if (known(value)) {
      answers[question.id] = [value];
      set = true;
    }
  }
  return { answers, set };
}

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
 *   ?variant=a|b|h   ?start=quiz|email|loader|results   ?step=1..13 or a step name like whyWeight (with start=quiz)
 *   ?bundle=postpartum   ?allergy=yes (adds the allergy follow-up)
 *   any other answer: ?spicy=no   ?week=training,family   ?allergyWhich=soy,nuts (see answersFromLink)
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

  const asked = (get("variant", "v") ?? "a-1").toUpperCase();
  const variant: ResultsVariant = (["A-1", "A-2", "B-OLD", "H"] as const).find((v) => v === asked) ?? "A-1";
  const challenge = challengeFrom(get("challenge"));
  const bundle = BUNDLE_ALIASES[get("bundle", "goal") ?? ""] ?? DEFAULT_BUNDLE;

  /* the sample answers stand in for whatever the link doesn't ask for */
  const linked = answersFromLink(get);
  const sample: Answers = { ...linked.answers, challenges: challenge ? [challenge] : linked.answers.challenges };

  /* switching variant is a request to see that variant's results: go there unless the link asks for a quiz step */
  const switched = previous !== null && previous !== variant;
  const asks = get("start", "at");
  const wanted = switched && (asks === null || asks === "home") ? "results" : asks;
  /* the loader is the last step, and where that is depends on the answers */
  const loadStep = (answers: Answers) => stepsFor(answers).length - 1;
  /* the quiz they last finished, if there is one; the sample answers otherwise */
  const saved = linked.set || get("bundle", "goal") ? null : savedAnswers();
  if (wanted === "results" || wanted === "result") {
    const answers = saved ?? { ...sample, goal: [bundle] };
    return { variant, entry: { step: loadStep(answers), answers, results: true } };
  }
  if (wanted === "email") {
    const answers = saved ?? (get("bundle", "goal") ? { ...sample, goal: [bundle] } : sample);
    return { variant, entry: { step: stepsFor(answers).indexOf("email"), answers, results: false } };
  }
  if (wanted === "loader" || wanted === "loading") {
    const answers = saved ?? (get("bundle", "goal") ? { ...sample, goal: [bundle] } : sample);
    return { variant, entry: { step: loadStep(answers), answers, results: false } };
  }
  if (wanted === "quiz") {
    /* ?step=3 opens mid-quiz with the sample answers filled in so the affirmations have content; the goal and
       allergy follow-ups only exist for some answers, so ?bundle and ?allergy set those for a link to them */
    const answers: Answers = {
      ...sample,
      goal: get("bundle", "goal") ? [bundle] : [],
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
