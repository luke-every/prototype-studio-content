"use client";

import { useState } from "react";
import { asset, DAY_NAMES, DISHES, dish, Dish, fitScore, Goal, goalInfo, reasonFor, SlotName, TODAY_INDEX, goalBg } from "@/lib/data";
import { isEaten, State, useStore } from "@/lib/store";
import { Button, Icon, Pill, Sheet } from "./ui";

/**
 * Shared meal layer (Miro F2 "Customize my Week", F3, F5; Notion F3 meal actions).
 * Vision decisions: "eaten" is assumed on the scheduled day and corrected only if not;
 * love/dislike live on every meal; Remove from plan ≠ Remove from order.
 */

export type WeekKey = "this" | "next";

export function slotOf(s: State, week: WeekKey, day: number, slot: SlotName) {
  return s.weeks[week][day].slots.find((x) => x.slot === slot)!;
}

/** One sentence per goal: how this dish fits (category-level, never a product health claim). */
export function fitsGoal(d: Dish, g: Goal) {
  switch (g) {
    case "balanced": return `${d.plants} plants, ${d.protein} g protein and ${d.fibre} g fibre: a balanced meal, nothing to think about.`;
    case "gut": return `${d.fibre} g fibre and ${d.plants} different plants toward your 30 a week.`;
    case "lose": return `${d.protein} g protein and ${d.fibre} g fibre, the two nutrients most linked to feeling full, at ${d.kcal} kcal.`;
    case "maintain": return `${d.protein} g protein and ${d.fibre} g fibre at ${d.kcal} kcal: satisfying, not heavy.`;
    case "lean": return `${d.protein} g protein, spread across your training week.`;
    case "energy": return `${d.kcal} kcal and ${d.carbs} g carbs to fuel active days.`;
    case "muscle": return `${d.protein} g protein with ${d.kcal} kcal behind it, so you don't have to choose.`;
    case "postpartum": return /dal|lentil|beetroot|bolognese/i.test(`${d.id} ${d.name}`) ? "Lentils bring iron and folate, gently filling." : `${d.fibre} g fibre and ${d.protein} g protein, easy on a busy day.`;
  }
}

const ATE_TOASTS = ["Good. Keep the rhythm going.", "Nice. That's one sorted.", "Noted, no counting needed.", "Good. The 80 is building."];
const LOVE_TOASTS = ["Love noted. It'll come back.", "Loved. Eve will bring it back.", "Noted, a favourite.", "Love noted."];
const pick = (arr: string[]) => arr[Math.floor((Date.now() / 1000) % arr.length)];

export function useMealActions() {
  const { s, set, toast, openSheet, track } = useStore();
  return {
    markEaten(day: number, slot: SlotName) {
      const key = `${day}:${slot}`;
      set((d) => { d.made[key] = true; delete d.notEaten[key]; d.freezer = Math.max(0, d.freezer - 1); });
      track("ATE_IT");
      toast(pick(ATE_TOASTS), () => set((d) => { delete d.made[key]; d.freezer += 1; d.toasts = []; }));
    },
    didNotEat(day: number, slot: SlotName) {
      const key = `${day}:${slot}`;
      set((d) => { d.notEaten[key] = true; delete d.made[key]; d.freezer += 1; });
      track("NOT_EATEN");
      toast("No problem. It's still in your freezer, and nothing resets.", () => set((d) => { delete d.notEaten[key]; d.freezer = Math.max(0, d.freezer - 1); d.toasts = []; }));
    },
    love(id: string) {
      if (s.loved.includes(id)) {
        set((d) => { d.loved = d.loved.filter((x) => x !== id); });
        toast("Love removed.");
        return;
      }
      set((d) => { d.loved.push(id); d.disliked = d.disliked.filter((x) => x !== id); });
      track("LOVED_DISH");
      toast(pick(LOVE_TOASTS));
      openSheet({ kind: "lovePrompt", id });
    },
    dislike(id: string) {
      if (s.disliked.includes(id)) {
        set((d) => { d.disliked = d.disliked.filter((x) => x !== id); });
        toast(`${dish(id).name} can be suggested again.`);
        return;
      }
      // Conflict rule: Dislike clears Love first, then applies.
      set((d) => { d.loved = d.loved.filter((x) => x !== id); d.disliked.push(id); });
      track("DISLIKED");
      toast(`Noted. Eve won't suggest ${dish(id).name} again, and offers a swap at your next check-in.`, () => set((d) => { d.disliked = d.disliked.filter((x) => x !== id); d.toasts = []; }));
    },
    removeFromPlan(week: WeekKey, day: number, slot: SlotName) {
      const id = slotOf(s, week, day, slot).dishId!;
      set((d) => { slotOf(d, week, day, slot).dishId = null; d.removedFromPlan.push(id); });
      track("REMOVED_FROM_PLAN");
      toast(`${dish(id).name} is off your plan until you add it back.`, () => set((d) => { slotOf(d, week, day, slot).dishId = id; d.removedFromPlan = d.removedFromPlan.filter((x) => x !== id); d.toasts = []; }));
    },
    removeFromOrder(id: string) {
      const on = s.skipNextOrder.includes(id);
      set((d) => { d.skipNextOrder = on ? d.skipNextOrder.filter((x) => x !== id) : [...d.skipNextOrder, id]; });
      track(on ? "SKIP_NEXT_ORDER_cleared" : "SKIP_NEXT_ORDER");
      toast(on ? `${dish(id).name} is back in your next order.` : `${dish(id).name} won't come in your next order. It stays in your plan.`);
    },
  };
}

