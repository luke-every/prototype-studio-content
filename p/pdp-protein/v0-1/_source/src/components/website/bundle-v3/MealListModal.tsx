"use client";

import Image from "next/image";
import { useRef } from "react";
import { ChevronRightFilledIcon, CloseFilledIcon } from "@/components/icons";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { useModalFocusTrap } from "@/hooks/useModalFocusTrap";
import { buildMacroStats } from "@/lib/meals/macroStats";
import { useTranslations } from "@/providers/TranslationsProvider";
import type { BundleMeal } from "./types";

type MacroPillProps = { value: number | string; unit?: string; label: string };

function MacroPill({ value, unit, label }: MacroPillProps) {
  return (
    <div className="flex items-center gap-1 rounded-lg bg-dark/6 p-1">
      <div className="flex items-baseline gap-0.5">
        <span className="font-sans text-xs font-bold leading-4 text-dark">{value}</span>
        {unit && <span className="font-sans text-xs leading-4 tracking-[-0.24px] text-dark">{unit}</span>}
      </div>
      <span className="font-sans text-xs leading-4 text-dark">{label}</span>
    </div>
  );
}

function MealListItem({ meal, onSelect }: { meal: BundleMeal; onSelect: () => void }) {
  const t = useTranslations();

  const macroStats = buildMacroStats([
    { key: "protein", value: meal.protein, label: t.shared.modals.mealList.protein, unit: "g" },
    { key: "fibre", value: meal.fibre, label: t.shared.modals.mealList.fibre, unit: "g" },
    { key: "kcal", value: meal.kcal, label: t.shared.modals.mealList.kcal },
  ]);

  return (
    <div className="flex w-full flex-col gap-3">
      <button type="button" onClick={onSelect} aria-label={meal.title} className="flex w-full cursor-pointer items-start gap-3 text-left">
        <span className="relative size-26 shrink-0 overflow-hidden rounded-xl">
          <Image src={meal.image} alt="" fill unoptimized className="object-cover object-left-top" sizes="104px" />
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="font-book-italic text-lg leading-5 text-dark">{meal.title}</span>
          <span className="font-sans text-xs leading-4 text-dark">{meal.ingredients}</span>
          <span className="flex items-start gap-2">
            {macroStats.map((stat) => (
              <MacroPill key={stat.key} value={stat.value} unit={stat.unit} label={stat.label} />
            ))}
          </span>
        </span>
        <span className="flex h-26 shrink-0 items-center">
          <ChevronRightFilledIcon size={10} />
        </span>
      </button>
      <div className="w-full border-y border-[#eeeae6]" />
    </div>
  );
}

type Props = {
  open: boolean;
  meals: BundleMeal[];
  onClose: () => void;
  onSelectMeal: (meal: BundleMeal) => void;
};

/** Port of every-website `src/components/website/meal-modals/MealListModal.tsx`: same markup, takes plain BundleMeal items. */
export function MealListModal({ open, meals, onClose, onSelectMeal }: Props) {
  const t = useTranslations();
  const dialogRef = useRef<HTMLDivElement>(null);

  useModalFocusTrap(open, dialogRef, onClose);
  useBodyScrollLock(open);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[rgba(30,30,30,0.55)] backdrop-blur-[2px]" onClick={onClose}>
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={t.shared.modals.mealList.title}
        onClick={(e) => e.stopPropagation()}
        className="fixed inset-x-0 bottom-0 flex max-h-[90dvh] w-full flex-col overflow-hidden rounded-t-[28px] bg-white outline-none lg:inset-0 lg:m-auto lg:h-fit lg:w-140 lg:rounded-[28px]"
      >
        <div className="flex h-20 shrink-0 items-center justify-between rounded-t-[28px] border border-[#eeeae6] px-6">
          <h2 className="font-book text-2xl leading-6.5 tracking-[-0.48px] text-dark">{t.shared.modals.mealList.title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.shared.modals.close}
            className="flex size-8 items-center justify-center rounded-2xl bg-[#eeeae6]/85"
          >
            <span className="relative flex size-4 items-center justify-center">
              <CloseFilledIcon size={10} />
            </span>
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto bg-white px-6 py-8">
          {meals.map((meal, i) => (
            <MealListItem key={`${meal.id}-${i}`} meal={meal} onSelect={() => onSelectMeal(meal)} />
          ))}
        </div>
      </div>
    </div>
  );
}
