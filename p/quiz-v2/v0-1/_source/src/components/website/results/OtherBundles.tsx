import Image from "next/image";
import type { BundleKey } from "../quiz/types";
import { BUNDLE_COLOR, OTHER_BUNDLE_PRICE, OTHER_BUNDLES, PHOTO_PREFIX } from "./sample-data";

type Props = {
  /** The bundle being looked at, which is left out */
  bundle: BundleKey;
};

/** The way out at the foot of the results: every other bundle, each on a wash of its own colour. */
export function OtherBundles({ bundle }: Props) {
  return (
    <div className="pt-[42px] pb-[124px]">
      {/* TODO(lift): replace with translation key */}
      <h2 className="mx-6 mt-0 mb-6 font-book text-[34px] leading-[34px] tracking-[-0.68px] text-near-black">
        Not sure it’s a fit?
        <br />
        Explore other bundles
      </h2>
      <div className="scrollbar-hide flex snap-x snap-mandatory scroll-pl-6 gap-6 overflow-x-auto px-6 pb-12">
        {OTHER_BUNDLES.filter((other) => other.key !== bundle).map((other) => (
          <div
            key={other.key}
            className="flex w-[280px] shrink-0 snap-center flex-col rounded-[28px] border border-light-grey p-5 shadow-[0_3px_12px] shadow-dark/8"
            style={{ background: `linear-gradient(165deg, ${BUNDLE_COLOR[other.key]} 0%, white 58%)` }}
          >
            {/* TODO(lift): replace with translation key */}
            <p className="mt-0 mb-2.5 text-[10px] leading-none font-medium tracking-[1.2px] text-dark uppercase">
              {other.eyebrow}
            </p>
            <h3 className="m-0 font-book text-[21.8px] leading-[24.2px] font-normal tracking-[-0.44px] text-dark">
              {other.name}
            </h3>
            <div className="mt-4 flex gap-1 overflow-hidden rounded-[10px]">
              {[1, 2].map((n) => (
                <span key={n} className="relative h-[148px] min-w-0 flex-1 bg-light-grey">
                  <Image src={`img/exit-${PHOTO_PREFIX[other.key]}${n}.jpg`} alt="" fill sizes="120px" className="object-cover" />
                </span>
              ))}
            </div>
            <p className="mx-0 mt-4 mb-0 text-[13px] leading-[20.8px] text-dark">{other.copy}</p>
            <span className="mt-3.5 text-[13px] leading-[20.8px] font-medium text-dark underline">
              {OTHER_BUNDLE_PRICE} →
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