/** The action row on a planned meal. `compact` hides labels for narrow cards. */
export function MealActions({ week, day, slot, compact = false }: { week: WeekKey; day: number; slot: SlotName; compact?: boolean }) {
  const { s, openSheet } = useStore();
  const a = useMealActions();
  const [more, setMore] = useState(false);
  const id = slotOf(s, week, day, slot).dishId!;
  const loved = s.loved.includes(id);
  const disliked = s.disliked.includes(id);
  const isThis = week === "this";
  const past = isThis && day < TODAY_INDEX;
  const today = isThis && day === TODAY_INDEX;
  const eaten = isThis && isEaten(s, day, slot);
  const skipping = s.skipNextOrder.includes(id);
  const pill = "inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1.5 text-[12px] font-medium transition";

  return (
    <div className="relative flex flex-wrap items-center gap-1.5">
      {past && (eaten
        ? <button onClick={() => a.didNotEat(day, slot)} className={`${pill} bg-olive-bg text-[#5d5e2f]`} aria-label="Eaten. Tap if you didn't eat it"><Icon name="check" className="size-3.5" strokeWidth={2.4} />{compact ? "Eaten" : "Eaten · didn't?"}</button>
        : <button onClick={() => a.markEaten(day, slot)} className={`${pill} border border-line2 text-stone`}>Not eaten · undo</button>)}
      {today && (eaten
        ? <span className={`${pill} bg-olive text-white`}><Icon name="check" className="size-3.5" strokeWidth={2.4} />Eaten</span>
        : <button onClick={() => a.markEaten(day, slot)} className={`${pill} border border-line2 text-ink`}><Icon name="check" className="size-3.5" strokeWidth={2.2} />Ate it</button>)}
      <button onClick={() => a.love(id)} aria-pressed={loved} aria-label={loved ? "Loved" : "Love it"} className={`${pill} ${loved ? "bg-terra-bg text-terra" : "bg-offwhite text-ink"}`}>
        <Icon name="heart" className="size-3.5" />{!compact && (loved ? "Loved" : "Love")}
      </button>
      <button onClick={() => a.dislike(id)} aria-pressed={disliked} aria-label={disliked ? "Not for me (on)" : "Not for me"} className={`${pill} ${disliked ? "bg-linen text-stone" : "bg-offwhite text-ink"}`}>
        <Icon name="heartOff" className="size-3.5" />{!compact && "Not for me"}
      </button>
      <button onClick={() => openSheet({ kind: "swap", week, day, slot })} className={`${pill} bg-offwhite text-ink`}><Icon name="swap" className="size-3.5" />Swap</button>
      <button onClick={() => setMore((m) => !m)} aria-expanded={more} aria-label="More actions" className={`${pill} bg-offwhite px-2 text-ink`}>•••</button>
      {skipping && <span className={`${pill} bg-sky-bg text-[#3f5e77]`}>Not in next order</span>}
      {more && (
        <div className="absolute right-0 top-full z-20 mt-1 w-56 rounded-2xl border border-line bg-white p-1.5 shadow-e3" role="menu">
          <button role="menuitem" onClick={() => { setMore(false); openSheet({ kind: "why", week, day, slot }); }} className="block w-full rounded-xl px-3 py-2 text-left text-[13.5px] text-ink hover:bg-offwhite">Why this meal?</button>
          <button role="menuitem" onClick={() => { setMore(false); a.removeFromPlan(week, day, slot); }} className="block w-full rounded-xl px-3 py-2 text-left text-[13.5px] text-ink hover:bg-offwhite">
            Remove from plan<span className="block text-[11.5px] text-stone">Hidden until you add it back</span>
          </button>
          <button role="menuitem" onClick={() => { setMore(false); a.removeFromOrder(id); }} className="block w-full rounded-xl px-3 py-2 text-left text-[13.5px] text-ink hover:bg-offwhite">
            {skipping ? "Add back to next order" : "Remove from next order"}<span className="block text-[11.5px] text-stone">{skipping ? "It comes in your next box again" : "Stays in your plan, skips one delivery"}</span>
          </button>
        </div>
      )}
    </div>
  );
}

