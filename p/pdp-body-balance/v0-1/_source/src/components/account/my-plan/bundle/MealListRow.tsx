import { memo, useState, useCallback } from "react";
import Image from "next/image";
import { shopifyImageUrl } from "@/lib/shopify/image";
import { MinusIcon } from "@/components/icons/MinusIcon";
import { TrashIcon } from "@/components/icons/TrashIcon";
import { InfoIcon } from "@/components/icons/InfoIcon";
import { useTranslations } from "@/providers/TranslationsProvider";
import { interpolate } from "@/lib/translations";

export type MealStatus = "normal" | "sold_out" | "out_of_stock" | "low_stock";

export type MealListRowProps = {
  id: string;
  title: string;
  image: string;
  quantity: number;
  status?: MealStatus;
  replacementTitle?: string;
  onSwap?: (id: string) => void;
  onDelete?: (id: string, qty: number) => void;
  onQuantityChange?: (id: string, qty: number) => void;
  onMoreInfo?: () => void;
  onInfo?: (id: string) => void;
};

function SwapIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="17 1 21 5 17 9" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <polyline points="7 23 3 19 7 15" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  );
}

const iconBtn = "flex items-center justify-center w-8 h-8 rounded-lg border border-light-grey-2 text-dark hover:bg-light-grey transition-colors cursor-pointer";

export const MealListRow = memo(function MealListRow({
  id,
  title,
  image,
  quantity,
  status = "normal",
  replacementTitle,
  onSwap,
  onDelete,
  onQuantityChange,
  onMoreInfo,
  onInfo,
}: MealListRowProps) {
  const t = useTranslations();
  const isSoldOut = status === "sold_out";
  const isOutOfStock = status === "out_of_stock";
  const isLowStock = status === "low_stock";
  const safeTitle = title?.trim() || t.myPlan.mealFallback;
  const hasImage = typeof image === "string" && image.trim().length > 0;
  const [imgSrc, setImgSrc] = useState<string>(image);
  const [imgError, setImgError] = useState<boolean>(false);
  if (imgSrc !== image) {
    setImgSrc(image);
    setImgError(false);
  }

  const handleInfoClick = useCallback(() => { onInfo?.(id); }, [onInfo, id]);
  const handleSwap = useCallback(() => onSwap?.(id), [onSwap, id]);
  const handleDelete = useCallback(() => onDelete?.(id, quantity - 1), [onDelete, id, quantity]);
  const handleIncrease = useCallback(() => onQuantityChange?.(id, quantity + 1), [onQuantityChange, id, quantity]);
  const handleImgError = useCallback(() => setImgError(true), []);

  return (
    <>
      <div className="flex items-center gap-3 py-3">
        {/* Thumbnail */}
        <div
          className={`relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg ${onInfo ? "cursor-pointer" : ""}`}
          onClick={onInfo ? handleInfoClick : undefined}
          aria-hidden="true"
        >
          {(hasImage && !imgError) ? (
            <Image src={shopifyImageUrl(image, 80) ?? image} alt={safeTitle} fill unoptimized sizes="48px" className="object-cover" onError={handleImgError} />
          ) : (
            <div className="h-full w-full bg-light-grey" aria-hidden="true" />
          )}
        </div>

        {/* Name */}
        <div className="flex-1 min-w-0">
          {isOutOfStock && replacementTitle ? (
            <div>
              <p className="text-xs text-light-text">{t.myPlan.mealRow.replacement}</p>
              <p className="text-sm text-dark underline">{replacementTitle}</p>
            </div>
          ) : onInfo ? (
            <button
              type="button"
              onClick={handleInfoClick}
              className={`text-sm underline text-left cursor-pointer ${isSoldOut ? "text-light-text" : "text-dark"}`}
              aria-label={interpolate(t.cards.meal.viewDetailsAriaLabel, { title: safeTitle })}
            >
              {safeTitle}
            </button>
          ) : (
            <p className={`text-sm underline ${isSoldOut ? "text-light-text" : "text-dark"}`}>
              {safeTitle}
            </p>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button type="button" onClick={handleSwap} className={iconBtn} aria-label={t.myPlan.mealRow.swapMealAriaLabel}>
            <SwapIcon />
          </button>
          <button type="button" onClick={handleDelete} className={iconBtn} aria-label={t.myPlan.mealRow.deleteMealAriaLabel}>
            {quantity <= 1 ? <TrashIcon /> : <MinusIcon />}
          </button>

          {isSoldOut ? (
            <span className="rounded-full bg-light-grey px-3 py-1.5 text-sm text-light-text">
              {t.myPlan.mealRow.soldOut}
            </span>
          ) : (
            <div className="flex items-center gap-1">
              <span className={`${iconBtn} cursor-default select-none`}>{quantity}</span>
              <button
                type="button"
                onClick={handleIncrease}
                className={iconBtn}
                aria-label={t.myPlan.mealRow.increaseQuantityAriaLabel}
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Out of stock banner */}
      {isOutOfStock && (
        <div className="flex items-center justify-between rounded-xl bg-light-grey px-3 py-2.5 text-sm mb-1">
          <span className="text-dark">{interpolate(t.myPlan.mealRow.outOfStock, { title })}</span>
          <button type="button" onClick={onMoreInfo} className="flex items-center gap-1 text-dark cursor-pointer">
            <InfoIcon className="w-4 h-4" />
            <span>{t.myPlan.mealRow.moreInfo}</span>
          </button>
        </div>
      )}

      {/* Low stock banner */}
      {isLowStock && (
        <div className="flex items-center justify-between rounded-xl bg-light-grey px-3 py-2.5 text-sm mb-1">
          <span className="text-dark">{t.myPlan.mealRow.lowStock}</span>
          <button type="button" onClick={onMoreInfo} className="flex items-center gap-1 text-dark cursor-pointer">
            <InfoIcon className="w-4 h-4" />
            <span>{t.myPlan.mealRow.whatThisMeans}</span>
          </button>
        </div>
      )}
    </>
  );
});
