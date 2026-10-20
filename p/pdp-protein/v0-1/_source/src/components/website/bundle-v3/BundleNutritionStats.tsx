"use client";

import { interpolate } from "@/lib/translations";
import { usePublicTranslations } from "@/providers/PublicTranslationsProvider";

type Props = {
  /** Tile fill, already at the strength the bundle wants. */
  tileColor: string;
  avgProtein: string;
  avgFibre: string;
  avgKcal: string;
  mealCount: number;
  onViewAll: () => void;
};

/** Port of every-website `src/components/website/bundle-v2/BundleNutritionStats.tsx` (`design="v3"`): plain props. */
export function BundleNutritionStats({ tileColor, avgProtein, avgFibre, avgKcal, mealCount, onViewAll }: Props) {
  const t = usePublicTranslations();

  const stats = [
    { value: avgProtein, unit: "g", label: t.bundle.protein },
    { value: avgFibre, unit: "g", label: t.bundle.fibre },
    { value: avgKcal, unit: t.bundle.kcal, label: t.bundle.perMealUnit },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <span className="text-center font-sans text-xs leading-4 tracking-[-0.24px] text-dark/65 lg:text-left lg:text-[13px] lg:leading-normal lg:tracking-normal">
          {t.bundle.averagePerMeal}
        </span>
        <div className="flex h-[83px] items-start gap-2">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex h-full flex-1 flex-col items-center gap-1 rounded-[14px] p-3 text-center lg:w-44 lg:flex-none"
              style={{ backgroundColor: tileColor }}
            >
              <div className="flex items-baseline gap-0.5 whitespace-nowrap">
                <span className="font-book text-[34px] leading-[34px] tracking-[-0.68px] text-dark">{stat.value}</span>
                <span className="font-sans text-sm leading-[19px] tracking-[-0.28px] text-light-text">{stat.unit}</span>
              </div>
              <span className="pt-0.5 font-sans text-sm leading-[19px] tracking-[-0.28px] text-light-text">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onViewAll}
        className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-full border border-dark bg-transparent px-[25px] py-3 font-sans text-xs font-medium uppercase leading-none tracking-[1.8px] text-dark transition-colors hover:bg-light-brown lg:inline-flex lg:w-auto lg:self-start lg:py-[13px] lg:text-sm lg:font-normal lg:leading-[14px] lg:tracking-[2px]"
      >
        {interpolate(t.bundle.viewAllMeals, { count: mealCount })}
        <span aria-hidden>→</span>
      </button>
    </div>
  );
}
