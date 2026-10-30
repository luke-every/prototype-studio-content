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
  /** A's second page: the rule as a title, with no numbers in it */
  title: string;
  /** A few words, for where the rule is only named */
  label: string;
  short: string;
  long: string;
  /** The facts sheet: the reasoning and evidence the card only names, without repeating it */
  why: string;
  /** The facts sheet: how the rule shows up when they eat, in a line */
  inPlan: string;
  /** The facts sheet: where the evidence comes from, where we have named it */
  source?: string;
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
  /** What the meals do for them, as the end of a sentence: "Designed by chefs to …" */
  to: string;
  /** The full story's eyebrow and opening paragraph */
  storyTitle: string;
  storyIntro: string;
  principles: Principle[];
};

const unitsOf = (lines: Line[]) => lines.reduce((n, line) => n + line.qty, 0);
const avg = (lines: Line[], key: "prot" | "fib" | "kcal") =>
  Math.round(
    lines.reduce((sum, line) => sum + line.meal[key] * line.qty, 0) /
      unitsOf(lines),
  );
const count = (lines: Line[], test: (meal: Meal) => boolean) =>
  lines.reduce((n, line) => n + (test(line.meal) ? line.qty : 0), 0);
const cuisines = (lines: Line[]) =>
  new Set(lines.map((line) => line.meal.cuis)).size;
const inRange = (m: Meal) => m.kcal >= 400 && m.kcal <= 600;

// TODO(lift): replace with translation keys
const avgFibre = (lines: Line[]) => ({
  value: `${avg(lines, "fib")} g`,
  label: "fibre per meal, on average",
});
const avgProtein = (lines: Line[]) => ({
  value: `${avg(lines, "prot")} g`,
  label: "protein per meal, on average",
});
const inRangeStat = (lines: Line[]) => ({
  value: `${count(lines, inRange)} of ${unitsOf(lines)}`,
  label: "meals between 400 and 600 kcal",
});

// TODO(lift): sample data — every fact needs a nutritionist's sign-off and a cited source before it ships; copy is a first draft
const ROUTINES: Record<
  Goal,
  Omit<Routine, "recommendation" | "picked" | "to">
