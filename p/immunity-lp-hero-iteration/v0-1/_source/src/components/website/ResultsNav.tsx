"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { MenuIcon, ShoppingBagIcon, UserOutlineIcon } from "@/components/icons";
import { Button } from "@/components/shared/Button";
import { DesktopNav } from "./DesktopNav";
import { MobileNavDrawer } from "./MobileNavDrawer";
import type { NavItem } from "./nav-types";

const DARK = "color-mix(in srgb, black 80%, var(--bundle))";

type Props = {
  navItems: NavItem[];
  logoSrc: string;
  /** A band that travels with the bar: it retracts when scrolling down and slides back, pushing the page down, when scrolling up */
  banner?: ReactNode;
  bannerBelow?: boolean;
  /** The hero's colour with dark content, and no rounded page beneath, instead of the dark bar */
  light?: boolean;
  cartCount?: number;
  loginLabel?: string;
  loginHref?: string;
  onCartClick?: () => void;
};

/** The scroll position without the rubber-band overscroll at either end, so a bounce back is not read as scrolling up */
const scrollPosition = () => Math.min(Math.max(window.scrollY, 0), document.documentElement.scrollHeight - window.innerHeight);

/** The contents of HeaderV2 (logo, links, login, cart, menu) on a solid sticky bar, with the page rounded beneath it. */
export function ResultsNav({ navItems, logoSrc, banner, bannerBelow = false, light = false, cartCount = 0, loginLabel = "Login", loginHref = "#", onCartClick }: Props) {
  const bannerRef = useRef<HTMLDivElement>(null);
  const bannerInnerRef = useRef<HTMLDivElement>(null);

  /*
   * One band, one element: it and the bar share a sticky container, so their heights can never disagree.
   * Scrolling triggers a transition rather than driving one, so it does not depend on scroll events keeping
   * pace with the frame, which Safari does not guarantee.
   */
  useEffect(() => {
    const el = bannerRef.current;
    const inner = bannerInnerRef.current;
    if (!el || !inner) return;
    let lastY = scrollPosition();
    let shown = true;
    const set = (show: boolean) => {
      if (show === shown) return;
      shown = show;
      el.style.height = show ? `${inner.offsetHeight}px` : "0px";
    };
    el.style.height = `${inner.offsetHeight}px`;
    const onScroll = () => {
      const y = scrollPosition();
      /*
       * Within the band's height of the very end the bar does nothing. Retracting the band shortens the page, which
       * pulls the scroll position up and would read as scrolling up, bringing the band back, again and again; the
       * bounce at the end does the same.
       */
      if (y >= document.documentElement.scrollHeight - window.innerHeight - inner.offsetHeight - 2) {
        lastY = y;
        return;
      }
      const delta = y - lastY;
      if (Math.abs(delta) < 2) return;
      lastY = y;
      set(delta < 0 || y <= 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const bannerEl = banner ? (
    <div ref={bannerRef} className="overflow-hidden transition-[height] duration-300 ease-out">
      <div ref={bannerInnerRef}>{banner}</div>
    </div>
  ) : null;

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const ACTION = "border border-current text-inherit";
  const ACTION_SIZE = "h-[34px] w-12 justify-center p-0 lg:h-auto lg:w-auto lg:justify-start lg:px-[17px] lg:py-[9px]";

  return (
    <>
      <div className="sticky top-0 z-50 w-full">
        {!bannerBelow && bannerEl}
        <header
          className={`flex h-[58px] w-full items-center justify-between px-3 lg:h-[90px] lg:px-8 ${
            light ? "bg-(--bundle) text-dark" : "bg-[color-mix(in_srgb,black_80%,var(--bundle))] text-white"
          }`}
        >
        <div className="flex items-center gap-12">
          <Link href="/" className="flex h-full shrink-0 items-center justify-center" aria-label="every home">
            <Image
              src={logoSrc}
              alt="every"
              width={72}
              height={24}
              priority
              className={`block h-6 max-h-6 w-auto ${light ? "" : "brightness-0 invert"}`}
            />
          </Link>
          <DesktopNav items={navItems} className="hidden items-center gap-12 lg:flex" itemClassName="text-[16px] leading-[22px] tracking-[-0.32px] text-inherit" />
        </div>

        <div className="flex items-center gap-4 lg:gap-3">
          <Button href={loginHref} icon={<UserOutlineIcon size={22.62} />} iconPosition="left" className={ACTION} sizeClassName={ACTION_SIZE} aria-label={loginLabel}>
            <span className="hidden lg:inline">{loginLabel}</span>
          </Button>
          <button
            type="button"
            onClick={onCartClick}
            className="relative inline-flex h-[34px] w-12 cursor-pointer items-center justify-center rounded-full border border-current p-0 lg:h-auto lg:w-auto lg:px-[17px] lg:py-[9px]"
            aria-label="Cart"
          >
            <ShoppingBagIcon size={21} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-signal-orange font-sans text-[10px] font-medium leading-none text-near-black">
                {cartCount}
              </span>
            )}
          </button>
          <button type="button" onClick={() => setIsMenuOpen(true)} className="inline-flex cursor-pointer items-center justify-center lg:hidden" aria-label="Open menu">
            <MenuIcon size={24} />
          </button>
        </div>
        </header>
        {bannerBelow && bannerEl}
        {/* the page scrolls under the bar with rounded top corners: these are the dark ground showing around them */}
        {!light && (
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-full flex justify-between">
            <span className="size-8" style={{ background: `radial-gradient(circle at 100% 100%, transparent 31.5px, ${DARK} 32px)` }} />
            <span className="size-8" style={{ background: `radial-gradient(circle at 0 100%, transparent 31.5px, ${DARK} 32px)` }} />
          </div>
        )}
      </div>

      <MobileNavDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} items={navItems} loginLabel={loginLabel} loginHref={loginHref} />
    </>
  );
}
