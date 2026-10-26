"use client";

import Image from "next/image";
import { ImageFallback } from "@/components/shared/ImageFallback";
import { PlusIcon } from "@/components/icons";
import { addOnTotal, euro } from "@/lib/box-price";
import { PRESS } from "@/lib/press-classes";
import { UPSELLS } from "@/lib/recommendation-data";
import { addOnReason } from "./copy";
import type { MenuItem, Products } from "./types";
import type { Box } from "./useBox";

type Props = {
  box: Box;
  products: Products | null;
  onOpen: (item: MenuItem) => void;
};

/** The add-ons the engine recommends for these answers, each with why, each one tap to add or to read more */
export function AddOns({ box, products, onOpen }: Props) {
  const offers = box.recommendation.addOns;
  if (!offers.length) return null;
  return (
    <section>
      {/* TODO(lift): replace with translation keys */}
      <h2 className="mx-6 my-0 font-book text-[28px] leading-[30px] tracking-[-0.56px] text-dark">Recommended for your box</h2>
      <ul className="scrollbar-hide m-0 mt-5 flex list-none snap-x gap-3 overflow-x-auto scroll-px-6 px-6 pb-1">
        {offers.map(({ key, why }) => {
          const item = UPSELLS[key];
          const product = products?.[item.slug];
          const on = box.added.includes(key);
          return (
            <li key={key} className="flex w-[168px] shrink-0 snap-start flex-col">
              <button
                type="button"
                onClick={() => onOpen({ name: item.name, image: product?.image ?? "", slug: item.slug, qty: 1 })}
                aria-label={`${item.name} — details`}
                className={`block cursor-pointer p-0 text-left ${PRESS} active:scale-[.97]`}
              >
                <span className="relative block aspect-square overflow-hidden rounded-2xl bg-light-grey">
                  {product?.image ? (
                    <Image src={product.image} alt="" fill sizes="168px" className="object-cover" />
                  ) : (
                    <ImageFallback />
                  )}
                </span>
                <span className="mt-2 block text-base leading-[22px] tracking-[-0.32px] text-near-black">{item.name}</span>
                <span className="mt-0.5 block text-xs leading-4 tracking-[-0.24px] text-light-text">
                  {addOnReason(key, why)}
                </span>
              </button>
              <span className="mt-auto flex items-center justify-between gap-2 pt-2.5">
                <span className="text-sm leading-[18px] tracking-[-0.28px] text-dark">
                  +{euro(addOnTotal([key], box.units + box.added.length + (on ? 0 : 1)))}
                </span>
                <button
                  type="button"
                  onClick={() => box.toggleAddOn(key)}
                  aria-pressed={on}
                  aria-label={on ? `Remove ${item.name}` : `Add ${item.name}`}
                  className={`flex h-9 cursor-pointer items-center gap-1.5 rounded-full border px-3.5 text-xs leading-4 font-medium tracking-[-0.24px] transition-[background-color,color,border-color,scale] duration-[240ms] ease-spring active:scale-[.94] active:duration-[90ms] ${
                    on ? "border-dark bg-dark text-white" : "border-light-grey-3 bg-white text-dark"
                  }`}
                >
                  {on ? <span aria-hidden>✓</span> : <PlusIcon size={12} />}
                  {/* TODO(lift): replace with translation key */}
                  {on ? "Added" : "Add"}
                </button>
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
