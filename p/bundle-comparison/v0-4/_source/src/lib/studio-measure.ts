/*
 * Page height, for the studio's canvas. A prototype running on its own dev server is on another address than the studio,
 * so the studio can't look inside it to see how tall the page is; it asks, with the frame already set to a phone's
 * height, and this answers. Nothing happens outside the studio.
 */

/**
 * Most pages scroll the document; an app-like one is pinned to the screen and scrolls a box inside it (a sheet, a
 * results page), so its document is always a phone tall. Then it is the screen plus whatever that box holds below the
 * fold: drawn that tall, the box has room for all of it. The box is the one in front, under the middle of the screen,
 * not a page further back (a homepage under a quiz) nor a list or carousel inside it.
 *
 * Drawn taller than a phone, anything made at least as tall as the screen (`min-h-screen`, `min-h-full`) would stretch
 * with it and push what follows down, so it is kept at its phone height first.
 */
function pageHeightOf(doc: Document) {
  const win = doc.defaultView!;
  let box: Element | null = null;
  for (let element = doc.elementFromPoint(win.innerWidth / 2, win.innerHeight / 2); element && element !== doc.body && element !== doc.documentElement; element = element.parentElement) {
    if (element.clientHeight < win.innerHeight / 2 || element.scrollHeight <= element.clientHeight) continue;
    if (!/auto|scroll/.test(win.getComputedStyle(element).overflowY)) continue;
    box = element;
    break;
  }
  const screen = box ? box.clientHeight : win.innerHeight;
  for (const element of (box ?? doc.body).querySelectorAll<HTMLElement>("*")) {
    // A percentage is given back as one, not in pixels: it is of the parent's height.
    const given = win.getComputedStyle(element).minHeight;
    const least = given.endsWith("%") ? (parseFloat(given) / 100) * (element.parentElement?.clientHeight ?? 0) : parseFloat(given);
    if (least >= screen - 1) element.style.setProperty("min-height", `${least}px`, "important");
  }
  const hidden = box ? box.scrollHeight - box.clientHeight : 0;
  return Math.max(doc.documentElement.scrollHeight, win.innerHeight + hidden);
}

if (typeof window !== "undefined" && window.parent !== window) {
  window.addEventListener("message", (event) => {
    if (event.source !== window.parent || event.data?.type !== "studio:measure") return;
    window.parent.postMessage({ type: "studio:size", height: pageHeightOf(document) }, "*");
  });
  // The studio's own keys (F for full screen, Escape) are pressed in here once the prototype has focus, and a page on another
  // address can't be listened to from outside, so they are passed up. Typing into a field is left alone.
  window.addEventListener("keydown", (event) => {
    const target = event.target as HTMLElement | null;
    if (event.defaultPrevented || target?.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target?.tagName ?? "")) return;
    window.parent.postMessage({ type: "studio:key", key: event.key, metaKey: event.metaKey, ctrlKey: event.ctrlKey, altKey: event.altKey, shiftKey: event.shiftKey }, "*");
  });
}

export {};
