"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Variant A page structure: one frame for every section (eyebrow, serif title, at most one action),
 * one content surface, the same spacing everywhere. Pages sit on paper; interactive groups on white;
 * the goal colour is reserved for the goal section. No cards inside cards.
 */
export function PageSection({ id, eyebrow, title, action, children, className = "" }: {
  id?: string; eyebrow?: string; title?: React.ReactNode; action?: React.ReactNode; children: React.ReactNode; className?: string;
}) {
  return (
    <section id={id} aria-labelledby={id && title ? `${id}-title` : undefined} className={`scroll-mt-32 border-t border-line pt-8 first:border-t-0 first:pt-0 [[data-band]+&]:border-t-0 [[data-band]+&]:pt-0 ${className}`}>
      {(eyebrow || title || action) && (
        <div className="mb-4 flex items-end justify-between gap-4">
          <div className="min-w-0">
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            {title && <h2 id={id ? `${id}-title` : undefined} className="mt-1 font-serif text-[26px] leading-tight text-ink sm:text-[30px]">{title}</h2>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

/**
 * Screen-wide band, like the sections on the LPs and PDPs: edge to edge with a 32 px radius,
 * content on the 1120 px grid. Used for the goal and the delivery so they read as sections, not floating cards.
 */
export function Band({ id, tone, children, label }: { id?: string; tone: string; children: React.ReactNode; label?: string }) {
  return (
    <section id={id} data-band aria-label={label} className={`relative scroll-mt-32 ml-[calc(50%-50vw)] mr-[calc(50%-50vw)] rounded-[32px] ${tone}`}>
      <div className="mx-auto max-w-[1120px] px-4 py-9 sm:px-6 sm:py-12">{children}</div>
    </section>
  );
}

/** The single content surface of a section. `tone` = a goal colour class for the goal section. */
export function Surface({ children, tone = "bg-white", className = "" }: { children: React.ReactNode; tone?: string; className?: string }) {
  return <div className={`rounded-[24px] ${tone} p-4 sm:p-6 ${className}`}>{children}</div>;
}

/** A quiet text action for section headers. */
export function SectionLink({ children, onClick, href }: { children: React.ReactNode; onClick?: () => void; href?: string }) {
  const cls = "inline-flex items-center gap-1 text-[13.5px] font-medium text-ink underline decoration-line2 underline-offset-4 hover:decoration-ink";
  return href ? <Link href={href} onClick={onClick} className={cls}>{children}</Link> : <button onClick={onClick} className={cls}>{children}</button>;
}

/** Sticky chips under the header that track the section in view and jump on tap. */
export function SectionNav({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);
  const key = items.map((x) => x.id).join(",");
  useEffect(() => {
    const els = key.split(",").map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const onScroll = () => {
      const y = window.scrollY + 150;
      let cur = els[0]?.id;
      for (const el of els) if (el.getBoundingClientRect().top + window.scrollY <= y) cur = el.id;
      setActive(cur);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [key]);
  // Keep the active item visible when the row scrolls sideways on small screens
  useEffect(() => {
    const el = document.querySelector<HTMLElement>(`nav[aria-label="On this page"] a[href="#${active}"]`);
    const row = el?.parentElement;
    if (el && row) row.scrollTo({ left: el.offsetLeft - 16, behavior: "smooth" });
  }, [active]);
  return (
    <nav aria-label="On this page" className="sticky top-16 z-30 -mx-4 border-b border-line bg-paper/95 px-4 backdrop-blur sm:-mx-6 sm:px-6">
      {/* Text buttons, one step below the main tabs: active = ink with an underline, others = stone */}
      <div className="no-scrollbar flex gap-6 overflow-x-auto">
        {items.map((x) => (
          <a key={x.id} href={`#${x.id}`} aria-current={active === x.id ? "true" : undefined}
            onClick={(e) => { e.preventDefault(); document.getElementById(x.id)?.scrollIntoView({ behavior: "smooth" }); }}
            className={`-mb-px whitespace-nowrap border-b-2 py-3 text-[13.5px] transition ${active === x.id ? "border-ink font-medium text-ink" : "border-transparent text-stone hover:text-ink"}`}>
            {x.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
