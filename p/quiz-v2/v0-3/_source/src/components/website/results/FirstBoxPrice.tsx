"use client";

import { useState } from "react";
import { ChevronDownIcon } from "@/components/icons";
import { euro } from "@/lib/box-price";
import { UPSELLS } from "@/lib/recommendation-data";
import type { Box } from "./useBox";
import { WEEKS } from "./weeks";

type Props = {
  box: Box;
};

const ROW = "flex items-baseline justify-between gap-4 text-sm leading-[18px] tracking-[-0.28px]";

/**
 * What the first box costs: what's in it at list price, the quantity and first-order discounts, the total. Then the two ways
 * people weigh it: the average meal, and a week of the month it covers.
 */
export function FirstBoxPrice({ box }: Props) {
  const { price, units, added } = box;
  const [discountsOpen, setDiscountsOpen] = useState<boolean>(false);
  const mealsWas = price.was - added.reduce((sum, key) => sum + UPSELLS[key].price, 0);
  // TODO(lift): replace with translation keys
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-light-grey-3 px-4 py-4">
        <p className={`${ROW} m-0 text-dark`}>
          <span>{units} meals</span>
          <span>{euro(mealsWas)}</span>
        </p>
        {added.map((key) => (
          <p key={key} className={`${ROW} m-0 text-dark`}>
            <span>{UPSELLS[key].name}</span>
            <span>{euro(UPSELLS[key].price)}</span>
          </p>
        ))}
        {/* one line with the total saving; it opens to show each discount */}
        <button
          type="button"
          onClick={() => setDiscountsOpen((v) => !v)}
          aria-expanded={discountsOpen}
          aria-controls="first-box-discounts"
          className={`${ROW} w-full cursor-pointer bg-transparent p-0 text-left text-dark`}
        >
          <span className="flex items-center gap-1.5">
            Discounts
            <ChevronDownIcon
              size={9}
              className={`transition-transform duration-200 ease-ui ${discountsOpen ? "rotate-180" : ""}`}
            />
          </span>
          <span className="text-savings-green">−{euro(price.quantity + price.firstOrder)}</span>
        </button>
        {discountsOpen && (
          <div id="first-box-discounts" className="-mt-1 flex flex-col gap-2 pl-3">
            {price.quantity > 0 && (
              <p className={`${ROW} m-0 text-light-text`}>
                <span>Qty discount ({Math.round(price.quantityRate * 100)}%)</span>
                <span>−{euro(price.quantity)}</span>
              </p>
            )}
            <p className={`${ROW} m-0 text-light-text`}>
              <span>First order (20%)</span>
              <span>−{euro(price.firstOrder)}</span>
            </p>
          </div>
        )}
        <p className={`${ROW} m-0 text-dark`}>
          <span>Shipping</span>
          <span className="flex items-baseline gap-2">
            {/* TODO(lift): sample data — replace with the market's shipping cost */}
            <s className="text-light-text">{euro(4.99)}</s>
            <span className="text-savings-green">FREE</span>
          </span>
        </p>
        <p className={`${ROW} m-0 border-t border-light-grey pt-3 text-base leading-[22px] font-medium tracking-[-0.32px] text-dark`}>
          <span>Total</span>
          <span>{euro(price.total)}</span>
        </p>
      </div>
      <ul className="m-0 grid list-none grid-cols-2 divide-x divide-light-grey p-0">
        <li className="flex flex-col items-center gap-0.5">
          <span className="font-book text-2xl leading-[26px] tracking-[-0.48px] text-dark">{euro(price.perMeal)}</span>
          <span className="text-xs leading-4 tracking-[-0.24px] text-light-text">average per meal</span>
        </li>
        <li className="flex flex-col items-center gap-0.5">
          <span className="font-book text-2xl leading-[26px] tracking-[-0.48px] text-dark">
            about {euro(Math.round(price.total / WEEKS))}
          </span>
          <span className="text-xs leading-4 tracking-[-0.24px] text-light-text">a week, over {WEEKS} weeks</span>
        </li>
      </ul>
    </div>
  );
}
