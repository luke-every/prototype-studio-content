"use client";

import { memo, useCallback } from "react";
import { MealCard } from "@/components/account/cards/MealCard";
import { useMealDetail } from "@/providers/MealDetailProvider";
import type { Meal } from "@/app/[locale]/(account)/account/all-meals/types";

type Props = {
  meal: Meal;
  cartQty: number;
  price: string;
  strikethroughPrice?: string;
  isOneTime?: boolean;
  onQuantityChange: (id: string, qty: number, meta: { title: string; image: string }) => void;
  quantityDisabled?: boolean;
  imagePriority?: boolean;
};

export const MealCardRow = memo(function MealCardRow({
  meal,
  cartQty,
  price,
  strikethroughPrice,
  isOneTime = false,
  onQuantityChange,
  quantityDisabled,
  imagePriority = false,
}: Props) {
  const { openMeal } = useMealDetail();

  const handleInfo = useCallback(() => {
    if (meal.shopifyProductId && meal.handle) openMeal(meal.shopifyProductId, meal.handle, { price, strikethroughPrice, cartQty, isOneTime, onQuantityChange });
  }, [meal.shopifyProductId, meal.handle, openMeal, price, strikethroughPrice, cartQty, isOneTime, onQuantityChange]);

  const handleQty = useCallback(
    (qty: number) => {
      if (!meal.shopifyProductId) return;
      onQuantityChange(meal.shopifyProductId, qty, { title: meal.title, image: meal.image });
    },
    [meal.shopifyProductId, meal.title, meal.image, onQuantityChange],
  );

  return (
    <MealCard
      title={meal.title}
      subtitle={meal.subtitle}
      price={price}
      strikethroughPrice={strikethroughPrice}
      protein={meal.protein}
      kcal={meal.kcal}
      carbs={meal.carbs}
      fats={meal.fats}
      rating={meal.rating}
      image={meal.image}
      secondImage={meal.secondImage}
      label={meal.label}
      imagePriority={imagePriority}
      soldOut={meal.soldOut || !meal.shopifyProductId}
      quantityDisabled={quantityDisabled}
      onInfo={meal.shopifyProductId && meal.handle ? handleInfo : undefined}
      onQuantityChange={handleQty}
      initialQuantity={cartQty}
    />
  );
});
