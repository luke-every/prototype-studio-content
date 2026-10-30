"use client";

import { useState } from "react";
import { ChevronDownIcon } from "@/components/icons";
import type { Answers } from "../quiz/types";
import type { HeroTile } from "./framing";
import type { Routine } from "./routine";
import { Cited, SourceList } from "./sources";

type Props = {
  routine: Routine;
  answers: Answers;
  /** The box's three averages, under the rules */
  tiles: HeroTile[];
};

// TODO(lift): sample data — replace with the goal and driver names from the CMS
/** What the plan was built around, as the end of "How we built your plan around …": their reason where they gave one, the goal otherwise */
const AROUND: Record<string, string> = {
  muscle: "building muscle",
  lean: "staying lean and healthy",
  energy: "more energy",
  full: "staying full for longer",
  meatless: "protein without meat",
  regain: "getting back on track",
  maintain: "feeling comfortable",
  postpartum: "eating well as a new parent",
  better: "a more balanced diet",
  gut: "a healthier gut",
};
/** The weight reasons have their own words: a doctor’s advice reads the same as wanting to feel lighter */
const AROUND_WEIGHT: Record<string, string> = {
  energy: "feeling lighter",
  doctor: "feeling lighter",
};
/**
 * A-2's first section: how the plan was built, the goal's story in a line or two, the three rules as
 * accordions that open to the fuller explanation, and the three averages the meals come to.
 */
export function HowWeBuilt({ routine, answers, tiles }: Props) {
  const [openRow, setOpenRow] = useState<number | null>(null);
  /* the story is of what we chose, so it keeps the points about taste and ratings that A-1's facts leave out */
  const points = routine.principles.filter(
    (principle) => principle.only !== "a1",
  );
  const goal = answers.goal[0];
  const around =
    goal === "portions"
      ? (AROUND_WEIGHT[answers.whyWeight[0]] ?? AROUND[answers.whyWeight[0]])
      : goal === "protein"
        ? AROUND[answers.whyFitness[0]]
        : AROUND[goal];
  return (
    <section className="mx-6 pt-12">
      {/* TODO(lift): replace with translation keys */}
      <h2 className="m-0 font-book text-[28px] leading-8 tracking-[-0.56px] text-dark">
        How we built your plan
        {around && (
          <>
            {" "}
            around{" "}
            <span className="text-(--bundle-ink,var(--color-dark))">
              {around}
            </span>
          </>
        )}
      </h2>
      <p className="mt-2 mb-0 text-base leading-[22px] tracking-[-0.32px] text-dark">
        {routine.storyIntro}
      </p>
      <ul className="m-0 mt-4 flex list-none flex-col rounded-2xl border border-light-brown px-3 py-0">
        {points.map((principle, i) => {
          const on = openRow === i;
          return (
            <li
              key={principle.did}
              className={i > 0 ? "border-t border-light-brown" : ""}
            >
              <button
                type="button"
                onClick={() => setOpenRow(on ? null : i)}
                aria-expanded={on}
                className="flex w-full cursor-pointer items-center gap-4 border-0 bg-transparent p-0 py-3 text-left"
              >
                <span
                  aria-hidden
                  className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-light-brown text-[22px] leading-none"
                >
                  {principle.icon}
                </span>
                <span className="min-w-0 flex-1 text-sm leading-[19px] tracking-[-0.28px] text-near-black">
                  {principle.title}
                </span>
                <ChevronDownIcon
                  size={10}
                  className={`shrink-0 text-near-black transition-transform duration-300 ease-ui ${on ? "rotate-180" : ""}`}
                />
              </button>
              <div
                className={`grid transition-[grid-template-rows] duration-300 ease-ui ${on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
              >
                <div className="overflow-hidden">
                  <p className="m-0 mb-3 text-sm leading-[19px] tracking-[-0.28px] text-light-text">
                    <Cited
                      text={`${principle.why}${principle.facts ? ` ${principle.facts}` : ""}`}
                      order={principle.sources}
                    />
                  </p>
                  <SourceList order={principle.sources} className="mb-3" />
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="mt-4 flex flex-col items-center gap-2.5 rounded-2xl border border-light-brown px-4 pt-4 pb-3">
        <ul className="m-0 grid w-full list-none grid-cols-3 gap-4 p-0">
          {tiles.map(({ key, value, unit, label }) => (
            <li key={key} className="flex flex-col items-center gap-0.5">
              <span className="flex items-baseline gap-0.5 text-dark">
                <span className="font-book text-2xl leading-[26px] tracking-[-0.48px]">
                  {value}
                </span>
                {unit && (
                  <span className="text-sm leading-[19px] tracking-[-0.28px]">
                    {unit}
                  </span>
                )}
              </span>
              <span className="text-sm leading-[19px] tracking-[-0.28px] text-light-text">
                {label.replace(/^Ø /, "")}
              </span>
            </li>
          ))}
        </ul>
        <p className="m-0 text-sm leading-[19px] tracking-[-0.28px] text-light-text">
          Averages per meal
        </p>
      </div>
    </section>
  );
}
