"use client";

import { EveFace } from "./eve-mark";
import { useState } from "react";
import {
  asset, allowed, DAY_NAMES, DISHES, Dish, dish, fitScore, fmtDay, SlotName, TODAY_INDEX, reasonFor, goalBg } from "@/lib/data";
import { plantsThisWeek, State, useStore } from "@/lib/store";
import { Button, Card, Chip, Icon, Pill } from "./ui";

export function plantCount(s: State) {
  const ids = plantsThisWeek(s);
  const sum = [...ids].reduce((a, id) => a + dish(id).plants, 0);
  return Math.min(60, Math.round(sum * 0.45));
}

/** Editorial "This week" header (Wabi, Creme): theme, plant count, one science snippet, one plan-fit cue. */
export function ThisWeek() {
  const { s, p, openSheet } = useStore();

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="eyebrow">This week · 28 Sep – 4 Oct</span>
        {p.goalOrNull && <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11.5px] font-medium text-ink ${goalBg(p.goal)}`}><Icon name="check" className="size-3.5" strokeWidth={2.2} /> Fits your goal: {p.goalLabel.toLowerCase()}</span>}
      </div>
      <h2 className="mt-3 font-serif text-[28px] leading-[1.1] text-ink sm:text-[34px]">Warm bowls for shorter days</h2>
      <p className="mt-2 max-w-[52ch] text-[14.5px] leading-relaxed text-body">
        Lentils, squash and slow-cooked tomato. Autumn food that asks almost nothing of you.
      </p>

      <p className="mt-4 flex gap-2 text-[13px] leading-relaxed text-stone">
        <Icon name="info" className="mt-0.5 size-4 shrink-0" />
        <span><b className="font-medium text-body">Why plant variety?</b> Eating a wide variety of plants each week is linked to a more diverse gut microbiome. Herbs, nuts and seeds count too.</span>
      </p>

      {p.showNumbers && (
        <Button size="sm" variant="light" className="mt-4" onClick={() => openSheet({ kind: "nutrition" })}>
          <Icon name="chart" className="size-4" /> Open nutrition view
        </Button>
      )}
    </section>
  );
}

const CHIPS: { label: string; match: (d: Dish, s: State) => boolean; reason: (d: Dish) => string }[] = [
  { label: "Something quick", match: (d) => d.minutes <= 6, reason: (d) => d.reason.time },
  { label: "High protein", match: (d) => d.protein >= 18, reason: (d) => d.reason.protein },
  { label: "Like my last favourite", match: (d) => ["dal", "paella", "beetroot"].includes(d.id), reason: () => "Close to Dal Delight, which you kept twice" },
  { label: "Recipe without gluten", match: (d) => !d.contains.includes("gluten"), reason: (d) => `${d.name}, recipe without gluten` },
];

export function matchChip(label: string, s: State) {
  const c = CHIPS.find((x) => x.label === label)!;
  return DISHES.filter((d) => d.kind === "meal" && !d.contains.some((a) => s.exclude.includes(a)) && !s.disliked.includes(d.id) && c.match(d, s))
    .slice(0, 4)
    .map((d) => ({ d, reason: c.reason(d) }));
}
export const CHIP_LABELS = CHIPS.map((c) => c.label);

/** Search and ask in one field (Amazon, Lloyds), with 4 neutral time/taste chips. Exclusions apply silently. */
export function SearchAsk() {
  const { s, openEve, set, toast } = useStore();
  const [q, setQ] = useState("");
  const [chip, setChip] = useState<string | null>(null);
  const results = chip ? matchChip(chip, s) : [];

  const addToNext = (id: string) => {
    set((d) => {
      for (const day of d.weeks.next) {
        const free = day.slots.find((x) => x.slot !== "breakfast" && !x.dishId);
        if (free) { free.dishId = id; return; }
      }
      d.weeks.next[5].slots[2].dishId = id;
    });
    toast(`${dish(id).name} added to next week. Your box updated.`);
  };

  return (
    <section>
      <form
        onSubmit={(e) => { e.preventDefault(); if (q.trim()) { openEve(q.trim()); setQ(""); } }}
        className="flex items-center gap-2 rounded-full border border-line2 bg-white py-1.5 pl-4 pr-1.5 shadow-e1 focus-within:border-ink/50"
      >
        <Icon name="search" className="size-5 text-stone" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search meals or ask Eve"
          aria-label="Search meals or ask Eve"
          className="min-w-0 flex-1 bg-transparent py-2 text-[15px] text-ink outline-none placeholder:text-stone/70"
        />
        <button type="submit" className="grid size-9 place-items-center rounded-full bg-ink text-paper" aria-label="Ask Eve"><EveFace className="size-7" /></button>
      </form>
      <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
        {CHIPS.map((c) => (
          <Chip key={c.label} active={chip === c.label} onClick={() => setChip(chip === c.label ? null : c.label)}>{c.label}</Chip>
        ))}
      </div>
      {chip && (
        <div className="mt-3 animate-fade-in">
          <p className="mb-2 text-[13px] text-stone">{results.length} dishes from this week&apos;s menu{s.exclude.length ? ", matching your allergens" : ""}</p>
          <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-4 sm:px-0">
            {results.map(({ d, reason }) => (
              <Card key={d.id} className="w-[200px] shrink-0 overflow-hidden sm:w-auto">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset(d.img)} alt="" className="h-24 w-full object-cover" />
                <div className="p-3">
                  <p className="text-[14px] font-medium text-ink">{d.name}</p>
                  <p className="mt-1 line-clamp-2 text-[12.5px] leading-snug text-stone">{reason}</p>
                  <Button size="sm" variant="gray" className="mt-2 w-full" onClick={() => addToNext(d.id)}><Icon name="plus" className="size-4" /> Next week</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

const SLOT_LABEL: Record<SlotName, string> = { breakfast: "Breakfast", lunch: "Lunch", dinner: "Dinner" };

export function Plan() {
  const { s, set } = useStore();
  const days = s.weeks[s.week];

  return (
    <section id="plan" className="scroll-mt-20">
      <div className="flex items-center justify-between gap-3">
        <div className="flex gap-5 border-b border-line" role="tablist" aria-label="Week">
          {(["this", "next"] as const).map((w) => (
            <button
              key={w}
              role="tab"
              aria-selected={s.week === w}
              onClick={() => set((d) => { d.week = w; d.selectedDay = w === "this" ? TODAY_INDEX : 0; })}
              className={`-mb-px whitespace-nowrap border-b-2 pb-2 text-[13px] font-medium uppercase tracking-[.06em] ${s.week === w ? "border-ink text-ink" : "border-transparent text-stone"}`}
            >
              {w === "this" ? "This week" : <>Next week <span className="ml-1 hidden rounded-full bg-signal px-1.5 py-0.5 text-[10px] normal-case tracking-normal text-ink sm:inline">your box</span></>}
            </button>
          ))}
        </div>
        <div className="flex rounded-full bg-offwhite p-1 text-[12.5px]" role="radiogroup" aria-label="View">
          {(["day", "week"] as const).map((v) => (
            <button key={v} role="radio" aria-checked={s.view === v} onClick={() => set((d) => { d.view = v; })}
              className={`rounded-full px-3 py-1.5 font-medium capitalize ${s.view === v ? "bg-white text-ink shadow-e1" : "text-stone"}`}>
              {v}
            </button>
          ))}
        </div>
      </div>

      {s.view === "day" ? (
        <>
          <div className="mt-4 grid grid-cols-7 gap-1.5" role="tablist" aria-label="Day">
            {days.map((d, i) => {
              const count = d.slots.filter((x) => x.dishId).length;
              const isToday = s.week === "this" && i === TODAY_INDEX;
              const past = s.week === "this" && i < TODAY_INDEX;
              const active = s.selectedDay === i;
              return (
                <button key={d.date} role="tab" aria-selected={active} onClick={() => set((x) => { x.selectedDay = i; })}
                  className={`flex flex-col items-center rounded-2xl py-2.5 transition ${active ? "bg-ink text-paper" : "bg-offwhite text-ink hover:bg-cream/60"} ${past && !active ? "opacity-60" : ""}`}>
                  <span className={`text-[11px] uppercase tracking-wide ${active ? "text-paper/70" : "text-stone"}`}>{isToday ? "Today" : DAY_NAMES[i]}</span>
                  <span className="mt-0.5 text-[17px] font-medium">{Number(d.date.slice(8))}</span>
                  <span className="mt-1 flex h-1.5 gap-0.5">
                    {Array.from({ length: count }).map((_, k) => <span key={k} className={`size-1.5 rounded-full ${active ? "bg-signal" : "bg-olive"}`} />)}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="mt-4 space-y-3">
            {days[s.selectedDay].slots.filter((sl) => sl.dishId).map((sl) => (
              <MealRow key={sl.slot} dayIndex={s.selectedDay} slot={sl.slot} dishId={sl.dishId} />
            ))}
            <OwnCooking dayIndex={s.selectedDay} slots={days[s.selectedDay].slots.filter((sl) => !sl.dishId).map((sl) => sl.slot)} />
          </div>
        </>
      ) : (
        <div className="mt-4 divide-y divide-line rounded-[20px] border border-line bg-white">
          {days.map((d, i) => {
            const past = s.week === "this" && i < TODAY_INDEX;
            return (
              <div key={d.date} className={`flex gap-4 p-4 ${past ? "opacity-60" : ""}`}>
                <div className="w-16 shrink-0">
                  <p className="text-[13px] font-medium text-ink">{s.week === "this" && i === TODAY_INDEX ? "Today" : fmtDay(d.date, { weekday: "short" })}</p>
                  <p className="text-[12px] text-stone">{fmtDay(d.date, { day: "numeric", month: "short" })}</p>
                </div>
                <div className="flex min-w-0 flex-1 flex-wrap gap-2">
                  {d.slots.filter((x) => x.dishId).length === 0 && <span className="text-[13px] text-stone">Your own cooking</span>}
                  {d.slots.filter((x) => x.dishId).map((x) => (
                    <button key={x.slot} onClick={() => set((st) => { st.view = "day"; st.selectedDay = i; })} className="flex items-center gap-2 rounded-full bg-offwhite py-1 pl-1 pr-3 text-[13px] text-ink hover:bg-cream/60">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={asset(dish(x.dishId!).img)} alt="" className="size-7 rounded-full object-cover" />
                      {dish(x.dishId!).name}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function MealRow({ dayIndex, slot, dishId }: { dayIndex: number; slot: SlotName; dishId: string | null }) {
  const { s, p, set, toast, openSheet, track } = useStore();
  const key = `${dayIndex}:${slot}`;
  const isThis = s.week === "this";
  const made = isThis && s.made[key];
  const canLog = isThis && dayIndex <= TODAY_INDEX;

  const d = dish(dishId!);
  const toggleMade = () => {
    set((x) => { if (x.made[key]) delete x.made[key]; else x.made[key] = true; });
    track(`fake_door:i_made_this:${d.id}`);
    if (!made) toast("Nice. Logged with one tap, no counting.", () => set((x) => { delete x.made[key]; x.toasts = []; }));
  };

  const openWhy = () => openSheet({ kind: "why", week: s.week, day: dayIndex, slot });
  return (
    <Card className="flex gap-3 p-3 sm:gap-4">
      <button onClick={openWhy} className="relative shrink-0 self-start" aria-label={`Why ${d.name}?`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset(d.img)} alt="" className="size-[84px] rounded-2xl object-cover sm:size-[112px]" />
        {d.tags.includes("new") && <span className="absolute left-1.5 top-1.5 rounded-md bg-signal px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-ink">New</span>}
      </button>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-2">
          <span className="eyebrow">{SLOT_LABEL[slot]}</span>
        </div>
        <button onClick={openWhy} className="mt-0.5 text-left">
          <p className="text-[16px] font-medium leading-snug text-ink">{d.name}</p>
          <p className="mt-0.5 text-[13.5px] leading-snug text-stone">{reasonFor(d, p.goalOrNull)}</p>
        </button>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] text-stone">
          <span className="flex items-center gap-1"><Icon name="clock" className="size-3.5" />{d.minutes ? `${d.minutes} min` : "Ready"}</span>
          <span className="flex items-center gap-1"><Icon name="leaf" className="size-3.5" />{d.plants} plants</span>
          {p.showNumbers && <span>{d.protein} g protein · {d.fibre} g fibre</span>}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {canLog && (
            <button onClick={toggleMade} aria-pressed={!!made}
              className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-[12.5px] font-medium transition ${made ? "bg-olive text-white" : "border border-line2 text-ink hover:bg-offwhite"}`}>
              <Icon name="check" className="size-4" strokeWidth={2.2} /> {made ? "Made it" : "I made this"}
            </button>
          )}
          <button onClick={() => openSheet({ kind: "swap", week: s.week, day: dayIndex, slot })} className="flex items-center gap-1 rounded-full bg-offwhite px-3 py-1.5 text-[12.5px] font-medium text-ink hover:bg-cream/60" aria-label={`Swap ${d.name}`}>
            <Icon name="swap" className="size-4" /> Swap
          </button>
          <button onClick={openWhy} className="px-1 text-[12.5px] font-medium text-ink underline decoration-line2 underline-offset-4">Why this meal?</button>
        </div>
      </div>
    </Card>
  );
}

