export type BundleKey = "protein" | "portions" | "postpartum" | "better";

/** Three ways of sharing the answers out over the results hero and tags (see results/framing.ts) */
/** A–D are results pages; H is the reference sheet of the old C and D heroes */
export type ResultsVariant = "A" | "B" | "C" | "D" | "E" | "H";

export type ChallengeId = "time" | "decide" | "balance" | "waste" | "cooking" | "budget";

export type QuestionId =
  | "goal"
  | "whyWeight"
  | "whyFitness"
  | "sat"
  | "challenges"
  | "week"
  | "household"
  | "spicy"
  | "cuisine"
  | "watch"
  | "allergy"
  | "allergyWhich";

/** Every answer is a list of option values; a slider or single choice holds one. */
export type Answers = Record<QuestionId, string[]>;

export type QuestionOption = {
  /** Stored in the answers */
  value: string;
  label: string;
  /** An emoji */
  icon: string;
  /** For a row of emojis: how many are shown at full strength, the rest fade (a rating, like three chillies) */
  lit?: number;
};

export type Question = {
  id: QuestionId;
  type: "single" | "multi" | "slider";
  question: string;
  sub: string;
  options: QuestionOption[];
};

/** Every question is a step of its own name, besides the intro, two affirmations, the break and the loader */
export type StepKey = QuestionId | "intro" | "aff-goal" | "aff-chal" | "break" | "load";

export type Affirmation = {
  image: string;
  headline: string;
  sub: string;
  note: string;
};

/** How a step's elements move: arriving, leaving, or held still under the loader */
export type StepMotion = "enter" | "opening" | "leave" | "still";

/** Where the quiz sheet opens: a step, the answers so far, and whether to skip straight to results */
export type QuizEntry = {
  step: number;
  answers: Answers;
  results: boolean;
};
