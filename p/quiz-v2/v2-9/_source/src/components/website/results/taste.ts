import type { Answers } from "../quiz/types";
import type { Headline } from "./framing";

// TODO(lift): replace with translation keys
const SPICE: Record<string, string> = {
  no: "mild 🌿",
  can: "a little spicy 🌶️",
  medium: "medium spicy 🌶️",
  very: "very spicy 🌶️",
};
/** Who the meals are for, when it is more than them; just them needs no saying */
const FOR: Record<string, string> = {
  partner: "you and your partner",
  family: "your family",
  roommates: "you and your housemates",
};
const CUISINE: Record<string, string> = {
  asian: "Asian",
  indian: "Indian",
  italian: "Italian",
  german: "German",
  latin: "Latin",
};
const WATCH: Record<string, string> = {
  protein: "high protein 🧬",
  fibre: "high fibre 🫛",
  sugar: "low sugar 🍬",
  plants: "more plants 🥬",
};

/** "A, B and C" with each item as a chip */
function list(items: string[], last: string): Headline {
  return items.flatMap((item, i) => [
    i === 0 ? "" : i === items.length - 1 ? last : ", ",
    { answer: item },
  ]);
}

/** Their taste as one sentence: "Meals for you and your partner that are a little spicy, leaning Italian & Indian with low sugar and high fibre." */
export function tasteHeadline(answers: Answers): Headline {
  const spice = SPICE[answers.spicy[0]];
  const cuisines = answers.cuisine.flatMap((c) => CUISINE[c] ?? []);
  const look = answers.watch.flatMap((w) => WATCH[w] ?? []);
  const who = FOR[answers.household[0]];
  return [
    who ? `Meals for ${who} that are ` : "Meals that are ",
    ...(spice ? [{ answer: spice }] : []),
    ...(cuisines.length > 2
      ? [", across ", { answer: "diverse cuisines 🍽️" }]
      : cuisines.length
        ? [", leaning ", { answer: `${cuisines.join(" & ")} 🍽️` }]
        : []),
    ...(look.length ? [" with ", ...list(look, " and ")] : []),
    ".",
  ];
}
