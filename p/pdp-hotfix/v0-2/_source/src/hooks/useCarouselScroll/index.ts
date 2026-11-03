"use client";

import { useState, useRef, useCallback, useLayoutEffect } from "react";

type UseCarouselScrollOptions = {
  /** Fixed scroll amount in px. When omitted, scrolls by one card width + gap. */
  scrollAmount?: number;
  /** Gap between carousel items in px (used for dynamic scroll calculation). Defaults to 16. */
  gap?: number;
};

export function useCarouselScroll(options: UseCarouselScrollOptions = {}) {
  const { scrollAmount, gap = 16 } = options;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(true);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [pageCount, setPageCount] = useState<number>(1);

  const getScrollDistance = useCallback(() => {
    if (scrollAmount != null) return scrollAmount;
    const el = scrollRef.current;
    const cardWidth = el?.firstElementChild?.clientWidth ?? 0;
    return cardWidth + gap;
  }, [scrollAmount, gap]);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);

    // Page count: one "page" = one clientWidth of scroll travel.
    // This correctly reflects how many times the user needs to swipe,
    // regardless of how many cards are physically visible per view.
    const overflow = el.scrollWidth - el.clientWidth;
    if (overflow > 10 && el.clientWidth > 0) {
      setPageCount(Math.ceil(overflow / el.clientWidth) + 1);
    } else {
      setPageCount(1);
    }
  }, []);

  useLayoutEffect(() => {
    updateScrollState();
  }, [updateScrollState]);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();

    const distance = getScrollDistance();
    if (distance > 0) {
      setActiveIndex(Math.round(el.scrollLeft / distance));
    }
  }, [getScrollDistance, updateScrollState]);

  const scrollPrev = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: -getScrollDistance(), behavior: "smooth" });
  }, [getScrollDistance]);

  const scrollNext = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: getScrollDistance(), behavior: "smooth" });
  }, [getScrollDistance]);

  return {
    scrollRef,
    canScrollLeft,
    canScrollRight,
    activeIndex,
    pageCount,
    handleScroll,
    scrollPrev,
    scrollNext,
  };
}