/** Love → "Add to your next order?" (Miro F5). */
export function LovePrompt({ id, onClose }: { id: string; onClose: () => void }) {
  const { set, toast } = useStore();
  const d = dish(id);
  return (
    <Sheet onClose={onClose} eyebrow="Loved" title={`Add ${d.name} to your next order?`}>
      <div className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset(d.img)} alt="" className="size-16 rounded-xl object-cover" />
        <p className="text-[14px] text-body">Loved meals stay in your plan and come back more often. You can still change this any time before the cut-off.</p>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-2">
        <Button variant="gray" onClick={onClose}>No thanks</Button>
        <Button onClick={() => { set((x) => { x.extras[id] = (x.extras[id] ?? 0) + 1; x.sheet = null; }); toast(`${d.name} added to your next order.`); }}>Yes, add it</Button>
      </div>
    </Sheet>
  );
}

/** Dishes still in the freezer (box) this week: scheduled from today on, not eaten. */
function boxDishes(s: State) {
  const left = new Map<string, number>();
  s.weeks.this.forEach((d, i) => d.slots.forEach((x) => {
    if (x.dishId && i >= TODAY_INDEX && !isEaten(s, i, x.slot)) left.set(x.dishId, (left.get(x.dishId) ?? 0) + 1);
  }));
  return [...left.entries()].map(([id, n]) => ({ d: dish(id), n }));
}

function newPool(s: State, goal: Goal, kinds: string[], exclude: string[]) {
  return DISHES.filter((d) => kinds.includes(d.kind) && !exclude.includes(d.id) && !d.contains.some((a) => s.exclude.includes(a)) && !s.disliked.includes(d.id) && !s.removedFromPlan.includes(d.id))
    .sort((a, b) => fitScore(goal, b) - fitScore(goal, a)).slice(0, 3);
}

