import { ChilliIcon } from "@/components/icons";
import type { HeroTile } from "./framing";

type Props = {
  tiles: HeroTile[];
  /** On the hero's tint, or on the white page */
  tone: "hero" | "page";
};

const COLS = ["grid-cols-1", "grid-cols-1", "grid-cols-2", "grid-cols-3"];

/** Up to three facts side by side in one bar, split by dividers: a value (or chillies) over its label */
export function StatBar({ tiles, tone }: Props) {
  return (
    <ul
      className={`m-0 grid list-none divide-x divide-dark/12 rounded-2xl p-0 py-3.5 ${COLS[tiles.length]} ${
        tone === "hero" ? "bg-white/60" : "border border-light-grey"
      }`}
    >
      {tiles.map(({ key, value, unit, label, heat }) => (
        <li key={key} className="flex flex-col items-center gap-1">
          {heat ? (
            <span className="flex h-5 items-center gap-0.5" aria-label={`${heat} of 3 chillies`}>
              {[1, 2, 3].map((n) => (
                <ChilliIcon key={n} size={16} className={n <= heat ? "text-chilli-red" : "text-dark/15"} />
              ))}
            </span>
          ) : (
            <span className="flex h-5 items-baseline font-book text-xl leading-5 tracking-[-0.4px] text-dark">
              {value}
              {unit && <span className="ml-0.5 text-xs leading-none tracking-[-0.24px]">{unit}</span>}
            </span>
          )}
          <span className="px-2 text-center text-xs leading-4 tracking-[-0.24px] text-light-text">{label}</span>
        </li>
      ))}
    </ul>
  );
}
