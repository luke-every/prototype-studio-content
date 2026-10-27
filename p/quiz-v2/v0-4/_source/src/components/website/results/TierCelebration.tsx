"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/shared/Button";
import { TagIcon } from "@/components/icons";

type Props = {
  /** The new quantity discount, as a rate: 0.2 for 20% off */
  rate: number;
  onDismiss: () => void;
};

const CLOSE_MS = 300;

const COLOURS = ["bg-white", "bg-signal-orange", "bg-bright-yellow", "bg-light-orange"];

/* the confetti, worked out once: each piece flies out from the badge at its own angle and speed */
const CONFETTI = Array.from({ length: 44 }, (_, i) => {
  const angle = (i / 44) * Math.PI * 2 + (i % 3) * 0.2;
  const reach = 110 + ((i * 53) % 150);
  return {
    colour: COLOURS[i % COLOURS.length],
    round: i % 4 === 0,
    delay: ((i * 37) % 30) * 8,
    style: {
      "--dx": `${Math.round(Math.cos(angle) * reach)}px`,
      "--dy": `${Math.round(Math.sin(angle) * reach - 60)}px`,
      "--turn": `${((i * 71) % 720) - 360}deg`,
    } as React.CSSProperties,
  };
});

/** Rises in a beat after the one before it */
const rise = (index: number) => ({ className: "animate-rise-up", style: { animationDelay: `${400 + index * 90}ms` } });

/**
 * A tier unlocked: the box has just crossed into a bigger discount. A full-screen moment over the
 * page, a slow gradient behind a big badge, confetti, and one way out.
 */
export function TierCelebration({ rate, onDismiss }: Props) {
  const [closing, setClosing] = useState<boolean>(false);
  const percent = Math.round(rate * 100);

  const close = () => {
    if (closing) return;
    setClosing(true);
    window.setTimeout(onDismiss, CLOSE_MS);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setClosing(true);
        window.setTimeout(onDismiss, CLOSE_MS);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onDismiss]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${percent}% off is now active`}
      className={`absolute inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-near-black px-8 text-center text-white transition-opacity duration-300 ease-ui ${
        closing ? "opacity-0" : "animate-page-in"
      }`}
    >
      {/* the gradient: three warm lights drifting under a blur */}
      <div aria-hidden className="absolute inset-0 blur-3xl">
        <span className="animate-blob-drift absolute -top-1/4 -left-1/4 size-[85%] rounded-full bg-signal-orange opacity-80" />
        <span className="animate-blob-drift absolute top-1/3 -right-1/3 size-[80%] rounded-full bg-bright-yellow opacity-50 [animation-delay:-3s] [animation-duration:9s]" />
        <span className="animate-blob-drift absolute -bottom-1/4 left-0 size-[75%] rounded-full bg-light-orange opacity-60 [animation-delay:-5s] [animation-duration:8s]" />
      </div>

      <div className="relative flex flex-col items-center">
        <div className="relative flex size-32 items-center justify-center">
          <span aria-hidden className="animate-ring-pulse absolute inset-0 rounded-full border border-white/70" />
          <span aria-hidden className="animate-ring-pulse absolute inset-0 rounded-full border border-white/70 [animation-delay:-1.2s]" />
          <div className="animate-badge-in flex size-32 items-center justify-center rounded-full bg-white text-signal-orange shadow-2xl">
            <TagIcon size={56} />
          </div>
          {/* the confetti leaves from the badge's centre */}
          <div aria-hidden className="pointer-events-none absolute top-1/2 left-1/2">
            {CONFETTI.map((piece, i) => (
              <span
                key={i}
                className={`animate-confetti-burst absolute -top-1 -left-1 block ${piece.colour} ${piece.round ? "size-2 rounded-full" : "h-3 w-1.5 rounded-[2px]"}`}
                style={{ ...piece.style, animationDelay: `${300 + piece.delay}ms` }}
              />
            ))}
          </div>
        </div>

        {/* TODO(lift): replace with translation keys */}
        <p
          className={`${rise(0).className} m-0 mt-12 text-xs leading-4 font-medium tracking-[1.8px] text-white/80 uppercase`}
          style={rise(0).style}
        >
          Discount unlocked
        </p>
        <h2
          className={`${rise(1).className} m-0 mt-3 font-book text-[56px] leading-[56px] tracking-[-1.12px] text-white`}
          style={rise(1).style}
        >
          {percent}% off
          <br />
          <i className="font-book-italic">is now active</i>
        </h2>
        <p
          className={`${rise(2).className} m-0 mt-4 max-w-[280px] text-sm leading-[18px] tracking-[-0.28px] text-white/85`}
          style={rise(2).style}
        >
          Applied to every meal in your box.
        </p>
      </div>

      <div className={`${rise(3).className} absolute inset-x-6 bottom-8`} style={rise(3).style}>
        <Button
          type="button"
          variant="white"
          onClick={close}
          aria-label="Dismiss"
          sizeClassName="h-12"
          className="w-full justify-center rounded-[30px] text-xs font-medium tracking-[1.8px] uppercase transition-[scale] duration-[240ms] ease-spring active:scale-[.975] active:duration-[90ms] active:ease-out"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
