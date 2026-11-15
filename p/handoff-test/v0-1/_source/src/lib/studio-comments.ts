/*
 * Comments, for the studio. A prototype running on its own dev server is on another address than the studio, so the
 * studio can't look inside it to see what was clicked or where a comment's element is now. When it wants to, it asks
 * this page to load the studio's own comment code from the studio (`/studio-comments.js`), which answers it from in
 * here with the same description of a place the studio uses everywhere else. Nothing is loaded, and nothing happens,
 * outside the studio or until it asks.
 */

if (typeof window !== "undefined" && window.parent !== window) {
  let loaded = false;
  window.addEventListener("message", (event) => {
    if (event.source !== window.parent || event.data?.type !== "studio:comments:load" || loaded) return;
    // Only the studio this page was opened from: it sends the page to this machine's dev server under the same name it
    // was reached by, so the two differ only in port. Any other page that frames this one is ignored.
    if (!event.origin.startsWith(`${window.location.protocol}//${window.location.hostname}:`)) return;
    loaded = true;
    const script = document.createElement("script");
    script.src = `${event.origin}/studio-comments.js`;
    document.head.append(script);
  });
  // "*": the studio is on another address, which isn't known yet; the message carries nothing.
  window.parent.postMessage({ type: "studio:comments:here" }, "*");
}

export {};
