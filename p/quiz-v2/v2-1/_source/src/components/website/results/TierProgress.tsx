"use client";

import { useEffect, useState } from "react";
import { QUANTITY } from "@/lib/box-price";

type Props = {
  /** How many products (meals and add-ons) are in the box now */
  items: number;
  /** Where the box would land: the bar fills to `items`, then moves here, so the change plays out */
  to?: number;
  /** One line above the bar, where it needs saying: how far the next discount is */
  label?: string;
};

/** The fill starts a beat after the bar arrives, then is long enough there before it moves to where they'd be */
const START_MS = 120;
const SETTLE_MS = 1300;

/* the tiers from smallest to largest, set at even steps along the bar so every label has room */
const TIERS = [...QUANTITY].reverse();
const STEP = 100 / TIERS.length;
const markerAt = (i: number) => STEP * (i + 0.5);

/** Where a count sits on the bar: between the markers either side of it, in proportion */
function fillFor(items: number): number {
  if (items <= 0) return 0;
  const i = TIERS.findIndex(([from]) => items < from);
  if (i === -1) return Math.min(100, markerAt(TIERS.length - 1) + ((items - TIERS[TIERS.length - 1][0]) / 5) * (100 - markerAt(TIERS.length - 1)));
  const [lo, loAt] = i === 0 ? [0, 0] : [TIERS[i - 1][0], markerAt(i - 1)];
  return loAt + ((items - lo) / (TIERS[i][0] - lo)) * (markerAt(i) - loAt);
}

/**
 * The quantity discount as a bar: the tiers as markers, the box as the fill. It fills as it arrives,
 * and when `to` is given it then moves there — back past a marker for a meal coming out, so they see
 * the discount they'd lose. The same bar wherever the box's size is being changed.
 */
// TODO(lift): the website's PriceProgressBar is dark only; this is it in light, until it takes a tone="light" prop
export function TierProgress({ items, to, label }: Props) {
  const [shown, setShown] = useState<number>(0);
  useEffect(() => {
    const timers = [window.setTimeout(() => setShown(items), START_MS)];
    if (to !== undefined) timers.push(window.setTimeout(() => setShown(to), START_MS + SETTLE_MS));
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [items, to]);

  return (
    <div className="rounded-2xl bg-off-white px-4 pt-4 pb-3">
      {label && <p className="m-0 mb-3 text-sm leading-[18px] font-medium tracking-[-0.28px] text-dark">{label}</p>}
      <div className="relative mt-1 h-2 rounded-full bg-light-grey-2">
        <span
          className="absolute inset-y-0 left-0 rounded-full bg-signal-orange transition-[width] duration-[900ms] ease-swing"
          style={{ width: `${fillFor(shown)}%` }}
        />
        {TIERS.map(([from], i) => (
          <span
            key={from}
            aria-hidden
            className={`absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-off-white transition-colors duration-300 ${
              shown >= from ? "bg-signal-orange" : "bg-light-grey-3"
            }`}
            style={{ left: `${markerAt(i)}%` }}
          />
        ))}
      </div>
      <ul className="relative m-0 mt-2 h-8 list-none p-0">
        {/* TODO(lift): replace with translation keys */}
        {TIERS.map(([from, rate], i) => (
          <li
            key={from}
            className="absolute flex -translate-x-1/2 flex-col items-center whitespace-nowrap"
            style={{ left: `${markerAt(i)}%` }}
          >
            <span className={`text-xs leading-4 font-medium tracking-[-0.24px] ${shown >= from ? "text-dark" : "text-light-text"}`}>
              {Math.round(rate * 100)}%
            </span>
            <span className="text-xs leading-4 tracking-[-0.24px] text-light-text">{from}{i === TIERS.length - 1 ? "+" : ""} items</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