> = {
  gut: {
    storyTitle: "The science behind your routine",
    storyIntro:
      "Your gut is home to trillions of bacteria, and what you eat decides which ones thrive. The research points to three things that matter most.",
    principles: [
      {
        did: "Prioritised meals with 12 g+ fibre",
        headline: "12 g+ fibre to feed your gut bacteria",
        title:
          "Prioritised meals with plenty of fibre to feed your gut bacteria",
        label: "12 g+ fibre",
        short:
          "Gut bacteria ferment fibre into short-chain fatty acids, which fuel the cells lining your gut.",
        long: "Fibre passes through your stomach undigested and is fermented by bacteria in your large intestine. That produces short-chain fatty acids such as butyrate, the main fuel for the cells lining your colon. Most adults eat around 20 g of fibre a day, short of the 25–30 g recommended.",
        icon: "🌾",
        why: "Most adults eat around 20 g of fibre a day, short of the 25–30 g recommended, which leaves your gut bacteria underfed. Butyrate, one of the fatty acids they make from fibre, is the main fuel for the cells lining your colon.",
        inPlan:
          "Each meal brings 12 g or more, so a couple of meals a day gets you most of the way.",
        stat: avgFibre,
      },
      {
        did: "Spread your routine across different plants",
        headline: "30+ different plants a week for a diverse gut",
        title: "Mixed in plenty of different plants for a diverse gut",
        label: "Plant variety",
        short:
          "Each plant feeds different bacteria, and people who eat 30+ a week have a more diverse gut microbiome.",
        long: "Each type of plant feeds different bacteria. In the American Gut Project, people eating more than 30 different plants a week had a more diverse microbiome than those eating 10 or fewer. Eating a wide mix of plants is one of the simplest ways to feed a more varied gut.",
        icon: "🥦",
        why: "Each type of plant feeds different bacteria. In the American Gut Project, people eating more than 30 different plants a week had a more diverse microbiome than those eating 10 or fewer. Wholegrains, legumes, nuts and herbs count as well as vegetables.",
        inPlan:
          "Your meals draw on a wide mix of vegetables, grains and legumes, so the variety builds up without you planning it.",
        source: "American Gut Project",
        stat: (lines) => ({
          value: `${lines.length}`,
          label: `different dishes, from ${cuisines(lines)} cuisines`,
        }),
      },
      {
        did: "Prioritised meals of 400–600 kcal",
        headline: "400–600 kcal meals that are easy to digest",
        title: "Kept meals moderate so they’re easy to digest",
        label: "400–600 kcal",
        short:
          "Very large meals slow digestion and are a common trigger for bloating.",
        long: "Your gut handles moderate, regular meals more comfortably than large ones, which take longer to digest and are a common cause of bloating. A moderate main meal is enough to feel full without overloading your digestion.",
        icon: "⚖️",
        why: "Very large meals take longer to leave your stomach and are a common trigger for bloating. Moderate, regular meals are easier on digestion, and a main meal in this range is still enough to leave you full.",
        inPlan:
          "Every meal sits between 400 and 600 kcal, so none of them overloads you.",
        stat: inRangeStat,
      },
    ],
  },
  fitness: {
    storyTitle: "The science behind your routine",
    storyIntro:
      "Training breaks muscle down; protein is what rebuilds it. How much you eat, and how you spread it across the day, decide how well that works.",
    principles: [
      {
        did: "Prioritised meals with 20 g+ protein",
        headline: "20 g+ protein to repair your muscles",
        title: "Prioritised meals with 20 g+ protein to repair your muscles",
        label: "20 g+ protein",
        short:
          "Muscle repair needs double the standard recommendation, ~1.6 g of protein per kg.",
        long: "The everyday recommendation is 0.8 g of protein per kg of body weight. Studies on people who train put the benefit for muscle at around 1.6 g per kg, about 110 g a day for someone weighing 70 kg. A single meal with 20 g or more is a big step towards that.",
        icon: "💪",
        why: "The everyday recommendation is 0.8 g of protein per kg of body weight. Studies on people who train put the benefit for muscle at around 1.6 g per kg, about 110 g a day at 70 kg.",
        inPlan:
          "Each meal has 20 g or more, which takes you a long way towards that without tracking anything.",
        stat: avgProtein,
      },
      {
        did: "Aimed each meal at 20–40 g protein",
        headline: "Protein spread over every meal",
        title: "Spread protein across every meal, not just one",
        label: "20–40 g per meal",
        short:
          "Your body builds muscle best from 20–40 g at a time, not one large serving.",
        long: "Muscle protein synthesis responds to each meal, and it peaks at around 20–40 g of protein. Spreading protein over three or four meals works better than eating most of it at once. Each meal is one of those servings.",
        icon: "🍽️",
        why: "Muscle protein synthesis responds to each meal and peaks at around 20–40 g of protein. Eating most of your protein in one go works less well than spreading it over three or four meals.",
        inPlan:
          "Every meal is one of those servings, so your protein is spread across the day without any planning.",
        stat: (lines) => ({
          value: `${count(lines, (m) => m.prot >= 20)} of ${unitsOf(lines)}`,
          label: "meals with 20 g of protein or more",
        }),
      },
      {
        did: "Prioritised meals with 8 g+ fibre",
        headline: "8 g+ fibre for steadier energy",
        title: "Packed in enough fibre for steadier energy between sessions",
        label: "8 g+ fibre",
        short:
          "Fibre slows how fast carbohydrates are absorbed, for steadier energy.",
        long: "Fibre slows the absorption of carbohydrates, so blood sugar rises and falls more gently. That means steadier energy between sessions and fewer crashes. A meal with 8 g or more is a good start on the 25–30 g recommended each day.",
        icon: "🌾",
        why: "Most adults eat well under the 25–30 g of fibre a day that’s recommended. Because fibre slows how fast carbohydrates are absorbed, blood sugar rises and falls more gently, with fewer crashes between sessions.",
        inPlan:
          "Each meal has 8 g or more, so the daily amount builds up across the day.",
        stat: avgFibre,
      },
    ],
  },
  lose: {
    storyTitle: "The science behind your routine",
    storyIntro:
      "Losing weight comes down to eating a little less energy than you use, consistently. The hard part is doing that without feeling hungry.",
    principles: [
      {
        did: "Prioritised meals under 520 kcal",
        headline: "Under 520 kcal a meal for a steady deficit",
        title: "Chose portioned meals, so you can eat lighter without counting",
        label: "Under 520 kcal",
        short:
          "Losing weight comes down to eating a little less than you use, consistently. A set portion takes out the guesswork.",
        long: "Studies consistently find that people underestimate how much they eat, often by a wide margin. A pre-portioned meal with the calories on the label makes the amount certain. Meals under 520 kcal make a steady, lower-energy day easier to hold.",
        icon: "🥣",
        why: "Studies consistently find that people underestimate how much they eat, often by a wide margin. That’s why it’s hard to judge by eye: losing weight comes down to a small, steady gap between what you eat and what you use.",
        inPlan:
          "Every meal is portioned and labelled under 520 kcal, so you know the amount without weighing anything.",
        stat: (lines) => ({
          value: `${avg(lines, "kcal")}`,
          label: "kcal per meal, on average",
        }),
      },
      {
        did: "Prioritised 20 g+ protein and 8 g+ fibre",
        headline: "20 g+ protein and 8 g+ fibre so hunger stays away",
        title: "Paired protein with fibre so hunger stays away",
        label: "Protein + fibre",
        short:
          "Protein is the most filling nutrient, and fibre slows digestion, so hunger returns later.",
        long: "Gram for gram, protein keeps you fuller than carbohydrate or fat, and your body uses more energy digesting it. Fibre slows how quickly your stomach empties. Together they keep hunger down between meals.",
        icon: "🫘",
        why: "Gram for gram, protein keeps you fuller than carbohydrate or fat, and your body uses more energy digesting it. Fibre slows how quickly your stomach empties. Together they matter most when you’re eating less, because that’s when hunger shows up.",
        inPlan:
          "Every meal has 20 g or more of protein and 8 g or more of fibre, so hunger comes back later.",
        stat: (lines) => ({
          value: `${avg(lines, "prot")} g`,
          label: `protein per meal, with ${avg(lines, "fib")} g fibre`,
        }),
      },
      {
        did: "Kept every meal plant-based",
        headline: "Plant-based meals, more food for fewer calories",
        title: "Went plant-based for more food on fewer calories",
        label: "Plant-based",
        short:
          "Vegetables, legumes and grains give more volume per calorie, so a lighter meal still fills the plate.",
        long: "Plant foods are high in water and fibre, which gives them a low energy density: more food for the same calories. That’s why a meal under 520 kcal can still be a full plate.",
        icon: "🥦",
        why: "Plant foods are high in water and fibre, which gives them a low energy density: more food for the same calories.",
        inPlan:
          "Your meals are all plant-based, so a meal under 520 kcal is still a full plate.",
        stat: () => ({ value: "100%", label: "plant-based, every meal" }),
      },
    ],
  },
  baby: {
    storyTitle: "The science behind your routine",
    storyIntro:
      "After birth, and especially while breastfeeding, your body needs more energy and protein than usual, at exactly the time when cooking is hardest.",
    principles: [
      {
        did: "Prioritised meals with 20 g+ protein",
        headline: "20 g+ protein to support your recovery",
        title: "Prioritised meals with 20 g+ protein to support your recovery",
        label: "20 g+ protein",
        short:
          "Your body uses protein to recover after birth, and breastfeeding raises your daily needs by around 20 g.",
        long: "Your body uses protein to recover after birth, and milk production raises your daily needs by around 20 g. A meal with 20 g or more covers that extra in one sitting.",
        icon: "💪",
        why: "Your body uses protein to repair itself after birth, and milk production raises your daily needs by around 20 g.",
        inPlan:
          "Each meal has 20 g or more, so that extra is covered in a single sitting.",
        stat: avgProtein,
      },
      {
        did: "Prioritised meals with 12 g+ fibre",
        headline: "12 g+ fibre to keep digestion regular",
        title: "Added fibre to keep digestion regular",
        label: "12 g+ fibre",
        short:
          "Constipation is common after birth, and fibre is the first recommendation for it.",
        long: "Hormones, iron supplements and less sleep all slow digestion after birth. Midwives’ first advice is more fibre and fluids. A meal with 12 g or more makes a real difference.",
        icon: "🌾",
        why: "Hormones and iron supplements both slow digestion after birth, which is why constipation is so common. Midwives’ first advice is more fibre and fluids.",
        inPlan:
          "Each meal has 12 g or more, so it’s easy to eat enough without extra effort.",
        stat: avgFibre,
      },
      {
        did: "Made every meal ready in 10 minutes",
        headline: "Regular meals, ready in 10 minutes",
        title: "Kept every meal ready in 10 minutes",
        label: "Ready in 10 min",
        short:
          "Milk production uses around 500 extra kcal a day, so regular meals matter more than ever.",
        long: "Milk production uses around 500 kcal a day on top of your usual needs. Skipping meals makes that hard to cover, so regular, easy meals matter more than ever.",
        icon: "⏱️",
        why: "Milk production uses around 500 kcal a day on top of your usual needs, and skipping meals makes that hard to cover.",
        inPlan:
          "Every meal is ready in 10 minutes, so eating regularly doesn’t depend on having time to cook.",
        stat: () => ({
          value: "10 min",
          label: "from freezer to table, every meal",
        }),
      },
    ],
  },
  easy: {
    storyTitle: "The science behind your routine",
    storyIntro:
      "A balanced meal has enough protein, slow carbohydrates and fibre, in the right amount.",
    principles: [
      {
        did: "Prioritised 15 g+ protein with 45–80 g carbs",
        headline: "15 g+ protein with slow carbs for steady energy",
        title: "Paired protein with slow carbs for steady energy",
        label: "Balanced macros",
        short:
          "Protein eaten with carbohydrates slows the rise in blood sugar, for steadier energy.",
        long: "Carbohydrates on their own raise blood sugar quickly, then let it drop. Eating them with protein slows that down, which keeps your energy steadier through the afternoon. Pairing the two in a meal is a simple way to get that.",
        icon: "🍽️",
        why: "Carbohydrates on their own raise blood sugar quickly, then let it drop. Eating them with protein slows that down, so your energy holds through the afternoon.",
        inPlan:
          "Each meal pairs 15 g or more of protein with slower carbs, so you get that without thinking about it.",
        stat: (lines) => ({
          value: `${count(lines, (m) => m.prot >= 15 && m.carb >= 45 && m.carb <= 80)} of ${unitsOf(lines)}`,
          label: "meals with that balance",
        }),
      },
      {
        did: "Prioritised meals with 8 g+ fibre",
        headline: "8 g+ fibre, which most adults fall short on",
        title: "Added enough fibre, where most of us fall short",
        label: "8 g+ fibre",
        short:
          "Most adults eat around 20 g of fibre a day, short of the 30 g recommended.",
        long: "Fibre is the nutrient most adults fall shortest on. Eating more of it is linked to better heart and gut health. A meal with 8 g or more gets you well on the way to the 30 g recommended.",
        icon: "🌾",
        why: "Fibre is the nutrient most adults fall shortest on, and eating more of it is linked to better heart and gut health.",
        inPlan:
          "Each meal has 8 g or more, which gets you well on the way to the 30 g recommended each day.",
        stat: avgFibre,
      },
      {
        did: "Prioritised meals of 400–600 kcal",
        headline: "A balanced main meal of 400–600 kcal",
        title: "Chose balanced mains, the right size for a meal",
        label: "400–600 kcal",
        short:
          "That’s a quarter to a third of most adults’ daily energy, the size of a balanced main meal.",
        long: "Most adults need around 2,000 kcal a day. A main meal of 400–600 kcal leaves room for breakfast and snacks without over- or under-eating.",
        icon: "⚖️",
        why: "Most adults need around 2,000 kcal a day, so a main meal of 400–600 kcal is a quarter to a third of that.",
        inPlan:
          "Every meal sits in that range, which leaves room for breakfast and snacks.",
        stat: inRangeStat,
      },
    ],
  },
};

