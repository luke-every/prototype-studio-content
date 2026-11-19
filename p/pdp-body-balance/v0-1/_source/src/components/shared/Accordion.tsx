"use client";

import { useState } from "react";
import { PlusIcon } from "@/components/icons";

type Props = {
  title: string;
  children: React.ReactNode;
  variant?: "default" | "compact";
  contentClassName?: string;
};

export function Accordion({ title, children, variant = "default", contentClassName }: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const isCompact = variant === "compact";

  return (
    <div className={`border-b ${isCompact ? "border-gray-100" : "border-light-grey-2"}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`w-full flex items-center justify-between text-left cursor-pointer ${isCompact ? "py-4" : "pl-1 py-8"}`}
      >
        <span className={isCompact ? "font-medium text-dark" : "font-sans text-base text-near-black leading-[22px] tracking-[-0.32px]"}>
          {title}
        </span>
        <PlusIcon
          size={24}
          strokeWidth={1.5}
          className={`shrink-0 transition-transform ${open ? "rotate-45" : ""} ${isCompact ? "text-dark" : "text-near-black"}`}
        />
      </button>
      {open && <div className={contentClassName}>{children}</div>}
    </div>
  );
}
