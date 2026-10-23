import Image from "next/image";
import type { ReactNode } from "react";

type Props = {
  /** May contain <em> for the serif italic part */
  headline: ReactNode;
  subheadline: string;
  image?: string;
  imageAlt?: string;
};

/** Port of every-website `src/components/website/BelowHeroUsp.tsx` (`below_hero_usp`): plain props instead of the Storyblok blok. */
export function BelowHeroUsp({ headline, subheadline, image, imageAlt = "" }: Props) {
  return (
    <section className="w-full bg-white px-6 pt-8 pb-16 lg:px-40 lg:pt-16 lg:pb-32">
      <div className="flex max-w-105 flex-col gap-6 lg:mx-auto lg:max-w-280 lg:flex-row lg:items-center lg:gap-20">
        <div className="order-1 flex flex-col gap-4 lg:order-2 lg:flex-1">
          <h2 className="font-book text-[20px] leading-5 tracking-[-0.4px] text-dark lg:text-[48px] lg:leading-12.5 lg:tracking-[-0.96px] [&_em]:font-book-italic">{headline}</h2>
          <p className="font-sans text-sm leading-4.75 tracking-[-0.28px] text-dark lg:text-lg lg:leading-[1.4] lg:tracking-[-0.36px]">{subheadline}</p>
        </div>

        {image && (
          <div className="relative order-2 aspect-353/282 w-full shrink-0 overflow-hidden rounded-[20px] lg:order-1 lg:aspect-4/3 lg:w-130">
            <Image src={image} alt={imageAlt} fill className="object-cover" sizes="(max-width: 1023px) 100vw, 520px" />
          </div>
        )}
      </div>
    </section>
  );
}
