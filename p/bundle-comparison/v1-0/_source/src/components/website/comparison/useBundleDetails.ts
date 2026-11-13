"use client";

import { useState } from "react";
import { BUNDLES } from "./bundles";

/**
 * Which bundle cards have "See more details" open.
 * Side by side (desktop, the swipe, the sheet) they open and close together, so the details can be compared and the cards stay the same height.
 * With `perCardOnPhone` (the stacked layout) each card opens on its own below lg, so the cards above the one tapped don't move it down the page.
 */
export function useBundleDetails(perCardOnPhone: boolean = false) {
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  const toggle = (key: string) => {
    const together = !perCardOnPhone || window.matchMedia("(min-width: 1024px)").matches;
    setOpenKeys((prev) => {
      if (together) return prev.includes(key) ? [] : BUNDLES.map((b) => b.key);
      return prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key];
    });
  };

  return { isOpen: (key: string) => openKeys.includes(key), toggle };
}
