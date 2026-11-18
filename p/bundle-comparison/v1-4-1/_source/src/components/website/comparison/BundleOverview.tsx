"use client";

import { BuildYourOwnBox } from "./BuildYourOwnBox";
import { QuizCta } from "./QuizCta";
import { CarouselArrows, useCarouselEdges } from "./CarouselArrows";
import { ComparisonFrame } from "./ComparisonFrame";
import { OverviewCard, OVERVIEW_ROW_COUNT } from "./OverviewCard";
import { useBundleDetails } from "./useBundleDetails";
import { useEnabledBundles } from "./useEnabledBundles";

type Props = {
  /** Below tablet: cards one under another, or all of them swiping sideways one at a time. From tablet (md): two by two and four across, or a carousel when there are more than four. */
  layout: "stacked" | "swipe";
};

/** More than this many bundles and tablet and desktop become a carousel (a phone is unchanged). */
const MAX_FIT = 4;

// Phone, by layout.
const PHONE = {
  stacked: "flex flex-col gap-6",
  swipe: "scrollbar-hide -mx-4 grid snap-x snap-mandatory auto-cols-[84%] grid-flow-col gap-x-3 overflow-x-auto scroll-pl-4 px-4",
};
// Tablet (md) and desktop (lg), by layout. Tablet: two by two. Desktop: four across.
const GRID = {
  stacked: "md:grid md:grid-cols-2 lg:grid-cols-4 lg:gap-4 lg:gap-y-0",
  swipe:
    "md:mx-0 md:auto-cols-auto md:grid-flow-row md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 lg:mx-0 lg:auto-cols-auto lg:grid-flow-row lg:grid-cols-4 lg:gap-x-4 lg:gap-y-0 lg:overflow-visible lg:px-0",
};
// A carousel: the cards in one row, snapping one at a time, three (B on a tablet) or four (desktop) in view. A stays two by two on a tablet, so its carousel starts at lg. The row reaches out to the edges of the screen (--gutter is the space either side of the 1120px container, 16px at least), so the next cards show beyond the container, faded (see useCarouselEdges). The 8px of vertical padding keeps the cards' borders from being clipped by the scroll box.
// Class names are written out whole (not built from parts), so Tailwind finds them.
const CAROUSEL = {
  swipe: `scrollbar-hide [--gutter:max(16px,calc((100vw-1120px)/2))] md:-mx-(--gutter) md:-my-2 md:grid md:snap-x md:snap-mandatory md:grid-flow-col md:auto-cols-[calc((100%-32px)/3)] md:gap-x-4 md:gap-y-0 md:overflow-x-auto md:scroll-px-(--gutter) md:px-(--gutter) md:py-2 lg:auto-cols-[calc((100%-48px)/4)] md:[&>article[data-peek]]:pointer-events-none`,
  stacked: `scrollbar-hide [--gutter:max(16px,calc((100vw-1120px)/2))] md:grid md:grid-cols-2 lg:-mx-(--gutter) lg:-my-2 lg:snap-x lg:snap-mandatory lg:grid-flow-col lg:grid-cols-none lg:auto-cols-[calc((100%-48px)/4)] lg:gap-x-4 lg:gap-y-0 lg:overflow-x-auto lg:scroll-px-(--gutter) lg:px-(--gutter) lg:py-2 lg:[&>article[data-peek]]:pointer-events-none`,
};

/** A and B: the same bundle card in two mobile layouts, so the test is the interaction pattern only. */
export function BundleOverview({ layout }: Props) {
  const bundles = useEnabledBundles();
  const details = useBundleDetails(layout === "stacked");
  const swipe = layout === "swipe";
  const carousel = bundles.length > MAX_FIT;

  const { ref: track, edge } = useCarouselEdges(carousel, bundles.length, swipe ? 768 : 1024);

  return (
    <ComparisonFrame footerBelow stickyQuiz={layout === "stacked"}>
      {/* Stacked: 24px between every card on a phone, the build-your-own card included */}
      <div className={`flex flex-col lg:gap-14 ${layout === "stacked" ? "gap-6" : "gap-8"}`}>
        {/* The arrows sit at the vertical centre of the cards: 24px outside the container from xl, where there is room, and over its edges below that */}
        <div className="relative">
          {carousel && <CarouselArrows edge={edge} prevClass={`left-2 ${swipe ? "md:flex" : "lg:flex"} xl:right-full xl:left-auto xl:mr-6`} nextClass={`right-2 ${swipe ? "md:flex" : "lg:flex"} xl:left-full xl:right-auto xl:ml-6`} />}
          <div ref={track} data-track="" className={`${PHONE[layout]} ${carousel ? CAROUSEL[layout] : GRID[layout]}`} style={{ gridTemplateRows: `repeat(${OVERVIEW_ROW_COUNT}, auto)` }}>
            {bundles.map((b) => (
              <OverviewCard key={b.key} b={b} layout={layout} detailsOpen={details.isOpen(b.key)} onToggleDetails={() => details.toggle(b.key)} />
            ))}
          </div>
        </div>
        {/* A (stacked): the build-your-own card alone on a phone, the quiz being the sticky bar. B (swipe): a short page, so no sticky bar: both cards, one under the other. Desktop: side by side. */}
        <div className={`grid lg:grid-cols-2 lg:gap-4 ${swipe ? "gap-3" : "gap-6"}`}>
          <QuizCta className={swipe ? "" : "hidden lg:flex"} />
          <BuildYourOwnBox />
        </div>
      </div>
    </ComparisonFrame>
  );
}
