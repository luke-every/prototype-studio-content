import type { Metadata } from "next";
import { ReviewHarness } from "@/components/website/ReviewHarness";

export const metadata: Metadata = {
  title: "every · review",
};

export default function Review() {
  return <ReviewHarness />;
}
