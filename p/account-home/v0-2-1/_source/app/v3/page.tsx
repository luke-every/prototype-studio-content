import type { Metadata } from "next";
import { HomeC } from "@/components/pages";

export const metadata: Metadata = { title: "Home · Variant C (Simplified)" };

/** Variant C home: Today (with today's meal) · Your goal · Your meals · Your box · Your progress. */
export default function VariantC() {
  return <HomeC />;
}
