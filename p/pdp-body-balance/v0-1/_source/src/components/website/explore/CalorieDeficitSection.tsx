"use client";

import { useState } from "react";
import { Accordion } from "@/components/shared/Accordion";
import { Tags } from "@/components/shared/Tags";
import { DEFICIT } from "@/lib/explore-sections-sample";
import { SectionShell } from "./SectionShell";

export type DeficitVariant = "equation" | "tags" | "accordion" | "cards" | "balance";

type Props = {
  variant?: DeficitVariant;
};

const EYEBROW = "font-sans text-xs font-medium uppercase tracking-[-0.24px]";
const HEADLINE = "font-book text-[34px] leading-[34px] tracking-[-0.68px] lg:text-[48px] lg:leading-12.5 lg:tracking-[-0.96px]";
const BODY = "font-sans text-sm leading-4.75 tracking-[-0.28px] lg:text-lg lg:leading-[1.4] lg:tracking-[-0.36px]";
const HUGE = "font-book text-[56px] leading-[56px] tracking-[-1.12px] lg:text-[96px] lg:leading-24 lg:tracking-[-1.92px]";

/** Five ways to explain a calorie deficit. Pick with the studio's "Calorie deficit" control. */
export function CalorieDeficitSection({ variant = "equation" }: Props) {
  if (variant === "tags") return <TagsVersion />;
  if (variant === "accordion") return <AccordionVersion />;
  if (variant === "cards") return <CardsVersion />;
  if (variant === "balance") return <BalanceVersion />;
  return <EquationVersion />;
}

/** The idea set as type: energy in < energy out. */
function EquationVersion() {
  return (
    <SectionShell tone="dark">
      <p className={`${EYEBROW} text-white/60`}>{DEFICIT.question}</p>
      <h2 className={`${HUGE} flex flex-col lg:flex-row lg:items-baseline lg:gap-6`}>
        <span>Energy in</span>
        <span className="font-book-italic text-signal-orange">&lt;</span>
        <span>energy out</span>
      </h2>
      <div className="flex flex-col gap-4 border-t border-white/20 pt-6 lg:max-w-136">
        <p className={`${BODY} text-white`}>
          {DEFICIT.definition} {DEFICIT.moderate}
        </p>
        <p className={`${BODY} text-white/60`}>{DEFICIT.depends}</p>
      </div>
      <p className="font-book-italic text-2xl leading-6.5 tracking-[-0.48px] text-white lg:max-w-136 lg:text-[34px] lg:leading-[34px] lg:tracking-[-0.68px]">{DEFICIT.payoff}</p>
    </SectionShell>
  );
}

/** The caveat made visual: age, height and activity as tags. */
function TagsVersion() {
  return (
    <SectionShell>
      <div className="flex flex-col gap-3">
        <p className={EYEBROW}>Good to know</p>
        <h2 className={HEADLINE}>{DEFICIT.question}</h2>
      </div>
      <p className="font-book text-2xl leading-6.5 tracking-[-0.48px] lg:text-[34px] lg:leading-[34px] lg:tracking-[-0.68px]">
        {DEFICIT.definition} <span className="text-dark/50">{DEFICIT.moderate}</span>
      </p>
      <div className="flex flex-col gap-3">
        <p className={`${BODY} text-light-text`}>Your number depends on</p>
        <Tags tags={DEFICIT.variables} variant="outlined" />
      </div>
      <p className={`${BODY} rounded-[28px] bg-dark/6 p-6 lg:max-w-136`}>{DEFICIT.payoff}</p>
    </SectionShell>
  );
}

/** Quiet: answer up front, the detail tucked into an accordion. */
function AccordionVersion() {
  return (
    <SectionShell tone="warm">
      <div className="flex flex-col gap-4">
        <h2 className={HEADLINE}>{DEFICIT.question}</h2>
        <p className={BODY}>{DEFICIT.definition}</p>
      </div>
      <div className="flex flex-col gap-8">
        <div className="border-t border-light-grey-2">
          <Accordion title="Why moderate, and how much?" contentClassName="pb-8 pl-1">
            <div className="flex flex-col gap-4">
              <p className={BODY}>{DEFICIT.moderate}</p>
              <p className={`${BODY} text-light-text`}>{DEFICIT.depends}</p>
            </div>
          </Accordion>
        </div>
        <p className={`${BODY} lg:max-w-136`}>{DEFICIT.payoff}</p>
      </div>
    </SectionShell>
  );
}

