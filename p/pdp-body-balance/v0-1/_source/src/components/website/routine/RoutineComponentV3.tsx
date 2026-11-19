import type { ReactNode } from "react";
import { NARROW_INSET_CLASS } from "@/lib/section-width";

type Props = {
  /** May contain <br /> for line breaks */
  headline: ReactNode;
  pillars: { title: string; body: string }[];
  backgroundColor?: string;
  /** Clears the PDP rail on desktop; off for full-width pages */
  narrow?: boolean;
};

/** Variant of RoutineComponentV2: headline and ✓ pillars on top, image area below. TODO: swap the placeholder for the phone-in-hand image. */
export function RoutineComponentV3({ headline, pillars, backgroundColor = "#FFFFFF", narrow = true }: Props) {
  return (
    <section
      className={`w-full overflow-hidden rounded-4xl px-6 pt-10 pb-0 md:px-8 lg:pb-16 ${narrow ? NARROW_INSET_CLASS : ""}`}
      style={{ backgroundColor }}
    >
      <div className="flex flex-col gap-6">
        <h2 className="font-book text-[34px] leading-[34px] tracking-[-0.68px] text-dark lg:text-[48px] lg:leading-12.5 lg:tracking-[-0.96px]">{headline}</h2>

        <ul className="flex flex-col gap-6">
          {pillars.map((pillar) => (
            <li key={pillar.title} className="flex items-center gap-6 pr-4">
              <span aria-hidden="true" className="shrink-0 font-sans text-2xl font-bold leading-6.5 tracking-[-0.48px] text-dark">✓</span>
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="font-sans text-base font-medium leading-[22px] tracking-[-0.32px] text-dark">{pillar.title}</span>
                <span className="font-sans text-xs leading-4 tracking-[-0.24px] text-dark">{pillar.body}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Placeholder for the phone / napkin image */}
      <div className="mt-8 flex h-[305px] w-full items-center justify-center rounded-t-3xl bg-[#EFE9F0] font-sans text-xs text-dark/50 lg:mt-10">
        Image placeholder
      </div>
    </section>
  );
}
