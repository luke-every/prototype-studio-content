"use client";

import { useState } from "react";
import { ChevronDownIcon, ChevronRightIcon } from "@/components/icons";
import { RoutineChecklist } from "./Consultation";
import type { Routine } from "./routine";
import { stripCites } from "./sources";
import { RoutineSheet } from "./RoutineStory";
import type { BoxLine } from "./useBox";

type Props = {
  routine: Routine;
  lines: BoxLine[];
  /** One execution on its own, without its review label; every execution on the review sheet otherwise */
  only?: "ledger";
  /** The ledger's rows open to the fuller explanation, not the one line */
  deep?: boolean;
  /** The section's title in place of the routine's own */
  headline?: React.ReactNode;
  /** The full story is up, so Esc is its to take */
  onSheetChange: (open: boolean) => void;
};

type BriefProps = {
  routine: Routine;
  lines: BoxLine[];
  /** Opens the full story */
  onMore: () => void;
};

const LINK =
  "mt-5 cursor-pointer p-0 text-sm leading-[18px] font-medium tracking-[-0.28px] text-dark underline underline-offset-4";
const ICON =
  "flex shrink-0 items-center justify-center bg-light-brown leading-none";

/**
 * A's recommendation, condensed: the same three rules as A's cards, in several executions to choose between.
 * Each says the rules as briefly as it can and leaves the reasoning to the full story behind it.
 */
// TODO(lift): review only (H shows all of them) — pick one, then drop the others and the labels
export function RoutineBriefs({
  routine,
  lines,
  only,
  deep,
  headline,
  onSheetChange,
}: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const show = (next: boolean) => {
    setOpen(next);
    onSheetChange(next);
  };
  const brief: BriefProps = { routine, lines, onMore: () => show(true) };

  /* the ledger's rows open in place, so it has no full story behind it */
  if (only === "ledger") {
    return (
      <Frame routine={routine} headline={headline}>
        <Ledger {...brief} deep={deep} />
      </Frame>
    );
  }

  const sheet = (
    <RoutineSheet
      routine={routine}
      lines={lines}
      open={open}
      intro
      onClose={() => show(false)}
    />
  );
  return (
    <>
      <Frame name="C1 · Highlights" routine={routine}>
        <Highlights {...brief} />
      </Frame>
      <Frame name="C3 · Your numbers" routine={routine}>
        <Numbers {...brief} />
      </Frame>
      <Frame name="C5 · Swipe" routine={routine} bleed>
        <Cards {...brief} />
      </Frame>
      <Frame name="C6 · Ledger" routine={routine}>
        <Ledger {...brief} />
      </Frame>
      <Frame name="C8 · Ticked off" routine={routine}>
        <div className="mt-5">
          <RoutineChecklist routine={routine} lines={lines} tone="page" />
        </div>
        <button type="button" onClick={brief.onMore} className={LINK}>
          {/* TODO(lift): replace with translation key */}
          Read the full story
        </button>
      </Frame>
      <Frame name="C10 · Numbered" routine={routine}>
        <Numbered {...brief} />
      </Frame>
      <Frame name="C11 · Lead with one" routine={routine}>
        <Lead {...brief} />
      </Frame>
      <Frame name="C12 · Tabs" routine={routine}>
        <Tabs {...brief} />
      </Frame>
      {sheet}
    </>
  );
}

type FrameProps = {
  /** The review label; left off where the page has settled on this one */
  name?: string;
  routine: Routine;
  children: React.ReactNode;
  headline?: React.ReactNode;
  /** The content runs to the screen's edges, so the section has no side margin of its own */
  bleed?: boolean;
};

function Frame({
  name,
  routine,
  headline,
  children,
  bleed = false,
}: FrameProps) {
  return (
    <section className={`${bleed ? "" : "mx-6"} pt-12`}>
      <div className={bleed ? "mx-6" : ""}>
        {name && (
          <p className="m-0 mb-3 inline-block rounded-full border border-dashed border-light-grey-3 px-2 py-0.5 text-xs leading-4 tracking-[-0.24px] text-light-text">
            {name}
          </p>
        )}
        {headline ?? (
          <h2 className="m-0 font-book text-[28px] leading-[30px] tracking-[-0.56px] text-dark">
            {routine.recommendation}
          </h2>
        )}
      </div>
      {children}
    </section>
  );
}

