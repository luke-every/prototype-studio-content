"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type UIEvent } from "react";
import { CloseFilledIcon, EveIcon } from "@/components/icons";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { MODAL_EXIT_MS, useModalExit } from "@/hooks/useModalExit";
import { useModalFocusTrap } from "@/hooks/useModalFocusTrap";
import { ExploreSideCards } from "@/components/shared/modals/MealExplore";
import { MealDetailModal, prefetchMealDetail } from "@/components/shared/modals/MealDetailModal";
import type { MealDetailOpts } from "@/providers/MealDetailProvider";
import { BundleMealGrid } from "./BundleMealGrid";
import type { BundleMeal } from "./types";

type Props = {
  open: boolean;
  meals: BundleMeal[];
  onClose: () => void;
  /** Options for the recipe page opened inside the modal (photo, description overrides, …) */
  mealOpts: (meal: BundleMeal) => MealDetailOpts;
  /** Swipe between the recipes of the open menu, with the first-open hint */
  swipe?: boolean;
};

type Page = { meal: BundleMeal; opts: MealDetailOpts };

// TODO(lift): fake meal counts — production boxes are 20 and 20+
const COUNTS = [20, 22];

// Close button: 24px from the top, 32px square, 24px from the right. The toggle clears it by 8px once it is pinned.
const CLOSE_CLEARANCE = 24 + 32 + 8;

// iOS push: the menu slides back a third of the way and dims while the recipe slides in over it.
const PUSH_MS = 400;
const PUSH_EASE = "cubic-bezier(0.32, 0.72, 0, 1)";

