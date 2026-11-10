"use client";

import { useEffect, useState } from "react";
import { CloseIcon } from "@/components/icons";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { BUNDLES } from "./bundles";
import { FACTS } from "./BundleComparisonA.data";
import { BundleCardA, ROW_COUNT } from "./BundleCardA";

type Props = { open: boolean; onClose: () => void; /** Key of the bundle the customer is on; it is marked and has no Continue. */ currentKey: string };

// Matches the exit transition of .drawer-panel-exit in globals.css
const EXIT_MS = 300;

/** Bottom sheet on mobile, centred panel from lg. The comparison is A's cards, paged sideways like B: one card at a time on a phone, all four on desktop. */
export function CompareSheet({ open, onClose, currentKey }: Props) {
  // Stays mounted while it slides out
  const [mounted, setMounted] = useState<boolean>(open);
  const [closing, setClosing] = useState<boolean>(false);
  if (open && (!mounted || closing)) {
    setMounted(true);
    setClosing(false);
  }
  if (!open && mounted && !closing) setClosing(true);

  useEffect(() => {
    if (!closing) return;
    const id = setTimeout(() => setMounted(false), EXIT_MS);
    return () => clearTimeout(id);
  }, [closing]);

  useBodyScrollLock(mounted);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!mounted) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-end justify-center bg-black/50 lg:items-center lg:px-8 ${closing ? "opacity-0 transition-opacity duration-300" : "drawer-backdrop-enter"}`} onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Compare bundles"
        className={`flex h-[92dvh] w-full flex-col lg:h-auto lg:max-h-[92dvh] rounded-t-[32px] bg-white lg:max-w-[1200px] lg:rounded-[32px] ${closing ? "drawer-panel-exit" : "drawer-panel-enter"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 pb-2 pt-5 lg:px-8 lg:pt-8">
          {/* TODO(lift): replace with translation key */}
          <h2 className="font-book text-[28px] leading-8 tracking-[-0.56px] text-dark">Compare bundles</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="flex size-11 cursor-pointer items-center justify-center rounded-full bg-off-white text-dark">
            <CloseIcon />
          </button>
        </div>
        {/* On a phone each card is as tall as the sheet, with the action at the bottom; the scroller is only a fallback for very short screens */}
        <div
          className="flex min-h-0 flex-1 snap-x snap-mandatory gap-x-3 overflow-auto scroll-pl-4 px-4 pb-6 pt-2 [scrollbar-width:none] lg:grid lg:grid-cols-4 lg:gap-x-8 lg:px-8 lg:pb-8 [&>article]:w-[78%] [&>article]:shrink-0 [&>article]:snap-start lg:[&>article]:w-auto [&::-webkit-scrollbar]:hidden"
          style={{ gridTemplateRows: `repeat(${ROW_COUNT}, auto)` }}
        >
          {FACTS.map((f) => {
            const b = BUNDLES.find((x) => x.key === f.key);
            return b ? <BundleCardA key={f.key} f={f} b={b} current={f.key === currentKey} inSheet /> : null;
          })}
        </div>
      </div>
    </div>
  );
}
