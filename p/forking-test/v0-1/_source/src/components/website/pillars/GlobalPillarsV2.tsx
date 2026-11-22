import Image from "next/image";
import type { ReactNode } from "react";
import { NARROW_INSET_BAND_CLASS } from "@/lib/section-width";

type Props = {
  eyebrow?: string;
  /** May contain <em> for the serif italic part */
  headline: ReactNode;
  items: { icon: string; title: string; body: string }[];
  /** "circle" sits each icon on a white disc */
  iconStyle?: "plain" | "circle";
  dividers?: boolean;
  backgroundColor: string;
  /** Nested content under the rows, e.g. the expert reviews carousel */
  children?: ReactNode;
};

/** Port of every-website `src/components/website/pillars/GlobalPillarsV2.tsx`: plain props, no image column, serif italic titles and icon markers only. */
export function GlobalPillarsV2({ eyebrow, headline, items, iconStyle = "plain", dividers = false, backgroundColor, children }: Props) {
  const circleIcons = iconStyle === "circle";

  return (
    <section className="w-full overflow-hidden rounded-4xl scroll-mt-19" style={{ backgroundColor: `${backgroundColor}80` }}>
      <div className={`lg:mx-auto lg:max-w-[1440px] lg:pl-40 ${NARROW_INSET_BAND_CLASS}`}>
        <div className="flex flex-col gap-6 px-6 pt-8 pb-16 md:px-8 lg:gap-6 lg:px-0 lg:py-16">
          <div className="flex flex-col gap-3">
            {eyebrow && <p className="font-sans text-xs font-medium uppercase tracking-[-0.24px] text-dark">{eyebrow}</p>}
            <h2 className="font-book text-[34px] leading-[34px] tracking-[-0.68px] text-dark lg:text-[48px] lg:leading-12.5 lg:tracking-[-0.96px] [&_em]:font-book-italic">{headline}</h2>
          </div>

          <ul className={`flex flex-col ${dividers ? "gap-4" : "gap-6"}`}>
            {items.map((item, index) => (
              <li
                key={item.title}
                className={`flex items-center gap-8 ${dividers && index < items.length - 1 ? "border-b border-light-grey pb-5" : ""}`}
              >
                <span className={`flex size-16 shrink-0 items-center justify-center ${circleIcons ? "rounded-full bg-white" : ""}`}>
                  <Image src={item.icon} alt="" width={64} height={64} unoptimized className={circleIcons ? "size-2/3 object-contain" : "size-full object-contain"} />
                </span>
                <span className="flex min-w-0 flex-col gap-3">
                  <span className="font-book-italic text-lg leading-5 tracking-[-0.36px] text-dark">{item.title}</span>
                  <span className="font-sans text-sm leading-[19px] tracking-[-0.28px] text-dark lg:leading-4.5">{item.body}</span>
                </span>
              </li>
            ))}
          </ul>

          {children && <div className="mt-2 lg:mt-10">{children}</div>}
        </div>
      </div>
    </section>
  );
}
