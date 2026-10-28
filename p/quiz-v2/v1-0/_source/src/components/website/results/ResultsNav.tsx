"use client";

import { ShoppingBagIcon, UserOutlineIcon } from "@/components/icons";

type Props = {
  /** Arrives with the results, where there is a cart to get back to */
  visible: boolean;
  /** Dark content once light content has scrolled under it; white while the dark promo band is behind it */
  dark: boolean;
  cartCount: number;
  onLogo: () => void;
};

/** The navigation carried over the results on a blur, so the page passes underneath it. */
export function ResultsNav({ visible, dark, cartCount, onLogo }: Props) {
  const circle = "relative flex size-10 items-center justify-center rounded-full border border-current opacity-90";
  return (
    <header
      className={`absolute inset-x-0 top-0 z-[25] items-center gap-2.5 bg-white/1 px-5 py-4 backdrop-blur-[14px] backdrop-saturate-[1.2] transition-colors duration-300 ease-ui ${
        visible ? "flex" : "hidden"
      } ${dark ? "text-near-black" : "text-white"}`}
    >
      <button
        type="button"
        onClick={onLogo}
        aria-label="every, back to the homepage"
        className="flex-1 cursor-pointer p-0 text-left text-[23px] font-bold tracking-[-0.6px] text-inherit"
      >
        every
      </button>
      <span className={circle} aria-hidden>
        <UserOutlineIcon size={21} />
      </span>
      {/* a nudge each time something lands in it */}
      <span key={cartCount} className={`${cartCount > 0 ? "animate-cart-pop" : ""}`}>
        <span
          className={`${circle} transition-colors duration-300 ease-ui ${cartCount > 0 ? "border-signal-orange" : ""}`}
          role="img"
          aria-label={`Cart, ${cartCount} items`}
        >
          <ShoppingBagIcon size={19} />
          <span
            className={`absolute -top-[3px] -right-[3px] h-[18px] min-w-[18px] rounded-full bg-signal-orange px-[5px] text-center text-[10px] leading-[18px] font-bold text-white [transition:opacity_200ms_var(--ease-ui),scale_380ms_var(--ease-spring)] ${
              cartCount > 0 ? "scale-100 opacity-100" : "scale-[.4] opacity-0"
            }`}
          >
            {cartCount}
          </span>
        </span>
      </span>
      <span className="ml-1.5 flex w-[26px] flex-col gap-[5px]" aria-hidden>
        {[0, 1, 2].map((i) => (
          <i key={i} className="h-[1.5px] rounded-sm bg-current" />
        ))}
      </span>
    </header>
  );
}