/** Two cards, deliberately unequal: what it is, then how we help. */
function CardsVersion() {
  return (
    <SectionShell>
      <h2 className={HEADLINE}>{DEFICIT.question}</h2>
      <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
        <div className="flex flex-col gap-4 rounded-[28px] bg-dark/6 p-6 lg:flex-1 lg:p-8">
          <p className={EYEBROW}>What it is</p>
          <p className={BODY}>
            {DEFICIT.definition} {DEFICIT.moderate}
          </p>
          <p className={`${BODY} text-light-text`}>{DEFICIT.depends}</p>
        </div>
        <div className="flex flex-col justify-between gap-8 rounded-[28px] bg-dark p-6 text-white lg:flex-1 lg:p-8">
          <p className={`${EYEBROW} text-white/60`}>How we help</p>
          <div className="flex flex-col gap-4">
            <p className="flex items-baseline gap-2">
              <span className={HUGE}>500</span>
              <span className="font-book-italic text-2xl leading-6.5 tracking-[-0.48px]">kcal</span>
            </p>
            <p className={BODY}>{DEFICIT.payoff}</p>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

// TODO(lift): fake — 2,000 kcal is a sample recommended intake, and the thresholds and messages are illustrative, not nutrition guidance. Needs sign-off before it ships.
const RECOMMENDED = 2000;
const MIN = 40;
const STEP = 1;

function balanceMessage(value: number) {
  if (value < 70) return { label: "Too steep", note: "Your body needs enough energy to work with." };
  if (value < 95) return { label: "A moderate deficit", note: "Enough energy for your day, with a gap that adds up over time." };
  return { label: "In balance", note: "You eat what your body needs. Weight stays where it is." };
}

const kcal = (n: number) => n.toLocaleString("en-GB");

/** Bold: your recommended calories are the full bar; eat less than that and the gap is your deficit. Drag the bar. */
function BalanceVersion() {
  const [value, setValue] = useState<number>(82);
  const [dragging, setDragging] = useState<boolean>(false);
  const message = balanceMessage(value);
  const intake = Math.round((RECOMMENDED * value) / 100 / 10) * 10;
  const gap = RECOMMENDED - intake;

  function setFromPointer(e: React.PointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / rect.width) * 100;
    setValue(Math.min(100, Math.max(MIN, Math.round(pct))));
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const step = e.key === "ArrowRight" || e.key === "ArrowUp" ? STEP * 2 : e.key === "ArrowLeft" || e.key === "ArrowDown" ? -STEP * 2 : 0;
    if (step === 0) return;
    e.preventDefault();
    setValue((v) => Math.min(100, Math.max(MIN, v + step)));
  }

  return (
    <SectionShell tone="warm">
      <div className="flex flex-col gap-3">
        <p className={EYEBROW}>{DEFICIT.question}</p>
        <h2 className={HEADLINE}>
          Eat a little less than you use. <em className="font-book-italic">Not a lot less.</em>
        </h2>
      </div>

      <div className="flex flex-col gap-8 rounded-[28px] bg-white p-6 lg:p-8">
        <div className="flex flex-col gap-4">
          <div className="flex items-end justify-between gap-4">
            <p className="flex items-baseline gap-2">
              <span className="font-book text-[56px] leading-[56px] tracking-[-1.12px] tabular-nums lg:text-[72px] lg:leading-[72px] lg:tracking-[-1.44px]">
                {kcal(intake)}
              </span>
              <span className="font-book-italic text-lg leading-5 tracking-[-0.36px]">kcal</span>
            </p>
            <p className={`${BODY} text-right text-light-text`}>
              of <span className="tabular-nums">{kcal(RECOMMENDED)}</span> recommended
            </p>
          </div>

          {/* The bar is the recommended amount, like a battery: the filled part is what you eat, the hatched part is the deficit. */}
          <div className="flex items-center gap-1">
            <div
              role="slider"
              tabIndex={0}
              aria-label="Calories you eat in a day"
              aria-valuemin={MIN}
              aria-valuemax={100}
              aria-valuenow={value}
              aria-valuetext={`${kcal(intake)} kcal, a ${kcal(gap)} kcal deficit from ${kcal(RECOMMENDED)} recommended`}
              onKeyDown={onKeyDown}
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                setDragging(true);
                setFromPointer(e);
              }}
              onPointerMove={(e) => dragging && setFromPointer(e)}
              onPointerUp={() => setDragging(false)}
              onPointerCancel={() => setDragging(false)}
              className={`relative h-20 min-w-0 flex-1 touch-none rounded-[28px] border border-light-grey-2 bg-white outline-none focus-visible:ring-2 focus-visible:ring-dark/30 lg:h-24 ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
            >
              <div className="absolute inset-1 overflow-hidden rounded-3xl">
                <div
                  className="absolute inset-y-0 right-0"
                  style={{
                    left: `${value}%`,
                    backgroundImage: "repeating-linear-gradient(135deg, var(--color-light-grey-2) 0 1px, transparent 1px 8px)",
                  }}
                >
                  {value < 95 && (
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white px-3 py-1 font-book-italic text-lg leading-5 tracking-[-0.36px] text-dark">
                      Deficit
                    </span>
                  )}
                </div>
                <div className="absolute inset-y-0 left-0 bg-dark" style={{ width: `${value}%` }} />
              </div>
              <span
                aria-hidden
                className="pointer-events-none absolute top-1/2 flex h-10 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_2px_8px_rgba(55,45,39,0.24)]"
                style={{ left: `calc(4px + (100% - 8px) * ${value} / 100)` }}
              >
                <span className="h-4 w-0.5 rounded-full bg-dark/40" />
              </span>
            </div>
            <span aria-hidden className="h-8 w-2 shrink-0 rounded-r-full bg-light-grey-2 lg:h-10" />
          </div>
        </div>

        <div className="flex flex-col gap-1 border-t border-light-grey pt-6" aria-live="polite">
          <p className="font-book text-2xl leading-6.5 tracking-[-0.48px]">{message.label}</p>
          <p className={`${BODY} text-light-text`}>{message.note}</p>
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:max-w-136">
        <div className="flex flex-col gap-3">
          <p className={BODY}>
            {DEFICIT.definition} {DEFICIT.moderate}
          </p>
          <p className={`${BODY} text-light-text`}>{DEFICIT.depends}</p>
        </div>
        <p className="font-book-italic text-2xl leading-6.5 tracking-[-0.48px]">{DEFICIT.payoff}</p>
      </div>
    </SectionShell>
  );
}
