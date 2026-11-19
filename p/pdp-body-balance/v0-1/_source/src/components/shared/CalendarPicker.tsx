"use client";
import { useCallback, useMemo, useState } from "react";
import { type Locale, isLocale } from "@/lib/locale";
import { useTranslations } from "@/providers/TranslationsProvider";

type Props = {
  eligibleDates: Set<string>;
  selectedDate: string | null;
  onSelect: (date: string) => void;
  minDate: string;
  maxDate: string;
  locale?: string;
};

const LOCALE_MAP: Record<Locale, string> = {
  en: "en-GB",
  de: "de-DE",
  fr: "fr-FR",
  nl: "nl-NL",

};

function parseLocal(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function toISO(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatMonthYear(date: Date, dateLocale: string) {
  return date.toLocaleDateString(dateLocale, { month: "long", year: "numeric" });
}

function formatDayLabel(date: Date, dateLocale: string) {
  return date.toLocaleDateString(dateLocale, { day: "numeric", month: "long", year: "numeric" });
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getStartDayOffset(year: number, month: number) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

function monthKey(date: Date) {
  return date.getFullYear() * 12 + date.getMonth();
}

export function CalendarPicker({ eligibleDates, selectedDate, onSelect, minDate, maxDate, locale = "en" }: Props) {
  const t = useTranslations();
  const loc: Locale = isLocale(locale) ? locale : "en";
  const dateLocale = LOCALE_MAP[loc];

  const dayLabels = useMemo(() => {
    const base = new Date(2024, 0, 1); // Monday
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(base);
      d.setDate(d.getDate() + i);
      return d.toLocaleDateString(dateLocale, { weekday: "short" });
    });
  }, [dateLocale]);

  const minParsed = parseLocal(minDate);
  const maxParsed = parseLocal(maxDate);

  const [currentMonth, setCurrentMonth] = useState<Date>(() => {
    const initial = selectedDate ? parseLocal(selectedDate) : minParsed;
    return new Date(initial.getFullYear(), initial.getMonth(), 1);
  });

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const startOffset = getStartDayOffset(year, month);

  const canGoPrev = monthKey(currentMonth) > monthKey(minParsed);
  const canGoNext = monthKey(currentMonth) < monthKey(maxParsed);

  const goToPrev = useCallback(() => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }, []);

  const goToNext = useCallback(() => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }, []);

  const cells: (number | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="select-none">
      {/* Month header */}
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={goToPrev}
          disabled={!canGoPrev}
          aria-label={t.shared.calendarPicker.previousMonthAriaLabel}
          className="flex items-center justify-center w-8 h-8 rounded-full text-dark hover:bg-light-grey-2 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className="text-base font-medium text-dark">{formatMonthYear(currentMonth, dateLocale)}</span>
        <button
          type="button"
          onClick={goToNext}
          disabled={!canGoNext}
          aria-label={t.shared.calendarPicker.nextMonthAriaLabel}
          className="flex items-center justify-center w-8 h-8 rounded-full text-dark hover:bg-light-grey-2 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Day-of-week labels */}
      <div className="grid grid-cols-7 mb-1">
        {dayLabels.map((label) => (
          <div key={label} className="text-center text-xs font-medium text-light-text py-1">
            {label}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7">
        {cells.map((day, i) => {
          if (day === null) {
            return <div key={`empty-${i}`} />;
          }

          const iso = toISO(new Date(year, month, day));
          const isEligible = eligibleDates.has(iso);
          const isSelected = iso === selectedDate;
          const dateObj = new Date(year, month, day);

          return (
            <button
              key={iso}
              type="button"
              disabled={!isEligible}
              onClick={() => onSelect(iso)}
              aria-label={`Select ${formatDayLabel(dateObj, dateLocale)}`}
              className={`flex items-center justify-center w-10 h-10 mx-auto text-sm rounded-full transition-colors ${
                isSelected
                  ? "bg-dark text-white"
                  : isEligible
                    ? "text-dark hover:bg-light-grey-2/50 cursor-pointer"
                    : "text-dark/20 cursor-not-allowed"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
