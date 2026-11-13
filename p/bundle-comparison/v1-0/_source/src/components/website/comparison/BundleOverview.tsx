"use client";

import { BUNDLES } from "./bundles";
import { BuildYourOwnBox } from "./BuildYourOwnBox";
import { ComparisonFrame } from "./ComparisonFrame";
import { OverviewCard, OVERVIEW_ROW_COUNT } from "./OverviewCard";
import { useBundleDetails } from "./useBundleDetails";

type Props = {
  /** Below desktop: cards one under another (two by two on a tablet), or all four swiping sideways one at a time. Desktop is four columns either way. */
  layout: "stacked" | "swipe";
};

const CONTAINER = {
  // Phone: one under another. Tablet (md): two by two. Desktop: four across.
  stacked: "flex flex-col gap-6 md:grid md:grid-cols-2 lg:grid-cols-4 lg:gap-4 lg:gap-y-0",
  swipe:
    "scrollbar-hide -mx-4 grid snap-x snap-mandatory auto-cols-[84%] grid-flow-col gap-x-3 overflow-x-auto scroll-pl-4 px-4 lg:mx-0 lg:auto-cols-auto lg:grid-flow-row lg:grid-cols-4 lg:gap-x-4 lg:overflow-visible lg:px-0",
};

/** A and B: the same bundle card in two mobile layouts, so the test is the interaction pattern only. */
export function BundleOverview({ layout }: Props) {
  const details = useBundleDetails(layout === "stacked");

  return (
    <ComparisonFrame footerBelow>
      {/* Stacked: 24px between every card on a phone, the build-your-own card included */}
      <div className={`flex flex-col lg:gap-14 ${layout === "stacked" ? "gap-6" : "gap-8"}`}>
        <div className={CONTAINER[layout]} style={{ gridTemplateRows: `repeat(${OVERVIEW_ROW_COUNT}, auto)` }}>
          {BUNDLES.map((b) => (
            <OverviewCard key={b.key} b={b} layout={layout} detailsOpen={details.isOpen(b.key)} onToggleDetails={() => details.toggle(b.key)} />
          ))}
        </div>
        <BuildYourOwnBox />
      </div>
    </ComparisonFrame>
  );
}