/** Swap picker with two tabs (Miro "Customize my Week"): From your box · Try something new. */
export function SwapPicker({ week, day, slot, onClose, add = false }: { week: WeekKey; day: number; slot: SlotName; onClose: () => void; add?: boolean }) {
  const { s, p, set, toast, track } = useStore();
  const current = slotOf(s, week, day, slot).dishId;
  const kinds = slot === "breakfast" ? ["breakfast", "smoothie"] : ["meal"];
  const [tab, setTab] = useState<"box" | "new">("box");
  const fromBox = boxDishes(s).filter(({ d }) => kinds.includes(d.kind) && d.id !== current)
    .sort((a, b) => fitScore(p.goal, b.d) - fitScore(p.goal, a.d) || b.n - a.n);
  const inBox = new Set(boxDishes(s).map((x) => x.d.id));
  const tryNew = newPool(s, p.goal, kinds, [...inBox, current ?? ""]);

  const choose = (id: string, source: "box" | "new") => {
    const prev = current;
    set((x) => {
      slotOf(x, week, day, slot).dishId = id;
      if (source === "new") x.extras[id] = (x.extras[id] ?? 0) + 1;
      x.sheet = null;
    });
    track(source === "new" ? "SWAP_IN_new" : "SWAP_IN_box");
    if (prev) track(`SWAP_OUT:${prev}`);
    toast(source === "new" ? `${dish(id).name} goes in your next order and into your plan from delivery.` : `${dish(id).name} is in.`, () => set((x) => { slotOf(x, week, day, slot).dishId = prev; if (source === "new") x.extras[id] = Math.max(0, (x.extras[id] ?? 1) - 1); x.toasts = []; }));
  };

  const list = tab === "box" ? fromBox.map(({ d, n }) => ({ d, note: `${n} left in your freezer` })) : tryNew.map((d) => ({ d, note: "Not in your box yet · adds to your next order" }));
  return (
    <Sheet onClose={onClose} eyebrow={`${DAY_NAMES[day]} · ${slot}`} title={add ? `Add a ${slot}` : current ? `Swap ${dish(current).name}` : `Add a ${slot}`}>
      <div className="flex rounded-full bg-offwhite p-1 text-[13px]" role="tablist">
        {(["box", "new"] as const).map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={`flex-1 rounded-full py-2 font-medium ${tab === t ? "bg-white text-ink shadow-e1" : "text-stone"}`}>
            {t === "box" ? "From your box" : "Try something new"}
          </button>
        ))}
      </div>
      <p className="mt-3 text-[13px] text-stone">{p.goalOrNull ? `Sorted by fit for ${goalInfo(p.goal).label.toLowerCase()}.` : "Balanced picks to start with."}{s.exclude.length ? ` Recipes with ${s.exclude.join(", ")} are left out.` : ""}</p>
      <div className="mt-3 space-y-2.5">
        {list.length === 0 && <p className="rounded-2xl bg-white p-4 text-[13.5px] text-stone">Nothing else in your freezer fits this slot. Try something new instead.</p>}
        {list.map(({ d, note }, i) => (
          <button key={d.id} onClick={() => choose(d.id, tab)} className="flex w-full items-center gap-3 rounded-2xl border border-line bg-white p-2.5 text-left transition hover:border-ink/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset(d.img)} alt="" className="size-16 rounded-xl object-cover" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2"><p className="text-[15px] font-medium text-ink">{d.name}</p>{i === 0 && <Pill tone="olive">Best fit</Pill>}</div>
              <p className="mt-0.5 line-clamp-2 text-[13px] leading-snug text-stone">{reasonFor(d, p.goalOrNull)}</p>
              <p className="mt-0.5 text-[11.5px] text-stone">{note}</p>
            </div>
            <Icon name="chevron" className="size-4 shrink-0 text-stone" />
          </button>
        ))}
      </div>
    </Sheet>
  );
}

