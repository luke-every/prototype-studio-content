import type { Goal } from "@/lib/recommendation";
import type { BoxLine } from "./useBox";

type Props = {
  goal: Goal;
  lines: BoxLine[];
};

// TODO(lift): sample data — the same three numbers for every goal; each goal says what its number does for them
const WHY: Record<Goal, { prot: string; fib: string; kcal: string }> = {
  fitness: {
    prot: "to repair your muscles",
    fib: "for steadier energy",
    kcal: "to fuel your training",
  },
  gut: {
    prot: "to keep every meal satisfying",
    fib: "to feed your gut bacteria",
    kcal: "so meals stay easy to digest",
  },
  lose: {
    prot: "to keep you full for longer",
    fib: "so hunger returns later",
    kcal: "so portions are never a guess",
  },
  baby: {
    prot: "to help you recover",
    fib: "to keep digestion regular",
    kcal: "to keep you going between feeds",
  },
  easy: {
    prot: "for steady energy",
    fib: "the nutrient most adults lack",
    kcal: "the size of a balanced main meal",
  },
};

const average = (lines: BoxLine[], key: "prot" | "fib" | "kcal") => {
  const units = lines.reduce((n, line) => n + line.qty, 0);
  return units
    ? Math.round(
        lines.reduce((sum, line) => sum + line.meal[key] * line.qty, 0) / units,
      )
    : 0;
};

/** The box's protein, fibre and calories per meal, each with what it does for their goal */
export function NutritionNumbers({ goal, lines }: Props) {
  const tiles = [
    { key: "prot", value: `${average(lines, "prot")} g`, name: "protein" },
    { key: "fib", value: `${average(lines, "fib")} g`, name: "fibre" },
    { key: "kcal", value: `${average(lines, "kcal")}`, name: "kcal" },
  ] as const;
  return (
    <ul className="m-0 mx-6 grid list-none grid-cols-3 gap-2 p-0">
      {tiles.map((tile) => (
        <li
          key={tile.key}
          className="flex flex-col items-start rounded-2xl bg-light-brown p-3"
        >
          <span className="font-book text-[26px] leading-7 tracking-[-0.52px] text-dark">
            {tile.value}
          </span>
          <span className="mt-1 text-xs leading-4 tracking-[-0.24px] text-light-text">
            <span className="font-medium text-dark">{tile.name}</span>{" "}
            {WHY[goal][tile.key]}
          </span>
        </li>
      ))}
    </ul>
  );
}
