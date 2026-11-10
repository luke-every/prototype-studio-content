"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/shared/Button";
import { ChevronDownIcon } from "@/components/icons";
import { BUNDLES, type Bundle } from "./bundles";
import { ComparisonFrame } from "./ComparisonFrame";
import { Collapse } from "@/components/website/Collapse";
import { BundleDetails } from "./BundleDetails";
import { GOALS } from "./BundleComparisonE.data";

const BODY = "font-sans text-sm leading-[19px] tracking-[-0.28px]";
const CTA = "w-full justify-center font-sans text-xs font-medium uppercase leading-none tracking-[1.8px]";

function Tile({ b, sizes, className }: { b: Bundle; sizes: string; className: string }) {
  return (
    <div className={`relative shrink-0 overflow-clip ${className}`} style={{ backgroundColor: b.colors.tile }}>
      <div className="absolute" style={b.art}>
        <Image src={b.image} alt="" fill sizes={sizes} className="object-cover" />
      </div>
    </div>
  );
}

/** The one fact that backs up the goal: a serif number, then what it means. */
function Proof({ b }: { b: Bundle }) {
  const { proof } = GOALS[b.key];
  return (
    <p className="flex items-center gap-3 rounded-xl border border-light-grey-2 px-4 py-3">
      <span className="shrink-0 font-book text-[28px] leading-8 tracking-[-0.56px] text-dark">
        {proof.value}
        {proof.unit && <span className={`${BODY} ml-0.5 text-light-text`}>{proof.unit}</span>}
      </span>
      {/* TODO(lift): replace with translation key */}
      <span className={`${BODY} min-w-0 flex-1 text-light-text`}>{proof.text}</span>
    </p>
  );
}

function ContinueButton({ b, className = "" }: { b: Bundle; className?: string }) {
  return (
    <Button variant="dark" sizeClassName="h-11 px-6 py-3" className={`${CTA} ${className}`} aria-label={`Continue with ${b.title}`}>
      {/* TODO(lift): replace with translation key */}
      Continue
    </Button>
  );
}

/** Mobile: one card per goal. Goal, who it's for and the proof show up front; "See details" opens the rest. */
function GoalCard({ b, open, onToggle }: { b: Bundle; open: boolean; onToggle: () => void }) {
  const g = GOALS[b.key];
  return (
    <article id={`goal-${b.key}`} className="flex scroll-mt-4 flex-col gap-4 rounded-2xl border border-light-grey-2 bg-white p-4" aria-label={b.title}>
      <div className="flex flex-col gap-4">
        <Tile b={b} sizes="(min-width: 640px) 560px, 90vw" className="aspect-[256/150] w-full rounded-xl" />
        <div className="flex min-w-0 flex-col gap-1">
          <p className={`${BODY} font-medium`} style={{ color: b.colors.storyText }}>{b.title}</p>
          {/* TODO(lift): replace with translation key */}
          <h3 className="font-sans text-[22px] font-medium leading-[26px] tracking-[-0.44px] text-near-black">{g.goal}</h3>
        </div>
      </div>

      <Proof b={b} />

      <div className="flex flex-col gap-2">
        <ContinueButton b={b} />
        <Button
          sizeClassName="h-11 px-6 py-3"
          className={`${CTA} text-near-black`}
          onClick={onToggle}
          icon={<ChevronDownIcon className={`transition-transform ${open ? "rotate-180" : ""}`} />}
          aria-expanded={open}
          aria-controls={`goal-details-${b.key}`}
        >
          {/* TODO(lift): replace with translation key */}
          {open ? "Hide details" : "See details"}
        </Button>

        <Collapse open={open} id={`goal-details-${b.key}`} closedClassName="-mt-2">
          <div className="flex flex-col gap-4 border-t border-light-grey py-4">
            <BundleDetails b={b} />
          </div>
        </Collapse>
      </div>
    </article>
  );
}

/** Goal-led: customers start from what they want from their meals, and each bundle answers with who it's for and one fact that backs it up. */
export function BundleComparisonE() {
  const [selected, setSelected] = useState<string>(BUNDLES[0].key);
  const [open, setOpen] = useState<string[]>([]);
  const current = BUNDLES.find((b) => b.key === selected) ?? BUNDLES[0];

  const toggle = (key: string) => setOpen((keys) => (keys.includes(key) ? keys.filter((k) => k !== key) : [...keys, key]));

  return (
    <ComparisonFrame>
      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[360px_1fr] lg:items-start lg:gap-10">
        <div className="flex flex-col gap-4">
          {/* Mobile: stacked goal cards */}
          <div className="flex flex-col gap-4 lg:hidden">
            {BUNDLES.map((b) => (
              <GoalCard key={b.key} b={b} open={open.includes(b.key)} onToggle={() => toggle(b.key)} />
            ))}
          </div>

          {/* Desktop: goal list that drives the panel beside it */}
          <ul className="hidden flex-col gap-3 lg:flex">
            {BUNDLES.map((b) => {
              const active = b.key === selected;
              return (
                <li key={b.key}>
                  <button
                    type="button"
                    onClick={() => setSelected(b.key)}
                    aria-pressed={active}
                    className={`flex w-full cursor-pointer items-center gap-3 rounded-2xl border p-3 text-left ${active ? "border-dark" : "border-light-grey"}`}
                    style={active ? { backgroundColor: b.colors.tile } : undefined}
                  >
                    <Tile b={b} sizes="64px" className="size-16 rounded-lg" />
                    <span className="flex min-w-0 flex-col gap-0.5">
                      <span className={`${BODY} font-medium`} style={{ color: b.colors.storyText }}>{b.title}</span>
                      {/* TODO(lift): replace with translation key */}
                      <span className="font-sans text-xl font-medium leading-6 tracking-[-0.4px] text-near-black">{GOALS[b.key].goal}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <section className="hidden flex-col gap-6 rounded-2xl border border-light-grey-2 bg-white p-6 lg:flex" aria-label={current.title} aria-live="polite">
          <div className="grid grid-cols-[320px_1fr] gap-8">
            <Tile b={current} sizes="320px" className="aspect-[256/165] w-full rounded-[18px]" />
            <div className="flex min-w-0 flex-col gap-5">
              <div className="flex flex-col gap-1">
                <p className={`${BODY} font-medium`} style={{ color: current.colors.storyText }}>{current.title}</p>
                {/* TODO(lift): replace with translation key */}
                <h3 className="font-sans text-[32px] font-medium leading-[36px] tracking-[-0.64px] text-near-black">{GOALS[current.key].goal}</h3>
              </div>
              <Proof b={current} />
              <ContinueButton b={current} className="lg:w-fit" />
            </div>
          </div>

          <div className="border-t border-light-grey pt-6">
            <BundleDetails b={current} />
          </div>
        </section>
      </div>
    </ComparisonFrame>
  );
}
