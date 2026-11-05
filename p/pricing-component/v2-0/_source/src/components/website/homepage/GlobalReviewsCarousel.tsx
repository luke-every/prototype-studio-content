import Image from "next/image";

export type ExpertReview = {
  image: string;
  name: string;
  credentials: string;
  quote: string;
};

type Props = {
  title: string;
  experts: ExpertReview[];
  /** Drops the section padding when sitting inside another section */
  embedded?: boolean;
};

/** Port of `ExpertReviewsCarouselV2` from every-website `src/components/website/homepage/GlobalReviewsCarousel.tsx`: plain props; a scroll row of narrow cards with the next one peeking. */
export function ExpertReviewsCarouselV2({ title, experts, embedded = false }: Props) {
  return (
    <section className={embedded ? "flex w-full flex-col gap-4" : "flex w-full flex-col gap-4 px-6 py-8 md:px-8 lg:px-40 lg:py-16"}>
      <h2 className="font-book text-xl leading-5 tracking-[-0.4px] text-dark lg:font-sans lg:text-2xl lg:leading-[26px] lg:tracking-[-0.48px]">{title}</h2>

      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {experts.map((expert) => (
          <div
            key={expert.name}
            className="flex w-70 shrink-0 snap-start flex-col gap-2 rounded-[14px] border border-light-grey bg-white p-4 shadow-[0_1px_3px_0_rgba(55,45,39,0.06)]"
          >
            <div className="flex items-center gap-3 pb-[5px]">
              <div className="relative size-16 shrink-0 overflow-hidden rounded-full">
                <Image src={expert.image} alt={expert.name} fill unoptimized className="object-cover" sizes="64px" />
              </div>
              <div className="flex min-w-0 flex-col gap-px">
                <span className="font-sans text-xs leading-4 tracking-[-0.24px] text-dark">{expert.name}</span>
                <span className="font-sans text-xs font-medium leading-4 tracking-[-0.24px] text-dark">{expert.credentials}</span>
              </div>
            </div>

            <div className="flex gap-1">
              <span aria-hidden className="font-book text-[34px] leading-[34px] text-dark">&ldquo;</span>
              <p className="font-sans text-xs leading-4 tracking-[-0.24px] text-dark">{expert.quote}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
