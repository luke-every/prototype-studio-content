"use client";

import { useState, type ReactNode } from "react";
import { BellOffIcon } from "@/components/icons";
import { NARROW_INSET_CLASS, NARROW_LEFT_CLASS } from "@/lib/section-width";

type Props = {
  strapline: string;
  /** May contain <em> for the serif italic part */
  title: ReactNode;
  subtitle: string;
  footnote: string;
  placeholder: string;
  submitLabel: string;
  backgroundColor: string;
  /** "50" paints backgroundColor at half strength over white, as the PDP does. Default is the full colour. */
  backgroundOpacity?: "50" | "100";
  /** Beside the PDP rail the copy stacks above the form; full width puts them side by side on desktop. */
  narrow?: boolean;
};

/** Port of every-website `src/components/website/homepage/GlobalSubscribeSectionV2.tsx`: plain props, no Klaviyo. */
export function GlobalSubscribeSectionV2({ strapline, title, subtitle, footnote, placeholder, submitLabel, backgroundColor, backgroundOpacity = "100", narrow = true }: Props) {
  const [email, setEmail] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  // TODO(lift): fake subscribe — production posts to Klaviyo through useEmailSignup
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setSuccess(true);
  };

  return (
    <section
      className={`w-full rounded-[32px] px-6 pt-8 pb-16 md:px-8 lg:py-16 ${narrow ? `${NARROW_LEFT_CLASS} ${NARROW_INSET_CLASS}` : "lg:px-40"}`}
      style={{ backgroundColor: backgroundOpacity === "50" ? `${backgroundColor}80` : backgroundColor }}
    >
      <div className={`mx-auto flex max-w-[1120px] flex-col items-start gap-6 ${narrow ? "lg:gap-8" : "justify-between lg:flex-row lg:items-center lg:gap-16"}`}>
        <div className={`flex flex-col items-start gap-4 ${narrow ? "w-full" : "lg:w-[540px]"}`}>
          <div className="flex flex-col items-start gap-3 lg:gap-2.5">
            <p className="font-sans text-xs font-medium uppercase tracking-[-0.24px] text-dark/60">{strapline}</p>
            <h2 className="font-book text-[24px] leading-[26px] tracking-[-0.48px] text-dark lg:text-[48px] lg:leading-[50px] lg:tracking-[-0.96px] [&_em]:font-book-italic">{title}</h2>
          </div>
          <p className="font-sans text-base leading-[28px] text-dark lg:text-lg lg:leading-[1.4] lg:tracking-[-0.36px]">{subtitle}</p>
        </div>

        <div className={`flex w-full flex-col items-start gap-3 ${narrow ? "lg:w-[544px]" : "lg:w-[520px]"}`}>
          {success ? (
            <div className="flex flex-col gap-3">
              {/* TODO(lift): replace with translation key */}
              <p className="font-sans text-xl font-medium text-near-black">Thanks for subscribing!</p>
              <p className="font-sans text-sm tracking-tight text-light-text">Check your inbox to confirm.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex w-full flex-col items-start gap-3">
              <div className="flex w-full items-center gap-2 rounded-full border border-light-grey-3 bg-white py-2 pl-6 pr-2 has-[input:focus-visible]:border-dark has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-dark/20">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={placeholder}
                  required
                  aria-required="true"
                  aria-label={placeholder}
                  className="min-w-0 flex-1 border-none bg-transparent font-sans text-sm tracking-[-0.28px] text-dark outline-none placeholder:text-dark/60"
                />
                <button
                  type="submit"
                  aria-label={submitLabel}
                  className="shrink-0 cursor-pointer rounded-full bg-dark px-6 py-3 font-sans text-sm font-medium leading-none tracking-[-0.28px] text-white"
                >
                  {submitLabel}
                </button>
              </div>
              <div className="flex items-center gap-2 pl-1">
                <BellOffIcon size={16} className="shrink-0 text-light-text" />
                <p className="font-sans text-sm tracking-[-0.28px] text-near-black">{footnote}</p>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
