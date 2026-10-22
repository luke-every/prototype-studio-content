"use client";

import { useEffect, useSyncExternalStore } from "react";
import studio from "../../public/studio.json";

/**
 * Studio controls: the states, variants and switches the studio shows beside this prototype.
 *
 * They are declared once, in public/studio.json, and read here by id. The studio sets them as URL parameters on the
 * prototype's address, and once this has told it the prototype is ready, it sends changes as messages instead, so the
 * prototype updates in place with no reload. Each change is written back into the address, so a reload, a new tab or
 * a QR code shows the same state. Opened on its own, a control is simply at its default.
 *
 *   const state = useControl("state"); // "active" | "new" | ...
 *   const dark = useControl("dark") === "on"; // a toggle is "on" or "off"
 *   const size = Number(useControl("size")); // a range is a number, as text
 *   const embedded = useEmbedded(); // true inside the studio (or any frame): hide any in-page demo bar
 */

type Control = { id: string; param?: string; type: "choice" | "toggle" | "range"; default?: string | number | boolean; value?: string };

const controls = ((studio as { controls?: Control[] }).controls ?? []) as Control[];
const listeners = new Set<() => void>();
let listening = false;

/** Says hello to the studio once, and from then on applies what it sends. */
function listen() {
  if (listening) return;
  listening = true;
  window.addEventListener("message", (event) => {
    if (event.source !== window.parent || event.data?.type !== "studio:controls") return;
    const url = new URL(window.location.href);
    for (const control of controls) url.searchParams.delete(control.param ?? control.id);
    for (const [key, value] of Object.entries((event.data.params ?? {}) as Record<string, string>)) url.searchParams.set(key, String(value));
    // history.state is kept: Next keeps its own bookkeeping there.
    window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
    listeners.forEach((listener) => listener());
  });
  if (window.parent !== window) window.parent.postMessage({ type: "studio:ready" }, window.location.origin);
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => void listeners.delete(listener);
};

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

/** The current value of a control: the chosen option's value, "on" / "off" for a toggle, the number as text for a range. */
export function useControl(id: string) {
  useEffect(listen, []);
  return useSyncExternalStore(subscribe, () => read(id), () => fallback(id));
}

/** True while the prototype is shown inside a frame, as it is in the studio, which draws the controls itself. */
export function useEmbedded() {
  return useSyncExternalStore(
    () => () => {},
    () => window.self !== window.top,
    () => false,
  );
}
