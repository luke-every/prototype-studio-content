"use client";

import { useState } from "react";
import { Drawer } from "@/components/shared/Drawer";
import { CloseFilledIcon } from "@/components/icons";
import { RecipeDetail } from "./RecipeDetail";
import type { MenuItem, Products } from "./types";

type Props = {
  /** The dish being looked at; null when closed */
  item: MenuItem | null;
  products: Products | null;
  onClose: () => void;
};

/** A dish, in a sheet that rises from the bottom over a dimmed page. On a wide screen, a centred dialog. */
export function RecipeSheet({ item, products, onClose }: Props) {
  /* keeps showing the last dish while the sheet plays its exit */
  const shown = useLast(item);
  return (
    <Drawer open={item !== null} title={shown?.name ?? "Recipe"} onClose={onClose} centeredOnWide>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-6 right-6 z-[3] flex size-8 cursor-pointer items-center justify-center rounded-2xl bg-white/85 text-near-black transition-[scale] duration-[240ms] ease-spring active:scale-90 active:duration-[90ms] active:ease-out"
      >
        <span className="relative flex size-4 items-center justify-center">
          <CloseFilledIcon size={10} />
        </span>
      </button>
      <div className="scrollbar-hide flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain">
        {shown && <RecipeDetail item={shown} products={products} />}
      </div>
    </Drawer>
  );
}

function useLast(item: MenuItem | null): MenuItem | null {
  const [last, setLast] = useState<MenuItem | null>(item);
  if (item && item !== last) setLast(item);
  return item ?? last;
}
