"use client";

import Image from "next/image";
import { PRESS } from "@/lib/press-classes";
import type { MenuItem } from "./types";

type Props = {
  item: MenuItem;
  /** Fills its grid cell instead of holding the rail's width */
  fluid?: boolean;
  onOpen: (item: MenuItem) => void;
};

/** A dish: the whole card opens its recipe, photograph and name alike */
export function MealTile({ item, fluid = false, onOpen }: Props) {
  return (
    <button
      type="button"
      aria-label={`${item.name} — recipe details`}
      onClick={() => onOpen(item)}
      className={`block min-w-0 cursor-pointer p-0 text-left ${fluid ? "w-full" : "w-[165px] shrink-0"} ${PRESS} active:scale-[.97]`}
    >
      <span className="relative block aspect-square overflow-hidden rounded-2xl bg-light-grey">
        <Image src={item.image} alt="" fill sizes="165px" className="object-cover" />
        {/* the badge that says the card opens something; the card itself is the target */}
        <span className="absolute right-1 bottom-[4.5px] flex size-7 items-center justify-center rounded-[14px] bg-white/82 font-book-italic text-[15px] leading-none text-near-black backdrop-blur-[2px]">
          i
        </span>
      </span>
      <h4 className="mt-2 mb-0 text-base leading-[22px] font-normal tracking-[-0.32px] text-light-text">{item.name}</h4>
    </button>
  );
}
