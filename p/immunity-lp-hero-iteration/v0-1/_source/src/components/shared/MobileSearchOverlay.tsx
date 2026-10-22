"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { SearchIcon } from "@/components/icons/SearchIcon";
import { useTranslations } from "@/providers/TranslationsProvider";

type MobileSearchOverlayProps = {
  placeholder?: string;
  onChange?: (value: string) => void;
  children?: React.ReactNode;
};

export function MobileSearchOverlay({ placeholder, onChange, children }: MobileSearchOverlayProps) {
  const t = useTranslations();
  const resolvedPlaceholder = placeholder ?? t.shared.search.placeholder;
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!open) return;
    const raf = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(raf);
  }, [open]);

  const close = useCallback(() => {
    setOpen(false);
    setValue("");
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = null;
    }
    onChange?.("");
  }, [onChange]);

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  return (
    <>
      {/* Trigger button — mirrors closed SearchInput */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center justify-center gap-2 w-full bg-light-grey rounded-xl px-4 py-2"
        aria-label={t.shared.mobileSearch.openAriaLabel}
      >
        <SearchIcon size={18} className="text-dark shrink-0" />
        <span className="text-base text-dark">{resolvedPlaceholder}</span>
      </button>

      {/* Full-screen overlay — rendered in <body> via portal to escape any ancestor stacking context */}
      {open && createPortal(
        <div className="fixed inset-0 z-50 bg-white flex flex-col px-4 pt-6">
          {/* Search input row */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 flex-1 bg-light-grey rounded-xl px-4 py-3">
              <SearchIcon size={16} className="text-light-text shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={value}
                placeholder={resolvedPlaceholder}
                onChange={(e) => {
                const next = e.target.value;
                setValue(next);
                if (debounceTimer.current) clearTimeout(debounceTimer.current);
                debounceTimer.current = setTimeout(() => onChange?.(next), 150);
              }}
                className="flex-1 bg-transparent text-[16px] text-dark placeholder:text-light-grey-3 outline-none"
              />
            </div>
            <button
              type="button"
              onClick={close}
              className="text-sm text-dark whitespace-nowrap"
            >
              {t.shared.mobileSearch.cancel}
            </button>
          </div>

          {children && (
            <div className="mt-4 flex-1 overflow-y-auto">
              {children}
            </div>
          )}
        </div>,
        document.body
      )}
    </>
  );
}
