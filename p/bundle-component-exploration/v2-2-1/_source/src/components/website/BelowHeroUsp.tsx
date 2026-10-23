import Image from "next/image";

type Props = {
  headline: string;
  subheadline: string;
  image?: { src: string; alt?: string };
};

/** Front-end-only port of BelowHeroUsp: no Storyblok blok, headline is a plain string. */
export function BelowHeroUsp({ headline, subheadline, image }: Props) {
  return (
    <section className="w-full bg-white pt-8 pb-16 px-6 lg:pt-16 lg:pb-32 lg:px-40">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-20 max-w-105 lg:max-w-280 lg:mx-auto">
        <div className="order-1 flex flex-col gap-4 lg:order-2 lg:flex-1">
          <h2 className="font-book text-[20px] leading-5 text-dark tracking-[-0.4px] lg:text-[48px] lg:leading-12.5 lg:tracking-[-0.96px]">
            {headline}
          </h2>
          <p className="font-sans text-sm leading-4.75 text-dark tracking-[-0.28px] lg:text-lg lg:leading-[1.4] lg:tracking-[-0.36px]">
            {subheadline}
          </p>
        </div>

        {image && (
          <div className="order-2 relative w-full aspect-353/282 rounded-[20px] overflow-hidden shrink-0 lg:order-1 lg:w-130 lg:aspect-4/3">
            <Image src={image.src} alt={image.alt ?? ""} fill className="object-cover" sizes="(max-width: 1023px) 100vw, 520px" />
          </div>
        )}
      </div>
    </section>
  );
}
