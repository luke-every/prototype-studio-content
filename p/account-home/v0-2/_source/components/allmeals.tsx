"use client";

import { useEffect, useState } from "react";
import { asset, dish } from "@/lib/data";
import { CATS, CatId, Product, PRODUCTS } from "@/lib/catalog";
import { boxItems, useStore } from "@/lib/store";
import { CHIP_LABELS } from "./plan";
import { EveFace } from "./eve-mark";
import { Button, Chip, Icon, Sheet } from "./ui";
import { Bundles, FullMenu, MonthFavourite, SeasonalHero, TalkOfTheTable } from "./variant-b";

/**
 * All Meals, rebuilt from the live account page (every-foods.com/en/account/all-meals, 30 Sep 2026):
 * sticky category tabs, Filter drawer (Base, Add-Ons, Nutrition, Spiciness, Recipe without), Search,
 * sections with a count, and product cards with badge, price + strike price, macros, rating and a box stepper.
 *
 * Eve layer from the research (§6 AI search, §7 allergens):
 *  - one "Search meals or ask Eve" field with 4 time/taste chips; picks come with a reason line
 *  - the customer's "can't eat" list is applied silently to everything, with one quiet line to undo
 *  - the stepper edits the same box as My Plan (extras on top of the plan)
 */

const GROUPS: { id: string; label: string; options: string[] }[] = [
  { id: "base", label: "Base", options: ["Rice", "Pasta/Noodle", "Potato", "Legume"] },
  { id: "addons", label: "Add-Ons", options: ["Breakfast", "Dessert", "Snacks"] },
  { id: "nutrition", label: "Nutrition", options: ["Under 500 kcal", "Source of Protein", "Low Carb", "Low Fat", "Low in Saturated Fats", "Source of Fibre", "High Protein"] },
  { id: "spice", label: "Spiciness", options: ["Not spicy", "Medium spicy", "Very spicy"] },
  { id: "without", label: "Recipe Without", options: ["Garlic", "Onion", "Coriander", "Soy*", "Cumin", "Gluten*", "Paprika", "Pepper", "Ginger", "Chili", "Mushroom"] },
];

type Filters = Record<string, string[]>;

function matchesOption(p: Product, group: string, o: string) {
  switch (group) {
    case "base": return p.base.includes(o);
    case "addons":
      if (o === "Breakfast") return p.cats.includes("breakfast");
      if (o === "Dessert") return p.cats.includes("sweet") && /cake|crumble|cream/i.test(p.name);
      return p.cats.includes("sweet") && /ball|bundle/i.test(p.name);
    case "nutrition":
      if (!p.hasMacros) return false;
      if (o === "Under 500 kcal") return p.kcal > 0 && p.kcal < 500;
      if (o === "Source of Protein") return p.protein >= 12;
      if (o === "High Protein") return p.protein >= 20;
      if (o === "Low Carb") return p.carbs < 45;
      if (o === "Low Fat") return p.fat < 12;
      if (o === "Low in Saturated Fats") return p.fat < 15;
      return /fib/i.test(p.badge ?? "");
    case "spice": return p.spice === o;
    case "without":
      if (o === "Soy*") return !p.contains.includes("soy");
      if (o === "Gluten*") return !p.contains.includes("gluten");
      return p.without.includes(o);
  }
  return true;
}

function applyFilters(list: Product[], f: Filters) {
  return list.filter((p) => Object.entries(f).every(([g, opts]) => !opts.length || (g === "without" ? opts.every((o) => matchesOption(p, g, o)) : opts.some((o) => matchesOption(p, g, o)))));
}

