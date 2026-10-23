"use client";

import Image from "next/image";
import { ImageFallback } from "@/components/shared/ImageFallback";
import { PRESS } from "@/lib/press-classes";
import { SpiceBadge } from "./SpiceBadge";
import type { BoxLine } from "./useBox";

type Props = {
  line: BoxLine;
  image: string;
  /** The same two numbers on every card */
  stats: string[];
  /** Opens the meal, where it can be swapped and its count changed */
  onOpen: () => void;
};

/** A meal in the box: photo, name and two numbers. Everything you can do with it lives in its sheet */
export function MealCard({ line, image, stats, onOpen }: Props) {
  const { meal, qty, picked } = line;
  return (
    <button
      type="button"
      aria-label={`${meal.name}${qty > 1 ? `, ${qty} in your box` : ""} — details, swap or change how many`}
      onClick={onOpen}
      className={`block w-full min-w-0 cursor-pointer p-0 text-left ${PRESS} active:scale-[.97]`}
    >
      <span className={`relative block overflow-hidden rounded-2xl bg-light-grey aspect-square`}>
        {/* a new meal remounts this, so a swap plays in where it lands */}
        <span key={meal.sku} className={`absolute inset-0 block ${picked ? "animate-swap-in" : ""}`}>
          {image ? <Image src={image} alt="" fill sizes="165px" className="object-cover" /> : <ImageFallback />}
        </span>
        <SpiceBadge spice={meal.spice} />
        {qty > 1 && (
          <span className="absolute top-2 left-2 rounded-full bg-white/82 px-2 py-0.5 text-xs leading-4 font-medium tracking-[-0.24px] text-near-black backdrop-blur-[2px]">
            ×{qty}
          </span>
        )}
      </span>
      <span key={meal.sku} className={`mt-2 block ${picked ? "animate-swap-words-in" : ""}`}>
        <span className="flex items-baseline justify-between gap-2">
          <span className="min-w-0 text-base leading-[22px] tracking-[-0.32px] text-near-black">{meal.name}</span>
          <span className="shrink-0 text-xs leading-4 tracking-[-0.24px] text-dark" aria-label={`Rated ${meal.rating} out of 5`}>
            ★ {meal.rating.toFixed(1).replace(".", ",")}
          </span>
        </span>
        <span className="mt-0.5 block text-xs leading-4 tracking-[-0.24px] text-light-text">{stats.join(" · ")}</span>
      </span>
    </button>
  );
}
