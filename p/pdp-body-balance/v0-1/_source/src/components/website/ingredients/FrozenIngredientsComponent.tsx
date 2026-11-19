import Image from "next/image";
import type { ReactNode } from "react";

type Props = {
  eyebrow: string;
  /** May contain <em> for the serif italic part */
  headline: ReactNode;
  body: string;
  summerNote?: string;
  /** Still frame, shown when there is no video */
  posterImage?: string;
  videoSrc?: string;
  backgroundColor?: string;
  /** Nested blocks under the main content, e.g. the expert reviews carousel (pass it `embedded`) */
  children?: ReactNode;
};

/** Port of every-website `src/components/website/ingredients/FrozenIngredientsComponent.tsx`: plain props; the nested `block` becomes `children`. */
export function FrozenIngredientsComponent({ eyebrow, headline, body, summerNote, posterImage, videoSrc, backgroundColor = "#EEEAE6", children }: Props) {
  return (
    <section className="flex w-full flex-col gap-8 rounded-4xl px-6 pt-8 pb-16 lg:gap-12 lg:px-40 lg:py-16" style={{ backgroundColor }}>
      <div className="flex flex-col gap-6 lg:mx-auto lg:max-w-280 lg:flex-row lg:items-center lg:gap-20">
        <div className="flex flex-col gap-6 lg:flex-1 lg:gap-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <p className="font-sans text-xs font-medium tracking-[-0.24px] text-dark">{eyebrow}</p>
              <h2 className="font-book text-2xl leading-6.5 tracking-[-0.48px] text-dark lg:text-[48px] lg:leading-12.5 lg:tracking-[-0.96px] [&_em]:font-book-italic">{headline}</h2>
            </div>
            <p className="whitespace-pre-line font-sans text-sm leading-4.75 tracking-[-0.28px] text-dark lg:text-lg lg:leading-[1.4] lg:tracking-[-0.36px]">{body}</p>
          </div>

          {summerNote && <p className="font-book-italic text-lg leading-5 tracking-[-0.36px] text-dark">{summerNote}</p>}
        </div>

        {(videoSrc || posterImage) && (
          <div className="relative aspect-4/3 w-full overflow-hidden rounded-[28px] lg:w-130 lg:shrink-0">
            {videoSrc ? (
              <video src={videoSrc} poster={posterImage} autoPlay muted loop playsInline className="absolute inset-0 size-full object-cover" />
            ) : (
              posterImage && <Image src={posterImage} alt="" fill className="object-cover" sizes="(max-width: 1023px) 100vw, 560px" />
            )}
          </div>
        )}
      </div>

      {children}
    </section>
  );
}
