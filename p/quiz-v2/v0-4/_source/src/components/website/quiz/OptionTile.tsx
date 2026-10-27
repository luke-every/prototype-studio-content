"use client";

import Image from "next/image";
import { stepMotion } from "@/lib/step-motion";
import { SelectionTick } from "./SelectionTick";
import type { QuestionOption, StepMotion } from "./types";

type Props = {
  option: QuestionOption;
  selected: boolean;
  /** Position in the grid, which staggers the arrival */
  index: number;
  motion: StepMotion;
  onSelect: () => void;
};

/** A single-select option as a tile: a picture over its label */
export function OptionTile({ option, selected, index, motion, onSelect }: Props) {
  const { className, style } = stepMotion(motion, 210 + index * 45);
  return (
    <button
      type="button"
      aria-label={option.label}
      aria-pressed={selected}
      onClick={onSelect}
      style={style}
      className={`relative flex min-h-[152px] cursor-pointer flex-col items-center justify-center gap-2 rounded-[18px] border bg-white px-8 pt-[18px] pb-6 text-center text-[14.5px] leading-[19.5px] tracking-[-0.29px] text-near-black [transition:scale_260ms_var(--ease-spring),border-color_200ms_var(--ease-ui),box-shadow_200ms_var(--ease-ui)] active:scale-95 active:[transition:scale_60ms_ease-out] ${
        selected ? "border-signal-orange shadow-[inset_0_0_0_1px] shadow-signal-orange" : "border-light-grey"
      } ${className}`}
    >
      <span className="text-[40px] leading-none">
        {option.icon.startsWith("img/") ? (
          <Image src={option.icon} alt="" width={80} height={80} loading="eager" decoding="sync" className="block size-20 object-contain" />
        ) : (
          option.icon
        )}
      </span>
      <span>{option.label}</span>
      <SelectionTick visible={selected} className="absolute top-[11px] right-[11px]" />
    </button>
  );
}
