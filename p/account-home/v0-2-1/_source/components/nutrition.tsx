"use client";

import { useEffect, useState } from "react";
import { asset, dish, goalInfo } from "@/lib/data";
import { isEaten, State } from "@/lib/store";
import { Icon } from "./ui";

/**
 * The goal's nutrition in one place (B only copy): for each focus macro, the target zone (the plan's target),
 * what this week's planned meals average (ring) and what's been eaten so far (dot). Used on My Plan's goal card,
 * in "Your meal plan", and as one line on Home.
 */

export type MacroKey = "protein" | "fibre" | "carbs" | "fat" | "kcal";
const MACROS: { k: MacroKey; label: string; unit: string }[] = [
  { k: "protein", label: "Protein", unit: "g" },
  { k: "fibre", label: "Fibre", unit: "g" },
  { k: "carbs", label: "Carbs", unit: "g" },
  { k: "fat", label: "Fat", unit: "g" },
  { k: "kcal", label: "Energy", unit: "kcal" },
];

/** "15–20 g per meal" → { lo: 15, hi: 20, text: "15–20 g" } */
function parseTarget(t?: string) {
  const m = t?.match(/(\d[\d,.]*)\s*(?:–\s*(\d[\d,.]*))?\s*(g|kcal)?/);
  if (!m) return null;
  const n = (x: string) => Number(x.replace(/[,.]/g, ""));
  return { lo: n(m[1]), hi: n(m[2] ?? m[1]), text: `${m[1]}${m[2] ? `–${m[2]}` : ""} ${m[3] ?? ""}`.trim() };
}

/** Everyday comparisons, rounded: an egg ≈ 6 g protein, an apple ≈ 4 g fibre, a slice of bread ≈ 15 g carbs, a tablespoon of olive oil ≈ 13 g fat, a banana ≈ 105 kcal. */
function compare(k: MacroKey, avg: number, total: number) {
  const n = (x: number) => Math.max(1, Math.round(x));
  switch (k) {
    case "protein": return `about ${n(avg / 6)} eggs' worth per meal`;
    case "fibre": return `like ${n(total / 4)} apples so far`;
    case "carbs": return `about ${n(avg / 15)} slices of bread per meal`;
    case "fat": return `about ${n(avg / 13)} tbsp olive oil per meal`;
    case "kcal": return `about ${n(total / 105)} bananas of energy so far`;
  }
}

/** Icons per macro: Air storytelling icons where we have them, line icons otherwise. */
function MacroIcon({ k, className = "size-5" }: { k: MacroKey; className?: string }) {
  if (k === "protein" || k === "kcal") {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={asset(`/eve/icon-${k === "kcal" ? "kcal" : "protein"}.png`)} alt="" aria-hidden="true" className={`${className} object-contain`} />;
  }
  return <Icon name={k === "fibre" ? "leaf" : k === "carbs" ? "spark" : "heart"} className={`${className} text-ink`} />;
}

// ---------- Motion: numbers count up once, fills grow in. Off with reduced motion. ----------

export function useArrived() {
  const [on, setOn] = useState(false);
  useEffect(() => { const t = requestAnimationFrame(() => setOn(true)); return () => cancelAnimationFrame(t); }, []);
  return on;
}

function useCountUp(to: number, ms = 700) {
  const [v, setV] = useState(to);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setV(to); return; }
    let raf = 0; const t0 = performance.now();
    const step = (t: number) => { const k = Math.min(1, (t - t0) / ms); setV(Math.round(to * (1 - Math.pow(1 - k, 3)))); if (k < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to, ms]);
  return v;
}

export function Num({ value, className = "" }: { value: number; className?: string }) {
  return <span className={className}>{useCountUp(value)}</span>;
}

// ---------- Data ----------

/** The goal's focus macros (its chips, in the board's priority order) with target, planned and eaten averages per meal. */
export function focusNutrition(s: State) {
  const g = goalInfo(s.goal);
  const planned = s.weeks.this.flatMap((d) => d.slots.filter((x) => x.dishId).map((x) => dish(x.dishId!)));
  const eaten = s.weeks.this.flatMap((d, i) => d.slots.filter((x) => x.dishId && isEaten(s, i, x.slot)).map((x) => dish(x.dishId!)));
  const avg = (ds: typeof planned, k: MacroKey) => (ds.length ? Math.round(ds.reduce((a, d) => a + d[k], 0) / ds.length) : 0);
  const items = g.chips.flatMap((c) => {
    const m = MACROS.find((x) => x.k === c.key);
    const t = parseTarget(c.target);
    if (!m || !t) return [];
    const eatenTotal = eaten.reduce((a, d) => a + d[m.k], 0);
    return [{ ...m, t, planned: avg(planned, m.k), eaten: avg(eaten, m.k), eatenTotal }];
  });
  return { items, eatenCount: eaten.length };
}

type Item = ReturnType<typeof focusNutrition>["items"][number];
const statusOf = (v: number, t: Item["t"]) => (v < t.lo ? "Building up" : v <= t.hi ? "In the zone" : "Above the range");

