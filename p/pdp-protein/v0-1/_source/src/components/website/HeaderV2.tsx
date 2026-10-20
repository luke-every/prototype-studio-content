"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MenuIcon, ShoppingBagIcon, UserOutlineIcon } from "@/components/icons";
import { Button } from "@/components/shared/Button";
import { DesktopNav } from "./DesktopNav";
import { MobileNavDrawer } from "./MobileNavDrawer";
import type { NavItem } from "./nav-types";

type Props = {
  navItems: NavItem[];
  logoSrc: string;
  loginLabel?: string;
  loginHref?: string;
  cartCount?: number;
  onCartClick?: () => void;
  /** Floats over the hero (the PDP) instead of sitting in flow. Publishes --header-overlay-h for the hero and rail to offset by. */
  overlay?: boolean;
};

/** Port of every-website `src/components/website/HeaderV2.tsx`: no Storyblok blok, cart store, locale switcher or promo bar. */
export function HeaderV2({ navItems, logoSrc, loginLabel = "Login", loginHref = "#", cartCount = 0, onCartClick, overlay = true }: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = headerRef.current;
    const root = document.documentElement;
    if (!el || !overlay || typeof ResizeObserver === "undefined") return;
    const publish = () => root.style.setProperty("--header-overlay-h", `${Math.round(el.getBoundingClientRect().height)}px`);
    publish();
    const observer = new ResizeObserver(publish);
    observer.observe(el);
    return () => {
      observer.disconnect();
      root.style.removeProperty("--header-overlay-h");
    };
  }, [overlay]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // "fixed" never reserves space, so the hero is not pushed down; "sticky" reserves it, which in-flow pages need.
  const position = overlay ? (isScrolled ? "fixed top-0 left-0 w-full" : "absolute top-0 left-0 w-full") : "sticky top-0 w-full";
  const ACTION = "border border-near-black text-dark";
  const ACTION_SIZE = "h-[34px] w-12 justify-center p-0 lg:h-auto lg:w-auto lg:justify-start lg:px-[17px] lg:py-[9px]";

  return (
    <>
      <div ref={headerRef} className={`${position} z-50`}>
        <header>
          <div
            className={`flex h-[72px] items-center justify-between px-[12px] lg:h-[90px] lg:px-8 ${
              overlay
                ? `bg-transparent lg:backdrop-blur-[16px] ${isScrolled ? "border-b border-dark/6 backdrop-blur-[16px]" : "backdrop-blur-none"}`
                : "border-b border-dark/6 bg-white"
            }`}
          >
            <div className="flex items-center gap-12">
              <Link href="/" className="flex h-full shrink-0 items-center justify-center" aria-label="every home">
                <Image src={logoSrc} alt="every" width={72} height={24} priority className="block h-6 max-h-6 w-auto" />
              </Link>
              <DesktopNav
                items={navItems}
                className="hidden items-center gap-12 lg:flex"
                itemClassName="text-[16px] leading-[22px] tracking-[-0.32px] text-near-black"
              />
            </div>

            <div className="flex items-center gap-4 lg:gap-3">
              <Button href={loginHref} icon={<UserOutlineIcon size={22.62} />} iconPosition="left" className={ACTION} sizeClassName={ACTION_SIZE} aria-label={loginLabel}>
                <span className="hidden lg:inline">{loginLabel}</span>
              </Button>
              <button
                type="button"
                onClick={onCartClick}
                className="relative inline-flex h-[34px] w-12 cursor-pointer items-center justify-center rounded-full border border-near-black p-0 lg:h-auto lg:w-auto lg:px-[17px] lg:py-[9px]"
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
          </div>
        </header>
      </div>

      <MobileNavDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} items={navItems} loginLabel={loginLabel} loginHref={loginHref} />
    </>
  );
}
