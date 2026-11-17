import type { ReactNode } from "react";
import { ArrowRightLongIcon } from "@/components/icons";
import { Button } from "@/components/shared/Button";

type Props = {
  /** Fills the icon slot (32px in a row, 56px stacked on a phone): give it no size of its own. */
  icon: ReactNode;
  title: string;
  body: string;
  action: string;
  /** "stack": centred with an outlined button on a phone, one row from lg. "row": always the row (icon, copy, round arrow). */
  layout?: "stack" | "row";
  /** Visibility and sizing from the parent (for example hidden on a phone). */
  className?: string;
};

const ARROW = "size-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-near-black text-near-black transition-colors group-hover/cta:bg-near-black group-hover/cta:text-white";

/** A dashed card that points away from the bundle list: icon, a title and one line, then an action. In a row the action is a small round arrow; stacked on a phone it is an outlined button. */
export function CtaCard({ icon, title, body, action, layout = "stack", className = "" }: Props) {
  const row = layout === "row";
  return (
    <section
      className={`group/cta flex items-center rounded-2xl border-2 border-dashed border-light-grey-2 bg-white ${row ? "gap-4 p-4 text-left" : "flex-col gap-3 px-6 py-10 text-center lg:flex-row lg:gap-4 lg:p-4 lg:text-left"} ${className}`}
      aria-label={title}
    >
      <div className={`shrink-0 [&>*]:size-full ${row ? "size-8" : "size-14 lg:size-8"}`}>{icon}</div>
      <div className={`flex flex-col ${row ? "min-w-0 flex-1 gap-0.5" : "max-w-[360px] gap-2 lg:max-w-none lg:flex-1 lg:gap-0.5"}`}>
        <h3 className="font-sans text-base font-medium leading-[22px] tracking-[-0.32px] text-near-black">{title}</h3>
        <p className={`font-sans text-light-text ${row ? "text-sm leading-[18px] tracking-[-0.28px]" : "text-base leading-[22px] tracking-[-0.32px] lg:text-sm lg:leading-[18px] lg:tracking-[-0.28px]"}`}>{body}</p>
      </div>
      {!row && (
        <Button
          type="button"
          sizeClassName="h-12 px-8"
          className="mt-2 shrink-0 justify-center border border-near-black font-sans text-xs font-medium uppercase leading-none tracking-[1.8px] text-near-black lg:hidden"
          aria-label={action}
        >
          {action}
        </Button>
      )}
      <button type="button" aria-label={action} className={`${ARROW} ${row ? "flex" : "hidden lg:flex"}`}>
        <ArrowRightLongIcon size={12} />
      </button>
    </section>
  );
}