/** Eve chips as presets over the real menu, each with a reason line (research §6). */
function evePicks(label: string, list: Product[], favouriteId: string): { p: Product; reason: string }[] {
  const meals = list.filter((p) => p.kind === "meal");
  if (label === "Something quick") return meals.filter((p) => p.cats.includes("latest") || p.kcal < 460).slice(0, 8).map((p) => ({ p, reason: "Six minutes from freezer to plate" }));
  if (label === "High protein") return [...meals].filter((p) => p.protein >= 22).sort((a, b) => b.protein - a.protein).slice(0, 8).map((p) => ({ p, reason: `${p.protein} g protein per portion` }));
  if (label === "Recipe without gluten") return meals.filter((p) => !p.contains.includes("gluten")).slice(0, 8).map((p) => ({ p, reason: "Recipe without gluten · always check the label" }));
  const fav = dish(favouriteId);
  const words = fav.name.toLowerCase().split(" ");
  return meals.filter((p) => p.id !== favouriteId && (p.cats.some((c) => PRODUCTS.find((x) => x.id === favouriteId)?.cats.includes(c)) || words.some((w) => p.name.toLowerCase().includes(w)))).slice(0, 8)
    .map((p) => ({ p, reason: `Close to ${fav.name}, which you kept twice` }));
}

/**
 * `discover` (Variant A only): the Figma Discover-tab sections (node 668:19244) sit on top of the live All Meals UI.
 * "Meet the full menu" doubles as a shortcut into the category sections below.
 */
