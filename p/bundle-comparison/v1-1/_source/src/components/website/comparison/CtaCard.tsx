import type { ReactNode } from "react";
import { ArrowRightLongIcon } from "@/components/icons";
import { Button } from "@/components/shared/Button";

type Props = {
  icon: ReactNode;
  title: string;
  body: string;
  action: string;
  /** Visibility and sizing from the parent (for example hidden on a phone). */
  className?: string;
};

/** A dashed card that points away from the bundle list: icon, a title and one line, then an action. Centred and stacked with an outlined button on a phone; one row from lg, with a small round arrow in place of the button. */
export function CtaCard({ icon, title, body, action, className = "" }: Props) {
  return (
    <section className={`group/cta flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-light-grey-2 bg-white px-6 py-10 text-center lg:flex-row lg:gap-4 lg:p-4 lg:text-left ${className}`} aria-label={title}>
      {icon}
      <div className="flex max-w-[360px] flex-col gap-2 lg:max-w-none lg:flex-1 lg:gap-0.5">
        <h3 className="font-sans text-base font-medium leading-[22px] tracking-[-0.32px] text-near-black">{title}</h3>
        <p className="font-sans text-base leading-[22px] tracking-[-0.32px] text-light-text lg:text-sm lg:leading-[18px] lg:tracking-[-0.28px]">{body}</p>
      </div>
      <Button
        type="button"
        sizeClassName="h-12 px-8"
        className="mt-2 shrink-0 justify-center border border-near-black font-sans text-xs font-medium uppercase leading-none tracking-[1.8px] text-near-black lg:hidden"
        aria-label={action}
      >
        {action}
      </Button>
      <button
        type="button"
        aria-label={action}
        className="hidden size-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-near-black text-near-black transition-colors group-hover/cta:bg-near-black group-hover/cta:text-white lg:flex"
      >
        <ArrowRightLongIcon size={12} />
      </button>
    </section>
  );
}
