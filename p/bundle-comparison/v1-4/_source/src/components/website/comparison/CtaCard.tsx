import type { ReactNode } from "react";
import { ChevronRightIcon } from "@/components/icons";

type Props = {
  /** Fills the icon slot (24px): give it no size of its own. */
  icon: ReactNode;
  title: string;
  body: string;
  action: string;
  /** Visibility and sizing from the parent (for example hidden on a phone). */
  className?: string;
};

/** A card that points away from the bundle list: icon, a title and one line, then an action. The action is a bare chevron, on every screen size. */
export function CtaCard({ icon, title, body, action, className = "" }: Props) {
  return (
    <section
      className={`relative flex items-center gap-3 rounded-2xl border border-light-grey bg-white p-4 text-left ${className}`}
      aria-label={title}
    >
      <div className="size-6 shrink-0 [&>*]:size-full">{icon}</div>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <h3 className="font-sans text-base font-medium leading-[22px] tracking-[-0.32px] text-near-black">{title}</h3>
        <p className="font-sans text-sm leading-[18px] tracking-[-0.28px] text-light-text">{body}</p>
      </div>
      {/* The whole card is the click target */}
      <button type="button" aria-label={action} className="shrink-0 cursor-pointer after:absolute after:inset-0">
        <ChevronRightIcon size={8} />
      </button>
    </section>
  );
}
