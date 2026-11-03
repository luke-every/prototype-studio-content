import { nutrientAverage } from "./framing";
import type { BoxLine } from "./useBox";

type Props = {
  lines: BoxLine[];
  className?: string;
  /** No "Average per meal" caption: Ø on the labels says it, and the calories are labelled kcal */
  symbol?: boolean;
};

/** The PDP's three tiles on a darker tint of the section's colour: the box's fibre and protein per meal, then its calories */
export function NutritionTiles({
  lines,
  className = "",
  symbol = false,
}: Props) {
  const tiles = [
    {
      key: "fib",
      value: nutrientAverage(lines, "fib"),
      unit: "g",
      label: symbol ? "Ø Fibre" : "Fibre",
    },
    {
      key: "prot",
      value: nutrientAverage(lines, "prot"),
      unit: "g",
      label: symbol ? "Ø Protein" : "Protein",
    },
    {
      key: "kcal",
      value: nutrientAverage(lines, "kcal"),
      unit: symbol ? "" : "kcal",
      label: symbol ? "Ø Calories" : "per meal",
    },
  ];
  /* the outlined version leads with protein, as the PDP's tiles do */
  if (symbol) tiles.unshift(tiles.splice(1, 1)[0]);
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {/* TODO(lift): replace with translation key */}
      {!symbol && (
        <span className="text-center text-xs leading-4 tracking-[-0.24px] text-dark/65">
          Average per meal
        </span>
      )}
      <div className={`flex items-start gap-2 ${symbol ? "" : "h-[83px]"}`}>
        {tiles.map(({ key, value, unit, label }) => (
          <div
            key={key}
            className={`flex flex-1 flex-col items-center text-center ${symbol ? "gap-0" : "gap-1"} ${
              symbol
                ? "rounded-3xl border border-light-grey px-3 pt-3 pb-4"
                : "h-full rounded-[14px] bg-dark/6 p-3"
            }`}
          >
            <div className="flex items-baseline gap-0.5 whitespace-nowrap">
              <span
                className={`font-book text-dark ${symbol ? "text-2xl leading-8 tracking-[-0.48px]" : "text-[34px] leading-[34px] tracking-[-0.68px]"}`}
              >
                {value}
              </span>
              <span className="text-sm leading-[19px] tracking-[-0.28px] text-light-text">
                {unit}
              </span>
            </div>
            <span
              className={`${symbol ? "" : "pt-0.5"} leading-[19px] tracking-[-0.28px] text-sm text-light-text`}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
