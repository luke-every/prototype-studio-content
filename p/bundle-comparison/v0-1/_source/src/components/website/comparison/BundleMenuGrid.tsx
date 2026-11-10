import Image from "next/image";
import Link from "next/link";
import { BUNDLES, type MacroKey } from "./bundles";

export const MACRO_LABEL: Record<MacroKey, { label: string; unit?: string }> = {
  protein: { label: "Protein", unit: "g" },
  fibre: { label: "Fibre", unit: "g" },
  kcal: { label: "Kcal" },
};

/** Bundle cards for the mobile menu's Bundles dropdown: one card each, with the key nutrition factor under the description. */
export function BundleMenuGrid({ columns = 2 }: { columns?: 2 | 4 }) {
  return (
    <div className={`grid gap-3 ${columns === 4 ? "grid-cols-4" : "grid-cols-2"}`}>
      {BUNDLES.map((b) => {
        const macro = MACRO_LABEL[b.keyMacro];
        return (
          <Link key={b.key} href="#" className={`flex flex-col gap-3 p-2 ${columns === 4 ? "" : "rounded-2xl border border-light-grey-2 bg-white"}`} aria-label={b.title}>
            <div className="overflow-clip rounded-xl" style={{ backgroundColor: b.colors.tile }}>
              <div className="relative aspect-[256/230] w-full">
                <div className="absolute" style={b.art}>
                  <Image src={b.image} alt="" fill sizes="50vw" className="object-contain" />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-1 px-1 pb-1">
              <p className="font-sans text-sm font-medium leading-[19px] tracking-[-0.28px] text-near-black">{b.title}</p>
              <p className="font-sans text-xs leading-4 tracking-[-0.24px] text-light-text">{b.shortStory}</p>
              <p className="mt-1 flex items-baseline justify-between border-t border-light-grey pt-2">
                <span className="font-sans text-xs leading-4 tracking-[-0.24px] text-light-text">{macro.label}</span>
                <span className="font-book text-base leading-5 tracking-[-0.32px] text-dark">
                  {b.macros[b.keyMacro]}
                  {macro.unit && <span className="font-sans text-xs tracking-[-0.24px] text-light-text">{macro.unit}</span>}
                </span>
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
