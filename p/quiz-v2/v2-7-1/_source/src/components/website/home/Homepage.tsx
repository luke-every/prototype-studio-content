"use client";

import { useEffect, useRef, useState } from "react";
import { HomeFacts } from "./HomeFacts";
import { HomeHero } from "./HomeHero";
import { HomeSteps } from "./HomeSteps";

type Props = {
  onOpenQuiz: () => void;
  /** Reports whether the hero's own button has scrolled out of the page */
  onHeroCtaGone: (gone: boolean) => void;
};

export function Homepage({ onOpenQuiz, onHeroCtaGone }: Props) {
  const [navSolid, setNavSolid] = useState<boolean>(false);
  const pageRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  /* the navigation takes a light ground once the hero photograph has gone by it */
  const checkNav = () => {
    if (!navRef.current || !imageRef.current) return;
    setNavSolid(imageRef.current.getBoundingClientRect().bottom <= navRef.current.getBoundingClientRect().bottom);
  };

  useEffect(() => {
    const root = pageRef.current;
    const target = ctaRef.current;
    if (!root || !target) return;
    const observer = new IntersectionObserver(([entry]) => onHeroCtaGone(!entry.isIntersecting), {
      root,
      threshold: 0,
    });
    observer.observe(target);
    return () => observer.disconnect();
  }, [onHeroCtaGone]);

  return (
    <div ref={pageRef} onScroll={checkNav} className="scrollbar-hide absolute inset-0 overflow-x-hidden overflow-y-auto overscroll-contain bg-white">
      <HomeHero navSolid={navSolid} navRef={navRef} imageRef={imageRef} ctaRef={ctaRef} onOpenQuiz={onOpenQuiz} />
      <HomeFacts />
      <HomeSteps />
    </div>
  );
}
