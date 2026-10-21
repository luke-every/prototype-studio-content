import type { Metadata } from "next";
import { AllMeals } from "@/components/allmeals";
import { ONLY_B } from "@/lib/flags";

export const metadata: Metadata = { title: ONLY_B ? "All meals" : "Discover Every" };

/** Variant A: All Meals combined with the Figma Discover sections, shown as "Discover Every". */
export default function DiscoverMealsPage() {
  return ONLY_B ? <AllMeals /> : <AllMeals discover />;
}
