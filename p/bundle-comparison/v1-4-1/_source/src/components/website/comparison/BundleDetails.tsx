import Image from "next/image";
import { CheckedIcon, CloseIcon } from "@/components/icons";
import { INCLUDE_ROWS, isLeader, type Bundle } from "./bundles";

/** One tile of the 3-up nutrition row; the tile for a macro this bundle leads is tinted in its colour. */
function Stat({ value, unit, label, highlight, colors }: { value: string; unit?: string; label: string; highlight: boolean; colors: Bundle["colors"] }) {
  return (
    <div
      className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-[14px] p-3 text-center ${highlight ? "" : "bg-dark/6"}`}
      style={highlight ? { backgroundColor: colors.tile } : undefined}
    >
      <div className="flex items-baseline gap-0.5 whitespace-nowrap">
        <span className="font-book text-2xl leading-[26px] tracking-[-0.48px] text-dark">{value}</span>
        {unit && <span className="font-sans text-sm leading-[19px] tracking-[-0.28px] text-light-text">{unit}</span>}
      </div>
      <span className="font-sans text-xs leading-4 tracking-[-0.24px] text-light-text">{label}</span>
    </div>
  );
}

/** The expanded part of a bundle card: everything in the box and the full nutrition card. */
export function BundleDetails({ b }: { b: Bundle }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        {/* TODO(lift): replace with translation key */}
        <p className="font-sans text-sm font-medium leading-[19px] tracking-[-0.28px] text-near-black">What&apos;s included</p>
        <ul className="flex flex-wrap gap-x-4 gap-y-1 font-sans text-sm leading-[19px] tracking-[-0.28px]">
          {INCLUDE_ROWS.map((row) => (
            <li
              key={row.key}
              className={`flex items-center gap-1.5 ${b.includes[row.key] ? "text-light-text" : "text-light-grey-3"}`}
              aria-label={b.includes[row.key] ? row.label : `${row.label}: not included`}
            >
              {b.includes[row.key] ? <CheckedIcon size={16} /> : <CloseIcon size={16} className="text-light-grey-3" />}
              {row.label}
            </li>
          ))}
        </ul>
        <ul className="flex flex-col gap-2 font-sans text-sm leading-[19px] tracking-[-0.28px] empty:hidden">
          {b.gifts.map((gift) => (
            <li key={gift.name} className="flex items-center gap-2 text-light-text">
              <span className="relative size-4 shrink-0 overflow-hidden rounded-sm bg-light-grey">
                <Image src={gift.image} alt="" fill sizes="16px" className="object-cover" />
              </span>
              {gift.name}
              <span className="ml-auto font-sans text-xs font-medium leading-4 tracking-[0.6px] text-light-text">FREE</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-2 border-t border-light-grey pt-4">
        {/* TODO(lift): replace with translation key */}
        <p className="font-sans text-sm font-medium leading-[19px] tracking-[-0.28px] text-near-black">Average per meal</p>
        <div className="flex items-stretch gap-2">
          <Stat value={`${b.macros.protein}`} unit="g" label="Protein" highlight={isLeader(b, "protein")} colors={b.colors} />
          <Stat value={`${b.macros.fibre}`} unit="g" label="Fibre" highlight={isLeader(b, "fibre")} colors={b.colors} />
          <Stat value={`${b.macros.kcal}`} label="Kcal" highlight={isLeader(b, "kcal")} colors={b.colors} />
        </div>
      </div>
    </div>
  );
}
