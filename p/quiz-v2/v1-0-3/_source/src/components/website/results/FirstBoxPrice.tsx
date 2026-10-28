"use client";

import { useState } from "react";
import { ChevronDownIcon } from "@/components/icons";
import { euro } from "@/lib/box-price";
import { UPSELLS } from "@/lib/recommendation-data";
import type { Box } from "./useBox";

type Props = {
  box: Box;
};

const ROW =
  "flex items-center justify-between gap-3 px-4 py-[14px] font-sans text-sm leading-[19px] tracking-[-0.28px] text-dark";
const SUB = "flex justify-between";

/**
 * What the first box costs, as the sum: what's in it at list price, the quantity and first-order discounts, the
 * shipping, the total and what it saves. The price breakdown from the LP bundle section; the average meal sits
 * under the section's heading.
 */
export function FirstBoxPrice({ box }: Props) {
  const { price, units, added } = box;
  const [discountsOpen, setDiscountsOpen] = useState<boolean>(false);
  const [addOnsOpen, setAddOnsOpen] = useState<boolean>(false);
  const addOnsWas = added.reduce((sum, key) => sum + UPSELLS[key].price, 0);
  const mealsWas = price.was - addOnsWas;
  const saved = price.quantity + price.firstOrder;
  // TODO(lift): replace with translation keys
  return (
    <div className="overflow-clip rounded-2xl border border-light-brown bg-white">
      <div className={`${ROW} border-b border-light-brown`}>
        <span>{units} meals</span>
        <span className="text-near-black">{euro(mealsWas)}</span>
      </div>

      {/* one or two add-ons show as lines of their own; more fold into one line, opened like the discounts */}
      {added.length > 2 ? (
        <div className="border-b border-light-brown">
          <button
            type="button"
            onClick={() => setAddOnsOpen((v) => !v)}
            aria-expanded={addOnsOpen}
            aria-controls="first-box-add-ons"
            className={`${ROW} w-full cursor-pointer`}
          >
            <span className="flex items-center gap-1">
              {added.length} add-ons
              <ChevronDownIcon
                size={10}
                className={`shrink-0 transition-transform duration-200 ${addOnsOpen ? "rotate-180" : ""}`}
              />
            </span>
            <span className="text-near-black">{euro(addOnsWas)}</span>
          </button>
          <div
            id="first-box-add-ons"
            className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${addOnsOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
          >
            <div className="overflow-hidden">
              <div className="flex flex-col gap-2 px-4 pb-[14px] font-sans text-sm leading-[19px] tracking-[-0.28px] text-dark/60">
                {added.map((key) => (
                  <div key={key} className={SUB}>
                    <span>{UPSELLS[key].name}</span>
                    <span>{euro(UPSELLS[key].price)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        added.map((key) => (
          <div key={key} className={`${ROW} border-b border-light-brown`}>
            <span>{UPSELLS[key].name}</span>
            <span className="text-near-black">{euro(UPSELLS[key].price)}</span>
          </div>
        ))
      )}

      {/* one line with the total saving; it opens to show each discount */}
      <div className="border-b border-light-brown">
        <button
          type="button"
          onClick={() => setDiscountsOpen((v) => !v)}
          aria-expanded={discountsOpen}
          aria-controls="first-box-discounts"
          aria-label="Discounts"
          className={`${ROW} w-full cursor-pointer`}
        >
          <span className="flex items-center gap-1">
            Discounts
            <ChevronDownIcon
              size={10}
              className={`shrink-0 transition-transform duration-200 ${discountsOpen ? "rotate-180" : ""}`}
            />
          </span>
          <span className="font-medium text-savings-green">-{euro(saved)}</span>
        </button>
        <div
          id="first-box-discounts"
          className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${discountsOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
        >
          <div className="overflow-hidden">
            <div className="flex flex-col gap-2 px-4 pb-[14px] font-sans text-sm leading-[19px] tracking-[-0.28px] text-dark/60">
              {price.quantity > 0 && (
                <div className={SUB}>
                  <span>
                    Qty discount ({Math.round(price.quantityRate * 100)}%)
                  </span>
                  <span>-{euro(price.quantity)}</span>
                </div>
              )}
              <div className={SUB}>
                <span>First order discount (20%)</span>
                <span>-{euro(price.firstOrder)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`${ROW} border-b border-light-brown`}>
        <span>Shipping</span>
        <span className="flex gap-1.5">
          {/* TODO(lift): sample data — replace with the market's shipping cost */}
          <span className="text-near-black line-through opacity-60">
            {euro(5.99)}
          </span>
          <span className="font-medium text-savings-green">FREE</span>
        </span>
      </div>

      <div className="flex items-center justify-between px-4 py-5">
        <span className="font-sans text-base leading-[22px] font-medium tracking-[-0.32px] text-dark">
          Total Price
        </span>
        <span className="flex items-center gap-2">
          <span className="rounded bg-savings-green px-1.5 py-0.5 font-sans text-xs leading-4 font-medium tracking-[-0.24px] text-white">
            You save {euro(saved)}
          </span>
          <span className="font-sans text-xl leading-[22px] font-bold tracking-[-0.4px] text-dark">
            {euro(price.total)}
          </span>
        </span>
      </div>
    </div>
  );
}
