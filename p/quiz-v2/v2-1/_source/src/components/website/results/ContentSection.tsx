import { PhotoMarquee } from "./PhotoMarquee";

// TODO(lift): sample data — replace with the bundle content section from the CMS
/* one photo from each bundle's set, twice over, so the loop closes on itself */
const PHOTOS = ["img/p1.jpg", "img/bb2.jpg", "img/pp1.jpg", "img/postp3.jpg"];

// TODO(lift): sample data — replace with the bundle content section from the CMS
/** [bold lead, supporting line] */
const POINTS: [string, string][] = [
  ["Frozen at peak freshness.", "To lock in nutrients."],
  ["Delivered to your door.", "No shopping, no carrying."],
  ["Ready under 10 minutes.", "From freezer to table. No prep, no planning."],
];

/** From quiz v1's variant A, the same for every goal: a headline, the marquee of photographs and four points down a line */
export function ContentSection() {
  return (
    <section className="flex flex-col gap-7 rounded-[32px] bg-(--bundle,var(--color-light-brown)) pt-16 pb-12">
      <h2 className="mx-6 my-0 font-book text-[34px] leading-9 tracking-[-0.68px] text-near-black">
        {/* TODO(lift): replace with translation key */}
        When dinner is sorted,
        <br />
        <i className="font-book-italic">the rest gets easier.</i>
      </h2>
      <PhotoMarquee photos={[...PHOTOS, ...PHOTOS]} />
      <div className="relative mx-6 flex flex-col gap-7">
        {/* the line the points hang from, behind the ticks */}
        <span className="absolute top-6 bottom-6 left-[23px] w-px bg-dark/25" aria-hidden />
        {/* TODO(lift): replace with translation keys */}
        {POINTS.map(([lead, rest]) => (
          <div key={lead} className="relative flex items-start gap-4">
            <span className="flex size-[46px] shrink-0 items-center justify-center rounded-full bg-white text-lg text-near-black shadow-[0_1px_3px] shadow-dark/12">
              ✓
            </span>
            <p className="m-0 pt-0.5">
              <b className="block text-base leading-[22px] font-medium tracking-[-0.32px] text-near-black">{lead}</b>
              <span className="mt-0.5 block text-[13px] leading-[19px] tracking-[-0.26px] text-dark/72">{rest}</span>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
