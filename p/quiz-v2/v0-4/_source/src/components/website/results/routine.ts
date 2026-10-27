import type { Goal, Meal } from "@/lib/recommendation";
import type { Answers } from "../quiz/types";

type Line = { meal: Meal; qty: number };

/**
 * One rule we applied for their goal. On the page: the rule, and the one fact that makes it matter.
 * In the full story: the reasoning in full, and a number from their own routine that shows the rule held.
 * The rules follow the goal criteria in lib/recommendation.ts, so they say what the engine actually did.
 */
export type Principle = {
  did: string;
  /** A's line for the rule: what's in the meals and what it does for you, so it answers the heading on its own */
  headline: string;
  /** A few words, for where the rule is only named */
  label: string;
  short: string;
  long: string;
  /** The row's marker, in the quiz's emoji style */
  icon: string;
  /** The evidence from their own meals: a number set large, and what it counts */
  stat: (lines: Line[]) => { value: string; label: string };
};

export type Routine = {
  /** Variant B's recommendation heading, fitted to the goal and its follow-up */
  recommendation: string;
  /** D's recommendation step heading: what the meals were picked to do, so it stands on its own as a screen */
  picked: string;
  /** The full story's eyebrow and opening paragraph */
  storyTitle: string;
  storyIntro: string;
  principles: Principle[];
};

const unitsOf = (lines: Line[]) => lines.reduce((n, line) => n + line.qty, 0);
const avg = (lines: Line[], key: "prot" | "fib" | "kcal") =>
  Math.round(lines.reduce((sum, line) => sum + line.meal[key] * line.qty, 0) / unitsOf(lines));
const count = (lines: Line[], test: (meal: Meal) => boolean) =>
  lines.reduce((n, line) => n + (test(line.meal) ? line.qty : 0), 0);
const cuisines = (lines: Line[]) => new Set(lines.map((line) => line.meal.cuis)).size;
const inRange = (m: Meal) => m.kcal >= 400 && m.kcal <= 600;

// TODO(lift): replace with translation keys
const avgFibre = (lines: Line[]) => ({ value: `${avg(lines, "fib")} g`, label: "fibre per meal, on average" });
const avgProtein = (lines: Line[]) => ({ value: `${avg(lines, "prot")} g`, label: "protein per meal, on average" });
const inRangeStat = (lines: Line[]) => ({ value: `${count(lines, inRange)} of ${unitsOf(lines)}`, label: "meals between 400 and 600 kcal" });

