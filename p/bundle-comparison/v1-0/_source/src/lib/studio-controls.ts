"use client";

import { useEffect, useSyncExternalStore } from "react";
import studio from "../../public/studio.json";
import "./studio-measure";

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
 *   setPlace({ screen: "results", step: null }); // the person moved: say where, in the address (null removes a key)
 */

type Control = { id: string; param?: string; type: "choice" | "toggle" | "range"; default?: string | number | boolean; value?: string };

const controls = ((studio as { controls?: Control[] }).controls ?? []) as Control[];
const listeners = new Set<() => void>();
let listening = false;

/**
 * The address's parameters as this page last set them, and the address kept in step with them. When the dev server hot-updates
 * a file, Next puts the address back to the one it knows, which has none of what the studio sent: every control would fall back
 * to its default while the studio still shows the choice made. What is read comes from here, so it holds.
 */
let held: URLSearchParams | null = null;
const params = () => (held ??= new URLSearchParams(window.location.search));
function write(next: URLSearchParams) {
  held = next;
  const search = next.toString();
  // history.state is kept: Next keeps its own bookkeeping there.
  window.history.replaceState(window.history.state, "", window.location.pathname + (search ? `?${search}` : "") + window.location.hash);
  listeners.forEach((listener) => listener());
}

/** Says hello to the studio once, and from then on applies what it sends. */
function listen() {
  if (listening) return;
  listening = true;
  window.addEventListener("message", (event) => {
    if (event.source !== window.parent || event.data?.type !== "studio:controls") return;
    const next = new URLSearchParams(params());
    for (const control of controls) next.delete(control.param ?? control.id);
    for (const [key, value] of Object.entries((event.data.params ?? {}) as Record<string, string>)) next.set(key, String(value));
    write(next);
  });
  // "*": a dev server runs on its own port, so the studio is not on this origin; the message carries nothing.
  if (window.parent !== window) window.parent.postMessage({ type: "studio:ready" }, "*");
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
  const raw = params().get(control.param ?? id);
  if (raw === null) return fallback(id);
  return control.type === "toggle" ? (raw === (control.value ?? "1") ? "on" : "off") : raw;
}

/** The current value of a control: the chosen option's value, "on" / "off" for a toggle, the number as text for a range. */
export function useControl(id: string) {
  useEffect(listen, []);
  return useSyncExternalStore(subscribe, () => read(id), () => fallback(id));
}

/**
 * Writes where the person has got to into the address, with the same parameters the controls and flow screens use, so
 * a reload, a new tab, a QR code and the studio (its controls, and the comments left here) all see this place. Call it
 * whenever the person moves to another screen or answers something. Other keys, the path and Next's history.state are
 * kept; null removes a key.
 */
export function setPlace(changes: Record<string, string | null>) {
  const next = new URLSearchParams(params());
  for (const [key, value] of Object.entries(changes)) {
    if (value === null) next.delete(key);
    else next.set(key, value);
  }
  if (next.toString() === params().toString()) return;
  write(next);
}

/** True while the prototype is shown inside a frame, as it is in the studio, which draws the controls itself. */
export function useEmbedded() {
  return useSyncExternalStore(
    () => () => {},
    () => window.self !== window.top,
    () => false,
  );
}
