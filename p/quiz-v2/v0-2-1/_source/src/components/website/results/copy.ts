import type { Answers } from "../quiz/types";

/*
 * Small pieces of results-page copy. The hero headline's phrases live in framing.ts.
 */

// TODO(lift): replace with translation keys — each phrase pattern needs its own key, not one concatenated string

/** "a, b and c" */
export function listOf(items: string[]): string {
  return items.length < 2 ? (items[0] ?? "") : `${items.slice(0, -1).join(", ")} and ${items.at(-1)}`;
}

const ALLERGEN_NAMES: Record<string, string> = {
  gluten: "gluten",
  soy: "soy",
  mustard: "mustard",
  nuts: "tree nuts",
  sesame: "sesame",
  celery: "celery",
};

/** The allergens the engine left out, in plain words; empty when none were picked */
export function allergensOf(answers: Answers): string[] {
  if (answers.allergy[0] !== "yes") return [];
  return answers.allergyWhich.flatMap((a) => ALLERGEN_NAMES[a] ?? []);
}

/** Why an add-on is recommended: the answer that earned it, or a plain fact about it. Never a health claim */
export function addOnReason(key: string, why: string): string {
  if (why === "More protein") return "You asked for more protein";
  if (why === "More fibre") return "You asked for more fibre";
  if (why === "Likes spicy food") return "You like it spicy";
  if (key === "boonian" || key === "planted") return "Extra protein for any meal";
  if (key === "porridge") return "A breakfast to go with your meals";
  if (key === "dg3" || key === "mt3" || key === "tb3") return "Breakfast you can drink";
  if (key === "herbal") return "Under 2 g sugar per cube";
  if (key === "bites") return "Something sweet to share";
  return "Something sweet after dinner";
}
