import Image from "next/image";
import { DeliveryBoxIcon, PanIcon, PointerIcon } from "@/components/icons";
import { MerchantRating } from "@/components/website/homepage/MerchantRating";

type Props = {
  rating?: { label: string; average: number };
  headline: string;
  subheadline: string;
  bullets?: string[];
  heroImage: string;
  /** Portrait crop for mobile; falls back to heroImage */
  heroImageMobile?: string;
  backgroundColor: string;
  ctaLabel: string;
  /** Line under the CTA */
  ctaFootnote?: string;
  onCtaClick?: () => void;
};

const BULLET_ICONS = [DeliveryBoxIcon, PanIcon, PointerIcon];

/** Port of every-website `src/components/website/product-hero/ProductHeroV2.tsx`: no Storyblok blok, no bundle fetch, no cart. */
export function ProductHeroV2({ rating, headline, subheadline, bullets = [], heroImage, heroImageMobile, backgroundColor, ctaLabel, ctaFootnote, onCtaClick }: Props) {
  // Same colour at zero alpha: a gradient to the `transparent` keyword fades through transparent black, which Safari renders as a grey smear.
  const fadeToNothing = `${backgroundColor}00`;

  return (
    <section className="w-full scroll-mt-19 rounded-b-4xl" style={{ backgroundColor }}>
      <div className="lg:mx-auto lg:max-w-[1440px] lg:px-40 lg:pt-[calc(4rem+var(--header-overlay-h,138px))]">
        <div className="relative">
          <div className="relative h-[26rem] w-full overflow-hidden lg:hidden">
            <Image src={heroImageMobile ?? heroImage} alt="" fill priority sizes="100vw" className="object-cover" />
            <div
              className="absolute inset-x-0 bottom-0 h-48"
              style={{ backgroundImage: `linear-gradient(to top, ${backgroundColor} 0%, ${backgroundColor} 20%, ${fadeToNothing} 100%)` }}
            />
          </div>

          <div className="relative hidden w-full overflow-hidden lg:block lg:aspect-[736/336] lg:max-w-[calc(100%-384px)] lg:rounded-4xl">
            <Image src={heroImage} alt="" fill priority sizes="736px" className="object-cover" />
          </div>

          <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-3 px-6 pb-0 md:px-8 lg:static lg:max-w-[calc(100%-384px)] lg:px-6 lg:pt-8">
            {rating && <MerchantRating label={rating.label} average={rating.average} />}
            <h1 className="font-book text-[34px] leading-8.5 tracking-[-0.68px] text-dark lg:text-[48px] lg:leading-12.5 lg:tracking-[-0.96px]">
              {headline}
            </h1>
          </div>
        </div>

        <div className="flex flex-col gap-6 px-6 pt-6 pb-12 md:px-8 md:pt-8 lg:max-w-[calc(100%-384px)] lg:px-6 lg:pt-4 lg:pb-32">
          <div className="flex flex-col gap-4">
            <p className="max-w-125 font-sans text-sm leading-4.75 tracking-[-0.28px] text-dark lg:max-w-172 lg:text-lg lg:leading-[1.4] lg:tracking-[-0.36px]">
              {subheadline}
            </p>
            {bullets.length > 0 && (
              <ul className="flex flex-col gap-2">
                {bullets.map((bullet, index) => {
                  const Icon = BULLET_ICONS[index];
                  return (
                    <li key={bullet} className="flex items-center gap-2">
                      {Icon ? (
                        <Icon size={24} className="shrink-0" />
                      ) : (
                        <span className="w-6 shrink-0 text-center font-sans text-xs text-dark" aria-hidden="true">✓</span>
                      )}
                      <span className="font-sans text-sm leading-4.75 tracking-[-0.28px] text-dark lg:leading-4.5">{bullet}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Mobile only: on desktop the sticky bundle card carries the CTA. data-hero-cta is what the sticky bar watches. */}
          <div data-hero-cta className="w-full lg:hidden">
            <button
              type="button"
              onClick={onCtaClick}
              aria-label={ctaLabel}
              className="w-full cursor-pointer rounded-[24px] bg-dark px-9 pt-[18px] pb-4 text-center font-sans text-[14px] leading-[14px] uppercase tracking-[2px] text-white"
            >
              {ctaLabel}
            </button>
            {ctaFootnote && <p className="mt-4 text-center font-sans text-xs leading-4 tracking-[-0.24px] text-dark">{ctaFootnote}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
