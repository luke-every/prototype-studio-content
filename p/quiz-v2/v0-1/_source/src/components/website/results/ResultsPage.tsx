"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { bundleOf, primaryChallenge } from "@/lib/quiz-answers";
import type { Answers, ResultsVariant } from "../quiz/types";
import { BoxContents } from "./BoxContents";
import { BoxPlan } from "./BoxPlan";
import { ChallengeCards } from "./ChallengeCards";
import { ContentSection } from "./ContentSection";
import { FaqSection } from "./FaqSection";
import { PromoBar } from "./PromoBar";
import { ResultsHero } from "./ResultsHero";
import { ResultsNav } from "./ResultsNav";
import { PLANS } from "./sample-data";
import { StickyCartBar } from "./StickyCartBar";
import type { MenuItem, Products } from "./types";

type Props = {
  answers: Answers;
  variant: ResultsVariant;
  products: Products | null;
  sizeIdx: number;
  /** The sheet is showing its results chrome: the navigation has arrived */
  chrome: boolean;
  /** The loader has cleared: the hero's elements arrive */
  revealed: boolean;
  /** Arrived without a loader, so nothing animates in */
  instant: boolean;
  cartCount: number;
  onSizeChange: (index: number) => void;
  onAdd: (meals: number) => void;
  onOpenRecipe: (item: MenuItem) => void;
  onOpenMenu: () => void;
  onLogo: () => void;
};

/** The navigation is 72px tall: 16px padding around a 40px circle */
const NAV_HEIGHT = 72;

/**
 * Two variants of the same page, sharing the sections that do not differ.
 * A: hero with a carousel, the box, the box size, then a content section.
 * B: hero with a marquee, a section arguing the bundle, then the box and the box size on a tinted
 *    ground, then the questions on white.
 */
export function ResultsPage({
  answers,
  variant,
  products,
  sizeIdx,
  chrome,
  revealed,
  instant,
  cartCount,
  onSizeChange,
  onAdd,
  onOpenRecipe,
  onOpenMenu,
  onLogo,
}: Props) {
  const [navDark, setNavDark] = useState<boolean>(false);
  const [stickyIn, setStickyIn] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const promoRef = useRef<HTMLParagraphElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const buyRef = useRef<HTMLDivElement>(null);

  const bundle = bundleOf(answers);
  const plan = PLANS[bundle];
  const size = plan.sizes[Math.min(sizeIdx, plan.sizes.length - 1)];
  const tinted = variant === "B";

  /*
   * The navigation reads whatever has scrolled under it. The cart bar waits for the hero to leave,
   * and stands down whenever the page's own Add to cart is on screen.
   */
  const check = () => {
    const scroller = scrollRef.current;
    const promo = promoRef.current;
    const hero = heroRef.current;
    const buy = buyRef.current;
    if (!scroller || !promo || !hero || !buy) return;
    const view = scroller.getBoundingClientRect();
    setNavDark(promo.getBoundingClientRect().bottom <= view.top + NAV_HEIGHT);
    const buyRect = buy.getBoundingClientRect();
    const heroGone = hero.getBoundingClientRect().bottom < view.top;
    const buyOnScreen = buyRect.top < view.bottom && buyRect.bottom > view.top;
    setStickyIn(heroGone && !buyOnScreen);
  };

  /* the box above the picker can change height with the size: hold the picker still under the finger */
  const anchorTop = useRef<number | null>(null);
  const handleSize = (index: number) => {
    anchorTop.current = buyRef.current?.getBoundingClientRect().top ?? null;
    onSizeChange(index);
  };
  useLayoutEffect(() => {
    if (anchorTop.current === null || !buyRef.current || !scrollRef.current) return;
    scrollRef.current.scrollTop += buyRef.current.getBoundingClientRect().top - anchorTop.current;
    anchorTop.current = null;
  }, [sizeIdx]);

  useEffect(() => {
    const frame = requestAnimationFrame(check);
    return () => cancelAnimationFrame(frame);
  });

  return (
    <div className="absolute inset-0">
      <ResultsNav visible={chrome} dark={navDark} cartCount={cartCount} onLogo={onLogo} />
      <div
        ref={scrollRef}
        onScroll={check}
        className="scrollbar-hide absolute inset-0 overflow-x-hidden overflow-y-auto overscroll-contain"
      >
        <div className="min-h-full bg-white">
          <PromoBar ref={promoRef} />
          <ResultsHero
            ref={heroRef}
            goal={bundle}
            answers={answers}
            variant={variant}
            revealed={revealed}
            instant={instant}
          />
          {variant === "B" && <ChallengeCards challenge={primaryChallenge(answers) ?? "time"} />}
          <BoxContents
            bundle={bundle}
            products={products}
            sizeIdx={sizeIdx}
            tinted={tinted}
            onOpenRecipe={onOpenRecipe}
            onOpenMenu={onOpenMenu}
          />
          <BoxPlan
            bundle={bundle}
            sizeIdx={sizeIdx}
            tinted={tinted}
            buyRef={buyRef}
            onSizeChange={handleSize}
            onAdd={() => onAdd(size.n)}
          />
          {variant === "A" && <ContentSection bundle={bundle} />}
          <FaqSection bundle={bundle} />
          {variant === "A" && <div className="pb-[120px]" />}
        </div>
      </div>
      <StickyCartBar visible={stickyIn} per={size.per} onAdd={() => onAdd(size.n)} />
    </div>
  );
}