// TODO(lift): sample data — copy is a first draft
/** Variant B's recommendation heading: one per goal, and one per follow-up answer where the goal has one */
/* plain and about their body, like a result rather than a slogan: "What your body needs to …" */
const RECOMMENDATION: Record<Goal, string> = {
  gut: "What your gut needs to work better, every single day",
  fitness: "What your body needs to fuel your training and recover well",
  lose: "What your body needs to lose weight steadily",
  baby: "What your body needs to recover and keep up with a newborn",
  easy: "What your body needs to run on steady energy, all week",
};
/** The fitness follow-ups each change what the training is for */
const RECOMMENDATION_BY_DRIVER: Record<string, string> = {
  muscle: "What your body needs to build muscle and recover well",
  lean: "What your body needs to stay lean and healthy",
  energy: "What your body needs to keep your energy up, all day",
  full: "What your body needs to stay full for longer",
  meatless: "What your body needs to get enough protein without meat",
};
/** So do the weight ones, said softly; the doctor's advice isn't repeated back, so that answer keeps the default */
const RECOMMENDATION_BY_WEIGHT_REASON: Record<string, string> = {
  energy: "What your body needs to feel lighter and have more energy",
  regain: "What your body needs to get back on track, steadily",
  maintain: "What your body needs to keep steady and feel comfortable",
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
  const weightReason = goal === "lose" ? (answers.whyWeight[0] ?? "") : "";
  const recommendation =
    RECOMMENDATION_BY_DRIVER[driver] ??
    RECOMMENDATION_BY_WEIGHT_REASON[weightReason] ??
    RECOMMENDATION[goal];
  // TODO(lift): replace with translation key
  const to = PICKED_FOR_DRIVER[driver] ?? PICKED_FOR[goal];
  const picked = `We picked your meals to ${to}`;
  const principles =
    driver === "full"
      ? [routine.principles[2], ...routine.principles.slice(0, 2)]
      : routine.principles;
  return { ...routine, recommendation, picked, to, principles };
}
