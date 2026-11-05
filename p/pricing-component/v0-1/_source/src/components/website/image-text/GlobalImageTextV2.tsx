import Image from "next/image";
import type { ReactNode } from "react";
import { NARROW_INSET_CLASS, NARROW_LEFT_CLASS } from "@/lib/section-width";

type Props = {
  /** May contain <em> for the serif italic part */
  headline: ReactNode;
  body: string;
  image: string;
  imageAlt?: string;
  /** Clears the PDP rail on desktop; off for full-width pages */
  narrow?: boolean;
};

/** Port of every-website `src/components/website/image-text/GlobalImageTextV2.tsx`: plain props; image above the text on mobile, beside it from md. */
export function GlobalImageTextV2({ headline, body, image, imageAlt = "", narrow = true }: Props) {
  return (
    <section className={`w-full rounded-4xl bg-white px-6 pt-8 pb-16 scroll-mt-19 md:px-8 lg:pt-16 lg:pb-32 ${narrow ? `${NARROW_LEFT_CLASS} ${NARROW_INSET_CLASS}` : "lg:px-40"}`}>
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-6 lg:max-w-184 lg:gap-8">
        <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-[28px] md:w-86">
          <Image src={image} alt={imageAlt} fill unoptimized className="object-cover" sizes="(max-width: 767px) 100vw, 344px" />
        </div>
        <div className="flex flex-col gap-4 md:min-w-0 md:flex-1">
          <h2 className="font-book text-2xl leading-6.5 tracking-[-0.48px] text-dark lg:text-5xl lg:leading-[50px] lg:tracking-[-0.96px] [&_em]:font-book-italic">{headline}</h2>
          <p className="font-sans text-sm leading-4.75 tracking-[-0.28px] text-dark lg:text-lg lg:leading-[1.4] lg:tracking-[-0.36px]">{body}</p>
        </div>
      </div>
    </section>
  );
}