export function AllMeals({ discover = false }: { discover?: boolean }) {
  const { s, p, openEve } = useStore();
  const [q, setQ] = useState("");
  const [chip, setChip] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({});
  const [filterOpen, setFilterOpen] = useState(false);
  const [showExcluded, setShowExcluded] = useState(false);
  const [active, setActive] = useState<CatId>("latest");

  const excluded = PRODUCTS.filter((x) => x.contains.some((a) => s.exclude.includes(a)));
  const base = showExcluded ? PRODUCTS : PRODUCTS.filter((x) => !excluded.includes(x));
  const searched = q.trim() ? base.filter((x) => `${x.name} ${x.desc}`.toLowerCase().includes(q.trim().toLowerCase())) : base;
  const list = applyFilters(searched, filters);
  const activeCount = Object.values(filters).reduce((a, b) => a + b.length, 0);
  const picks = chip ? evePicks(chip, list, p.favourite) : [];

  // Scroll-spy for the sticky tabs
  useEffect(() => {
    const els = CATS.map((c) => document.getElementById(`cat-${c.id}`)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver((entries) => {
      const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (vis) setActive(vis.target.id.replace("cat-", "") as CatId);
    }, { rootMargin: "-140px 0px -60% 0px" });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [list.length]);

  const toggle = (g: string, o: string) => setFilters((f) => ({ ...f, [g]: (f[g] ?? []).includes(o) ? f[g].filter((x) => x !== o) : [...(f[g] ?? []), o] }));

  const picksBlock = chip && (
          <section className="mt-6 rounded-[28px] bg-olive-bg p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-full bg-white text-ink"><EveFace className="size-8" /></span>
              <div className="min-w-0 flex-1">
                <p className="text-[12px] uppercase tracking-[.06em] text-stone">Eve&apos;s picks</p>
                <h2 className="font-serif text-[24px] leading-tight text-ink">{chip}</h2>
              </div>
              <button onClick={() => setChip(null)} aria-label="Close Eve's picks" className="grid size-9 place-items-center rounded-full bg-white/70"><Icon name="close" className="size-4" /></button>
            </div>
            {picks.length ? (
              <div className="no-scrollbar -mx-5 mt-4 flex snap-x gap-3 overflow-x-auto scroll-px-5 px-5 sm:-mx-6 sm:px-6">
                {picks.map(({ p: x, reason }) => <div key={x.id} className="w-[220px] shrink-0 snap-start"><ProductCard p={x} reason={reason} /></div>)}
              </div>
            ) : <p className="mt-4 text-[14px] text-stone">Nothing matches with your current filters. Try resetting them.</p>}
          </section>
  );

  return (
    <main className="pb-8">
      {discover && (
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 sm:pt-6"><SeasonalHero /></div>
      )}
      {/* Search or ask Eve */}
      <div className="mx-auto max-w-[1440px] px-4 pt-6 sm:px-6">
        <form onSubmit={(e) => { e.preventDefault(); const v = q.trim(); if (v && /\?|^(what|which|something|i |any|find|show|recommend)/i.test(v)) openEve(v); }}
          className="flex items-center gap-3 rounded-full border border-line2 bg-white py-1.5 pl-1.5 pr-3 shadow-e1 focus-within:border-ink/50 sm:max-w-[640px]">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-olive-bg text-ink"><EveFace className="size-8" /></span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search meals or ask Eve" aria-label="Search meals or ask Eve"
            className="min-w-0 flex-1 bg-transparent py-2 text-[15px] text-ink outline-none placeholder:text-stone/70" />
          {q && <button type="button" onClick={() => setQ("")} aria-label="Clear search" className="text-stone"><Icon name="close" className="size-4" /></button>}
        </form>
        <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          {CHIP_LABELS.map((c) => <Chip key={c} active={chip === c} onClick={() => setChip(chip === c ? null : c)}>{c}</Chip>)}
        </div>
      </div>

      {discover && (
        <div className="mx-auto max-w-[1440px] space-y-10 px-4 sm:px-6">
          {picksBlock}
          <div className="pt-4"><FullMenu /></div>
          <Bundles />
          <TalkOfTheTable />
          <MonthFavourite />
          <div className="border-t border-line pt-8">
            <p className="eyebrow">The full menu</p>
            <h2 className="mt-1 font-serif text-[30px] leading-tight text-ink">Every meal, every week</h2>
            <p className="mt-1 text-[14.5px] text-body">{list.length} products. Filter by base, nutrition or what you&apos;d rather leave out.</p>
          </div>
        </div>
      )}

      {/* Sticky category tabs + Filter, as on the live page */}
      <div className="sticky top-16 z-30 mt-4 border-b border-line bg-paper/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1440px] items-center gap-3 px-4 py-2.5 sm:px-6">
          <nav className="no-scrollbar flex min-w-0 flex-1 gap-5 overflow-x-auto" aria-label="Categories">
            {CATS.map((c) => (
              <a key={c.id} href={`#cat-${c.id}`} onClick={() => setActive(c.id)}
                className={`whitespace-nowrap py-1.5 text-[14px] transition ${active === c.id ? "text-ink" : "text-stone/70 hover:text-ink"}`}>{c.label}</a>
            ))}
          </nav>
          <button onClick={() => setFilterOpen(true)} className="relative flex shrink-0 items-center gap-2 rounded-xl bg-offwhite px-3.5 py-2 text-[14px] text-ink hover:bg-cream/60">
            <FilterIcon /> Filter
            {activeCount > 0 && <span className="grid size-5 place-items-center rounded-full bg-ink text-[11px] text-paper">{activeCount}</span>}
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-4 sm:px-6">
        {(activeCount > 0 || excluded.length > 0) && (
          <div className="mt-4 flex flex-wrap items-center gap-2 text-[13px] text-stone">
            {Object.entries(filters).flatMap(([g, opts]) => opts.map((o) => (
              <button key={g + o} onClick={() => toggle(g, o)} className="flex items-center gap-1 rounded-full bg-ink px-3 py-1.5 text-paper">{o} <Icon name="close" className="size-3.5" /></button>
            )))}
            {activeCount > 0 && <button onClick={() => setFilters({})} className="underline underline-offset-2">Reset filters</button>}
            {excluded.length > 0 && (
              <span className="ml-auto">
                {showExcluded ? "Showing everything" : `${excluded.length} recipes with ${s.exclude.join(" or ")} are hidden`} ·{" "}
                <button onClick={() => setShowExcluded((v) => !v)} className="underline underline-offset-2">{showExcluded ? "Hide them again" : "Show"}</button>
              </span>
            )}
          </div>
        )}

        {!discover && picksBlock}

        {CATS.map((c) => {
          const items = list.filter((x) => x.cats.includes(c.id));
          if (!items.length) return null;
          return (
            <section key={c.id} id={`cat-${c.id}`} className="scroll-mt-32 pt-8">
              <h2 className="flex items-center gap-2.5 font-serif text-[26px] text-ink sm:text-[28px]">
                {c.label} <span className="grid h-8 min-w-8 place-items-center rounded-full bg-white px-2 font-sans text-[14px]">{items.length}</span>
              </h2>
              <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
                {items.map((x) => <ProductCard key={x.id} p={x} />)}
              </div>
            </section>
          );
        })}
        {!list.length && (
          <div className="py-16 text-center">
            <p className="font-serif text-[24px] text-ink">Nothing matches that yet.</p>
            <p className="mt-2 text-[14.5px] text-stone">Try another word, reset the filters, or ask Eve.</p>
            <div className="mt-5 flex justify-center gap-2">
              <Button variant="outline" onClick={() => { setFilters({}); setQ(""); }}>Reset</Button>
              <Button onClick={() => openEve(q || "Something to eat")}>Ask Eve</Button>
            </div>
          </div>
        )}
      </div>

      {filterOpen && <FilterSheet filters={filters} setFilters={setFilters} onClose={() => setFilterOpen(false)} count={(f) => applyFilters(searched, f).length} />}
    </main>
  );
}

function FilterIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
      <path d="M4 7h10M18 7h2M4 17h4M12 17h8" /><circle cx="16" cy="7" r="2" /><circle cx="10" cy="17" r="2" />
    </svg>
  );
}

