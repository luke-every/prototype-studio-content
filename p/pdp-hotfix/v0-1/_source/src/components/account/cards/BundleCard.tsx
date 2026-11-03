"use client";

import Image from "next/image";
import React, { memo } from "react";
import { PlusIcon } from "@/components/icons";
import { Button } from "@/components/shared/Button";
import { MealQuantityButton } from "@/components/shared/MealQuantityButton";
import { useTranslations } from "@/providers/TranslationsProvider";
import { interpolate } from "@/lib/translations";

export type BundleCardProps = {
  mealCount: number;
  pricePerMeal: string;
  totalPrice: string;
  recommended?: boolean;
  onAdd?: () => void;
  ctaLabel?: { desktop: string; mobile: string };
  /** Icon for CTA button. Pass `null` to render no icon. */
  ctaIcon?: React.ReactNode | null;
  /** Force showing the CTA button even when quantity > 0 */
  forceCtaButton?: boolean;
  onQuantityChange?: (quantity: number) => void;
  initialQuantity?: number;
  /** Optional class override for the selected (bin/qty/plus) button container */
  quantityButtonClassName?: string;
  /** Bundle artwork from Storyblok; falls back to default asset */
  imageSrc?: string | null;
};

const DEFAULT_BUNDLE_IMG = "/Logo.png";

export const BundleCard = memo(function BundleCard({
  mealCount,
  pricePerMeal,
  totalPrice,
  recommended,
  onAdd,
  ctaLabel,
  ctaIcon,
  forceCtaButton = false,
  onQuantityChange,
  initialQuantity = 0,
  quantityButtonClassName,
  imageSrc,
}: BundleCardProps) {
  const t = useTranslations();
  const img = imageSrc?.trim() || DEFAULT_BUNDLE_IMG;
  const label = ctaLabel ?? { desktop: t.cards.bundle.addDesktop, mobile: t.cards.bundle.addMobile };
  const icon = ctaIcon === undefined ? <PlusIcon /> : ctaIcon;

  return (
    <div className="flex flex-col gap-2 rounded-xl bg-light-grey p-2 lg:p-4 items-start lg:items-center">
      <span className={`hidden text-base text-dark font-medium lg:block ${!recommended ? "invisible" : ""}`}>
        {t.cards.bundle.recommended}
      </span>

      <Image
        src={img}
        alt={interpolate(t.cards.bundle.imageAlt, { mealCount })}
        width={234}
        height={124}
        unoptimized={!!imageSrc?.trim()}
        className="hidden object-contain lg:block"
      />

      <p className="text-sm lg:text-base font-medium text-black">{interpolate(t.cards.bundle.mealCount, { mealCount })}</p>

      <div className="text-xs lg:text-sm text-center">
        <p className="text-black">{pricePerMeal}</p>
        <p className="text-light-text">{totalPrice}</p>
      </div>

      {initialQuantity > 0 && !forceCtaButton ? (
        <div className="w-1/2">
        <MealQuantityButton
          onChange={onQuantityChange}
          initialQuantity={initialQuantity}
          shape="pill"
          activeClassName={quantityButtonClassName ?? "bg-near-black"}
        />
        </div>
      ) : (
        <Button variant="nearBlack" icon={icon ?? undefined} onClick={onAdd} className="text-xs lg:text-sm">
          <span className="hidden sm:inline">{label.desktop}</span>
          <span className="inline sm:hidden">{label.mobile}</span>
        </Button>
      )}
    </div>
  );
});
