"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/shared/Button";
import { Drawer } from "@/components/shared/Drawer";
import { ChevronLeftIcon, CloseIcon, PlusIcon } from "@/components/icons";
import { PRESS } from "@/lib/press-classes";
import { allergensIn } from "./copy";
import { MealActions } from "./MealActions";
import { MealCard } from "./MealCard";
import { RecipeDetail } from "./RecipeDetail";
import type { Products } from "./types";
import type { Meal } from "@/lib/recommendation";
import type { BoxLine } from "./useBox";

type Props = {
  open: boolean;
  /** Goes up by one each time the sheet should return to the grid, as after a swap */
  back: number;
  /** The place whose meal is playing out, in the grid */
  leaving: string | null;
  /** The place of a meal just added, which holds back its play-in until the sheet has scrolled to it */
  arriving: string | null;
  lines: BoxLine[];
  products: Products | null;
  imageOf: (meal: Meal) => string;
  slugOf: (meal: Meal) => string;
  /** The same two numbers on every card */
  statsOf: (meal: Meal) => string[];
  /** No swap button when there's nothing to swap to */
  canSwap: boolean;
  /** Products in the box (meals and add-ons), which set the quantity discount */
  items: number;
  allergens: string[];
  fallback: boolean;
  onQty: (line: BoxLine, qty: number) => void;
  onRemove: (line: BoxLine) => void;
  onSwap: (line: BoxLine) => void;
  onAdd: () => void;
  /** The swap or add choices are open over it, so Esc is theirs */
  covered: boolean;
  onClose: () => void;
};

/* the same round buttons and sliding pages as MealPicker, so going into a meal feels the same everywhere */
const ROUND_BUTTON = `absolute top-3.5 z-[3] flex size-8 cursor-pointer items-center justify-center rounded-full bg-white/92 text-near-black shadow-[0_1px_3px] shadow-near-black/14 ${PRESS}`;
const LAYER =
  "absolute inset-0 flex flex-col bg-white [transition:translate_420ms_var(--ease-swing),opacity_420ms_var(--ease-ui)]";

/**
 * Every meal in the box as a two-column grid, with Add an extra meal held at the foot. Opening one slides its
 * recipe in over the grid, in the same sheet, with how many and a swap at its foot; back returns to the grid.
 */
export function AllMeals({
  open,
  back,
  leaving,
  arriving,
  lines,
  products,
  imageOf,
  slugOf,
  statsOf,
  canSwap,
  items,
  allergens,
  fallback,
  onQty,
  onRemove,
  onSwap,
  onAdd,
  covered,
  onClose,
}: Props) {
  const [pageId, setPageId] = useState<string | null>(null);
  const [pageOn, setPageOn] = useState<boolean>(false);
  const [asking, setAsking] = useState<boolean>(false);
  const clearTimer = useRef<number | null>(null);
  const units = lines.reduce((n, item) => n + item.qty, 0);
  const line = lines.find((item) => item.id === pageId) ?? null;
  /* keeps showing the last meal while its page slides away */
  const [shown, setShown] = useState<BoxLine | null>(line);
  if (line && line !== shown) setShown(line);
  const meal = line ?? shown;

  const [backSeen, setBackSeen] = useState<number>(back);
  if (back !== backSeen) {
    setBackSeen(back);
    setPageOn(false);
  }

  const openPage = (id: string) => {
    if (clearTimer.current !== null) window.clearTimeout(clearTimer.current);
    setPageId(id);
    setPageOn(true);
  };
  const goBack = () => {
    setPageOn(false);
    clearTimer.current = window.setTimeout(() => setPageId(null), 460);
  };
  /* each opening starts on the grid: the page goes once the sheet is down */
  const close = () => {
    onClose();
    goBack();
  };
  /* a meal taken out of the box has no page to stay on */
  if (pageOn && !line) setPageOn(false);

  return (
    <Drawer
      open={open}
      title="Your meals"
      onClose={close}
      onEscape={() =>
        covered || asking ? undefined : pageOn ? goBack() : close()
      }
      size="max"
    >
      {!pageOn && (
        <span className="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-sm bg-light-grey-2" />
      )}
      <button
        type="button"
        onClick={goBack}
        aria-label="Back"
        className={`${ROUND_BUTTON} left-4 [transition:opacity_250ms_var(--ease-ui),scale_300ms_var(--ease-spring)] ${
          pageOn
            ? "pointer-events-auto scale-100 opacity-100"
            : "pointer-events-none scale-[.8] opacity-0"
        }`}
      >
        <ChevronLeftIcon size={7} stroke="currentColor" />
      </button>
      <button
        type="button"
        onClick={close}
        aria-label="Close"
        className={`${ROUND_BUTTON} right-4 active:scale-90`}
      >
        <CloseIcon size={22} />
      </button>

      <div className="relative flex-1 overflow-hidden">
        <div
          className={`${LAYER} ${pageOn ? "-translate-x-[26%] opacity-45" : "translate-x-0 opacity-100"}`}
        >
          <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pt-10 pb-8">
            {/* TODO(lift): replace with translation keys */}
            <h2 className="m-0 flex items-center justify-between gap-4 font-book text-[28px] leading-[30px] tracking-[-0.56px] text-dark">
              Your meals
              <span className="rounded-full bg-light-brown px-2 py-1 font-sans text-sm leading-[19px] tracking-[-0.28px] text-dark">
                {units} {units === 1 ? "meal" : "meals"}
              </span>
            </h2>
            <p className="mt-2 mb-0 text-sm leading-[18px] tracking-[-0.28px] text-light-text">
              Swap, add or remove meals below.
            </p>
            <ul className="m-0 mt-5 grid list-none grid-cols-2 gap-x-3 gap-y-6 p-0">
              {lines.map((item) => (
                <li key={`${item.id}:${item.meal.sku}`} className="flex">
                  <MealCard
                    line={item}
                    image={imageOf(item.meal)}
                    stats={statsOf(item.meal)}
                    leaving={leaving === item.id}
                    late={arriving === item.id}
                    onOpen={() => openPage(item.id)}
                  />
                </li>
              ))}
            </ul>
          </div>
          <div className="shrink-0 border-t border-light-grey bg-white px-6 pt-3 pb-5">
            <Button
              type="button"
              variant="dark"
              onClick={onAdd}
              sizeClassName="h-12 w-full px-6"
              className="justify-center gap-2.5 rounded-[30px] text-xs font-medium tracking-[1.8px] uppercase transition-[scale] duration-[240ms] ease-spring active:scale-[.975] active:duration-[90ms] active:ease-out"
            >
              <PlusIcon size={14} />
              {/* TODO(lift): replace with translation key */}
              <span>Add an extra meal</span>
            </Button>
          </div>
        </div>

        <div
          className={`${LAYER} ${pageOn ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="scrollbar-hide flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain">
            {meal && (
              <RecipeDetail
                item={{
                  name: meal.meal.name,
                  image: imageOf(meal.meal),
                  slug: slugOf(meal.meal),
                  qty: meal.qty,
                }}
                products={products}
                allergens={allergens}
                containing={allergensIn(meal.meal, allergens)}
                fallback={fallback}
              />
            )}
          </div>
          {meal && (
            <MealActions
              open={open && pageOn}
              name={meal.meal.name}
              qty={line?.qty ?? 0}
              canSwap={canSwap}
              onQty={(qty) => line && onQty(line, qty)}
              onRemove={() => line && onRemove(line)}
              onSwap={() => line && onSwap(line)}
              items={items}
              onAsking={setAsking}
            />
          )}
        </div>
      </div>
    </Drawer>
  );
}
