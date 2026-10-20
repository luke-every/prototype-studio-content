import type { Metadata } from "next";
import { MyPlanA } from "@/components/pages";

export const metadata: Metadata = { title: "My Plan" };

/** Variant A: Goal · Eve noticed · Meals · Next order · Subscription, with sticky section chips. */
export default function MyPlanPage() {
  return <MyPlanA />;
}
