"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import Image from "next/image";
import { ArrowLeftLongIcon, ArrowRightLongIcon, ChevronLeftIcon, ChevronRightIcon, PointerIcon } from "@/components/icons";
import type { MealExplore } from "@/providers/MealDetailProvider";

/** PROTOTYPE DEVIATION: ways to move between the meals of the list the modal was opened from. */

/** The meal one step away. Swipe stops at the ends like a story; the other modes wrap around. */
function neighbour(explore: MealExplore, dir: 1 | -1): number | null {
  const count = explore.items.length;
  const next = explore.index + dir;
  if (explore.mode === "swipe") return next >= 0 && next < count ? next : null;
  return (next + count) % count;
}

/**
 * Wires the modal's scroll area: arrow keys in every mode, a horizontal drag in swipe mode, and a short slide-in
 * whenever the meal changes. Spread `handlers` and attach `scrollRef` to the scroll container.
 */
export function useExploreNav(explore: MealExplore | undefined) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; horizontal: boolean } | null>(null);
  const swiped = useRef<boolean>(false);
  const prevIndex = useRef<number | undefined>(undefined);
  const index = explore?.index;

  useEffect(() => {
    if (!explore) return;
    const onKey = (e: KeyboardEvent) => {
      const next = e.key === "ArrowRight" ? neighbour(explore, 1) : e.key === "ArrowLeft" ? neighbour(explore, -1) : null;
      if (next !== null) explore.onGo(next);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [explore]);

  useEffect(() => {
    const prev = prevIndex.current;
    prevIndex.current = index;
    const el = scrollRef.current;
    if (prev === undefined || index === undefined || prev === index || !el) return;
    el.scrollTop = 0;
    el.animate([{ transform: `translateX(${index > prev ? 48 : -48}px)`, opacity: 0.4 }, { transform: "none", opacity: 1 }], { duration: 250, easing: "ease-out" });
  }, [index]);

  const release = (e: PointerEvent<HTMLDivElement>, commit: boolean): void => {
    const d = drag.current;
    const el = scrollRef.current;
    drag.current = null;
    if (!d?.horizontal || !el || !explore) return;
    swiped.current = true;
    el.style.transition = "transform 200ms ease-out";
    el.style.transform = "";
    const dx = e.clientX - d.x;
    if (!commit || Math.abs(dx) < 60) return;
    const next = neighbour(explore, dx < 0 ? 1 : -1);
    if (next !== null) explore.onGo(next);
  };

  const handlers =
    explore?.mode === "swipe"
      ? {
          onPointerDown: (e: PointerEvent<HTMLDivElement>) => {
            // Desktop moves between meals with the side cards instead.
            if (window.matchMedia("(min-width: 1024px)").matches) return;
            drag.current = { x: e.clientX, y: e.clientY, horizontal: false };
            swiped.current = false;
          },
          onPointerMove: (e: PointerEvent<HTMLDivElement>) => {
            const d = drag.current;
            const el = scrollRef.current;
            if (!d || !el) return;
            const dx = e.clientX - d.x;
            if (!d.horizontal) {
              if (Math.abs(dx) < 10 || Math.abs(dx) < Math.abs(e.clientY - d.y)) return;
              d.horizontal = true;
              el.setPointerCapture(e.pointerId);
            }
            el.style.transition = "none";
            el.style.transform = `translateX(${dx * 0.4}px)`;
          },
          onPointerUp: (e: PointerEvent<HTMLDivElement>) => release(e, true),
          onPointerCancel: (e: PointerEvent<HTMLDivElement>) => release(e, false),
          // A drag that ends on a button would otherwise also click it.
          onClickCapture: (e: React.MouseEvent) => {
            if (!swiped.current) return;
            e.stopPropagation();
            swiped.current = false;
          },
        }
      : {};

  return { scrollRef, handlers };
}

type Props = { explore: MealExplore };

/** Over the photo: tap zones on the left and right thirds, and the first-open hint. */
export function SwipeOverlay({ explore }: Props) {
  const { onGo } = explore;
  const go = (dir: 1 | -1): void => {
    const next = neighbour(explore, dir);
    if (next !== null) onGo(next);
  };
  return (
    <div className="lg:hidden">
      <button type="button" onClick={() => go(-1)} aria-label="Previous meal" className="absolute inset-y-0 left-0 w-1/3 cursor-pointer" />
      <button type="button" onClick={() => go(1)} aria-label="Next meal" className="absolute inset-y-0 right-0 w-1/3 cursor-pointer" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-dark/30 to-transparent" />
      {explore.showHint && <SwipeHint explore={explore} />}
    </div>
  );
}

/** A small preview of the gesture: the next meals slide past a finger. Goes after a few seconds or the first change of meal. */
function SwipeHint({ explore }: Props) {
  const [startIndex] = useState<number>(explore.index);
  const [timedOut, setTimedOut] = useState<boolean>(false);
  const stripRef = useRef<HTMLSpanElement>(null);
  const fingerRef = useRef<HTMLSpanElement>(null);
  const hidden = timedOut || explore.index !== startIndex;

  useEffect(() => {
    const timer = setTimeout(() => setTimedOut(true), 5000);
    const timing: KeyframeAnimationOptions = { duration: 1600, iterations: Infinity, easing: "ease-in-out" };
    const slide = stripRef.current?.animate([{ transform: "translateX(0)" }, { transform: "translateX(0)", offset: 0.15 }, { transform: "translateX(-28px)", offset: 0.7 }, { transform: "translateX(-28px)" }], timing);
    const finger = fingerRef.current?.animate([{ transform: "translateX(10px)", opacity: 0 }, { transform: "translateX(10px)", opacity: 1, offset: 0.15 }, { transform: "translateX(-10px)", opacity: 1, offset: 0.7 }, { transform: "translateX(-10px)", opacity: 0 }], timing);
    return () => {
      clearTimeout(timer);
      slide?.cancel();
      finger?.cancel();
    };
  }, []);

  return (
    <div className={`pointer-events-none absolute inset-x-0 bottom-4 flex justify-center transition-opacity duration-300 ${hidden ? "opacity-0" : "opacity-100"}`}>
      <div role="status" className="flex items-center gap-3 rounded-full bg-dark/85 py-2 pl-2.5 pr-4 text-white backdrop-blur-[2px]">
        <span className="relative block h-7 w-[52px] overflow-hidden rounded-lg">
          <span ref={stripRef} className="flex gap-1">
            {explore.items.slice(explore.index, explore.index + 3).map((item) => (
              <span key={item.id} className="relative block size-7 shrink-0 overflow-hidden rounded-lg bg-light-grey">
                <Image src={item.image} alt="" fill unoptimized className="object-cover" sizes="28px" />
              </span>
            ))}
          </span>
          <span ref={fingerRef} className="absolute inset-0 flex items-center justify-center opacity-0">
            <PointerIcon size={28} fill="#ffffff" />
          </span>
        </span>
        {/* TODO(lift): replace with translation key */}
        <span className="font-sans text-sm leading-[18px] tracking-[-0.28px]">Swipe to explore meals</span>
      </div>
    </div>
  );
}

/** Desktop: a small card either side of the modal previews the neighbouring meal; a tap moves to it. None past the ends. Goes inside the backdrop. */
export function ExploreSideCards({ explore }: Props) {
  const pill = (dir: 1 | -1) => {
    const next = neighbour(explore, dir);
    if (next === null) return null;
    const label = dir === 1 ? "Next" : "Previous";
    // Beside the modal (12px clear of its edge) from 1400px up; on narrower screens the pair sits under it.
    const place = dir === 1 ? "left-[calc(50%+min(570px,50vw-48px)+12px)] max-[1399px]:left-[calc(50%+4px)]" : "right-[calc(50%+min(570px,50vw-48px)+12px)] max-[1399px]:right-[calc(50%+4px)]";
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          explore.onGo(next);
        }}
        aria-label={`${label} meal: ${explore.items[next].title}`}
        className={`absolute top-1/2 z-10 hidden -translate-y-1/2 cursor-pointer items-center rounded-2xl bg-white p-2 text-near-black opacity-85 transition-opacity duration-200 hover:opacity-100 max-[1399px]:top-auto max-[1399px]:bottom-3 max-[1399px]:translate-y-0 lg:flex ${place}`}
      >
        {dir === -1 ? <ArrowLeftLongIcon size={16} /> : <ArrowRightLongIcon size={16} />}
      </button>
    );
  };
  return (
    <>
      {pill(-1)}
      {pill(1)}
    </>
  );
}

