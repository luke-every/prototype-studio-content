"use client";

import { useState } from "react";
import type { Headline } from "./framing";
import { HeadlineWords } from "./ResultsHero";
import type { Routine } from "./routine";
import { RoutineSheet } from "./RoutineStory";
import type { BoxLine } from "./useBox";

type ProfileProps = {
  /** Their answers as one sentence: who, the goal, their week and what they look for */
  headline: Headline;
};

type RecommendationProps = {
  routine: Routine;
  lines: BoxLine[];
  /** Just the heading and the rules (A): no eyebrow and no opening paragraph, which the sheet then opens with */
  compact?: boolean;
  /** The full story is up, so Esc is its to take */
  onSheetChange: (open: boolean) => void;
};

const EYEBROW = "m-0 text-xs leading-4 font-medium tracking-[-0.24px] text-light-text";
const H2 = "mt-2 mb-0 font-book text-[28px] leading-[30px] tracking-[-0.56px] text-dark";

/**
 * B's consultation, after Typology and Hers: what they told us read back as a profile, then our
 * recommendation under a heading fitted to their goal — before the meals themselves as the routine.
 * D tells the same story as steps of the quiz of its own, in ConsultSteps.
 */
export function Consultation({ headline, ...recommendation }: ProfileProps & RecommendationProps) {
  return (
    <>
      <ProfileSection headline={headline} />
      <RecommendationSection {...recommendation} />
    </>
  );
}

/** 01: what they told us, as the one sentence */
export function ProfileSection({ headline }: ProfileProps) {
  return (
    <section className="mx-6 pt-12">
      {/* TODO(lift): replace with translation keys */}
      <p className={EYEBROW}>01 · What you told us</p>
      <h2 className={H2}>Your profile</h2>
      <div className="mt-5 rounded-3xl bg-light-brown px-5 py-5">
        <HeadlineWords headline={headline} className="m-0 font-book text-[22px] leading-8 tracking-[-0.44px] text-dark" />
      </div>
    </section>
  );
}

/** 02: our recommendation — the reasoning and the rules we picked their meals by; A has just the heading and the rules */
export function RecommendationSection({ routine, lines, compact = false, onSheetChange }: RecommendationProps) {
  const [open, setOpen] = useState<boolean>(false);
  const show = (next: boolean) => {
    setOpen(next);
    onSheetChange(next);
  };

  return (
    <section className="mx-6 pt-12">
      {/* TODO(lift): replace with translation key */}
      {!compact && <p className={EYEBROW}>02 · Our recommendation</p>}
      <h2 className={compact ? "m-0 font-book text-[28px] leading-[30px] tracking-[-0.56px] text-dark" : H2}>{routine.recommendation}</h2>
      {!compact && <p className="mt-3 mb-0 text-base leading-[22px] tracking-[-0.32px] text-dark">{routine.storyIntro}</p>}
      {/* A gives each rule a card of its own; B lists them on the page */}
      <ul className={`m-0 mt-6 flex list-none flex-col p-0 ${compact ? "gap-3" : "gap-6"}`}>
        {routine.principles.map((principle) => (
          <li key={principle.did} className={`flex gap-4 ${compact ? "items-start rounded-2xl border border-light-grey p-4" : "items-center"}`}>
            <span
              aria-hidden
              className={`flex shrink-0 items-center justify-center bg-light-brown leading-none ${
                compact ? "size-10 rounded-xl text-lg" : "size-12 rounded-2xl text-[22px]"
              }`}
            >
              {principle.icon}
            </span>
            <div className="min-w-0">
              <p className="m-0 text-base leading-[22px] font-medium tracking-[-0.32px] text-near-black">{compact ? principle.headline : principle.did}</p>
              <p className="mt-1 mb-0 text-sm leading-[18px] tracking-[-0.28px] text-light-text">{principle.short}</p>
            </div>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => show(true)}
        className="mt-6 cursor-pointer p-0 text-sm leading-[18px] font-medium tracking-[-0.28px] text-dark underline underline-offset-4"
      >
        {/* TODO(lift): replace with translation key */}
        Read more
      </button>
      {/* the sheet opens with the opening paragraph unless the page has just shown it */}
      <RoutineSheet routine={routine} lines={lines} open={open} intro={compact} onClose={() => show(false)} />
    </section>
  );
}

type ChecklistProps = {
  routine: Routine;
  lines: BoxLine[];
  /** In its own titled card on the white page (C), or as bare points straight under the hero's title (D) */
  tone: "page" | "hero";
};

/** What the routine delivers, ticked off: one number from their own meals per rule we picked them by */
export function RoutineChecklist({ routine, lines, tone }: ChecklistProps) {
  const points = (
    <ul className="m-0 flex list-none flex-col gap-3 p-0">
      {routine.principles.map((principle) => {
        const stat = principle.stat(lines);
        return (
          <li key={principle.did} className="flex items-start gap-3">
            <span
              aria-hidden
              className="mt-px flex size-5 shrink-0 items-center justify-center rounded-full bg-dark text-[10px] leading-none text-white"
            >
              ✓
            </span>
            <p className="m-0 text-base leading-[22px] tracking-[-0.32px] text-dark">
              <span className="font-medium">{stat.value}</span> {stat.label}
            </p>
          </li>
        );
      })}
    </ul>
  );
  if (tone === "hero") return points;
  return (
    <div className="rounded-3xl bg-light-brown px-5 py-5">
      {/* TODO(lift): replace with translation key */}
      <p className="m-0 mb-3 text-xs leading-4 font-medium tracking-[-0.24px] text-light-text">Your routine delivers</p>
      {points}
    </div>
  );
}
