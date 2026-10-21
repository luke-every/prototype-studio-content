"use client";

import Image from "next/image";
import type { BundleMeal } from "./types";

type Props = {
  meals: BundleMeal[];
  onSelectMeal?: (meal: BundleMeal) => void;
};

// TODO(lift): sample data — dish type shelves in order, from the product's base_filter
const DISH_TYPES: { heading: string; bases: string[] }[] = [
  { heading: "Pasta & noodles", bases: ["Pasta/Noodles"] },
  { heading: "Rice & curries", bases: ["Rice"] },
  { heading: "Bowls, beans & grains", bases: [] },
];

const SHELF_ORDER = ["Breakfast", "Main meals", "Snacks"];
const shelfRank = (heading: string): number => {
  const index = SHELF_ORDER.indexOf(heading);
  return index === -1 ? SHELF_ORDER.length : index;
};

function dishType(meal: BundleMeal): string {
  return (DISH_TYPES.find((type) => meal.base && type.bases.includes(meal.base)) ?? DISH_TYPES[DISH_TYPES.length - 1]).heading;
}

/**
 * The quiz results page's shelf system: one horizontally scrolling row per product type, in the order the sections first appear.
 * A box that is only one section (just meals) is split by dish type instead.
 */
export function BundleMealShelves({ meals, onSelectMeal }: Props) {
  const bySection = (key: (meal: BundleMeal) => string): Map<string, BundleMeal[]> => {
    const grouped = new Map<string, BundleMeal[]>();
    meals.forEach((meal) => grouped.set(key(meal), [...(grouped.get(key(meal)) ?? []), meal]));
    return grouped;
  };
  const sections = bySection((meal) => meal.section ?? "");
  const shelves = sections.size === 1 ? bySection(dishType) : sections;
  const unordered = sections.size === 1 ? DISH_TYPES.flatMap(({ heading }) => (shelves.has(heading) ? [[heading, shelves.get(heading)!] as const] : [])) : Array.from(shelves);
  // Shelf order is fixed here, whatever order the meals arrive in: breakfast, main meals, snacks.
  const ordered = sections.size === 1 ? unordered : [...unordered].sort(([a], [b]) => shelfRank(a) - shelfRank(b));

  return (
    <div className="flex flex-col gap-4">
      {ordered.map(([heading, items]) => (
        <div key={heading}>
          {heading && (
            <p className="mb-3 px-6 font-sans text-base leading-[22px] tracking-[-0.32px] text-near-black md:px-8 lg:px-0">{heading}</p>
          )}
          <div className="scrollbar-hide flex scroll-pl-6 items-start gap-3 overflow-x-auto px-6 md:px-8 lg:px-0">
            {items.map((meal) => (
              <button
                key={meal.id}
                type="button"
                onClick={() => onSelectMeal?.(meal)}
                aria-label={`View details for ${meal.title}`}
                className="block w-[165px] min-w-0 shrink-0 cursor-pointer p-0 text-left transition-[scale] duration-200 active:scale-[.97]"
              >
                <span className="relative block aspect-square overflow-hidden rounded-2xl bg-light-grey">
                  <Image src={meal.image} alt="" fill sizes="165px" className="object-cover" />
                  <span className="absolute right-1 bottom-[4.5px] flex size-7 items-center justify-center rounded-[14px] bg-white/82 font-book-italic text-[15px] leading-none text-near-black backdrop-blur-[2px]">
                    i
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
