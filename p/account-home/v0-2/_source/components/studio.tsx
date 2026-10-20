"use client";

import { useEffect } from "react";

import type { Goal } from "@/lib/data";
import { useStore, type BoxState, type CustomerState, type Moment } from "@/lib/store";
import { useControl } from "@/lib/studio-controls";
import { setBox, setCustomer, setDelivery, setGoalPersona, setMoment } from "./top";

/**
 * Puts the prototype in the states the studio's controls ask for (public/studio.json). They are the same choices
 * the prototype bar offers, applied through the same functions, so nothing here is new behaviour. A control left at
 * its default changes nothing. Goal and customer reset a lot, so they go first; the rest sit on top of them.
 */
export function StudioControls() {
  const { set } = useStore();
  const goal = useControl("goal");
  const customer = useControl("customer");
  const delivery = useControl("delivery");
  const moment = useControl("moment");
  const box = useControl("box");

  useEffect(() => {
    set((d) => {
      if (goal !== "gut") setGoalPersona(d, goal as Goal);
      if (customer !== "active") setCustomer(d, customer as CustomerState);
      if (delivery !== "coming") setDelivery(d, delivery as "today" | "cancelled");
      if (moment !== "none") setMoment(d, moment as Moment);
      if (box !== "aligned") setBox(d, box as BoxState);
    });
  }, [set, goal, customer, delivery, moment, box]);

  return null;
}
