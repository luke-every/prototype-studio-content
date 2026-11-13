import Image from "next/image";
import { ChevronDownIcon } from "@/components/icons";
import { Button } from "@/components/shared/Button";
import { Collapse } from "@/components/website/Collapse";
import { formatPrice } from "@/lib/format";
import { useControl } from "@/lib/studio-controls";
import { cardGradient, type Bundle } from "./bundles";
import { FACTS } from "./BundleComparisonA.data";
import { hasPanel, IncludedSection } from "./IncludedSection";

const SMALL = "font-sans text-sm leading-[18px] tracking-[-0.28px]";
const HEADING = `${SMALL} font-medium text-near-black`;
// Image, name + pitch, facts line, details toggle + details, action: every card spans the same rows so they line up across cards.
export const OVERVIEW_ROW_COUNT = 5;

// TODO(lift): sample data — the macro callout comes from the nutrition fact sheet (see BundleComparisonA.data.ts).
// Only Protein's price is real (pdp-protein template, largest box); the other three are placeholders, replace with Shopify / Eversubs.
const HIGHLIGHTS: Record<string, { macro: string; fromPerMeal: number }> = {
  protein: { macro: "Ø 26 g protein /meal", fromPerMeal: 5.89 },
  immunity: { macro: "Immunity support", fromPerMeal: 6.29 },
  "body-balance": { macro: "Ø 468 kcal /meal", fromPerMeal: 5.49 },
  "new-parent": { macro: "All mealtimes covered", fromPerMeal: 6.49 },
};

