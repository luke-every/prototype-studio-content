"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronDownIcon } from "@/components/icons";
import type { BoxBreakdown, BoxSize } from "./types";

type Props = {
  /** The bundle's name without "The" */
  name: string;
  size: BoxSize;
  box: BoxBreakdown;
  /** Which size pill is picked, for a box that lists its contents per size */
  sizeIdx: number;
};

const ROW = "flex items-center justify-between gap-4 border-t border-light-grey-3 px-4 pt-3 pb-[11px]";
const KEY = "text-xs leading-4 font-medium tracking-[-0.24px] text-dark";
const VALUE = "text-sm leading-[15px] font-medium tracking-[-0.28px]";

/** The price, which opens to show what makes it up. It grows open and closed, never snaps. */
export function PriceBreakdown({ name, size, box, sizeIdx }: Props) {
  const [open, setOpen] = useState<boolean>(true);
  const items = box.items?.[Math.min(sizeIdx, box.items.length - 1)];
  return (
    <div className="overflow-hidden rounded-2xl border border-light-grey-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={`${name}, ${size.total}`}
        className="flex w-full cursor-pointer items-center justify-between bg-white px-4 py-3.5"
      >
        <span className="text-sm leading-[15px] font-medium tracking-[-0.28px] text-dark">{name}</span>
        <span className="flex items-center gap-2">
          <span className="text-base leading-[22px] font-medium tracking-[-0.32px] text-dark">{size.total}</span>
          <span className="text-xs leading-4 tracking-[-0.24px] text-dark/60 line-through">{size.was}</span>
          <span className={`flex size-6 shrink-0 items-center justify-center text-dark transition-transform duration-[400ms] ease-ui ${open ? "rotate-180" : ""}`}>
            <ChevronDownIcon size={12} />
          </span>
        </span>
      </button>
      {/* grid-rows is the one property that animates an unknown height cleanly */}
      <div className={`grid bg-off-white [transition:grid-template-rows_450ms_var(--ease-ui)] ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          {(box.note || box.gift || items) && (
            <div className="bg-white px-4 pt-3.5 pb-4">
              {/* TODO(lift): replace with translation key */}
              {box.note && <p className="mx-0 mt-0 mb-3 text-xs leading-4 tracking-[-0.24px] text-light-text">{box.note}</p>}
              {box.gift && (
                <p className="mx-0 mt-0 mb-3 flex items-center gap-2 text-sm leading-[19px] font-medium tracking-[-0.28px] text-near-black">
                  <i className="text-[15px] leading-none not-italic">🎁</i>
                  {box.gift}
                </p>
              )}
              {items && (
                <ul className="m-0 flex list-none flex-col gap-[9px] p-0">
                  {items.map((item) => (
                    <li key={item} className="flex gap-2.5 text-sm leading-[19px] tracking-[-0.28px] text-dark">
                      <span className="w-[13px] shrink-0">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          {/* TODO(lift): replace with translation key */}
          <div className={ROW}>
            <span className={KEY}>Discount (-20%)</span>
            <span className={`${VALUE} text-savings-green`}>{size.disc}</span>
          </div>
          <div className={ROW}>
            <span className={KEY}>Quantity discount</span>
            <span className={`${VALUE} text-savings-green`}>{size.qty}</span>
          </div>
          <div className={ROW}>
            <span className={KEY}>Shipping</span>
            <span className="text-sm leading-[19px] tracking-[-0.28px] text-dark">Free</span>
          </div>
          {box.addon && (
            <div className={`${ROW} gap-3`}>
              <span className="relative size-11 shrink-0 overflow-hidden rounded-[10px] bg-light-grey">
                <Image src={box.addon.image} alt="" fill sizes="44px" className="object-cover" />
              </span>
              <span className="min-w-0 flex-1 text-xs leading-4 tracking-[-0.24px] text-dark">{box.addon.name}</span>
              <span className="flex items-center gap-2">
                <span className="text-xs leading-4 tracking-[-0.24px] text-dark/60 line-through">{box.addon.price}</span>
                <span className={`${VALUE} text-savings-green`}>Free</span>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
