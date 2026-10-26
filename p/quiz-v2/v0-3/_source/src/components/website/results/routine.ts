import type { Goal, Meal } from "@/lib/recommendation";
import type { Answers } from "../quiz/types";

type Line = { meal: Meal; qty: number };

/**
 * One rule we applied for their goal. On the page: the rule, and the one fact that makes it matter.
 * In the full story: the reasoning in full, and a number from their own box that shows the rule held.
 * The rules follow the goal criteria in lib/recommendation.ts, so they say what the engine actually did.
 */
export type Principle = {
  did: string;
  short: string;
  long: string;
  /** The row's marker, in the quiz's emoji style */
  icon: string;
  proof: (lines: Line[]) => string;
};

export type Routine = {
  title: string;
  /** The full story's heading and opening paragraph */
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

const fibreProof = (lines: Line[]) => `Your box averages ${avg(lines, "fib")} g fibre per meal.`;
const proteinProof = (lines: Line[]) => `Your box averages ${avg(lines, "prot")} g protein per meal.`;
const rangeProof = (lines: Line[]) => `${count(lines, inRange)} of your ${unitsOf(lines)} meals are in that range.`;

// TODO(lift): sample data — every fact needs a nutritionist's sign-off and a cited source before it ships; copy is a first draft
const ROUTINES: Record<Goal, Routine> = {
  gut: {
    title: "How your box supports gut health",
    storyTitle: "The science behind your box",
    storyIntro:
      "Your gut is home to trillions of bacteria, and what you eat decides which ones thrive. The research points to three things that matter most, and we used each of them to choose your meals.",
    principles: [
      {
        did: "Prioritised meals with 12 g+ fibre",
        short: "Gut bacteria ferment fibre into short-chain fatty acids, which fuel the cells lining your gut.",
        long: "Fibre passes through your stomach undigested and is fermented by bacteria in your large intestine. That produces short-chain fatty acids such as butyrate, the main fuel for the cells lining your colon. Most adults eat around 20 g of fibre a day, short of the 25–30 g recommended.",
        icon: "🌾",
        proof: fibreProof,
      },
      {
        did: "Spread your box across different plants",
        short: "People who eat 30+ different plants a week have a more diverse gut microbiome.",
        long: "Each type of plant feeds different bacteria. In the American Gut Project, people eating more than 30 different plants a week had a more diverse microbiome than those eating 10 or fewer. Every meal is plant-based, and we spread your box across dishes and cuisines.",
        icon: "🥦",
        proof: (lines) => `${lines.length} different dishes from ${cuisines(lines)} cuisines.`,
      },
      {
        did: "Prioritised meals of 400–600 kcal",
        short: "Very large meals slow digestion and are a common trigger for bloating.",
        long: "Your gut handles moderate, regular meals more comfortably than large ones, which take longer to digest and are a common cause of bloating. We kept your meals in a range that makes a full main meal without overloading it.",
        icon: "⚖️",
        proof: rangeProof,
      },
    ],
  },
  fitness: {
    title: "How your box supports your training",
    storyTitle: "The science behind your box",
    storyIntro:
      "Training breaks muscle down; protein is what rebuilds it. How much you eat, and how you spread it across the day, decide how well that works. We used both to choose your meals.",
    principles: [
      {
        did: "Prioritised meals with 25 g+ protein",
        short: "Muscle repair needs around 1.6 g of protein per kg a day, double the standard recommendation.",
        long: "The everyday recommendation is 0.8 g of protein per kg of body weight. Studies on people who train put the benefit for muscle at around 1.6 g per kg, about 110 g a day for someone weighing 70 kg. We ranked meals with 25 g or more highest.",
        icon: "💪",
        proof: proteinProof,
      },
      {
        did: "Aimed each meal at 20–40 g protein",
        short: "Your body builds muscle best from 20–40 g at a time, not one large serving.",
        long: "Muscle protein synthesis responds to each meal, and it peaks at around 20–40 g of protein. Spreading protein over three or four meals works better than eating most of it at once. One meal from your box is one of those servings.",
        icon: "🍽️",
        proof: (lines) => `${count(lines, (m) => m.prot >= 20)} of your ${unitsOf(lines)} meals have 20 g of protein or more.`,
      },
      {
        did: "Prioritised meals with 8 g+ fibre",
        short: "Fibre slows how fast carbohydrates are absorbed, for steadier energy around training.",
        long: "Fibre slows the absorption of carbohydrates, so blood sugar rises and falls more gently. That means steadier energy between sessions and fewer crashes. We ranked meals with 8 g or more highest.",
        icon: "🌾",
        proof: fibreProof,
      },
    ],
  },
  lose: {
    title: "How your box helps you eat lighter",
    storyTitle: "The science behind your box",
    storyIntro:
      "Losing weight comes down to eating a little less energy than you use, consistently. The hard part is doing that without feeling hungry. We chose your meals for both.",
    principles: [
      {
        did: "Prioritised meals under 520 kcal",
        short: "Most people underestimate how much they eat. A fixed portion removes the guess.",
        long: "Studies consistently find that people underestimate how much they eat, often by a wide margin. A pre-portioned meal with the calories on the label makes the amount certain. We ranked meals under 520 kcal highest.",
        icon: "🥣",
        proof: (lines) => `Your box averages ${avg(lines, "kcal")} kcal per meal.`,
      },
      {
        did: "Prioritised 20 g+ protein and 8 g+ fibre",
        short: "Protein is the most filling nutrient, and fibre slows digestion, so hunger returns later.",
        long: "Gram for gram, protein keeps you fuller than carbohydrate or fat, and your body uses more energy digesting it. Fibre slows how quickly your stomach empties. Together they keep hunger down between meals.",
        icon: "🫘",
        proof: (lines) => `Your box averages ${avg(lines, "prot")} g protein and ${avg(lines, "fib")} g fibre per meal.`,
      },
      {
        did: "Kept every meal plant-based",
        short: "Vegetables, legumes and grains give more volume per calorie, so a lighter meal still fills the plate.",
        long: "Plant foods are high in water and fibre, which gives them a low energy density: more food for the same calories. That’s why a meal under 520 kcal can still be a full plate.",
        icon: "🥦",
        proof: (lines) => `All ${unitsOf(lines)} meals are 100% plant-based.`,
      },
    ],
  },
  baby: {
    title: "How your box supports you as a new parent",
    storyTitle: "The science behind your box",
    storyIntro:
      "After birth, and especially while breastfeeding, your body needs more energy and protein than usual, at exactly the time when cooking is hardest. We chose your meals for that.",
    principles: [
      {
        did: "Prioritised meals with 20 g+ protein",
        short: "Breastfeeding raises protein needs by around 20 g a day.",
        long: "Your body uses protein to recover after birth, and producing milk raises your daily needs by around 20 g. We ranked meals with 20 g or more highest, so one meal covers that extra.",
        icon: "💪",
        proof: proteinProof,
      },
      {
        did: "Prioritised meals with 12 g+ fibre",
        short: "Constipation is common after birth, and fibre is the first recommendation for it.",
        long: "Hormones, iron supplements and less sleep all slow digestion after birth. Midwives’ first advice is more fibre and fluids. We ranked meals with 12 g or more highest.",
        icon: "🌾",
        proof: fibreProof,
      },
      {
        did: "Made every meal ready in 10 minutes",
        short: "Breastfeeding uses around 500 extra kcal a day, so regular meals matter more than ever.",
        long: "Making milk uses around 500 kcal a day on top of your usual needs. Skipping meals makes that hard to cover, so every meal is ready in 10 minutes, with nothing to plan or prep.",
        icon: "⏱️",
        proof: (lines) => `${unitsOf(lines)} meals, each ready in 10 minutes.`,
      },
    ],
  },
  easy: {
    title: "How your box keeps your diet balanced",
    storyTitle: "The science behind your box",
    storyIntro:
      "A balanced meal has enough protein, slow carbohydrates and fibre, in the right amount. We set a rule for each one and used them to choose your meals.",
    principles: [
      {
        did: "Prioritised 15 g+ protein with 45–80 g carbs",
        short: "Protein eaten with carbohydrates slows the rise in blood sugar, for steadier energy.",
        long: "Carbohydrates on their own raise blood sugar quickly, then let it drop. Eating them with protein slows that down, which keeps your energy steadier through the afternoon. We looked for both in every meal.",
        icon: "🍽️",
        proof: (lines) =>
          `${count(lines, (m) => m.prot >= 15 && m.carb >= 45 && m.carb <= 80)} of your ${unitsOf(lines)} meals hit that balance.`,
      },
      {
        did: "Prioritised meals with 8 g+ fibre",
        short: "Most adults eat around 20 g of fibre a day, short of the 30 g recommended.",
        long: "Fibre is the nutrient most adults fall shortest on. Eating more of it is linked to better heart and gut health. We ranked meals with 8 g or more highest.",
        icon: "🌾",
        proof: fibreProof,
      },
      {
        did: "Prioritised meals of 400–600 kcal",
        short: "That’s a quarter to a third of most adults’ daily energy, the size of a balanced main meal.",
        long: "Most adults need around 2,000 kcal a day. A main meal of 400–600 kcal leaves room for breakfast and snacks without over- or under-eating.",
        icon: "⚖️",
        proof: rangeProof,
      },
    ],
  },
};

/** The routine for their goal; "stay full" leads with fibre */
export function routineFor(goal: Goal, answers: Answers): Routine {
  const routine = ROUTINES[goal];
  if (goal !== "fitness" || answers.whyFitness[0] !== "full") return routine;
  return { ...routine, principles: [routine.principles[2], ...routine.principles.slice(0, 2)] };
}
