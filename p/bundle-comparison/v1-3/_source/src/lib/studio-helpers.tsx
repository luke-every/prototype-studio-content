"use client";

import "./studio-measure";
import "./studio-comments";

/**
 * The studio's helpers, on every page. It draws nothing: the root layout renders it once so that each page of the
 * prototype can answer the studio (how tall it is, the keys pressed in it, comments left on it) whether or not it
 * reads a control. Loaded only with studio-controls.ts, a page with no control on it could be neither measured nor
 * commented on while it runs on its dev server.
 */
export function StudioHelpers() {
  return null;
}
