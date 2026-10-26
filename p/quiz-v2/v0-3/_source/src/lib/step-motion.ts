import type { CSSProperties } from "react";
import { REVEAL_STAGGER_MS } from "@/components/website/quiz/sample-data";
import type { StepMotion } from "@/components/website/quiz/types";

type Motion = {
  className: string;
  style: CSSProperties;
};

/**
 * The class and delay for one element of a quiz step. Arriving elements rise in with a stagger,
 * leaving ones fade and drift out together, and a step held still under the loader doesn't move.
 * The intro is the one step that arrives while the sheet is still moving, so it waits for it.
 */
export function stepMotion(motion: StepMotion, delayMs: number, kind: "step" | "intro" = "step"): Motion {
  if (motion === "leave") return { className: "animate-leave", style: {} };
  if (motion === "still") return { className: "", style: {} };
  if (kind === "intro") return { className: "animate-rise-intro", style: { animationDelay: `${200 + delayMs}ms` } };
  return { className: "animate-rise", style: { animationDelay: `${delayMs}ms` } };
}

/** The travel a step's elements share: sideways by direction, upwards when the sheet opens */
export function stepTravel(motion: StepMotion, direction: "push" | "pop"): CSSProperties {
  if (motion === "opening") return { "--rx": "0px", "--ry": "40px" } as CSSProperties;
  if (motion === "leave") return { "--lx": direction === "push" ? "-56px" : "56px" } as CSSProperties;
  return { "--rx": direction === "push" ? "72px" : "-72px" } as CSSProperties;
}

/** The results hero arrives as the loader clears: each element a beat after the one before it. */
export function revealMotion(index: number, revealed: boolean, instant: boolean): Motion {
  if (!revealed) return { className: "opacity-0", style: {} };
  if (instant) return { className: "opacity-100", style: {} };
  return { className: "animate-rise", style: { animationDelay: `${index * REVEAL_STAGGER_MS}ms` } };
}
