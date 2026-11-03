"use client";
import { memo, useState } from "react";
import Image from "next/image";
import { useTranslations } from "@/providers/TranslationsProvider";
import { interpolate } from "@/lib/translations";

type Props = {
  meal: { id: string; image: string; title: string };
  faded?: boolean;
  onInfo?: (id: string) => void;
};

export const CollapsedMealThumbnail = memo(function CollapsedMealThumbnail({ meal, faded, onInfo }: Props) {
  const t = useTranslations();
  const hasImage = typeof meal.image === "string" && meal.image.trim().length > 0;
  const [imgError, setImgError] = useState<boolean>(false);

  return (
    <div
      className={`flex items-center gap-4 transition-opacity ${faded ? "opacity-30" : ""} ${onInfo ? "cursor-pointer" : ""}`}
      onClick={onInfo ? () => onInfo(meal.id) : undefined}
      role={onInfo ? "button" : undefined}
      aria-label={onInfo ? interpolate(t.cards.meal.viewDetailsAriaLabel, { title: meal.title }) : undefined}
    >
      <div className="relative h-[50px] w-[50px] flex-shrink-0 overflow-hidden">
        {hasImage && !imgError ? (
          <Image
            src={meal.image}
            alt={meal.title}
            fill
            sizes="50px"
            className="object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="h-full w-full bg-light-grey" aria-hidden="true" />
        )}
      </div>
      <span className="text-xs font-medium text-dark leading-tight line-clamp-2">{meal.title}</span>
    </div>
  );
});
