import type { Metadata } from "next";
import { MyPlanSections } from "@/components/pages";

export const metadata: Metadata = { title: "My Plan" };

export default function VariantMyPlan() {
  return <MyPlanSections />;
}
