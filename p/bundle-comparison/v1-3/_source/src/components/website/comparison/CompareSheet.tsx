"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { CloseFilledIcon, CloseIcon } from "@/components/icons";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { useShortViewport } from "@/hooks/useShortViewport";
import { copy } from "./copy";

type Props = { open: boolean; onClose: () => void; /** How many grid rows each card spans, so they line up on desktop. */ rowCount: number; /** One <article> card per bundle. */ children: ReactNode };

// Matches the exit transition of .drawer-panel-exit in globals.css
const EXIT_MS = 300;

/** Bottom sheet on a phone (full screen on a short one), centred panel from lg. The cards page sideways: one at a time on a phone, all four on desktop. */
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
  const short = useShortViewport();

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
        className={`flex w-full flex-col bg-white ${short ? "h-full" : "h-[92%] rounded-t-[32px]"} lg:h-auto lg:max-h-[92dvh] lg:max-w-[1200px] lg:rounded-[32px] lg:p-0 ${closing ? "drawer-panel-exit" : "drawer-panel-enter"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Phone: an 80px bar with a hairline under it, a 24px title and a 32px close button. From lg: the roomier heading without the hairline. */}
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-light-grey px-6 lg:h-auto lg:border-0 lg:px-8 lg:pb-2 lg:pt-8">
          <h2 className="font-book text-2xl leading-[26px] tracking-[-0.48px] text-dark lg:text-[28px] lg:leading-8 lg:tracking-[-0.56px]">{copy("compareSheet.heading")}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="flex size-8 cursor-pointer items-center justify-center rounded-2xl bg-light-grey text-dark lg:size-11 lg:rounded-full lg:bg-off-white">
            <CloseFilledIcon size={10} fill="#372D27" className="lg:hidden" />
            <CloseIcon className="hidden lg:block" />
          </button>
        </div>
        {/* On a phone this area fills the height left under the heading, down to the bottom of the screen, and runs edge to edge, with 32px of space after the cards so they scroll fully into view (the 16px inset is padding inside it, so cards scroll right to the screen edges): the cards page sideways and all scroll up and down together (each card is as tall as the tallest, and no taller: the rows hug the content instead of stretching to fill the screen). */}
        <div
          className="grid min-h-0 flex-1 content-start snap-x snap-mandatory auto-cols-[84%] grid-flow-col gap-x-3 overflow-auto scroll-pl-4 px-4 pb-8 pt-2 [scrollbar-width:none] lg:auto-cols-auto lg:grid-flow-row lg:grid-cols-4 lg:[grid-template-rows:repeat(var(--rows),auto)] lg:gap-x-4 lg:overflow-x-visible lg:px-8 lg:pb-8 [&>article]:snap-start [&::-webkit-scrollbar]:hidden"
          style={{ "--rows": rowCount } as CSSProperties}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
