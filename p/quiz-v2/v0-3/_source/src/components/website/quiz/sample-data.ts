import type { Affirmation, Answers, ChallengeId, Question, StepKey } from "./types";

const PICK_MANY = "Pick as many as you like";

// TODO(lift): sample data — replace with the quiz definition from the CMS
export const QUESTIONS: Question[] = [
  {
    id: "goal",
    type: "single",
    question: "What’s your goal right now?",
    sub: "",
    options: [
      { value: "protein", label: "Nutrition for fitness", icon: "img/ProteinIcon.png" },
      { value: "portions", label: "Eat lighter to lose weight", icon: "img/LighterIcon.png" },
      { value: "postpartum", label: "Eat well as a new parent", icon: "img/BabyIcon.png" },
      { value: "better", label: "Eat a more balanced diet", icon: "img/EatWellIcon.png" },
      // TODO(lift): fake image — reuses the balanced-diet icon until gut health has its own
      { value: "gut", label: "Improve my gut health", icon: "img/EatWellIcon.png" },
    ],
  },
  {
    id: "whyWeight",
    type: "single",
    question: "What’s driving your focus on weight right now?",
    sub: "",
    options: [
      { value: "energy", label: "I want to feel lighter and have more energy", icon: "" },
      { value: "doctor", label: "My doctor or a health professional has recommended it", icon: "" },
      { value: "regain", label: "I’ve put on weight recently and want to get back on track", icon: "" },
      { value: "maintain", label: "I want to maintain my weight & feel more comfortable in my body", icon: "" },
    ],
  },
  {
    id: "whyFitness",
    type: "single",
    question: "What’s driving your focus on fitness right now?",
    sub: "",
    options: [
      { value: "muscle", label: "Build more muscle", icon: "" },
      { value: "lean", label: "Stay lean & healthy", icon: "" },
      { value: "energy", label: "More energy overall", icon: "" },
      { value: "full", label: "Stay full for longer", icon: "" },
      { value: "meatless", label: "Enough protein without meat", icon: "" },
    ],
  },
  {
    id: "sat",
    type: "slider",
    question: "How satisfied are you with the way you eat?",
    sub: "",
    options: [],
  },
  {
    id: "challenges",
    type: "multi",
    question: "What gets in the way of eating well?",
    sub: "Pick as many as you like",
    options: [
      { value: "time", label: "Finding time to cook", icon: "⏱️" },
      { value: "decide", label: "Deciding what to eat", icon: "🤔" },
      { value: "balance", label: "Eating a balanced diet", icon: "⚖️" },
      { value: "waste", label: "Wasting food", icon: "🗑️" },
      { value: "cooking", label: "Cooking isn’t my thing", icon: "🍳" },
      { value: "budget", label: "Eating well on a budget", icon: "💶" },
    ],
  },
  {
    id: "week",
    type: "multi",
    question: "What does a typical week look like for you?",
    sub: "Pick as many as you like",
    options: [
      { value: "work", label: "Busy days at work", icon: "💼" },
      { value: "family", label: "Time with family", icon: "👨‍👩‍👧" },
      { value: "training", label: "Sport a few times a week", icon: "🏃‍♀️" },
      { value: "friends", label: "Out with friends a lot", icon: "🥂" },
      { value: "everything", label: "A bit of everything", icon: "🎲" },
    ],
  },
  {
    id: "household",
    type: "single",
    question: "Who are you eating with?",
    sub: "",
    options: [
      { value: "alone", label: "Just me", icon: "img/Justme.png" },
      { value: "partner", label: "My partner", icon: "img/MePartner.png" },
      { value: "family", label: "My family", icon: "img/Family.png" },
      { value: "roommates", label: "My housemates", icon: "img/roommates.png" },
    ],
  },
  {
    id: "spicy",
    type: "single",
    question: "Do you like spicy food?",
    sub: "",
    options: [
      { value: "very", label: "Yes, very spicy is great", icon: "" },
      { value: "medium", label: "Yes, medium spicy is ok", icon: "" },
      { value: "can", label: "I can eat it, but can’t say it’s my favorite", icon: "" },
      { value: "no", label: "Not really", icon: "" },
    ],
  },
  {
    id: "cuisine",
    type: "multi",
    question: "Any favorite cuisine?",
    sub: PICK_MANY,
    options: [
      { value: "asian", label: "Asian (Thai, Japanese, Korean etc.)", icon: "" },
      { value: "indian", label: "Indian", icon: "" },
      { value: "italian", label: "Italian", icon: "" },
      { value: "german", label: "German", icon: "" },
      { value: "latin", label: "Latin", icon: "" },
    ],
  },
  {
    id: "watch",
    type: "multi",
    question: "What do you look for in your food?",
    sub: "Pick as many as you like",
    options: [
      { value: "protein", label: "More protein", icon: "🧬" },
      { value: "fibre", label: "More fibre", icon: "🫙" },
      { value: "portions", label: "Right-sized portions", icon: "🍜" },
      { value: "sugar", label: "Less sugar", icon: "🍬" },
      { value: "diabetes", label: "Diabetes friendly food", icon: "🌟" },
      { value: "plants", label: "More plant-based", icon: "🥬" },
      { value: "nothing", label: "Nothing specific", icon: "🎲" },
    ],
  },
  {
    id: "allergy",
    type: "single",
    question: "Do you have any allergies?",
    sub: "",
    options: [
      { value: "yes", label: "Yes", icon: "" },
      { value: "no", label: "No", icon: "" },
      { value: "unsure", label: "Not sure", icon: "" },
    ],
  },
  {
    id: "allergyWhich",
    type: "multi",
    question: "Are you allergic to any of these?",
    sub: PICK_MANY,
    options: [
      { value: "gluten", label: "Gluten", icon: "" },
      { value: "soy", label: "Soy", icon: "" },
      { value: "mustard", label: "Mustard", icon: "" },
      { value: "nuts", label: "Tree nuts", icon: "" },
      { value: "sesame", label: "Sesame", icon: "" },
      { value: "celery", label: "Celery", icon: "" },
      { value: "other", label: "Other", icon: "" },
    ],
  },
];

