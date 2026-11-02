import Image from "next/image";
import type { HomeMeal } from "./sample-data";

type Props = {
  meal: HomeMeal;
};

export function HomeMealCard({ meal }: Props) {
  return (
    <div className="w-[300px] shrink-0 snap-start overflow-hidden rounded-[28px] border border-light-grey bg-white shadow-[0_3px_12px] shadow-dark/8">
      <div className="relative h-[223.5px] bg-light-grey">
        <Image src={meal.image} alt={meal.name} fill sizes="300px" className="object-cover" />
        <div className="absolute inset-x-3.5 bottom-[11px] flex flex-wrap gap-2">
          {meal.tags.map((tag) => (
            <span key={tag} className="rounded bg-white px-2 py-1 text-[8px] leading-[13px] tracking-[-0.16px] text-near-black">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-1 px-4 pt-4">
        <p className="m-0 text-xs leading-4 font-medium tracking-[-0.24px] text-dark">{meal.eyebrow}</p>
        <h3 className="m-0 pt-px font-book text-xl leading-5 font-normal tracking-[-0.4px] text-dark">{meal.name}</h3>
        <p className="m-0 flex items-baseline gap-[4.71px] pb-3 text-sm leading-[15px] font-medium tracking-[-0.28px] text-dark">
          {meal.price}
          <s className="opacity-50">{meal.was}</s>
        </p>
      </div>
      <div className="flex border-t border-light-grey">
        {meal.macros.map(([value, label]) => (
          <div key={label} className="min-w-0 flex-1 border-light-grey px-2 py-3.5 text-center not-first:border-l">
            <b className="block font-book text-2xl leading-[26px] font-normal tracking-[-0.48px] text-dark">{value}</b>
            <span className="mt-[3px] block text-xs leading-4 font-medium tracking-[-0.24px] text-dark">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
