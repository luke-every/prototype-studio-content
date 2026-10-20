import Image from "next/image";
import type { ReactNode } from "react";
import { NARROW_INSET_CLASS } from "@/lib/section-width";

type Props = {
  eyebrow: string;
  /** May contain <em> for the serif italic part */
  headline: ReactNode;
  /** Only the first slide is shown */
  slides: string[];
  pillars: { title: string; body: string }[];
  backgroundColor: string;
  /** Clears the PDP rail on desktop; off for full-width pages */
  narrow?: boolean;
};

/** Port of every-website `src/components/website/routine/RoutineComponentV2.tsx`: plain props; one still, ✓ markers, image flush left on desktop. */
export function RoutineComponentV2({ eyebrow, headline, slides, pillars, backgroundColor, narrow = true }: Props) {
  return (
    <section
      className={`w-full overflow-hidden rounded-4xl px-6 pb-16 scroll-mt-19 md:px-8 lg:pb-0 lg:pl-0 ${narrow ? NARROW_INSET_CLASS : "lg:pr-0"}`}
      style={{ backgroundColor }}
    >
      <div className="flex flex-col items-center gap-6 lg:max-w-224 lg:flex-row lg:items-center lg:gap-8">
        <div className="relative -mx-6 aspect-393/300 w-[calc(100%+3rem)] shrink-0 overflow-hidden rounded-t-4xl md:-mx-8 md:w-[calc(100%+4rem)] lg:mx-0 lg:aspect-auto lg:min-h-172 lg:w-[415px] lg:self-stretch lg:rounded-t-none lg:rounded-l-4xl">
          <Image src={slides[0]} alt="" fill unoptimized className="object-cover" sizes="(max-width: 1023px) 100vw, 415px" />
        </div>

        <div className="flex w-full flex-col gap-4 lg:flex-1 lg:pt-16 lg:pb-32">
          <div className="flex flex-col gap-3">
            <p className="font-sans text-xs font-medium uppercase tracking-[-0.24px] text-dark">{eyebrow}</p>
            <h2 className="font-book text-[34px] leading-[34px] tracking-[-0.68px] text-dark lg:text-[48px] lg:leading-12.5 lg:tracking-[-0.96px] [&_em]:font-book-italic">{headline}</h2>
          </div>

          <ul className="flex flex-col gap-8">
            {pillars.map((pillar) => (
              <li key={pillar.title} className="flex items-center gap-6">
                <span aria-hidden="true" className="shrink-0 font-sans text-2xl font-bold leading-6.5 tracking-[-0.48px] text-dark">✓</span>
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="font-sans text-base font-medium leading-[22px] tracking-[-0.32px] text-dark">{pillar.title}</span>
                  <span className="font-sans text-xs leading-4 tracking-[-0.24px] text-dark">{pillar.body}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