const LAYOUT = {
  // The single column is minmax(0, 1fr) and the card has min-w-0, so nothing inside (a long tag, a photo) can push the card or its image frame wider than its slot.
  // One inset (24px phone, 16px desktop) and one 12px gap between sections, set on the card itself; nothing inside adds its own outer padding.
  stacked: "flex min-w-0 flex-col gap-3 p-6 lg:grid lg:grid-cols-[minmax(0,1fr)] lg:grid-rows-subgrid lg:p-4",
  swipe: "grid min-w-0 snap-start grid-cols-[minmax(0,1fr)] grid-rows-subgrid gap-y-3 p-6 lg:p-4",
  // Phone: as tall as the tallest card; the sheet scrolls all the cards together, and the action sticks to the bottom edge.
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
 * In the sheet on a phone all the cards scroll together, and each Continue sticks to the bottom edge.
 */
export function OverviewCard({ b, layout, current = false, detailsOpen = false, onToggleDetails }: Props) {
  const sheet = layout === "sheet";
  const highlight = HIGHLIGHTS[b.key];
  // Studio control "card": the bundle colour as the card background, or the same card with the colour fading to white from top to bottom.
  const gradient = useControl("card") === "gradient";
  const heroNew = useControl("images") === "new";
  const included = "stack";
  // Colour card: tints of dark brown for the panels, hairlines and tiles, which sit better on a colour than a solid grey would.
  // The gradient card has no panel fill: the includes block and the macro tiles are outlined in grey instead.
  const fill = gradient ? "border border-light-grey" : "bg-dark/6";
  // Desktop hover (same on the nav cards): the card grows by 1.5% (a transform), so nothing around it moves.

  const facts = FACTS.find((f) => f.key === b.key);
  const detailsId = `details-${layout}-${b.key}`;

  const toggle = (
    <button
      type="button"
      onClick={onToggleDetails}
      className={`${SMALL} flex h-10 w-fit cursor-pointer items-center gap-1.5 font-medium text-near-black`}
      aria-expanded={detailsOpen}
      aria-controls={detailsId}
      aria-label={`${detailsOpen ? "Hide details" : "See more details"}: ${b.title}`}
    >
      {/* TODO(lift): replace with translation key */}
      {detailsOpen ? "Hide details" : "See more details"}
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
                  { label: "Ø Protein", value: facts?.protein, unit: "g" },
                  { label: "Ø Fibre", value: b.macros.fibre, unit: "g" },
                  { label: "Ø kcal", value: facts?.kcal },
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
      className={`${LAYOUT[layout]} rounded-2xl border transition duration-200 ease-out lg:hover:scale-[1.015] ${gradient ? "border-light-grey" : "border-transparent"}`}
      style={{ gridRow: `span ${OVERVIEW_ROW_COUNT}`, backgroundColor: gradient ? undefined : b.colors.tile, backgroundImage: gradient ? cardGradient(b) : undefined }}
      aria-label={b.title}
    >
      <div className={"contents"}>
        <div className="flex min-w-0 shrink-0 flex-col items-start gap-0">
          {/* The bundle name as a tag, in the bundle's own colour at full strength (the card background is the same colour at reduced opacity) */}
          <span className="rounded-full px-3 py-1 font-sans text-xs font-medium leading-4 tracking-[-0.24px] text-dark" style={{ backgroundColor: b.colors.tile.replace(/rgba\((.+),\s*[\d.]+\)/, "rgb($1)") }}>
            {b.title}
          </span>
          {/* A fixed frame (176px, or 208px for the new hero shots, 150px in the compare sheet): the old photo keeps its ratio and fills the width, so its top and bottom are cropped; the new one is shown whole */}
          <div className={`relative w-full shrink-0 overflow-clip rounded-[18px] ${sheet ? "h-[150px]" : heroNew ? "h-[208px]" : "h-[176px]"}`}>
            <div className="absolute" style={b.art}>
              <Image src={heroNew ? b.heroImage : b.image} alt="" fill sizes="(min-width: 1024px) 272px, 100vw" className={heroNew ? "object-contain" : "object-cover"} />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          {/* TODO(lift): replace with translation key */}
          <p className={`pr-4 font-book text-near-black ${sheet ? "text-2xl leading-6.5 tracking-[-0.48px]" : "text-[28px] leading-[30px] tracking-[-0.56px] lg:text-2xl lg:leading-7 lg:tracking-[-0.48px]"}`}>
            {facts?.headline}
          </p>
        </div>

        {/* TODO(lift): replace with translation keys */}
        {/* One line: 4px either side of the dot, and 12px type in the narrow desktop columns. It still wraps as a last resort rather than overflow the card. */}
        <p className={`${SMALL} flex flex-wrap content-start gap-x-1 text-light-text lg:text-xs lg:leading-4 lg:tracking-[-0.24px]`}>
          <span className="whitespace-nowrap">{highlight.macro}</span>
          <span aria-hidden="true">
            ∙
          </span>
          <span className="whitespace-nowrap">From {formatPrice(highlight.fromPerMeal, "EUR")} /meal</span>
        </p>

        {/* The details belong to the information, so they open here, above the decision: Continue always comes last. The sheet is for comparing, so there they are always open and have no toggle. */}
        <div className={sheet ? "pt-2" : "-mt-2"}>
          {!sheet && toggle}
          {details}
        </div>

      </div>

      {/* In the sheet the action sticks to the bottom edge of the scrolling sheet with no border or background, so the content scrolls visibly behind it. */}
      <div
        className={sheet ? "sticky bottom-5 mt-auto lg:static" : "mt-auto"}>
        {/* The same button as Continue, in 20% black, and not clickable: it is the bundle you are on */}
        <Button
          variant={current ? undefined : "dark"}
          type="button"
          sizeClassName="h-12 px-6"
          className={`w-full justify-center font-sans text-xs font-medium uppercase leading-none tracking-[1.8px] ${current ? "cursor-default! bg-dark/20 text-dark" : ""}`}
          aria-label={current ? `${b.title} is your current bundle` : `Continue with ${b.title}`}
          aria-disabled={current}
        >
          {/* TODO(lift): replace with translation key */}
          {current ? "Current bundle" : "Continue"}
        </Button>
      </div>
    </article>
  );
}
