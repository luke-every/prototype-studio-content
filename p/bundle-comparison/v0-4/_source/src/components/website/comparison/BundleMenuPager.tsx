import Image from "next/image";
import Link from "next/link";
import { BUNDLES, isLeader } from "./bundles";
import { NumberRow } from "./NumberRow";

/** Bundle pages for the mobile menu's Bundles dropdown: swipe one bundle at a time, each with its nutrition. */
export function BundleMenuPager({ desktop = false }: { desktop?: boolean }) {
  return (
    <div
      className={
        desktop
          ? "grid grid-cols-4 items-stretch gap-3"
          : "-mx-4 grid snap-x snap-mandatory auto-cols-[82%] grid-flow-col items-stretch gap-3 overflow-x-auto scroll-pl-4 px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      }
    >
      {BUNDLES.map((b) => {
        return (
          <Link key={b.key} href="#" className={`flex snap-start flex-col gap-3 p-3 ${desktop ? "" : "rounded-2xl border border-light-grey-2 bg-white"}`} aria-label={b.title}>
            <div className="relative aspect-[256/200] w-full overflow-clip rounded-xl" style={{ backgroundColor: b.colors.tile }}>
              <div className="absolute" style={b.art}>
                <Image src={b.image} alt="" fill sizes="80vw" className="object-cover" />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <p className="font-sans text-base font-medium leading-[22px] tracking-[-0.32px] text-near-black">{b.title}</p>
              <p className="font-sans text-sm leading-[19px] tracking-[-0.28px] text-light-text">{b.story}</p>
            </div>

            <div className="flex flex-col gap-1.5 border-t border-light-grey pt-3">
              {/* TODO(lift): replace with translation key */}
              <p className="font-sans text-xs font-medium leading-4 tracking-[-0.24px] text-near-black">Average per meal</p>
              <div className="flex flex-col divide-y divide-light-grey overflow-clip rounded-xl border border-light-grey-2">
                <NumberRow label="Protein" value={b.macros.protein} unit="g" highlight={isLeader(b, "protein")} colors={b.colors} compact />
                <NumberRow label="Fibre" value={b.macros.fibre} unit="g" highlight={isLeader(b, "fibre")} colors={b.colors} compact />
                <NumberRow label="Kcal" value={b.macros.kcal} highlight={isLeader(b, "kcal")} colors={b.colors} compact />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
