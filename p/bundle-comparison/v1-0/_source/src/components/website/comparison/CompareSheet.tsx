"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { CloseIcon } from "@/components/icons";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

type Props = { open: boolean; onClose: () => void; /** How many grid rows each card spans, so they line up on desktop. */ rowCount: number; /** One <article> card per bundle. */ children: ReactNode };

// Matches the exit transition of .drawer-panel-exit in globals.css
const EXIT_MS = 300;

/** Bottom sheet on mobile, centred panel from lg. The cards page sideways: one at a time on a phone, all four on desktop. */
export function CompareSheet({ open, onClose, rowCount, children }: Props) {
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
        {/* On a phone the cards page sideways and scroll up and down together (each card is as tall as the tallest) */}
        <div
          className="grid min-h-0 flex-1 snap-x snap-mandatory auto-cols-[84%] grid-flow-col gap-x-3 overflow-auto scroll-pl-4 px-4 pb-6 pt-2 [scrollbar-width:none] lg:auto-cols-auto lg:grid-flow-row lg:grid-cols-4 lg:[grid-template-rows:repeat(var(--rows),auto)] lg:gap-x-4 lg:overflow-x-visible lg:px-8 lg:pb-8 [&>article]:snap-start [&::-webkit-scrollbar]:hidden"
          style={{ "--rows": rowCount } as CSSProperties}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