/** Live-page filter drawer: chip groups, live "Show N products", Apply / Reset. */
function FilterSheet({ filters, setFilters, onClose, count }: { filters: Filters; setFilters: (f: Filters) => void; onClose: () => void; count: (f: Filters) => number }) {
  const [draft, setDraft] = useState<Filters>(filters);
  const n = count(draft);
  const tog = (g: string, o: string) => setDraft((f) => ({ ...f, [g]: (f[g] ?? []).includes(o) ? f[g].filter((x) => x !== o) : [...(f[g] ?? []), o] }));
  return (
    <Sheet onClose={onClose} title="Filter" wide>
      <div className="space-y-6">
        {GROUPS.map((g) => (
          <div key={g.id}>
            <p className="mb-2.5 text-[14px] text-ink">{g.label}</p>
            <div className="flex flex-wrap gap-2">
              {g.options.map((o) => {
                const on = (draft[g.id] ?? []).includes(o);
                return (
                  <button key={o} onClick={() => tog(g.id, o)} aria-pressed={on}
                    className={`rounded-full border px-3.5 py-1.5 text-[13.5px] transition ${on ? "border-terra bg-terra-bg text-ink" : "border-line2 bg-white text-ink hover:border-ink/40"}`}>{o}</button>
                );
              })}
            </div>
            {g.id === "without" && <p className="mt-2 text-[12px] text-stone">*Allergen. Eve applies it everywhere, but always check the label if you have an allergy.</p>}
          </div>
        ))}
      </div>
      <div className="sticky bottom-0 -mx-5 mt-6 border-t border-line bg-paper px-5 pb-1 pt-4 text-center sm:-mx-6 sm:px-6">
        <p className="text-[13px] text-stone">Show {n} products</p>
        <button onClick={() => { setFilters(draft); onClose(); }} className="mt-2 w-full rounded-full bg-terra py-3 text-[14px] font-medium text-white">Apply filters</button>
        <button onClick={() => setDraft({})} className="mt-2 w-full rounded-full bg-offwhite py-3 text-[14px] text-stone">Reset filters</button>
      </div>
    </Sheet>
  );
}

const euro = (n: number) => `${n.toFixed(2).replace(".", ",")} €`;

