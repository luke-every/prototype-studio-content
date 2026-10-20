# Every Account Home · Eve prototype

A clickable prototype of the Every account home with **Eve**, the AI food companion. It is built from:

- `../eve-benchmark-report/eve-benchmark-priority-1-2.md` (12 benchmark areas) and its Mobbin screens in `../eve-benchmark-report/images/`
- the Miro frame **"Eve Account Journey: 12 Areas + Account Features"** ([board](https://miro.com/app/board/uXjVHrH9btM=/?moveToWidget=3458764685394753534)), which has 7 phases and 7 personas
- the Figma page **"Account UX fixes and Revamp – READY FOR DEV"** ([New Customer Account, node 668:16565](https://www.figma.com/design/AJsryIExS2EHnA9WgqeKX3/New-Customer-Account?node-id=668-16565)) for the **My Plan** tab

Stack: **Next.js 16 (App Router) + Tailwind CSS 4 + TypeScript**. Every value is **mock data**. There is no database and there are no API calls. The "AI" is scripted.

---

## Setup

Requires Node 20+.

```bash
cd every-account-home
npm install
npm run dev
```

Open **http://localhost:3000/account-home/** (Home) or **/account-home/my-plan/** (My Plan). The app uses `basePath: "/account-home"`, so the root URL is a 404.

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Static export to `out/` |
| `npm run export:vercel` | Build, then copy `out/` to `../account-home/`, the folder the `every-vision` Vercel project serves |

### Deploying (Vercel "every-vision" project, section `/account-home`)

The `/Designs` folder is deployed as static HTML by the `every-vision` Vercel project. This app is published as a **static export** into `/Designs/account-home/`, so it appears as a new section at `<every-vision-domain>/account-home/`, linked from `index.html`.

```bash
cd every-account-home && npm run export:vercel   # refresh /Designs/account-home
cd .. && vercel --prod                            # deploy /Designs (confirm first)
```

`/Designs/.vercelignore` excludes this source folder, so only the built output is uploaded.

### Using the prototype

- **Prototype bar (top):** switch persona. Each switch resets the state.
  - **Anna (M2.1 Lapsed).** Goal Healthy gut (Q1 "Support my gut"), the plants-first persona. Eats with her partner (the plan is still for 1 person in Phase 1). 5 meals, Mon–Thu, lunch and dinner. Rhythm 11 of 14.
  - **Jonas (M1.2 Overwhelmed).** Goal Maintain weight (from "Lose weight → feel lighter"). 5 lunches, Mon–Fri. Lowest rhythm (7 of 14), no numbers.
  - **Mia (M2.3 Lapsed).** Goal Build muscle (from "Nutrition for fitness → Build more muscle"). Avoids soy. Breakfast Mon–Fri plus 4 lunches and dinners. Rhythm 13 of 14; numbers visible and the opt-in **nutrition view**.
  - Each persona's plan is built from its quiz answers (`scheduleFromQuiz`), so quiz, goal and plan always agree. A dev-only check in `lib/data.ts` warns in the console if they drift apart.
- **Delivery switch (prototype bar):** *Coming*, *Arrives today* or *Cancelled*. These are the three My Plan use cases from Figma, and Home follows the same state.
- The clock is fixed at **Tue 29 Sep 2026, 14:20**, so the cut-off countdown and day states are stable in every demo.
- Fake-door and research events (`fake_door:*`, `churn_reason:*`, `checkin:*`, `vacation_mode:*` and so on) are logged to the browser console with the `[prototype event]` prefix.

---

## Structure

```
app/
  layout.tsx        ABC Diatype + ABC Marist via next/font/local
  page.tsx          Account home layout (main column + rail)
  my-plan/page.tsx  My Plan tab
  v2/, v3/          Variant B and C (home + my-plan)
  globals.css       Every design tokens as a Tailwind @theme
components/
  shell.tsx         Shared chrome for both tabs (store, prototype bar, header, footer, Eve, sheets, toasts)
  myplan.tsx        My Plan: delivery-coming, same-day and cancelled states
  variant-b.tsx     Variant B home (week view + Figma Discover blocks)
  variant-c.tsx     Variant C home (simplified IA)
  allmeals.tsx      All Meals (live-page rebuild + Eve search, chips, silent exclusions)
  footer.tsx        Footer from the Figma frames (accordions on mobile, columns on desktop)
  top.tsx           Prototype bar (persona + delivery state), header with Home / All meals / My Plan, state-aware greeting, next-delivery card, evening nudge
  plan.tsx          "This week" editorial header, search-or-ask + chips, week tabs, day strip, meal cards
  progress.tsx      Rhythm calendar, check-in card, impact counter, Wrapped teaser, nutritionist perk
  sheets.tsx        Why this meal, swap, check-in, vacation, delivery day, nutritionist, nutrition view, preferences
  onboarding.tsx    Returning-customer "start fresh" flow with build moment
  wrapped.tsx       Every Wrapped story (4 slides)
  eve.tsx           Ask Eve chat panel + floating entry point
  ui.tsx            Icons, buttons, chips, cards, bottom sheet, toasts
  eve-mark.tsx      Eve's face (line icon redrawn from Illustrations/Every_character_A) + full-body figures
lib/
  data.ts           Mock dishes, personas, plans, rhythm, delivery options
  catalog.ts        The 78-product live menu (names, prices, macros, ratings, badges, categories, CDN images)
  store.tsx         React context state (plan = box, exclusions, sheets, toasts, events)
public/meals/       Real Every dish photos (resized)
public/eve/         Eve figures (waving, hugging a squash) cut from the Every character illustrations
```

---

## Variants

All three variants share the same data, Eve, sheets and My Plan. The prototype bar's **Variant A / B / C** switch keeps your state.

| Variant | URL | Idea |
| --- | --- | --- |
| **A · Original** | `/account-home/` | Unchanged. Day strip with meal slots, the full research feature set on one page. |
| **B · Week + Discover** | `/account-home/v2/` | Meals are organised **by week only**, with no day strip. Groups are "Still to enjoy" (past uneaten meals say "In your freezer", because frozen meals don't expire), "Enjoyed", and a "Next week" toggle for the box. The **Figma Discover elements** (node 668:19244) are on the home: September Drop hero, **This month's favourite** (Peas & Love, add to box), **Meet the full menu** category circles, **Which bundle fits you?** (links to the bundle PDP prototypes), **Talk of the table** (dish info sheet) and the **Enjoy 15% off** discount milestones. Delivery, check-in, rhythm, impact/Wrapped and the nutritionist sit in the rail. |
| **C · Simplified** | `/account-home/v3/` | **All 12 features, simpler IA.** Five blocks in question order: **Today** (one meal: made it / swap / why) → **For you now** (one nudge at a time: fridge, check-in, Wrapped; "Not now" skips it) → **Next delivery** (one **Manage** sheet: move day, change meals, skip, going away, pause or cancel via Eve) → **This week** (a plain day list; the allergen line is shown once with Edit) → **Your progress** (rhythm, plants, time saved, Wrapped, vacation mode, ask a nutritionist). Eve is a single ask-or-search bar; its chips appear only on focus. |

**Section bands (Variants A and B homes).** Both homes are built from full-width sections (`components/band.tsx`). They alternate **white → #FAF7F2 (paper) → white → #FAF7F2**, and each section overlaps the one above with a 32px rounded top edge, like the bundle PDPs.
- **A:** Greeting → *Your next delivery* → *This week* → *Your rhythm* → *Your month with every*
- **B:** Greeting → *Your next delivery* with the milestones → *Your week of meals* → full-bleed seasonal hero → *This month's favourite* → *Meet the full menu* and Talk of the table → *Which bundle fits you?* → *Your rhythm & perks*

Variant C feature map:
1. Onboarding quiz: "Start fresh" in the greeting line
2. Plan & swap: Today and This week
3. Chat self-service: Manage and Eve
4. Nudges & lapse: For you now, plus vacation mode
5. Celebrate: Your progress and Wrapped
6. AI search: the Eve bar
7. Allergens: the "Leaving out" line
8. Why this meal: "Why this?" and the week rows
9. AI companion: the Eve bar and floating button
10. Meal logging: "Made it"
11. Coaches: "Ask a nutritionist"
12. Customers without a quiz: "Eve kept your last plan. Still right for you?"

---

## All Meals tab (all three variants)

Available at `/account-home/all-meals/`, `/v2/all-meals/` and `/v3/all-meals/`. The header tab links to it, and so do Variant B's "Meet the full menu" and "Talk of the table" links.

**Variant A only: "Discover Every".** In Variant A the tab is called **Discover Every**. It combines the Figma Discover-tab sections (node 668:19244) with the All Meals UI, in this order:
1. September Drop hero
2. Search or ask Eve, with the chips
3. Meet the full menu. The circles jump to the matching category section below.
4. Which bundle fits you?
5. Talk of the table
6. This month's favourite. In Variant A the discount milestones ("Enjoy 15% off!") moved to **My Plan**, under the price breakdown.
7. "The full menu": the sticky category tabs, the filter and all 78 products

Variants B and C keep the plain **All meals** tab. B already has these Discover sections on its home.

It's rebuilt from the **live account page** (every-foods.com/en/account/all-meals, read logged-in on 30 Sep 2026):
- **Catalogue:** all **78 products**, with the real names, descriptions, prices and strike prices, macros, ratings and badges. The 9 category sections (Latest Additions 18 · Pasta & Noodles 21 · Curries & Dals 8 · Signature Bowls 21 · High Protein Bowls 3 · Breakfast 13 · Sweet Snacks 9 · Toppings 2 · Merch 1) are in `lib/catalog.ts`.
- **Images:** hotlinked from Every's public Storyblok/Shopify CDNs, not copied into the repo.
- **Navigation:** sticky category tabs that highlight the section you're in.
- **Filter drawer:** Base, Add-Ons, Nutrition, Spiciness and Recipe without, with a live "Show N products" count, Apply and Reset.
- **Cards:** a "New", badge or "Contains nuts" label, price with the old price struck through, description, macros line, rating, and a **box stepper** (+ / trash, quantity, +).

The Eve layer from the research adds:
- **One "Search meals or ask Eve" field.** Questions go to Eve.
- **4 chips** ("Something quick", "High protein", "Like my last favourite", "Recipe without gluten"). Each opens a row of **Eve's picks**, and every pick has a reason line.
- **Silent allergen exclusions.** Products with your "can't eat" allergens are hidden (Mia: 14 soy recipes), with one quiet "Show" line to undo it.
- **One box.** The stepper edits the same box as My Plan: extras sit on top of the plan, and removing a planned meal frees that slot.

The mock plan meals now use their live names and prices (Paella Del Sol, Pasta Arrabbiata, Sesame Quinoa Salad, Crunchy Beetroot Salad, and so on), so Home, My Plan and All Meals agree.

**Caveat:** the live cards don't show allergens, base, spiciness or "recipe without" tags. For filtering, the prototype **derives them from product names and descriptions**. They are not real allergen data.

---

## Adjust goal → goal questions only (19 Oct 2026)

"Adjust goal" (Home goal card) and "Adjust" (compact goal line) open Eve's quiz with only the questions that generate the goal: Q1 main goal, then the weight or fitness follow-up when it applies. Answers are pre-filled. The goal screen shows the result ("Your new goal · was …" or "Your goal stays") with "Update my goal" / "Keep this goal" and "Change my answers". A new goal shapes the plan from the next order (1 Oct); this week, loves, dislikes and history stay. "Change goal" in My Plan (goal card, plan details and starter-plan header) uses the same goal-only questions. The "Explore other goals" cards still open the goal picker with that goal pre-selected. Both copies.

## Second copy: /account-home-2 (19 Oct 2026)

The same prototype (all variants, personas and prototype-bar states) is also published at `/account-home-2/`, without three features: the "Keep it going" section on every Home (A and B: "Your month with every"; C: "Your progress"), the Every Wrapped band, the "Explore other goals" cards in My Plan, the "Search meals or ask Eve" field with its chips in "Your week" (A, B), and in the delivery band the address, the "N items in your box" block and the "Edit meals" button; Move day · Skip this box · Going away? move from the delivery band to under the greeting; the freezer line is removed from the band. While a box is coming, the band is dropped entirely and the greeting carries the date, time window and edit cut-off ("Your box arrives Thursday, 1 October."); skipped, on hold, cancelled and "arrives today" still show the band with their restart or tracking actions. My Plan's five goal cards collapse into one small goal card with "See plan details", which opens them in a modal. Variant B's week keeps the swipeable meal cards, slimmed to image, meal name, Made it and Swap (no slot, description, time or plants), and drops the tag pills. The quiz uses Eve illustrations from the Air board "Eve (brand character)" instead of photos and emojis: Happy Tummy Eve on the intro and "Welcome back", Happy Eve on the 80% screen, and per satisfaction level Cold → Lazy → Leaf → Spoon → Happy Tummy Eve (files in `public/eve/`). Illustrations follow the message, using Eve where one fits and the Air "New Storytelling Icons" (`public/eve/icon-*.png`) otherwise. Goal fact: Happy Tummy Eve (lose weight), Gut Health (gut), Signature Bowls (balanced), Variety (maintain), High Protein Bowls (lean, muscle), Kcal (energy), Curry & Dals (postpartum). Benefit screen, by first challenge: Ready in minutes (time to cook), Lazy Eve (deciding), Every cubes (balanced diet), Delivery A (food waste), Spoon Eve (cooking isn't my thing), Happy Eve (budget). The quiz's interstitials are personalised: after the goal questions a goal-specific fact replaces the 80% claim (e.g. Build muscle: "Building muscle while training needs enough protein and enough calories, together."), and the benefit screen after the challenges adds a fact about what they watch for (e.g. "You watch your protein: every meals average 20 g per portion."). All wording comes from the Miro goals board. Same source, built with `BASE_PATH=/account-home-2` and `NEXT_PUBLIC_LEAN=1`; what the flag hides is listed in `lib/flags.ts`.

- `npm run export:vercel` builds `/account-home` · `npm run export:vercel:2` builds `/account-home-2` · `npm run export:all` builds both. Then deploy from `/Designs` with `vercel --prod --yes`.
- Links into My Plan now go through `next/link`, so they keep the right prefix in both copies.

## Screen-wide bands (19 Oct 2026)

On every Home, the goal and the next delivery are screen-wide bands like the sections on the LPs and PDPs (edge to edge, 32 px radius, content on the 1120 px grid) instead of floating cards: `Band` in `components/section.tsx`. The goal band uses the goal colour (desktop: the mood photo fills the right half); the delivery band is dark brown with date, cut-off, the box, savings, the freezer line and "Edit meals" (states: coming, today, skipped, vacation, cancelled). Other sections keep the section frame.

## Goal sections, bundle-result style (15 Oct 2026)

The goal sections in all three variants borrow the visual language of the Figma "Website" bundle result screens (node 5661:24113). Code: `components/goal-a.tsx`. In B and C target numbers stay one tap deep: the Home hero number becomes a meal count for macro goals, the stat card shows "In the right range" per focus (tap a focus for the numbers), and the benefit rows drop the gram and kcal targets.

- **Home, "Your goal: *Healthy gut*":** serif headline with the goal in italic, the customer's own quiz answers as check pills, the goal's mood photo, one hero number for the goal (e.g. plants this week, protein from your meals), this week's meals as photo thumbnails (eaten = full colour with a tick, upcoming = faded), "See your plan" and "Adjust goal".
- **My Plan, "Your plan: *The plants-first plan*":** hero with answer pills, a swipeable row of the mood photo and this week's dishes, and a one-line summary with real averages · "What's in your week" average-per-meal stat card against the targets, plus dish photos · "Your progress" (4-week bars, capped at the target) · benefit band with an italic headline, two photos and icon rows from the goal's focus areas · "Dig a little deeper" FAQ (why it works, how Eve picks meals, missed meals, optional portion tuning) · "Not sure it's the right goal? *Explore other goals*" cards in each group colour, which open the goal sheet with that goal pre-selected.
- **Photos:** the bundle hero images from the Figma (Protein → Fitness, Perfect Portions → Weight, Postpartum → Postpartum) and the quiz table photo for Eat well.
- **Borrowed copy:** the benefit headlines are the Figma bundle-result headlines, reused per goal group until goal-specific copy exists ("When protein is sorted, the rest gets easier.", "When eating is sorted, losing weight gets easier.", "The weeks will change. The food keeps up.", "Every detail. Thought through.").

## Section structure, all variants (13 Oct 2026)

Home and My Plan in all three variants are a few themed sections, in the same order on mobile and desktop (`components/pages.tsx`, frame in `components/section.tsx`). Each variant keeps its character inside the frame:
- **A:** Today · Your goal · Your week (day planner) · Your box · Your month.
- **B:** Today · Your goal · Your week (carousel, this week / next week's box) · Your box · Discover every (seasonal, favourite, menu, talk of the table, bundles) · Your month.
- **C:** Today (greeting, Eve slot, Ask Eve bar, today's meal) · Your goal · Your meals (plain list) · Your box · Your progress. C's old "For you now" queue is replaced by the shared single Eve slot.
- **My Plan** is the same five sections everywhere; target numbers on the goal chips only in A; discount milestones in A and B.

- **One frame per section:** eyebrow, serif title, at most one action; one content surface; no cards inside cards. Pages sit on paper, interactive groups on white, the goal colour only on the goal section.
- **Home:** Today (greeting + one Eve slot: moment → weekly check-in → fridge nudge) · Your goal · Your week (search/ask + day planner, "Edit in My Plan") · Coming up / Your box (delivery card with the freezer line folded in) · Your month (rhythm, impact, Wrapped, perk; "Keep it going" and "Celebrate" merged). New customers see Today, the goal entry and the box only.
- **My Plan:** sticky section chips (Goal · Eve noticed · Meals · Next order · Subscription) that track the scroll position. Your goal (goal header with 4-week progress folded in, long message behind "Read more") · Eve noticed (moment card + one list of max 3: freezer gap/surplus, pre-delivery swap/add/keep, plan signals; hidden when empty) · Your meals (week/calendar toggle in the section header) · Next order (delivery row replaces the dark hero; box, price + discount milestones, add-ons) · Subscription (settings, pause/skip/cancel, referral last).
- Cancelled subscriptions still use the earlier cancelled view.

## Vision build (all three variants)

This is a **vision prototype**: every Eve Phase 1 feature from the Notion scope, the Miro spec board and the heuristic review is shown as envisioned, in all three variants. Nothing is parked in a backlog. The variants differ only in how Home summarises it (A day-first, B week + Discover, C five questions).

**Vision decisions (Victor, 12 Oct 2026)**
- **Goal-filled plan.** Eve fills the plan from the goal pool; the next box follows the plan.
- **Eaten is assumed** on the scheduled day. Customers correct it only if they didn't eat it ("Eaten · didn't?"). Today counts once tapped.
- **Gentle, opt-in depth.** Feeling-language goals, soft focus chips, % of the day and kcal one tap deep, an optional height/weight deep-dive.
- **The 8 goals** (Miro "05.10.2026: Goal Generation Logic", updated 13.10): Balanced & healthy eating, Healthy gut, Lose weight, Maintain weight, Stay lean & healthy, More energy, Build muscle, Support postpartum. Each carries the board's per-meal targets, meals/week, pool rules (used for Eve's meal ordering), motivational message, science snippet and "every's contribution". "Lose weight" is shown as is (Victor, 13 Oct). Board copy that's still empty or duplicated (balanced message, stay-lean snippet, quiz completion and plan reveal messages, check-in quotes for balanced) is left out until the board is filled in.
- **Goal colours:** each goal group has its every colour everywhere a goal appears (goal tag, Home goal line, goal progress header, My Plan goal header and chip drawer, goal sheet options and preview, "Fits your goal" pills, Why-this-meal pill, check-in reply, quiz Q1 tiles, goal screen and "Your best match" card): Eat well `#F2E5F4`, Weight `#F9DDD2`, Fitness `#D7EBC2`, Postpartum `#F8E8B7` (tokens `goal-eat/-weight/-fitness/-postpartum`, helper `goalBg()`). Text on them uses only design-system ink (14.6–15.5:1), body (9.2–9.8:1) or stone (6.6–7.0:1), so all sizes meet WCAG 2.1 AA / BITV 2.0; olive and terra text are never used on them (2.6–3.1:1).
- **Target macros:** shown openly on the quiz's goal screen and the My Plan chips in Variant A; one tap deep ("See your targets", chip drawer) in Variants B and C.

**Open spec conflicts, answered for the vision**
| Conflict | Answer in the prototype |
| --- | --- |
| Pre-delivery timing (72 h vs 5–7 days) | Prompt shows on cut-off day with max 3 suggestions (swap, add, keep), each with a reason |
| Check-in trigger | Every 7 days; "Later" asks again after 24 h, then stops |
| Dislike strength | "Not for me" is soft (greyed, swap offered at next check-in); allergens are a hard filter everywhere |
| Love/dislike in P1 | In P1, on every meal; mutually exclusive (dislike clears love) |
| Goal change mid-month | Saved now, plan follows from the next order (1 Oct); loves, dislikes and history stay |
| Household | Plan is for 1 person in Phase 1 |
| Weight language | Never weight-first; "Feel lighter" instead of "Lose weight" |

**Where things live**
- **My Plan = the plan hub** (`components/planhub.tsx`), above the box/price/subscription sections: goal header with GoalTag, meals/week, focus chips (drawer: target, why, how, "nothing to track"), science snippet, starter-plan banner, optional deep-dive nudge, inline Eve signals (A–E, dismissible), week ↔ calendar views (month navigation Oct/Nov, summary bar of mains, breakfasts, extras, loved; day sheet), freezer outlook card (shortfall/surplus at 5+ days with actions), pre-delivery card, goal progress (4 weekly bars, eaten this month, monthly target, % on track), future-month pause/cancel banner.
- **Meal actions** (`components/meal.tsx`): Eaten/didn't, Ate it, Love (→ "Add to your next order?"), Not for me, Swap (tabs *From your box* / *Try something new*), Why this meal? (per-serving numbers, why Eve picked it, how it fits the goal, share of your day one tap deep, Tell Eve more, Was this helpful?), Remove from plan vs Remove from next order, "+ Add a lunch" on empty scheduled slots.
- **Eve quiz** (`components/quiz.tsx`): the Miro "Eve - Account Quiz 13.10.2026" frame. Q1 goal (Eating well & healthy · Support my gut · Lose weight · Nutrition for fitness · Post-partum) → Q1a weight (medical: doctor / gained → Lose weight; maintenance: feel lighter / maintain → Maintain weight) or Q1a fitness (lean / muscle / energy) → Q2 watch for → Q3 satisfaction → Q4 challenges → Q5 people (+ Other free text) → Q6 meals/week → Q6a days (skippable, Mon–Fri fallback) → Q7 which meals → Q8 eater type → Q9 food fit → Q10 free-text dislikes. Post-partum has its own order with "Anything you can't have in your meals?" as Q3 and no Q10. That answer stays free text and works like the dislikes field: a soft steer on meal choice, not a hard filter (Victor, 13 Oct). "every" is lowercase in all quiz copy. Optional deep dive DQ1–DQ4 (height, weight kg/lbs, age, exercise). Asks only missing questions; "Skip for now" just closes the quiz, no starter plan is built.
- **New customers (Customer → New)** land straight in Eve's 10 questions. The quiz's first screen doubles as plan onboarding (your plan follows your goal · no logging · a one-minute weekly check-in), replacing the old 3-card intro; that intro is still reachable via "How your plan works" on My Plan.
- **New customers, before the quiz:** Home shows the greeting, the "No goal set yet" line and the next delivery only. No meal plan (This week / week meals / today), no freezer line or fridge nudge, no "Keep it going" and no "Celebrate" section, in all three variants. My Plan shows the delivery, "Your plan starts here" with the quiz entry, and the next order; the meal plan appears once the quiz is done.
- **No goal yet:** a new customer who hasn't answered the quiz sees no goal name, chips, targets, progress, "fits your goal" cues or goal science anywhere. Home shows "No goal set yet" and My Plan "Your plan starts here", both leading into the quiz.
- **Goals** (`components/goals.tsx`): grouped 7-goal sheet with live preview, "Update my plan" only after a change.
- **Moments** (`components/moments.tsx`): weekly check-in (motivational card → 0–5 satisfaction → per-meal ate/skipped + loved/not for me with live counts → Eve's reply in 5 variants, low score → 3 suggestions), pre-delivery, first box done (full-screen goal message), away 7 days, back after 45 days, 120-day goal review, first-run 3-card intro.
- **Home** keeps each variant's character and adds: a state-aware greeting, the moment slot, the compact goal line and the freezer line.

**Prototype bar → More states:** Customer (Active, New, Back after 45d, Back after 120d), Moment (Check-in, Pre-delivery, First box done, Away 7 days), Box (Lasts, Runs out, Too much).

**Heuristic fixes:** one currency format (`71,30 €`), 4.5 stars, FAB no longer covers content, cut-off stated once, Undo on nudges, one primary CTA on the delivery card (Move day / Skip / Going away as links), savings on the delivery card, greetings derived from state, glossary (Plan → Next order → Box).

---

## What's implemented

### My Plan tab (Figma)

| Figma use case | Implemented |
| --- | --- |
| **Delivery coming** (mobile, tablet, desktop) | The hero reads "Your box is on its way" with the date and a **Change date** button, plus the cut-off line from the research. **Your box** shows a count badge and a collapsed 2-column preview with a faded last row. **View & edit** opens a list with size, price, a **Swap** link, and a stepper (trash at 1, minus above that, plus). **Hide** and **Other meals / Add more** open an add-meals sheet. The price breakdown covers quantity-savings tiers (10 / 15 / 21 %), a **Discount code** (try `EVERY10`), shipping, total savings and the total. **Add to your box** add-ons (chili oil, miso paste, ginger shots) can be dismissed. **Your subscription details** has interval (editable), payment method, address and **All settings**. The **referral** card has **Copy link**. |
| **Same-day delivery** | The hero reads "Your box arrives today" with the estimated window, an **SMS notifications** No/Yes toggle and **Track my delivery** (Open). The box is read-only (**View**). It shows the price breakdown, subscription details and referral, with no add-ons. |
| **Subscription cancelled** | A dark hero reads "Inactive subscription since …" and "Continue where you left off". It holds **My last box** with its date and an editable list, the price breakdown in light text and **Reorder**. Below it: **Add to your box**, subscription details, **Feel like switching it up?** with **Find your bundle** (links to the Discover prototype on the deployed site) and referral. |
| Header and footer | The **Home · All meals · My Plan** tabs are real routes, and the logo is hidden on mobile, as in Figma. The footer uses accordions on mobile and 4 columns on desktop, with the REVIEWS.io rating and payment methods. |

Changes from the Figma, based on the research:
- **Plan and box are one thing.** Box rows say "In your plan: Mon, Thu" and mark freezer extras separately.
- Removing a planned meal turns that slot into your own cooking, and removal can be undone.
- The subscription card has a **"Taking a break?"** row that opens Eve's reason-first pause/cancel flow, so cancel is never hidden.
- Skipped and vacation states have their own hero with **Restart deliveries**.
- Allergen exclusions still apply in the add-meals sheet.

### By journey phase (Miro)

| # | Journey phase | Implemented |
| --- | --- | --- |
| 1 | Log in & land on account home | A greeting that knows the customer, with no "you've been away" banner. Re-entry ("Welcome back") only for customers coming back after a pause, via the moment cards. A next-delivery card with the cut-off always visible and a live countdown. The "Ask Eve" entry point (fake door). |
| 2 | Tell Eve about me | The start-fresh flow: an expectation screen ("4 quick questions, then your week"), then questions worded as routine and pre-filled from order history ("Still cooking for 2?"). A one-line confirmation follows each answer, and the plan line updates live. Allergens are a question with a "Why we ask" note. A preferences sheet keeps *can't eat* (hard filter) separate from *rather not* (soft signal). |
| 3 | Get my plan | A pre-filled plan with no empty slots to fill. A day strip with meal slots and a day/week toggle, plus an editorial "This week" header (theme, plant count toward 30, one science snippet, one plan-fit cue, one weekly goal). One-tap **Swap** offers 3 alternatives sorted by fit, with "See all". **Why this meal?** gives the reason in words, how it helps, macros one tap deeper, love / not for me, keep / swap and **Tell Eve more**. |
| 4 | Order & get my delivery | **Plan and box are one thing**: next week's plan *is* the box, and swaps update it. Move day, skip with Undo, and add meals from search or Eve. The Eve "What's in my next box?" answer links back to the plan. |
| 5 | Eat, check in & build the habit | One-tap **I made this** (fake door) on today's and past meals. The **Monday check-in** is one sheet: a 5-option feeling, optional per-meal taste, portion and "ate it" ticks, and "I'll do it later" with no penalty. A "Something changed?" entry covers the M3 anchor moment. The evening-before fridge nudge. The **rhythm** reads "11 of your last 14" on a 4-week calendar where missed days stay neutral and away days are marked. There is no streak. The nutritionist perk is a fake door. |
| 6 | Change, pause or cancel | Eve asks the **reason first**, then shows options tied to that reason (for example going away → vacation mode / skip / cancel, freezer full → fewer meals / every 2 weeks / cancel). The options are **equal-weight** buttons with cancel always among them. **Vacation mode** is a positive choice. A **"Talk to a person"** link sits on every screen of the chat. Reasons are logged as structured events. |
| 7 | Celebrate & stay | An impact counter (plants this month, meals eaten, hours not cooking). **Every Wrapped** is a free 4-slide story (plants, time saved, favourite dish, an identity label such as "The Steady One") with a share card. It has no calories and no weight. |

### By benchmark area

| Area | Where it appears in the prototype |
| --- | --- |
| 1 Onboarding quiz | `quiz.tsx`: expectation screen, confirmation per answer, plan line, 3–4 s build animation with real dishes, week preview, pinned to home |
| 2 Plan & swap | `plan.tsx`, SwapSheet: day-first view, one-tap swap, one "Fits your goal" cue, one weekly goal |
| 3 Chat self-service | `eve.tsx`: reason-led flow, equal-weight options, visible human route |
| 4 Nudges & lapse | Rhythm, vacation mode, check-in, evening nudge |
| 5 Celebrate | Impact tiles, Wrapped |
| 6 AI search | Search-or-ask field plus 4 neutral chips ("Something quick", "High protein", "Like my last favourite", "Recipe without gluten"). Results are real dishes with a reason line. |
| 7 Dietary & allergens | "Recipe without X" wording and toggles separate from dislike chips. Applied silently to plans, swap, search and Eve. |
| 8 Explaining recommendations | "Why this meal?" in words, never a score. No red/green foods. |
| 9 AI companion appetite | "Ask Eve" fake door, header note "An AI companion", thumbs up/down on replies |
| 10 Meal logging | Tick-only "I made this" plus batch confirm in the check-in |
| 11 Coaches | Async "Ask a nutritionist" perk, 48 h reply (fake door) |
| 12 Customers without a quiz | Resume vs start fresh, pre-filled confirm questions |

Persona and Content Pillar guardrails followed throughout:
- No weight, no calorie-first cues (kcal sits only inside the collapsed "What's in it" panel).
- No loss-based streaks.
- No hidden cancel.
- No guilt copy.
- Allergen copy says "recipe without…", never "…-free".

---

## What's left out

| Not included | Notes |
| --- | --- |
| Real authentication / SSO | The prototype opens straight onto the logged-in home |
| Backend, persistence, analytics | All state is in memory and resets on reload or persona switch. Events only go to `console.info`. |
| Real AI / LLM | Eve is keyword matching plus scripted flows. Unknown questions fall back to the topic list. |
| My Plan: payment method and address editing, "All settings" | These show a toast. Tablet uses the mobile layout, widened to 640 px. |
| Product detail pages, real allergen data, sorting | Tapping a card opens the dish sheet. Filter tags are derived from names (see the All Meals caveat). |
| Payment, pricing, discounts, address editing | The price shown on the box is illustrative |
| Delivery tracking, order history, rewards and referral | Menu items are stubs |
| Weeks after next in the calendar | Projected from the goal and read-only until Eve fills them |
| Push / email nudges, CRM flows | Shown only as an in-app evening nudge |
| Human support hand-off | "Connect" shows a toast |
| Wrapped share image generation | "Share my month" shows a toast |
| Syncing wearables (Mia's Garmin question) | Out of scope for Phase 1, per the benchmark (no biometric data) |
| Localisation, dark mode, full accessibility audit | Built mobile-first with semantic roles, ARIA state, Esc to close sheets and keyboard arrows in Wrapped, but not audited |
| Science copy | Placeholder, **pending Nutrition Playbook sign-off** |

### Reduced copy, 20 Oct 2026 (`bHomeFocus`, `planGoalOrderOnly`, `quizSplash`)
- **Variant B Home:** no goal band, no week header or toggle, no "How was last week?" card and no "Move it to the fridge tonight?" nudge (proactive moments still show). The greeting headline is about the goal only ("You're 2 of 5 meals into this week's Healthy gut goal."), with a dash bar and a "Your goal" link. There is no delivery info on B Home while a box is coming (the date and "Change date" are in My Plan → Next order; Skip and Going away? have no entry point on B Home). "Still to enjoy" / "Enjoyed" are a list, not a swipe row: each row has a thumbnail, the meal name, Made it and Swap (on mobile the buttons sit under the name). There is no "In your freezer" tag. "Talk of the table" becomes "Eve's picks for your plan" (an "Eve's pick" tag on each image and the goal reason under each name). Bundles show all four; the two that fit the goal come first, with a dark outline and a "Recommended by Eve" tag.
- **My Plan (all variants):** only the Goal and Next order tabs and sections. Links that used to open Meals now go to Next order, where the box can be edited.
- **Quiz (all variants):** a soft orange splash (`--color-orange` at about 30% opacity) sits behind every illustration. The intro uses Eve raising a hand.
- **"Your week" copy (Variant A, both copies):** the title and sub-line are written from the meals in the week that's showing (`weekCopy` in `lib/data.ts`), e.g. "Dal, tacos and paella, plus two crisp salads · 45 plants across 5 meals, and none takes more than 8 minutes to heat." The eyebrow follows the This week / Next week tab. In the reduced copy (`bareWeekA`) the title and sub-line are hidden; only the eyebrow and "Edit in My Plan" remain above the planner.
- **Quiz illustration motion (reduced copy, `quizSplash`, layer 1):** the splash scales in first, the illustration drops in 100 ms later, then the headline and copy fade up. At rest Eve sways ±1.5° from her feet over 4 s, icons float instead, and the splash slowly morphs through three blob shapes (SMIL, 7 s). The fact and benefit screens use a stronger entrance. On the satisfaction scale the splash grows and deepens with the score. The loading screen cycles Spoon → Pan → Cubes → Happy Eve as each step completes. All of it is off with `prefers-reduced-motion`.
- **Variant C Home (reduced copy):** no "Ask Eve, or search meals" bar under the greeting (`hideWeekSearch`). Today's meal follows the delivery actions directly, and Ask Eve stays as the floating button. The goal band moves to the end of the page (`goalLastC`).
- **Variant C greeting (reduced copy, `mealGreetingC`):** the headline is about today's meal, e.g. "Dinner's sorted tonight, and it takes 2 minutes." After Made it it reads "Today's dinner is done. Nice one.", and with no Every meal today "Nothing from every today. Enjoy your own cooking." The box date, window, cut-off and Move day / Skip / Going away? are not on C Home.

### Third copy: Variant B only (`/account-home-3`, 20 Oct 2026)
`npm run export:vercel:3` builds it (`BASE_PATH=/account-home-3 NEXT_PUBLIC_LEAN=1 NEXT_PUBLIC_ONLY_B=1`, then drops `out/v2` and `out/v3`); `export:all` builds all three. With `ONLY_B` the root, `/my-plan/` and `/all-meals/` render Variant B, the prototype bar has no variant switch and the tab reads "All meals". On top of the reduced copy:
- **Home dashboard (`homeDashboard`, `components/dashboard.tsx`):** the profile (initial, name, goal, meals a week) and four stats: meals this week, different plants this week, weeks in a row with every, and % on track this month. Below that, the macros from the meals eaten so far this week (protein, fibre, carbs, fat as an average per meal plus the total, energy in kcal), with bars against the goal's per-meal targets where the goal has one. A "Next box" line with "Manage" links to Next order. New customers or customers without a goal get a short prompt instead of the numbers.
- **Meal plan off Home (`planInMyPlan`):** "Still to enjoy" / "Enjoyed" leave Home. On My Plan's top goal card, "Your meal plan · N to enjoy" opens them in a sheet (`mealPlan`), next to "Plan details" and "Change goal".
- **Goal types as personas (B only copy):** the prototype bar's "Viewing as" switches between the eight goals (Balanced eating, Healthy gut, Lose weight, Maintain weight, Stay lean, More energy, Build muscle, Postpartum) instead of Anna / Jonas / Mia (`setGoalPersona` in `components/top.tsx`). Each sets the quiz answers that route to that goal (Miro "05.10.2026: Goal Generation Logic"), the goal's meals a week, and rebuilds this and next week's plan from the goal's pool. The user is addressed as Anna whichever goal is picked ("Good afternoon, Anna", profile name Anna). The profile photo and the "Goal: … · N meals a week" line follow the goal.
- **Focus macros only (B only copy):** the dashboard's macro row shows only the macros the goal has targets for, in the goal's priority order. Healthy gut shows fibre and protein; More energy shows energy, carbs, protein and fat. Iron and folate (Postpartum) are left out because there's no meal data for them yet.
- **Focus stats only (B only copy):** the headline stats follow the goal (`STAT_FOCUS` in `components/dashboard.tsx`), and every goal shows meals this week. Plants show for Balanced eating and Healthy gut, where plant variety is the lever. Weeks in a row show for Balanced eating, Healthy gut, Maintain weight, Stay lean and Build muscle, where the goal docs stress consistency. The month on track shows for Lose weight, Maintain weight, More energy and Postpartum, which are longer-run goals.
- **Prototype bar (B only copy):** the main row has only "Customer" (Active / New / Back after 45d / Back after 120d). "Viewing as" (goal), Delivery, Moment and Box sit behind "More states", which starts collapsed. On load the default goal (Healthy gut) gets its own setup (3 meals a week), the same as picking it.
- **Stat shapes (B only copy):** each stat now has its own shape.
  - **Meals:** plates of this week's meals, eaten ones in colour with a tick.
  - **Plants:** a jar that fills with leaves from the bottom.
  - **Weeks in a row:** a strip of week dots with the current run lit up.
  - **Month:** a ring.

  The goal's first stat in `STAT_FOCUS` is a full-width hero tile: plants for Balanced eating and Healthy gut; the month for Lose weight; weeks in a row for Maintain weight, Stay lean and Build muscle; meals for More energy and Postpartum. Focus macros show as a target zone: the range shaded, a dot for the average, a status ("Building up" / "In the zone" / "Above the range") and an everyday comparison (egg ≈ 6 g protein, apple ≈ 4 g fibre, slice of bread ≈ 15 g carbs, tbsp olive oil ≈ 13 g fat, banana ≈ 105 kcal). The first macro is the large one. An Eve line under the stats sums up the hero stat. Numbers count up once and the fills grow in; both are off with reduced motion.
- **Screen-wide profile card (B only copy):** the dashboard runs edge to edge directly under the top navigation (no separate greeting line, no gap, rounded bottom corners only; the greeting is the eyebrow above the name: "Good afternoon · Anna"), like the LP/PDP bands. The goal-coloured stats, the white macros and the next-box row keep their content on the 1120 px grid.
- **Profile header (B only copy):** The avatar is a crop of Happy Tummy Eve (head and heart, `public/eve/eve-avatar.png`) in a white circle, used only here. The "Your goal" link sits on the right (no goal photo on Home). My Plan has no section tabs in this copy.
- **Nutrition next to the plan (B only copy, `components/nutrition.tsx`):** each focus macro is one track with three marks: the target zone (shaded, the plan's target), a hollow ring for what this week's planned meals average, and a dot for what's been eaten so far. Plan and reality sit on one line.
  - **"Your meal plan" sheet:** Still to enjoy / Enjoyed first, then "Your nutrition" (every focus macro, its status, eaten vs planned, the everyday comparison and a legend).
  - **"Goal details" (was "Plan details"):** the sheet's eyebrow reads "Goal details". It no longer has "What's in your week", because the nutrition and meals live in "Your meal plan".
  - **My Plan goal card:** a compact version (tracks and numbers only) between the answer pills and the buttons.
  - **Home:** the dashboard keeps only the goal's main macro, as one line under Eve's line, with "See your nutrition", which opens "Your meal plan". The full macro block is gone from Home.
- **Stats in one row (B only copy):** the dashboard's two or three stats always share one row, with the goal's lead stat first. Each tile is the visual on top (plates, jar, week dots, ring), then the number and a short label ("plants this week", "meals this week", "weeks in a row", "on track · N meals"). With three tiles on a phone the visuals get smaller.
- **Discount milestones (B only copy):** inside Next order, the "Enjoy 15% off!" block has no card border of its own. It sits straight in the pricing card under the total.
- **Dashboard order (B only copy):** profile, then the stats row, then the main macro line, then Eve's line, then the next box.