// TODO(lift): sample data — every fact needs a nutritionist's sign-off and a cited source before it ships; copy is a first draft
const ROUTINES: Record<Goal, Omit<Routine, "recommendation" | "picked">> = {
  gut: {
    storyTitle: "The science behind your routine",
    storyIntro:
      "Your gut is home to trillions of bacteria, and what you eat decides which ones thrive. The research points to three things that matter most, and we used each of them to choose your meals.",
    principles: [
      {
        did: "Prioritised meals with 12 g+ fibre",
        headline: "12 g+ fibre to feed your gut bacteria",
        label: "12 g+ fibre",
        short: "Gut bacteria ferment fibre into short-chain fatty acids, which fuel the cells lining your gut.",
        long: "Fibre passes through your stomach undigested and is fermented by bacteria in your large intestine. That produces short-chain fatty acids such as butyrate, the main fuel for the cells lining your colon. Most adults eat around 20 g of fibre a day, short of the 25–30 g recommended.",
        icon: "🌾",
        stat: avgFibre,
      },
      {
        did: "Spread your routine across different plants",
        headline: "A wide mix of plants for a more diverse gut",
        label: "Plant variety",
        short: "People who eat 30+ different plants a week have a more diverse gut microbiome.",
        long: "Each type of plant feeds different bacteria. In the American Gut Project, people eating more than 30 different plants a week had a more diverse microbiome than those eating 10 or fewer. Every meal is plant-based, and we spread your routine across dishes and cuisines.",
        icon: "🥦",
        stat: (lines) => ({ value: `${lines.length}`, label: `different dishes, from ${cuisines(lines)} cuisines` }),
      },
      {
        did: "Prioritised meals of 400–600 kcal",
        headline: "400–600 kcal meals that are easier to digest",
        label: "400–600 kcal",
        short: "Very large meals slow digestion and are a common trigger for bloating.",
        long: "Your gut handles moderate, regular meals more comfortably than large ones, which take longer to digest and are a common cause of bloating. We kept your meals in a range that makes a full main meal without overloading it.",
        icon: "⚖️",
        stat: inRangeStat,
      },
    ],
  },
  fitness: {
    storyTitle: "The science behind your routine",
    storyIntro:
      "Training breaks muscle down; protein is what rebuilds it. How much you eat, and how you spread it across the day, decide how well that works. We used both to choose your meals.",
    principles: [
      {
        did: "Prioritised meals with 25 g+ protein",
        headline: "25 g+ protein to repair your muscles",
        label: "25 g+ protein",
        short: "Muscle repair needs around 1.6 g of protein per kg a day, double the standard recommendation.",
        long: "The everyday recommendation is 0.8 g of protein per kg of body weight. Studies on people who train put the benefit for muscle at around 1.6 g per kg, about 110 g a day for someone weighing 70 kg. We ranked meals with 25 g or more highest.",
        icon: "💪",
        stat: avgProtein,
      },
      {
        did: "Aimed each meal at 20–40 g protein",
        headline: "20–40 g protein a meal, the amount muscle uses best",
        label: "20–40 g per meal",
        short: "Your body builds muscle best from 20–40 g at a time, not one large serving.",
        long: "Muscle protein synthesis responds to each meal, and it peaks at around 20–40 g of protein. Spreading protein over three or four meals works better than eating most of it at once. One meal from your routine is one of those servings.",
        icon: "🍽️",
        stat: (lines) => ({ value: `${count(lines, (m) => m.prot >= 20)} of ${unitsOf(lines)}`, label: "meals with 20 g of protein or more" }),
      },
      {
        did: "Prioritised meals with 8 g+ fibre",
        headline: "8 g+ fibre for steadier energy around training",
        label: "8 g+ fibre",
        short: "Fibre slows how fast carbohydrates are absorbed, for steadier energy around training.",
        long: "Fibre slows the absorption of carbohydrates, so blood sugar rises and falls more gently. That means steadier energy between sessions and fewer crashes. We ranked meals with 8 g or more highest.",
        icon: "🌾",
        stat: avgFibre,
      },
    ],
  },
  lose: {
    storyTitle: "The science behind your routine",
    storyIntro:
      "Losing weight comes down to eating a little less energy than you use, consistently. The hard part is doing that without feeling hungry. We chose your meals for both.",
    principles: [
      {
        did: "Prioritised meals under 520 kcal",
        headline: "Meals under 520 kcal, so portions are never a guess",
        label: "Under 520 kcal",
        short: "Most people underestimate how much they eat. A fixed portion removes the guess.",
        long: "Studies consistently find that people underestimate how much they eat, often by a wide margin. A pre-portioned meal with the calories on the label makes the amount certain. We ranked meals under 520 kcal highest.",
        icon: "🥣",
        stat: (lines) => ({ value: `${avg(lines, "kcal")}`, label: "kcal per meal, on average" }),
      },
      {
        did: "Prioritised 20 g+ protein and 8 g+ fibre",
        headline: "20 g+ protein and 8 g+ fibre to keep you full",
        label: "Protein + fibre",
        short: "Protein is the most filling nutrient, and fibre slows digestion, so hunger returns later.",
        long: "Gram for gram, protein keeps you fuller than carbohydrate or fat, and your body uses more energy digesting it. Fibre slows how quickly your stomach empties. Together they keep hunger down between meals.",
        icon: "🫘",
        stat: (lines) => ({ value: `${avg(lines, "prot")} g`, label: `protein per meal, with ${avg(lines, "fib")} g fibre` }),
      },
      {
        did: "Kept every meal plant-based",
        headline: "Plant-based meals that fill the plate for fewer calories",
        label: "Plant-based",
        short: "Vegetables, legumes and grains give more volume per calorie, so a lighter meal still fills the plate.",
        long: "Plant foods are high in water and fibre, which gives them a low energy density: more food for the same calories. That’s why a meal under 520 kcal can still be a full plate.",
        icon: "🥦",
        stat: () => ({ value: "100%", label: "plant-based, every meal" }),
      },
    ],
  },
  baby: {
    storyTitle: "The science behind your routine",
    storyIntro:
      "After birth, and especially while breastfeeding, your body needs more energy and protein than usual, at exactly the time when cooking is hardest. We chose your meals for that.",
    principles: [
      {
        did: "Prioritised meals with 20 g+ protein",
        headline: "20 g+ protein to help you recover",
        label: "20 g+ protein",
        short: "Breastfeeding raises protein needs by around 20 g a day.",
        long: "Your body uses protein to recover after birth, and producing milk raises your daily needs by around 20 g. We ranked meals with 20 g or more highest, so one meal covers that extra.",
        icon: "💪",
        stat: avgProtein,
      },
      {
        did: "Prioritised meals with 12 g+ fibre",
        headline: "12 g+ fibre to keep digestion regular",
        label: "12 g+ fibre",
        short: "Constipation is common after birth, and fibre is the first recommendation for it.",
        long: "Hormones, iron supplements and less sleep all slow digestion after birth. Midwives’ first advice is more fibre and fluids. We ranked meals with 12 g or more highest.",
        icon: "🌾",
        stat: avgFibre,
      },
      {
        did: "Made every meal ready in 10 minutes",
        headline: "Ready in 10 minutes, so you never skip a meal",
        label: "Ready in 10 min",
        short: "Breastfeeding uses around 500 extra kcal a day, so regular meals matter more than ever.",
        long: "Making milk uses around 500 kcal a day on top of your usual needs. Skipping meals makes that hard to cover, so every meal is ready in 10 minutes, with nothing to plan or prep.",
        icon: "⏱️",
        stat: () => ({ value: "10 min", label: "from freezer to table, every meal" }),
      },
    ],
  },
  easy: {
    storyTitle: "The science behind your routine",
    storyIntro:
      "A balanced meal has enough protein, slow carbohydrates and fibre, in the right amount. We set a rule for each one and used them to choose your meals.",
    principles: [
      {
        did: "Prioritised 15 g+ protein with 45–80 g carbs",
        headline: "15 g+ protein with slow carbs for steady energy",
        label: "Balanced macros",
        short: "Protein eaten with carbohydrates slows the rise in blood sugar, for steadier energy.",
        long: "Carbohydrates on their own raise blood sugar quickly, then let it drop. Eating them with protein slows that down, which keeps your energy steadier through the afternoon. We looked for both in every meal.",
        icon: "🍽️",
        stat: (lines) => ({
          value: `${count(lines, (m) => m.prot >= 15 && m.carb >= 45 && m.carb <= 80)} of ${unitsOf(lines)}`,
          label: "meals with that balance",
        }),
      },
      {
        did: "Prioritised meals with 8 g+ fibre",
        headline: "8 g+ fibre, the nutrient most adults lack",
        label: "8 g+ fibre",
        short: "Most adults eat around 20 g of fibre a day, short of the 30 g recommended.",
        long: "Fibre is the nutrient most adults fall shortest on. Eating more of it is linked to better heart and gut health. We ranked meals with 8 g or more highest.",
        icon: "🌾",
        stat: avgFibre,
      },
      {
        did: "Prioritised meals of 400–600 kcal",
        headline: "400–600 kcal, the size of a balanced main meal",
        label: "400–600 kcal",
        short: "That’s a quarter to a third of most adults’ daily energy, the size of a balanced main meal.",
        long: "Most adults need around 2,000 kcal a day. A main meal of 400–600 kcal leaves room for breakfast and snacks without over- or under-eating.",
        icon: "⚖️",
        stat: inRangeStat,
      },
    ],
  },
};

