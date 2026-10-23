"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { InfoIcon } from "@/components/icons";
import type { BundleMeal } from "./types";

type Props = {
  meals: BundleMeal[];
  /** What a tile click does, e.g. open a meal modal. */
  onSelectMeal?: (meal: BundleMeal) => void;
  /** "circle": light brown card with a round photo, the name and the calories underneath. "outlined": the same card with no background or rounding, joined into a bordered grid (perPage 6) */
  card?: "image" | "circle" | "outlined";
  /** Pages fill the screen minus 16px each side (default leaves 24px on the right) */
  wide?: boolean;
  /** Cards per page: 4 is the 2×2 grid, 1 features one meal at a time, 6 is a static 2×3 grid of the first six with no carousel */
  perPage?: 1 | 4 | 6;
  /** The line under the name on the circle card: calories (default) or the key ingredients */
  cardDetail?: "kcal" | "ingredients";
  /** perPage 6, outlined: the last row is cut in half and fades to white, as a teaser for the full menu */
  preview?: boolean;
  /** perPage 6: show every meal instead of the first six */
  showAll?: boolean;
  /** perPage 6, preview: the opaque colour the page behind the grid shows, which the fade ends in (default white) */
  fadeColor?: string;
  /** A pill under the name, e.g. "Only in 22 meal bundle"; none when it returns undefined */
  tagFor?: (meal: BundleMeal) => string | undefined;
  /** perPage 6: no side padding, for use inside something that already has its own */
  flush?: boolean;
};

type FeaturedProps = {
  meals: BundleMeal[];
  tile: (meal: BundleMeal, index: number) => React.ReactNode;
};

/**
 * One meal at a time: smaller pages that centre as you swipe so the neighbours peek on both sides, with the cards that
 * are not in focus scaled down and faded. The first card stays left-aligned with the content (its leading spacer is the
 * only snap point at the start), and the trailing spacer leaves room for the last card to centre too.
 */
function FeaturedMealCarousel({ meals, tile }: FeaturedProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number>(0);

  // Each card has a scroll position where it is "in focus": 0 for the first (left-aligned), centred for the rest.
  // The active card is the one whose position is nearest the current scroll.
  const handleScroll = () => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const cards = Array.from(scroller.children).slice(1, -1) as HTMLElement[];
    const anchors = cards.map((card, i) => (i === 0 ? 0 : card.offsetLeft + card.offsetWidth / 2 - scroller.clientWidth / 2));
    const nearest = anchors.reduce((best, anchor, i) => (Math.abs(anchor - scroller.scrollLeft) < Math.abs(anchors[best] - scroller.scrollLeft) ? i : best), 0);
    setActive(nearest);
  };

  return (
    <div className="w-auto overflow-hidden">
      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        className="flex snap-x snap-mandatory gap-2 overflow-x-auto [--w:min(calc(100vw-96px),300px)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:[--w:300px]"
      >
        <div className="w-4 shrink-0 snap-start lg:-mr-2 lg:w-0" />
        {meals.map((meal, i) => (
          <div
            key={`${meal.id}-${i}`}
            className={`w-[var(--w)] shrink-0 transition-[scale,opacity] duration-300 ${i === 0 ? "snap-align-none" : "snap-center"} ${
              i === active ? "scale-100 opacity-100" : "scale-[.92] opacity-50"
            }`}
          >
            {tile(meal, i)}
          </div>
        ))}
        <div className="w-[calc((100%-var(--w))/2-8px)] shrink-0" />
      </div>
    </div>
  );
}

