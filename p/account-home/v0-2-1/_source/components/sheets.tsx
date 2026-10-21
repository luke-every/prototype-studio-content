"use client";

import { useState } from "react";
import { Allergen, asset, DAY_NAMES, DELIVERY_OPTIONS, DISHES, dish, fitScore, fmtDay, SlotName, reasonFor } from "@/lib/data";
import { applyExclusions, State, useStore } from "@/lib/store";
import { alternatives } from "./plan";
import { Button, Chip, Icon, Pill, Sheet } from "./ui";
import { DeepDive, Quiz } from "./quiz";
import { LovePrompt, SwapPicker, WhyMeal } from "./meal";
import { ChipSheet, PlanDaySheet } from "./planhub";
import { CheckInFlow, FirstBoxSheet, IntroSheet } from "./moments";
import { Wrapped } from "./wrapped";
import { GoalSheet } from "./goals";
import { GoalDetailsSheet } from "./goal-a";
import { MealPlanSheet } from "./variant-b";

const close = (set: ReturnType<typeof useStore>["set"]) => () => set((d) => { d.sheet = null; });

export function Sheets() {
  const { s, set } = useStore();
  const onClose = close(set);
  const sh = s.sheet;
  if (!sh) return null;
  switch (sh.kind) {
    case "why": return <WhyMeal week={sh.week} day={sh.day} slot={sh.slot} onClose={onClose} />;
    case "swap": return <SwapPicker week={sh.week} day={sh.day} slot={sh.slot} onClose={onClose} />;
    case "addSlot": return <SwapPicker week={sh.week} day={sh.day} slot={sh.slot} onClose={onClose} add />;
    case "lovePrompt": return <LovePrompt id={sh.id} onClose={onClose} />;
    case "chip": return <ChipSheet chipKey={sh.key} onClose={onClose} />;
    case "goalDetails": return <GoalDetailsSheet onClose={onClose} />;
    case "mealPlan": return <MealPlanSheet onClose={onClose} />;
    case "planDay": return <PlanDaySheet week={sh.week} day={sh.day} onClose={onClose} />;
    case "checkinFlow": return <CheckInFlow onClose={onClose} />;
    case "intro": return <IntroSheet onClose={onClose} />;
    case "firstBox": return <FirstBoxSheet onClose={onClose} />;
    case "checkin": return <CheckInFlow onClose={onClose} />;
    case "vacation": return <VacationSheet onClose={onClose} />;
    case "delivery": return <DeliverySheet onClose={onClose} />;
    case "perk": return <PerkSheet onClose={onClose} />;
    case "nutrition": return <NutritionSheet onClose={onClose} />;
    case "preferences": return <PreferencesSheet onClose={onClose} />;
    case "wrapped": return <Wrapped onClose={onClose} />;
    case "onboarding":
    case "quiz": return <Quiz onClose={onClose} goalOnly={sh.kind === "quiz" && sh.goalOnly} />;
    case "deep": return <DeepDive onClose={onClose} />;
    case "addMeals": return <AddMealsSheet onClose={onClose} />;
    case "interval": return <IntervalSheet onClose={onClose} />;
    case "dish": return <DishSheet id={sh.id} onClose={onClose} />;
    case "manage": return <ManageSheet onClose={onClose} />;
    case "goals": return <GoalSheet onClose={onClose} preset={sh.preset} />;
  }
}

/** Vacation mode as a positive choice, not a skip (Duolingo Weekend Amulet). */
function VacationSheet({ onClose }: { onClose: () => void }) {
  const { set, toast, track } = useStore();
  const [len, setLen] = useState(10);
  const back = new Date(2026, 8, 29 + len);
  const backLabel = back.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
  return (
    <Sheet onClose={onClose} eyebrow="Vacation mode" title="Away for a bit?">
      <p className="text-[14.5px] leading-relaxed text-body">I&apos;ll hold your rhythm while you&apos;re gone and restart your plan on its own when you&apos;re back. Nothing resets, nothing to catch up on.</p>
      <p className="mt-5 text-[14px] font-medium text-ink">How long are you away?</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {[5, 10, 14, 21].map((n) => <Chip key={n} active={len === n} onClick={() => setLen(n)}>{n} days</Chip>)}
      </div>
      <div className="mt-5 rounded-2xl bg-sky-bg p-4 text-[14px] text-ink">
        <p><b className="font-medium">Back {backLabel}.</b> The box on Thu 1 Oct is paused. Your first box after the break arrives the week you&apos;re home.</p>
      </div>
      <Button className="mt-5 w-full" onClick={() => {
        set((d) => { d.delivery.status = "vacation"; d.delivery.vacationUntil = backLabel; d.sheet = null; });
        track(`vacation_mode:${len}`);
        toast(`Vacation mode on. See you ${backLabel}.`);
      }}>Turn on vacation mode</Button>
    </Sheet>
  );
}

