"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/shared/Button";
import { CheckedIcon, CloseIcon } from "@/components/icons";
import { BUNDLES, INCLUDE_ROWS, isLeader } from "./bundles";
import { BundleStack } from "./BundleStack";
import { NumberRow } from "./NumberRow";
import { ComparisonFrame } from "./ComparisonFrame";

const SELECT = "w-full rounded-lg border border-light-grey-2 bg-white px-3 py-2 font-sans text-base leading-[22px] tracking-[-0.32px] text-near-black";
// Tile, title + story, includes (with gifts), nutrition, button: every card spans the same rows so they line up across bundles.
const ROW_COUNT = 5;

type Props = {
  /** Mobile only. "picker": two dropdowns choose which two bundles show. "scroll": all four swipe sideways, snapping one at a time. "stack": compact cards one under another, each expandable. */
  mobileLayout?: "picker" | "scroll" | "stack";
};

export function BundleComparison({ mobileLayout = "picker" }: Props) {
  const scroll = mobileLayout === "scroll";
  const stack = mobileLayout === "stack";
  const [picked, setPicked] = useState<[string, string]>([BUNDLES[0].key, BUNDLES[1].key]);

  const pick = (slot: 0 | 1, key: string) => {
    const other = slot === 0 ? 1 : 0;
    const next: [string, string] = [...picked];
    next[slot] = key;
    if (key === picked[other]) next[other] = picked[slot]; // swap so the two are never the same
    setPicked(next);
  };

  return (
    <ComparisonFrame>
        {/* Mobile: pick two bundles to compare */}
        <div className={`grid grid-cols-2 gap-3 lg:hidden ${scroll || stack ? "hidden" : ""}`}>
          {([0, 1] as const).map((slot) => (
            <select key={slot} value={picked[slot]} onChange={(e) => pick(slot, e.target.value)} className={SELECT} aria-label={`Bundle ${slot + 1}`}>
              {BUNDLES.map((b) => (
                <option key={b.key} value={b.key}>
                  {b.title}
                </option>
              ))}
            </select>
          ))}
        </div>

        {stack && (
          <div className="lg:hidden">
            <BundleStack />
          </div>
        )}

        <div
          className={
            stack
              ? "hidden lg:grid lg:grid-cols-4 lg:gap-x-8"
              : scroll
              ? "-mx-4 grid snap-x snap-mandatory auto-cols-[78%] grid-flow-col gap-x-3 overflow-x-auto scroll-pl-4 px-4 [scrollbar-width:none] lg:mx-0 lg:auto-cols-auto lg:grid-flow-row lg:grid-cols-4 lg:gap-x-8 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden"
              : "grid grid-cols-2 gap-x-3 lg:grid-cols-4 lg:gap-x-8"
          }
          style={{ gridTemplateRows: `repeat(${ROW_COUNT}, auto)` }}>
          {BUNDLES.map((b) => {
            const visible = scroll || stack || picked.includes(b.key) ? "grid" : "hidden lg:grid";
            return (
              <article key={b.key} className={`${visible} ${scroll ? "snap-start rounded-2xl border border-light-grey-2 bg-white p-4 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0" : ""} grid-rows-subgrid`} style={{ gridRow: `span ${ROW_COUNT}` }} aria-label={b.title}>
                <div className={`relative mb-4 w-full overflow-clip rounded-[18px] ${scroll ? "aspect-[256/195] lg:aspect-[256/215]" : "aspect-[256/275]"}`} style={{ backgroundColor: b.colors.tile }}>
                  <div className="absolute" style={b.art}>
                    <Image src={b.image} alt="" fill sizes="(min-width: 1024px) 376px, 50vw" className="object-cover" />
                  </div>
                </div>

                <div className="flex flex-col gap-1 pb-6 font-sans font-medium">
                  <h3 className="text-[22px] leading-[26px] tracking-[-0.44px] text-black lg:text-2xl lg:tracking-[-0.48px]">{b.title}</h3>
                  <p className="text-sm leading-[19px] tracking-[-0.28px]" style={{ color: b.colors.storyText }}>
                    {b.story}
                  </p>
                </div>

                <div className="flex flex-col gap-2 border-t border-light-grey py-6">
                <p className="font-sans text-sm font-medium leading-[19px] tracking-[-0.28px] text-near-black">What&apos;s included</p>
                <ul className="flex flex-col gap-2 font-sans text-sm leading-[19px] tracking-[-0.28px]">
                  {INCLUDE_ROWS.map((row) => (
                    <li
                      key={row.key}
                      className={`flex items-center gap-2 ${b.includes[row.key] ? "text-light-text" : "text-light-grey-3"}`}
                      aria-label={b.includes[row.key] ? row.label : `${row.label}: not included`}
                    >
                      {b.includes[row.key] ? <CheckedIcon size={16} /> : <CloseIcon size={16} className="text-light-grey-3" />}
                      {row.label}
                    </li>
                  ))}
                </ul>
                {b.gifts.length > 0 && (
                  <ul className="flex flex-col gap-2 pt-2">
                    {b.gifts.map((gift) => (
                      <li key={gift.name} className="flex items-center gap-2 rounded-lg border border-light-grey p-1.5">
                        <div className="relative size-8 shrink-0 overflow-hidden rounded-md bg-light-grey">
                          <Image src={gift.image} alt="" fill sizes="32px" className="object-cover" />
                        </div>
                        <span className="font-sans text-xs leading-4 tracking-[-0.24px] text-near-black">{gift.name}</span>
                        {/* TODO(lift): replace with translation key */}
                        <span className="ml-auto shrink-0 pr-1.5 font-sans text-xs font-medium leading-4 tracking-[0.6px] text-light-text">FREE</span>
                      </li>
                    ))}
                  </ul>
                )}
                </div>

                <div className="flex flex-col gap-2 border-t border-light-grey py-6">
                  {/* TODO(lift): replace with translation key */}
                  <p className="font-sans text-sm font-medium leading-[19px] tracking-[-0.28px] text-near-black">Average per meal</p>
                  <div className="flex flex-col divide-y divide-light-grey overflow-clip rounded-xl border border-light-grey-2">
                    <NumberRow label="Protein" value={b.macros.protein} unit="g" highlight={isLeader(b, "protein")} colors={b.colors} />
                    <NumberRow label="Fibre" value={b.macros.fibre} unit="g" highlight={isLeader(b, "fibre")} colors={b.colors} />
                    <NumberRow label="Kcal" value={b.macros.kcal} highlight={isLeader(b, "kcal")} colors={b.colors} />
                  </div>
                </div>

                <Button
                  variant="dark"
                  sizeClassName="h-10 px-6 py-3"
                  className="w-full justify-center font-sans text-xs font-medium uppercase leading-none tracking-[1.8px]"
                  aria-label={`Continue with ${b.title}`}
                >
                  {/* TODO(lift): replace with translation key */}
                  Continue
                </Button>
              </article>
            );
          })}
        </div>
    </ComparisonFrame>
  );
}
