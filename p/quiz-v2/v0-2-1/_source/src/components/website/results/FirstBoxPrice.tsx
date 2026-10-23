"use client";

import { addOnTotal, euro } from "@/lib/box-price";
import { UPSELLS } from "@/lib/recommendation-data";
import type { Box } from "./useBox";
import { WEEKS } from "./weeks";

type Props = {
  box: Box;
};

const ROW = "flex items-baseline justify-between gap-4 text-sm leading-[18px] tracking-[-0.28px]";

/**
 * What the first box costs: what's in it at its price, one discount line, the total. Then the two ways
 * people weigh it: the average meal, and a week of the month it covers.
 */
export function FirstBoxPrice({ box }: Props) {
  const { price, units, added } = box;
  /* prices before the first-order discount: the add-ons at the box's tier, the meals the rest */
  const addOnGross = (key: string) => addOnTotal([key], units) / 0.8;
  const gross = price.total + price.firstOrder;
  const mealsGross = gross - added.reduce((sum, key) => sum + addOnGross(key), 0);
  // TODO(lift): replace with translation keys
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-light-grey-3 px-4 py-4">
        <p className={`${ROW} m-0 text-dark`}>
          <span>{units} meals</span>
          <span>{euro(mealsGross)}</span>
        </p>
        {added.map((key) => (
          <p key={key} className={`${ROW} m-0 text-dark`}>
            <span>{UPSELLS[key].name}</span>
            <span>{euro(addOnGross(key))}</span>
          </p>
        ))}
        <p className={`${ROW} m-0 text-savings-green`}>
          <span>First order, 20% off</span>
          <span>−{euro(price.firstOrder)}</span>
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
