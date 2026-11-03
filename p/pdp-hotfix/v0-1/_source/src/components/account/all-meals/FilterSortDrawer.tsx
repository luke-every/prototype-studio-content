"use client";

import { useEffect, useMemo } from "react";
import { CloseIcon } from "@/components/icons/CloseIcon";
import { FilterIcon } from "@/components/icons/FilterIcon";
import { Button } from "@/components/shared/Button";
import { useTranslations } from "@/providers/TranslationsProvider";
import { interpolate } from "@/lib/translations";
import { type FilterOption, type FilterSection } from "@/app/[locale]/(account)/account/all-meals/types";

export type { FilterOption, FilterSection };

type FilterSortDrawerProps = {
  open: boolean;
  sections: readonly FilterSection[];
  draftSelected: Set<string>;
  productCount: number;
  onToggle: (optionId: string) => void;
  onClose: () => void;
  onApply: () => void;
  onReset: () => void;
};

export function FilterSortDrawer({ open, sections, draftSelected, productCount, onToggle, onClose, onApply, onReset }: FilterSortDrawerProps) {
  const t = useTranslations();
  const selectedSpiciness = useMemo(
    () => new Set([...draftSelected].filter((id) => id.startsWith("spiciness:"))),
    [draftSelected],
  );
  const hasSelectedSpiciness = selectedSpiciness.size > 0;

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t.allMeals.filterSortDrawer.ariaLabel}
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-white flex flex-col transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-light-grey">
          <div className="flex items-center gap-3">
            <FilterIcon size={18} className="text-dark" />
            <span className=" font-regular text-dark">{t.allMeals.filterSortDrawer.header}</span>
          </div>
          <button type="button" onClick={onClose} aria-label={t.allMeals.filterSortDrawer.closeAriaLabel} className="p-1 text-dark cursor-pointer">
            <CloseIcon size={22} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-scroll overscroll-contain px-5 py-4 flex flex-col gap-6">
          {sections.map((section) => (
            <div key={section.id}>
              <p className="font-regular text-dark mb-3">{section.label}</p>
              <div className="flex flex-wrap gap-2">
                {section.options.map((opt) => {
                  const isActive = draftSelected.has(opt.id);
                  const isSpiciness = section.id === "spiciness-filter";
                  const disabled = isSpiciness && hasSelectedSpiciness && !isActive;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => onToggle(opt.id)}
                      disabled={disabled}
                      className={`px-4 py-1 rounded-full text-base font-regular transition-colors duration-150 border ${
                        isActive
                          ? "bg-dark text-white border-dark"
                          : "bg-white text-dark border-light-grey"
                      } ${disabled ? "bg-light-grey text-light-grey-3 border-light-grey cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
              {section.footnote && (
                <p className="mt-3 text-xs text-light-text">
                  {section.footnote}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-light-grey">
          <div className="flex items-center flex-col gap-3 px-5 py-4 mx-auto w-fit">
          <span className="text-sm text-dark">{interpolate(t.allMeals.filterSortDrawer.showProducts, { productCount })}</span>
          <Button onClick={onApply} className="bg-signal-orange border-none font-regular rounded-full px-6 py-2 text-dark w-full">
            {t.allMeals.filterSortDrawer.apply}
          </Button>
          <Button
            onClick={onReset}
            variant="grey"
            disabled={draftSelected.size === 0}
            className="font-regular rounded-full px-6 py-2 w-full"
          >
            {t.allMeals.filterSortDrawer.reset}
          </Button>
          </div>
        </div>
      </div>
    </>
  );
}
