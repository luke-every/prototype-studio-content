"use client";

import Image from "next/image";
import { ImageFallback } from "@/components/shared/ImageFallback";
import { PRESS } from "@/lib/press-classes";
import { MealBadges } from "./MealBadges";
import type { BoxLine } from "./useBox";

type Props = {
  line: BoxLine;
  image: string;
  /** The same two numbers on every card */
  stats: string[];
  /** Being swapped out: it draws back and dissolves before the new meal takes its place */
  leaving?: boolean;
  /** Opens the meal, where it can be swapped and its count changed */
  onOpen: () => void;
};

/** A meal in the box: photo, name and two numbers. Everything you can do with it lives in its sheet */
export function MealCard({
  line,
  image,
  stats,
  leaving = false,
  onOpen,
}: Props) {
  /* the whole card moves in a swap; the page remounts it for a new meal, so the new one plays in */
  const motion = leaving
    ? "animate-swap-out"
    : line.picked
      ? "animate-swap-in"
      : "";
  const { meal, qty } = line;
  return (
    <button
      type="button"
      aria-label={`${meal.name}${qty > 1 ? `, ${qty} in your box` : ""} — details, swap or change how many`}
      onClick={onOpen}
      data-line={line.id}
      className={`block w-full min-w-0 cursor-pointer self-start p-0 text-left ${PRESS} active:scale-[.97] ${motion}`}
    >
      <span className="relative block aspect-square overflow-hidden rounded-2xl bg-light-grey">
        <span className="absolute inset-0 block">
          {image ? (
            <Image
              src={image}
              alt=""
              fill
              sizes="165px"
              className="object-cover"
            />
          ) : (
            <ImageFallback />
          )}
        </span>
        <MealBadges meal={meal} />
        {qty > 1 && (
          <span className="absolute top-2 left-2 rounded-full bg-white/82 px-2 py-0.5 text-xs leading-4 font-medium tracking-[-0.24px] text-near-black backdrop-blur-[2px]">
            ×{qty}
          </span>
        )}
      </span>
      <span className="mt-2 block">
        <span className="block text-base leading-[22px] tracking-[-0.32px] text-near-black">
          {meal.name}
        </span>
        <span className="mt-0.5 block text-xs leading-4 tracking-[-0.24px] text-light-text">
          {stats.join(" · ")}
        </span>
      </span>
    </button>
  );
}
