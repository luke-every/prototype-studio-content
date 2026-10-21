"use client";

import { HTMLAttributes, InputHTMLAttributes, useCallback, useEffect, useRef, useState } from "react";
import { SearchIcon } from "@/components/icons/SearchIcon";
import { useTranslations } from "@/providers/TranslationsProvider";

type SearchSize = "sm" | "md" | "lg";

type SearchInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "size"> & {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  debounceMs?: number;
  size?: SearchSize;
  containerProps?: HTMLAttributes<HTMLDivElement>;
  labelProps?: HTMLAttributes<HTMLSpanElement>;
};

const SIZE = {
  sm: { icon: 14, text: "text-xs", padding: "px-3 py-1.5", closedW: "lg:w-24 w-full" },
  md: { icon: 18, text: "text-sm", padding: "px-4 py-2.5",   closedW: "lg:w-28 w-full" },
  lg: { icon: 20, text: "text-base", padding: "px-5 py-3", closedW: "lg:w-36 w-full" },
};

export function SearchInput({
  value: controlledValue,
  defaultValue = "",
  onChange,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  debounceMs,
  size = "md",
  placeholder,
  containerProps,
  labelProps,
  ...inputProps
}: SearchInputProps) {
  const t = useTranslations();
  const resolvedPlaceholder = placeholder ?? t.shared.search.placeholder;
  const isControlledOpen = controlledOpen !== undefined;
  const isControlledValue = controlledValue !== undefined;

  const [internalOpen, setInternalOpen] = useState<boolean>(defaultOpen);
  const [internalValue, setInternalValue] = useState<string>(defaultValue);

  const open = isControlledOpen ? controlledOpen : internalOpen;
  const value = isControlledValue ? controlledValue : internalValue;

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const s = SIZE[size];

  const setOpenState = useCallback((next: boolean) => {
    if (!isControlledOpen) setInternalOpen(next);
    onOpenChange?.(next);
  }, [isControlledOpen, onOpenChange]);

  const setValueState = useCallback((next: string) => {
    if (!isControlledValue) setInternalValue(next);
    if (debounceMs) {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => onChange?.(next), debounceMs);
    } else {
      onChange?.(next);
    }
  }, [isControlledValue, debounceMs, onChange]);

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpenState(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [setOpenState, setValueState]);

  function expand() {
    setOpenState(true);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  return (
    <div
      ref={containerRef}
      onClick={!open ? expand : undefined}
      {...containerProps}
      className={`flex items-center gap-x-1 bg-light-grey ${s.padding} rounded-xl overflow-hidden transition-all duration-300
      ${open ? "w-full md:w-72 cursor-default !px-2" : `${s.closedW} cursor-pointer justify-center`} ${containerProps?.className ?? ""}`}
    >
      <SearchIcon size={s.icon} className="text-light-text shrink-0" />

      <input
        ref={inputRef}
        type="text"
        value={value}
        placeholder={resolvedPlaceholder}
        aria-label={resolvedPlaceholder}
        onKeyDown={(e) => {
          if (e.key !== "Escape") return;
          setValueState("");
          setOpenState(false);
        }}
        onChange={(e) => setValueState(e.target.value)}
        {...inputProps}
        className={`bg-transparent ${s.text} text-dark placeholder:text-light-grey-3 outline-none
        transition-all duration-300
        ${open ? "opacity-100 max-w-full" : "opacity-0 max-w-0 placeholder:text-transparent"}`}
      />

      <span
        {...labelProps}
        className={`${s.text} text-dark font-regular whitespace-nowrap ${
          open ? "" : "delay-100"
        } ${open ? "opacity-0" : "opacity-100"} ${labelProps?.className ?? ""}`}
      >
        {resolvedPlaceholder}
      </span>
    </div>
  );
}
