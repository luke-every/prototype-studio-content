import { marqueePhotos } from "@/lib/photos";
import { CheckedIcon } from "@/components/icons";
import type { BundleKey } from "../quiz/types";
import { Headline } from "./Headline";
import { PhotoMarquee } from "./PhotoMarquee";
import { CONTENT_HEADLINE, CONTENT_POINTS } from "./sample-data";

type Props = {
  bundle: BundleKey;
};

/** Variant A's section on the bundle's own colour: a headline, the marquee of photographs and four points down a line. */
export function ContentSection({ bundle }: Props) {
  return (
    <div className="flex flex-col gap-7 rounded-t-[32px] bg-(--bundle) pt-16 pb-12">
      <h2 className="mx-6 my-0 font-book text-[34px] leading-9 tracking-[-0.68px] text-near-black">
        <Headline text={CONTENT_HEADLINE[bundle]} />
      </h2>
      <PhotoMarquee photos={marqueePhotos(bundle)} />
      <div className="relative mx-6 flex flex-col gap-7">
        {/* the line the points hang from, behind the pictures */}
        <span className="absolute top-6 bottom-6 left-[23px] w-px bg-dark/25" aria-hidden />
        {CONTENT_POINTS[bundle].map(([lead, rest]) => (
          <div key={lead} className="relative flex items-start gap-4">
            <span className="flex size-[46px] shrink-0 items-center justify-center rounded-full bg-white shadow-[0_1px_3px] shadow-dark/12">
              <CheckedIcon size={16} />
            </span>
            <p className="m-0 pt-0.5">
              <b className="block text-base leading-[22px] font-medium tracking-[-0.32px] text-near-black">{lead}</b>
              <span className="mt-0.5 block text-[13px] leading-[19px] tracking-[-0.26px] text-dark/72">{rest}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
