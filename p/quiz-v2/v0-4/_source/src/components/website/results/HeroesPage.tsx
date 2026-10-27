"use client";

import { allergensOf } from "./copy";
import { headlineAngles } from "./framing";
import { ResultsHero } from "./ResultsHero";
import type { ResultsPageProps } from "./types";
import { useBox } from "./useBox";

const LABEL = "mx-6 mt-0 mb-10 text-xs leading-4 font-medium tracking-[-0.24px] text-light-text";
const SECTION = "mx-6 mt-0 mb-2 font-book text-2xl leading-6.5 tracking-[-0.48px] text-dark";

// TODO(lift): prototype reference only — not a results page
/**
 * A reference sheet. First the heroes C and D had before both became new variants: C shared the answers
 * out as food then who you are, with its three numbers; D as why and preferences, its three numbers
 * (meals, heat, plant-based) brought up into the hero. Then the five angles proposed for A's sentence,
 * each in a real hero with the same answers, so they can be compared as the results would show them.
 */
export function HeroesPage({ answers }: ResultsPageProps) {
  const box = useBox(answers);
  const allergens = allergensOf(answers);
  const hero = { box, allergens, revealed: true, instant: true, answers, framing: 1 as const };
  const old: { label: string; framing: 2 | 3 }[] = [
    { label: "Old C · Food + who you are", framing: 3 },
    { label: "Old D · Why + preferences", framing: 2 },
  ];
  return (
    <div className="scrollbar-hide absolute inset-0 overflow-y-auto overscroll-contain bg-white pt-10 pb-16">
      <h2 className={SECTION}>Old heroes</h2>
      <p className="mx-6 mt-0 mb-10 text-sm leading-[18px] tracking-[-0.28px] text-light-text">C and D before they became new variants</p>
      {old.map((item) => (
        <section key={item.label} className="mb-14">
          <p className={LABEL}>{item.label}</p>
          <ResultsHero {...hero} framing={item.framing} />
        </section>
      ))}

      <h2 className={`${SECTION} mt-6`}>Headline angles</h2>
      <p className="mx-6 mt-0 mb-10 text-sm leading-[18px] tracking-[-0.28px] text-light-text">
        The ways A&rsquo;s sentence could go, with these answers
      </p>
      {headlineAngles(answers, box.engine).map((angle) => (
        <section key={angle.label} className="mb-14">
          <p className={LABEL}>{angle.label}</p>
          <ResultsHero {...hero} headline={angle.headline} showTiles={false} />
        </section>
      ))}
    </div>
  );
}
