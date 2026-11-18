"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDownIcon } from "@/components/icons";

type NavColumn = {
  title: string;
  links: { label: string; href: string }[];
};

type Props = {
  columns: NavColumn[];
};

function AccordionSection({ column }: { column: NavColumn }) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="border-b border-light-grey-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={column.title}
        className="flex w-full items-center justify-between px-4 py-[30px]"
      >
        <span className="font-sans text-[18px] uppercase leading-[22px] tracking-[-0.36px] text-near-black">{column.title}</span>
        <ChevronDownIcon size={16} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <div className="grid transition-all duration-300 ease-in-out" style={{ gridTemplateRows: open ? "1fr" : "0fr" }}>
        <div className="overflow-hidden">
          <ul className="flex flex-col gap-3 px-4 pb-6">
            {column.links.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="font-sans text-sm text-light-text hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/** Port of every-website `src/components/website/FooterAccordionNav.tsx`: plain props instead of Storyblok links. */
export function FooterAccordionNav({ columns }: Props) {
  return (
    <div className="w-full">
      {columns.map((column) => (
        <AccordionSection key={column.title} column={column} />
      ))}
    </div>
  );
}