// TODO(lift): sample data — copy is a first draft
/** Variant B's recommendation heading: one per goal, and one per follow-up answer where the goal has one */
/* plain and about their body, like a result rather than a slogan: "What your body needs to …" */
const RECOMMENDATION: Record<Goal, string> = {
  gut: "What your gut needs to thrive",
  fitness: "What your body needs to train well",
  lose: "What your body needs to lose weight steadily",
  baby: "What your body needs after birth",
  easy: "What your body needs to feel its best",
};
/** The fitness follow-ups each change what the training is for; the weight ones don't change what it takes */
const RECOMMENDATION_BY_DRIVER: Record<string, string> = {
  muscle: "What your body needs to build muscle",
  lean: "What your body needs to stay lean",
  energy: "What your body needs for steady energy",
  full: "What your body needs to stay full for longer",
  meatless: "What your body needs from plant protein",
};

// TODO(lift): sample data — copy is a first draft
/** What the meals were picked to do, finishing "We picked your meals to …"; one per goal, and per fitness follow-up */
const PICKED_FOR: Record<Goal, string> = {
  gut: "help your gut thrive",
  fitness: "fuel your training",
  lose: "help you lose weight steadily",
  baby: "support you after birth",
  easy: "help you feel your best",
};
const PICKED_FOR_DRIVER: Record<string, string> = {
  muscle: "help you build muscle",
  lean: "help you stay lean",
  energy: "keep your energy steady",
  full: "keep you full for longer",
  meatless: "get you enough protein without meat",
};

/** The routine for their goal and, for fitness, its follow-up; "stay full" leads with fibre */
export function routineFor(goal: Goal, answers: Answers): Routine {
  const routine = ROUTINES[goal];
  const driver = goal === "fitness" ? (answers.whyFitness[0] ?? "") : "";
  const recommendation = RECOMMENDATION_BY_DRIVER[driver] ?? RECOMMENDATION[goal];
  // TODO(lift): replace with translation key
  const picked = `We picked your meals to ${PICKED_FOR_DRIVER[driver] ?? PICKED_FOR[goal]}`;
  const principles = driver === "full" ? [routine.principles[2], ...routine.principles.slice(0, 2)] : routine.principles;
  return { ...routine, recommendation, picked, principles };
}
