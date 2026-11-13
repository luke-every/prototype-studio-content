"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRightIcon } from "@/components/icons";
import { useControl } from "@/lib/studio-controls";
import { BUNDLES, cardGradient } from "./bundles";

const REVEAL =
  "translate-y-1 opacity-0 transition-[opacity,transform] duration-200 ease-out group-data-[open=true]/menu:translate-y-0 group-data-[open=true]/menu:opacity-100 group-data-[open=true]/menu:delay-(--stagger) motion-reduce:transition-none";

/** The bundles in the navigation, as one style: a box shot, the name and one subline.
 * Each bundle is a card in the overview card style (studio control "card": the bundle colour, or the colour fading to white with a grey outline). Mobile menu: two by two, then an "Explore all bundles" row. Desktop dropdown: five across (the four bundles, then an "Explore all bundles" tile).
 * On desktop the cards fade up one after another (30ms apart) when the nearest `group/menu` ancestor has data-open="true". */
export function BundleMenuRows() {
  const gradient = useControl("card") === "gradient";
  return (
    <ul className="grid grid-cols-2 gap-3 lg:grid-cols-5 lg:gap-4">
      {BUNDLES.map((b, i) => (
        <li key={b.key} className={REVEAL} style={{ "--stagger": `${i * 30}ms` } as CSSProperties}>
          <Link
            href="#"
            className={`flex h-full flex-col gap-2.5 rounded-xl border p-2 transition duration-200 ease-out lg:p-3 lg:hover:scale-[1.015] ${gradient ? "border-light-grey" : "border-transparent"}`}
            style={gradient ? { backgroundImage: cardGradient(b) } : { backgroundColor: b.colors.tile }}
            aria-label={b.title}
          >
            <div className="relative h-20 w-full overflow-clip rounded-lg lg:aspect-[256/200] lg:h-auto">
              <div className="absolute scale-[0.8] lg:scale-100" style={b.art}>
                <Image src={b.image} alt="" fill sizes="(min-width: 1024px) 260px, 50vw" loading="eager" className="object-cover" />
              </div>
            </div>
            <div className="flex min-w-0 flex-col gap-0.5 px-1 pb-1 lg:px-0 lg:pb-0">
              <p className="font-sans text-sm font-medium leading-[18px] tracking-[-0.28px] text-near-black">{b.title}</p>
              <p className="font-sans text-xs leading-4 tracking-[-0.24px] text-light-text">{b.shortStory}</p>
            </div>
          </Link>
        </li>
      ))}
      <li className={`col-span-2 lg:col-span-1 ${REVEAL}`} style={{ "--stagger": `${BUNDLES.length * 30}ms` } as CSSProperties}>
        {/* Phone: a row, box icon then the label, chevron at the far right. Desktop: one outline around the whole tile (no fill), as tall as the bundle cards, icon top left, copy bottom left. */}
        <Link
          href="#"
          className="flex h-full items-center gap-2 rounded-xl border border-light-grey bg-white p-4 transition duration-200 ease-out lg:hover:scale-[1.015] lg:flex-col lg:items-stretch lg:justify-between lg:gap-2.5 lg:rounded-lg lg:bg-transparent lg:p-3"
          aria-label="Explore all bundles"
        >
          <div className="shrink-0">
            <Image src="/img/BundleInclusions/compare.svg" alt="" width={24} height={24} className="lg:size-8" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5 lg:flex-none">
            {/* TODO(lift): replace with translation keys */}
            <p className="font-sans text-sm font-medium leading-[18px] tracking-[-0.28px] text-near-black">Explore all bundles</p>
            <p className="hidden font-sans text-xs leading-4 tracking-[-0.24px] text-light-text lg:block">Compare the details</p>
          </div>
          <ChevronRightIcon size={8} className="shrink-0 lg:hidden" />
        </Link>
      </li>
    </ul>
  );
}
