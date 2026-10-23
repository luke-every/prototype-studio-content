import { NUTRIENT_LABEL, nutrientAverage, type Nutrient } from "./framing";
import type { BoxLine } from "./useBox";

type Props = {
  lines: BoxLine[];
  /** The three nutrients that matter to them, the goal's first */
  nutrients: Nutrient[];
};

/** The box's nutrition as three tiles: the average per meal, big, over what it is */
export function NutritionTiles({ lines, nutrients }: Props) {
  return (
    <ul className="m-0 grid list-none grid-cols-3 gap-2.5 p-0">
      {nutrients.map((nutrient) => (
        <li key={nutrient} className="flex flex-col items-center gap-1 rounded-2xl border border-light-grey px-2 pt-4 pb-3.5">
          <span className="font-book text-[30px] leading-[30px] tracking-[-0.6px] text-dark">
            {nutrientAverage(lines, nutrient)}
            {nutrient !== "kcal" && <span className="ml-0.5 text-base leading-none tracking-[-0.32px]">g</span>}
          </span>
          <span className="text-sm leading-[18px] tracking-[-0.28px] text-light-text">{NUTRIENT_LABEL[nutrient]}</span>
        </li>
      ))}
    </ul>
  );
}
