"use client";

import type { BundleVariant } from "@/components/website/bundle-v3/types";
import { COPY } from "@/lib/copy";
import { DISCOUNT_TIERS, bySize, tierIndex } from "@/lib/box-step";
import { formatPrice } from "@/lib/format";
import { interpolate } from "@/lib/translations";
import { AnimatedNumber } from "./AnimatedNumber";

type Props = {
  variants: BundleVariant[];
  selected: BundleVariant;
  onSelect: (variant: BundleVariant) => void;
  currencyCode: string;
};

const THUMB = 24;
// A point along the track, measured to the thumb's centre so notches, fill and thumb line up.
const along = (index: number, last: number): string => `calc(${THUMB / 2}px + (100% - ${THUMB}px) * ${index / last})`;

/**
 * New: nothing in every-website does this. The size pills as one slider you drag, with only two things changing as you go:
 * the price per meal (the smallest box's struck through, as the reference) and the discount. A native range input, so the keyboard
 * and screen readers work. It lands on the real sizes only: there are no prices in between.
 */
export function BoxSizeSlider({ variants, selected, onSelect, currencyCode }: Props) {
  const c = COPY.boxNudge;
  const sizes = bySize(variants);
  const last = sizes.length - 1;
  const index = Math.max(0, sizes.findIndex((v) => v.id === selected.id));
  const money = (n: number): string => formatPrice(n, currencyCode);

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-light-grey-3 bg-white/60 p-4">
      <div className="flex items-baseline gap-2">
        <span className="font-book text-[34px] leading-[34px] tracking-[-0.68px] text-dark">{interpolate(c.sliderMeals, { n: selected.config.mealCount })}</span>
        <span className="font-sans text-xs leading-4 tracking-[-0.24px] text-dark/65">{c.sliderMonth}</span>
        {selected.badge && <span className="ml-auto self-center rounded bg-brown-border px-2 py-1 text-[8px] uppercase leading-[13px] tracking-[-0.16px] text-white">{selected.badge}</span>}
      </div>

      <div className="flex flex-col gap-2">
        <div className="relative h-8">
          <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-dark/15" />
          <div className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-dark transition-[width] duration-200 ease-out" style={{ left: 0, width: along(index, last) }} />
          {sizes.map((v, i) => (
            <span key={v.id} className={`absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full ${i <= index ? "bg-white" : "bg-dark/30"}`} style={{ left: along(i, last) }} />
          ))}
          <input
            type="range"
            min={0}
            max={last}
            step={1}
            value={index}
            onChange={(e) => onSelect(sizes[Number(e.target.value)])}
            aria-label={c.sliderLabel}
            aria-valuetext={interpolate(c.sliderMeals, { n: selected.config.mealCount })}
            className="absolute inset-0 h-8 w-full cursor-grab appearance-none bg-transparent active:cursor-grabbing [&::-moz-range-thumb]:size-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-dark [&::-moz-range-thumb]:shadow-[0px_2px_8px_rgba(55,45,39,0.32)] [&::-moz-range-track]:bg-transparent [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-thumb]:size-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-dark [&::-webkit-slider-thumb]:shadow-[0px_2px_8px_rgba(55,45,39,0.32)] [&::-webkit-slider-thumb]:transition-transform active:[&::-webkit-slider-thumb]:scale-110"
          />
        </div>
        <div className="relative h-4">
          {sizes.map((v, i) => (
            <span
              key={v.id}
              className={`absolute -translate-x-1/2 font-sans text-xs leading-4 tracking-[-0.24px] transition-colors duration-200 ${i === index ? "font-medium text-dark" : "text-dark/65"}`}
              style={{ left: along(i, last) }}
            >
              {v.config.mealCount}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-3 font-sans text-sm font-medium leading-[18px] tracking-[-0.28px] text-dark">
        <span className="flex items-baseline gap-2">
          <AnimatedNumber value={selected.config.mealDiscountedPrice} format={(n) => interpolate(c.sliderPerMeal, { price: money(n) })} />
          {selected.id !== sizes[0].id && <span className="text-xs font-normal leading-4 text-dark/50 line-through">{money(sizes[0].config.mealDiscountedPrice)}</span>}
        </span>
        <span className="text-savings-green">
          <AnimatedNumber value={DISCOUNT_TIERS[tierIndex(selected.config.mealCount)].percent} format={(n) => interpolate(c.sliderOff, { percent: Math.round(n) })} />
        </span>
      </div>
    </div>
  );
}
