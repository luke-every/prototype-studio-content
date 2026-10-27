"use client";

import { useMemo, useState } from "react";
import { boxPrice, type BoxPrice } from "@/lib/box-price";
import { statsFor, type Stat } from "@/lib/meal-stats";
import { engineAnswers, recommend, type EngineAnswers, type Meal, type Recommendation } from "@/lib/recommendation";
import type { Answers } from "../quiz/types";

/** A card in the box. `id` stays put through a swap, so the card holds its place and plays the swap in */
export type BoxLine = {
  id: string;
  meal: Meal;
  qty: number;
  /** Swapped or added by the customer */
  picked: boolean;
};

export type Box = {
  engine: EngineAnswers;
  recommendation: Recommendation;
  lines: BoxLine[];
  units: number;
  stats: Stat[];
  added: string[];
  price: BoxPrice;
  qtyOf: (meal: Meal) => number;
  /** Meals they swapped out: they said no, so these go to the back of any list of choices */
  rejected: string[];
  /** Swapping to a meal already in the box adds the portions to it */
  swap: (from: BoxLine, to: Meal) => void;
  add: (meal: Meal) => void;
  /** 0 takes the meal out */
  setQty: (line: BoxLine, qty: number) => void;
  undo: () => void;
  toggleAddOn: (key: string) => void;
};

/** The customer's box: it starts as the engine's pick and becomes theirs as they change it */
export function useBox(answers: Answers): Box {
  const engine = useMemo(() => engineAnswers(answers), [answers]);
  const recommendation = useMemo(() => recommend(engine), [engine]);
  /*
   * The box, the meals swapped out of it, and how both were before each change, together, so an undo
   * from an old toast still undoes the latest, swapped-out meals included
   */
  type Snapshot = { lines: BoxLine[]; rejected: string[] };
  const fresh = () => ({
    lines: recommendation.lines.map(({ meal, qty }) => ({ id: meal.sku, meal, qty, picked: false })),
    rejected: [],
    history: [],
  });
  const [state, setState] = useState<Snapshot & { history: Snapshot[] }>(fresh);
  const [added, setAdded] = useState<string[]>([]);
  /* new answers mean a new recommendation, so the box starts again from it (the review page changes answers live) */
  const [basis, setBasis] = useState<Recommendation>(recommendation);
  if (recommendation !== basis) {
    setBasis(recommendation);
    setState(fresh());
    setAdded([]);
  }
  const { lines, rejected } = state;

  const change = (next: (lines: BoxLine[]) => BoxLine[], rejecting?: { out: string; back: string }) =>
    setState((prev) => ({
      lines: next(prev.lines),
      /* the meal swapped out goes on the list; one picked again comes off it */
      rejected: rejecting
        ? [...prev.rejected.filter((sku) => sku !== rejecting.out && sku !== rejecting.back), rejecting.out]
        : prev.rejected,
      history: [...prev.history, { lines: prev.lines, rejected: prev.rejected }],
    }));

  const units = lines.reduce((n, line) => n + line.qty, 0);

  return {
    engine,
    recommendation,
    lines,
    units,
    stats: statsFor(engine),
    added,
    price: boxPrice(lines, added),
    qtyOf: (meal) => lines.find((line) => line.meal.sku === meal.sku)?.qty ?? 0,
    rejected,
    swap: (from, to) =>
      change((list) => {
        const twin = list.find((line) => line.meal.sku === to.sku);
        return twin
          ? list.filter((line) => line.id !== from.id).map((line) => (line === twin ? { ...line, qty: line.qty + from.qty } : line))
          : list.map((line) => (line.id === from.id ? { ...line, meal: to, picked: true } : line));
      }, { out: from.meal.sku, back: to.sku }),
    add: (meal) =>
      change((list) => {
        const twin = list.find((line) => line.meal.sku === meal.sku);
        return twin
          ? list.map((line) => (line === twin ? { ...line, qty: line.qty + 1 } : line))
          : [...list, { id: `${meal.sku}+`, meal, qty: 1, picked: true }];
      }),
    setQty: (target, qty) =>
      change((list) =>
        qty > 0 ? list.map((line) => (line.id === target.id ? { ...line, qty } : line)) : list.filter((line) => line.id !== target.id),
      ),
    undo: () =>
      setState((prev) =>
        prev.history.length ? { ...prev.history[prev.history.length - 1], history: prev.history.slice(0, -1) } : prev,
      ),
    toggleAddOn: (key) => setAdded((list) => (list.includes(key) ? list.filter((k) => k !== key) : [...list, key])),
  };
}
