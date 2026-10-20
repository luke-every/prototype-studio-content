"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";

type IconName =
  | "home" | "menu" | "swap" | "check" | "close" | "spark" | "search" | "truck" | "calendar"
  | "leaf" | "clock" | "heart" | "heartOff" | "chevron" | "chevronDown" | "sun" | "share"
  | "person" | "thumbUp" | "thumbDown" | "send" | "pause" | "info" | "plus" | "fridge" | "chart" | "arrowLeft";

const PATHS: Record<IconName, React.ReactNode> = {
  home: <><path d="M3 11.5 12 4l9 7.5" /><path d="M5.5 10v9a1 1 0 0 0 1 1H10v-6h4v6h3.5a1 1 0 0 0 1-1v-9" /></>,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  swap: <><path d="M7 4 3 8l4 4" /><path d="M3 8h14" /><path d="m17 20 4-4-4-4" /><path d="M21 16H7" /></>,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  spark: <><path d="M12 3v4M12 17v4M3 12h4M17 12h4" /><path d="m12 8 1.6 2.4L16 12l-2.4 1.6L12 16l-1.6-2.4L8 12l2.4-1.6Z" /></>,
  search: <><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" /></>,
  truck: <><path d="M3 6h11v10H3z" /><path d="M14 9h4l3 3v4h-7" /><circle cx="7" cy="17.5" r="1.6" /><circle cx="17" cy="17.5" r="1.6" /></>,
  calendar: <><rect x="3.5" y="5" width="17" height="15" rx="2" /><path d="M3.5 10h17M8 3v4M16 3v4" /></>,
  leaf: <><path d="M5 19c0-8 5-13 15-14-1 10-6 15-14 15" /><path d="M5 19 13 11" /></>,
  clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>,
  heart: <path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10C19.5 15.4 12 20 12 20Z" />,
  heartOff: <><path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10C19.5 15.4 12 20 12 20Z" /><path d="M4 4l16 16" /></>,
  chevron: <path d="m9 5 7 7-7 7" />,
  chevronDown: <path d="m5 9 7 7 7-7" />,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" /></>,
  share: <><path d="M12 15V3.5" /><path d="m7.5 8 4.5-4.5L16.5 8" /><path d="M5 12v7.5h14V12" /></>,
  person: <><circle cx="12" cy="8" r="3.6" /><path d="M4.5 20c.8-4 3.8-6 7.5-6s6.7 2 7.5 6" /></>,
  thumbUp: <><path d="M7 11v9H4v-9z" /><path d="M7 11l4-7c1.4 0 2.3 1 2 2.4L12.4 10H18a2 2 0 0 1 2 2.3l-1 6A2 2 0 0 1 17 20H7" /></>,
  thumbDown: <><path d="M7 13V4H4v9z" /><path d="M7 13l4 7c1.4 0 2.3-1 2-2.4L12.4 14H18a2 2 0 0 0 2-2.3l-1-6A2 2 0 0 0 17 4H7" /></>,
  send: <><path d="M4 12 20 4l-6 16-2.5-6.5z" /></>,
  pause: <><path d="M9 5v14M15 5v14" /></>,
  info: <><circle cx="12" cy="12" r="8.5" /><path d="M12 11v5.5M12 7.8v.4" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  fridge: <><rect x="6" y="3" width="12" height="18" rx="2" /><path d="M6 10h12M9 6.5v1.5M9 13v2" /></>,
  chart: <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></>,
  arrowLeft: <path d="M19 12H5m6-6-6 6 6 6" />,
};

export function Icon({ name, className = "size-5", strokeWidth = 1.7 }: { name: IconName; className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {PATHS[name]}
    </svg>
  );
}

type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "dark" | "light" | "outline" | "ghost" | "gray"; size?: "sm" | "md" };

export function Button({ variant = "dark", size = "md", className = "", ...rest }: BtnProps) {
  const v = {
    dark: "bg-ink text-paper hover:shadow-e2",
    light: "bg-white text-ink hover:shadow-e2",
    gray: "bg-offwhite text-ink hover:bg-cream/60",
    outline: "border border-line2 text-ink bg-transparent hover:bg-offwhite",
    ghost: "text-ink hover:bg-offwhite",
  }[variant];
  const sz = size === "sm" ? "px-3.5 py-2 text-[13px]" : "px-5 py-3 text-[14px]";
  return (
    <button
      {...rest}
      className={`inline-flex items-center justify-center gap-1.5 rounded-full font-medium transition active:scale-[.97] disabled:opacity-40 disabled:pointer-events-none ${v} ${sz} ${className}`}
    />
  );
}

export function Chip({ active, className = "", ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      {...rest}
      aria-pressed={active}
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-2 text-[13px] font-medium transition ${
        active ? "border-ink bg-ink text-paper" : "border-line2 bg-white text-ink hover:border-ink/40"
      } ${className}`}
    />
  );
}

export function Card({ className = "", ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...rest} className={`rounded-[20px] border border-line bg-white ${className}`} />;
}

/** Bottom sheet on mobile, centred dialog on desktop. Depth lives here so the home stays calm. */
export function Sheet({ title, eyebrow, children, onClose, wide }: { title?: string; eyebrow?: string; children: React.ReactNode; onClose: () => void; wide?: boolean }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-label={title}>
      <button aria-label="Close" className="absolute inset-0 bg-ink/40 animate-fade-in" onClick={onClose} />
      <div className={`relative max-h-[92dvh] w-full overflow-y-auto rounded-t-[28px] bg-paper shadow-e3 animate-sheet-up sm:rounded-[28px] ${wide ? "sm:max-w-[640px]" : "sm:max-w-[480px]"}`}>
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 bg-paper/95 px-5 pb-3 pt-4 backdrop-blur sm:px-6">
          <div className="mx-auto absolute left-1/2 top-2 h-1 w-10 -translate-x-1/2 rounded-full bg-linen sm:hidden" />
          <div className="pt-2">
            {eyebrow && <div className="eyebrow mb-1">{eyebrow}</div>}
            {title && <h2 className="font-serif text-[24px] leading-tight text-ink">{title}</h2>}
          </div>
          <button onClick={onClose} aria-label="Close" className="mt-1 grid size-9 shrink-0 place-items-center rounded-full bg-offwhite text-ink hover:bg-cream">
            <Icon name="close" className="size-4" />
          </button>
        </div>
        <div className="px-5 pb-6 sm:px-6">{children}</div>
      </div>
    </div>
  );
}

export function Toasts() {
  const { s } = useStore();
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[70] flex flex-col items-center gap-2 px-4" aria-live="polite">
      {s.toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto flex w-full max-w-[440px] items-center justify-between gap-4 rounded-2xl bg-ink px-4 py-3.5 text-[14px] text-paper shadow-e3 animate-sheet-up">
          <span>{t.text}</span>
          {t.undo && (
            <button onClick={t.undo} className="shrink-0 font-medium text-signal">Undo</button>
          )}
        </div>
      ))}
    </div>
  );
}

export function Pill({ children, tone = "olive" }: { children: React.ReactNode; tone?: "olive" | "terra" | "sky" | "plum" | "stone" }) {
  const t = {
    olive: "bg-olive-bg text-[#5d5e2f]",
    terra: "bg-terra-bg text-[#8a4428]",
    sky: "bg-sky-bg text-[#3f5e77]",
    plum: "bg-plum-bg text-[#6b3f55]",
    stone: "bg-offwhite text-stone",
  }[tone];
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11.5px] font-medium ${t}`}>{children}</span>;
}
