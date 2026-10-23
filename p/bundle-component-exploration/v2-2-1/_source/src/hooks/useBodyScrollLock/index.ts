"use client";

import { useEffect } from "react";

/**
 * Locks body scroll when `locked` is true; restores on unlock or unmount.
 * Tracks a reference count so nested usages don't conflict.
 */
let lockCount = 0;

export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;

    lockCount++;
    // PROTOTYPE DEVIATION: keep the scrollbar's width as padding so hiding it doesn't shift the page (the meal detail modal does the same).
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (lockCount === 1 && scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflowY = "hidden";

    return () => {
      lockCount--;
      if (lockCount === 0) {
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";
        document.documentElement.style.overflowY = "";
      }
    };
  }, [locked]);
}