/** Airbnb's highlights: a line and an icon each, nothing more, with the rest a tap away */
function Highlights({ routine, onMore }: BriefProps) {
  return (
    <div>
      <ul className="m-0 mt-4 list-none p-0">
        {routine.principles.map((principle, i) => (
          <li
            key={principle.did}
            className={`flex items-center gap-4 py-4 ${i > 0 ? "border-t border-light-grey" : ""}`}
          >
            <span aria-hidden className={`${ICON} size-10 rounded-xl text-lg`}>
              {principle.icon}
            </span>
            <p className="m-0 text-base leading-[22px] tracking-[-0.32px] text-near-black">
              {principle.headline}
            </p>
          </li>
        ))}
      </ul>
      <button type="button" onClick={onMore} className={`${LINK} mt-1`}>
        {/* TODO(lift): replace with translation key */}
        Show more
      </button>
    </div>
  );
}

/** Ramp's way: the proof first, as big numbers from their own box, with the rule as the caption */
function Numbers({ routine, lines, onMore }: BriefProps) {
  return (
    <div>
      <ul className="m-0 mt-5 grid list-none grid-cols-3 gap-2 p-0">
        {routine.principles.map((principle) => {
          const stat = principle.stat(lines);
          return (
            <li key={principle.did} className="flex">
              <button
                type="button"
                onClick={onMore}
                aria-label={`${stat.value} ${stat.label}`}
                className="flex w-full cursor-pointer flex-col items-start rounded-2xl bg-light-brown p-3 text-left"
              >
                <span className="font-book text-[26px] leading-7 tracking-[-0.52px] text-dark">
                  {stat.value}
                </span>
                <span className="mt-1 text-xs leading-4 tracking-[-0.24px] text-light-text">
                  {stat.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <button type="button" onClick={onMore} className={LINK}>
        {/* TODO(lift): replace with translation key */}
        Why these numbers
      </button>
    </div>
  );
}

/** Cards to swipe through, the next one peeking: one rule at a time at a size that reads */
function Cards({ routine, onMore }: BriefProps) {
  return (
    <div>
      <ul className="scrollbar-hide m-0 mt-5 flex snap-x snap-mandatory list-none gap-3 overflow-x-auto overflow-y-hidden scroll-px-6 px-6 pb-1">
        {routine.principles.map((principle) => (
          <li key={principle.did} className="flex w-[78%] shrink-0 snap-start">
            <div className="flex w-full flex-col rounded-3xl bg-light-brown p-5">
              <span
                aria-hidden
                className={`${ICON} size-10 rounded-xl bg-white text-lg`}
              >
                {principle.icon}
              </span>
              <h3 className="m-0 mt-6 font-book text-xl leading-6 tracking-[-0.4px] text-dark">
                {principle.headline}
              </h3>
              <p className="mt-2 mb-0 text-sm leading-[18px] tracking-[-0.28px] text-light-text">
                {principle.short}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <button type="button" onClick={onMore} className={`${LINK} mx-6`}>
        {/* TODO(lift): replace with translation key */}
        Read the full story
      </button>
    </div>
  );
}

/** N26's and Finimize's rows: what it is on the left, the amount on the right, and a row opens to say why */
function Ledger({ routine, deep = false }: BriefProps & { deep?: boolean }) {
  const [openRow, setOpenRow] = useState<number | null>(null);
  return (
    <div className="mt-5 rounded-3xl border border-light-grey px-5">
      <ul className="m-0 list-none p-0">
        {routine.principles.map((principle, i) => {
          const on = openRow === i;
          return (
            <li
              key={principle.did}
              className={i > 0 ? "border-t border-light-grey" : ""}
            >
              <button
                type="button"
                onClick={() => setOpenRow(on ? null : i)}
                aria-expanded={on}
                aria-label={principle.headline}
                className="flex w-full cursor-pointer items-center gap-4 bg-transparent p-0 py-4 text-left"
              >
                <span
                  aria-hidden
                  className={`${ICON} size-12 rounded-2xl text-[22px]`}
                >
                  {principle.icon}
                </span>
                <span className="min-w-0 flex-1 text-base leading-[22px] tracking-[-0.32px] text-near-black">
                  {principle.headline}
                </span>
                <ChevronDownIcon
                  size={10}
                  className={`shrink-0 text-light-text transition-transform duration-300 ease-ui ${on ? "rotate-180" : ""}`}
                />
              </button>
              <div
                className={`grid transition-[grid-template-rows] duration-300 ease-ui ${on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
              >
                <div className="overflow-hidden">
                  <p
                    className={`m-0 mb-4 text-sm leading-[18px] tracking-[-0.28px] text-light-text ${deep ? "" : "pl-16"}`}
                  >
                    {deep ? stripCites(principle.long) : principle.short}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** Superpower's "what we're working on": numbered cards, each a headline and one line, each opening the story */
function Numbered({ routine, onMore }: BriefProps) {
  return (
    <ul className="m-0 mt-5 flex list-none flex-col gap-3 p-0">
      {routine.principles.map((principle, i) => (
        <li key={principle.did}>
          <button
            type="button"
            onClick={onMore}
            aria-label={principle.headline}
            className="flex w-full cursor-pointer items-start gap-4 rounded-2xl border border-light-grey bg-linear-to-br from-light-brown to-white p-4 text-left"
          >
            <span
              aria-hidden
              className="w-6 shrink-0 font-book text-[32px] leading-8 tracking-[-0.64px] text-signal-orange"
            >
              {i + 1}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-base leading-[22px] font-medium tracking-[-0.32px] text-near-black">
                {principle.headline}
              </span>
              <span className="mt-1 block text-sm leading-[18px] tracking-[-0.28px] text-light-text">
                {principle.short}
              </span>
            </span>
            <ChevronRightIcon
              size={12}
              className="mt-1.5 shrink-0 text-light-text"
            />
          </button>
        </li>
      ))}
    </ul>
  );
}

/** Life Reset's "here's what most people don't realise": one rule given the room, the other two as lines */
function Lead({ routine, onMore }: BriefProps) {
  const [lead, ...rest] = routine.principles;
  return (
    <div>
      <div className="mt-5 rounded-3xl bg-light-brown p-5">
        {/* TODO(lift): replace with translation key */}
        <p className="m-0 flex items-center gap-2 text-xs leading-4 font-medium tracking-[-0.24px] text-light-text">
          <span aria-hidden className="text-base leading-none">
            {lead.icon}
          </span>
          The one that matters most
        </p>
        <h3 className="m-0 mt-3 font-book text-[22px] leading-7 tracking-[-0.44px] text-dark">
          {lead.headline}
        </h3>
        <p className="mt-2 mb-0 text-sm leading-[18px] tracking-[-0.28px] text-dark">
          {lead.short}
        </p>
      </div>
      <ul className="m-0 mt-2 list-none p-0">
        {rest.map((principle) => (
          <li
            key={principle.did}
            className="flex items-center gap-3 border-b border-light-grey py-3 last:border-b-0"
          >
            <span aria-hidden className="text-lg leading-none">
              {principle.icon}
            </span>
            <span className="text-sm leading-[18px] tracking-[-0.28px] text-near-black">
              {principle.headline}
            </span>
          </li>
        ))}
      </ul>
      <button type="button" onClick={onMore} className={`${LINK} mt-3`}>
        {/* TODO(lift): replace with translation key */}
        Read the full story
      </button>
    </div>
  );
}

/** Fiverr's and Max's tiers: a switch between the three, one explained at a time, in a card that never changes height */
function Tabs({ routine, lines, onMore }: BriefProps) {
  const [tab, setTab] = useState<number>(0);
  return (
    <div>
      <div
        role="tablist"
        className="mt-5 flex gap-1 rounded-full bg-light-brown p-1"
      >
        {routine.principles.map((principle, i) => (
          <button
            key={principle.did}
            type="button"
            role="tab"
            aria-selected={tab === i}
            onClick={() => setTab(i)}
            className={`flex-1 cursor-pointer rounded-full border-0 px-2 py-2 text-xs leading-4 font-medium tracking-[-0.24px] transition-colors duration-200 ease-ui ${
              tab === i
                ? "bg-white text-dark"
                : "bg-transparent text-light-text"
            }`}
          >
            {principle.label}
          </button>
        ))}
      </div>
      {/* every panel sits in one cell, so the card is as tall as the tallest and nothing jumps */}
      <div className="mt-3 grid rounded-3xl border border-light-grey p-5">
        {routine.principles.map((principle, i) => {
          const stat = principle.stat(lines);
          return (
            <div
              key={principle.did}
              role="tabpanel"
              aria-hidden={tab !== i}
              className={`col-start-1 row-start-1 transition-opacity duration-300 ease-ui ${tab === i ? "opacity-100" : "invisible opacity-0"}`}
            >
              <h3 className="m-0 font-book text-xl leading-6 tracking-[-0.4px] text-dark">
                {principle.headline}
              </h3>
              <p className="mt-2 mb-0 text-sm leading-[18px] tracking-[-0.28px] text-light-text">
                {principle.short}
              </p>
              <p className="mt-4 mb-0 flex items-baseline gap-2">
                <span className="font-book text-[28px] leading-8 tracking-[-0.56px] text-dark">
                  {stat.value}
                </span>
                <span className="text-sm leading-[18px] tracking-[-0.28px] text-dark">
                  {stat.label}
                </span>
              </p>
            </div>
          );
        })}
      </div>
      <button type="button" onClick={onMore} className={LINK}>
        {/* TODO(lift): replace with translation key */}
        Read the full story
      </button>
    </div>
  );
}
