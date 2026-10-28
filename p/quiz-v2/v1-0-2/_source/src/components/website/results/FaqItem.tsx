"use client";

import { useState } from "react";

// TODO(lift): the shared Accordion has no grow animation and a bare plus; this one needs a prop on <Accordion> for both.
type Props = {
  question: string;
  answer: string;
};

/** A question that opens by growing, never by snapping */
export function FaqItem({ question, answer }: Props) {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div className="border-b border-light-grey-2 first-of-type:border-t">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center gap-6 py-5 text-left"
      >
        <span className="flex-1 text-base leading-[22px] font-medium tracking-[-0.32px] text-dark">{question}</span>
        <span
          className={`relative size-[38px] shrink-0 rounded-lg border-[1.5px] transition-colors duration-[250ms] ease-ui ${
            open ? "border-near-black/28" : "border-near-black/10"
          }`}
          aria-hidden
        >
          <span className="absolute top-1/2 left-1/2 h-[1.5px] w-3 -translate-x-1/2 -translate-y-1/2 bg-near-black" />
          <span
            className={`absolute top-1/2 left-1/2 h-3 w-[1.5px] -translate-x-1/2 -translate-y-1/2 bg-near-black [transition:rotate_400ms_var(--ease-swing),opacity_300ms_var(--ease-ui)] ${
              open ? "rotate-90 opacity-0" : ""
            }`}
          />
        </span>
      </button>
      <div className={`grid [transition:grid-template-rows_450ms_var(--ease-ui)] ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <p className="mt-0 mr-[62px] mb-5 ml-0 text-sm leading-5 text-light-text">{answer}</p>
        </div>
      </div>
    </div>
  );
}
