"use client";

import { useState } from "react";
import type { Headline } from "./framing";
import { HeadlineWords } from "./ResultsHero";
import type { Routine } from "./routine";
import { FactsSheet } from "./FactsSheet";
import { RoutineSheet } from "./RoutineStory";
import type { BoxLine } from "./useBox";

type ProfileProps = {
  /** Their answers as one sentence: who, the goal, their week and what they look for */
  headline: Headline;
  /** The section's title, "Your profile" unless the sentence is about something narrower */
  title?: string;
  /** A border round the sentence, with the colour on its answers instead of behind it */
  outlined?: boolean;
};

type RecommendationProps = {
  routine: Routine;
  lines: BoxLine[];
  /** Just the heading and the rules (A): no eyebrow and no opening paragraph, which the sheet then opens with */
  compact?: boolean;
  /** The paragraph under the heading, unless the page goes straight to the rules */
  intro?: boolean;
  /** The full story is up, so Esc is its to take */
  onSheetChange: (open: boolean) => void;
};

/** The heading's lead-in, so what follows it is the key words: "What your body needs to" + "build muscle" */
const LEAD = /^What your (?:body|gut) needs (?:(?:to|for|from) )?/;

const EYEBROW =
  "m-0 text-xs leading-4 font-medium tracking-[-0.24px] text-light-text";
const H2 =
  "mt-2 mb-0 font-book text-[28px] leading-[30px] tracking-[-0.56px] text-dark";

/**
 * B's consultation, after Typology and Hers: what they told us read back as a profile, then our
 * recommendation under a heading fitted to their goal — before the meals themselves as the routine.
 */
export function Consultation({
  headline,
  title,
  outlined,
  ...recommendation
}: ProfileProps & RecommendationProps) {
  return (
    <>
      <ProfileSection headline={headline} title={title} outlined={outlined} />
      <RecommendationSection {...recommendation} />
    </>
  );
}

/** 01: what they told us, as the one sentence */
export function ProfileSection({
  headline,
  title = "Your profile",
  outlined = false,
}: ProfileProps) {
  return (
    <section className="mx-6 pt-12">
      {/* TODO(lift): replace with translation keys */}
      <p className={EYEBROW}>01 · What you told us</p>
      <h2 className={H2}>{title}</h2>
      <div
        className={`mt-5 rounded-3xl px-5 py-5 ${outlined ? "border border-light-brown" : "bg-(--bundle)/32"}`}
      >
        <HeadlineWords
          headline={headline}
          chipClassName={outlined ? "bg-(--bundle)/32" : undefined}
          className="m-0 font-book text-[22px] leading-8 tracking-[-0.44px] text-dark"
        />
      </div>
    </section>
  );
}

/** 02: our recommendation — the reasoning and the rules we picked their meals by; A has just the heading and the rules */
export function RecommendationSection({
  routine,
  lines,
  compact = false,
  intro = true,
  onSheetChange,
}: RecommendationProps) {
  const [open, setOpen] = useState<boolean>(false);
  const show = (next: boolean) => {
    setOpen(next);
    onSheetChange(next);
  };
  const lead = LEAD.exec(routine.recommendation)?.[0] ?? "";
  const key = routine.recommendation.slice(lead.length);

  return (
    <section className="mx-6 pt-12">
      {/* TODO(lift): replace with translation key */}
      {!compact && <p className={EYEBROW}>02 · The facts behind your plan</p>}
      <h2
        className={
          compact
            ? "m-0 font-book text-[28px] leading-[30px] tracking-[-0.56px] text-dark"
            : H2
        }
      >
        {lead}
        <span className="text-(--bundle-ink,var(--color-dark))">{key}</span>
      </h2>
      {!compact && intro && (
        <p className="mt-3 mb-0 text-base leading-[22px] tracking-[-0.32px] text-dark">
          {routine.storyIntro}
        </p>
      )}
      {/* A gives each rule a bordered card of its own, with the button under the last; B's old page cards them with a link */}
      <ul
        className={`m-0 flex list-none flex-col p-0 ${compact ? "mt-6 gap-3" : "mt-4 gap-2"}`}
      >
        {routine.principles.map((principle) => (
          <li
            key={principle.did}
            className={`flex items-start gap-4 rounded-2xl border ${compact ? "border-light-grey p-4" : "border-light-brown p-3"}`}
          >
            <span
              aria-hidden
              className={`flex shrink-0 items-center justify-center bg-light-brown leading-none ${
                compact
                  ? "size-10 rounded-xl text-lg"
                  : "size-12 rounded-2xl text-[22px]"
              }`}
            >
              {principle.icon}
            </span>
            <div className="min-w-0">
              <p
                className={`m-0 font-medium text-near-black ${compact ? "text-base leading-[22px] tracking-[-0.32px]" : "text-sm leading-[18px] tracking-[-0.28px]"}`}
              >
                {principle.headline}
              </p>
              <p
                className={`mb-0 text-sm leading-[18px] tracking-[-0.28px] text-light-text ${compact ? "mt-1" : "mt-0.5"}`}
              >
                {principle.short}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => show(true)}
        className={
          compact
            ? "mt-6 cursor-pointer p-0 text-sm leading-[18px] font-medium tracking-[-0.28px] text-dark underline underline-offset-4"
            : "mt-2 flex h-10 w-full cursor-pointer items-center justify-center rounded-[30px] border border-light-brown bg-transparent p-0 text-sm leading-[18px] font-medium tracking-[-0.28px] text-near-black"
        }
      >
        {/* TODO(lift): replace with translation key */}
        {compact ? "Read more" : "Learn more"}
      </button>
      {/* A's full story opens as chapters; the facts sheet is for the bordered cards */}
      {compact ? (
        <RoutineSheet
          routine={routine}
          lines={lines}
          open={open}
          intro
          onClose={() => show(false)}
        />
      ) : (
        <FactsSheet routine={routine} open={open} onClose={() => show(false)} />
      )}
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
      <p className="m-0 mb-3 text-xs leading-4 font-medium tracking-[-0.24px] text-light-text">
        Your routine delivers
      </p>
      {points}
    </div>
  );
}