/** The full menu as the page's outlined grid, with an iOS-style switcher for the number of meals. A tapped recipe pushes in as a page. */
export function MenuModal({ open, meals, onClose, mealOpts, swipe = false }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState<number>(1);
  const toggleRef = useRef<HTMLDivElement>(null);
  const [nearClose, setNearClose] = useState<boolean>(false);
  // The page stays mounted through the back animation, so `page` and `pushed` are separate.
  const [page, setPage] = useState<Page | null>(null);
  const [pushed, setPushed] = useState<boolean>(false);

  const back = useCallback((): void => {
    setPushed(false);
    setTimeout(() => setPage(null), PUSH_MS);
  }, []);

  // Escape goes back a page before it closes the modal. Held in a ref so the focus trap's effect doesn't re-run (and refocus) on every render.
  const escapeRef = useRef<() => void>(onClose);
  useEffect(() => {
    escapeRef.current = pushed ? back : onClose;
  });
  const handleEscape = useCallback((): void => escapeRef.current(), []);

  useModalFocusTrap(open, dialogRef, handleEscape);
  useBodyScrollLock(open);

  // Same enter/exit as the meal modal: stay mounted for the 240ms exit animation.
  const [rendered, setRendered] = useState<boolean>(false);
  const [closing, setClosing] = useState<boolean>(false);
  const backdropRef = useRef<HTMLDivElement>(null);
  useModalExit(closing, backdropRef, dialogRef);

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setClosing(false);
      setRendered(true);
      // Warm every recipe's data and hero photo now, top to bottom, so a tap pushes a finished page rather than a loading one.
      meals.forEach((m) => prefetchMealDetail(m.handle, "en", mealOpts(m).imageOverride));
      return;
    }
    setClosing(true);
    const timer = setTimeout(() => {
      setRendered(false);
      setClosing(false);
      setPage(null);
      setPushed(false);
    }, MODAL_EXIT_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- prefetch once per open, not whenever the list changes
  }, [open]);

  // TODO(lift): fake first-open check — production remembers it in localStorage
  const hintShown = useRef<boolean>(false);
  // Every dish is listed whichever box is picked; with the smaller one the breakfasts and snacks are marked as only in the bigger box.
  const shown = meals;
  // TODO(lift): replace with translation key
  const tagFor = (meal: BundleMeal): string | undefined => (index === 0 && meal.section !== "Main meals" ? `Only in ${COUNTS[1]} meal bundle` : undefined);

  const pageFor = (i: number, showHint: boolean): Page => {
    const opts = mealOpts(shown[i]);
    const items = shown.map((m) => ({ id: m.id, handle: m.handle, title: m.title, image: mealOpts(m).heroImage ?? m.image, previewImage: mealOpts(m).imageOverride }));
    return {
      meal: shown[i],
      opts: {
        ...opts,
        heroImage: undefined,
        explore: swipe ? { mode: "swipe", items, index: i, showHint, onGo: (next) => setPage(pageFor(next, false)) } : undefined,
      },
    };
  };

  // Once the toggle is within 8px of the close button's bottom edge, it makes room beside it.
  const handleScroll = (e: UIEvent<HTMLDivElement>): void => {
    const toggle = toggleRef.current;
    if (!toggle) return;
    setNearClose(toggle.getBoundingClientRect().top - e.currentTarget.getBoundingClientRect().top <= CLOSE_CLEARANCE);
  };

  const push = (meal: BundleMeal): void => {
    setPage(pageFor(shown.findIndex((m) => m.id === meal.id), swipe && !hintShown.current));
    hintShown.current = true;
    // One frame at the off-screen position first, so the slide has somewhere to start from.
    requestAnimationFrame(() => requestAnimationFrame(() => setPushed(true)));
  };

  if (!rendered) return null;

  return (
    <div ref={backdropRef} className="drawer-backdrop-enter fixed inset-0 z-50 bg-[rgba(30,30,30,0.55)] backdrop-blur-[2px]" onClick={onClose}>
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Perfect Portions Menu"
        onClick={(e) => e.stopPropagation()}
        className={`drawer-panel-enter fixed inset-x-0 bottom-0 h-[94dvh] w-full overflow-hidden rounded-t-[28px] bg-white outline-none lg:inset-0 lg:m-auto lg:h-[min(677px,94dvh)] lg:w-[min(1140px,calc(100vw-96px))] lg:rounded-[28px]`}
      >
        <div
          className="absolute inset-0 flex flex-col"
          style={{ transform: pushed ? "translateX(-30%)" : "translateX(0)", transition: `transform ${PUSH_MS}ms ${PUSH_EASE}` }}
          inert={page ? true : undefined}
        >
          {/* One scroll area: the heading scrolls away under the sticky close button, and the meal toggle pins to the top */}
          <div onScroll={handleScroll} className="min-h-0 flex-1 overflow-y-auto bg-white px-4 pb-8 lg:grid lg:grid-cols-2 lg:content-start lg:gap-x-2 lg:px-10 lg:pb-10">
            <div className="flex flex-col gap-2 px-2 pt-10 lg:px-0">
              {/* TODO(lift): replace with translation key */}
              <h2 className="pr-12 font-book text-[28px] leading-8 tracking-[-0.56px] text-dark">Perfect Portions Menu</h2>
              <div className="flex items-center gap-4">
                {/* TODO(lift): replace with translation key */}
                <p className="font-sans text-base leading-[22px] tracking-[-0.32px] text-light-text lg:text-sm lg:leading-[19px] lg:tracking-[-0.28px]">Designed to help keep you full, without overcomplicating the calories. All meals balanced, made from whole foods.</p>
                <EveIcon size={56} className="shrink-0 text-dark lg:hidden" />
              </div>
            </div>
            <div
              ref={toggleRef}
              className="sticky top-0 z-10 -mx-4 bg-white py-4 pl-4 pr-(--toggle-pr) transition-[padding] duration-200 lg:static lg:mx-0 lg:self-end lg:bg-transparent lg:px-0 lg:py-0"
              style={{ "--toggle-pr": `${nearClose ? CLOSE_CLEARANCE : 16}px` } as CSSProperties}
            >
              <div role="tablist" aria-label="Number of meals" className="relative flex rounded-full border border-dark/6 bg-white p-1">
                <span
                  aria-hidden
                  className="absolute inset-y-1 left-1 w-[calc((100%-8px)/2)] rounded-full bg-dark transition-transform duration-200"
                  style={{ transform: `translateX(${index * 100}%)` }}
                />
                {COUNTS.map((count, i) => (
                  <button
                    key={count}
                    type="button"
                    role="tab"
                    aria-selected={i === index}
                    onClick={() => setIndex(i)}
                    className={`relative z-10 flex-1 cursor-pointer py-2.5 font-sans text-base leading-[22px] tracking-[-0.32px] transition-colors duration-200 ${i === index ? "text-white" : "text-dark"}`}
                  >
                    {/* TODO(lift): replace with translation key */}
                    {count} meals
                  </button>
                ))}
              </div>
            </div>
            {/* TODO(lift): fake box contents — the real menu changes per box size; here the first N meals show */}
            <div className="lg:col-span-2 lg:pt-8">
              <BundleMealGrid meals={shown} card="outlined" perPage={6} showAll flush tagFor={tagFor} onSelectMeal={push} />
            </div>
          </div>

          {/* Dims as the recipe covers it */}
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-dark/20" style={{ opacity: pushed ? 1 : 0, transition: `opacity ${PUSH_MS}ms ${PUSH_EASE}` }} />
        </div>

        {page && (
          <div
            className="absolute inset-0 flex flex-col bg-[#fafaf8] shadow-[-8px_0_24px_rgba(0,0,0,0.12)]"
            style={{ transform: pushed ? "translateX(0)" : "translateX(100%)", transition: `transform ${PUSH_MS}ms ${PUSH_EASE}` }}
          >
            <MealDetailModal productId="" slug={page.meal.handle} locale="en" inline opts={page.opts} onClose={back} />
          </div>
        )}
        {/* Outside both pages so it never moves: it closes the whole modal, from the menu or from a recipe */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className={`absolute right-6 top-6 z-20 lg:right-4 lg:top-4 flex size-8 cursor-pointer items-center justify-center rounded-2xl transition-colors duration-[400ms] ${pushed ? "bg-white/85" : "bg-[#eeeae6]/85"}`}
        >
          <span className="relative flex size-4 items-center justify-center">
            <CloseFilledIcon size={10} />
          </span>
        </button>
      </div>
      {pushed && page?.opts.explore && <ExploreSideCards explore={page.opts.explore} />}
    </div>
  );
}