export function BundleMealGrid({ meals, onSelectMeal, card = "image", wide = false, perPage = 4, cardDetail = "kcal", preview = false, showAll = false, fadeColor = "#FFFFFF", tagFor, flush = false }: Props) {
  // True once hydrated. The server-rendered HTML can't know whether the products are cached (they are read on the client, before the
  // first paint), so the placeholders stay invisible until then: the skeleton only ever shows when there is no data to show.
  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  // The meals arrive after the page: until they do, the 2×3 grid holds six pulsing placeholders.
  const loading = meals.length === 0 && perPage === 6 && card !== "image";
  if (meals.length === 0 && !loading) return null;

  const outlined = card === "outlined";
  const shown: (BundleMeal | undefined)[] = loading ? Array.from({ length: 6 }) : perPage === 6 && !showAll ? meals.slice(0, flush ? 6 : 8) : meals;
  // Outlined tiles share their edges: each draws only its right and bottom line, and the last row skips the bottom one.
  // Below desktop the preview is six meals, two across; the seventh and eighth only show on desktop.
  const mobileCount = !flush && perPage === 6 && !showAll ? Math.min(shown.length, 6) : shown.length;
  const lastRowStart = mobileCount - (mobileCount % 2 || 2);
  // Desktop: the preview page is four across (two rows of four), uncut. The menu modal stays narrow, so it keeps two.
  const fourWide = perPage === 6;
  const lastRowStart4 = shown.length - (shown.length % 4 || 4);

  const circleTile = (meal: BundleMeal | undefined, index: number) => {
    const className = `${index >= mobileCount ? "max-lg:hidden " : ""}flex w-full flex-col ${perPage === 1 ? "gap-4" : "gap-2 lg:gap-4"} text-left ${
      outlined
        ? `border-dark/6 px-3 pt-3 pb-4 ${fourWide && !flush ? "lg:px-6 lg:pt-6 lg:pb-7" : ""} ${index % 2 === 1 ? "" : "border-r"} ${index < lastRowStart ? "border-b" : preview ? "overflow-hidden" : ""} ${
            fourWide ? `${index % 4 === 3 ? "lg:border-r-0" : "lg:border-r"} ${index < lastRowStart4 ? "lg:border-b" : "lg:border-b-0"}` : ""
          }`
        : `rounded-[18px] bg-light-brown ${perPage === 1 ? "p-6" : "px-[10px] pt-3 pb-4"}`
    }`;
    if (!meal) {
      return (
        <div key={index} aria-hidden className={`${className} ${hydrated ? "animate-pulse" : "invisible"}`}>
          <span className="block aspect-square w-full rounded-full bg-light-grey" />
          <span className="flex flex-col gap-1.5 px-1 pt-1">
            <span className="h-[15px] w-3/4 rounded-full bg-light-grey" />
            <span className="h-3 w-1/3 rounded-full bg-light-grey" />
          </span>
        </div>
      );
    }
    return (
    <button
      key={`${meal.id}-${index}`}
      type="button"
      onClick={() => onSelectMeal?.(meal)}
      aria-label={`View details for ${meal.title}`}
      className={`cursor-pointer ${className}`}
    >
      <span className={`relative block aspect-square w-full shrink-0 overflow-hidden bg-light-grey ${meal.section && meal.section !== "Main meals" ? "rounded-[18px]" : "rounded-full"}`}>
        <Image src={meal.image} alt="" fill loading="eager" className="object-cover" sizes="240px" />
      </span>
      <span className={`flex flex-col gap-0.5 ${perPage === 1 ? "" : "px-1"}`}>
        <span className={`font-sans text-dark ${perPage === 1 ? "text-base leading-[22px] tracking-[-0.32px]" : "text-[14px] leading-[19px] tracking-[-0.28px] lg:text-base lg:leading-[22px] lg:tracking-[-0.32px]"}`}>{meal.title}</span>
        {(() => {
          const text = cardDetail === "ingredients" ? meal.keyIngredients?.join(" • ") : meal.kcal !== undefined ? `${meal.kcal} kcal` : undefined;
          return (
            text && (
              <span className={`font-sans text-light-text ${perPage === 1 ? "text-[14px] leading-[19px] tracking-[-0.28px]" : "text-xs leading-4 tracking-[-0.24px] lg:text-[14px] lg:leading-[19px] lg:tracking-[-0.28px]"}`}>{text}</span>
            )
          );
        })()}
        {tagFor?.(meal) && (
          <span className="-ml-1 mt-1.5 self-start rounded-full bg-off-white px-2 py-0.5 font-sans text-xs leading-4 tracking-[-0.24px] text-dark">{tagFor(meal)}</span>
        )}
      </span>
    </button>
    );
  };

  const imageTile = (meal: BundleMeal | undefined, index: number) => meal && (
    <button
      key={`${meal.id}-${index}`}
      type="button"
      onClick={() => onSelectMeal?.(meal)}
      aria-label={`View details for ${meal.title}`}
      className="group relative aspect-square cursor-pointer overflow-hidden rounded-[18px] bg-light-grey"
    >
      <Image src={meal.image} alt={meal.title} fill className="object-cover" sizes="240px" />
      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-[rgba(55,45,39,0.65)] to-[rgba(55,45,39,0)] to-55% p-2.5 opacity-0 transition-opacity group-hover:opacity-100">
        <span className="font-sans text-xs font-medium text-light-grey">{meal.title}</span>
      </div>
      <div className="absolute bottom-2 right-2 flex size-7 items-center justify-center rounded-full bg-white/[0.82] backdrop-blur-[2px]">
        <InfoIcon className="h-3.5 w-3.5 text-dark" />
      </div>
    </button>
  );

  const tile = card === "image" ? imageTile : circleTile;

  if (perPage === 1) return <FeaturedMealCarousel meals={meals} tile={tile as (meal: BundleMeal, index: number) => React.ReactNode} />;

  if (perPage === 6) {
    const frame = outlined
      ? `grid grid-cols-2 overflow-hidden rounded-[18px] border border-dark/6 ${fourWide ? "lg:grid-cols-4" : ""} ${preview ? `grid-rows-[auto_auto_calc(25cqw_+_22px)] rounded-b-none border-b-0 ${fourWide ? "lg:grid-rows-none lg:rounded-b-[18px] lg:border-b" : ""}` : ""}`
      : "grid grid-cols-2 gap-2";
    return (
      <div className={flush ? "" : wide ? "px-4 lg:px-0" : "px-6 md:px-8 lg:px-0"}>
        <div className="@container relative">
          <div className={frame}>{shown.map(tile)}</div>
          {preview && <div aria-hidden className={`pointer-events-none absolute inset-x-0 bottom-0 h-[116px] ${fourWide ? "lg:hidden" : ""}`} style={{ backgroundImage: `linear-gradient(to bottom, ${fadeColor}00, ${fadeColor})` }} />}
        </div>
      </div>
    );
  }

  const pages: BundleMeal[][] = [];
  for (let i = 0; i < meals.length; i += 4) pages.push(meals.slice(i, i + 4));

  return (
    <div className="w-auto overflow-hidden">
      <div className={`flex snap-x snap-mandatory gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${wide ? "scroll-pl-4" : ""}`}>
        <div className={`shrink-0 snap-start ${wide ? "w-2 max-w-2" : "w-4 max-w-4 lg:hidden"}`} />
        {pages.map((page, i) => (
          <div key={i} className={`grid ${wide ? "w-[calc(100vw-32px)] max-w-[392px]" : "w-[calc(100vw-48px)] max-w-[360px]"} shrink-0 snap-start grid-cols-2 grid-rows-2 gap-2 lg:w-[480px] lg:max-w-[480px]`}>
            {page.map(tile)}
          </div>
        ))}
        <div className={`shrink-0 snap-start ${wide ? "w-2 max-w-2" : "w-4 max-w-4 lg:hidden"}`} />
      </div>
    </div>
  );
}
