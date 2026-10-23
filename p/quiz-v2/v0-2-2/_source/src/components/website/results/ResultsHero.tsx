"use client";

import { Fragment } from "react";
import { revealMotion } from "@/lib/step-motion";
import { listOf } from "./copy";
import { headlineFor, heroTilesFor, type Framing } from "./framing";
import type { Answers } from "../quiz/types";
import { StatBar } from "./StatBar";
import type { Box } from "./useBox";

type Props = {
  ref?: React.Ref<HTMLDivElement>;
  box: Box;
  allergens: string[];
  /** The loader has cleared: the hero's elements arrive */
  revealed: boolean;
  /** Arrived without a loader, so nothing animates in */
  instant: boolean;
  /** How the headline shares out the answers (see framing.ts) */
  framing: Framing;
  answers: Answers;
  /** The three numbers sit in the hero, unless the page shows them under "What's in your box" */
  showTiles?: boolean;
};

/** The quiz is done and this is the box it made: their answers as one sentence, then the box in three numbers */
export function ResultsHero({ ref, box, allergens, revealed, instant, framing, answers, showTiles = true }: Props) {
  const title = revealMotion(0, revealed, instant);
  const words = revealMotion(1, revealed, instant);
  const facts = revealMotion(2, revealed, instant);
  const { fallback } = box.recommendation;
  const headline = headlineFor(framing, answers, box.engine);
  const tiles = heroTilesFor(framing, answers, box);
  return (
    <div ref={ref} className="relative -mt-8 flex flex-col gap-6 rounded-[32px] bg-light-brown px-6 pt-10 pb-8">
      <div className={`flex flex-col gap-3 ${title.className}`} style={title.style}>
        {/* TODO(lift): replace with translation keys */}
        <p className="m-0 text-xs leading-4 font-medium tracking-[-0.24px] text-dark">BASED ON YOUR TASTE PROFILE</p>
        <h1 className="m-0 font-book text-[34px] leading-[34px] tracking-[-0.68px] text-dark">
          {fallback ? (
            <>
              Your box,
              <br />
              <i className="font-book-italic">without {listOf(allergens)}</i>
            </>
          ) : (
            <>
              Your <i className="font-book-italic">personalised</i> box
            </>
          )}
        </h1>
      </div>
      <p className={`m-0 font-book text-2xl leading-[34px] tracking-[-0.48px] text-dark ${words.className}`} style={words.style}>
        {headline.map((part, i) =>
          typeof part === "string" ? (
            <Fragment key={i}>{part}</Fragment>
          ) : (
            <span key={i} className="rounded-[10px] bg-white px-1.5 box-decoration-clone">
              {part.answer}
            </span>
          ),
        )}
      </p>
      <div className={`flex flex-col gap-4 ${facts.className}`} style={facts.style}>
        {showTiles && <StatBar tiles={tiles} tone="hero" />}
      </div>
    </div>
  );
}
