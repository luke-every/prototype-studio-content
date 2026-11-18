import Image from "next/image";
import { ChevronDownIcon } from "@/components/icons";
import { Button } from "@/components/shared/Button";
import { Collapse } from "@/components/website/Collapse";
import { formatPrice } from "@/lib/format";
import { interpolate } from "@/lib/translations";
import { useControl } from "@/lib/studio-controls";
import type { Bundle } from "./bundles";
import { FACTS } from "./BundleComparisonA.data";
import { bundleCopy, copy } from "./copy";
import { hasPanel, IncludedSection } from "./IncludedSection";

const SMALL = "font-sans text-sm leading-[18px] tracking-[-0.28px]";
const HEADING = `${SMALL} font-medium text-near-black`;
// Image, name + pitch, facts line, details toggle + details, action: every card spans the same rows so they line up across cards.
export const OVERVIEW_ROW_COUNT = 5;

// TODO(lift): sample data — the macro callout comes from the nutrition fact sheet (see BundleComparisonA.data.ts).
// Only Protein's price is real (pdp-protein template, largest box); the other three are placeholders, replace with Shopify / Eversubs.
const HIGHLIGHTS: Record<string, { fromPerMeal: number }> = {
  protein: { fromPerMeal: 5.89 },
  immunity: { fromPerMeal: 6.29 },
  "body-balance": { fromPerMeal: 5.49 },
  "new-parent": { fromPerMeal: 6.49 },
  gut: { fromPerMeal: 6.09 },
};

const LAYOUT = {
  // The single column is minmax(0, 1fr) and the card has min-w-0, so nothing inside (a long tag, a photo) can push the card or its image frame wider than its slot.
  // One inset (24px phone, 16px desktop) and one 12px gap between sections, set on the card itself; nothing inside adds its own outer padding.
  stacked: "flex min-w-0 flex-col gap-3 p-6 lg:grid lg:grid-cols-[minmax(0,1fr)] lg:grid-rows-subgrid lg:p-4",
  swipe: "grid min-w-0 snap-start grid-cols-[minmax(0,1fr)] grid-rows-subgrid gap-y-3 p-6 lg:p-4",
  // Phone: as tall as the tallest card; the sheet scrolls all the cards together.
  sheet: "flex min-w-0 flex-col gap-y-3 p-5 lg:grid lg:grid-cols-[minmax(0,1fr)] lg:grid-rows-subgrid lg:p-3",
};

type Props = {
  b: Bundle;
  layout: keyof typeof LAYOUT;
  /** The bundle the customer is already on (compare sheet): outlined, and no Continue. */
  current?: boolean;
  /** Whether "See more details" is open (what is in the box, nutrition per meal). Not needed in the sheet, where the details are always showing. */
  detailsOpen?: boolean;
  onToggleDetails?: () => void;
};

/**
 * Spacing is set once, on the card: one inset (24px on a phone, 16px from lg) and one 12px gap between sections, with the action pushed to the bottom (mt-auto) so Continue lines up across cards of different heights.
 * One bundle on its own colour: box shot, the name small in the bundle colour, the pitch as the headline, one line of two facts (macro ∙ price per meal), Continue.
 * "See more details" is a text link under the facts line; the details open beneath it, so Continue is always the last thing on the card.
 * In the sheet on a phone all the cards scroll together.
 */