/** The goal answers that are followed by a question about what drives them */
const WHY_STEP: Record<string, StepKey> = { portions: "whyWeight", protein: "whyFitness" };

/** The quiz in order for these answers: the goal and the allergy each open a follow-up question of their own. */
export function stepsFor(answers: Answers): StepKey[] {
  const why = WHY_STEP[answers.goal[0]];
  return [
    "intro",
    "goal",
    ...(why ? [why] : []),
    "aff-goal",
    "sat",
    "challenges",
    "aff-chal",
    "week",
    "household",
    "break",
    "spicy",
    "cuisine",
    "watch",
    "allergy",
    ...(answers.allergy[0] === "yes" ? (["allergyWhich"] as const) : []),
    "load",
  ];
}

// TODO(lift): sample data — replace with translation keys
/** The quiz's two parts and the box they lead to, listed on the intro and again at the break */
export const SECTIONS: { title: string; sub: string }[] = [
  { title: "About you", sub: "Your goals, and what your week really looks like." },
  { title: "Your food", sub: "The flavours you love, and anything to leave out." },
  { title: "Your box", sub: "Meals picked for you, ready to order." },
];

/** How full each part's progress segment is, 0 to 1: about you runs up to the break, your food from it to the loader */
export function sectionProgress(steps: StepKey[], index: number): [number, number] {
  const breakAt = steps.indexOf("break");
  const last = steps.length - 1;
  return [Math.min(1, index / breakAt), Math.max(0, (index - breakAt) / (last - breakAt))];
}

/** One entry per point on the slider, so every one of the five has a label and a face. */
export const SATISFACTION: { face: string; label: string }[] = [
  { face: "😟", label: "Not satisfied" },
  { face: "🤔", label: "Could be better" },
  { face: "😅", label: "Somewhat satisfied" },
  { face: "☺️", label: "Mostly satisfied" },
  { face: "🤩", label: "Very satisfied" },
];

/** Before the knob is touched the face is a neutral one of its own, held after the five. */
export const SATISFACTION_BLANK = "\u{1F636}";

export const SLIDER_POINTS = 5;
export const SLIDER_KNOB_PX = 48;
export const AUTO_ADVANCE_MS = 300;

// TODO(lift): sample data — replace with the affirmation copy from the CMS
/** After the goal, the same for everyone. */
export const AFFIRMATION_GOAL: Affirmation = {
  image: "img/usp-didyouknow.jpg",
  headline: "80% of Every customers noticed positive lifestyle changes after 3 months",
  sub: "",
  note: "*Self-reported experiences from participants in our 3-month plan consuming every 5x/week.",
};

// TODO(lift): sample data — replace with the affirmation copy from the CMS
// TODO(lift): fake image — dish photos stand in until each goal has its own
/**
 * After the goal follow-up, for the goals that have something specific to say; the rest get
 * AFFIRMATION_GOAL. Facts only, from the menu data: the most protein in one meal is 36.5 g; 34 of 47 are under 520 kcal.
 */
export const AFFIRMATION_BY_GOAL: Partial<Record<string, Affirmation>> = {
  protein: {
    image: "img/stack1.jpg",
    headline: "Enough protein, every day. No maths, no shakes.",
    sub: "Our protein-rich meals have up to 36 g each, all of it from plants.",
    note: "",
  },
  portions: {
    image: "img/chal-balance.jpg",
    headline: "Every meal is pre-portioned, so there's nothing to count or weigh.",
    sub: "Most of our meals are under 520 kcal, with the nutrition on every label.",
    note: "",
  },
};

