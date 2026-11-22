"use client";

import { useState, type ReactNode } from "react";
import { PlusFilledIcon } from "@/components/icons";
import { NARROW_INSET_CLASS, NARROW_LEFT_CLASS } from "@/lib/section-width";

type Props = {
  eyebrow: string;
  /** May contain <em> for the serif italic part */
  headline: ReactNode;
  items: { question: string; answer: string }[];
  /** Clears the PDP rail on desktop; off for full-width pages */
  narrow?: boolean;
};

/**
 * Port of every-website `src/components/website/faq/FaqComponent.tsx`: plain props, one item open at a time.
 * TODO(lift): production keys the generous bottom padding on `pageWidth === "narrow"`; here it is always on, as both designs draw it.
 */
export function FaqComponent({ eyebrow, headline, items, narrow = true }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className={`w-full rounded-4xl bg-white px-6 pt-8 pb-22 lg:pt-16 lg:pb-32 ${narrow ? `${NARROW_LEFT_CLASS} ${NARROW_INSET_CLASS}` : "lg:px-40"}`}>
      <div className="lg:mx-auto lg:max-w-280">
        <div className="flex max-w-3xl flex-col gap-12 lg:gap-6">
          <div className="flex flex-col gap-3">
            <p className="font-sans text-xs font-medium tracking-[-0.24px] text-dark">{eyebrow}</p>
            <h2 className="font-book text-2xl leading-6.5 tracking-[-0.48px] text-dark lg:text-[48px] lg:leading-12.5 lg:tracking-[-0.96px] [&_em]:font-book-italic">{headline}</h2>
          </div>

          <div className="flex flex-col border-t border-light-grey-2">
            {items.map((item, i) => {
              const isOpen = openIndex === i;
              return (
                <div key={item.question} className="border-b border-light-grey-2">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-label={item.question}
                    className="flex w-full cursor-pointer items-center justify-between gap-4 py-5 text-left"
                  >
                    <span className="font-sans text-base font-medium leading-5.5 tracking-[-0.32px] text-dark lg:leading-4.5">{item.question}</span>
                    <span aria-hidden="true" className="flex size-9.5 shrink-0 items-center justify-center rounded-lg border-[1.5px] border-near-black/10">
                      <PlusFilledIcon size={10} className={`text-dark transition-transform ${isOpen ? "rotate-45" : ""}`} />
                    </span>
                  </button>
                  {isOpen && (
                    <div className="pb-5">
                      <p className="font-sans text-sm tracking-[-0.28px] text-dark">{item.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
