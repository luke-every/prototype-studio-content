"use client";

import Image from "next/image";
import { stepMotion } from "@/lib/step-motion";
import { SelectionTick } from "./SelectionTick";
import type { QuestionOption, StepMotion } from "./types";

type Props = {
  option: QuestionOption;
  selected: boolean;
  /** Position in the list, which staggers the arrival */
  index: number;
  motion: StepMotion;
  onSelect: () => void;
};

/** An option as a row, for every kind of question: an emoji or a picture if it has one, a label and a tick once it is picked */
export function OptionRow({ option, selected, index, motion, onSelect }: Props) {
  const { className, style } = stepMotion(motion, 210 + index * 45);
  return (
    <button
      type="button"
      aria-label={option.label}
      aria-pressed={selected}
      onClick={onSelect}
      style={style}
      className={`flex min-h-16 cursor-pointer items-center gap-3.5 rounded-2xl border bg-white py-4 pr-4 pl-3.5 text-left text-[15px] leading-5 tracking-[-0.3px] text-near-black [transition:scale_260ms_var(--ease-spring),border-color_200ms_var(--ease-ui),box-shadow_200ms_var(--ease-ui)] active:scale-95 active:[transition:scale_60ms_ease-out] ${
        selected ? "border-signal-orange shadow-[inset_0_0_0_1px] shadow-signal-orange" : "border-light-grey"
      } ${className}`}
    >
      {option.image ? (
        <Image src={option.image} alt="" width={44} height={44} className="size-11 shrink-0 object-contain" />
      ) : (
        option.icon && <span className="w-[38px] shrink-0 text-center text-[26px] leading-none">{option.icon}</span>
      )}
      <span className="min-w-0 flex-1">{option.label}</span>
      <SelectionTick visible={selected} className="shrink-0" />
    </button>
  );
}