const DOCK = "absolute inset-x-4 bottom-4 z-10";

/** Thumbs mode: a floating dock with previous and next and round photos of every meal; the current one is ringed and kept in view. */
export function ExploreThumbs({ explore }: Props) {
  const { items, index, onGo } = explore;
  const stripRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);
  // Scroll only the strip: scrollIntoView would also scroll every ancestor, which moves the whole page when embedded.
  useEffect(() => {
    const strip = stripRef.current;
    const active = activeRef.current;
    if (!strip || !active) return;
    strip.scrollTo({ left: active.offsetLeft - (strip.clientWidth - active.offsetWidth) / 2, behavior: "smooth" });
  }, [index]);
  const arrow = "flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-light-grey";
  return (
    <div className={`${DOCK} flex items-center gap-1 rounded-full bg-white/95 p-1.5 shadow-[0_4px_16px_rgba(55,45,39,0.25)] backdrop-blur-[2px]`}>
      <button type="button" onClick={() => onGo(neighbour(explore, -1) ?? index)} aria-label="Previous meal" className={arrow}>
        <ChevronLeftIcon size={5} />
      </button>
      <div ref={stripRef} className="scrollbar-hide relative flex flex-1 gap-2 overflow-x-auto px-2 py-1">
        {items.map((item, i) => (
          <button
            key={item.id}
            ref={i === index ? activeRef : undefined}
            type="button"
            onClick={() => onGo(i)}
            aria-label={item.title}
            aria-current={i === index}
            className={`relative size-10 shrink-0 cursor-pointer overflow-hidden rounded-full bg-light-grey transition-opacity ${i === index ? "opacity-100 ring-2 ring-dark ring-offset-2" : "opacity-60"}`}
          >
            <Image src={item.image} alt="" fill unoptimized className="object-cover" sizes="40px" />
          </button>
        ))}
      </div>
      <button type="button" onClick={() => onGo(neighbour(explore, 1) ?? index)} aria-label="Next meal" className={arrow}>
        <ChevronRightIcon size={5} />
      </button>
    </div>
  );
}

/** Next mode: a floating teaser for the following meal; tapping it moves on. */
export function ExploreNext({ explore }: Props) {
  const next = neighbour(explore, 1) ?? 0;
  const item = explore.items[next];
  return (
    <button
      type="button"
      onClick={() => explore.onGo(next)}
      aria-label={`Next meal: ${item.title}`}
      className={`${DOCK} flex cursor-pointer items-center gap-3 rounded-full bg-dark p-1.5 pr-5 text-left text-white shadow-[0_4px_16px_rgba(55,45,39,0.35)]`}
    >
      <span className="relative size-11 shrink-0 overflow-hidden rounded-full bg-light-grey">
        <Image src={item.image} alt="" fill unoptimized className="object-cover" sizes="44px" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        {/* TODO(lift): replace with translation key */}
        <span className="font-sans text-xs leading-4 tracking-[-0.24px] text-white/65">Up next</span>
        <span className="truncate font-sans text-sm leading-[18px] tracking-[-0.28px]">{item.title}</span>
      </span>
      <ChevronRightIcon size={6} stroke="#ffffff" />
    </button>
  );
}
