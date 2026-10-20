"use client";

import { useState } from "react";
import { ADDON_IDS, ADDRESS, asset, CARD, dish, fmtDay, REFERRAL_LINK, sizeOf, SlotName } from "@/lib/data";
import { boxPricing, planDays, State, useStore } from "@/lib/store";
import { Button, Icon } from "./ui";
import { Milestones } from "./variant-b";
import { PlanHub } from "./planhub";

/**
 * My Plan tab, built from the Figma page "Account UX fixes and Revamp – READY FOR DEV" (node 668:16565):
 *  - My Plan RC Delivery coming   (collapsed box + expanded "View & edit" list with swap and quantity)
 *  - My Plan RC Same Day Delivery (SMS toggle, tracking, read-only box)
 *  - My Plan RC Cancelled Subscription ("Continue where you left off", reorder, find your bundle)
 * Plus the Eve states that already exist on Home (skipped, vacation mode).
 */
/** `milestones` (Variant A only): the discount milestones from the Figma Discover tab live here, under the price. */
export function MyPlan({ milestones = false }: { milestones?: boolean }) {
  const { s } = useStore();
  const st = s.delivery.status;
  if (st === "cancelled") return <Cancelled milestones={milestones} />;
  const today = st === "today";

  const hero = today ? <TodayHero /> : <ComingHero />;
  const box = <BoxCard editable={!today} />;
  const pricing = <Pricing upsell={!today} />;
  const addons = today ? null : <Addons title="Add to your box" />;
  const details = <SubscriptionDetails />;
  const discount = milestones ? <Milestones /> : null;
  const referral = <Referral />;

  return (
    <main className="pb-8">
      {/* Mobile / tablet: Figma order */}
      <div className="lg:hidden">{hero}</div>
      <div id="plan" className="scroll-mt-20"><PlanHub /></div>
      <div className="mx-auto mt-10 max-w-[1120px] border-t border-line px-4 pt-2 sm:px-6"><p className="eyebrow pt-6">Your next order</p></div>
      <div className="lg:hidden">
        <div className="mx-auto max-w-[640px] space-y-8 px-4 pt-6 sm:px-6">
          {box}{pricing}{discount}{addons}{details}{referral}
        </div>
      </div>
      {/* Desktop: box + extras left, delivery + money + settings right (Figma "Desktop - 2") */}
      <div className="mx-auto hidden max-w-[1120px] grid-cols-[minmax(0,1fr)_380px] gap-8 px-6 pt-8 lg:grid">
        <div className="min-w-0 space-y-8">{box}{addons}{referral}</div>
        <div className="space-y-6">{hero}{pricing}{discount}{details}</div>
      </div>
    </main>
  );
}

function Peas({ sameDay }: { sameDay?: boolean }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={asset(sameDay ? "/figma/myplan-sameday-icon.png" : "/figma/myplan-hero-icon.png")} alt="" className="mx-auto h-10 w-auto" />;
}

const cta = "inline-flex w-full items-center justify-center rounded-full bg-white px-6 py-3 text-[12.5px] font-medium uppercase tracking-[.14em] text-ink transition hover:shadow-e2 active:scale-[.98]";
const heroShell = "rounded-b-[32px] bg-brown px-6 pb-6 pt-8 text-center text-paper lg:rounded-[28px]";

function longDate(isoDate: string) {
  return fmtDay(isoDate, { weekday: "long", day: "numeric", month: "long" });
}

function ComingHero() {
  const { s, set, toast, openSheet } = useStore();
  const d = s.delivery;
  const paused = d.status === "skipped" || d.status === "vacation";
  return (
    <section className={heroShell}>
      <Peas />
      <h1 className="mt-4 font-serif text-[26px] leading-tight">
        {paused ? (d.status === "vacation" ? "Your plan is on hold" : "This box is skipped") : "Your box is on its way"}
      </h1>
      <p className="mt-2 text-[15px] text-paper/85">
        {paused ? (d.status === "vacation" ? `Vacation mode until ${d.vacationUntil}` : `No delivery on ${d.label}`) : longDate(d.date)}
      </p>
      {!paused && <p className="mt-1 text-[12.5px] text-paper/60">Change meals, day or address until tonight, 23:59</p>}
      <div className="mt-5">
        {paused ? (
          <button className={cta} onClick={() => { set((x) => { x.delivery.status = "active"; x.delivery.vacationUntil = undefined; }); toast("Your box is back on."); }}>Restart deliveries</button>
        ) : (
          <button className={cta} onClick={() => openSheet({ kind: "delivery" })}>Change date</button>
        )}
      </div>
    </section>
  );
}

