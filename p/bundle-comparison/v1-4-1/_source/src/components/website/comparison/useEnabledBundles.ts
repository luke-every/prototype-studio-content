"use client";

import { useControl } from "@/lib/studio-controls";
import { BUNDLES } from "./bundles";

/** The bundles switched on in the studio's "bundles" control (the chosen keys, comma-separated), in page order. */
export function useEnabledBundles() {
  const chosen = useControl("bundles").split(",");
  return BUNDLES.filter((b) => chosen.includes(b.key));
}
