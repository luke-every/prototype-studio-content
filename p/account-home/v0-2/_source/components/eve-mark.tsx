import { asset } from "@/lib/data";

/**
 * Eve's face, redrawn from the Every character illustration (Illustrations/Every_character_A) as a
 * line icon so it stays crisp at 16–40 px. Uses currentColor, like the rest of the icon set.
 */
export function EveFace({ className = "size-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M28.6 39.4c-2 .9-4.3 1.4-6.7 1.4C13.8 40.8 7.6 34.6 7.6 26.6s6.2-14.2 14.3-14.2c8 0 14.2 6 14.2 13.8 0 1.6-.3 3.2-.8 4.6" strokeWidth="2.7" />
      <path d="M26.8 9.6c3.4-1.5 8.2-1.7 11-.4" strokeWidth="3" />
      <path d="M28.2 12.4c3-.5 6.8-.4 9.4.6" strokeWidth="2" />
      <path d="M16.8 18.9c3.4-.7 7.6-.3 11 .9" strokeWidth="2.5" />
      <path d="M12.6 23.6c.9 1.5 2.5 1.9 3.8.8" strokeWidth="2.3" />
      <path d="M22.8 24.4c.9 1.5 2.6 1.9 4 .8" strokeWidth="2.3" />
      <path d="M19.8 21.6l-1 4.4" strokeWidth="2.2" />
      <path d="M14.2 29.8c1.6-.8 3.5-.4 3.7.8.2 1.1-1 1.6-1.9 1" strokeWidth="2.1" />
      <path d="M27.4 29.4c2-1.2 4.9-1.1 6.7.5 2 1.8 1.9 4.9-.3 6.7-2.2 1.8-5.6 1.6-7.3-.5" strokeWidth="2.7" />
    </svg>
  );
}

/** Full-body Eve for larger moments (chat greeting, start-fresh intro). Dark line art on a transparent background. */
export function EveFigure({ pose = "wave", className = "h-24 w-auto" }: { pose?: "wave" | "squash"; className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={asset(`/eve/eve-${pose}.png`)} alt="" className={className} />;
}
