import type { Bundle } from "./bundles";

/** Marks the bundle that leads a macro: highest protein, highest fibre, lowest kcal. Tinted in the bundle's own colour. */
export function NumberRow({ label, value, unit, highlight, colors, compact }: { label: string; value: number; unit?: string; highlight?: boolean; colors: Bundle["colors"]; compact?: boolean }) {
  return (
    <div className={`flex items-center justify-between px-4 ${compact ? "py-1.5" : "py-3"}`} style={highlight ? { backgroundColor: colors.tile } : undefined}>
      <span className={`font-sans tracking-[-0.24px] ${compact ? "text-xs leading-4" : "text-sm leading-[19px] tracking-[-0.28px]"} ${highlight ? "font-medium text-near-black" : "text-light-text"}`}>{label}</span>
      <span className="flex items-baseline gap-0.5 whitespace-nowrap">
        <span className={`font-book text-dark ${compact ? "text-base leading-5 tracking-[-0.32px]" : "text-2xl leading-7 tracking-[-0.48px]"}`}>{value}</span>
        {unit && <span className={`font-sans text-light-text ${compact ? "text-xs leading-4 tracking-[-0.24px]" : "text-sm leading-[19px] tracking-[-0.28px]"}`}>{unit}</span>}
      </span>
    </div>
  );
}
