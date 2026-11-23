"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  value: number;
  format: (value: number) => string;
};

/** New: nothing in every-website does this. A number that eases to its new value (from wherever it is, so a quick second drag is never fought) and jumps straight there for people who ask for less motion. */
export function AnimatedNumber({ value, format }: Props) {
  const [shown, setShown] = useState<number>(value);
  const current = useRef<number>(value);

  useEffect(() => {
    const start = current.current;
    const begin = performance.now();
    const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 320;
    let frame = 0;
    const tick = (now: number): void => {
      const progress = duration === 0 ? 1 : Math.min(1, (now - begin) / duration);
      const next = start + (value - start) * (1 - Math.pow(1 - progress, 3));
      current.current = next;
      setShown(next);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return <>{format(shown)}</>;
}
