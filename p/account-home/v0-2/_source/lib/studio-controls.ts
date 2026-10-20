"use client";

import { useSyncExternalStore } from "react";
import studio from "../public/studio.json";

/**
 * Studio controls: the states, variants and switches the studio shows beside this prototype.
 *
 * They are declared once, in public/studio.json, and read here by id. The studio sets each one as a URL parameter on
 * the prototype's address. Opened on its own, a control is simply at its default.
 *
 *   const state = useControl("state"); // "active" | "new" | ...
 *   const dark = useControl("dark") === "on"; // a toggle is "on" or "off"
 *   const size = Number(useControl("size")); // a range is a number, as text
 *   const embedded = useEmbedded(); // true inside the studio (or any frame): hide any in-page demo bar
 */

type Control = { id: string; param?: string; type: "choice" | "toggle" | "range"; default?: string | number | boolean; value?: string };

const controls = ((studio as { controls?: Control[] }).controls ?? []) as Control[];

function fallback(id: string) {
  const control = controls.find((item) => item.id === id);
  if (!control) return "";
  return control.type === "toggle" ? (control.default === true ? "on" : "off") : String(control.default ?? "");
}

function read(id: string) {
  const control = controls.find((item) => item.id === id);
  if (!control) return "";
  const raw = new URLSearchParams(window.location.search).get(control.param ?? id);
  if (raw === null) return fallback(id);
  return control.type === "toggle" ? (raw === (control.value ?? "1") ? "on" : "off") : raw;
}

/** The current value of a control: the chosen option's value, or "on" / "off" for a toggle. */
export function useControl(id: string) {
  return useSyncExternalStore(() => () => {}, () => read(id), () => fallback(id));
}

/** True while the prototype is shown inside a frame, as it is in the studio, which draws the controls itself. */
export function useEmbedded() {
  return useSyncExternalStore(
    () => () => {},
    () => window.self !== window.top,
    () => false,
  );
}
