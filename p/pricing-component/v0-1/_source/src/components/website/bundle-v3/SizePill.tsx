type Props = {
  mealCount: number;
  mealsLabel: string;
  /** Pre-formatted, e.g. "6,09€ /meal" */
  perMeal: string;
  perWeek: string;
  selected?: boolean;
  /** Bundle colour (6-digit hex); the per-week band is this at 25% */
  tint?: string;
  onSelect: () => void;
};

/** New, no production counterpart: Figma "Size Pill" (Bundle Component), Selected=True / False. */
export function SizePill({ mealCount, mealsLabel, perMeal, perWeek, selected = false, tint = "#d7ebc2", onSelect }: Props) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={`${mealCount} ${mealsLabel}`}
      aria-pressed={selected}
      className={`flex min-w-px flex-1 flex-col items-start overflow-clip rounded-2xl border-[1.5px] bg-white p-[0.75px] text-center font-sans text-dark ${selected ? "cursor-default border-dark" : "cursor-pointer border-transparent"}`}
    >
      <span className="flex w-full flex-col gap-1.5 px-4 pt-5 pb-3.5 font-medium">
        <span className="flex w-full flex-col items-center whitespace-nowrap">
          <span className="text-xl leading-[22px] tracking-[-0.4px]">{mealCount}</span>
          <span className="text-base leading-[22px] tracking-[-0.32px]">{` ${mealsLabel}`}</span>
        </span>
        <span className={`w-full text-xs leading-4 tracking-[-0.24px] ${selected ? "" : "text-light-text"}`}>{perMeal}</span>
      </span>
      {/* TODO(lift): sample data — meals per week; production sources it from the box configuration */}
      <span className="w-full pt-1.5 pb-2 text-xs leading-4 tracking-[-0.24px]" style={{ backgroundColor: `${tint}40` }}>
        {perWeek}
      </span>
    </button>
  );
}
