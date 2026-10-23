"use client";

import { memo, useCallback } from "react";

type Tab = {
  id: string;
  label: string;
  count: number;
};

type Props = {
  tab: Tab;
  isActive: boolean;
  onSelect: (id: string) => void;
  registerRef: (id: string, el: HTMLButtonElement | null) => void;
};

export const TabButton = memo(function TabButton({ tab, isActive, onSelect, registerRef }: Props) {
  const handleClick = useCallback(() => onSelect(tab.id), [onSelect, tab.id]);
  const handleRef = useCallback((el: HTMLButtonElement | null) => registerRef(tab.id, el), [registerRef, tab.id]);

  return (
    <button
      ref={handleRef}
      role="tab"
      type="button"
      aria-selected={isActive}
      onClick={handleClick}
      className={`whitespace-nowrap transition-colors duration-200 cursor-pointer ${
        isActive ? "text-dark" : "text-light-grey-3 hover:text-dark"
      }`}
    >
      <span className="inline-flex items-center gap-2">
        <span>{tab.label}</span>
        <span className="lg:hidden inline-flex items-center justify-center min-w-6 h-6 px-2 rounded-full bg-light-grey text-dark text-xs">
          {tab.count}
        </span>
      </span>
    </button>
  );
});
