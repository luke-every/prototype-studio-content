import Image from "next/image";
import { FACTS } from "./sample-data";

export function HomeFacts() {
  return (
    <section className="bg-white px-5 py-8">
      {/* TODO(lift): replace with translation key */}
      <h2 className="m-0 text-center font-book text-2xl leading-[26px] tracking-[-0.48px] text-near-black">
        Real results after <i className="font-book-italic">3 months.</i>
      </h2>
      <div className="mt-4 grid grid-cols-2 pb-4">
        {FACTS.map(([percent, label], i) => (
          <div key={percent} className="flex flex-col items-center px-2 text-center">
            <span className="relative block size-[100px]">
              <Image src={`img/hp-fact${i + 1}.png`} alt="" fill sizes="100px" className="object-contain" />
            </span>
            <b className="mt-4 block font-book text-[34px] leading-[34px] font-normal tracking-[-0.68px] text-near-black">
              {percent}
            </b>
            <span className="mt-2.5 block max-w-[15ch] text-sm leading-[19px] tracking-[-0.28px] text-near-black">
              {label}
            </span>
          </div>
        ))}
      </div>
      {/* TODO(lift): replace with translation key */}
      <p className="mx-[19px] mt-4 text-center text-xs leading-[19px] tracking-[-0.24px] text-near-black/55">
        *Self-reported experiences from participants in our 3-month plan consuming every 5x/week. Percentages reflect
        the share of respondents who reported an improvement in each category.
      </p>
    </section>
  );
}