// TODO(lift): sample data — replace with the affirmation copy from the CMS
/** After the challenges, keyed by the challenge picked first. */
export const AFFIRMATION_CHALLENGE: Record<ChallengeId, Affirmation> = {
  time: {
    image: "img/chal-time.jpg",
    headline: "All of our meals are ready in 10 minutes",
    sub: "Heat, eat, done. Pick your meals and skip the prep.",
    note: "",
  },
  decide: {
    image: "img/chal-decide.jpg",
    headline: "All the planning is done for you",
    sub: "Choose from the menu and we’ll take care of the rest.",
    note: "",
  },
  balance: {
    image: "img/chal-balance.jpg",
    headline: "Every meal is pre-portioned and balanced.",
    sub: "Chef-crafted and nutritionist-designed, so balance is built in.",
    note: "",
  },
  waste: {
    image: "img/chal-waste.jpg",
    headline: "Meals are delivered to your door",
    sub: "Shock-frozen and portioned, so nothing goes off in the fridge.",
    note: "",
  },
  cooking: {
    image: "img/chal-cooking.jpg",
    headline: "All cooking is done for you, by us.",
    sub: "Crafted by chefs and ready in minutes. No chopping, no pans.",
    note: "",
  },
  budget: {
    image: "img/chal-budget.jpg",
    headline: "From €5,43 per meal",
    sub: "Wholefood meals, chef-crafted, without the takeaway price tag.",
    note: "",
  },
};

// TODO(lift): sample data — replace with the loader copy from the CMS
export const LOAD_LINES: string[] = [
  "Understanding what matters to you",
  "Getting to know your week",
  "Taking your challenges into account",
  "Finding what fits you best",
];

/** When each loader line arrives (ms). Each ticks 740ms later. Re-space by hand if LOAD_LINES changes. */
export const LOAD_STARTS: number[] = [620, 1400, 2180, 2960];
export const LOAD_TICK_AFTER_MS = 740;
/** How long the work itself is shown before the handover to the results */
export const LOAD_MS = 4000;
/** The results are built behind the opaque loader at this point */
export const LOAD_BUILD_MS = 750;
export const LOAD_PHASE_IN_MS = 320;

export const EMPTY_ANSWERS: Answers = {
  goal: [],
  whyWeight: [],
  whyFitness: [],
  sat: [],
  challenges: [],
  week: [],
  household: [],
  spicy: [],
  cuisine: [],
  watch: [],
  allergy: [],
  allergyWhich: [],
};

// TODO(lift): fake — a filled-in quiz for ?start=loader and ?start=results, so the results have answers to read back
export const SAMPLE_ANSWERS: Answers = {
  ...EMPTY_ANSWERS,
  whyFitness: ["muscle"],
  sat: ["3"],
  challenges: ["time", "decide"],
  week: ["work"],
  household: ["partner"],
  spicy: ["medium"],
  cuisine: ["italian"],
  watch: ["fibre", "sugar"],
  allergy: ["no"],
};

// TODO(lift): fake — the loader paces itself to look like work; production waits on the real match
/**
 * Nothing moves on by itself in the testing build, so a "Continue to my result" button appears at
 * LOAD_MS and the handover waits for a tap. The HTML prototype this was ported from hands over by
 * itself at LOAD_MS, so that is the default here.
 */
export const LOAD_WAITS_FOR_TAP = false;

/** Handover timings, in ms from the moment the loader hands over to the results */
export const HANDOVER_CLEAR_MS = 0;
export const HANDOVER_REVEAL_MS = 150;
export const HANDOVER_DONE_MS = 1500;
/** Each element of the results hero is revealed this much after the one before it */
export const REVEAL_STAGGER_MS = 45;

/**
 * Every image the quiz can show, fetched as soon as the sheet opens so no step waits on one: the
 * option icons, every affirmation (whichever goal and challenge get picked), the intro and the loader.
 */
export const QUIZ_IMAGES: string[] = [
  "img/introImage.png",
  "img/EveBase.svg",
  "img/EveHeart.svg",
  AFFIRMATION_GOAL.image,
  ...Object.values(AFFIRMATION_BY_GOAL).flatMap((affirmation) => (affirmation ? [affirmation.image] : [])),
  ...Object.values(AFFIRMATION_CHALLENGE).map((affirmation) => affirmation.image),
  ...QUESTIONS.flatMap((question) => question.options.map((option) => option.icon).filter((icon) => icon.startsWith("img/"))),
];
