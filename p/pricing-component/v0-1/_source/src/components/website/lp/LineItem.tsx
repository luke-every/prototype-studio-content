import Image from "next/image";
import { ChevronDownFilledIcon } from "@/components/icons";

type Props = {
  label: string;
  /** 40px thumbnail before the label (free gifts) */
  image?: string;
  value: string;
  /** Struck-through list price shown before the value (shipping) */
  strikeValue?: string;
  /** Pill next to the label, e.g. "You save 56,37€" */
  badge?: string;
  /** Shows the 16px chevron; true when the item's details are open */
  accordion?: boolean;
  open?: boolean;
  /** "title" is the bundle row, "total" the big total row, "muted" a detail row under an accordion */
  variant?: "default" | "title" | "total" | "muted";
  valueTone?: "default" | "green";
};

/** New, no production counterpart: Figma "LineItem" (Bundle Component). One label/value row of the LP price breakdown. */
export function LineItem({ label, image, value, strikeValue, badge, accordion = false, open = false, variant = "default", valueTone = "default" }: Props) {
  const isTotal = variant === "total";
  const labelStyle = isTotal
    ? "text-base font-medium leading-[22px] tracking-[-0.32px] text-dark"
    : `text-sm leading-[19px] tracking-[-0.28px] ${variant === "title" ? "font-medium text-dark" : variant === "muted" ? "text-light-text" : "text-dark"}`;
  const valueStyle = isTotal
    ? "text-xl font-bold leading-[22px] tracking-[-0.4px] text-dark"
    : `text-sm leading-[19px] tracking-[-0.28px] ${valueTone === "green" ? "font-medium text-savings-green" : variant === "muted" ? "text-light-text" : "text-near-black"}`;

  return (
    <div className="flex w-full items-center gap-3 font-sans">
      <div className={`flex min-w-px flex-1 items-center ${image ? "gap-3" : "gap-2"}`}>
        {image && <Image src={image} alt="" width={40} height={40} className="size-10 shrink-0 rounded-lg object-cover" />}
        <div className="flex items-center gap-1">
          <span className={labelStyle}>{label}</span>
          {badge && <span className="rounded bg-savings-green px-1.5 py-0.5 text-xs font-medium leading-4 tracking-[-0.24px] text-white">{badge}</span>}
        </div>
        {accordion && <ChevronDownFilledIcon size={10}className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />}
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        {strikeValue && <span className="text-sm leading-[19px] tracking-[-0.28px] text-light-text line-through">{strikeValue}</span>}
        <span className={valueStyle}>{value}</span>
      </div>
    </div>
  );
}
