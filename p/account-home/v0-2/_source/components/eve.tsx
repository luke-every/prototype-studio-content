"use client";

import { EveFace, EveFigure } from "./eve-mark";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { usePlanHref } from "./top";
import { asset, DELIVERY_OPTIONS, DISHES, dish, reasonFor } from "@/lib/data";
import { boxItems, hasGoal, useStore } from "@/lib/store";
import { CHIP_LABELS, matchChip } from "./plan";
import { Button, Icon } from "./ui";

type Opt = { label: string; run: () => void };
type Widget =
  | { kind: "topics" }
  | { kind: "box" }
  | { kind: "dishes"; items: { id: string; reason: string }[] }
  | { kind: "chips"; labels: string[] }
  | { kind: "options"; opts: Opt[] }
  | { kind: "human" };
type Msg = { id: number; from: "eve" | "me"; text?: string; widget?: Widget; rating?: "up" | "down" };

const TOPICS = ["What's in my next box?", "Change my goal", "Change my delivery day", "Pause, skip or cancel", "Something to eat", "My situation changed"];
const REASONS = ["Going away", "Freezer's full", "Not eating them in time", "Not my taste lately", "Too expensive", "Something else"];

/**
 * Eve: a side door with prompt chips (Noom, Instacart), a shortcut to the plan rather than a chatbot.
 * Scripted responses only. Reason-led, equal-weight pause/fewer/cancel, a visible human route (research §3).
 */
