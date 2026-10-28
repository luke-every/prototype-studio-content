import type { Metadata } from "next";
import { ReviewHarness } from "@/components/website/ReviewHarness";

export const metadata: Metadata = {
  title: "every · results",
};

export default function Results() {
  return <ReviewHarness />;
}
