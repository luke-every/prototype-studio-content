export type BundleKey = "protein" | "portions" | "postpartum" | "better";

/** Three ways of sharing the answers out over the results hero and tags (see results/framing.ts) */
/** A and B are results pages */
export type ResultsVariant = "A" | "B" | "C" | "B-OLD";

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
  /** A picture in the emoji's place, for a rating like the chillies */
  image?: string;
};

export type Question = {
  id: QuestionId;
  type: "single" | "multi" | "slider";
  question: string;
  sub: string;
  /** Options appear in a random order (a closing "a bit of everything" style option stays last) */
  shuffle?: boolean;
  options: QuestionOption[];
};

/** Every question is a step of its own name, besides the intro, two affirmations, the break, the email and the loader */
export type StepKey = QuestionId | "intro" | "aff-goal" | "aff-chal" | "break" | "email" | "load";

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