function DeliverySheet({ onClose }: { onClose: () => void }) {
  const { s, set, toast } = useStore();
  const [pick, setPick] = useState(s.delivery.date);
  return (
    <Sheet onClose={onClose} eyebrow="Delivery" title="Which day suits you?">
      <div className="space-y-2">
        {DELIVERY_OPTIONS.map((o) => (
          <button key={o.date} onClick={() => setPick(o.date)} aria-pressed={pick === o.date}
            className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3.5 text-[15px] ${pick === o.date ? "border-ink bg-white text-ink ring-1 ring-ink" : "border-line bg-white text-ink"}`}>
            <span className="font-medium">{o.label}</span>
            <span className="text-[13px] text-stone">{o.window}</span>
          </button>
        ))}
      </div>
      <p className="mt-3 text-[13px] text-stone">Applies to this box only. Your usual day stays Thursday.</p>
      <Button className="mt-5 w-full" onClick={() => {
        const o = DELIVERY_OPTIONS.find((x) => x.date === pick)!;
        set((d) => { Object.assign(d.delivery, o); d.sheet = null; });
        toast(`Moved to ${o.label}, ${o.window}.`);
      }}>Save day</Button>
    </Sheet>
  );
}

function PerkSheet({ onClose }: { onClose: () => void }) {
  const { track } = useStore();
  const [q, setQ] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <Sheet onClose={onClose} eyebrow="Member perk" title="Ask a nutritionist">
      {!sent ? (
        <form onSubmit={(e) => { e.preventDefault(); track("fake_door:nutritionist_question"); setSent(true); }}>
          <div className="flex items-center gap-3 rounded-2xl bg-white p-3">
            <div className="grid size-11 place-items-center rounded-full bg-terra-bg font-serif text-[18px] text-terra">L</div>
            <div>
              <p className="text-[14.5px] font-medium text-ink">Lina, registered nutritionist</p>
              <p className="text-[12.5px] text-stone">Replies within 48 h · about eating well, not medical advice</p>
            </div>
          </div>
          <textarea value={q} onChange={(e) => setQ(e.target.value)} rows={4} placeholder="e.g. How can I get more iron from a plant-based week?" className="mt-4 w-full rounded-2xl border border-line bg-white p-4 text-[14.5px] outline-none focus:border-ink/40" />
          <Button type="submit" className="mt-3 w-full" disabled={!q.trim()}>Send question</Button>
        </form>
      ) : (
        <div className="text-center">
          <div className="mx-auto grid size-14 place-items-center rounded-full bg-olive-bg text-olive"><Icon name="check" className="size-7" strokeWidth={2.2} /></div>
          <p className="mt-4 font-serif text-[22px] text-ink">Thanks for asking.</p>
          <p className="mt-2 text-[14.5px] leading-relaxed text-body">We&apos;re testing this perk right now and it isn&apos;t live yet. We saved your question and will email you as soon as Lina can answer it.</p>
          <Button variant="gray" className="mt-5" onClick={onClose}>Close</Button>
        </div>
      )}
    </Sheet>
  );
}

/** Opt-in nutrition view for Mia (M2.3), MacroFactor-style, one layer down. */
function NutritionSheet({ onClose }: { onClose: () => void }) {
  const { s } = useStore();
  const rows = s.weeks.this.map((d) => {
    const ds = d.slots.filter((x) => x.dishId).map((x) => dish(x.dishId!));
    return { date: d.date, protein: ds.reduce((a, b) => a + b.protein, 0), fibre: ds.reduce((a, b) => a + b.fibre, 0), plants: ds.reduce((a, b) => a + b.plants, 0) };
  });
  const max = { protein: 60, fibre: 35, plants: 25 };
  return (
    <Sheet onClose={onClose} eyebrow="Nutrition view · opt-in" title="Your week in numbers" wide>
      <p className="text-[13.5px] text-stone">From your Every meals only. Your own cooking isn&apos;t counted, and there&apos;s nothing to hit.</p>
      <div className="mt-5 space-y-5">
        {(["protein", "fibre", "plants"] as const).map((k) => (
          <div key={k}>
            <p className="text-[14px] font-medium text-ink"><span className="capitalize">{k}</span> <span className="font-normal text-stone">{k === "plants" ? "(plant portions)" : "(g)"}</span></p>
            <div className="mt-2 grid grid-cols-7 items-end gap-2" style={{ height: 96 }}>
              {rows.map((r) => (
                <div key={r.date} className="flex h-full flex-col items-center justify-end gap-1">
                  <span className="text-[11px] text-stone">{r[k] || ""}</span>
                  <div className={`w-full rounded-t-md ${k === "protein" ? "bg-terra" : k === "fibre" ? "bg-olive" : "bg-sky"}`} style={{ height: `${Math.max(3, (r[k] / max[k]) * 70)}px` }} />
                </div>
              ))}
            </div>
            <div className="mt-1 grid grid-cols-7 gap-2 text-center text-[11px] text-stone">
              {rows.map((r) => <span key={r.date}>{fmtDay(r.date, { weekday: "narrow" })}</span>)}
            </div>
          </div>
        ))}
      </div>
    </Sheet>
  );
}

const ALLERGENS: Allergen[] = ["gluten", "soy", "nuts", "sesame"];
export const AVOID = ["Mushrooms", "Coriander", "Aubergine", "Chickpeas", "Chilli", "Olives", "Tofu", "Beetroot"];

export function AllergenPicker({ exclude, onChange }: { exclude: Allergen[]; onChange: (a: Allergen[]) => void }) {
  return (
    <div className="divide-y divide-line rounded-2xl border border-line bg-white">
      <label className="flex items-center justify-between px-4 py-3 text-[14.5px] text-ink">
        Nothing I can&apos;t eat
        <input type="checkbox" checked={exclude.length === 0} onChange={() => onChange([])} className="size-5 accent-[#1a0f0a]" />
      </label>
      {ALLERGENS.map((a) => (
        <label key={a} className="flex items-center justify-between px-4 py-3 text-[14.5px] text-ink">
          Recipes without {a}
          <input type="checkbox" checked={exclude.includes(a)} onChange={() => onChange(exclude.includes(a) ? exclude.filter((x) => x !== a) : [...exclude, a])} className="size-5 accent-[#1a0f0a]" />
        </label>
      ))}
    </div>
  );
}

/** Can't eat (hard filter) kept apart from rather not (soft signal) (research §7). */
function PreferencesSheet({ onClose }: { onClose: () => void }) {
  const { s, p, set, toast } = useStore();
  const [ex, setEx] = useState<Allergen[]>(s.exclude);
  const [av, setAv] = useState<string[]>(s.avoid);
  return (
    <Sheet onClose={onClose} eyebrow="Preferences" title="Food you can't or won't eat">
      <p className="text-[14px] font-medium text-ink">Can&apos;t eat</p>
      <p className="mb-2 text-[12.5px] text-stone">Applied everywhere: plans, search and Eve. Always check the label if you have an allergy.</p>
      <AllergenPicker exclude={ex} onChange={setEx} />
      <p className="mt-5 text-[14px] font-medium text-ink">Rather not</p>
      <p className="mb-2 text-[12.5px] text-stone">Eve will suggest these less, but won&apos;t hide them.</p>
      <div className="flex flex-wrap gap-2">
        {AVOID.map((a) => <Chip key={a} active={av.includes(a)} onClick={() => setAv(av.includes(a) ? av.filter((x) => x !== a) : [...av, a])}>{a}</Chip>)}
      </div>
      <Button className="mt-6 w-full" onClick={() => {
        set((d) => { d.exclude = ex; d.avoid = av; d.sheet = null; applyExclusions(d, p.goal); });
        toast("Your preferences have been saved.");
      }}>Save</Button>
    </Sheet>
  );
}

/** "Add more" / "Other meals" from the My Plan box: extras on top of the plan, exclusions applied silently. */
function AddMealsSheet({ onClose }: { onClose: () => void }) {
  const { s, p, set, toast } = useStore();
  const list = DISHES.filter((d) => d.kind !== "addon" && !d.contains.some((a) => s.exclude.includes(a)) && !s.disliked.includes(d.id))
    .sort((a, b) => fitScore(p.goal, b) - fitScore(p.goal, a));
  return (
    <Sheet onClose={onClose} eyebrow="Your box" title="Add meals">
      <p className="text-[14px] text-stone">Extras go in the freezer, on top of your plan. {p.goalOrNull ? `Sorted by fit for ${p.goalLabel.toLowerCase()}.` : "Sorted by what customers love most."}</p>
      <div className="mt-4 space-y-2.5">
        {list.map((d) => {
          const n = s.extras[d.id] ?? 0;
          return (
            <div key={d.id} className="flex items-center gap-3 rounded-2xl border border-line bg-white p-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(d.img)} alt="" className="size-14 rounded-xl object-cover" />
              <div className="min-w-0 flex-1">
                <p className="text-[14.5px] font-medium text-ink">{d.name}</p>
                <p className="line-clamp-1 text-[12.5px] text-stone">{reasonFor(d, p.goalOrNull)}</p>
                <p className="text-[12.5px] text-stone">{d.price.toFixed(2).replace(".", ",")} €</p>
              </div>
              <Button size="sm" variant={n ? "dark" : "gray"} onClick={() => { set((x) => { x.extras[d.id] = n + 1; }); toast(`${d.name} added to your box.`); }}>
                {n ? `${n} added` : "Add"} <Icon name="plus" className="size-4" />
              </Button>
            </div>
          );
        })}
      </div>
    </Sheet>
  );
}

function IntervalSheet({ onClose }: { onClose: () => void }) {
  const { s, set, toast } = useStore();
  const opts = [["weekly", "Every week", "Your plan fills every week"], ["fortnightly", "Every 2 weeks", "A bigger freezer, fewer deliveries"], ["monthly", "Per month", "One big box, most freezer space"]] as const;
  return (
    <Sheet onClose={onClose} eyebrow="Subscription" title="How often?">
      <div className="space-y-2">
        {opts.map(([v, l, hint]) => (
          <button key={v} aria-pressed={s.delivery.cadence === v} onClick={() => { set((x) => { x.delivery.cadence = v; x.sheet = null; }); toast(`Interval changed to ${l.toLowerCase()}.`); }}
            className={`flex w-full items-center justify-between rounded-2xl border bg-white px-4 py-3.5 text-left ${s.delivery.cadence === v ? "border-ink ring-1 ring-ink" : "border-line"}`}>
            <span><span className="block text-[15px] font-medium text-ink">{l}</span><span className="text-[13px] text-stone">{hint}</span></span>
            {s.delivery.cadence === v && <Icon name="check" className="size-5" strokeWidth={2.2} />}
          </button>
        ))}
      </div>
    </Sheet>
  );
}

/** Dish details from Discover / week views (no slot): reason, how it helps, macros one tap deeper, add to next box. */
function DishSheet({ id, onClose }: { id: string; onClose: () => void }) {
  const { s, p, set, toast } = useStore();
  const d = dish(id);
  const [macros, setMacros] = useState(p.showNumbers);
  const blocked = d.contains.filter((a) => s.exclude.includes(a));
  return (
    <Sheet onClose={onClose} eyebrow={d.tags.includes("new") ? "New this month" : "From the menu"} title={d.name}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={asset(d.img)} alt="" className="h-44 w-full rounded-2xl object-cover" />
      <div className="mt-3 flex flex-wrap gap-1.5">
        <Pill tone="stone"><Icon name="clock" className="size-3.5" /> {d.minutes} min</Pill>
        <Pill tone="stone"><Icon name="leaf" className="size-3.5" /> {d.plants} plants</Pill>
        {d.contains.length === 0 ? <Pill tone="sky">No listed allergens</Pill> : <Pill tone="stone">Contains {d.contains.join(", ")}</Pill>}
      </div>
      <p className="mt-4 text-[15px] font-medium text-ink">{reasonFor(d, p.goalOrNull)}</p>
      <p className="mt-2 text-[14.5px] leading-relaxed text-body">{d.helps}</p>
      <div className="mt-4 rounded-2xl bg-white">
        <button onClick={() => setMacros((m) => !m)} aria-expanded={macros} className="flex w-full items-center justify-between px-4 py-3.5 text-[14.5px] font-medium text-ink">
          What&apos;s in it <Icon name="chevronDown" className={`size-4 transition ${macros ? "rotate-180" : ""}`} />
        </button>
        {macros && (
          <div className="grid grid-cols-3 gap-2 px-4 pb-4 text-center sm:grid-cols-5">
            {[["Protein", `${d.protein} g`], ["Fibre", `${d.fibre} g`], ["Carbs", `${d.carbs} g`], ["Fat", `${d.fat} g`], ["Energy", `${d.kcal} kcal`]].map(([k, v]) => (
              <div key={k} className="rounded-xl bg-offwhite px-2 py-2.5"><p className="text-[15px] font-medium text-ink">{v}</p><p className="text-[11.5px] text-stone">{k}</p></div>
            ))}
          </div>
        )}
      </div>
      {blocked.length > 0 ? (
        <p className="mt-5 rounded-2xl bg-terra-bg p-4 text-[14px] text-ink">This recipe contains {blocked.join(", ")}, which you&apos;ve asked Eve to leave out, so it can&apos;t go in your box.</p>
      ) : (
        <Button className="mt-5 w-full" onClick={() => { set((x) => { x.extras[id] = (x.extras[id] ?? 0) + 1; x.sheet = null; }); toast(`${d.name} added to your next box.`); }}>
          <Icon name="plus" className="size-4" /> Add to next box
        </Button>
      )}
    </Sheet>
  );
}

/** One "Manage" entry for delivery changes (Variant C): move day, skip, away, pause or cancel via Eve. */
function ManageSheet({ onClose }: { onClose: () => void }) {
  const { s, set, toast, openSheet, openEve } = useStore();
  const rows: { icon: Parameters<typeof Icon>[0]["name"]; title: string; hint: string; run: () => void }[] = [
    { icon: "calendar", title: "Move the delivery day", hint: `Currently ${s.delivery.label || "not scheduled"}`, run: () => openSheet({ kind: "delivery" }) },
    { icon: "swap", title: "Change meals in the box", hint: "Swap, add or remove before tonight, 23:59", run: () => { set((x) => { x.sheet = null; }); document.getElementById("c-week")?.scrollIntoView({ behavior: "smooth" }); } },
    { icon: "pause", title: "Skip this box", hint: "Your rhythm is held, not reset", run: () => { set((x) => { x.delivery.status = "skipped"; x.sheet = null; }); toast("Skipped. Your plan and rhythm are saved.", () => set((x) => { x.delivery.status = "active"; x.toasts = []; })); } },
    { icon: "sun", title: "Going away", hint: "Vacation mode restarts your plan when you're back", run: () => openSheet({ kind: "vacation" }) },
    { icon: "person", title: "Pause or cancel", hint: "Eve asks why, then shows every option", run: () => openEve("pause") },
  ];
  return (
    <Sheet onClose={onClose} eyebrow="Next delivery" title="What would you like to change?">
      <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
        {rows.map((r) => (
          <button key={r.title} onClick={r.run} className="flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-offwhite">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-offwhite text-ink"><Icon name={r.icon} className="size-[18px]" /></span>
            <span className="min-w-0 flex-1"><span className="block text-[15px] font-medium text-ink">{r.title}</span><span className="text-[13px] text-stone">{r.hint}</span></span>
            <Icon name="chevron" className="size-4 text-stone" />
          </button>
        ))}
      </div>
    </Sheet>
  );
}
