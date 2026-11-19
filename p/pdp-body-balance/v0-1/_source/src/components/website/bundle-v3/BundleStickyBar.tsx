"use client";

import { useEffect, useState } from "react";

type Props = {
  label: string;
  footnote: string;
  backgroundColor: string;
  onAddToCart?: () => void;
  /** The PDP's rail carries the CTA on desktop; full-width pages keep the bar. */
  hideOnDesktop?: boolean;
};

/**
 * The sticky add-to-cart bar from every-website `src/components/website/bundle-v3/BundleContent.tsx`
 * (it is inline there), lifted out so the PDP and the LP share one copy. It slides up once the hero's
 * own CTA (`[data-hero-cta]`) has scrolled out of view.
 * TODO(lift): extract from BundleContent the same way.
 */
export function BundleStickyBar({ label, footnote, backgroundColor, onAddToCart, hideOnDesktop = true }: Props) {
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    const target = document.querySelector("[data-hero-cta]");
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0), { threshold: 0 });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      aria-hidden={!visible}
      className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${hideOnDesktop ? "lg:hidden" : ""} ${visible ? "translate-y-0 shadow-[0_-2px_12px_rgba(55,45,39,0.12)]" : "translate-y-full shadow-none"}`}
      style={{ backgroundColor }}
    >
      <div className="mx-auto flex max-w-[430px] flex-col gap-1.5 px-4 py-3.5">
        <button
          type="button"
          onClick={onAddToCart}
          aria-label={label}
          tabIndex={visible ? 0 : -1}
          className="w-full cursor-pointer rounded-full bg-dark py-3.5 text-center font-sans text-[15px] font-medium text-white"
        >
          {label}
        </button>
        <p className="text-center font-sans text-xs text-dark/70">{footnote}</p>
      </div>
    </div>
  );
}
