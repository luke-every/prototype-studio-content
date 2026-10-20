import type { Metadata } from "next";
import { AllMeals } from "@/components/allmeals";

export const metadata: Metadata = { title: "All meals" };

export default function AllMealsPage() {
  return <AllMeals />;
}
