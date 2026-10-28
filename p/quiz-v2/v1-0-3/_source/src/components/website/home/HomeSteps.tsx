import Image from "next/image";
import { HomeMealCard } from "./HomeMealCard";
import { HOME_MEALS, HOW_IT_WORKS, HOW_IT_WORKS_COLOR } from "./sample-data";

export function HomeSteps() {
  return (
    <section className="rounded-[32px] pt-8 pb-40" style={{ backgroundColor: HOW_IT_WORKS_COLOR }}>
      {/* TODO(lift): replace with translation key */}
      <p className="mx-6 text-xs leading-4 font-medium tracking-[-0.24px] text-dark/65">HOW IT WORKS</p>
      {/* TODO(lift): replace with translation key */}
      <h2 className="mx-6 mt-3 font-book text-[34px] leading-[34px] tracking-[-0.68px] text-dark">
        From freezer to table in <i className="font-book-italic">three steps.</i>
      </h2>
      {/* TODO(lift): replace with translation key */}
      <p className="mx-6 mt-3 text-sm leading-[19px] tracking-[-0.28px] text-dark">
        No planning, no prep, no stress. Pick your meals, heat for 10 minutes, and eat. That&rsquo;s it.
      </p>
      {/* the three steps hang off a 2px line that runs between the first and last dot */}
      <div className="relative mx-6 mt-[21px] flex flex-col gap-8">
        <span className="absolute top-6 bottom-6 left-[15px] w-0.5 bg-dark/30" aria-hidden />
        {HOW_IT_WORKS.map(([title, copy], i) => (
          <div key={title} className="relative flex items-start gap-10">
            <span
              className="relative size-8 shrink-0 rounded-2xl drop-shadow-[0_4px_7px] drop-shadow-dark/18"
              style={{ backgroundColor: HOW_IT_WORKS_COLOR }}
            >
              <Image src={`img/hp-step${i + 1}.png`} alt="" fill sizes="32px" className="object-contain" />
            </span>
            <p className="m-0 flex flex-col gap-0.5">
              <b className="text-base leading-[22px] font-medium tracking-[-0.32px] text-dark">{title}</b>
              <span className="text-xs leading-4 tracking-[-0.24px] text-dark">{copy}</span>
            </p>
          </div>
        ))}
      </div>
      <div className="scrollbar-hide flex snap-x snap-mandatory scroll-pl-6 items-start gap-4 overflow-x-auto px-6 pt-8">
        {HOME_MEALS.map((meal) => (
          <HomeMealCard key={meal.name} meal={meal} />
        ))}
      </div>
    </section>
  );
}
