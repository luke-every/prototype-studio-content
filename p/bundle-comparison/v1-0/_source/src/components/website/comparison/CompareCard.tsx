import type { ReactNode } from "react";
import Image from "next/image";
import { CheckedIcon, CloseIcon } from "@/components/icons";
import { Button } from "@/components/shared/Button";
import { INCLUDE_ROWS, isLeader, type Bundle, type MacroKey } from "./bundles";
import { FACTS } from "./BundleComparisonA.data";

const BODY = "font-sans text-sm leading-[19px] tracking-[-0.28px]";
const NUMERAL = "font-book text-lg leading-[22px] tracking-[-0.36px] text-near-black";
// Image, headline, nutrition, included, extras, action: every card spans the same rows so they line up across cards on desktop.
export const COMPARE_ROW_COUNT = 6;

// Main meals first, then breakfast and snacks
const ORDER = ["mains", "breakfast", "snacks"].map((key) => INCLUDE_ROWS.find((r) => r.key === key)).filter((r) => r !== undefined);

/** A titled group: related rows sit close together under a medium-weight title, and groups are set apart by space, not lines. */
function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-1 pt-6" aria-label={title}>
      <h4 className={`${BODY} font-medium text-near-black`}>{title}</h4>
      {children}
    </section>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex min-h-10 items-center justify-between gap-4 py-2">
      <span className={`${BODY} text-light-text`}>{label}</span>
      {children}
    </div>
  );
}

/** A nutrient row; the bundle that leads it is tinted in its own colour. */
function Macro({ label, macro, unit, b }: { label: string; macro: MacroKey; unit?: string; b: Bundle }) {
  return (
    <Row label={label}>
      <span className="-mr-2 inline-flex items-baseline gap-0.5 rounded-full px-2 py-0.5" style={isLeader(b, macro) ? { backgroundColor: b.colors.tile } : undefined}>
        <span className={NUMERAL}>{b.macros[macro]}</span>
        {unit && <span className={`${BODY} text-light-text`}>{unit}</span>}
      </span>
    </Row>
  );
}

/**
 * One card in the compare sheet: nutrients (protein, fibre, calories), what's included, then extras. The current bundle has no Continue.
 * Phone: the card is as tall as the sheet, its content scrolls inside it and the action sits over the bottom edge on white with a top border,
 * so the spacer after the extras lets the last row scroll clear of it. From lg the card is plain content in the shared grid rows.
 */
export function CompareCard({ b, current }: { b: Bundle; current: boolean }) {
  const headline = FACTS.find((f) => f.key === b.key)?.headline;

  return (
    <article
      className={`relative h-full overflow-hidden rounded-2xl border ${current ? "border-dark" : "border-light-grey-2"} lg:grid lg:h-auto lg:grid-rows-subgrid lg:overflow-visible lg:rounded-none lg:border-0`}
      style={{ gridRow: `span ${COMPARE_ROW_COUNT}` }}
      aria-label={b.title}
    >
      <div className="flex h-full flex-col overflow-y-auto p-4 lg:contents">
        <div className="relative aspect-[256/195] w-full shrink-0 overflow-clip rounded-[18px] lg:aspect-[256/215]" style={{ backgroundColor: b.colors.tile }}>
          <div className="absolute" style={b.art}>
            <Image src={b.image} alt="" fill sizes="(min-width: 1024px) 256px, 100vw" className="object-cover" />
          </div>
        </div>

        <div className="flex flex-col items-start gap-2 pt-3">
          <span className="rounded-full px-2.5 py-1 font-sans text-xs font-medium leading-4 tracking-[-0.24px] text-near-black lg:hidden" style={{ backgroundColor: b.colors.tile }}>
            {b.title}
          </span>
          <h3 className={`${BODY} hidden font-medium text-near-black lg:block`}>{b.title}</h3>
          {/* TODO(lift): replace with translation key */}
          <p className="font-book text-2xl leading-7 tracking-[-0.48px] text-near-black">{headline}</p>
        </div>

        {/* TODO(lift): replace labels with translation keys */}
        <Group title="Average per meal">
          <div className="flex flex-col divide-y divide-light-grey">
            <Macro label="Protein" macro="protein" unit="g" b={b} />
            <Macro label="Fibre" macro="fibre" unit="g" b={b} />
            <Macro label="Calories" macro="kcal" unit="kcal" b={b} />
          </div>
        </Group>

        <Group title="What's included">
          <ul className={`flex flex-wrap gap-x-3 gap-y-1 ${BODY}`}>
            {ORDER.map((row) => (
              <li
                key={row.key}
                className={`flex items-center gap-1 ${b.includes[row.key] ? "text-light-text" : "text-light-grey-3"}`}
                aria-label={b.includes[row.key] ? row.label : `${row.label}: not included`}
              >
                {b.includes[row.key] ? <CheckedIcon size={16} /> : <CloseIcon size={16} className="text-light-grey-3" />}
                {row.label}
              </li>
            ))}
          </ul>
        </Group>

        <Group title="Free extras">
          {b.gifts.length ? (
            <ul className={`flex flex-col gap-2 ${BODY} text-light-text`}>
              {b.gifts.map((gift) => (
                <li key={gift.name} className="flex items-center gap-2">
                  <span className="relative size-6 shrink-0 overflow-hidden rounded-md bg-light-grey">
                    <Image src={gift.image} alt="" fill sizes="24px" className="object-cover" />
                  </span>
                  {gift.name}
                </li>
              ))}
            </ul>
          ) : (
            <p className={`${BODY} text-light-grey-3`}>None</p>
          )}
        </Group>

        {/* Spacer: lets the extras scroll up clear of the action */}
        <div className="h-24 shrink-0 lg:hidden" aria-hidden="true" />
      </div>

      <div className="absolute inset-x-0 bottom-0 border-t border-light-grey bg-white p-4 lg:static lg:border-0 lg:px-0 lg:pb-0">
        {current ? (
          <p className={`${BODY} flex h-11 w-full items-center justify-center gap-1.5 rounded-full bg-off-white font-medium text-near-black`}>
            <CheckedIcon size={16} />
            {/* TODO(lift): replace with translation key */}
            You&apos;re viewing this bundle
          </p>
        ) : (
          <Button variant="dark" sizeClassName="h-11 px-6" className="w-full justify-center font-sans text-xs font-medium uppercase leading-none tracking-[1.8px]" aria-label={`Continue with ${b.title}`}>
            {/* TODO(lift): replace with translation key */}
            Continue
          </Button>
        )}
      </div>
    </article>
  );
}
