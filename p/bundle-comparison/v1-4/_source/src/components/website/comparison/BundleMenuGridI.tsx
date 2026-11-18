import Image from "next/image";
import Link from "next/link";
import { BUNDLES } from "./bundles";
import { MACRO_LABEL } from "./BundleMenuGrid";

/** Bundle cards for the mobile menu, led by how many meals come in the box, then any free extras, then the key nutrient. */
export function BundleMenuGridI({ columns = 2 }: { columns?: 2 | 4 }) {
  return (
    <div className={`grid gap-3 ${columns === 4 ? "grid-cols-4" : "grid-cols-2"}`}>
      {BUNDLES.map((b) => {
        const macro = MACRO_LABEL[b.keyMacro];
        const { mains, breakfast, snacks } = b.counts ?? {};
        return (
          <Link key={b.key} href="#" className={`flex flex-col gap-3 p-2 ${columns === 4 ? "" : "rounded-2xl border border-light-grey-2 bg-white"}`} aria-label={b.title}>
            <div className="overflow-clip rounded-xl" style={{ backgroundColor: b.colors.tile }}>
              <div className="relative aspect-[256/195] w-full">
                <div className="absolute" style={b.art}>
                  <Image src={b.image} alt="" fill sizes="50vw" className="object-cover" />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 px-1 pb-1">
              <p className="font-sans text-sm font-medium leading-[19px] tracking-[-0.28px] text-near-black">{b.title}</p>

              {mains && (
                <div className="flex flex-col gap-0.5 rounded-lg px-2.5 py-2" style={{ backgroundColor: b.colors.tile }}>
                  <p className="flex items-baseline gap-1">
                    <span className="font-book text-xl leading-6 tracking-[-0.4px] text-dark">{mains}</span>
                    {/* TODO(lift): replace with translation key */}
                    <span className="font-sans text-xs leading-4 tracking-[-0.24px] text-near-black">meals</span>
                  </p>
                  {(breakfast || snacks) && (
                    <p className="font-sans text-xs leading-4 tracking-[-0.24px] text-near-black">
                      {/* TODO(lift): replace with translation key */}+ {breakfast} breakfasts, {snacks} snacks
                    </p>
                  )}
                </div>
              )}

              {b.gifts.length > 0 && (
                <div className="flex items-center gap-2 border-t border-light-grey pt-2">
                  <span className="flex -space-x-2">
                    {b.gifts.map((gift) => (
                      <span key={gift.name} className="relative size-6 shrink-0 overflow-hidden rounded-md border-2 border-white bg-light-grey">
                        <Image src={gift.image} alt="" fill sizes="24px" className="object-cover" />
                      </span>
                    ))}
                  </span>
                  {/* TODO(lift): replace with translation key */}
                  <span className="font-sans text-xs leading-4 tracking-[-0.24px] text-light-text">{b.gifts.length} free {b.gifts.length === 1 ? "extra" : "extras"}</span>
                </div>
              )}

              <p className="flex items-baseline justify-between border-t border-light-grey pt-2">
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
