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
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflowY = "hidden";

    return () => {
      lockCount--;
      if (lockCount === 0) {
        document.body.style.overflow = "";
        document.documentElement.style.overflowY = "";
      }
    };
  }, [locked]);
}
