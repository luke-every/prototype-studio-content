import { useEffect, useState } from "react";

/** A phone viewport shorter than this (px, browser toolbars showing) counts as short: in-app browsers, small iPhones. Matches where the card images start to shrink. */
const SHORT_BELOW = 640;

/**
 * True on a short viewport. Measured in svh, not innerHeight: Safari's toolbars collapse on scroll and grow the viewport,
 * which would flip layouts back and forth while scrolling. svh stays put; it only changes on resize, such as rotating the phone.
 */
export function useShortViewport(): boolean {
  const [short, setShort] = useState<boolean>(false);

  useEffect(() => {
    const probe = document.createElement("div");
    probe.style.cssText = "position:fixed;top:0;width:0;height:100svh;visibility:hidden;pointer-events:none";
    document.body.appendChild(probe);
    const measure = () => setShort((probe.offsetHeight || window.innerHeight) < SHORT_BELOW);
    measure();
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("resize", measure);
      probe.remove();
    };
  }, []);

  return short;
}
