"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDownIcon, CloseIcon, UserIcon } from "@/components/icons";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import type { NavItem } from "./nav-types";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  items: NavItem[];
  loginLabel: string;
  loginHref: string;
};

const ROW = "rounded-lg px-4 py-3 text-lg text-dark transition-colors hover:bg-light-grey";

/** Front-end-only port of MobileNavDrawer, without the locale switcher. */
export function MobileNavDrawer({ isOpen, onClose, items, loginLabel, loginHref }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);
  useBodyScrollLock(isOpen);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      <div className="flex items-center justify-end px-4 py-4">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-dark px-4 py-2 text-dark"
          aria-label="Close menu"
        >
          <CloseIcon size={18} />
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-4" aria-label="Mobile navigation">
        {items.map((item) => {
          if (item.items) {
            const isExpanded = expanded === item.label;
            return (
              <div key={item.label}>
                <button
                  type="button"
                  onClick={() => setExpanded(isExpanded ? null : item.label)}
                  className={`flex w-full cursor-pointer items-center justify-between ${ROW}`}
                  aria-expanded={isExpanded}
                >
                  {item.label}
                  <ChevronDownIcon className={`transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                </button>
                {isExpanded && (
                  <div className="flex flex-col gap-1 pl-4">
                    {item.items.map((subItem) => (
                      <Link key={subItem.label} href={subItem.href} onClick={onClose} className="rounded-lg px-4 py-2 text-base text-dark transition-colors hover:bg-light-grey">
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }
          return (
            <Link key={item.label} href={item.href} onClick={onClose} className={ROW}>
              {item.label}
            </Link>
          );
        })}

        <hr className="my-2 border-light-grey" />

        <Link href={loginHref} onClick={onClose} className={`inline-flex items-center gap-3 ${ROW}`}>
          <UserIcon size={20} />
          {loginLabel}
        </Link>
      </nav>
    </div>
  );
}
