"use client";

import Link from "next/link";
import { Button } from "@/components/shared/Button";
import { PRESS } from "@/lib/press-classes";

type Props = {
  visible: boolean;
  onOpenQuiz: () => void;
};

/** The bar that arrives once the hero's button has left the screen */
export function HomeStickyBar({ visible, onOpenQuiz }: Props) {
  return (
    <div
      className={`absolute inset-x-0 bottom-0 z-[18] bg-white px-4 pt-4 pb-5 shadow-[0_-2px_6px] shadow-dark/12 transition-[opacity,transform] duration-[550ms] ${
        visible ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-[110px] opacity-0"
      }`}
    >
      <Button
        type="button"
        variant="primary"
        onClick={onOpenQuiz}
        aria-label="Find your routine"
        sizeClassName="px-7 py-3.5"
        className={`w-full justify-center text-sm leading-[14px] tracking-[2px] text-near-black uppercase ${PRESS} active:scale-[.98]`}
      >
        {/* TODO(lift): replace with translation key */}
        Find your routine
      </Button>
      {/* TODO(lift): replace with translation key */}
      <Link
        href="#"
        aria-label="Pick your meals"
        className="mx-auto mt-4 block w-max text-sm leading-[19px] tracking-[-0.28px] text-near-black underline"
      >
        Pick your meals
      </Link>
    </div>
  );
}
