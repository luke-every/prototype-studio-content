import Image from "next/image";
import type { ReactNode } from "react";
import { NARROW_INSET_CLASS, NARROW_LEFT_CLASS } from "@/lib/section-width";

type Props = {
  /** May contain <em> for the serif italic part */
  headline: ReactNode;
  items: { icon: string; label: string }[];
  backgroundColor?: string;
  /** Clears the PDP rail on desktop; off for full-width pages */
  narrow?: boolean;
};

/** Port of every-website `src/components/website/usp-grid/GlobalUspGridV2.tsx`: plain props instead of the Storyblok blok; `narrow` replaces `pageWidth`. */
export function GlobalUspGridV2({ headline, items, backgroundColor = "#FFFFFF", narrow = true }: Props) {
  return (
    <section
      className={`w-full rounded-4xl px-6 pt-8 pb-16 scroll-mt-19 md:px-8 lg:pt-16 lg:pb-32 ${narrow ? `${NARROW_LEFT_CLASS} ${NARROW_INSET_CLASS}` : "lg:px-40"}`}
      style={{ backgroundColor }}
    >
      <div className="mx-auto flex max-w-280 flex-col items-center gap-4 lg:items-start lg:gap-12">
        <h2 className="text-center font-book text-2xl leading-6.5 tracking-[-0.48px] text-dark lg:text-left lg:text-5xl lg:leading-12.5 lg:tracking-[-0.96px] [&_em]:font-book-italic">
          {headline}
        </h2>

        <ul className="grid w-full grid-cols-2 lg:flex lg:flex-row lg:justify-start lg:gap-16">
          {items.map((item) => (
            <li key={item.label} className="flex flex-col items-center gap-2 px-4 py-6 lg:w-40 lg:items-start lg:p-0">
              <span className="flex size-12 items-center justify-center">
                <Image src={item.icon} alt="" width={48} height={48} unoptimized className="size-full object-contain" />
              </span>
              <span className="text-center font-sans text-sm leading-4.75 tracking-[-0.28px] text-dark lg:text-left">{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
