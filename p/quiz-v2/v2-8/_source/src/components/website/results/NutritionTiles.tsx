import { nutrientAverage } from "./framing";
import type { BoxLine } from "./useBox";

type Props = {
  lines: BoxLine[];
  className?: string;
};

/** The PDP's three tiles on a darker tint of the section's colour: the box's fibre and protein per meal, then its calories */
export function NutritionTiles({ lines, className = "" }: Props) {
  const tiles = [
    {
      key: "fib",
      value: nutrientAverage(lines, "fib"),
      unit: "g",
      label: "Fibre",
    },
    {
      key: "prot",
      value: nutrientAverage(lines, "prot"),
      unit: "g",
      label: "Protein",
    },
    {
      key: "kcal",
      value: nutrientAverage(lines, "kcal"),
      unit: "kcal",
      label: "per meal",
    },
  ];
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {/* TODO(lift): replace with translation key */}
      <span className="text-center text-xs leading-4 tracking-[-0.24px] text-dark/65">
        Average per meal
      </span>
      <div className="flex h-[83px] items-start gap-2">
        {tiles.map(({ key, value, unit, label }) => (
          <div
            key={key}
            className="flex h-full flex-1 flex-col items-center gap-1 rounded-[14px] bg-dark/6 p-3 text-center"
          >
            <div className="flex items-baseline gap-0.5 whitespace-nowrap">
              <span className="font-book text-[34px] leading-[34px] tracking-[-0.68px] text-dark">
                {value}
              </span>
              <span className="text-sm leading-[19px] tracking-[-0.28px] text-light-text">
                {unit}
              </span>
            </div>
            <span className="pt-0.5 text-sm leading-[19px] tracking-[-0.28px] text-light-text">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
