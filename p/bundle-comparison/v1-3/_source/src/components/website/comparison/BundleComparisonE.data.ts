// Real content for variation E, keyed by the bundle keys in bundles.ts. Nothing here is invented: each line names its source.
// Sources:
//   [SB]    Storyblok CDN, published bundle stories: products/protein-bundle-v2, products/immunity-bundle,
//           products/perfect-portions-plan-v2 (Weight Balance is its new name), products/postpartum-bundle-v2 (New Parent).
//   [AUDIT] Notion "Bundle Macros Audit" (24 Sep 2026): per-meal averages from the product fact sheet, meals only.
//   [QUIZ]  Notion "Content - [V1] NC Onboarding Quiz": Q1 goal question and the answer labels.
// TODO(lift): sample data — replace with Storyblok bundle fields (goal label, who it's for, box contents) once they exist
// TODO(lift): price per meal is the Protein Bundle's Max box price from the PDP template, used as a stand-in for all four; real prices per bundle and box size are not sourced here

export type Goal = {
  /** The goal in the customer's words. [QUIZ] answer labels */
  goal: string;
  /** One sentence on who it's for. */
  whoFor: string;
  /** Three short ticked tags, in this order: a macro goal, who it's for, then price per meal. */
  tags: [string, string, string];
  /** Per-meal averages (main meals only). */
  macros: { protein: number; fibre: number; kcal: number };
  /** Which meal types come in the box. */
  inTheBox: string;
  /** Free extras, names only. */
  gifts: string[];
  /** Another fact a customer would want, if there is one. */
  note?: string;
  /** Where to go instead, worked out from the macros above. */
  alt: { key: string; prompt: string };
};

export const GOAL_QUESTION = "What is your most important nutrition goal right now?"; // [QUIZ] quiz.q1.question

export const GOALS: Record<string, Goal> = {
  protein: {
    goal: "Protein that keeps up with your lifestyle", // reworded from quiz answer "Get more protein"
    whoFor: "For everyone who trains, moves and wants to stay active.", // [SB] routine.headline
    tags: ["Easy to hit your protein goal", "For everyone who trains", "From 5,89 € per meal"], // TODO(lift): sample copy; macro goal, lifestyle [SB] routine.headline, price
    macros: { protein: 26, fibre: 11, kcal: 513 }, // [AUDIT] Protein 20 (Storyblok still shows 500 kcal)
    inTheBox: "Main meals for lunch or dinner", // [SB] variants 12 / 16 / 20 meals, mains only
    gifts: [],
    alt: { key: "body-balance", prompt: "Prefer fewer calories? See Body Balance" }, // 468 vs 513 kcal [AUDIT]
  },
  immunity: {
    goal: "Eat well without overthinking it", // [QUIZ]
    whoFor: "For everyone with a packed schedule and a craving for good food.", // [SB] routine.headline
    tags: ["More fibre in every meal", "For packed schedules", "From 5,89 € per meal"], // TODO(lift): sample copy; fibre is unaudited, lifestyle [SB] routine.headline, price
    macros: { protein: 22, fibre: 11, kcal: 500 }, // [SB] avg_* fields; not in the audit, and page copy says 21 g / 10 g
    inTheBox: "Main meals for lunch or dinner", // [SB] FAQ "What's included in the Immunity Bundle?"
    gifts: ["Ginger Ritual Cubes", "Tote bag"], // [SB] description_v2 "7 FREE immunity shots", editorial_public_text "a FREE tote bag"
    alt: { key: "protein", prompt: "Want more protein? See Protein" }, // 26 vs 22 g
  },
  "body-balance": {
    goal: "Lighter meals, nothing to count", // reworded from quiz answer "Eating lighter"; pre-portioned per Storyblok; no weight-loss claim
    whoFor: "No more counting. Portions are already done, so you can just eat.", // [SB] global_pillars_v2
    tags: ["Fewer calories per meal", "For people who would rather not count", "From 5,89 € per meal"], // TODO(lift): sample copy; only 1 kcal ahead in bundles.ts, lifestyle [SB] global_pillars_v2, price
    macros: { protein: 20, fibre: 11, kcal: 468 }, // [AUDIT] Perfect Portions Plan (19.8 / 11.1 / 468)
    inTheBox: "Main meals for lunch or dinner. The Complete plan adds breakfast and snacks.", // [SB] FAQ "What's included in the Perfect Portions Plan?"
    gifts: [],
    alt: { key: "protein", prompt: "Want more protein? See Protein" }, // 26 vs 20 g
  },
  "new-parent": {
    goal: "Real meals for hands-full days", // reworded from quiz answer "Eat well after having a baby"
    whoFor: "Everyone asks about the baby. This is for you.", // [SB] editorial_public_title_v2
    tags: ["540 kcal per meal", "For new parents", "From 5,89 € per meal"], // TODO(lift): sample copy; lifestyle [SB] editorial title, price
    macros: { protein: 20, fibre: 11, kcal: 510 }, // [AUDIT] suggested page values (19.7 / 11.3 / 507)
    inTheBox: "Main meals, breakfasts and snacks", // [SB] FAQ "What's included in the Postpartum Bundle?"
    gifts: [],
    note: "You can also send it to a new parent as a gift.", // [SB] FAQ "Can I send it as a gift?"
    alt: { key: "body-balance", prompt: "Prefer fewer calories? See Body Balance" }, // 468 vs 510 kcal
  },
};

// Shared by every bundle, so said once. [SB] FAQs: "All meals are plant-based", "ready in under 10 minutes",
// "From your second order onwards, you can adjust your selection", "skip a box or cancel anytime".
export const SHARED = "All meals are plant-based and ready in under 10 minutes. Swap meals from your second order, skip a box or cancel anytime.";
