// PROTOTYPE SHIM — not the production file. Same export names/signatures as every-website so callers lift back unchanged;
// swap this file for the real one when the code moves into the app.
// Production resolves quantity from the account or web cart store and fires analytics.
// Here quantity is local state; callers still get opts.onQuantityChange.
"use client";

import { useCallback, useState } from "react";
import type { ProductDisplayDetails } from "@/lib/shopify/bundles";
import type { MealDetailOpts } from "@/providers/MealDetailProvider";

type Params = {
  product: ProductDisplayDetails | undefined;
  title: string;
  image: string | undefined;
  opts: MealDetailOpts | undefined;
  soldOut?: boolean;
};

export function useMealDetailQuantity({ product, title, image, opts, soldOut = false }: Params) {
  const [quantity, setQuantity] = useState<number>(opts?.cartQty ?? 0);

  const onQuantityChange = useCallback(
    (qty: number) => {
      if (!product?.id) return;
      if (soldOut && qty > quantity) return;
      setQuantity(qty);
      opts?.onQuantityChange?.(product.id, qty, { title, image: image ?? "" });
    },
    [product, title, image, opts, quantity, soldOut],
  );

  return { quantity, onQuantityChange };
}
