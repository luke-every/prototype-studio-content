"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

// TODO(lift): extract a shared Drawer — focus trap, Esc and portal are copied from Modal.
type Props = {
  open: boolean;
  title: string;
  onClose: () => void;
  /** Esc can mean something other than close, such as stepping back a page inside the sheet */
  onEscape?: () => void;
  children: React.ReactNode;
  /** "fit" grows with its content up to 90%; "tall" holds 85% for content that pages inside it */
  size?: "fit" | "tall";
  /** On a wide screen: a centred dialog instead of a sheet */
  centeredOnWide?: boolean;
};

const EXIT_MS = 520;

/** A bottom sheet over a dimmed page. It stays mounted until its exit has played. */
export function Drawer({ open, title, onClose, onEscape, children, size = "fit", centeredOnWide = false }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onEscape ?? onClose);
  useEffect(() => {
    onCloseRef.current = onEscape ?? onClose;
  }, [onClose, onEscape]);

  const [mounted, setMounted] = useState<boolean>(open);
  const [entered, setEntered] = useState<boolean>(false);
  if (open && !mounted) setMounted(true);

  /* enter on the frame after mounting, so the transition has a starting point; leave when closed */
  useEffect(() => {
    const frame = requestAnimationFrame(() => setEntered(open));
    return () => cancelAnimationFrame(frame);
  }, [open]);

  useEffect(() => {
    if (open || !mounted) return;
    const timer = window.setTimeout(() => setMounted(false), EXIT_MS);
    return () => window.clearTimeout(timer);
  }, [open, mounted]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCloseRef.current();
        return;
      }

      if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    dialogRef.current?.querySelector<HTMLElement>("button, [href], input, select, textarea")?.focus({ preventScroll: true });
    return () => {
      prev?.focus({ preventScroll: true });
    };
  }, [open]);

  if (!mounted) return null;

  const shown = open && entered;
  const sizing = size === "tall" ? "h-[85%]" : "max-h-[90%]";
  const wide = centeredOnWide
    ? "lg:inset-0 lg:m-auto lg:h-fit lg:w-[560px] lg:rounded-[28px] lg:[transition:translate_500ms_var(--ease-swing),opacity_300ms_var(--ease-ui)]"
    : "";
  const wideState = centeredOnWide ? (shown ? "lg:translate-y-0 lg:opacity-100" : "lg:translate-y-6 lg:opacity-0") : "";

  return createPortal(
    <div className="fixed inset-0 z-50">
      <div
        className={`absolute inset-0 bg-black/55 backdrop-blur-[2px] transition-opacity duration-[400ms] ease-ui ${
          shown ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`absolute inset-x-0 bottom-0 flex flex-col overflow-hidden rounded-t-[28px] bg-white shadow-[0_-8px_30px] shadow-near-black/18 transition-transform duration-500 ease-swing ${sizing} ${
          shown ? "translate-y-0" : "translate-y-full"
        } ${wide} ${wideState}`}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