export function OverviewCard({ b, layout, current = false, detailsOpen = false, onToggleDetails }: Props) {
  const sheet = layout === "sheet";
  const highlight = HIGHLIGHTS[b.key];
  const heroNew = useControl("images") === "new";
  const included = "stack";
  // Tints of dark brown for the panels, hairlines and tiles, which sit better on a colour than a solid grey would.
  const fill = "bg-dark/6";
  // Desktop hover (same on the nav cards): a dark border fades in over 0.1s, from 0 to 80% opacity. The border is always there, transparent, so nothing moves.

  const facts = FACTS.find((f) => f.key === b.key);
  const detailsId = `details-${layout}-${b.key}`;

  const toggle = (
    <button
      type="button"
      onClick={onToggleDetails}
      className={`${SMALL} flex h-10 w-fit cursor-pointer items-center gap-1.5 font-medium text-near-black`}
      aria-expanded={detailsOpen}
      aria-controls={detailsId}
      aria-label={`${detailsOpen ? copy("card.hideDetails") : copy("card.seeDetails")}: ${b.title}`}
    >
      {detailsOpen ? copy("card.hideDetails") : copy("card.seeDetails")}
      <ChevronDownIcon className={`transition-transform duration-300 ${detailsOpen ? "rotate-180" : ""}`} />
    </button>
  );

  // TODO(lift): replace labels with translation keys
  const details = (
    <Collapse open={sheet || detailsOpen} id={detailsId}>
      <div>
        <div className="flex flex-col gap-3 pt-1">
          {/* The two panel treatments need no title; the others get one above */}
          <section className="flex flex-col gap-3" aria-label="What's included">
            {!hasPanel(included) && <h4 className={HEADING}>What&apos;s included</h4>}
            <IncludedSection b={b} variant={included} fill={fill} />
          </section>

          <section className="flex flex-col gap-3" aria-label="Macro averages">
            {/* Three separate tiles. No title: each label carries the average symbol */}
            <div>
              <dl className="grid grid-cols-3 gap-2">
                {[
                  { label: copy("card.nutritionProtein"), value: facts?.protein, unit: "g" },
                  { label: copy("card.nutritionFibre"), value: b.macros.fibre, unit: "g" },
                  { label: copy("card.nutritionKcal"), value: facts?.kcal },
                ].map((stat) => (
                  <div key={stat.label} className={`flex flex-col-reverse items-center gap-0.5 rounded-[14px] px-1 py-3 ${fill}`}>
                    <dt className="font-sans text-xs leading-4 tracking-[-0.24px] text-light-text">{stat.label}</dt>
                    <dd className="flex items-baseline gap-1 whitespace-nowrap">
                      <span className="font-book text-[34px] leading-[34px] tracking-[-0.68px] text-near-black lg:text-2xl lg:leading-[26px] lg:tracking-[-0.48px]">{stat.value}</span>
                      {stat.unit && <span className={`${SMALL} text-light-text`}>{stat.unit}</span>}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>
        </div>
      </div>
    </Collapse>
  );

  return (
    <article
      className={`${LAYOUT[layout]} rounded-2xl border border-dark/0 [transition:border-color_100ms_ease-out,opacity_200ms_ease-out] lg:hover:border-dark/8`}
      style={{ gridRow: `span ${OVERVIEW_ROW_COUNT}`, backgroundColor: b.colors.tile }}
      aria-label={b.title}
    >
      <div className={"contents"}>
        <div className="flex min-w-0 shrink-0 flex-col items-start gap-0">
          {/* The bundle name as a tag, in the bundle's own colour at full strength (the card background is the same colour at reduced opacity) */}
          <span className="rounded-full px-3 py-1 font-sans text-xs font-medium leading-4 tracking-[-0.24px] text-dark" style={{ backgroundColor: b.colors.tile.replace(/rgba\((.+),\s*[\d.]+\)/, "rgb($1)") }}>
            {b.title}
          </span>
          {/* A frame of 176px (or 208px for the new hero shots, 150px in the compare sheet, which is 124px on a phone) on a viewport 640px tall or more; on a phone with less room (in-app browsers) it shrinks with the viewport height, down to 124px. Fixed from lg. The old photo keeps its ratio and fills the width, so its top and bottom are cropped; the new one is shown whole */}
          <div className={`relative w-full shrink-0 overflow-clip rounded-[18px] ${sheet ? "h-[124px] lg:h-[150px]" : heroNew ? "h-[clamp(124px,32.5dvh,208px)] lg:h-[208px]" : "h-[clamp(124px,27.5dvh,176px)] lg:h-[176px]"}`}>
            <div className="absolute" style={b.art}>
              <Image src={heroNew ? b.heroImage : b.image} alt="" fill sizes="(min-width: 1024px) 272px, 100vw" className={heroNew ? "object-contain" : "object-cover"} />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <p className={`pr-4 font-book text-near-black ${sheet ? "text-2xl leading-6.5 tracking-[-0.48px]" : "text-[28px] leading-[30px] tracking-[-0.56px] lg:text-2xl lg:leading-7 lg:tracking-[-0.48px]"}`}>
            {facts?.headline}
          </p>
        </div>

        {/* One line: 4px either side of the dot, and 12px type in the narrow desktop columns. It still wraps as a last resort rather than overflow the card. */}
        <p className={`${SMALL} flex flex-wrap content-start gap-x-1 text-light-text lg:text-xs lg:leading-4 lg:tracking-[-0.24px]`}>
          <span className="whitespace-nowrap">{bundleCopy(b.key, "firstPoint")}</span>
          <span aria-hidden="true">
            ∙
          </span>
          <span className="whitespace-nowrap">{interpolate(copy("card.pricePoint"), { price: formatPrice(highlight.fromPerMeal, "EUR") })}</span>
        </p>

        {/* The details belong to the information, so they open here, above the decision: Continue always comes last. The sheet is for comparing, so there they are always open and have no toggle. */}
        <div className={sheet ? "pt-2" : "-mt-2"}>
          {!sheet && toggle}
          {details}
        </div>

      </div>

      <div
        className="mt-auto">
        {/* The same button as Continue, in 20% black, and not clickable: it is the bundle you are on */}
        <Button
          variant={current ? undefined : "dark"}
          type="button"
          sizeClassName="h-10 px-6 lg:h-12"
          className={`w-full justify-center font-sans text-xs font-medium uppercase leading-none tracking-[1.8px] ${current ? "cursor-default! bg-dark/20 text-dark backdrop-blur-md" : ""}`}
          aria-label={current ? `${b.title} is your current bundle` : `Continue with ${b.title}`}
          aria-disabled={current}
        >
          {current ? copy("card.currentBundle") : copy("card.continue")}
        </Button>
      </div>
    </article>
  );
}
