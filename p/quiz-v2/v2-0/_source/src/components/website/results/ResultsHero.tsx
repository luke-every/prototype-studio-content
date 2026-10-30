"use client";

import Image from "next/image";
import { Fragment, type CSSProperties } from "react";
import { revealMotion } from "@/lib/step-motion";
import {
  headlineFor,
  heroTilesFor,
  type Framing,
  type Headline,
} from "./framing";
import type { Answers } from "../quiz/types";
import { StatBar } from "./StatBar";
import type { Box } from "./useBox";

type Props = {
  ref?: React.Ref<HTMLDivElement>;
  box: Box;
  /** The loader has cleared: the hero's elements arrive */
  revealed: boolean;
  /** Arrived without a loader, so nothing animates in */
  instant: boolean;
  /** How the headline shares out the answers (see framing.ts) */
  framing: Framing;
  answers: Answers;
  /** The three numbers sit in the hero, unless the page shows them under "What's in your box" */
  showTiles?: boolean;
  /** Which sentence, when not the framing's own: A says the goal and the challenge it gets them past */
  headline?: Headline;
  /** The "Your routine" title, unless the hero's content opens on its own (C's goal card) */
  showTitle?: boolean;
  /** Their answers as one sentence, unless the page tells it somewhere else (B's profile) */
  showHeadline?: boolean;
  /** A: Eve in a white circle over the title, which then introduces the plan */
  introducing?: boolean;
  /** Eve in her circle over the title, when introducing */
  showEve?: boolean;
  /** 16px between the hero's elements instead of 24 */
  tight?: boolean;
  /** What the title calls it: "box", or "routine" for B */
  noun?: "box" | "routine";
  /** Shown under the title, arriving with the sentence: D's checklist of what the routine delivers */
  children?: React.ReactNode;
};

/** The quiz is done and this is the box it made: their answers as one sentence, then the box in three numbers */
export function ResultsHero({
  ref,
  box,
  revealed,
  instant,
  framing,
  answers,
  showTiles = true,
  headline: said,
  showHeadline = true,
  showTitle = true,
  introducing = false,
  showEve = true,
  tight = false,
  noun = "box",
  children,
}: Props) {
  const title = revealMotion(0, revealed, instant);
  const words = revealMotion(1, revealed, instant);
  const facts = revealMotion(2, revealed, instant);
  const headline = said ?? headlineFor(framing, answers, box.engine);
  const tiles = heroTilesFor(framing, answers, box);
  return (
    <div
      ref={ref}
      className={`relative -mt-8 flex flex-col rounded-[32px] bg-(--bundle,var(--color-light-brown)) px-6 py-12 ${tight ? "gap-4" : "gap-6"}`}
    >
      {showTitle && (
        <div
          className={`flex flex-col gap-4 ${title.className}`}
          style={title.style}
        >
          {introducing && showEve && (
            <span className="flex size-[120px] items-center justify-center rounded-full bg-white">
              <Image
                src="img/eve-1.svg"
                alt=""
                width={104}
                height={104}
                unoptimized
              />
            </span>
          )}
          {/* TODO(lift): replace with translation keys */}
          <h1 className="m-0 font-book text-[34px] leading-[34px] tracking-[-0.68px] text-dark">
            {introducing ? (
              "Introducing your personalised plan"
            ) : (
              <>
                Your <i className="font-book-italic">personalised</i> {noun}
              </>
            )}
          </h1>
        </div>
      )}
      {showHeadline && (
        <HeadlineWords
          headline={headline}
          className={`m-0 font-book text-2xl leading-[34px] tracking-[-0.48px] text-dark ${words.className}`}
          style={words.style}
        />
      )}
      {children && (
        <div className={words.className} style={words.style}>
          {children}
        </div>
      )}
      {showTiles && (
        <div
          className={`flex flex-col gap-4 ${facts.className}`}
          style={facts.style}
        >
          <StatBar tiles={tiles} tone="hero" />
        </div>
      )}
    </div>
  );
}

type WordsProps = {
  headline: Headline;
  className: string;
  style?: CSSProperties;
  /** The chip behind each answer, white unless the sentence sits on something white */
  chipClassName?: string;
  /** A heading where the sentence is the title of a section */
  as?: "p" | "h2";
};

/** Their answers as one sentence, each answer on a white chip */
export function HeadlineWords({
  headline,
  className,
  style,
  chipClassName = "bg-white",
  as: Tag = "p",
}: WordsProps) {
  return (
    <Tag className={className} style={style}>
      {headline.map((part, i) =>
        typeof part === "string" ? (
          <Fragment key={i}>{part}</Fragment>
        ) : (
          <span
            key={i}
            className={`rounded-[10px] px-1.5 box-decoration-clone ${chipClassName}`}
          >
            {part.answer}
          </span>
        ),
      )}
    </Tag>
  );
}
