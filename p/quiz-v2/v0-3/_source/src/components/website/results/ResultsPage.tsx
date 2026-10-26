"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/shared/Button";
import { PlusIcon } from "@/components/icons";
import { euro } from "@/lib/box-price";
import { statText } from "@/lib/meal-stats";
import { PRESS } from "@/lib/press-classes";
import type { Meal } from "@/lib/recommendation";
import { AddOns } from "./AddOns";
import { AllergenNote } from "./AllergenNote";
import { allergensOf } from "./copy";
import { FaqSection } from "./FaqSection";
import { FirstBoxPrice } from "./FirstBoxPrice";
import { heroTilesFor, nutrientsFor, tagsFor, tasteKeywords, type Framing } from "./framing";
import { MealCard } from "./MealCard";
import { MealPicker, type PickerMode } from "./MealPicker";
import { MealSheet } from "./MealSheet";
import { NutritionTiles } from "./NutritionTiles";
import { PromoBar } from "./PromoBar";
import { ResultsHero } from "./ResultsHero";
import { ResultsNav } from "./ResultsNav";
import { routineFor } from "./routine";
import { RoutineStory } from "./RoutineStory";
import { StatBar } from "./StatBar";
import { StickyCartBar } from "./StickyCartBar";
import type { MenuItem, ResultsPageProps } from "./types";
import { MIN_MEALS, useBox, type BoxLine } from "./useBox";
import { perWeek } from "./weeks";

/** The navigation is 72px tall: 16px padding around a 40px circle */
const NAV_HEIGHT = 72;
/** A swap waits for the sheets to be nearly down, then the old meal takes this long to leave */
const SHEETS_DOWN_MS = 480;
const SWAP_OUT_MS = 220;
/** When the box changes, the cards that stay glide to their new places over this long */
const REFLOW_MS = 420;

const H2 = "m-0 font-book text-[28px] leading-[30px] tracking-[-0.56px] text-dark";

/**
 * A, B and C share the quiz answers out over the hero headline, the hero's three numbers and the tags
 * under "What's in your box" a different way each (see framing.ts). Everything below is the same.
 */
export type Iteration = "A" | "B" | "C" | "D";

/**
 * The box the quiz made: what they told us and the box in brief, then every meal in it (each opens to
 * swap it or change how many), then the add-ons we recommend, then the price.
 */
