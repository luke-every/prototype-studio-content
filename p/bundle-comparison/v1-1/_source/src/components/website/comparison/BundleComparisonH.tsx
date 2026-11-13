import type { ReactNode } from "react";
import Image from "next/image";
import { Button } from "@/components/shared/Button";
import { BUNDLES, type Bundle, type Includes, type MacroKey } from "./bundles";
import { ComparisonFrame } from "./ComparisonFrame";
import { MEAL_CROPS, MealThumb } from "./MealThumb";

const BODY = "font-sans text-sm leading-[19px] tracking-[-0.28px]";

const MEALS: { key: keyof Includes; label: string }[] = [
  { key: "mains", label: "Lunch and dinner meals" },
  { key: "breakfast", label: "Breakfasts" },
  { key: "snacks", label: "Snacks" },
];

// TODO(lift): replace labels with translation keys
const MACROS: { key: MacroKey; label: string; unit: string }[] = [
  { key: "protein", label: "Protein", unit: "g" },
  { key: "fibre", label: "Fibre", unit: "g" },
  { key: "kcal", label: "Calories", unit: "kcal" },
];

/** A row in the box list: a 40×50 picture, then the name. */
function Item({ picture, label, free = false }: { picture: ReactNode; label: string; free?: boolean }) {
  return (
    <li className={`${BODY} flex items-center gap-3 text-near-black`}>
      {picture}
      {label}
      {free && (
        // TODO(lift): replace with translation key
        <span className="ml-auto shrink-0 font-sans text-xs font-medium leading-4 tracking-[0.6px] text-light-text">FREE</span>
      )}
    </li>
  );
}

/** Nutrition first, on the bundle colour: three numerals, the headline numbers of the box. */
function Nutrition({ b }: { b: Bundle }) {
  return (
    <section className="flex flex-col gap-3" aria-label="Average per meal">
      {/* TODO(lift): replace with translation key */}
      <h4 className={`${BODY} text-light-text`}>Average per meal</h4>
      <dl className="grid grid-cols-3 gap-2">
        {MACROS.map((m) => (
          <div key={m.key} className="flex flex-col-reverse gap-1">
            <dt className={`${BODY} text-light-text`}>{m.label}</dt>
            <dd className="flex items-baseline gap-0.5">
              <span className="font-book text-[34px] leading-[34px] tracking-[-0.68px] text-near-black lg:text-2xl lg:leading-7 lg:tracking-[-0.48px]">{b.macros[m.key]}</span>
              <span className={`${BODY} text-light-text`}>{m.unit}</span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/** Then what comes in the box, on white: the meal types it has, then any free extras in the same list with a FREE tag. */
function Contents({ b }: { b: Bundle }) {
  const has = MEALS.filter((m) => b.includes[m.key]);

  return (
    <section className="flex flex-col gap-3 rounded-[12px] bg-white p-4" aria-label="What's included">
      {/* TODO(lift): replace with translation key */}
      <h4 className={`${BODY} font-medium text-near-black`}>What&apos;s included</h4>
      <ul className="flex flex-col gap-2">
        {has.map((m) => (
          <Item key={m.key} picture={<MealThumb crop={MEAL_CROPS[m.key]} tile={b.colors.tile} className="h-[50px] w-10" />} label={m.label} />
        ))}
        {b.gifts.map((gift) => (
          <Item
            key={gift.name}
            free
            label={gift.name}
            picture={
              <span className="relative h-[50px] w-10 shrink-0 overflow-hidden rounded-lg bg-off-white">
                <Image src={gift.image} alt="" fill sizes="40px" className="object-contain" />
              </span>
            }
          />
        ))}
      </ul>
    </section>
  );
}

/** One bundle as a single card in its own colour: photo and name, nutrition, what is in the box, then Continue. */
function BundleBox({ b }: { b: Bundle }) {
  return (
    <article className="flex flex-col gap-4 rounded-[24px] p-4" style={{ backgroundColor: b.colors.tile }} aria-label={b.title}>
      <div className="flex items-center gap-3 lg:flex-col lg:items-start">
        <div className="relative size-16 shrink-0 overflow-clip rounded-[14px]" style={{ backgroundColor: b.colors.tile }}>
          <div className="absolute" style={b.art}>
            <Image src={b.image} alt="" fill sizes="64px" className="object-cover" />
          </div>
        </div>
        <div className="flex flex-col gap-0.5">
          <h3 className="font-book text-2xl leading-7 tracking-[-0.48px] text-near-black">{b.title}</h3>
          {/* TODO(lift): replace with translation key */}
          <p className={`${BODY} text-light-text`}>{b.shortStory}</p>
        </div>
      </div>

      <Nutrition b={b} />
      <Contents b={b} />

      <Button
        variant="dark"
        sizeClassName="h-11 px-6"
        className="w-full justify-center font-sans text-xs font-medium uppercase leading-none tracking-[1.8px]"
        aria-label={`Continue with ${b.title}`}
        type="button"
      >
        {/* TODO(lift): replace with translation key */}
        Continue
      </Button>
    </article>
  );
}

/** H: each bundle's box in its own colour. Nutrition per meal on top, then a list of what comes in the box with product photos. */
export function BundleComparisonH() {
  return (
    <ComparisonFrame>
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-4 lg:gap-x-6">
        {BUNDLES.map((b) => (
          <BundleBox key={b.key} b={b} />
        ))}
      </div>
    </ComparisonFrame>
  );
}
