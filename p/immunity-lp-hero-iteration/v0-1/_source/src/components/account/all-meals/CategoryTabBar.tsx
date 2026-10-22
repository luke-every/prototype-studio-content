"use client";

import { memo, useCallback, useEffect, useRef } from "react";
import { FilterIcon } from "@/components/icons/FilterIcon";
import { Button } from "@/components/shared/Button";
import { SearchInput } from "@/components/shared/SearchInput";
import { MobileSearchOverlay } from "@/components/shared/MobileSearchOverlay";
import { useTranslations } from "@/providers/TranslationsProvider";
import { TabButton } from "@/components/account/all-meals/TabButton";

type Tab = {
  id: string;
  label: string;
  count: number;
};

type CategoryTabBarProps = {
  tabs: Tab[];
  activeId: string;
  onSelect: (id: string) => void;
  onFilterOpen: () => void;
  selectedFilterCount?: number;
  hideTabs?: boolean;
  onSearchChange?: (value: string) => void;
  mobileSearchOverlayContent?: React.ReactNode;
};

export const CategoryTabBar = memo(function CategoryTabBar({
  tabs,
  activeId,
  onSelect,
  onFilterOpen,
  selectedFilterCount = 0,
  hideTabs = false,
  onSearchChange,
  mobileSearchOverlayContent,
}: CategoryTabBarProps) {
  const t = useTranslations();
  const listRef = useRef<HTMLDivElement | null>(null);
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const registerRef = useCallback((id: string, el: HTMLButtonElement | null) => {
    if (el) buttonRefs.current.set(id, el);
    else buttonRefs.current.delete(id);
  }, []);

  useEffect(() => {
    const list = listRef.current;
    const btn = buttonRefs.current.get(activeId);
    if (!list || !btn) return;
    const listRect = list.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    const btnLeftRelative = btnRect.left - listRect.left + list.scrollLeft;
    const btnRightRelative = btnLeftRelative + btnRect.width;
    if (btnRect.left < listRect.left) {
      list.scrollTo({ left: btnLeftRelative - 16, behavior: "smooth" });
    } else if (btnRect.right > listRect.right) {
      list.scrollTo({ left: btnRightRelative - list.clientWidth + 16, behavior: "smooth" });
    }
  }, [activeId]);

  return (
    <div className="flex flex-col-reverse gap-2 md:flex-row md:gap-4 md:items-center md:justify-between px-2 md:mt-5">
      {/* Scrollable tabs */}
      {!hideTabs ? (
        <div ref={listRef} role="tablist" className="flex items-center gap-6 overflow-x-scroll py-2 md:py-4 scrollbar-hide flex-1 min-w-0">
          {tabs.map((tab) => (
            <TabButton
              key={tab.id}
              tab={tab}
              isActive={activeId === tab.id}
              onSelect={onSelect}
              registerRef={registerRef}
            />
          ))}
        </div>
      ) : (
        <div className="flex-1" />
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 py-1 md:py-2 shrink-0">
        <div className="relative w-full md:w-fit">
          <Button
            className="rounded-xl w-full md:w-fit whitespace-nowrap flex justify-center"
            variant="grey"
            icon={<FilterIcon />}
            iconPosition="left"
            onClick={onFilterOpen}
          >
            {t.allMeals.filter}
          </Button>
          {selectedFilterCount > 0 && (
            <span className="pointer-events-none absolute -top-2 -right-2 inline-flex items-center justify-center min-w-6 h-6 px-2 rounded-full bg-dark text-white text-xs border-2 border-white">
              {selectedFilterCount}
            </span>
          )}
        </div>
        {/* Mobile: full-screen overlay trigger */}
        <div className="lg:hidden w-full">
          <MobileSearchOverlay onChange={onSearchChange}>
            {mobileSearchOverlayContent}
          </MobileSearchOverlay>
        </div>
        {/* Desktop: inline collapsible input */}
        <div className="hidden lg:block ">
          <SearchInput onChange={onSearchChange} debounceMs={150} />
        </div>
      </div>
    </div>
  );
});
