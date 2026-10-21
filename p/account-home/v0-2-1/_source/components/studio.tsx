"use client";

import { useEffect, useRef } from "react";

import type { Goal } from "@/lib/data";
import { useStore, type BoxState, type CustomerState, type Moment } from "@/lib/store";
import { useControl } from "@/lib/studio-controls";
import { setBox, setCustomer, setDelivery, setGoalPersona, setMoment } from "./top";

/** Where each control starts (public/studio.json), which is also how the prototype opens. */
const DEFAULTS = { goal: "gut", customer: "active", delivery: "coming", moment: "none", box: "aligned" };

/**
 * Puts the prototype in the states the studio's controls ask for (public/studio.json). They are the same choices
 * the prototype bar offers, applied through the same functions. On load only the controls away from their default
 * are applied; after that, whichever one changes is applied, including a change back to its default. Goal and
 * customer reset a lot, so they go first; the rest sit on top of them.
 */
export function StudioControls() {
  const { set } = useStore();
  const now = {
    goal: useControl("goal"),
    customer: useControl("customer"),
    delivery: useControl("delivery"),
    moment: useControl("moment"),
    box: useControl("box"),
  };
  const was = useRef<typeof now | null>(null);
  const { goal, customer, delivery, moment, box } = now;

  useEffect(() => {
    const before = was.current ?? DEFAULTS;
    const next = { goal, customer, delivery, moment, box };
    was.current = next;
    const changed = (key: keyof typeof next) => next[key] !== before[key];
    if (!Object.keys(next).some((key) => changed(key as keyof typeof next))) return;
    set((d) => {
      if (changed("goal")) setGoalPersona(d, goal as Goal);
      if (changed("customer")) setCustomer(d, customer as CustomerState);
      if (changed("delivery")) setDelivery(d, delivery as "coming" | "today" | "cancelled");
      if (changed("moment")) setMoment(d, moment as Moment);
      if (changed("box")) setBox(d, box as BoxState);
    });
  }, [set, goal, customer, delivery, moment, box]);

  return null;
}
