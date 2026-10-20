"use client";

import { useEffect, useState } from "react";
import { asset, dish } from "@/lib/data";
import { useStore } from "@/lib/store";
import { plantCount } from "./plan";
import { Icon } from "./ui";

/** Every Wrapped, monthly (Spotify Wrapped): identity label, cumulative impact, favourite. No calories, no weight. Free. */
export function Wrapped({ onClose }: { onClose: () => void }) {
  const { s, p, toast, track } = useStore();
  const [i, setI] = useState(0);
  const fav = dish(p.favourite);
  const plants = 41 + plantCount(s);

  const slides = [
    { bg: "bg-olive", eyebrow: "September, in plants", big: `${plants}`, line: "different plants this month. Herbs, lentils, seeds, all of it counted.", img: null },
    { bg: "bg-terra", eyebrow: "Time you got back", big: "11 h", line: "not spent chopping, planning or washing up. That's a long walk every week.", img: null },
    { bg: "bg-brown", eyebrow: "Your favourite", big: fav.name, line: `You kept it every time it came up. Eve will make sure it keeps showing up.`, img: fav.img },
    { bg: "bg-ink", eyebrow: "Your eating style", big: p.label, line: p.id === "mia" ? "You try something new most weeks and still keep your protein steady." : p.id === "jonas" ? "Busy weeks and all, you kept lunch sorted more often than not." : "Not perfect, just steady. 11 of your last 14 planned meals, eaten.", img: null },
  ];
  const sl = slides[i];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setI((x) => Math.min(slides.length - 1, x + 1));
      if (e.key === "ArrowLeft") setI((x) => Math.max(0, x - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, slides.length]);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/70 p-0 animate-fade-in sm:p-6" role="dialog" aria-modal="true" aria-label="Every Wrapped">
      <div className={`relative flex h-dvh w-full flex-col overflow-hidden text-paper transition-colors duration-500 sm:h-[720px] sm:max-w-[400px] sm:rounded-[32px] ${sl.bg}`}>
        <div className="flex gap-1.5 px-4 pt-4">
          {slides.map((_, k) => <span key={k} className={`h-1 flex-1 rounded-full ${k <= i ? "bg-paper" : "bg-paper/30"}`} />)}
        </div>
        <div className="flex items-center justify-between px-5 pt-3">
          <span className="text-[13px] text-paper/70">Every Wrapped · {p.name}</span>
          <button onClick={onClose} aria-label="Close" className="grid size-9 place-items-center rounded-full bg-paper/15"><Icon name="close" className="size-4" /></button>
        </div>

        <button className="absolute inset-y-0 left-0 z-10 w-1/3" aria-label="Previous" onClick={() => setI((x) => Math.max(0, x - 1))} />
        <button className="absolute inset-y-0 right-0 z-10 w-2/3" aria-label="Next" onClick={() => setI((x) => Math.min(slides.length - 1, x + 1))} />

        <div key={i} className="flex flex-1 flex-col justify-center px-7 animate-sheet-up">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {sl.img && <img src={asset(sl.img)} alt="" className="mb-6 size-40 rounded-full object-cover ring-4 ring-paper/20" />}
          <span className="text-[12px] uppercase tracking-[.1em] text-paper/70">{sl.eyebrow}</span>
          <p className="mt-3 font-serif text-[56px] leading-[0.95]">{sl.big}</p>
          <p className="mt-4 max-w-[30ch] text-[17px] leading-snug text-paper/85">{sl.line}</p>
        </div>

        <div className="relative z-20 px-5 pb-6">
          {i === slides.length - 1 ? (
            <button onClick={() => { track("wrapped:share"); toast("Share card copied. Ready to post."); }} className="flex w-full items-center justify-center gap-2 rounded-full bg-paper py-3.5 text-[15px] font-medium text-ink">
              <Icon name="share" className="size-4" /> Share my month
            </button>
          ) : (
            <p className="text-center text-[12.5px] text-paper/60">Tap to continue</p>
          )}
        </div>
      </div>
    </div>
  );
}
