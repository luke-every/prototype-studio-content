"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDownIcon } from "@/components/icons";
import { Button } from "@/components/shared/Button";
import { BUNDLES, INCLUDE_ROWS, isLeader, type Bundle, type MacroKey } from "./bundles";
import { Collapse } from "@/components/website/Collapse";
import { BundleDetails } from "./BundleDetails";

const MACRO: Record<MacroKey, { label: string; unit?: string }> = {
  protein: { label: "Protein", unit: "g" },
  fibre: { label: "Fibre", unit: "g" },
  kcal: { label: "Kcal" },
};

function StackCard({ b }: { b: Bundle }) {
  const [expanded, setExpanded] = useState<boolean>(false);
  const macro = MACRO[b.keyMacro];
  const meals = INCLUDE_ROWS.filter((row) => b.includes[row.key]).map((row) => row.label);

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-light-grey-2 bg-white p-4" aria-label={b.title}>
      {/* Compact: the bundle's focus, the macro it leads on, what meal types come in the box */}
      <div className="flex gap-4">
        <div className="relative size-[104px] shrink-0 overflow-clip rounded-xl" style={{ backgroundColor: b.colors.tile }}>
          <div className="absolute" style={b.art}>
            <Image src={b.image} alt="" fill sizes="104px" className="object-cover" />
          </div>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h3 className="font-sans text-base font-medium leading-[22px] tracking-[-0.32px] text-near-black">{b.title}</h3>
          <p className="font-sans text-sm leading-[19px] tracking-[-0.28px] text-light-text">{b.shortStory}</p>
          <span
            className="mt-1 inline-flex w-fit items-baseline gap-1.5 rounded-full px-2.5 py-1 font-sans text-xs leading-4 tracking-[-0.24px] text-near-black"
            style={{ backgroundColor: isLeader(b, b.keyMacro) ? b.colors.tile : "rgba(55,45,39,0.06)" }}
          >
            {macro.label}
            <span className="font-book text-base leading-4 tracking-[-0.32px] text-dark">
              {b.macros[b.keyMacro]}
              {macro.unit}
            </span>
          </span>
        </div>
      </div>

      <p className="font-sans text-sm leading-[19px] tracking-[-0.28px] text-light-text">{meals.join(" · ")}</p>

      <div className="flex flex-col gap-1">
        <Button variant="dark" sizeClassName="h-10 px-6 py-3" className="w-full justify-center font-sans text-xs font-medium uppercase leading-none tracking-[1.8px]" aria-label={`Continue with ${b.title}`}>
          {/* TODO(lift): replace with translation key */}
          Continue
        </Button>
        <button
          type="button"
          onClick={() => setExpanded((open) => !open)}
          className="flex h-10 w-full cursor-pointer items-center justify-center gap-1 font-sans text-sm font-medium leading-[19px] tracking-[-0.28px] text-near-black"
          aria-expanded={expanded}
          aria-controls={`details-${b.key}`}
        >
          {/* TODO(lift): replace with translation key */}
          {expanded ? "Hide details" : "See details"}
          <ChevronDownIcon className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Expanded: the full story, everything in the box, the full nutrition card */}
      <Collapse open={expanded} id={`details-${b.key}`} closedClassName="-mt-4">
        <div className="flex flex-col gap-4 border-t border-light-grey pt-4">
          <BundleDetails b={b} />
        </div>
      </Collapse>
    </article>
  );
}

/** Mobile: one compact card per bundle, stacked vertically; "See details" opens the rest. */
export function BundleStack() {
  return (
    <div className="flex flex-col gap-4">
      {BUNDLES.map((b) => (
        <StackCard key={b.key} b={b} />
      ))}
    </div>
  );
}
