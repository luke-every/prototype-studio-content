import { useEffect, type RefObject } from "react";

const EXIT_MS = 160;

/**
 * PROTOTYPE DEVIATION: plays a modal's exit with the Web Animations API instead of swapping CSS animation classes,
 * which Safari doesn't run reliably. Mobile slides the panel down; desktop fades and scales it. The backdrop fades.
 * Keep the modal mounted for EXIT_MS after `closing` turns true.
 */
export function useModalExit(closing: boolean, backdropRef: RefObject<HTMLElement | null>, panelRef: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const backdrop = backdropRef.current;
    const panel = panelRef.current;
    if (!closing || !backdrop || !panel) return;
    const timing: KeyframeAnimationOptions = { duration: EXIT_MS, easing: "cubic-bezier(0.4, 0, 1, 1)", fill: "forwards" };
    const desktop = window.matchMedia("(min-width: 1024px)").matches;
    const out = panel.animate(
      desktop ? [{ opacity: 1, transform: "scale(1)" }, { opacity: 0, transform: "scale(0.96)" }] : [{ transform: "translateY(0)" }, { transform: "translateY(100%)" }],
      timing,
    );
    const fade = backdrop.animate([{ opacity: 1 }, { opacity: 0 }], timing);
    return () => {
      out.cancel();
      fade.cancel();
    };
  }, [closing, backdropRef, panelRef]);
}

export const MODAL_EXIT_MS = EXIT_MS;
