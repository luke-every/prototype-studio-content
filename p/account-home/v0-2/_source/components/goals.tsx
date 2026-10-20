"use client";

import { useState } from "react";
import { buildWeek, Goal, goalBg, GOALS, goalInfo, groupBg, NEXT_MONDAY, persona } from "@/lib/data";
import { hasGoal, State, useStore, weekEaten } from "@/lib/store";
import { Button, Icon, Sheet } from "./ui";

/** Kept for older call sites: meals from the plan eaten this week. */
export function weeklyDone(s: State) {
  return weekEaten(s);
}

/** Last 4 weeks of eaten meals (oldest first). Past weeks come from the rhythm history, this week is live. */
export function weeklyHistory(s: State) {
  const days = s.rhythm.slice(0, 21);
  const weeks = [0, 1, 2].map((w) => days.slice(w * 7, w * 7 + 7).filter((d) => d.state === "made").length);
  return [...weeks.map((n) => Math.min(n, s.weeklyTarget + 1)), weekEaten(s)];
}

/** Goal tag pill (F1/F2): the persistent anchor for the goal, tappable into goal management. */
export function GoalTag({ dark = false }: { dark?: boolean }) {
  const { s, openSheet } = useStore();
  const g = goalInfo(s.goal);
  if (!hasGoal(s)) return null;
  return (
    <button onClick={() => openSheet({ kind: "goals" })} aria-label={`Your goal: ${g.label}. Change goal`}
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-[12.5px] font-medium ${dark ? "bg-paper/15 text-paper" : `${goalBg(s.goal)} text-ink`}`}>
      <Icon name="leaf" className="size-3.5" /> {g.label}
      {s.goalFrom && <span className="opacity-70">· from {s.goalFrom}</span>}
      <Icon name="chevronDown" className="size-3.5 opacity-70" />
    </button>
  );
}

/**
 * Goal progress (F7, Miro "Dashboard & Goal Tracking"). Calm, never graded: weekly bars of meals eaten ÷ weekly target,
 * plus a stat row. On Home it collapses to one line (`compact`).
 */
export function GoalProgress({ compact = false }: { compact?: boolean }) {
  const { s, openSheet } = useStore();
  const g = goalInfo(s.goal);
  const hist = weeklyHistory(s);
  const eaten = weekEaten(s);
  const target = s.weeklyTarget;
  const month = hist.reduce((a, b) => a + b, 0);
  const monthTarget = target * 4;
  const pct = Math.round((month / monthTarget) * 100);
  const isNew = s.customer === "new" || !s.planConfirmed;

  // No goal yet (new customer, quiz not answered): no goal name, targets or progress. One way in instead.
  if (!hasGoal(s)) {
    return (
      <section aria-label="Set up your goal" className={`flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-[20px] border border-line px-4 py-3 ${compact ? "" : "bg-white sm:p-5"}`}>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-medium text-ink">No goal set yet</p>
          <p className="text-[13px] text-stone">Answer Eve&apos;s 10 questions and your plan gets a goal that fits you.</p>
        </div>
        <button onClick={() => openSheet({ kind: "quiz" })} className="rounded-full bg-ink px-3.5 py-2 text-[13px] font-medium text-paper">Answer Eve&apos;s questions</button>
      </section>
    );
  }

  if (compact) {
    return (
      <section aria-label="Your goals" className={`flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-[20px] px-4 py-3 ${goalBg(s.goal)}`}>
        <div className="min-w-0">
          <p className="eyebrow !text-[10.5px]">Your goal</p>
          <p className="mt-0.5 font-serif text-[19px] leading-tight text-ink">{g.label}</p>
        </div>
        <div className="flex items-center gap-3">
          {isNew ? (
            <p className="text-[13px] text-stone">Progress starts after your first week</p>
          ) : (
            <p className="text-[13px] text-body">
              <b className="font-medium text-ink">{eaten} of {target}</b> meals this week{pct >= 80 ? " · that's the 80" : ""}
            </p>
          )}
          <button onClick={() => openSheet({ kind: "quiz", goalOnly: true })} className="flex items-center gap-1 rounded-full bg-white/70 px-3 py-1.5 text-[12.5px] font-medium text-ink hover:bg-white">
            <Icon name="swap" className="size-3.5" /> Adjust
          </button>
        </div>
        <p className="w-full text-[12.5px] text-stone">Missed meals never count against you.</p>
      </section>
    );
  }

  return (
    <section aria-label="Goal progress" className="overflow-hidden rounded-[20px] border border-line bg-white">
      <div className={`flex items-start justify-between gap-3 px-4 py-4 sm:px-5 ${goalBg(s.goal)}`}>
        <div>
          <p className="eyebrow">Goal progress</p>
          <p className="mt-1 text-[14px] text-body">Meals from your plan you ate, week by week</p>
        </div>
        <span className="shrink-0 rounded-full bg-white/70 px-3 py-1 text-[12.5px] font-medium text-ink">{g.label}</span>
      </div>
      <div className="p-4 sm:p-5 sm:pt-4">
      {isNew ? (
        <div className="mt-4 rounded-2xl bg-paper p-4 text-[13.5px] text-stone">
          Your progress fills in after your first week. Nothing to count or log: meals count as eaten unless you tell Eve otherwise.
        </div>
      ) : (
        <>
          <div className="mt-4 grid grid-cols-4 items-end gap-3" style={{ height: 92 }} aria-hidden="true">
            {hist.map((n, i) => {
              const h = Math.max(6, Math.min(1, n / target) * 80);
              return (
                <div key={i} className="flex h-full flex-col items-center justify-end gap-1">
                  <span className="text-[11px] text-stone">{n}/{target}</span>
                  <div className={`w-full max-w-[44px] rounded-t-lg ${i === 3 ? "bg-terra" : "bg-olive/70"}`} style={{ height: h }} />
                </div>
              );
            })}
          </div>
          <div className="mt-1 grid grid-cols-4 gap-3 text-center text-[11px] text-stone">
            {["3 wks ago", "2 wks ago", "Last week", "This week"].map((l) => <span key={l}>{l}</span>)}
          </div>
          <dl className="mt-4 grid grid-cols-3 divide-x divide-line rounded-2xl bg-paper text-center">
            <div className="py-3"><dt className="text-[11.5px] text-stone">Eaten this month</dt><dd className="font-serif text-[20px] text-ink">{month}</dd></div>
            <div className="py-3"><dt className="text-[11.5px] text-stone">Monthly target</dt><dd className="font-serif text-[20px] text-ink">{monthTarget}</dd></div>
            <div className="py-3"><dt className="text-[11.5px] text-stone">On track</dt><dd className="font-serif text-[20px] text-ink">{pct}%</dd></div>
          </dl>
          <p className="mt-3 text-[12.5px] text-stone">{pct >= 80 ? "That's the 80. The other 20 is already part of the plan." : "Busy weeks happen. Nothing resets, and missed meals never count against you."}</p>
        </>
      )}
      </div>
    </section>
  );
}

/** Older name kept so variant homes keep compiling; Home uses the compact line now. */
export function GoalsCard({ compact = true }: { compact?: boolean }) {
  return <GoalProgress compact={compact} />;
}

const GROUPS = ["Eat well", "Weight", "Fitness", "Postpartum"];

/**
 * Goal management (F4, Miro): all goals, current pre-selected, live preview of meals/week and focus,
 * "Update my plan" only once a different goal is chosen. A change applies from next month's plan
 * (here: from the next order, since the month turns on Thu 1 Oct); loves, dislikes and history are kept.
 */
export function GoalSheet({ onClose, preset }: { onClose: () => void; preset?: Goal }) {
  const { s, set, toast, track, openSheet } = useStore();
  const [goal, setGoal] = useState<Goal>(preset ?? s.goal);
  const cur = goalInfo(s.goal);
  const next = goalInfo(goal);
  const changed = goal !== s.goal;

  return (
    <Sheet onClose={onClose} eyebrow="Your goal" title="What would you like every to help with?" wide>
      <div className="space-y-5">
        {GROUPS.map((grp) => (
          <div key={grp}>
            <p className="eyebrow mb-2">{grp}</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {GOALS.filter((x) => x.group === grp).map((x) => (
                <button key={x.id} role="radio" aria-checked={goal === x.id} onClick={() => setGoal(x.id)}
                  className={`flex items-start justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition ${groupBg(grp)} ${goal === x.id ? "border-ink ring-1 ring-ink" : "border-transparent hover:border-ink/30"}`}>
                  <span>
                    <span className="block text-[15px] font-medium text-ink">{x.label}{x.id === s.goal && <span className="ml-1.5 text-[12px] font-normal text-stone">current</span>}</span>
                    <span className="text-[12.5px] leading-snug text-stone">{x.hint}</span>
                  </span>
                  {goal === x.id && <Icon name="check" className="mt-0.5 size-5 shrink-0" strokeWidth={2.2} />}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Live preview of what changes */}
      <div className={`mt-6 rounded-2xl p-4 transition ${goalBg(goal)}`}>
        <p className="text-[14px] font-medium text-ink">{changed ? `With “${next.label}” your plan becomes` : "Your plan today"}</p>
        <div className="mt-2 grid grid-cols-2 gap-3 text-[13px]">
          <div className="rounded-xl bg-white/80 p-3">
            <p className="text-stone">Meals a week</p>
            <p className="font-serif text-[20px] text-ink">{changed && next.baseMeals !== cur.baseMeals ? <><span className="text-stone line-through">{s.weeklyTarget}</span> {Math.max(next.baseMeals, s.weeklyTarget)}</> : s.weeklyTarget}</p>
          </div>
          <div className="rounded-xl bg-white/80 p-3">
            <p className="text-stone">Focus</p>
            <p className="text-[13.5px] leading-snug text-ink">{next.chips.map((c) => c.label).join(" · ")}</p>
          </div>
        </div>
        {next.science && <p className="mt-3 text-[13px] leading-relaxed text-body">{next.science}</p>}
        <p className="mt-2 text-[12px] text-stone">Your loves, dislikes and history stay. This week&apos;s plan stays as it is; the new goal shapes your plan from your next order (1 Oct).</p>
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        <Button disabled={!changed} onClick={() => {
          set((d) => {
            d.goal = goal;
            d.goalFrom = "1 Oct";
            d.weeklyTarget = Math.max(goalInfo(goal).baseMeals, d.weeklyTarget);
            d.weeks.next = buildWeek({ ...persona(d.personaId), goal, exclude: d.exclude }, NEXT_MONDAY, 2);
            d.sheet = null;
          });
          track(`goal:${goal}`);
          toast(`Goal saved: ${goalInfo(goal).label}. Your plan follows it from 1 Oct.`);
        }}>Update my plan</Button>
        <Button variant="gray" onClick={onClose}>Keep my current goal</Button>
      </div>
      <button onClick={() => openSheet({ kind: "quiz" })} className="mt-4 w-full text-center text-[13px] text-stone underline decoration-line2 underline-offset-4 hover:text-ink">
        Life changed more than this? Answer Eve&apos;s questions again
      </button>
    </Sheet>
  );
}