export function ResultsPage({
  iteration = "A",
  answers,
  products,
  chrome,
  revealed,
  instant,
  cartCount,
  onAdd,
  onOpenRecipe,
  onPickerChange,
  onLogo,
}: ResultsPageProps & { iteration?: Iteration }) {
  const framing: Framing = iteration === "B" || iteration === "D" ? 2 : iteration === "C" ? 3 : 1;
  /* D is B with its three numbers under "What's in your box", and the nutrition as tiles after the meals */
  const numbersBelow = iteration === "D";
  const box = useBox(answers);
  const [picker, setPicker] = useState<PickerMode | null>(null);
  const [pickerOpen, setPickerOpen] = useState<boolean>(false);
  /** The meal whose sheet is open, by its place in the box; the item stays while the sheet closes */
  const [sheetId, setSheetId] = useState<string | null>(null);
  const [sheetItem, setSheetItem] = useState<MenuItem | null>(null);
  /** The place whose meal is on its way out during a swap */
  const [leaving, setLeaving] = useState<string | null>(null);
  const swapTimers = useRef<number[]>([]);
  const [navDark, setNavDark] = useState<boolean>(false);
  const [stickyIn, setStickyIn] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const promoRef = useRef<HTMLParagraphElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const buyRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  /** Where each card sat in the grid after the last change to the box */
  const cardSpots = useRef<Map<Element, { x: number; y: number }>>(new Map());

  /* Storyblok knows a dish by its slug, the engine by its SKU */
  const slugs = useMemo(() => {
    const map: Record<string, string> = {};
    Object.entries(products ?? {}).forEach(([slug, product]) => {
      if (product.sku) map[product.sku] = slug;
    });
    return map;
  }, [products]);
  const slugOf = (meal: Meal): string => slugs[meal.sku] ?? "";
  const imageOf = (meal: Meal): string => products?.[slugOf(meal)]?.image ?? "";

  const { lines, units, price, short } = box;
  const allergens = allergensOf(answers);
  const canSwap = box.recommendation.pool.length > 1;

  /*
   * The navigation reads whatever has scrolled under it. The cart bar waits for the hero to leave,
   * and stands down whenever the page's own Add to cart is on screen.
   */
  const check = () => {
    const scroller = scrollRef.current;
    const promo = promoRef.current;
    const hero = heroRef.current;
    const buy = buyRef.current;
    if (!scroller || !promo || !hero || !buy) return;
    const view = scroller.getBoundingClientRect();
    setNavDark(promo.getBoundingClientRect().bottom <= view.top + NAV_HEIGHT);
    const buyRect = buy.getBoundingClientRect();
    const heroGone = hero.getBoundingClientRect().bottom < view.top;
    setStickyIn(heroGone && !(buyRect.top < view.bottom && buyRect.bottom > view.top));
  };

  useEffect(() => () => swapTimers.current.forEach((timer) => window.clearTimeout(timer)), []);

  /*
   * When a meal leaves (or comes back with an undo), the cards around it glide from their old places
   * to the new ones rather than jump. Offsets within the grid, so scrolling doesn't count as a move
   */
  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const spots = new Map<Element, { x: number; y: number }>();
    Array.from(grid.children).forEach((child) => {
      const el = child as HTMLElement;
      const spot = { x: el.offsetLeft, y: el.offsetTop };
      spots.set(el, spot);
      const was = cardSpots.current.get(el);
      if (still || !was || (was.x === spot.x && was.y === spot.y)) return;
      el.animate([{ transform: `translate(${was.x - spot.x}px, ${was.y - spot.y}px)` }, { transform: "none" }], {
        duration: REFLOW_MS,
        easing: "cubic-bezier(0.32, 0.86, 0.24, 1)" /* --ease-swing */,
      });
    });
    cardSpots.current = spots;
  }, [lines]);

  useEffect(() => {
    const frame = requestAnimationFrame(check);
    return () => cancelAnimationFrame(frame);
  });

  /* Esc belongs to the page's own sheets while either is up */
  const showPicker = (open: boolean) => {
    setPickerOpen(open);
    onPickerChange(open || sheetItem !== null);
  };

  const sheetLine = lines.find((line) => line.id === sheetId) ?? null;
  const openMeal = (line: BoxLine) => {
    setSheetId(line.id);
    setSheetItem({ name: line.meal.name, image: imageOf(line.meal), slug: slugOf(line.meal), qty: line.qty });
    onPickerChange(true);
  };
  const closeMeal = () => {
    setSheetItem(null);
    onPickerChange(pickerOpen);
  };
  const sheetQty = (qty: number) => {
    if (sheetLine) setQty(sheetLine, qty);
  };
  const sheetRemove = () => {
    if (sheetLine) playOut(sheetLine, () => setQty(sheetLine, 0));
  };
  /* the choices open over the meal, so closing them goes back to it */
  const sheetSwap = () => {
    if (sheetLine) openPicker({ kind: "swap", line: sheetLine });
  };
  const openPicker = (mode: PickerMode) => {
    setPicker(mode);
    showPicker(true);
  };

  // TODO(lift): replace with translation keys
  const said = (message: string) => toast(message, { action: { label: "Undo", onClick: box.undo }, duration: 5000 });

  /*
   * A swap or a removal plays where the meal sits: both sheets go down, the card comes into view, the
   * meal draws back and dissolves, then the box changes. Without motion, it just changes.
   */
  const playOut = (line: BoxLine, finish: () => void) => {
    setSheetItem(null);
    setPickerOpen(false);
    onPickerChange(false);
    const done = () => {
      setLeaving(null);
      finish();
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return done();
    const card = scrollRef.current?.querySelector<HTMLElement>(`[data-line="${line.id}"]`);
    const view = scrollRef.current?.getBoundingClientRect();
    const rect = card?.getBoundingClientRect();
    if (card && view && rect && (rect.top < view.top + NAV_HEIGHT || rect.bottom > view.bottom)) {
      card.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    swapTimers.current.push(
      window.setTimeout(() => setLeaving(line.id), SHEETS_DOWN_MS),
      window.setTimeout(done, SHEETS_DOWN_MS + SWAP_OUT_MS),
    );
  };
  const playSwap = (line: BoxLine, meal: Meal) =>
    playOut(line, () => {
      box.swap(line, meal);
      said(`Swapped in ${meal.name}`);
    });

  const pick = (meal: Meal) => {
    if (!picker) return;
    if (picker.kind === "swap") {
      playSwap(picker.line, meal);
      return;
    } else {
      box.add(meal);
      said(`Added ${meal.name}`);
    }
    showPicker(false);
  };

  const setQty = (line: BoxLine, qty: number) => {
    box.setQty(line, qty);
    if (qty === 0) said(`Removed ${line.meal.name}`);
  };

  // TODO(lift): replace with translation keys
  const framed = tagsFor(framing, answers, box);
  /* A says the pace as a tag, straight after the diet: "5 meals / week" */
  const pace = `${perWeek(units).replace(" a week", "")} meals / week`;
  const tags = iteration === "A" ? [framed[0], pace, ...framed.slice(1)] : framed;
  const needMore = `Add ${short} more meal${short === 1 ? "" : "s"} to check out — the minimum is ${MIN_MEALS}.`;
  const summary = short ? `${units} meals · add ${short} more` : `${units} meals · ${euro(price.total)}`;

  return (
    <div className="absolute inset-0">
      <ResultsNav visible={chrome} dark={navDark} cartCount={cartCount} onLogo={onLogo} />
      <div
        ref={scrollRef}
        onScroll={check}
        className="scrollbar-hide absolute inset-0 overflow-x-hidden overflow-y-auto overscroll-contain"
      >
        <div className="min-h-full bg-white pb-[120px]">
          <PromoBar ref={promoRef} />
          <ResultsHero
            ref={heroRef}
            box={box}
            allergens={allergens}
            revealed={revealed}
            instant={instant}
            framing={framing}
            answers={answers}
            showTiles={!numbersBelow}
          />
          {/* A explains the box before it shows it: what matters for their goal, and how we picked for it */}
          {iteration === "A" && (
            <RoutineStory
              routine={routineFor(box.engine.goal, answers)}
              lines={lines}
              onSheetChange={(open) => onPickerChange(open || pickerOpen || sheetItem !== null)}
            />
          )}

          <section className="mx-6 pt-12">
            {/* TODO(lift): replace with translation keys */}
            <h2 className={`${H2} flex items-baseline justify-between gap-4`}>
              What&rsquo;s in your box
              <span className="font-sans text-sm leading-[18px] tracking-[-0.28px] text-light-text">{units} meals</span>
            </h2>
            <AllergenNote allergens={allergens} fallback={box.recommendation.fallback} />
            {numbersBelow ? (
              <div className="mt-4">
                <StatBar tiles={heroTilesFor(framing, answers, box)} tone="page" />
              </div>
            ) : (
            <ul className="m-0 mt-4 flex list-none flex-wrap gap-2 p-0">
              {tags.map((tag) => (
                <li
                  key={tag}
                  className="flex items-center gap-1.5 rounded-full border border-light-grey-3 px-3 py-1.5 text-xs leading-4 tracking-[-0.24px] text-dark"
                >
                  <span aria-hidden className="text-[11px] leading-none">
                    ✓
                  </span>
                  {tag}
                </li>
              ))}
            </ul>
            )}
            <div ref={gridRef} className="mt-5 grid grid-cols-2 gap-x-3 gap-y-6">
              {lines.map((line) => (
                <MealCard
                  key={`${line.id}:${line.meal.sku}`}
                  line={line}
                  image={imageOf(line.meal)}
                  stats={box.stats.map((stat) => statText(line.meal, stat))}
                  cuisines={box.engine.cuisines}
                  leaving={leaving === line.id}
                  onOpen={() => openMeal(line)}
                />
              ))}
              <button
                type="button"
                onClick={() => openPicker({ kind: "add" })}
                className={`col-span-2 flex h-12 cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-light-grey-3 bg-off-white p-0 text-dark ${PRESS} active:scale-[.98]`}
              >
                <PlusIcon size={14} />
                {/* TODO(lift): replace with translation key */}
                <span className="text-sm leading-[18px] tracking-[-0.28px] text-dark">Add a meal</span>
              </button>
            </div>
            {numbersBelow && (
              <div className="mt-6">
                <NutritionTiles lines={lines} nutrients={nutrientsFor(answers, box.engine)} />
              </div>
            )}
          </section>

          <div className="mt-14">
            <AddOns box={box} products={products} onOpen={onOpenRecipe} />
          </div>

          <section ref={buyRef} className="mx-6 mt-14 flex flex-col gap-4">
            {/* TODO(lift): replace with translation key */}
            <h2 className={H2}>Your first box</h2>
            <FirstBoxPrice box={box} />
            {short > 0 && <p className="m-0 text-sm leading-[18px] tracking-[-0.28px] text-dark">{needMore}</p>}
            <Button
              type="button"
              variant="dark"
              onClick={() => onAdd(units)}
              disabled={short > 0}
              aria-label="Add to cart"
              sizeClassName="h-12"
              className="w-full justify-center rounded-[30px] text-xs font-medium tracking-[1.8px] uppercase transition-[scale,opacity] duration-[240ms] ease-spring active:scale-[.975] active:duration-[90ms] active:ease-out disabled:cursor-not-allowed disabled:opacity-40"
            >
              {/* TODO(lift): replace with translation key */}
              Add to cart · {euro(price.total)}
            </Button>
          </section>

          <div className="mt-6">
            <FaqSection />
          </div>
        </div>
      </div>
      <StickyCartBar visible={stickyIn} summary={summary} disabled={short > 0} onAdd={() => onAdd(units)} />
      <MealSheet
        open={sheetItem !== null}
        line={sheetLine}
        item={sheetItem}
        products={products}
        canSwap={canSwap}
        onQty={sheetQty}
        onRemove={sheetRemove}
        covered={pickerOpen}
        onSwap={sheetSwap}
        onClose={closeMeal}
      />
      <MealPicker
        open={pickerOpen}
        mode={picker}
        box={box}
        products={products}
        taste={tasteKeywords(answers, box.engine, allergens)}
        slugOf={slugOf}
        onPick={pick}
        onClose={() => showPicker(false)}
      />
    </div>
  );
}
