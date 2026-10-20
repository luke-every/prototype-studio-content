"use client";
import { useState, useEffect } from "react";
import React from "react";

export type PriceBreak = {
  label: string;
  pct: number;
};

type PriceProgressBarProps = {
  priceBreaks: PriceBreak[];
  currentPct: number;
  label?: React.ReactNode;
  labelProps?: React.HTMLAttributes<HTMLParagraphElement>;
};

export function PriceProgressBar({ priceBreaks, currentPct, label, labelProps }: PriceProgressBarProps) {
  const minPct = priceBreaks[0]?.pct ?? 5;
  const maxPct = priceBreaks[priceBreaks.length - 1]?.pct ?? 20;
  const range = maxPct - minPct;
  const pad = 15;
  const markerLeft = (pct: number) => pad + ((pct - minPct) / range) * (100 - pad * 2);
  const fillPct = currentPct >= maxPct ? 100 : Math.min(100 - pad, Math.max(0, markerLeft(currentPct)));

  const [animatedFill, setAnimatedFill] = useState<number>(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedFill(fillPct), 100);
    return () => clearTimeout(timer);
  }, [fillPct]);

  return (
    <div className="rounded-xl bg-dark py-2 px-6">
      {label && (
        <p className="text-xs text-light-grey font-medium mb-3 text-center" {...labelProps}>
          {label}
        </p>
      )}
      <div className="relative h-3 w-full rounded-full bg-light-grey-3/40">
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-signal-orange"
          style={{
            width: `calc(${animatedFill}% + 7px)`,
            transition: "width 0.9s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
        {priceBreaks.map((pb) => (
          <div
            key={pb.pct}
            className="absolute top-1/2 h-2.5 w-2.5 bg-dark/50 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ left: `${markerLeft(pb.pct)}%` }}
          />
        ))}
      </div>
      <div className="relative mt-2 h-4">
        {priceBreaks.map((pb) => (
          <span
            key={pb.pct}
            className="absolute -translate-x-1/2 text-xs text-light-grey-3"
            style={{ left: `${markerLeft(pb.pct)}%` }}
          >
            {pb.label}
          </span>
        ))}
      </div>
    </div>
  );
}
