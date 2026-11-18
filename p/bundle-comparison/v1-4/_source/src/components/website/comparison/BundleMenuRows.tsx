"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRightIcon } from "@/components/icons";
import { copy } from "./copy";
import { useEnabledBundles } from "./useEnabledBundles";

const REVEAL =
  "translate-y-1 opacity-0 transition-[opacity,transform] duration-200 ease-out group-data-[open=true]/menu:translate-y-0 group-data-[open=true]/menu:opacity-100 group-data-[open=true]/menu:delay-(--stagger) motion-reduce:transition-none";

// Desktop: one column per bundle, plus one for "Explore all bundles". Literal classes so Tailwind finds them; up to six bundles.
const COLUMNS: Record<number, string> = { 0: "lg:grid-cols-1", 1: "lg:grid-cols-2", 2: "lg:grid-cols-3", 3: "lg:grid-cols-4", 4: "lg:grid-cols-5", 5: "lg:grid-cols-6", 6: "lg:grid-cols-7" };

/** The bundles in the navigation, as one style: a box shot, the name and one subline, on the bundle's colour.
 * Mobile menu: a list, one bundle per row (photo, name and line, chevron), then an "Explore all bundles" row. Desktop dropdown: one column per bundle (up to six), then an "Explore all bundles" tile.
 * On desktop the cards fade up one after another (30ms apart) when the nearest `group/menu` ancestor has data-open="true". */
export function BundleMenuRows() {
  const bundles = useEnabledBundles();
  return (
    <ul className={`grid grid-cols-1 gap-2 lg:gap-4 ${COLUMNS[bundles.length]}`}>
      {bundles.map((b, i) => (
        <li key={b.key} className={REVEAL} style={{ "--stagger": `${i * 30}ms` } as CSSProperties}>
          <Link
            href="#"
            className="flex h-full items-center gap-3 rounded-xl border border-dark/0 p-2 transition-colors duration-100 ease-out lg:flex-col lg:items-stretch lg:gap-2.5 lg:p-3 lg:hover:border-dark/8"
            style={{ backgroundColor: b.colors.tile }}
            aria-label={b.title}
          >
            <div className="relative size-14 shrink-0 overflow-clip rounded-lg lg:aspect-[256/200] lg:size-auto lg:w-full">
              <div className="absolute" style={b.art}>
                <Image src={b.image} alt="" fill sizes="(min-width: 1024px) 260px, 56px" loading="eager" className="object-cover" />
              </div>
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5 lg:flex-none lg:px-0 lg:pb-0">
              <p className="font-sans text-sm font-medium leading-[18px] tracking-[-0.28px] text-near-black">{b.title}</p>
              <p className="font-sans text-xs leading-4 tracking-[-0.24px] text-light-text">{b.shortStory}</p>
            </div>
            <ChevronRightIcon size={8} className="shrink-0 lg:hidden" />
          </Link>
        </li>
      ))}
      <li className={REVEAL} style={{ "--stagger": `${bundles.length * 30}ms` } as CSSProperties}>
        {/* Phone: a row, box icon then the label, chevron at the far right. Desktop: one outline around the whole tile (no fill), as tall as the bundle cards, icon top left, copy bottom left. */}
        <Link
          href="#"
          className="flex h-full items-center gap-2 rounded-xl border border-light-grey bg-white p-4 transition-colors duration-100 ease-out lg:flex-col lg:items-stretch lg:justify-between lg:gap-2.5 lg:rounded-lg lg:bg-transparent lg:p-3 lg:hover:border-dark/8"
          aria-label="Explore all bundles"
        >
          <div className="shrink-0">
            <Image src="/img/BundleInclusions/compare.svg" alt="" width={24} height={24} className="lg:size-8" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5 lg:flex-none">
            <p className="font-sans text-sm font-medium leading-[18px] tracking-[-0.28px] text-near-black">{copy("nav.exploreAll")}</p>
            <p className="hidden font-sans text-xs leading-4 tracking-[-0.24px] text-light-text lg:block">{copy("nav.exploreAllLine")}</p>
          </div>
          <ChevronRightIcon size={8} className="shrink-0 lg:hidden" />
        </Link>
      </li>
    </ul>
  );
}