function TodayHero() {
  const { s, set, toast } = useStore();
  return (
    <section className={heroShell}>
      <Peas sameDay />
      <h1 className="mt-4 font-serif text-[26px] leading-tight">Your box arrives today</h1>
      <p className="mt-2 text-[15px] text-paper/85">Estimated {s.delivery.window}</p>
      <div className="mt-6 divide-y divide-paper/15 text-left text-[14.5px]">
        <div className="flex items-center justify-between py-3">
          <span>SMS Notifications</span>
          <div className="flex rounded-full bg-white p-0.5 text-[13.5px]" role="radiogroup" aria-label="SMS notifications">
            {[false, true].map((v) => (
              <button key={String(v)} role="radio" aria-checked={s.sms === v}
                onClick={() => { set((x) => { x.sms = v; }); toast(v ? "We'll text you when the courier is close." : "SMS updates off."); }}
                className={`rounded-full px-3.5 py-1 font-medium ${s.sms === v ? "bg-ink text-paper" : "text-ink"}`}>{v ? "Yes" : "No"}</button>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between py-3">
          <span>Track my delivery</span>
          <button onClick={() => toast("Prototype: this would open the courier's tracking page.")} className="flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-[13.5px] font-medium text-ink">
            Open <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></svg>
          </button>
        </div>
      </div>
    </section>
  );
}

/** "Your box": collapsed 2-column preview, expanded list with swap and quantity (Figma "View & edit"). */
export function BoxCard({ editable, title = "Your box", date, onDark, flat }: { editable: boolean; title?: string; date?: string; onDark?: boolean; flat?: boolean }) {
  const { s, set, toast, openSheet } = useStore();
  const [open, setOpen] = useState(false);
  const { items, count } = boxPricing(s);
  const preview = items.slice(0, 6);

  const firstSlot = (id: string): { day: number; slot: SlotName } | null => {
    for (let i = 0; i < s.weeks.next.length; i++) {
      const sl = s.weeks.next[i].slots.find((x) => x.dishId === id);
      if (sl) return { day: i, slot: sl.slot };
    }
    return null;
  };

  const inc = (id: string) => set((x) => { x.extras[id] = (x.extras[id] ?? 0) + 1; });
  const dec = (id: string) => {
    if ((s.extras[id] ?? 0) > 0) return set((x) => { x.extras[id] -= 1; });
    const where = [...s.weeks.next.keys()].reverse().find((i) => s.weeks.next[i].slots.some((x) => x.dishId === id));
    if (where === undefined) return;
    set((x) => { const sl = x.weeks.next[where].slots.find((y) => y.dishId === id)!; sl.dishId = null; });
    toast(`Removed from ${fmtDay(s.weeks.next[where].date, { weekday: "long" })}. That slot is your own cooking now.`);
  };
  const remove = (id: string) => {
    const snapshot = { next: structuredClone(s.weeks.next), extras: { ...s.extras } };
    set((x) => { delete x.extras[id]; x.weeks.next.forEach((d) => d.slots.forEach((sl) => { if (sl.dishId === id) sl.dishId = null; })); });
    toast(`${dish(id).name} removed from your box.`, () => set((x) => { x.weeks.next = snapshot.next; x.extras = snapshot.extras; x.toasts = []; }));
  };

  return (
    <section className={flat ? "" : `rounded-[20px] p-4 ${onDark ? "bg-[#EEEAE6]" : "bg-offwhite"}`}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2.5 text-[19px] text-ink">
          {title}
          <span className={`grid h-8 min-w-8 place-items-center rounded-full px-2 text-[14px] ${flat ? "bg-offwhite" : "bg-white"}`}>{count}</span>
        </h2>
        {date && <span className="text-[15px] font-medium text-ink">{date}</span>}
      </div>

      {!open ? (
        <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-3 lg:grid-cols-2">
          {preview.map(({ id }, i) => (
            <div key={id} className={`flex items-center gap-3 ${i >= 4 ? "opacity-35" : ""}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(dish(id).img)} alt="" className="size-12 shrink-0 rounded-md object-cover" />
              <span className="min-w-0 text-[12.5px] leading-snug text-ink">{dish(id).name}</span>
            </div>
          ))}
        </div>
      ) : (
        <ul className="mt-4 divide-y divide-line2">
          {items.map(({ id, qty, planned }) => {
            const d = dish(id);
            const days = planDays(s, id);
            const slot = firstSlot(id);
            return (
              <li key={id} className="flex gap-3 py-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset(d.img)} alt="" className="size-[60px] shrink-0 rounded-md object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[14px] text-ink">{d.name}</p>
                    <p className="shrink-0 text-[14px] font-medium text-ink">{(d.price * qty).toFixed(2).replace(".", ",")} €</p>
                  </div>
                  <p className="text-[13.5px] text-stone">{sizeOf(d)}</p>
                  {planned > 0 && <p className="text-[12px] text-olive">In your plan: {days}{qty > planned ? ` · +${qty - planned} extra` : ""}</p>}
                  {planned === 0 && d.kind !== "addon" && <p className="text-[12px] text-stone">Extra for the freezer</p>}
                  <div className="mt-1.5 flex items-center justify-between gap-2">
                    {editable && slot ? (
                      <button onClick={() => openSheet({ kind: "swap", week: "next", day: slot.day, slot: slot.slot })} className="text-[12.5px] text-ink underline underline-offset-2">Swap</button>
                    ) : <span />}
                    {editable ? (
                      <div className="flex items-center rounded-lg bg-white">
                        <button onClick={() => (qty <= 1 ? remove(id) : dec(id))} aria-label={qty <= 1 ? `Remove ${d.name}` : `One less ${d.name}`} className="grid size-9 place-items-center text-ink">
                          {qty <= 1 ? <TrashIcon /> : <span className="text-[18px] leading-none">−</span>}
                        </button>
                        <span className="w-8 text-center text-[14px] text-ink" aria-live="polite">{qty}</span>
                        <button onClick={() => inc(id)} aria-label={`One more ${d.name}`} className="grid size-9 place-items-center text-ink"><Icon name="plus" className="size-4" /></button>
                      </div>
                    ) : (
                      <span className="text-[13px] text-stone">× {qty}</span>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-4 flex items-center justify-between gap-2">
        <button onClick={() => setOpen((o) => !o)} aria-expanded={open} className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-[14px] text-ink ${flat ? "bg-offwhite" : "bg-white"}`}>
          {open ? "Hide" : editable ? "View & edit" : "View"}
          <Icon name="chevronDown" className={`size-4 transition ${open ? "rotate-180" : ""}`} />
        </button>
        {editable && (
          <button onClick={() => openSheet({ kind: "addMeals" })} className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-[14px] text-ink ${flat ? "bg-offwhite" : "bg-white"}`}>
            {open ? "Other meals" : "Add more"} <Icon name="plus" className="size-4" />
          </button>
        )}
      </div>
    </section>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
      <path d="M4 7h16M9 7V4.5h6V7M6.5 7l.8 12.5a1 1 0 0 0 1 .9h7.4a1 1 0 0 0 1-.9L17.5 7M10 11v6M14 11v6" />
    </svg>
  );
}

const euro = (n: number) => `${n.toFixed(2).replace(".", ",")} €`;

export function Pricing({ onDark, upsell = true }: { onDark?: boolean; upsell?: boolean }) {
  const { s, set, toast } = useStore();
  const p = boxPricing(s);
  const [codeOpen, setCodeOpen] = useState(false);
  const [code, setCode] = useState("");
  const [err, setErr] = useState(false);
  const save = onDark ? "text-[#D8D38C]" : "text-save";
  const line = onDark ? "border-paper/70" : "border-line2";
  const txt = onDark ? "text-paper" : "text-ink";

  return (
    <section className={`space-y-3 px-4 text-[15px] ${txt}`} aria-label="Price">
      <div className="flex justify-between"><span>Box price</span><span>{euro(p.price)}</span></div>
      {p.pct > 0 && <div className={`flex justify-between text-[13.5px] ${save}`}><span>Quantity savings ({p.pct}% off)</span><span>-{euro(p.qtySave)}</span></div>}
      {upsell && p.pct < 21 && p.meals > 0 && (
        <p className={`text-[12.5px] ${onDark ? "text-paper/60" : "text-stone"}`}>
          Add {(p.pct < 10 ? 8 : p.pct < 15 ? 12 : 16) - p.meals} more meals to save {p.pct < 10 ? 10 : p.pct < 15 ? 15 : 21}%
        </p>
      )}
      <div>
        <button onClick={() => setCodeOpen((o) => !o)} aria-expanded={codeOpen} className="flex items-center gap-1.5">
          Discount Code <Icon name="chevronDown" className={`size-4 transition ${codeOpen ? "rotate-180" : ""}`} />
        </button>
        {codeOpen && (
          <form className="mt-2 flex gap-2" onSubmit={(e) => {
            e.preventDefault();
            if (code.trim().toUpperCase() === "EVERY10") { set((x) => { x.discount = "EVERY10"; }); setErr(false); setCodeOpen(false); toast("EVERY10 applied: 10% off this box."); }
            else setErr(true);
          }}>
            <input value={code} onChange={(e) => { setCode(e.target.value); setErr(false); }} placeholder="Try EVERY10" aria-label="Discount code" aria-invalid={err}
              className="min-w-0 flex-1 rounded-full border border-line2 bg-white px-4 py-2 text-[14px] text-ink outline-none focus:border-ink/50" />
            <Button size="sm" type="submit" variant={onDark ? "light" : "dark"}>Apply</Button>
          </form>
        )}
        {err && <p className={`mt-1 text-[12.5px] ${onDark ? "text-signal" : "text-terra"}`}>That code isn&apos;t valid. Check the spelling and try again.</p>}
        {s.discount && <div className={`mt-2 flex justify-between text-[13.5px] ${save}`}><span>Code {s.discount} (10% off)</span><span>-{euro(p.codeSave)}</span></div>}
      </div>
      <div className={`flex justify-between border-b pb-3 ${line}`}><span>Shipping</span><span className={p.shipping ? "" : save}>{p.shipping ? euro(p.shipping) : "Free"}</span></div>
      {p.savings > 0 && <div className={`flex justify-between text-[13.5px] ${save}`}><span>Total savings</span><span>-{euro(p.savings)}</span></div>}
      <div className="flex justify-between font-medium"><span>Total</span><span>{euro(p.total)}</span></div>
    </section>
  );
}

export function Addons({ title }: { title: string }) {
  const { s, set, toast } = useStore();
  if (s.addonsDismissed) return null;
  return (
    <section>
      <div className="mb-2.5 flex items-center justify-between">
        <h2 className="text-[15px] text-ink">{title}</h2>
        <button onClick={() => set((x) => { x.addonsDismissed = true; })} aria-label="Hide suggestions" className="grid size-8 place-items-center text-ink"><Icon name="close" className="size-5" /></button>
      </div>
      <div className="space-y-2.5">
        {ADDON_IDS.map((id) => {
          const d = dish(id);
          const n = s.extras[id] ?? 0;
          return (
            <div key={id} className="flex items-stretch overflow-hidden rounded-md bg-offwhite">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(d.img)} alt="" className="w-[88px] shrink-0 bg-white object-cover" />
              <div className="flex min-w-0 flex-1 items-center justify-between gap-3 px-3 py-3">
                <div className="min-w-0">
                  <p className="text-[14.5px] text-ink underline underline-offset-2">{d.name}</p>
                  <p className="text-[13.5px] text-stone">{d.why}</p>
                  <p className="mt-0.5 text-[12.5px] text-stone">{d.size} · {euro(d.price)}</p>
                </div>
                <button onClick={() => { set((x) => { x.extras[id] = n + 1; }); toast(`${d.name} added to your box.`); }}
                  className="flex shrink-0 items-center gap-1.5 rounded-lg border border-line2 bg-white/60 px-3 py-1.5 text-[14px] text-ink hover:bg-white">
                  {n ? `In box · ${n}` : "Add"} <Icon name="plus" className="size-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

const INTERVAL: Record<State["delivery"]["cadence"], string> = { weekly: "Every week", fortnightly: "Every 2 weeks", monthly: "Per month" };

export function SubscriptionDetails({ bare = false }: { bare?: boolean } = {}) {
  const { s, toast, openSheet, openEve } = useStore();
  const settings = () => toast("Handled in Account & settings, not part of this prototype.");
  const rows = [
    { k: "Interval", v: INTERVAL[s.delivery.cadence], edit: () => openSheet({ kind: "interval" }) },
    { k: "Payment method", v: CARD, edit: settings },
    { k: "Address", v: ADDRESS, edit: settings },
  ];
  return (
    <section className={bare ? "" : "rounded-[10px] border border-line2 bg-white px-4 pb-4 pt-3"}>
      {!bare && <h2 className="font-serif text-[24px] text-ink">Your subscription details</h2>}
      <dl className="mt-1 divide-y divide-line2">
        {rows.map((r) => (
          <div key={r.k} className="flex items-center justify-between gap-3 py-3">
            <div><dt className="text-[15px] text-ink">{r.k}</dt><dd className="text-[15px] text-body">{r.v}</dd></div>
            <button onClick={r.edit} className="text-[13.5px] text-ink underline underline-offset-2">Edit</button>
          </div>
        ))}
        {s.delivery.status !== "cancelled" && (
          <div className="flex items-center justify-between gap-3 py-3">
            <div><dt className="text-[15px] text-ink">Taking a break?</dt><dd className="text-[14px] text-stone">Pause, skip or cancel. Eve asks why, then shows every option.</dd></div>
            <button onClick={() => openEve("pause")} className="shrink-0 text-[13.5px] text-ink underline underline-offset-2">Manage</button>
          </div>
        )}
      </dl>
      <button onClick={settings} className="mt-2 w-full rounded-full border border-ink/70 py-3 text-[12.5px] font-medium uppercase tracking-[.14em] text-ink hover:bg-offwhite">All settings</button>
    </section>
  );
}

export function Referral({ title = "Loving every? Spread the word." }: { title?: string }) {
  const { toast, track } = useStore();
  const copy = async () => {
    try { await navigator.clipboard.writeText(REFERRAL_LINK); } catch { /* clipboard may be blocked in previews */ }
    track("referral:copy_link");
    toast("Link copied. Your friends get 25% off their first order.");
  };
  return (
    <section className="rounded-[28px] bg-offwhite p-6">
      <h2 className="font-serif text-[24px] leading-tight text-ink">{title}</h2>
      <p className="mt-3 text-[15px] leading-relaxed text-body">
        Happy with every? Share your referral link and earn up to three €10 vouchers! Your friends benefit too – they get 25% off their first order. Sharing is caring!
      </p>
      <div className="mt-5 flex items-center gap-2 rounded-full border border-line2 bg-white py-1.5 pl-5 pr-1.5">
        <span className="min-w-0 flex-1 truncate text-[13.5px] text-stone">{REFERRAL_LINK}</span>
        <button onClick={copy} className="shrink-0 rounded-full bg-ink px-4 py-2 text-[14px] text-paper">Copy link</button>
      </div>
    </section>
  );
}

/** Figma "My Plan RC Cancelled Subscription": reorder the last box, or find a new bundle. No guilt, no "you've been away". */
export function Cancelled({ milestones = false }: { milestones?: boolean }) {
  const { s, set, toast, track } = useStore();
  const d = s.delivery;
  const since = d.inactiveSince ?? "October 2026";
  const last = d.lastBox ?? "01.10.2026";
  const reorder = () => {
    set((x) => { x.delivery = { date: "2026-10-01", label: "Thu 1 Oct", window: "08:00–12:00", status: "active", cadence: x.delivery.cadence }; });
    track("reactivation:reorder");
    toast("Reordered. Your box arrives Thursday, 1 October.");
  };
  const hero = (
    <section className="rounded-b-[32px] bg-brown px-5 pb-6 pt-7 text-paper lg:rounded-[28px] lg:px-6">
      <p className="text-[11.5px] uppercase tracking-[.04em] text-paper/90">Inactive subscription since {since}</p>
      <h1 className="mt-2 font-serif text-[26px] leading-tight">Continue where you left off</h1>
      <p className="mt-1 text-[14px] text-paper/70">Your favourites, allergens and plan are still saved.</p>
      <div className="mt-4"><BoxCard editable title="My last box" date={last} onDark /></div>
      <div className="mt-5"><Pricing onDark /></div>
      <button className={`${cta} mt-5`} onClick={reorder}>Reorder</button>
    </section>
  );
  const bundle = (
    <section className="px-1">
      <h2 className="font-serif text-[24px] leading-tight text-ink">Feel like switching it up?</h2>
      <p className="mt-2 text-[15px] leading-relaxed text-body">From seasonal favorites to goal-focused bundles, find your right match.</p>
      <a href="/account-discover-redesign.html"
        className="mt-5 flex w-full items-center justify-center rounded-full bg-brown py-3.5 text-[12.5px] font-medium uppercase tracking-[.14em] text-paper">Find your bundle</a>
    </section>
  );
  return (
    <main className="pb-8">
      <div className="lg:hidden">{hero}</div>
      <div id="plan" className="scroll-mt-20"><PlanHub /></div>
      <div className="mx-auto mt-10 max-w-[1120px] border-t border-line px-4 pt-2 sm:px-6"><p className="eyebrow pt-6">Your next order</p></div>
      <div className="lg:hidden">
        <div className="mx-auto max-w-[640px] space-y-8 px-4 pt-6 sm:px-6">
          {milestones && <Milestones />}
          <Addons title="Add to your box" />
          <SubscriptionDetails />
          {bundle}
          <Referral />
        </div>
      </div>
      <div className="mx-auto hidden max-w-[1120px] grid-cols-[minmax(0,1fr)_380px] gap-8 px-6 pt-8 lg:grid">
        <div className="min-w-0 space-y-8">{hero}<Addons title="Add to your box" /></div>
        <div className="space-y-8">{milestones && <Milestones />}<SubscriptionDetails />{bundle}<Referral /></div>
      </div>
    </main>
  );
}
