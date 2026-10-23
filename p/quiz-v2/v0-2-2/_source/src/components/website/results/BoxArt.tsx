"use client";

import Image from "next/image";
import { ImageFallback } from "@/components/shared/ImageFallback";

type Props = {
  /** Photos of the box's first three meals */
  images: string[];
  /** The lid opens and the plates rise; false holds the box closed */
  open: boolean;
  /** Arrived without a loader, so it starts open and doesn't move */
  instant: boolean;
  className?: string;
  style?: React.CSSProperties;
};

/** Where the three plates sit in the box, back to front */
const PLATES = ["left-[18px] top-[52px] -rotate-[8deg]", "left-[100px] top-[30px] z-[1]", "left-[182px] top-[52px] rotate-[8deg]"];

// TODO(lift): fake — a drawn box stands in for a photo of the real box; check with Brand whether a box image is wanted at all
/** The box, drawn: its lid opens and three of the customer's meals rise out of it */
export function BoxArt({ images, open, instant, className = "", style }: Props) {
  const settle = instant ? "" : "transition-[rotate,translate] duration-[900ms] ease-spring delay-300";
  return (
    <div aria-hidden className={`relative h-[230px] w-[280px] ${className}`} style={style}>
      <span
        className={`absolute top-[78px] left-[-6px] h-[34px] w-[150px] origin-bottom-left rounded-[6px] bg-light-orange shadow-[inset_0_-6px_0] shadow-dark/8 ${settle} ${
          open ? "-rotate-[16deg]" : "rotate-0"
        }`}
      />
      <span className="absolute inset-x-0 top-[96px] h-[24px] rounded-t-[6px] bg-light-orange shadow-[inset_0_8px_10px] shadow-dark/14" />
      {images.slice(0, 3).map((src, i) => (
        <span
          key={`${src}${i}`}
          className={`absolute size-[96px] overflow-hidden rounded-full border-4 border-white bg-light-grey shadow-[0_4px_10px] shadow-dark/16 ${PLATES[i]} ${settle} ${
            open ? "translate-y-0" : "translate-y-[70px]"
          }`}
        >
          {src ? <Image src={src} alt="" fill sizes="96px" className="object-cover" /> : <ImageFallback size={32} />}
        </span>
      ))}
      <span className="absolute inset-x-0 bottom-0 z-[2] flex h-[120px] items-end justify-center rounded-[10px] rounded-t-[4px] bg-light-orange pb-5 shadow-[0_14px_30px] shadow-dark/18">
        <span className="text-[30px] leading-none font-bold tracking-[-0.6px] text-dark/80">every</span>
      </span>
    </div>
  );
}
