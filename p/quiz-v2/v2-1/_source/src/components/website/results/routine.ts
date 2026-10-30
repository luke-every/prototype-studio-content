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
  /** The facts sheet and A-2's accordion: the references behind the [[id]] markers in `why`, `facts` and `more`, in the order they are cited (see sources.tsx) */
  sources: string[];
  /** The facts behind the why: what the DGE and EFSA recommend, with [[id]] markers (see sources.tsx) */
  facts: string;
  /** A little more, for the "Learn more" modal only */
  more?: string;
  /** Which page shows it: a1 is A-1's facts (and not A-2), a2 is A-2's story of what we chose (and not A-1) */
  only?: "a1" | "a2";
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
const ratingStat = (lines: Line[]) => ({
  value: (
    lines.reduce((sum, line) => sum + line.meal.rating * line.qty, 0) /
    unitsOf(lines)
  ).toFixed(1),
  label: "average review rating",
});
const tasteStat = (lines: Line[]) => ({
  value: `${cuisines(lines)}`,
  label: "cuisines in your plan",
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
      "Your gut is home to trillions of bacteria, and what you eat shapes which ones thrive. The research points to three things that matter most.",
    principles: [
      {
        did: "Prioritised meals with 12 g+ fibre",
        headline: "Fibre to feed your gut bacteria",
        title: "Fibre to feed your gut bacteria",
        label: "12 g+ fibre",
        short:
          "Gut bacteria ferment fibre into fatty acids your body then burns for about 2 kcal per gram.",
        long: "Fibre is the part of plants your small intestine can’t digest. In the large intestine, bacteria ferment some of it into short-chain fatty acids, which your body can use as fuel, worth about 2 kcal per gram [[dge-energy]]. How much is fermented depends on the fibre: inulin is fermented completely, while psyllium and cellulose barely at all [[dge-fibre]]. The DGE recommends at least 30 g a day, which works out at 14.6 g per 1,000 kcal [[dge-fibre]]. EFSA considers 25 g adequate for normal bowel function [[efsa-fibre]].",
        icon: "🌾",
        why: "Fibre is the part of plants your small intestine can’t digest. In the large intestine, bacteria ferment some of it into short-chain fatty acids, which your body can use as fuel, worth about 2 kcal per gram [[dge-energy]]. How much is fermented depends on the fibre: inulin is fermented completely, while psyllium and cellulose barely at all [[dge-fibre]].",
        facts:
          "The DGE recommends at least 30 g a day, which works out at 14.6 g per 1,000 kcal [[dge-fibre]]. EFSA considers 25 g adequate for normal bowel function [[efsa-fibre]].",
        more: "In Germany, average intake is 18 g a day for women and 19 g for men [[dge-fibre]]. Fibre from different sources matters, because the effects differ by source [[dge-fibre]].",
        inPlan: "We aimed for 12 g or more of fibre in your meals.",
        sources: ["dge-energy", "dge-fibre", "efsa-fibre"],
        stat: avgFibre,
      },
      {
        did: "Prioritised meals with 15 g+ protein",
        headline: "Protein to build your digestive enzymes",
        title: "Protein to build your digestive enzymes",
        label: "15 g+ protein",
        short:
          "Your digestive enzymes are proteins too, built from the protein you eat.",
        long: "Protein supplies the amino acids your body builds its own proteins from: enzymes, hormones and immune proteins among them [[dge-protein]]. Your digestive enzymes are proteins too. The DGE’s recommended intake for adults under 65 is 0.8 g per kg of body weight a day [[dge-protein]], and EFSA’s reference intake is 0.83 g [[efsa-protein]].",
        icon: "🫘",
        why: "Protein supplies the amino acids your body builds its own proteins from: enzymes, hormones and immune proteins among them [[dge-protein]]. Your digestive enzymes are proteins too.",
        facts:
          "The DGE’s recommended intake for adults under 65 is 0.8 g per kg of body weight a day [[dge-protein]], and EFSA’s reference intake is 0.83 g [[efsa-protein]].",
        inPlan: "We aimed for 15 g or more of protein in your meals.",
        sources: ["dge-protein", "efsa-protein"],
        only: "a1",
        stat: avgProtein,
      },
      {
        did: "Matched your spice level and cuisines",
        headline: "Matched to your spice level and cuisines",
        title: "Spice and cuisines you actually like",
        label: "Your taste",
        short:
          "The best plan is the one you keep eating, so your taste counts alongside the nutrition.",
        long: "The best plan for your gut is the one you keep eating, so we matched your meals to the spice level and cuisines you told us you like, as well as to what your gut needs.",
        icon: "🌶️",
        why: "The best plan for your gut is the one you keep eating, so we matched your meals to the spice level and cuisines you told us you like, as well as to what your gut needs.",
        facts: "",
        inPlan:
          "We matched your meals to the spice level and cuisines you chose.",
        sources: [],
        only: "a2",
        stat: tasteStat,
      },
      {
        did: "Prioritised meals of 400–600 kcal",
        headline: "Meals sized for a full day of eating",
        title: "Meals sized for a full day of eating",
        label: "400–600 kcal",
        short:
          "A main meal this size is a sixth to a third of a typical day’s energy.",
        long: "A main meal is one share of the day’s energy. In the DGE’s worked examples for a 40-year-old with a desk job, a day comes to about 1,800 kcal for a woman and 2,300 for a man [[dge-energy]], so 400–600 kcal is roughly a sixth to a third of it. Digesting and absorbing food uses about 10% of the energy you spend in a day [[dge-energy]].",
        icon: "⚖️",
        why: "A main meal is one share of the day’s energy. In the DGE’s worked examples for a 40-year-old with a desk job, a day comes to about 1,800 kcal for a woman and 2,300 for a man [[dge-energy]], so 400–600 kcal is roughly a sixth to a third of it.",
        facts:
          "Digesting and absorbing food uses about 10% of the energy you spend in a day [[dge-energy]].",
        inPlan: "We aimed for meals between 400 and 600 kcal.",
        sources: ["dge-energy"],
        stat: inRangeStat,
      },
    ],
  },
  fitness: {
    storyTitle: "The science behind your routine",
    storyIntro:
      "Training puts muscle under stress, and protein is what helps it grow and be maintained. How much you eat across the day decides how well that works.",
    principles: [
      {
        did: "Prioritised meals with 20 g+ protein",
        headline: "Protein to keep and build muscle",
        title: "Protein to keep and build muscle",
        label: "20 g+ protein",
        short:
          "Training five hours a week or more lifts protein needs from 0.8 g per kg to 1.2–2.0 g.",
        long: "For most adults the recommended protein intake is 0.8 g per kg of body weight a day. For people training five hours a week or more, the DGE cites a flexible 1.2–2.0 g per kg, depending on sport and goal. It suggests getting protein as part of meals through the day, not as supplements [[dge-protein]]. EFSA’s reference intake for adults is 0.83 g per kg [[efsa-protein]].",
        icon: "💪",
        why: "For most adults the recommended protein intake is 0.8 g per kg of body weight a day. For people training five hours a week or more, the DGE cites a flexible 1.2–2.0 g per kg, depending on sport and goal. It suggests getting protein as part of meals through the day, not as supplements [[dge-protein]].",
        facts:
          "EFSA’s reference intake for adults is 0.83 g per kg [[efsa-protein]].",
        more: "For recreational exercise, four to five 30-minute sessions a week, the DGE says 0.8 g per kg is enough [[dge-protein]].",
        inPlan: "We aimed for 20 g or more of protein in your meals.",
        sources: ["dge-protein", "efsa-protein"],
        stat: avgProtein,
      },
      {
        did: "Prioritised our best-rated meals",
        headline: "Our best-rated meals first",
        title: "Our best-rated meals first",
        label: "Best rated",
        short:
          "Getting enough protein takes weeks of eating it, so it helps if the meals are ones you enjoy.",
        long: "Getting enough protein is something you do week after week, not once. It’s easier to keep up when you look forward to the meals, so among those that fit your goal we put the best-rated first.",
        icon: "⭐",
        why: "Getting enough protein is something you do week after week, not once. It’s easier to keep up when you look forward to the meals, so among those that fit your goal we put the best-rated first.",
        facts: "",
        inPlan:
          "Among meals that fit your goal, the ones our customers rate highest come first.",
        sources: [],
        only: "a2",
        stat: ratingStat,
      },
      {
        did: "Prioritised meals with 8 g+ fibre",
        headline: "Fibre in proportion to what you eat",
        title: "Fibre in proportion to what you eat",
        label: "8 g+ fibre",
        short:
          "At 500 kcal a meal, 8 g of fibre lands just above the DGE’s target of 14.6 g per 1,000 kcal.",
        long: "Fibre affects how quickly food moves through your gut, how full you feel and how your body absorbs nutrients [[dge-fibre]]. The DGE sets its target by density, at least 14.6 g per 1,000 kcal, so a 500 kcal meal needs about 7 g to keep pace [[dge-fibre]]. That is at least 30 g a day [[dge-fibre]], and EFSA considers 25 g adequate for normal bowel function [[efsa-fibre]].",
        icon: "🌾",
        why: "Fibre affects how quickly food moves through your gut, how full you feel and how your body absorbs nutrients [[dge-fibre]]. The DGE sets its target by density, at least 14.6 g per 1,000 kcal, so a 500 kcal meal needs about 7 g to keep pace [[dge-fibre]].",
        facts:
          "That is at least 30 g a day [[dge-fibre]], and EFSA considers 25 g adequate for normal bowel function [[efsa-fibre]].",
        more: "In Germany, average intake is 18 g a day for women and 19 g for men [[dge-fibre]].",
        inPlan: "We aimed for 8 g or more of fibre in your meals.",
        sources: ["dge-fibre", "efsa-fibre"],
        stat: avgFibre,
      },
      {
        did: "Enough energy",
        headline: "Enough energy to train on",
        title: "Enough energy to train on",
        label: "Energy",
        short:
          "Four to five workouts a week lift a desk-job day from about 1,800 to 2,200 kcal.",
        long: "Training raises how much energy you use: the DGE adds 0.3 to the activity level for people who exercise four to five times a week for 30–60 minutes [[dge-energy]]. In the DGE’s worked examples for a 40-year-old woman, a desk job comes to about 1,800 kcal a day, and four to five workouts a week take it to about 2,200 [[dge-energy]].",
        icon: "⚡",
        why: "Training raises how much energy you use: the DGE adds 0.3 to the activity level for people who exercise four to five times a week for 30–60 minutes [[dge-energy]].",
        facts:
          "In the DGE’s worked examples for a 40-year-old woman, a desk job comes to about 1,800 kcal a day, and four to five workouts a week take it to about 2,200 [[dge-energy]].",
        inPlan: "Every meal is labelled with its calories.",
        sources: ["dge-energy"],
        only: "a1",
        stat: (lines) => ({
          value: `${avg(lines, "kcal")}`,
          label: "kcal per meal, on average",
        }),
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
        headline: "Meals small enough for a steady deficit",
        title: "Meals small enough for a steady deficit",
        label: "Under 520 kcal",
        short:
          "At 1,800–2,300 kcal a day, a meal under 520 kcal is roughly a quarter of your energy.",
        long: "Weight comes down to energy in against energy out, which is why the DGE’s energy guidelines aim at a balanced intake [[dge-energy]]. In its worked examples for a 40-year-old with a desk job, a day comes to about 1,800 kcal for a woman and 2,300 for a man [[dge-energy]]. Digesting and absorbing food uses about 10% of the energy you spend in a day [[dge-energy]].",
        icon: "🥣",
        why: "Weight comes down to energy in against energy out, which is why the DGE’s energy guidelines aim at a balanced intake [[dge-energy]]. In its worked examples for a 40-year-old with a desk job, a day comes to about 1,800 kcal for a woman and 2,300 for a man [[dge-energy]].",
        facts:
          "Digesting and absorbing food uses about 10% of the energy you spend in a day [[dge-energy]].",
        more: "Every meal is portioned and labelled, so you can see exactly what you’re eating.",
        inPlan: "We aimed for meals under 520 kcal, and each one is labelled.",
        sources: ["dge-energy"],
        stat: (lines) => ({
          value: `${avg(lines, "kcal")}`,
          label: "kcal per meal, on average",
        }),
      },
      {
        did: "Prioritised meals with 20 g+ protein",
        headline: "Protein that keeps you fuller for longer",
        title: "Protein that keeps you fuller for longer",
        label: "20 g+ protein",
        short:
          "Protein takes more energy to digest than fat, and is linked to feeling fuller for longer.",
        long: "A higher protein intake is linked to stronger satiety [[dge-protein]], and processing food uses energy, more for protein than for fat. Digestion and absorption together use about a tenth of your daily energy [[dge-energy]]. The DGE’s recommended intake for adults under 65 is 0.8 g per kg of body weight a day [[dge-protein]], and EFSA’s reference intake is 0.83 g [[efsa-protein]].",
        icon: "🫘",
        why: "A higher protein intake is linked to stronger satiety [[dge-protein]], and processing food uses energy, more for protein than for fat. Digestion and absorption together use about a tenth of your daily energy [[dge-energy]].",
        facts:
          "The DGE’s recommended intake for adults under 65 is 0.8 g per kg of body weight a day [[dge-protein]], and EFSA’s reference intake is 0.83 g [[efsa-protein]].",
        inPlan: "We aimed for 20 g or more of protein in your meals.",
        sources: ["dge-protein", "dge-energy", "efsa-protein"],
        stat: avgProtein,
      },
      {
        did: "Prioritised meals with 8 g+ fibre",
        headline: "Fibre to help you feel full",
        title: "Fibre to help you feel full",
        label: "8 g+ fibre",
        short:
          "Fibre gives about 2 kcal per gram, half of other carbohydrates, and affects how full you feel.",
        long: "Fibre has an effect on how full you feel, and how much depends on the type of fibre [[dge-fibre]]. It also carries about 2 kcal per gram, half the 4 kcal of other carbohydrates, because only part of it is fermented into usable energy [[dge-energy]]. That is at least 30 g a day [[dge-fibre]], and EFSA considers 25 g adequate for normal bowel function [[efsa-fibre]].",
        icon: "🌾",
        why: "Fibre has an effect on how full you feel, and how much depends on the type of fibre [[dge-fibre]]. It also carries about 2 kcal per gram, half the 4 kcal of other carbohydrates, because only part of it is fermented into usable energy [[dge-energy]].",
        facts:
          "That is at least 30 g a day [[dge-fibre]], and EFSA considers 25 g adequate for normal bowel function [[efsa-fibre]].",
        more: "In Germany, average intake is 18 g a day for women and 19 g for men [[dge-fibre]].",
        inPlan: "We aimed for 8 g or more of fibre in your meals.",
        sources: ["dge-fibre", "dge-energy", "efsa-fibre"],
        only: "a1",
        stat: avgFibre,
      },
      {
        did: "Prioritised our best-rated meals",
        headline: "Our best-rated meals first",
        title: "Our best-rated meals first",
        label: "Best rated",
        short:
          "Eating a little less only lasts if the food is something you look forward to.",
        long: "Eating a little less only works if you can keep it up, and food you look forward to is much easier to keep eating. Among meals that fit your goal, we put the best-rated first.",
        icon: "⭐",
        why: "Eating a little less only works if you can keep it up, and food you look forward to is much easier to keep eating. Among meals that fit your goal, we put the best-rated first.",
        facts: "",
        inPlan:
          "Among meals under 520 kcal, the ones our customers rate highest come first.",
        sources: [],
        only: "a2",
        stat: ratingStat,
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
        headline: "Extra protein for breast milk",
        title: "Extra protein for breast milk",
        label: "20 g+ protein",
        short:
          "Breastfeeding adds about 20 g a day to your protein needs, because milk itself contains protein.",
        long: "Breast milk contains protein, so if you’re breastfeeding your body needs more than usual to make up for what goes into the milk. The DGE derives the extra from the protein content of breast milk and how efficiently the body uses dietary protein [[dge-protein]]. The DGE adds 15 to 23 g a day, about 1.2 g per kg in total [[dge-protein]], and EFSA adds 19 g a day in the first six months [[efsa-protein]].",
        icon: "💪",
        why: "Breast milk contains protein, so if you’re breastfeeding your body needs more than usual to make up for what goes into the milk. The DGE derives the extra from the protein content of breast milk and how efficiently the body uses dietary protein [[dge-protein]].",
        facts:
          "The DGE adds 15 to 23 g a day, about 1.2 g per kg in total [[dge-protein]], and EFSA adds 19 g a day in the first six months [[efsa-protein]].",
        inPlan: "We aimed for 20 g or more of protein in your meals.",
        sources: ["dge-protein", "efsa-protein"],
        stat: avgProtein,
      },
      {
        did: "Prioritised meals with 12 g+ fibre",
        headline: "Fibre to keep digestion moving",
        title: "Fibre to keep digestion moving",
        label: "12 g+ fibre",
        short:
          "Fibre adds bulk to stool and affects how quickly food moves through your gut.",
        long: "Fibre affects how quickly food moves through your gut and the bulk and consistency of stool [[dge-fibre]]. That is at least 30 g a day [[dge-fibre]], and EFSA considers 25 g adequate for normal bowel function [[efsa-fibre]].",
        icon: "🌾",
        why: "Fibre affects how quickly food moves through your gut and the bulk and consistency of stool [[dge-fibre]].",
        facts:
          "That is at least 30 g a day [[dge-fibre]], and EFSA considers 25 g adequate for normal bowel function [[efsa-fibre]].",
        more: "In Germany, average intake is 18 g a day for women and 19 g for men [[dge-fibre]].",
        inPlan: "We aimed for 12 g or more of fibre in your meals.",
        sources: ["dge-fibre", "efsa-fibre"],
        stat: avgFibre,
      },
      {
        did: "Prioritised our best-rated meals",
        headline: "Our best-rated meals first",
        title: "Our best-rated meals first",
        label: "Best rated",
        short:
          "Eating well sticks when the food is something you look forward to.",
        long: "Your body needs regular, proper meals right now, and it’s easier to keep eating them when you enjoy them. Among meals that fit your needs, we put the best-rated first.",
        icon: "⭐",
        why: "Your body needs regular, proper meals right now, and it’s easier to keep eating them when you enjoy them. Among meals that fit your needs, we put the best-rated first.",
        facts: "",
        inPlan:
          "Among meals with 20 g+ protein and 12 g+ fibre, the ones our customers rate highest come first.",
        sources: [],
        only: "a2",
        stat: ratingStat,
      },
      {
        did: "Enough energy",
        headline: "More energy than usual",
        title: "More energy than usual",
        label: "Energy",
        short:
          "Exclusive breastfeeding adds about 500 kcal a day for the first four to six months.",
        long: "Breastfeeding uses extra energy: the DGE raises its guide value by 500 kcal a day during the first four to six months of exclusive breastfeeding [[dge-energy]]. That is on top of the usual guide values, which depend on age, sex and activity [[dge-energy]].",
        icon: "⚡",
        why: "Breastfeeding uses extra energy: the DGE raises its guide value by 500 kcal a day during the first four to six months of exclusive breastfeeding [[dge-energy]].",
        facts:
          "That is on top of the usual guide values, which depend on age, sex and activity [[dge-energy]].",
        inPlan: "Every meal is labelled with its calories.",
        sources: ["dge-energy"],
        only: "a1",
        stat: (lines) => ({
          value: `${avg(lines, "kcal")}`,
          label: "kcal per meal, on average",
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
        headline: "Carbs and protein in balance",
        title: "Carbs and protein in balance",
        label: "Balanced macros",
        short:
          "Carbohydrate should make up 45–60% of daily energy, so balanced doesn’t mean low-carb.",
        long: "A balanced plate pairs carbohydrate, your body’s main source of energy, with protein for its own tissues. EFSA’s reference range for carbohydrate is 45–60% of daily energy [[efsa-fibre]], so balanced doesn’t mean low-carb. The DGE’s recommended protein intake for adults under 65 is 0.8 g per kg of body weight a day [[dge-protein]].",
        icon: "🍽️",
        why: "A balanced plate pairs carbohydrate, your body’s main source of energy, with protein for its own tissues. EFSA’s reference range for carbohydrate is 45–60% of daily energy [[efsa-fibre]], so balanced doesn’t mean low-carb.",
        facts:
          "The DGE’s recommended protein intake for adults under 65 is 0.8 g per kg of body weight a day [[dge-protein]].",
        inPlan:
          "We aimed for 15 g or more of protein with 45–80 g of carbohydrate in your meals.",
        sources: ["efsa-fibre", "dge-protein"],
        stat: (lines) => ({
          value: `${count(lines, (m) => m.prot >= 15 && m.carb >= 45 && m.carb <= 80)} of ${unitsOf(lines)}`,
          label: "meals with that balance",
        }),
      },
      {
        did: "Prioritised meals with 8 g+ fibre",
        headline: "Fibre where most of us fall short",
        title: "Fibre where most of us fall short",
        label: "8 g+ fibre",
        short:
          "The average German eats 18–19 g a day, well short of the DGE’s 30 g.",
        long: "Fibre affects how quickly food moves through your gut, how full you feel and how your body absorbs nutrients [[dge-fibre]]. In Germany, average intake is 18 g a day for women and 19 g for men, below the DGE’s 30 g [[dge-fibre]]. The DGE sets that 30 g as at least 14.6 g per 1,000 kcal [[dge-fibre]], and EFSA considers 25 g adequate for normal bowel function [[efsa-fibre]].",
        icon: "🌾",
        why: "Fibre affects how quickly food moves through your gut, how full you feel and how your body absorbs nutrients [[dge-fibre]]. In Germany, average intake is 18 g a day for women and 19 g for men, below the DGE’s 30 g [[dge-fibre]].",
        facts:
          "The DGE sets that 30 g as at least 14.6 g per 1,000 kcal [[dge-fibre]], and EFSA considers 25 g adequate for normal bowel function [[efsa-fibre]].",
        inPlan: "We aimed for 8 g or more of fibre in your meals.",
        sources: ["dge-fibre", "efsa-fibre"],
        stat: avgFibre,
      },
      {
        did: "Prioritised meals of 400–600 kcal",
        headline: "Meals sized for a full day of eating",
        title: "Meals sized for a full day of eating",
        label: "400–600 kcal",
        short:
          "A main meal this size is a sixth to a third of a typical day’s energy.",
        long: "A main meal is one share of the day’s energy. In the DGE’s worked examples for a 40-year-old with a desk job, a day comes to about 1,800 kcal for a woman and 2,300 for a man [[dge-energy]], so 400–600 kcal is roughly a sixth to a third of it. Digesting and absorbing food uses about 10% of the energy you spend in a day [[dge-energy]].",
        icon: "⚖️",
        why: "A main meal is one share of the day’s energy. In the DGE’s worked examples for a 40-year-old with a desk job, a day comes to about 1,800 kcal for a woman and 2,300 for a man [[dge-energy]], so 400–600 kcal is roughly a sixth to a third of it.",
        facts:
          "Digesting and absorbing food uses about 10% of the energy you spend in a day [[dge-energy]].",
        inPlan: "We aimed for meals between 400 and 600 kcal.",
        sources: ["dge-energy"],
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
  fitness:
    "What your body needs to fuel your training and look after your muscles",
  lose: "What your body needs to lose weight steadily",
  baby: "What your body needs to recover and keep up with a newborn",
  easy: "What your body needs to run on steady energy, all week",
};
/** The fitness follow-ups each change what the training is for */
const RECOMMENDATION_BY_DRIVER: Record<string, string> = {
  muscle: "What your body needs to build and maintain muscle",
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
