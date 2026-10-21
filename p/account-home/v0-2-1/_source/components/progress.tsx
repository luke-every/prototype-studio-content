"use client";

import { asset, dish, DAY_NAMES } from "@/lib/data";
import { useStore } from "@/lib/store";
import { plantCount } from "./plan";
import { Button, Card, Icon } from "./ui";

/** Cumulative rhythm, never a streak that resets (Duolingo watch-out). Missed days are neutral, away days are marked. */
export function Rhythm() {
  const { s, p, openSheet } = useStore();
  const madeNow = p.rhythmMade + Object.keys(s.made).filter((k) => !k.startsWith("0:")).length;
  const made = Math.min(14, madeNow);
  const [fy, fm, fd] = s.rhythm[0].date.split("-").map(Number);
  const first = new Date(fy, fm - 1, fd);
  const lead = (first.getDay() + 6) % 7;

  return (
    <Card className="!bg-transparent p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="eyebrow">Your rhythm</div>
          <p className="mt-2 font-serif text-[26px] leading-none text-ink">{made} of your last 14</p>
          <p className="mt-1.5 text-[13.5px] text-stone">
            {made >= 11 ? "Planned meals you actually ate. That's a steady rhythm." : "Busy fortnight. Your plan is still here, nothing to catch up on."}
          </p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-7 gap-1.5 text-center" aria-label="Last four weeks">
        {DAY_NAMES.map((n) => <span key={n} className="text-[10.5px] uppercase text-stone">{n.slice(0, 1)}</span>)}
        {Array.from({ length: lead }).map((_, i) => <span key={`l${i}`} />)}
        {s.rhythm.map((d) => {
          const cls = {
            made: "bg-olive",
            planned: "bg-cream",
            none: "bg-offwhite",
            away: "bg-sky-bg ring-1 ring-sky/40",
            today: "bg-white ring-2 ring-ink",
          }[d.state];
          return <span key={d.date} title={`${d.date}: ${d.state}`} className={`mx-auto size-6 rounded-full ${cls}`} />;
        })}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-stone">
        <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-olive" />Ate it</span>
        <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-cream" />Planned</span>
        <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-sky-bg ring-1 ring-sky/40" />Away</span>
      </div>
      <Button variant="outline" size="sm" className="mt-4 w-full" onClick={() => openSheet({ kind: "vacation" })}>
        <Icon name="sun" className="size-4" /> Going away? Turn on vacation mode
      </Button>
    </Card>
  );
}

/** Monday check-in: one screen, "I'll do it later" without penalty (research §4). */
export function CheckInCard() {
  const { s, set, openSheet, toast } = useStore();
  if (s.checkIn === "done") return null;
  return (
    <Card className="!bg-transparent p-5">
      <div className="flex items-center gap-3">
        <div className="grid size-10 shrink-0 place-items-center rounded-full bg-plum-bg text-plum"><Icon name="heart" /></div>
        <div>
          <p className="text-[15px] font-medium text-ink">How was last week?</p>
          <p className="text-[13px] text-stone">Your weekly check-in · about 1 minute</p>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <Button className="flex-1" onClick={() => openSheet({ kind: "checkin" })}>Check in</Button>
        {s.checkIn === "open" && (
          <Button variant="gray" className="flex-1" onClick={() => { set((d) => { d.checkIn = "later"; }); toast("No problem. It'll be here when you are."); }}>I&apos;ll do it later</Button>
        )}
      </div>
    </Card>
  );
}

/** Impact counter (Too Good To Go) and Every Wrapped teaser (Spotify). No calories, no weight. */
/** `noWrapped`: the Wrapped teaser is shown as its own screen-wide band (pages.tsx). */
export function Impact({ noWrapped = false }: { noWrapped?: boolean } = {}) {
  const { s, p, openSheet } = useStore();
  const plants = plantCount(s);
  const tiles = [
    { label: "Plants this month", value: 41 + plants, icon: "leaf" as const, tone: "bg-olive-bg text-olive" },
    { label: "Meals eaten", value: 23 + Object.keys(s.made).length, icon: "check" as const, tone: "bg-terra-bg text-terra" },
    { label: "Hours not cooking", value: 11, icon: "clock" as const, tone: "bg-sky-bg text-sky" },
  ];
  const fav = dish(p.favourite);
  return (
    <section className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {tiles.map((t) => (
          <Card key={t.label} className="!bg-transparent p-3.5 text-center">
            <div className={`mx-auto grid size-9 place-items-center rounded-full ${t.tone}`}><Icon name={t.icon} className="size-[18px]" /></div>
            <p className="mt-2 font-serif text-[26px] leading-none text-ink">{t.value}</p>
            <p className="mt-1 text-[11.5px] leading-tight text-stone">{t.label}</p>
          </Card>
        ))}
      </div>
      {!noWrapped && <button onClick={() => openSheet({ kind: "wrapped" })} className="group relative block w-full overflow-hidden rounded-[24px] bg-ink p-5 text-left text-paper">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset(fav.img)} alt="" className="absolute -right-8 -top-6 size-40 rounded-full object-cover opacity-80 transition group-hover:scale-105" />
        <div className="relative max-w-[62%]">
          <span className="text-[11.5px] uppercase tracking-[.08em] text-paper/60">Every Wrapped · September</span>
          <p className="mt-2 font-serif text-[26px] leading-[1.05]">You&apos;re {p.label}.</p>
          <p className="mt-2 text-[13px] text-paper/70">Your month in plants, favourites and time saved. Free, always.</p>
          <span className="mt-4 inline-flex items-center gap-1 rounded-full bg-paper px-3.5 py-2 text-[13px] font-medium text-ink">See your month <Icon name="chevron" className="size-4" /></span>
        </div>
      </button>}
    </section>
  );
}

/** Async nutritionist perk as a fake door (research §11). */
export function PerkCard() {
  const { openSheet } = useStore();
  return (
    <Card className="flex items-center gap-3 p-4">
      <div className="grid size-11 shrink-0 place-items-center rounded-full bg-terra-bg font-serif text-[18px] text-terra">L</div>
      <div className="min-w-0 flex-1">
        <p className="text-[14.5px] font-medium text-ink">Ask a nutritionist</p>
        <p className="text-[13px] text-stone">A member perk. Lina replies within 48 h.</p>
      </div>
      <Button size="sm" variant="gray" onClick={() => openSheet({ kind: "perk" })}>Ask</Button>
    </Card>
  );
}
