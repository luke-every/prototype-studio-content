/**
 * Full-width section band for the Variant A/B homes. Sections run edge to edge, alternate
 * white → #FAF7F2 → white → #FAF7F2, and stack with a 32px rounded top edge that overlaps
 * the band above (the rounded look of the bundle PDPs, without floating cards).
 * Content inside stays on the 1120px grid.
 */
const TONES = {
  white: "bg-white",
  orange: "bg-paper", // was light orange #FFE0C2, now #FAF7F2
  orangeSoft: "bg-paper", // was very light orange #FFEFE1, now #FAF7F2
} as const;

export type BandTone = keyof typeof TONES;

export function Band({
  tone = "white", eyebrow, title, action, children, first, id, tight,
}: {
  tone?: BandTone; eyebrow?: string; title?: string; action?: React.ReactNode;
  children: React.ReactNode; first?: boolean; id?: string; tight?: boolean;
}) {
  return (
    <section id={id} className={`relative scroll-mt-16 ${TONES[tone]} ${first ? "pb-14 pt-2" : tight ? "-mt-8 rounded-t-[32px] pb-12 pt-6 sm:pt-7" : "-mt-8 rounded-t-[32px] pb-14 pt-9 sm:pt-11"}`}>
      <div className="mx-auto max-w-[1120px] px-4 sm:px-6">
        {(eyebrow || title) && (
          <div className="mb-5 flex items-end justify-between gap-3">
            <div>
              {eyebrow && <p className="eyebrow">{eyebrow}</p>}
              {title && <h2 className="mt-1 font-serif text-[26px] leading-tight text-ink sm:text-[30px]">{title}</h2>}
            </div>
            {action}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

/** A full-bleed image section in the same stack (e.g. the seasonal hero). */
export function BandBleed({ children }: { children: React.ReactNode }) {
  return <div className="relative -mt-8 overflow-hidden rounded-t-[32px] [&>section]:mx-0 [&>section]:rounded-none">{children}</div>;
}