function OwnCooking({ dayIndex, slots }: { dayIndex: number; slots: SlotName[] }) {
  const { s, openSheet } = useStore();
  if (!slots.length) return null;
  const label = slots.map((x) => SLOT_LABEL[x]).join(" & ");
  return (
    <div className="flex items-center justify-between gap-3 rounded-[20px] border border-dashed border-line2 px-4 py-3">
      <p className="min-w-0 text-[13.5px] text-stone"><span className="font-medium text-body">{label}</span> · your own cooking</p>
      <button onClick={() => openSheet({ kind: "swap", week: s.week, day: dayIndex, slot: slots.includes("lunch") ? "lunch" : slots[0] })} className="flex shrink-0 items-center gap-1 text-[13px] font-medium text-ink hover:underline">
        <Icon name="plus" className="size-4" /> Add
      </button>
    </div>
  );
}

/** 3 alternatives sorted by fit (research §2), exclusions applied silently. */
export function alternatives(s: State, goal: Parameters<typeof fitScore>[0], currentId: string | null, slot: SlotName) {
  const kind = slot === "breakfast" ? ["breakfast", "smoothie"] : ["meal"];
  return DISHES.filter((d) => kind.includes(d.kind) && d.id !== currentId && !d.contains.some((a) => s.exclude.includes(a)) && !s.disliked.includes(d.id))
    .sort((a, b) => fitScore(goal, b) - fitScore(goal, a));
}

export { allowed };
