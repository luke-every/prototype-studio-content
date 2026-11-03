"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { StarIcon } from "@/components/icons/StarIcon";
import { MealQuantityButton } from "@/components/shared/MealQuantityButton";
import { ImageFallback } from "@/components/shared/ImageFallback";
import { useTranslations } from "@/providers/TranslationsProvider";
import { interpolate } from "@/lib/translations";
import type { MealLabel } from "@/app/[locale]/(account)/account/all-meals/types";

export type MealCardProps = {
  title: string;
  subtitle: string;
  price?: string | null;
  strikethroughPrice?: string;
  protein?: string | null;
  kcal?: string | null;
  carbs?: string | null;
  fats?: string | null;
  /** Mark image as above-the-fold (Next.js LCP optimization) */
  imagePriority?: boolean;
  rating?: number | null;
  image: string;
  /** Shown on hover in place of `image`, when present. */
  secondImage?: string | null;
  /** Badge shown over the product image (e.g. "High Protein", "Leaving Soon"). */
  label?: MealLabel | null;
  maxQuantity?: number;
  soldOut?: boolean;
  quantityDisabled?: boolean;
  onInfo?: () => void;
  onQuantityChange?: (quantity: number) => void | boolean;
  initialQuantity?: number;
};

export const MealCard = React.memo(function MealCard({
  title,
  subtitle,
  price,
  strikethroughPrice,
  protein,
  kcal,
  carbs,
  fats,
  imagePriority = false,
  rating,
  image,
  secondImage,
  label,
  maxQuantity,
  soldOut,
  quantityDisabled,
  onInfo,
  onQuantityChange,
  initialQuantity,
}: MealCardProps) {
  const t = useTranslations();
  const [imgError, setImgError] = useState<boolean>(!image?.trim());
  const [secondImgError, setSecondImgError] = useState<boolean>(false);

  const infoParts = useMemo(
    () =>
      [
        protein ? interpolate(t.cards.meal.protein, { value: protein }) : null,
        kcal    ? interpolate(t.cards.meal.kcal,    { value: kcal })    : null,
        carbs   ? interpolate(t.cards.meal.carbs,   { value: carbs })   : null,
        fats    ? interpolate(t.cards.meal.fats,    { value: fats })    : null,
      ].filter(Boolean) as string[],
    [protein, kcal, carbs, fats, t],
  );

  return (
    <div className="overflow-hidden flex flex-col h-full">
      <button
        type="button"
        onClick={onInfo}
        aria-label={interpolate(t.cards.meal.viewDetailsAriaLabel, { title })}
        className={`group text-left flex flex-col flex-1${onInfo ? " cursor-pointer" : ""}`}
      >
        <div className="relative aspect-square w-full">
          {label && (
            <span
              className={`absolute bottom-2 left-2 z-1 rounded-md px-3 py-1 text-xs font-medium text-near-black${label.color ? "" : " bg-white border border-near-black/10"}`}
              style={label.color ? { backgroundColor: label.color } : undefined}
            >
              {label.text}
            </span>
          )}
          {imgError ? (
            <div className="absolute inset-0 rounded-sm bg-light-grey">
              <ImageFallback />
            </div>
          ) : (
            <Image
              src={image}
              alt={title}
              fill
              sizes="(max-width: 1024px) 50vw, 25vw"
              className="object-cover rounded-sm"
              priority={imagePriority}
              loading={imagePriority ? "eager" : "lazy"}
              onError={() => setImgError(true)}
            />
          )}
          {secondImage && !secondImgError && (
            <Image
              src={secondImage}
              alt=""
              aria-hidden="true"
              fill
              sizes="(max-width: 1024px) 50vw, 25vw"
              className="object-cover rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              loading="lazy"
              onError={() => setSecondImgError(true)}
            />
          )}
        </div>

        <div className="py-2 !w-full flex flex-col gap-1">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-0.5 lg:gap-2 overflow-hidden">
            <span className="min-w-0 lg:flex-1 font-bold text-xs lg:text-sm text-near-black leading-tight line-clamp-1 lg:line-clamp-2">{title}</span>
            {price && (
              <div className="flex gap-x-2 items-end shrink-0">
                <span className="text-xs lg:text-sm font-bold text-near-black whitespace-nowrap">{price}</span>
                {strikethroughPrice && (
                  <span className="text-xs lg:text-sm text-light-text line-through whitespace-nowrap">{strikethroughPrice}</span>
                )}
              </div>
            )}
          </div>

          <p className="text-xs h-[30px] lg:h-auto text-light-text leading-tight line-clamp-2">{subtitle}</p>

          <p className="text-xs text-light-text h-4 truncate">{infoParts.join(" | ")}</p>

          <div className="flex items-center gap-1 mt-0.5">
            <StarIcon />
            <span className="text-xs text-light-text">{rating != null ? rating.toFixed(1) : "0"}</span>
          </div>
        </div>
      </button>

      <MealQuantityButton maxQuantity={maxQuantity} soldOut={soldOut} disabled={quantityDisabled} onChange={onQuantityChange} initialQuantity={initialQuantity} />
    </div>
  );
});
