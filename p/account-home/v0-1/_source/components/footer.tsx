"use client";

import { useState } from "react";
import { asset } from "@/lib/data";
import { useStore } from "@/lib/store";

const COLS: [string, string[]][] = [
  ["Shop", ["Curated Bundles", "Build your box", "every Gift Cards"]],
  ["Help", ["Helpcenter", "Track your Parcel", "Report Delivery Issue", "Subscription Settings", "Subscription Cancellation Form"]],
  ["About every", ["Our Story", "every Magazine", "Ingredient Lexicon", "Exclusive Discounts", "every for offices"]],
  ["Community", ["Facebook Community", "Refer a Friend", "Reviews", "Careers", "Brand Ambassador", "Store Finder", "Newsletter"]],
];
const SOCIAL = ["instagram", "facebook-1", "youtube", "linkedin", "tiktok"];

/** Footer from the Figma My Plan frames: accordions on mobile, columns on desktop. */
export function Footer() {
  const { toast } = useStore();
  const [open, setOpen] = useState<string | null>(null);
  const soon = () => toast("Not part of this prototype");
  return (
    <footer className="mt-10 border-t border-line bg-white pb-28">
      <div className="mx-auto grid max-w-[1120px] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[220px_1fr_180px]">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset("/logo.svg")} alt="every" className="h-[24px] w-auto" />
          <p className="mt-2 text-[14px] text-ink">Don&apos;t be shy, come say hi!</p>
          <div className="mt-4 flex gap-4">
            {SOCIAL.map((s) => (
              <button key={s} onClick={soon} aria-label={s.replace("-1", "")} className="opacity-90 hover:opacity-100">
                {s === "facebook-1" ? (
                  <svg viewBox="0 0 20 20" className="size-5" fill="none" aria-hidden="true">
                    <rect x="1" y="1" width="18" height="18" rx="2" stroke="#1A0F0A" strokeWidth="1.6" />
                    <path d="M13.2 4.5h-1.6c-1.4 0-2.5 1.2-2.5 2.7v1.7H7.6v2.3h1.5V17h2.1v-5.8h1.5l.5-2.3h-2V7.4c0-.4.3-.7.7-.7h1.3z" fill="#1A0F0A" />
                  </svg>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={asset(`/figma/social-${s}.svg`)} alt="" className="size-5" />
                )}
              </button>
            ))}
          </div>
        </div>
        <div className="divide-y divide-line border-y border-line lg:grid lg:grid-cols-4 lg:gap-6 lg:divide-y-0 lg:border-0">
          {COLS.map(([h, links]) => (
            <div key={h}>
              <button onClick={() => setOpen(open === h ? null : h)} aria-expanded={open === h}
                className="flex w-full items-center justify-between py-5 text-left text-[15px] uppercase text-ink lg:pointer-events-none lg:py-0 lg:pb-3 lg:text-[12.5px] lg:font-medium lg:tracking-[.08em]">
                {h}
                <svg viewBox="0 0 24 24" className={`size-4 transition lg:hidden ${open === h ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
              </button>
              <ul className={`space-y-2.5 pb-5 lg:block ${open === h ? "block" : "hidden"}`}>
                {links.map((l) => <li key={l}><button onClick={soon} className="text-left text-[14px] text-stone hover:text-ink">{l}</button></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset("/figma/reviews-logo.svg")} alt="REVIEWS.io" className="h-5 w-auto" />
          <p className="mt-2 text-[14px] text-ink">4.5 <span className="tracking-widest" aria-label="4.5 out of 5 stars">★★★★<span className="opacity-40">★</span></span></p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {["MC", "Maestro", "VISA", "PayPal", "Amex", "Sofort", "eps"].map((p) => (
              <span key={p} className="rounded-md border border-line2 px-1.5 py-0.5 text-[10.5px] font-medium text-stone">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
