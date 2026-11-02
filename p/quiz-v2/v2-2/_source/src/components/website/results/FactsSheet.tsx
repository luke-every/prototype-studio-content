"use client";

import { CloseIcon } from "@/components/icons";
import { Drawer } from "@/components/shared/Drawer";
import type { Routine } from "./routine";
import { Cited, SourceList } from "./sources";

type Props = {
  routine: Routine;
  open: boolean;
  onClose: () => void;
};

const LABEL =
  "m-0 text-xs leading-4 font-medium tracking-[-0.24px] text-light-text";
const BODY = "mt-1 mb-0 text-base leading-[22px] tracking-[-0.32px] text-dark";

/**
 * "Learn more" under the recommendation: the same three points as its cards, each opened up into why it
 * matters and how it shows up in their plan, so it adds to the card instead of repeating it.
 */
// TODO(lift): unconfirmed — needs a named reviewer and cited sources before this ships
export function FactsSheet({ routine, open, onClose }: Props) {
  /* one numbering for the whole sheet, in the order the points cite them */
  const facts = routine.principles.filter(
    (principle) => principle.only !== "a2",
  );
  const order = [...new Set(facts.flatMap((principle) => principle.sources))];
  return (
    <Drawer
      open={open}
      title="The facts behind your plan"
      onClose={onClose}
      centeredOnWide
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-6 right-6 z-[3] flex size-8 cursor-pointer items-center justify-center rounded-2xl bg-off-white text-near-black transition-[scale] duration-[240ms] ease-spring active:scale-90 active:duration-[90ms] active:ease-out"
      >
        <CloseIcon size={12} />
      </button>
      <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pt-8 pb-10">
        {/* TODO(lift): replace with translation keys */}
        <h2 className="m-0 pr-12 font-book text-[28px] leading-[30px] tracking-[-0.56px] text-dark">
          The facts behind your plan
        </h2>
        <ul className="m-0 mt-6 flex list-none flex-col gap-2 p-0">
          {facts.map((principle) => (
            <li
              key={principle.did}
              className="rounded-2xl border border-light-brown p-4"
            >
              <div className="flex items-center gap-4">
                <span
                  aria-hidden
                  className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-light-brown text-[22px] leading-none"
                >
                  {principle.icon}
                </span>
                <h3 className="m-0 text-base leading-[22px] font-medium tracking-[-0.32px] text-near-black">
                  {principle.headline}
                </h3>
              </div>
              <div className="mt-4">
                <p className={LABEL}>Why it matters</p>
                <p className={BODY}>
                  <Cited text={principle.why} order={order} />
                </p>
              </div>
              {principle.facts && (
                <div className="mt-4">
                  {/* TODO(lift): replace with translation key */}
                  <p className={LABEL}>The facts</p>
                  <p className={BODY}>
                    <Cited
                      text={`${principle.facts}${principle.more ? ` ${principle.more}` : ""}`}
                      order={order}
                    />
                  </p>
                </div>
              )}
              <div className="mt-4">
                <p className={LABEL}>In your plan</p>
                <p className={BODY}>{principle.inPlan}</p>
              </div>
            </li>
          ))}
        </ul>
        {order.length > 0 && (
          <div className="mt-6">
            {/* TODO(lift): replace with translation key */}
            <p className={`${LABEL} mb-2`}>Sources</p>
            <SourceList order={order} />
          </div>
        )}
      </div>
    </Drawer>
  );
}
