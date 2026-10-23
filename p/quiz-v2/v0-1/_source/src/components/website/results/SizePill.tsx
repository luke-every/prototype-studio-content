"use client";

import { SIZE_TAGLINES } from "./sample-data";
import type { BoxSize } from "./types";

type Props = {
  size: BoxSize;
  index: number;
  selected: boolean;
  onSelect: () => void;
};

export function SizePill({ size, index, selected, onSelect }: Props) {
  const tagline = size.tagline ?? SIZE_TAGLINES[index]?.join("\n");
  return (
    <button
      type="button"
      aria-label={`${size.n} ${size.label ?? "MEALS"}`}
      aria-pressed={selected}
      onClick={onSelect}
      className={`relative flex flex-1 cursor-pointer flex-col items-center gap-0.5 rounded-2xl border px-[11px] py-[21px] transition-[scale,background-color,border-color,box-shadow] duration-[240ms] ease-spring active:scale-[.96] active:duration-[90ms] active:ease-out ${
        selected ? "border-dark bg-white shadow-[0_4px_8px] shadow-dark/12" : "border-light-grey-3 bg-off-white"
      }`}
    >
      {size.popular && (
        <span className="absolute -top-[13px] left-1/2 -translate-x-1/2 rounded bg-brown-border px-2 py-1 text-[8px] leading-[13px] tracking-[-0.16px] whitespace-nowrap text-white">
          POPULAR
        </span>
      )}
      <span className="font-book text-xl leading-5 tracking-[-0.4px] text-dark">{size.n}</span>
      <span className="text-xs leading-4 tracking-[-0.24px] text-dark">{size.label ?? "MEALS"}</span>
      <span className="pt-0.5 text-xs leading-4 font-medium tracking-[-0.24px] text-dark">{size.per} / meal</span>
      <span className="pt-1.5 text-center text-xs leading-[17px] tracking-[-0.24px] whitespace-pre-line text-dark/75">
        {tagline}
      </span>
    </button>
  );
}
