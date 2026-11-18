import type { ReactNode } from "react";
import Image from "next/image";
import { Button } from "@/components/shared/Button";
import { BUNDLES, type Bundle } from "./bundles";
import { FACTS, type BundleFacts } from "./BundleComparisonA.data";

const BODY = "font-sans text-sm leading-[19px] tracking-[-0.28px]";
const NUMERAL = "font-book text-lg leading-[22px] tracking-[-0.36px] text-near-black";
// Image, name + headline, five facts, button: every card spans the same rows so facts line up across cards on desktop.
export const ROW_COUNT = 8;

type FactKey = "protein" | "fibre" | "kcal" | "allDay" | "extra";

/** Lower ranks first; the bundle with the lowest rank wins that fact. */
const RANKS: { key: FactKey; rank: (f: BundleFacts) => number }[] = [
  { key: "protein", rank: (f) => -f.protein },
  { key: "fibre", rank: (f) => -(BUNDLES.find((b) => b.key === f.key)?.macros.fibre ?? 0) },
  { key: "kcal", rank: (f) => f.kcal },
  { key: "allDay", rank: (f) => (f.allDay ? 0 : 1) },
  { key: "extra", rank: (f) => -(BUNDLES.find((b) => b.key === f.key)?.gifts.length ?? 0) },
];

/** The fact a bundle is best at: the first one it wins. It is tinted in the bundle's colour. */
function strengthOf(f: BundleFacts): FactKey | undefined {
  return RANKS.find((r) => r.rank(f) === Math.min(...FACTS.map(r.rank)))?.key;
}

function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex min-h-12 items-center justify-between gap-4 border-t border-light-grey py-3">
      <span className={`${BODY} text-light-text`}>{label}</span>
      <span className={`${BODY} flex items-center gap-2 text-right text-near-black`}>{children}</span>
    </div>
  );
}

function Value({ lead, b, children }: { lead: boolean; b: Bundle; children: ReactNode }) {
  return (
    <span className="-mr-2 inline-flex items-baseline gap-1 rounded-full px-2 py-0.5" style={lead ? { backgroundColor: b.colors.tile } : undefined}>
      {children}
    </span>
  );
}

/** One bundle card. Mobile: bordered, the bundle name as a tag in its colour under the image. Desktop: plain column, name under the image. */
export function BundleCardA({ f, b }: { f: BundleFacts; b: Bundle }) {
  const strength = strengthOf(f);

  return (
    <article
      className="flex flex-col rounded-2xl border border-light-grey-2 p-4 lg:grid lg:grid-rows-subgrid lg:rounded-none lg:border-0 lg:p-0"
      style={{ gridRow: `span ${ROW_COUNT}` }}
      aria-label={b.title}
    >
      <div className="relative aspect-[256/195] w-full overflow-clip rounded-[18px] lg:aspect-[256/215]" style={{ backgroundColor: b.colors.tile }}>
        <div className="absolute" style={b.art}>
          <Image src={b.image} alt="" fill sizes="(min-width: 1024px) 256px, 100vw" className="object-cover" />
        </div>
      </div>

      <span
        className="mt-3 w-fit rounded-full px-3 py-1.5 font-sans text-sm font-medium leading-[19px] tracking-[-0.28px] text-near-black lg:hidden"
        style={{ backgroundColor: b.colors.tile }}
      >
        {b.title}
      </span>

      <div className="flex flex-col gap-1 pb-4 pt-4">
        <h3 className={`${BODY} hidden font-medium text-near-black lg:block`}>{b.title}</h3>
        {/* TODO(lift): replace with translation key */}
        <p className="font-book text-2xl leading-7 tracking-[-0.48px] text-near-black">{f.headline}</p>
      </div>

      {/* TODO(lift): replace labels with translation keys */}
      <Fact label="Protein per meal">
        <Value lead={strength === "protein"} b={b}>
          <span className={NUMERAL}>{f.protein}</span>g
        </Value>
      </Fact>
      <Fact label="Fibre per meal">
        <Value lead={strength === "fibre"} b={b}>
          <span className={NUMERAL}>{b.macros.fibre}</span>g
        </Value>
      </Fact>
      <Fact label="Calories per meal">
        <Value lead={strength === "kcal"} b={b}>
          <span className={NUMERAL}>{f.kcal}</span>kcal
        </Value>
      </Fact>
      {/* Only shown when included; on desktop an empty cell keeps the other rows lined up across cards */}
      {f.allDay ? (
        <Fact label="Breakfast and snacks">
          <Value lead={strength === "allDay"} b={b}>
            Included
          </Value>
        </Fact>
      ) : (
        <div className="hidden lg:block" aria-hidden="true" />
      )}
      {b.gifts.length > 0 ? (
        <Fact label="Free extras">
          <Value lead={strength === "extra"} b={b}>
            <span className="flex flex-col items-end gap-1">
              {b.gifts.map((gift) => (
                <span key={gift.name} className="flex items-center gap-2">
                  <span className="relative size-6 shrink-0 overflow-hidden rounded-md bg-light-grey">
                    <Image src={gift.image} alt="" fill sizes="24px" className="object-cover" />
                  </span>
                  {gift.name}
                </span>
              ))}
            </span>
          </Value>
        </Fact>
      ) : (
        <div className="hidden lg:block" aria-hidden="true" />
      )}

      <Button
        variant="dark"
        sizeClassName="h-11 px-6"
        className="mt-6 w-full justify-center self-end font-sans text-xs font-medium uppercase leading-none tracking-[1.8px]"
        aria-label={`Continue with ${b.title}`}
      >
        {/* TODO(lift): replace with translation key */}
        Continue
      </Button>
    </article>
  );
}
