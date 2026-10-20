"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDownIcon } from "@/components/icons";
import { usePublicTranslations } from "@/providers/PublicTranslationsProvider";
import type { BundleSwitchItem } from "./types";

type Props = {
  headline?: string;
  items: BundleSwitchItem[];
};

const ITEM = "flex items-center gap-3 font-sans text-base leading-5.5 tracking-[-0.32px] text-dark";

/** "Change Bundle" disclosure listing the other bundles. */
/** Port of every-website `src/components/website/bundle-v3/BundleSwitcher.tsx`: plain props. */
export function BundleSwitcher({ headline, items }: Props) {
  const t = usePublicTranslations();
  const [open, setOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (items.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      {headline && <p className="font-sans text-sm leading-4.75 tracking-[-0.28px] text-dark">{headline}</p>}

      <div ref={containerRef} className="relative w-full">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-label={t.bundle.changeBundle}
          className="flex h-12 w-full cursor-pointer items-center justify-between rounded-[28px] border border-[#D1D5DB] bg-white py-0 pl-6 pr-4 font-sans text-sm leading-4.5 tracking-[-0.28px] text-dark"
        >
          {t.bundle.changeBundle}
          <ChevronDownIcon size={16} className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        </button>

        {open && (
          <ul className="absolute left-0 right-0 top-full z-20 mt-2 flex flex-col gap-4 rounded-[20px] border border-dark/10 bg-white px-6 py-5 shadow-[0_8px_24px_rgba(55,45,39,0.12)]">
            {items.map((item) => (
              <li key={item.id}>
                {item.href ? (
                  <Link href={item.href} className={ITEM}>
                    <span className="size-3 shrink-0 rounded-full" style={{ backgroundColor: item.color }} aria-hidden="true" />
                    {item.label}
                  </Link>
                ) : (
                  <span className={`${ITEM} text-dark/50`}>
                    <span className="size-3 shrink-0 rounded-full" style={{ backgroundColor: item.color }} aria-hidden="true" />
                    {item.label}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