/** "Why this meal?" (Miro F3): four blocks; numbers one tap deep (vision: gentle, opt-in depth). */
export function WhyMeal({ week, day, slot, onClose }: { week: WeekKey; day: number; slot: SlotName; onClose: () => void }) {
  const { s, p, set, toast, openSheet, track } = useStore();
  const id = slotOf(s, week, day, slot).dishId!;
  const d = dish(id);
  const daily = goalInfo(p.goal).daily;
  const [share, setShare] = useState(p.showNumbers);
  const [note, setNote] = useState("");
  const [helpful, setHelpful] = useState<null | boolean>(null);
  return (
    <Sheet onClose={onClose} eyebrow={`${DAY_NAMES[day]} · ${slot}`} title={d.name}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={asset(d.img)} alt="" className="h-44 w-full rounded-2xl object-cover" />
      <div className="mt-3 flex flex-wrap gap-1.5">
        {p.goalOrNull && <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11.5px] font-medium text-ink ${goalBg(p.goal)}`}><Icon name="leaf" className="size-3.5" /> {goalInfo(p.goal).label}</span>}
        <Pill tone="stone">{s.extras[id] ? "Eve pick" : "In your plan"}</Pill>
        {d.contains.length === 0 ? <Pill tone="sky">No listed allergens</Pill> : <Pill tone="stone">Contains {d.contains.join(", ")}</Pill>}
      </div>

      {/* 1. Per serving */}
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        {[["Protein", `${d.protein} g`], ["Fibre", `${d.fibre} g`], ["Plants", `${d.plants}`]].map(([k, v]) => (
          <div key={k} className="rounded-xl bg-white px-2 py-2.5"><p className="text-[15px] font-medium text-ink">{v}</p><p className="text-[11.5px] text-stone">{k} per serving</p></div>
        ))}
      </div>
      {/* 2. Why Eve picked it */}
      <h3 className="mt-5 text-[15px] font-medium text-ink">Why Eve picked it</h3>
      <p className="mt-1 text-[14.5px] leading-relaxed text-body">{d.why}</p>
      {/* 4. How it fits the goal (only once a goal exists) */}
      {p.goalOrNull && <>
      <h3 className="mt-4 text-[15px] font-medium text-ink">How it fits your goal</h3>
      <p className="mt-1 text-[14.5px] leading-relaxed text-body">{fitsGoal(d, p.goal)}</p>
      {/* 3. Share of your day: one tap deep */}
      <div className="mt-4 rounded-2xl bg-white">
        <button onClick={() => setShare((v) => !v)} aria-expanded={share} className="flex w-full items-center justify-between px-4 py-3.5 text-[14.5px] font-medium text-ink">
          Share of your day <Icon name="chevronDown" className={`size-4 transition ${share ? "rotate-180" : ""}`} />
        </button>
        {share && (
          <div className="space-y-2.5 px-4 pb-4">
            {[["Protein", d.protein, daily.protein, "g"], ["Fibre", d.fibre, daily.fibre, "g"], ["Energy", d.kcal, daily.kcal, "kcal"]].map(([k, v, t, u]) => {
              const pct = Math.round(((v as number) / (t as number)) * 100);
              return (
                <div key={k as string}>
                  <div className="flex justify-between text-[12.5px] text-stone"><span>{k}</span><span>{v} {u} · about {pct}% of a day</span></div>
                  <div className="mt-1 h-1.5 rounded-full bg-offwhite"><div className="h-1.5 rounded-full bg-olive" style={{ width: `${Math.min(100, pct)}%` }} /></div>
                </div>
              );
            })}
            <p className="text-[11.5px] text-stone">A direction, not a target. Nothing to track.</p>
          </div>
        )}
      </div>
      </>}

      <div className="mt-5"><MealActions week={week} day={day} slot={slot} /></div>

      <form className="mt-5 rounded-2xl border border-line bg-white p-4" onSubmit={(e) => {
        e.preventDefault(); if (!note.trim()) return;
        set((x) => { x.notes.push(note.trim()); }); track("tell_eve_more"); toast("Thanks. Eve will use that from your next plan."); setNote("");
      }}>
        <label htmlFor="tell" className="text-[14px] font-medium text-ink">Tell Eve more</label>
        <p className="text-[12.5px] text-stone">Anything you want more or less of. It steers future plans.</p>
        <div className="mt-2 flex gap-2">
          <input id="tell" value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. more spice, fewer pasta dishes" className="min-w-0 flex-1 rounded-full bg-offwhite px-4 py-2.5 text-[14px] outline-none placeholder:text-stone/70 focus:ring-2 focus:ring-ink/20" />
          <Button size="sm" type="submit" disabled={!note.trim()}>Send</Button>
        </div>
      </form>
      <div className="mt-4 flex items-center justify-between text-[13px] text-stone">
        <span>{helpful === null ? "Was this helpful?" : "Thanks for telling us."}</span>
        {helpful === null && (
          <div className="flex gap-1.5">
            <button onClick={() => { setHelpful(true); track("why_helpful:yes"); }} className="grid size-8 place-items-center rounded-full border border-line2" aria-label="Helpful"><Icon name="thumbUp" className="size-4" /></button>
            <button onClick={() => { setHelpful(false); track("why_helpful:no"); }} className="grid size-8 place-items-center rounded-full border border-line2" aria-label="Not helpful"><Icon name="thumbDown" className="size-4" /></button>
          </div>
        )}
      </div>
      <Button variant="ghost" size="sm" className="mt-2" onClick={() => openSheet({ kind: "swap", week, day, slot })}>See alternatives</Button>
    </Sheet>
  );
}