export function EveChat() {
  const { s, p, set, toast, track, openSheet } = useStore();
  const router = useRouter();
  const planHref = usePlanHref();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const id = useRef(0);
  const endRef = useRef<HTMLDivElement>(null);
  const seeded = useRef(false);

  const push = (...m: Omit<Msg, "id">[]) => setMsgs((prev) => [...prev, ...m.map((x) => ({ ...x, id: ++id.current }))]);
  const eve = (text: string, widget?: Widget) => push({ from: "eve", text, widget });
  const me = (text: string) => push({ from: "me", text });

  const close = () => set((d) => { d.eveOpen = false; d.eveSeed = null; });

  const addToNext = (dishId: string) => {
    set((d) => {
      for (const day of d.weeks.next) {
        const free = day.slots.find((x) => x.slot !== "breakfast" && !x.dishId);
        if (free) { free.dishId = dishId; return; }
      }
    });
    eve(`Added ${dish(dishId).name} to next week. Your box updated, still before tonight's cut-off.`);
  };

  const showDishes = (label: string) => {
    const items = matchChip(label, s).map(({ d, reason }) => ({ id: d.id, reason }));
    eve(
      `${items.length} from this week's menu${s.exclude.length ? " (I've left out anything with " + s.exclude.join(", ") + ")" : ""}:`,
      { kind: "dishes", items }
    );
  };

  const pauseFlow = () => eve("Of course. Can I ask what's going on? It helps me offer the right thing, and you can still cancel from here.", { kind: "options", opts: REASONS.map((r) => ({ label: r, run: () => reason(r) })) });

  const doCancel = () => {
    eve("Understood. Your box on Thu 1 Oct was already packed for you. What would you like?", {
      kind: "options",
      opts: [
        { label: "Cancel after this box", run: () => { me("Cancel after this box"); set((d) => { d.delivery.status = "cancelled"; }); track("cancel:after_box"); eve("Done. Your subscription ends after Thu 1 Oct. Your favourites and allergens stay saved, and restarting is one tap if you ever want it."); } },
        { label: "Cancel and skip this box", run: () => { me("Cancel and skip this box"); set((d) => { d.delivery.status = "cancelled"; d.delivery.label = ""; }); track("cancel:skip_box"); eve("Done. No more boxes, nothing further charged. Thanks for eating with us."); } },
      ],
    });
  };

  const reason = (r: string) => {
    me(r);
    track(`churn_reason:${r}`);
    const cancel: Opt = { label: "Cancel subscription", run: () => { me("Cancel subscription"); doCancel(); } };
    const skip: Opt = { label: "Skip next box", run: () => { me("Skip next box"); set((d) => { d.delivery.status = "skipped"; }); eve("Skipped Thu 1 Oct. Your rhythm is on hold, not reset. The box after that arrives as usual."); } };
    const fewer: Opt = { label: "Fewer meals next box", run: () => {
      me("Fewer meals next box");
      set((d) => { let n = 2; for (const day of [...d.weeks.next].reverse()) for (const sl of day.slots) if (n && sl.dishId) { sl.dishId = null; n--; } });
      eve("Done, two fewer meals in your next box. Your plan shows those slots as your own cooking.");
    } };
    const fortnight: Opt = { label: "Every two weeks", run: () => { me("Every two weeks"); set((d) => { d.delivery.cadence = "fortnightly"; }); eve("Switched to a box every two weeks, starting after Thu 1 Oct. Same meals, more breathing room."); } };
    const vacation: Opt = { label: "Vacation mode", run: () => { me("Vacation mode"); set((d) => { d.delivery.status = "vacation"; d.delivery.vacationUntil = "Fri 9 Oct"; }); track("vacation_mode:chat"); eve("Away 10 days? I'll hold your rhythm and restart your plan when you're back on Fri 9 Oct. Change the dates any time."); } };
    const map: Record<string, [string, Opt[]]> = {
      "Going away": ["Enjoy it. Here's what I can do:", [vacation, skip, cancel]],
      "Freezer's full": ["That happens. A smaller or less frequent box usually fixes it:", [fewer, fortnight, cancel]],
      "Not eating them in time": ["No problem, that tells me the plan is too full. Want a lighter one?", [{ label: "Lunches only", run: () => { me("Lunches only"); set((d) => d.weeks.next.forEach((day) => day.slots.forEach((sl) => { if (sl.slot !== "lunch") sl.dishId = null; }))); eve("Next week is lunches only now. Your box got smaller to match."); } }, fewer, cancel]],
      "Not my taste lately": ["Thanks for saying. Here's what I can do:", [{ label: "Show me new dishes", run: () => { me("Show me new dishes"); eve("Here's what's new or different from your usual:", { kind: "dishes", items: DISHES.filter((d) => d.kind === "meal" && !s.loved.includes(d.id) && !d.contains.some((a) => s.exclude.includes(a))).slice(0, 3).map((d) => ({ id: d.id, reason: reasonFor(d, p.goalOrNull) })) }); } }, skip, cancel]],
      "Too expensive": ["Understood. These keep the plan but lower the cost:", [fewer, fortnight, cancel]],
      "Something else": ["Okay. Here are the options, whichever you prefer:", [{ label: "Pause for 2 weeks", run: () => { me("Pause for 2 weeks"); set((d) => { d.delivery.status = "vacation"; d.delivery.vacationUntil = "Tue 13 Oct"; }); eve("Paused until Tue 13 Oct. Nothing resets."); } }, skip, cancel]],
    };
    const [text, opts] = map[r];
    eve(text, { kind: "options", opts });
  };

  const situation = () => eve("Thanks for telling me. What changed?", {
    kind: "options",
    opts: ["New routine at work", "Someone new at home", "A different goal", "Health or life stage"].map((l) => ({
      label: l,
      run: () => {
        me(l);
        track(`situation_changed:${l}`);
        eve("Then your plan should change too. I'll ask only what's different, about a minute.", {
          kind: "options",
          opts: [{ label: "Update my plan", run: () => { close(); openSheet({ kind: "onboarding" }); } }, { label: "Not now", run: () => { me("Not now"); eve("No rush. Just say “my situation changed” whenever you're ready."); } }],
        });
      },
    })),
  });

  const respond = (raw: string, echo = true) => {
    const q = raw.toLowerCase();
    if (echo) me(raw);
    if (q === "pause" || /pause|skip|cancel|break|stop|holiday|vacation|away/.test(q)) return pauseFlow();
    if (q === "situation" || /situation|changed|baby|new job|moved|pregnan|menopause/.test(q)) return situation();
    if (/goal|target|focus/.test(q)) { close(); openSheet({ kind: hasGoal(s) ? "goals" : "quiz" }); return; }
    if (/box|next delivery|what.?s in|coming/.test(q)) return eve(`Your box for ${s.delivery.label}, ${s.delivery.window}. You can change it until tonight at 23:59:`, { kind: "box" });
    if (/deliver|day|move|address|time/.test(q)) return eve("Which day works better for this box?", { kind: "options", opts: DELIVERY_OPTIONS.map((o) => ({ label: `${o.label} · ${o.window}`, run: () => { me(o.label); set((d) => { Object.assign(d.delivery, o); }); eve(`Moved to ${o.label}, ${o.window}. Your usual day stays Thursday.`); } })) });
    if (/person|human|agent|support|someone/.test(q)) return eve("Of course. A person from the Every team will pick this up.", { kind: "human" });
    if (/quick|fast|busy|minute/.test(q)) return showDishes("Something quick");
    if (/protein|fibre|fiber/.test(q)) return showDishes("High protein");
    if (/gluten/.test(q)) return showDishes("Recipe without gluten");
    if (/favou?rite|like last|similar/.test(q)) return showDishes("Like my last favourite");
    if (/eat|hungry|dinner|lunch|meal|tuesday|tonight|recommend/.test(q)) return eve("Happy to help. What kind of thing?", { kind: "chips", labels: CHIP_LABELS });
    eve("I'm a prototype, so I only know a few things so far. Try one of these:", { kind: "topics" });
  };

  useEffect(() => {
    if (!s.eveOpen) { seeded.current = false; return; }
    if (seeded.current) return;
    seeded.current = true;
    track("fake_door:ask_eve_open");
    setMsgs([]);
    const greeting: Omit<Msg, "id"> = { from: "eve", text: `Hi ${p.name}. I can change your box, move a delivery, find you something to eat or pause things for a while. What do you need?`, widget: { kind: "topics" } };
    if (s.eveSeed && s.eveSeed !== "pause" && s.eveSeed !== "situation") {
      push(greeting);
      setTimeout(() => respond(s.eveSeed!), 50);
    } else if (s.eveSeed) {
      push({ from: "eve", text: `Hi ${p.name}.` });
      setTimeout(() => respond(s.eveSeed!, false), 50);
    } else push(greeting);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s.eveOpen]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [msgs]);

  if (!s.eveOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end" role="dialog" aria-modal="true" aria-label="Ask Eve">
      <button aria-label="Close Eve" onClick={close} className="absolute inset-0 hidden bg-ink/30 animate-fade-in sm:block" />
      <div className="relative flex h-dvh w-full flex-col bg-paper shadow-e3 animate-sheet-up sm:max-w-[440px]">
        <div className="flex items-center gap-3 border-b border-line bg-white px-4 py-3">
          <div className="grid size-10 place-items-center rounded-full bg-olive-bg text-ink"><EveFace className="size-8" /></div>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-medium text-ink">Eve</p>
            <p className="truncate text-[12px] text-stone">An AI companion · a person is one tap away</p>
          </div>
          <button onClick={close} aria-label="Close" className="grid size-9 place-items-center rounded-full bg-offwhite text-ink"><Icon name="close" className="size-4" /></button>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
          <div className="flex justify-center pb-1 pt-2"><EveFigure pose="wave" className="h-24 w-auto" /></div>
          {msgs.map((m) => (
            <div key={m.id} className={`flex flex-col ${m.from === "me" ? "items-end" : "items-start"} animate-fade-in`}>
              {m.text && (
                <div className={`max-w-[85%] rounded-[20px] px-4 py-2.5 text-[14.5px] leading-relaxed ${m.from === "me" ? "rounded-br-md bg-ink text-paper" : "rounded-bl-md bg-white text-ink"}`}>{m.text}</div>
              )}
              {m.widget && <div className="mt-2 w-full">{renderWidget(m.widget)}</div>}
              {m.from === "eve" && m.id > 1 && (
                <div className="mt-1.5 flex gap-1">
                  {(["up", "down"] as const).map((r) => (
                    <button key={r} aria-label={r === "up" ? "Helpful" : "Not helpful"} aria-pressed={m.rating === r}
                      onClick={() => { setMsgs((prev) => prev.map((x) => x.id === m.id ? { ...x, rating: r } : x)); track(`eve_rating:${r}`); }}
                      className={`grid size-7 place-items-center rounded-full border ${m.rating === r ? "border-ink bg-ink text-paper" : "border-line2 text-stone"}`}>
                      <Icon name={r === "up" ? "thumbUp" : "thumbDown"} className="size-3.5" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <div className="border-t border-line bg-white px-4 pb-4 pt-3">
          <form onSubmit={(e) => { e.preventDefault(); if (input.trim()) { respond(input.trim()); setInput(""); } }} className="flex items-center gap-2 rounded-full bg-offwhite py-1.5 pl-4 pr-1.5">
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask Eve anything about your plan" aria-label="Message Eve" className="min-w-0 flex-1 bg-transparent py-1.5 text-[14.5px] text-ink outline-none placeholder:text-stone/70" />
            <button type="submit" disabled={!input.trim()} className="grid size-9 place-items-center rounded-full bg-ink text-paper disabled:opacity-30" aria-label="Send"><Icon name="send" className="size-4" /></button>
          </form>
          <button onClick={() => respond("Talk to a person")} className="mt-2.5 flex w-full items-center justify-center gap-1.5 text-[13px] text-stone hover:text-ink">
            <Icon name="person" className="size-4" /> Talk to a person instead
          </button>
        </div>
      </div>
    </div>
  );

  function renderWidget(w: Widget) {
    switch (w.kind) {
      case "topics":
        return (
          <div className="divide-y divide-line overflow-hidden rounded-[20px] border border-line bg-white">
            {TOPICS.map((t) => (
              <button key={t} onClick={() => { me(t); respond(t === "Something to eat" ? "eat" : t, false); }} className="flex w-full items-center justify-between px-4 py-3 text-left text-[14px] text-ink hover:bg-offwhite">
                {t}<Icon name="chevron" className="size-4 text-stone" />
              </button>
            ))}
          </div>
        );
      case "chips":
        return <div className="flex flex-wrap gap-2">{w.labels.map((l) => <button key={l} onClick={() => { me(l); showDishes(l); }} className="rounded-full border border-line2 bg-white px-3.5 py-2 text-[13px] font-medium text-ink hover:border-ink/40">{l}</button>)}</div>;
      case "options":
        // Equal weight: every option is the same outlined button, cancel included.
        return <div className="flex flex-wrap gap-2">{w.opts.map((o) => <button key={o.label} onClick={o.run} className="rounded-full border border-line2 bg-white px-3.5 py-2 text-[13px] font-medium text-ink hover:border-ink/40">{o.label}</button>)}</div>;
      case "box": {
        const items = boxItems(s);
        return (
          <div className="rounded-[20px] border border-line bg-white p-3">
            {items.map(({ id, qty }) => (
              <div key={id} className="flex items-center gap-3 py-1.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset(dish(id).img)} alt="" className="size-10 rounded-lg object-cover" />
                <span className="flex-1 text-[14px] text-ink">{dish(id).name}</span>
                <span className="text-[13px] text-stone">×{qty}</span>
              </div>
            ))}
            <Button size="sm" variant="gray" className="mt-2 w-full" onClick={() => { close(); router.push(planHref); }}>Edit in My Plan</Button>
          </div>
        );
      }
      case "dishes":
        return (
          <div className="no-scrollbar -mx-4 flex gap-2.5 overflow-x-auto px-4">
            {w.items.map(({ id, reason }) => (
              <div key={id} className="w-[180px] shrink-0 overflow-hidden rounded-[18px] border border-line bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset(dish(id).img)} alt="" className="h-24 w-full object-cover" />
                <div className="p-3">
                  <p className="text-[14px] font-medium text-ink">{dish(id).name}</p>
                  <p className="mt-0.5 line-clamp-2 text-[12.5px] leading-snug text-stone">{reason}</p>
                  <button onClick={() => { me(`Add ${dish(id).name}`); addToNext(id); }} className="mt-2 flex w-full items-center justify-center gap-1 rounded-full bg-offwhite py-1.5 text-[12.5px] font-medium text-ink hover:bg-cream/60">
                    <Icon name="plus" className="size-3.5" /> Next week
                  </button>
                </div>
              </div>
            ))}
          </div>
        );
      case "human":
        return (
          <div className="flex items-center gap-3 rounded-[20px] border border-line bg-white p-3.5">
            <div className="grid size-10 place-items-center rounded-full bg-sky-bg text-sky"><Icon name="person" /></div>
            <div className="flex-1">
              <p className="text-[14px] font-medium text-ink">Every customer care</p>
              <p className="text-[12.5px] text-stone">Usually replies in about 10 min · Mon–Fri 8–18</p>
            </div>
            <Button size="sm" onClick={() => { track("handoff:human"); toast("Prototype: this would open the support chat."); }}>Connect</Button>
          </div>
        );
    }
  }
}

export function EveFab() {
  const { s, openEve } = useStore();
  if (s.eveOpen) return null;
  return (
    <button onClick={() => openEve()} className="fixed bottom-5 right-4 z-40 flex items-center gap-2 rounded-full bg-ink py-2.5 pl-2.5 pr-5 text-[15px] font-medium text-paper shadow-e3 transition hover:scale-[1.02] active:scale-[.98] sm:right-6">
      <span className="grid size-9 place-items-center rounded-full bg-paper text-ink"><EveFace className="size-7" /></span>
      Ask Eve
    </button>
  );
}
