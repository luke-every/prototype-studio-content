"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDownIcon } from "@/components/icons";
import type { NavItem } from "./nav-types";

type Props = {
  items: NavItem[];
  className?: string;
  itemClassName?: string;
};

/** Front-end-only port of DesktopNav: plain NavItem props instead of Storyblok nav bloks. */
export function DesktopNav({ items, className = "hidden items-center gap-6 lg:flex", itemClassName = "text-base text-dark" }: Props) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <nav className={className} aria-label="Main navigation">
      {items.map((item) => {
        if (item.items) {
          const isOpen = openDropdown === item.label;
          return (
            <div key={item.label} className="relative" onMouseEnter={() => setOpenDropdown(item.label)} onMouseLeave={() => setOpenDropdown(null)}>
              <button
                type="button"
                className={`inline-flex cursor-pointer items-center gap-1 transition-opacity hover:opacity-70 ${itemClassName}`}
                aria-expanded={isOpen}
                aria-haspopup="true"
                onFocus={() => setOpenDropdown(item.label)}
                onKeyDown={(e) => e.key === "Escape" && setOpenDropdown(null)}
              >
                {item.label}
                <ChevronDownIcon className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>
              {isOpen && (
                <div className="absolute left-0 top-full z-50 min-w-48 rounded-lg border border-light-grey bg-white py-2 shadow-lg">
                  {item.items.map((subItem) => (
                    <Link key={subItem.label} href={subItem.href} className="block px-4 py-2 text-sm text-dark transition-colors hover:bg-light-grey">
                      {subItem.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        }
        return (
          <Link key={item.label} href={item.href} className={`transition-opacity hover:opacity-70 ${itemClassName}`}>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
