import { GlobalImageTextV2 } from "@/components/website/image-text/GlobalImageTextV2";
import { GlobalPillarsV2 } from "@/components/website/pillars/GlobalPillarsV2";
import { Headline } from "@/components/shared/Headline";
import { INGREDIENTS, IMAGE_TEXT } from "@/lib/body-balance-page-sample";
import { SATISFYING } from "@/lib/explore-sections-sample";
import { SectionShell } from "./SectionShell";

export type SatisfyingVariant = "stats" | "pillars" | "image" | "label";

type Props = {
  variant?: SatisfyingVariant;
};

const EYEBROW = "font-sans text-xs font-medium uppercase tracking-[-0.24px]";
const HEADLINE = "font-book text-[34px] leading-[34px] tracking-[-0.68px] lg:text-[48px] lg:leading-12.5 lg:tracking-[-0.96px] [&_em]:font-book-italic";
const BODY = "font-sans text-sm leading-4.75 tracking-[-0.28px] lg:text-lg lg:leading-[1.4] lg:tracking-[-0.36px]";
const HUGE = "font-book text-[64px] leading-16 tracking-[-1.28px] lg:text-[96px] lg:leading-24 lg:tracking-[-1.92px]";

const NUTRIENTS = [SATISFYING.protein, SATISFYING.fibre];

/** Four ways to show "under 500 kcal, deliciously satisfying". Pick with the studio's "Under 500 kcal" control. */
export function SatisfyingSection({ variant = "stats" }: Props) {
  if (variant === "pillars") return <PillarsVersion />;
  if (variant === "image") return <ImageVersion />;
  if (variant === "label") return <LabelVersion />;
  return <StatsVersion />;
}

/** Protein and fibre are numbers, so show them as numbers. */
function StatsVersion() {
  return (
    <SectionShell>
      <div className="flex flex-col gap-4">
        <h2 className={HEADLINE}>
          <Headline lead={`${SATISFYING.lead} `} italic={SATISFYING.italic} />
        </h2>
        <p className={`${BODY} lg:max-w-136`}>{SATISFYING.human}</p>
      </div>
      <div className="flex flex-col gap-3">
        <p className={EYEBROW}>{SATISFYING.science}</p>
        <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
          {NUTRIENTS.map((n) => (
            <div key={n.label} className="flex flex-col gap-6 rounded-[28px] bg-dark/6 p-6 lg:flex-1 lg:p-8">
              <p className={EYEBROW}>{n.label}</p>
              <p className="flex items-baseline gap-2">
                <span className={HUGE}>{n.value}</span>
                <span className="font-book-italic text-lg leading-5 tracking-[-0.36px]">{n.unit}</span>
              </p>
              <div className="flex flex-col gap-3">
                <p className={BODY}>{n.benefit}</p>
                <p className="font-sans text-xs leading-4 tracking-[-0.24px] text-dark/60">{n.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}

/** The existing pillars section, filled with the new copy. The honest "three things" layout. */
function PillarsVersion() {
  const [protein, fibre, whole] = INGREDIENTS.items;
  return (
    <GlobalPillarsV2
      eyebrow={SATISFYING.lead}
      headline={<Headline lead="" italic={SATISFYING.italic} />}
      backgroundColor={INGREDIENTS.backgroundColor}
      items={[
        { icon: protein.icon, title: SATISFYING.protein.label, body: `${SATISFYING.protein.benefit} ${SATISFYING.protein.value} ${SATISFYING.protein.unit} recommended daily for most adults [1, 2].` },
        { icon: fibre.icon, title: SATISFYING.fibre.label, body: `${SATISFYING.fibre.benefit} ${SATISFYING.fibre.value} ${SATISFYING.fibre.unit} recommended [3, 4].` },
        { icon: whole.icon, title: "Wholesome ingredients", body: "Plant-based protein and fibre from real food, to nourish your body and keep you satisfied." },
      ]}
    />
  );
}

/** The existing image-text section: a meal photo gives "deliciously" something to show. */
function ImageVersion() {
  return <GlobalImageTextV2 headline={<Headline lead={`${SATISFYING.lead} `} italic={SATISFYING.italic} />} body={SATISFYING.body} image={IMAGE_TEXT.image} />;
}

/** Bold: set like a nutrition label, with the numbers as the loudest thing on the page. */
function LabelVersion() {
  return (
    <SectionShell tone="dark">
      <div className="flex flex-col gap-4">
        <p className={`${EYEBROW} text-white/60`}>{SATISFYING.science}</p>
        <h2 className={`${HEADLINE} lg:text-[64px] lg:leading-16 lg:tracking-[-1.28px]`}>
          <Headline lead={`${SATISFYING.lead} `} italic={SATISFYING.italic} />
        </h2>
        <p className={`${BODY} text-white/70 lg:max-w-136`}>{SATISFYING.human}</p>
      </div>
      <ul className="flex flex-col border-t border-white/20">
        {NUTRIENTS.map((n) => (
          <li key={n.label} className="flex flex-col gap-4 border-b border-white/20 py-6 lg:flex-row lg:items-end lg:justify-between lg:gap-8 lg:py-8">
            <div className="flex flex-col gap-2 lg:max-w-80">
              <p className="font-book-italic text-2xl leading-6.5 tracking-[-0.48px]">{n.label}</p>
              <p className={`${BODY} text-white/70`}>{n.benefit}</p>
              <p className="font-sans text-xs leading-4 tracking-[-0.24px] text-white/50">{n.note}</p>
            </div>
            <p className="flex items-baseline gap-2 lg:justify-end">
              <span className={`${HUGE} text-bright-yellow`}>{n.value}</span>
              <span className="font-book-italic text-lg leading-5 tracking-[-0.36px] text-white/70">{n.unit}</span>
            </p>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
