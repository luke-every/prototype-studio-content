import type { Metadata } from "next";
import { HomeB } from "@/components/pages";

export const metadata: Metadata = { title: "Home · Variant B (Week + Discover)" };

/** Variant B home: Today · Your goal · Your week (carousel) · Your box · Discover every · Your month. */
export default function VariantB() {
  return <HomeB />;
}
