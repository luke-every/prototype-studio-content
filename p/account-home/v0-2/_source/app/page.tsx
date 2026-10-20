"use client";

import { HomeA, HomeB } from "@/components/pages";
import { ONLY_B } from "@/lib/flags";

/** Variant A home: five themed sections (Today · Your goal · Your week · Next delivery · Your month). */
export default function AccountHome() {
  return ONLY_B ? <HomeB /> : <HomeA />;
}
