"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";

/** How visible a card is when it is fully outside the window. */
const PEEK_OPACITY = 0.2;

type Edge = { start: boolean; end: boolean };

/**
 * The ref for a carousel's scrolling row, and which ends of it are in view. Put `data-track` on the row as well, so the arrows can find it.
 * From `minWidth` (the viewport width the carousel starts at) a card's opacity follows its position as the row scrolls: 100% while it is fully inside the row's content box (the window the cards snap into),
 * 20% fully outside, and in between by how much of it is inside, so a card fades as it moves in or out rather than switching. A card not fully inside also gets `data-peek` (the row's classes make it unclickable).
 * Below `minWidth` nothing is touched.
 */
export function useCarouselEdges(active: boolean, count: number, minWidth: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState<Edge>({ start: true, end: false });
  const apply = useRef<(() => void) | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !active) return;
    const wide = window.matchMedia(`(min-width: ${minWidth}px)`);
    const cards = () => Array.from(el.children) as HTMLElement[];
    const update = () => {
      const start = el.scrollLeft <= 1;
      const end = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
      setEdge((prev) => (prev.start === start && prev.end === end ? prev : { start, end }));
      const style = getComputedStyle(el);
      const box = el.getBoundingClientRect();
      const left = box.left + parseFloat(style.paddingLeft);
      const right = box.right - parseFloat(style.paddingRight);
      for (const card of cards()) {
        const rect = card.getBoundingClientRect();
        // The share of the card inside the window
        const inside = Math.max(0, Math.min(rect.right, right) - Math.max(rect.left, left)) / rect.width;
        const fraction = inside >= 0.98 ? 1 : inside;
        card.toggleAttribute("data-peek", wide.matches && fraction < 1);
        // Set directly, and not transitioned, so the opacity keeps up with the scroll (the card's own transition stays on its border)
        card.style.transitionProperty = wide.matches ? "border-color" : "";
        card.style.opacity = wide.matches ? String(PEEK_OPACITY + (1 - PEEK_OPACITY) * fraction) : "";
      }
    };
    update();
    apply.current = update;
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      apply.current = null;
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      for (const card of cards()) {
        card.removeAttribute("data-peek");
        card.style.opacity = "";
        card.style.transitionProperty = "";
      }
    };
  }, [active, count, minWidth]);

  // After every render too, in case a render has put a card's style back
  useLayoutEffect(() => apply.current?.());

  return { ref, edge };
}

type Props = {
  edge: Edge;
  /** Where each arrow sits, and from which breakpoint it shows (they are `hidden` until then), as classes. The wrapper they are in must be `relative`, with the row as its sibling. */
  prevClass: string;
  nextClass: string;
};

/** Back and forward buttons, centred on the height of the wrapper. One card at a time. The arrow with nowhere to go fades out. */
export function CarouselArrows({ edge, prevClass, nextClass }: Props) {
  // One card at a time: the distance between the left edges of two neighbours.
  const step = (direction: 1 | -1, arrow: HTMLElement) => {
    const el = arrow.parentElement?.querySelector<HTMLElement>("[data-track]");
    const [first, second] = [el?.children[0], el?.children[1]] as (HTMLElement | undefined)[];
    if (!el || !first || !second) return;
    el.scrollBy({ left: direction * (second.offsetLeft - first.offsetLeft), behavior: "smooth" });
  };

  return (
    <>
      {([-1, 1] as const).map((direction) => {
        const Icon = direction === -1 ? ChevronLeftIcon : ChevronRightIcon;
        return (
          <button
            key={direction}
            type="button"
            onClick={(event) => step(direction, event.currentTarget)}
            disabled={direction === -1 ? edge.start : edge.end}
            className={`absolute top-1/2 z-10 hidden size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-light-grey text-near-black transition duration-200 ease-out hover:bg-light-grey-2 active:scale-95 disabled:cursor-default disabled:opacity-0 ${direction === -1 ? prevClass : nextClass}`}
            aria-label={direction === -1 ? "Previous bundles" : "Next bundles"}
          >
            <Icon size={8} />
          </button>
        );
      })}
    </>
  );
}
