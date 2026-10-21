/**
 * Build flags for the reduced copy at /account-home-2 (NEXT_PUBLIC_LEAN=1).
 * The original /account-home build leaves them off and shows everything.
 */
const LEAN = process.env.NEXT_PUBLIC_LEAN === "1";
/** Third copy at /account-home-3 (NEXT_PUBLIC_ONLY_B=1): the reduced copy with Variant B only, served at the root. */
export const ONLY_B = process.env.NEXT_PUBLIC_ONLY_B === "1";

export const FLAGS = {
  /** "Keep it going": rhythm, impact tiles, nutritionist perk (A, B) and "Your progress" (C) on Home. */
  hideKeepGoing: LEAN,
  /** The Every Wrapped band on Home. */
  hideWrapped: LEAN,
  /** "Not sure it's the right goal? Explore other goals" cards in My Plan's goal section. */
  hideOtherGoals: LEAN,
  /** "Search meals or ask Eve" field and its chips in "Your week" (A, B) and the Ask Eve bar under the greeting (C). Ask Eve stays as the floating button. */
  hideWeekSearch: LEAN,
  /** Delivery band: the address line, the "N items in your box" block (count, price, photos, savings) and the "Edit meals" button. */
  slimDelivery: LEAN,
  /** Move day · Skip this box · Going away? sit under the greeting instead of in the delivery band. */
  deliveryActionsInGreeting: LEAN,
  /** The "N meals in your freezer · lasts until …" line in the delivery band. */
  hideFreezerLine: LEAN,
  /** While a box is coming, its date, time window and edit cut-off live in the greeting and the delivery band is dropped. */
  deliveryInGreeting: LEAN,
  /** My Plan: the five goal cards collapse into one small card; the details open in a modal. */
  compactPlanGoal: LEAN,
  /** Variant B Home: slim meal cards (image, name, Made it, Swap) and no tag pills. */
  compactWeekB: LEAN,
  /** Quiz: Eve illustrations (Air "Eve (brand character)") instead of the photo collage, the 80% photo and the satisfaction emojis. */
  eveIllustrations: LEAN,
  /** Quiz interstitials: a goal-specific fact after the goal questions, and a fact about what they watch for on the benefit screen. */
  personalisedFacts: LEAN,
  /** Variant B Home: no goal band, no week header/toggle and no "How was last week?" card; the greeting carries the next box and the goal progress;
   *  "Still to enjoy" / "Enjoyed" as a grid; Talk of the table and bundles framed as Eve's recommendations. */
  bHomeFocus: LEAN,
  /** My Plan: only the Goal and Next order sections (and tabs); Meals and Subscription are dropped. */
  planGoalOrderOnly: LEAN,
  /** Quiz: an orange splash behind each illustration; the intro Eve raises a hand with a question bubble. */
  quizSplash: LEAN,
  /** Variant A Home "Your week": no title or sub-line, just the eyebrow, Edit in My Plan and the planner. */
  bareWeekA: LEAN,
  /** Variant C Home: the goal band moves to the end of the page. */
  goalLastC: LEAN,
  /** Variant C Home: the greeting headline is about today's meal; the box date, cut-off and Move day / Skip / Going away? leave Home. */
  mealGreetingC: LEAN,
  /** B only copy: "Still to enjoy" / "Enjoyed" leave Home and open from My Plan's top card as "Your meal plan". */
  planInMyPlan: ONLY_B,
  /** B only copy: Home opens with a profile dashboard (goal, meals, plants, streak, macros, next box). */
  homeDashboard: ONLY_B,
};
