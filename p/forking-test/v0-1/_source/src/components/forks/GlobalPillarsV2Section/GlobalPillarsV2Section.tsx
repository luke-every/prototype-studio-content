"use client";

// Markup taken out of src/app/page.tsx:82-84 for this project. The original is not touched: what is changed here is what is proposed.
import { GlobalPillarsV2 } from "@/components/forks/GlobalPillarsV2/GlobalPillarsV2";
import { INGREDIENTS, EXPERTS } from "@/lib/protein-page-sample";
import { ExpertReviewsCarouselV2 } from "@/components/website/homepage/GlobalReviewsCarousel";

export function GlobalPillarsV2Section() {
  return (
    <GlobalPillarsV2 eyebrow={INGREDIENTS.eyebrow} headline={INGREDIENTS.headline} items={INGREDIENTS.items} backgroundColor={INGREDIENTS.backgroundColor}>
      <ExpertReviewsCarouselV2 title={EXPERTS.title} experts={EXPERTS.experts} embedded />
    </GlobalPillarsV2>
  );
}
