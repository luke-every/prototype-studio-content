import Image from "next/image";
import Link from "next/link";
import { ReviewsIoIcon, StarIcon } from "@/components/icons";
import { FooterAccordionNav } from "./FooterAccordionNav";

type Props = {
  logoSrc: string;
  tagline: string;
  nav: { title: string; links: { label: string; href: string }[] }[];
  social: { label: string; icon: string; href: string }[];
  legal: { label: string; href: string }[];
  payments: { label: string; icon: string }[];
  rating: { average: number };
};

function StarRating({ average }: { average: number }) {
  const fullStars = Math.round(average);
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon key={i} fill={i < fullStars ? "black" : "#D1D5DB"} />
      ))}
    </div>
  );
}

/** Port of every-website `src/components/website/Footer.tsx`: plain props, no Storyblok or reviews.io fetch. */
export function Footer({ logoSrc, tagline, nav, social, legal, payments, rating }: Props) {
  const socialLinks = social.map((item) => (
    <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" aria-label={`Follow us on ${item.label}`}>
      <Image src={item.icon} alt={item.label} width={28} height={28} unoptimized />
    </a>
  ));

  return (
    <footer className="bg-background">
      <div className="flex flex-col gap-6 lg:hidden">
        <div className="flex flex-col gap-6 px-4 pt-6">
          <div className="flex flex-col gap-1">
            <Link href="#" aria-label="every home">
              <Image src={logoSrc} alt="every" width={64} height={21} unoptimized style={{ width: "auto", height: "auto" }} />
            </Link>
            <p className="font-sans text-[14px] leading-[19px] tracking-[-0.28px] text-near-black">{tagline}</p>
          </div>
          <div className="flex gap-3">{socialLinks}</div>
        </div>

        <FooterAccordionNav columns={nav} />

        <div className="flex items-center justify-center gap-3 px-4">
          {payments.map((payment) => (
            <Image key={payment.label} src={payment.icon} alt={payment.label} width={28} height={20} unoptimized />
          ))}
        </div>

        <div className="border-t border-light-grey-2 px-4 py-8">
          <div className="flex w-[123px] flex-col gap-3">
            <ReviewsIoIcon />
            <div className="flex items-center gap-1.5">
              <span className="font-sans text-base leading-[22px] tracking-[-0.32px] text-near-black">{rating.average.toFixed(2)}</span>
              <StarRating average={rating.average} />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto hidden max-w-[1440px] px-7 py-16 lg:block">
        <div className="grid grid-cols-6 gap-6">
          <div className="col-span-1">
            <Link href="#" aria-label="every home">
              <Image src={logoSrc} alt="every" width={78} height={27} unoptimized style={{ width: "auto", height: "auto" }} />
            </Link>
            <p className="mt-4 font-sans text-sm text-near-black">{tagline}</p>
            <div className="mt-4 flex gap-3">{socialLinks}</div>
            <div className="mt-6 flex flex-wrap gap-x-1 gap-y-1 font-sans text-xs text-near-black">
              {legal.map((link, i) => (
                <span key={link.label}>
                  <Link href={link.href} className="hover:underline">
                    {link.label}
                  </Link>
                  {i < legal.length - 1 && <span className="ml-1">|</span>}
                </span>
              ))}
            </div>
          </div>

          {nav.map((column) => (
            <div key={column.title} className="col-span-1">
              <h3 className="font-sans text-xs font-bold uppercase tracking-[1.4px] text-near-black">{column.title}</h3>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="font-sans text-sm text-light-text hover:underline">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="col-span-1">
            <div className="mb-3">
              <ReviewsIoIcon />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="mt-1 font-sans text-base text-near-black">{rating.average.toFixed(2)}</span>
              <StarRating average={rating.average} />
            </div>
            <div className="mt-18 flex flex-wrap gap-2">
              {payments.map((payment) => (
                <Image key={payment.label} src={payment.icon} alt={payment.label} width={38} height={27} unoptimized />
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
