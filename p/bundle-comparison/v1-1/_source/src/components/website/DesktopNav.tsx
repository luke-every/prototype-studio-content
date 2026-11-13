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

/** Port of every-website `src/components/website/DesktopNav.tsx`: plain NavItem props instead of Storyblok nav bloks. */
export function DesktopNav({ items, className = "hidden items-center gap-6 lg:flex", itemClassName = "text-base text-dark" }: Props) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <nav className={className} aria-label="Main navigation">
      {items.map((item) => {
        if (item.items || item.megaPanel) {
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
              {item.megaPanel ? (
                // Fixed under the header, full width; the transparent top padding bridges the gap so the hover isn't lost on the way down.
                // Stays mounted and fades, so its images load once; data-open drives the stagger of the content.
                <div
                  data-open={isOpen}
                  inert={!isOpen}
                  className={`group/menu fixed inset-x-0 top-[56px] z-50 pt-[33px] transition-[opacity,visibility] ease-out motion-reduce:transition-none ${isOpen ? "visible opacity-100 duration-200" : "invisible opacity-0 duration-150"}`}
                >
                  <div className={`border-t border-light-grey bg-white px-8 py-6 shadow-lg transition-transform duration-200 ease-out motion-reduce:transition-none ${isOpen ? "translate-y-0" : "-translate-y-1"}`}>
                    <div className="mx-auto w-full max-w-[1120px]">{item.megaPanel}</div>
                  </div>
                </div>
              ) : (
                isOpen && (
                  <div className="absolute left-0 top-full z-50 min-w-48 rounded-lg border border-light-grey bg-white py-2 shadow-lg">
                    {item.items?.map((subItem) => (
                      <Link key={subItem.label} href={subItem.href} className="block px-4 py-2 text-sm text-dark transition-colors hover:bg-light-grey">
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )
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