/** Live card: image with badge, name + price/strike, description, macros, rating, and the box stepper. */
function ProductCard({ p, reason }: { p: Product; reason?: string }) {
  const { s, set, toast, openSheet } = useStore();
  const inBox = boxItems(s).find((b) => b.id === p.id)?.qty ?? 0;
  const nuts = p.contains.includes("nuts");

  const inc = () => {
    set((x) => { x.extras[p.id] = (x.extras[p.id] ?? 0) + 1; });
    if (!inBox) toast(`${p.name} added to your next box.`);
  };
  const dec = () => {
    if ((s.extras[p.id] ?? 0) > 0) return set((x) => { x.extras[p.id] -= 1; if (!x.extras[p.id]) delete x.extras[p.id]; });
    const day = [...s.weeks.next.keys()].reverse().find((i) => s.weeks.next[i].slots.some((y) => y.dishId === p.id));
    if (day === undefined) return;
    set((x) => { const sl = x.weeks.next[day].slots.find((y) => y.dishId === p.id)!; sl.dishId = null; });
    toast("Removed from your plan. That slot is your own cooking now.");
  };

  return (
    <article className="flex min-w-0 flex-col">
      <button onClick={() => openSheet({ kind: "dish", id: p.id })} className="relative block overflow-hidden rounded-[14px] bg-offwhite" aria-label={`About ${p.name}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset(p.img)} alt={p.name} loading="lazy" className="aspect-square w-full object-cover transition duration-300 hover:scale-[1.02]" />
        {nuts ? (
          <span className="absolute left-2 top-2 flex items-center gap-1 rounded-md bg-white px-2 py-1 text-[11.5px] text-ink"><NutIcon /> Contains nuts</span>
        ) : p.badge ? (
          <span className="absolute bottom-2 left-2 rounded-md bg-white px-2 py-1 text-[11.5px] text-ink">{p.badge}</span>
        ) : null}
      </button>
      <div className="mt-2 flex flex-col gap-0.5 sm:flex-row sm:items-start sm:justify-between sm:gap-2">
        <h3 className="min-w-0 text-[14px] font-medium leading-snug text-ink">{p.name}</h3>
        <p className="shrink-0 text-[14px] font-medium text-ink">{euro(p.price)} {p.oldPrice && <span className="ml-0.5 font-normal text-stone line-through">{euro(p.oldPrice)}</span>}</p>
      </div>
      <p className="mt-0.5 text-[12.5px] leading-snug text-stone">{reason ?? p.desc}</p>
      {p.hasMacros && (
        <p className="mt-0.5 text-[11.5px] text-stone">Protein {p.protein}g{p.kcal ? ` | kcal ${p.kcal}` : ""} | Carbs {p.carbs}g | Fats {p.fat}g</p>
      )}
      <p className="mt-1 flex items-center gap-1 text-[12px] text-ink"><span className="text-signal [text-shadow:0_0_0_#e3a53a]">★</span> {p.rating ? p.rating.toFixed(1) : "0"}</p>
      <div className="mt-auto pt-2.5">
        {inBox === 0 ? (
          <button onClick={inc} aria-label={`Add ${p.name} to your box`} className="flex h-9 w-full items-center justify-center rounded-lg bg-offwhite text-ink hover:bg-cream/60"><Icon name="plus" className="size-4" /></button>
        ) : (
          <div className="flex h-9 items-center justify-between rounded-lg bg-brown px-1 text-paper">
            <button onClick={dec} aria-label={`One less ${p.name}`} className="grid size-8 place-items-center">
              {inBox === 1 ? <TrashIcon /> : <span className="text-[18px] leading-none">−</span>}
            </button>
            <span className="text-[14px]" aria-live="polite">{inBox}</span>
            <button onClick={inc} aria-label={`One more ${p.name}`} className="grid size-8 place-items-center"><Icon name="plus" className="size-4" /></button>
          </div>
        )}
      </div>
    </article>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
      <path d="M4 7h16M9 7V4.5h6V7M6.5 7l.8 12.5a1 1 0 0 0 1 .9h7.4a1 1 0 0 0 1-.9L17.5 7M10 11v6M14 11v6" />
    </svg>
  );
}


function NutIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 4c3.5 0 6 2.6 6 6.5 0 4.4-2.8 9.5-6 9.5s-6-5.1-6-9.5C6 6.6 8.5 4 12 4Z" /><path d="M12 4c-1.2 1.6-1.8 3.7-1.8 6.2M9 13.5c.8.5 1.8.8 3 .8s2.2-.3 3-.8" />
    </svg>
  );
}
