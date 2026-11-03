"use client";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { CloseIcon } from "@/components/icons";

type ModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  contentClassName?: string;
  closeLabel?: string;
};

export function Modal({ open, title, onClose, children, contentClassName, closeLabel = "Close" }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Depends only on `open` so this doesn't re-run (and re-steal focus, which
  // scrolls the dialog back to the top) on every re-render while the modal is open.
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCloseRef.current();
        return;
      }

      if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
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
    dialogRef.current
      ?.querySelector<HTMLElement>("button, [href], input, select, textarea")
      ?.focus();
    return () => {
      prev?.focus();
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`flex flex-col w-full max-w-sm lg:max-w-md max-h-[90dvh] rounded-3xl bg-light-grey p-8 space-y-6 overflow-y-auto scrollbar-hide ${contentClassName ?? ""}`.trim()}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="flex w-fit ml-auto mb-0  items-center justify-center gap-1.5 h-9 min-h-9 px-3 rounded-md border border-dark/10 text-dark hover:bg-off-white transition-colors cursor-pointer"
          aria-label={closeLabel}
        >
          <span className="hidden lg:inline  text-sm font-medium">{closeLabel}</span>
          <CloseIcon />
        </button>

        <p className="text-2xl font-book text-dark text-center leading-snug pt-4 whitespace-pre-line">
          {title}
        </p>

        {children}
      </div>
    </div>,
    document.body
  );
}