// ---------- Display ----------

/** One track: target zone shaded, ring = planned average, dot = eaten so far. */
function Track({ it, size = "md" }: { it: Item; size?: "sm" | "md" }) {
  const on = useArrived();
  const max = Math.max(it.t.hi * 1.4, it.planned * 1.1, it.eaten * 1.1);
  const pos = (x: number) => `${Math.min(100, (x / max) * 100)}%`;
  const h = size === "sm" ? "h-1.5" : "h-2";
  return (
    <div className={`relative ${h} rounded-full bg-ink/10`} aria-hidden="true">
      <span className="absolute inset-y-0 rounded-full bg-olive/45" style={{ left: pos(it.t.lo), width: `calc(${pos(it.t.hi)} - ${pos(it.t.lo)})` }} />
      <span className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink bg-white ${size === "sm" ? "size-3" : "size-4"}`} style={{ left: pos(it.planned) }} />
      <span className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-ink shadow-e1 transition-[left] duration-700 ease-out ${size === "sm" ? "size-3" : "size-3.5"}`} style={{ left: on ? pos(it.eaten) : "0%" }} />
    </div>
  );
}

function Legend() {
  return (
    <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11.5px] text-stone">
      <span className="flex items-center gap-1.5"><span className="size-3 rounded-full border-2 border-white bg-ink shadow-e1" /> Eaten so far</span>
      <span className="flex items-center gap-1.5"><span className="size-3 rounded-full border-2 border-ink bg-white" /> Your plan</span>
      <span className="flex items-center gap-1.5"><span className="h-1.5 w-4 rounded-full bg-olive/45" /> Target</span>
    </p>
  );
}

/**
 * "Your nutrition this week": every focus macro with its track, numbers and an everyday comparison.
 * `compact` (My Plan's goal card): the tracks and numbers only.
 */
export function NutritionTracks({ s, compact = false }: { s: State; compact?: boolean }) {
  const { items, eatenCount } = focusNutrition(s);
  if (!items.length) return null;
  return (
    <div className={compact ? "space-y-3" : "space-y-5"}>
      {items.map((it) => {
        const st = statusOf(it.eaten, it.t);
        return (
          <div key={it.k}>
            <div className="flex items-center gap-2">
              <MacroIcon k={it.k} className={compact ? "size-4" : "size-5"} />
              <p className={`${compact ? "text-[12.5px]" : "text-[13.5px]"} font-medium text-ink`}>{it.label}</p>
              {compact
                ? <p className="ml-auto text-[12px] text-body"><b className="font-medium text-ink"><Num value={it.eaten} /></b> eaten · <Num value={it.planned} /> planned <span className="text-stone">{it.unit}</span></p>
                : <span className={`ml-auto shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${st === "In the zone" ? "bg-olive-bg text-ink" : "bg-ink/5 text-body"}`}>{st}</span>}
            </div>
            {!compact && (
              <p className="mt-1.5 text-[13px] text-body">
                <b className="text-[22px] font-medium text-ink"><Num value={it.eaten} /></b> {it.unit} eaten <span className="text-stone">·</span> <b className="font-medium text-ink"><Num value={it.planned} /></b> {it.unit} planned
              </p>
            )}
            <div className="mt-2"><Track it={it} size={compact ? "sm" : "md"} /></div>
            {!compact && <p className="mt-2 text-[11.5px] leading-snug text-stone">Target {it.t.text} per meal · {compare(it.k, it.eaten, it.eatenTotal)}</p>}
          </div>
        );
      })}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Legend />
        {!compact && <p className="text-[11.5px] text-stone">Average per meal · from {eatenCount} {eatenCount === 1 ? "meal" : "meals"} eaten</p>}
      </div>
    </div>
  );
}

/** Home: only the goal's main macro, as one line, with a way into the full picture. */
export function NutritionLine({ s, onMore }: { s: State; onMore: () => void }) {
  const it = focusNutrition(s).items[0];
  if (!it) return null;
  const st = statusOf(it.eaten, it.t);
  return (
    <div>
      <div className="flex items-center gap-2.5">
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white"><MacroIcon k={it.k} className="size-4" /></span>
        <p className="min-w-0 flex-1 text-[13.5px] text-ink"><b className="font-medium">{it.label}</b> · <Num value={it.eaten} /> {it.unit} a meal</p>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${st === "In the zone" ? "bg-olive-bg text-ink" : "bg-ink/5 text-body"}`}>{st}</span>
      </div>
      <div className="mt-3"><Track it={it} size="sm" /></div>
      <div className="mt-2.5 flex items-center justify-between gap-3">
        <p className="text-[11.5px] text-stone">Target {it.t.text} · plan {it.planned} {it.unit}</p>
        <button onClick={onMore} className="inline-flex shrink-0 items-center gap-1 text-[13px] font-medium text-ink underline decoration-line2 underline-offset-4 hover:decoration-ink">
          See your nutrition <Icon name="chevron" className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
