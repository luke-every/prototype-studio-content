# Every web conventions (for prototypes)

This file is taken from what the developers actually write in `every-website` (Next 16.3.6, React 19.3.0, TypeScript 6, Tailwind 4.3). The repo's own CLAUDE.md is out of date in several places. Where this file and that one disagree, this file follows the code.

The goal is for prototypes to **look and read like the team's code**. They don't need to copy the app's architecture.

Anything marked **(unconfirmed)** is our best reading of the code and still needs an engineer to confirm it. See the list at the end.

---

# Layer 1: Always apply

These are visual and code style rules. They apply to every prototype, however small.

## Styling

- Use **Tailwind utility classes only**. No CSS modules, styled-components, `<style>` blocks or new `.css` files.
- Custom keyframes or utilities go in `src/app/globals.css`, next to the existing `animate-*` / `drawer-*` classes. Only add one when no Tailwind class can do the job.
- Build conditional classes with **template literals**. No `clsx`, `cn`, `tailwind-merge` or `cva`:
  ```tsx
  className={`rounded-full px-4 py-2 ${active ? "bg-dark text-white" : "bg-light-grey text-dark"}`}
  ```
  If a component takes `className`, append it: `${className ?? ""}`.
- Use `style={{}}` only for values computed at runtime, such as a progress width or a CMS colour.
- Design **mobile-first**, with `lg:` as the desktop breakpoint. Use `md:` sparingly. Don't use `sm:` or `xl:`.
- Leave out dark mode. The variant exists in the CSS but is unused.

## Colour tokens

There is one token file: production's `src/app/globals.css` (`@theme inline`, the `--color-*` entries). A prototype's own `globals.css` imports it, so a token added or changed in production reaches every prototype with no edit here. This file lists no values, so it can't go stale: to see what exists, read that file or run `grep -- '--color-' ~/Claude/every-website-main/src/app/globals.css`.

Use a token as a Tailwind class, e.g. `bg-dark`, `text-light-text`, `border-light-grey`, and with opacity, `bg-dark/6` or `border-dark/10`.

Which token for which job (the names are the only thing repeated from the file):
- **Text:** `dark` is primary, `near-black` on public pages, `light-text` for secondary.
- **Surfaces:** `light-grey` for inputs, modals, grey buttons and tags; `off-white` for a light surface or hover.
- **Lines:** `light-grey-2` for dividers and borders, `light-grey-3` for muted borders and placeholders, `dark/10` for a faint border.
- **Call to action and accent:** `signal-orange`; `olive` for accent text.
- **State:** `savings-green` for savings text, `ui-green` for success.
- **Anything else:** take it from the file, and don't invent a colour.

Rules:
- **Never use hex values** (`bg-[#eeeae6]`). Every such hex in the repo duplicates a token.
- **Never use Tailwind's default palette** (`gray-*`, `neutral-*`, `stone-*`, …).
- **The one exception: `text-red-500` / `ring-red-500` for errors (unconfirmed).** There's no error token yet.
- Black overlays use `bg-black/50`, as in `Modal`.
- A colour production doesn't have is a design decision, not a prototype shortcut: write it up in the proposal and don't add it to a prototype's CSS.

## Typography

Fonts are set up in `src/app/layout.tsx`:
- **ABC Diatype** (`font-sans`, weights 400/500/700) for UI and body text.
- **ABC Marist** (`font-book`, 400, plus `font-book-italic`) for headings and editorial text.

There are no type tokens. Developers copy the size, line-height and letter-spacing from Figma by hand, and that's the pattern to follow.

**Letter-spacing is always −2% of the font size.** Use these pairings:

| Role | Classes |
|---|---|
| Display / H1 | `font-book text-[34px] leading-[34px] tracking-[-0.68px] lg:text-[48px] lg:leading-[50px] lg:tracking-[-0.96px]` |
| H2 | `font-book text-2xl leading-6.5 tracking-[-0.48px]` |
| H3 / large body | `font-book text-lg leading-[22px] tracking-[-0.36px]`, or `font-sans` for UI |
| Body | `font-sans text-base leading-[22px] tracking-[-0.32px]` |
| Small | `font-sans text-sm leading-[18px] tracking-[-0.28px]` |
| Caption / label | `font-sans text-xs leading-4 tracking-[-0.24px]` |

Other rules:
- Weights in use: `font-medium` (most common), `font-bold`, sometimes `font-semibold`.
- Headings (34px, 48px, `2xl`) are almost always `font-book`. `text-base` and smaller are always `font-sans`.
- Line-height is written two ways in the repo: `leading-[22px]` and `leading-5.5`. Both are fine.
- For any other size, keep the −2% rule. For example, 20px uses `tracking-[-0.4px]`.
- A size or line-height that isn't in the table (a small badge, say) is fine when the design asks for it. Keep the −2% rule and say in a short comment where the number comes from, so an engineer doesn't take it for a slip.

## Components: shape and naming

- **One component per file**, PascalCase filename, **named export**, written as a `function` declaration:
  ```tsx
  type Props = {
    title: string;
    variant?: "filled" | "outlined";
    className?: string;
  };

  export function MealBadge({ title, variant = "filled", className }: Props) {
    return <span className={`rounded-full px-3 py-1 text-xs ${className ?? ""}`}>{title}</span>;
  }
  ```
- Declare a `type Props = {…}` at the top of the file. Use `type`, never `interface`.
- Variants are string unions, usually with a default value. Children are typed `React.ReactNode`.
- Put `"use client";` on line 1 only when the component uses state, effects or event handlers. Leave it off otherwise.
- Always give `useState` and `useRef` an explicit type: `useState<string | null>(null)`, `useRef<HTMLDivElement>(null)`.
- Use semantic HTML. Every icon-only or interactive element gets an `aria-label`. Use `type="button"` on buttons that aren't submit buttons.
- A definition list (`dl`) holds `dt` and `dd` directly, or `div`s that hold only `dt` and `dd`. A `div`, `span` or heading wrapped around a `dt` inside it is invalid HTML.
- Use `next/image` for images and `next/link` for internal links. A plain `<img>` or CSS `url()` needs a literal path to a file in `public/` (`/push` fixes those for the studio); a path built in code (`"/img/" + name`) won't load there.
- Load heavy, non-critical UI such as drawers or large modals with `next/dynamic`.
- Constants are `UPPER_SNAKE_CASE` at module level. Small helpers in the same file are fine. Formatting or transformation logic shared between files goes in a separate kebab-case file in `src/lib/`.

## Reuse shared components first

The starter includes unmodified copies from `every-website`. Use them rather than writing your own:

| Need | Use |
|---|---|
| Button or link styled as a button | `@/components/shared/Button`: `variant="dark" \| "white" \| "grey" \| "nearBlack" \| "primary"`, `icon`, `iconPosition`, `href`, `sizeClassName` |
| Dialog | `@/components/shared/modals/Modal`: `open`, `title`, `onClose`, `contentClassName`, `closeLabel`. Handles the portal, Esc and the focus trap. Don't build another one. |
| Confirm / cancel dialog | `@/components/shared/modals/ConfirmModal` |
| Pill tag(s) | `Tag` / `Tags`: `variant="filled" \| "outlined" \| "muted"` |
| Dropdown | `Select` |
| Expand / collapse | `Accordion` |
| Nutrition stats | `MacroStat`, `MacroNutrients` |
| Discount progress | `PriceProgressBar` |
| Missing image placeholder | `ImageFallback` (needs `/Logo.png`) |
| Icons | `@/components/icons`: `<CloseIcon size={18} />`. They use `currentColor`, so colour them with `text-*`. |

- **New icons:** create `src/components/icons/<Name>Icon.tsx` with the same shape as `CloseIcon.tsx` (`IconProps`, `size` default, `currentColor`, `aria-hidden`), then export it from `index.ts`.
- **A shared component doesn't quite fit:** wrap it, or pass `className`. Don't edit the copied file, so it can still be diffed against production.
- **Never reach into a shared component's inner markup.** No selectors like `[&>div>div.bg-dark]:…` that depend on its DOM. If you need to style or animate something inside it, wrap it, or leave `// TODO(lift): needs a prop on <Component> to <what>` and do the closest thing from outside. Engineers will add the prop; a selector on someone else's markup breaks silently when it changes.
- **Drawers and bottom sheets:** there's no shared one, and `Modal` is a centred dialog. Check `src/components/` for an existing shell first, and if you build one, copy `Modal`'s focus trap, Esc and portal behaviour exactly (don't invent a new approach) and mark it `// TODO(lift): extract a shared Drawer`. Don't build a second dialog, use `Modal`.
- **Something new and reusable:** put it in `src/components/shared/`.

## Site pieces: use the kits, never rewrite them

The table above lists only what the starter copies. Everything else in `every-website` comes from a kit in `starter/optional-stubs/` (see its README), or is copied in unchanged.

- **Header and footer: always from the kits.** `pdp-top/` has `HeaderV2`, `DesktopNav` and `MobileNavDrawer`. `site-sections/` has `Footer`. Never write your own.
- **Product pages and landing pages:** start from the `pdp-protein` or `lp-protein` template and change it. Their sections (hero, bundle module, reviews, sticky bar, FAQ, featured by, routine, subscribe) come from `pdp-top/` and `site-sections/`.
- **Meal UI:** the `meals/` kit.
- **A real component that needs a service** (Storyblok, a store, translations, Reviews.io, Shopify, analytics): use the real component, unmodified, with a shim that satisfies its imports and sample content standing in for the service. Shim files start with `PROTOTYPE SHIM` and export the same names as production. Do not rewrite the component to work without the service.
- **A component that isn't in any kit:** copy it from `every-website` unchanged. Put the shims it needs in the kit in `team-conventions`, not in this one prototype, so the next prototype gets them too.

**Where the kits differ from production.** The header, nav, footer, hero and `bundle-v3` pieces in `pdp-top/` and `site-sections/` are front-end versions: plain props instead of Storyblok bloks, no cart store. They are not byte-for-byte copies. `/handoff` reports them as stand-ins and lists what they add, so don't treat them as already matching production.

## Extending a component, or building a new one

Write it the way the developers would, so an engineer can lift it with little change. The shapes below come from `Button` and `Tag`.

**Extending**, in order of preference. Never edit the copied file.
1. **A class or spacing change** (colour, width, padding): pass `className`, or `sizeClassName` on `Button`.
2. **A new value for an existing variant** (say a `"outline"` button): wrap the component, apply the look with `className`, and leave `// TODO(lift): add variant "outline" to Button (border border-near-black bg-transparent)`. Name the value and the classes, because that is the entry an engineer adds to the `VARIANTS` map.
3. **A new prop that changes the markup:** a wrapper can't do that. Build a new component beside it with the original's props plus the new one, and leave `// TODO(lift): extend <Original> with <prop> and drop this`. Don't change what the original does by default.

**Building a new one:**
- Follow "Components: shape and naming" above, and put it in `src/components/shared/` if it is generic, or the feature folder if not.
- Props describe content and variants, not styling: `variant="dark"`, not `bg="dark"`.
- Three or more variants go in a `VARIANTS` record keyed by the union (as in `Button`), not nested ternaries.
- Shared class strings are `UPPER_SNAKE_CASE` constants at the top of the file (`BASE`, `DEFAULT_SIZE`).
- Accept `className` and append it: `${className ?? ""}`. Spread the rest of the native props onto the element when it is a button, input or link.
- New props are optional and default to the old behaviour, with a `/** … */` line when the name doesn't say enough.

**Say where it comes from.** The doc comment above every component the prototype adds or changes starts with one of these, so an engineer (and the studio) can tell what is theirs to build and what to leave alone:
- `Port of every-website \`src/…\`: <what is different>.` A plain-prop version of a production component.
- `Extends every-website \`src/…\`: <what is added>.`
- `New: nothing in every-website does this (looked in: <folders>).`

Look in production's `src/components` and in the kits before writing "New". A component used as it came needs no comment: it isn't changed.

## Explore loose, tidy when chosen

Prototypes are for trying ideas, so don't let components or the design system slow an exploration down. Three habits stay on the whole time because they cost almost nothing:

1. **Tokens, always.** Colour classes only, never a hex value, even in a sketch.
2. **A design system component when it fits as it is.** Check the table above before writing UI. If it doesn't fit the idea, build your own. Don't bend the idea to the component.
3. **Copy and data out of the markup, one chunk of UI per file.** Every line of words, and every image address, goes in `src/lib/copy.ts` (see Copy and images, below), sample data in a `<feature>.data.ts` or a `sample-data.ts`. That makes pulling a component out later a move, not an untangling.

**Adjusting or adding.** Starting from a template, this is the rule:

- **Adjusting something that already exists:** change that component, or leave `// TODO(lift): needs a prop on <Component> to <what>`. Don't fork it silently.
- **Adding something new:** build it freely in its own file in the feature folder. Don't move it to `shared/` yet.

Alternatives and variations live behind a studio control (see "Studio controls"), so anything only a non-final variant uses is exploration and stays out of the handoff.

**When a direction is chosen, run `/handoff`.** It finds what is new, close to a design system component, or off-token, and the designer decides on each one. A deliberate departure from the design system is recorded as a proposal, not treated as a mistake.

## Folders and imports

```
src/app/<route>/page.tsx                 # route; page-only helpers sit beside it (data.ts, types.ts)
src/components/shared/                   # generic reusable UI
src/components/<area>/<feature>/         # feature UI — area is "account" or "website"
src/components/icons/                    # icons + index.ts barrel
src/lib/<thing>.ts                       # kebab-case utilities
```

- Use **relative imports inside a feature folder** (`./types`, `./MealRow`) and the **`@/` alias everywhere else** (`@/components/shared/Button`).
- Import icons from the `@/components/icons` barrel.
- Use `import type { … }` for type-only imports.

## Formatting

There's no Prettier in the repo, so match the code by hand:
- Double quotes, semicolons, trailing commas in multi-line literals and arguments, 2-space indent.
- `pnpm lint` must pass. It uses the same ESLint config as production, which makes `no-console`, `no-alert`, unused vars and `react-hooks/exhaustive-deps` errors.
- Run `pnpm tsc --noEmit` and keep it clean.
- Before you say a change is done, run both and fix what they report in the files you wrote or changed. `/push` runs them too and tells the designer what is left, but it never stops a push.

## Copy and images

Every line of words a person reads (headlines, labels, button text, FAQ answers, quotes) and every image address the page shows live in `src/lib/copy.ts`, and nowhere else. Components and sample data files read it (`COPY.hero.headline`, `COPY.images.hero.main`); they never hold words or image addresses of their own.

```ts
import { tagged } from "@/lib/studio-copy";

export const COPY = tagged({
  hero: { headline: "Every detail. Thought through.", cta: "Get started" },
  faq: { items: [{ question: "Can I swap meals?", answer: "Yes. From your second order…" }] },
  images: { hero: { main: "https://a.storyblok.com/f/…/hero.png" }, logos: [{ src: "/img/lp/rewe.png" }] },
});
```

- **Why:** in dev, `tagged` marks each line with where it is in the file: words get an invisible mark, an image address gets `#studio-<number>` on the end. When someone edits text or replaces a picture in the studio and presses Save, the studio rewrites that one line of `copy.ts`, for the element they edited and no other. A replaced picture is a file from their disk: it is written to `public/img/uploads/` and the line is set to `/img/uploads/<name>`. Words or addresses written anywhere else can't be saved from the studio, so it says so and leaves them.
- **Keep it plain:** nested objects, arrays and strings only. No spreads, no computed keys, no template strings with parts in them (the studio numbers the lines by reading the file). A line that is built from parts stays in the component.
- **Words and image addresses only:** no ids, colours or numbers in `copy.ts`. Don't compare copy strings (`label === "Protein"`), don't use them as keys or ids, and an empty string is left as it is (it isn't marked, but it still counts as a line).
- **Images:** write the address whole (`"https://…/hero.png"` or `"/img/hero.png"`, ending in a picture extension) and pass it to `<Image src>` or a background as it is. Don't build it from parts or run it through a helper that rebuilds the address (the tag would be lost). Pictures that come from live data, such as meals from Shopify, aren't the prototype's own and aren't saved.
- **The same words, or the same picture, in two places are two lines.** Give each element its own key, so editing one never changes the other.
- **Organise it by section of the page.** The copy docs the studio makes (Claude, Notion) are built from this file: one section for each top-level group, one row for each line. So the file is laid out the way the page reads:
  1. A top-level group per variant of the prototype (a product page, a landing page, the other versions of a page the page control switches between): `productPage`, `landingPage`. A prototype with one variant skips this level. Inside it, one group per section of the page, in the order you scroll. Name each for the section (`hero`, `faq`, `afterAFewWeeks`), not for the data behind it (`bodyBalance`). Spell a name so it reads as words once split at its capitals; an acronym reads best written as a word (`benefits`, not `uspGrid`).
  2. A comment above each group saying where it sits on the page. It becomes the section's note in the doc.
  3. A comment above any line that isn't obvious from its key (`// The small line under the Add to cart button.`). It becomes the row's "What" in the doc; without one, the row is labelled from the key name (`Bullets 1`). Give lines in a list one each (`// First reassurance.`).
  4. A line that only one variant shows is never in another's group, so the doc and the picker can offer a variant on its own. Words two variants share are still two lines, per the rule above.
  5. `images` stays last.
  Renaming a group or a key means changing every `COPY.…` that reads it, and a Claude doc made before the rename no longer matches: make a new one.
- **Don't touch `studio-copy.ts`.** It does nothing in a production build.
- **For the build:** every image a prototype uses is listed under `images` in `copy.ts`, which is what to hand over (or later export) for engineers to upload to Storyblok.

## Opening the dev server on a phone

The local studio opens a running prototype from a phone on the same wifi at `http://<this-mac>.local:<port>`. Next blocks every host but `localhost` in dev, so a prototype's `next.config.ts` needs `allowedDevOrigins: ["*.local"]` (the starter has it; keep it when you edit the config). Without it the page flickers and reloads and the studio can't change its variants or controls. A Vite prototype needs `--host` instead.

A running dev server is on another address than the studio, so the studio's canvas can't look inside it to see how tall each screen is. `src/lib/studio-measure.ts` answers the studio's height question with a message, and `src/lib/studio-comments.ts` lets the studio leave comments on the running prototype. Both are loaded on every page by `<StudioHelpers />` (`src/lib/studio-helpers.tsx`) in the root layout. `<StudioPreviewHook />` (`src/lib/studio-preview-hook.tsx`, dev only) sits in the layout's `<head>`, not the body (a script in the body runs after React has loaded, which is too late) so the studio can preview prop changes live. Keep the four files and those two lines in `src/app/layout.tsx` when you copy the starter or replace the layout. `src/lib/studio-copy.ts` (see Copy and images) is the fifth studio file; keep it too.

## Marking things for lift

Engineers will grep for `TODO(lift)`. Mark every hardcoded thing that production would get from elsewhere:

```tsx
// TODO(lift): sample data — replace with <source, e.g. Storyblok / Shopify / Eversubs>
const SAMPLE_MEALS: Meal[] = [ … ];

{/* TODO(lift): replace with translation key */}
<h2>Your next delivery</h2>
```

- **Sample data:** one marker on the constant. Keep it at the top of the file, or in a `sample-data.ts` next to the component. Type it with the shape the component expects.
- **Copy:** one marker per string, or one per block when a single element has several strings. `aria-label` text counts as copy too. When the strings live in a `copy.ts` (keys like `intro.heading`, which read as translation keys), one marker at the top of that file covers them all.
- **Faked behaviour** (a `setTimeout` pretending to save, a hardcoded logged-in state): `// TODO(lift): fake <what> — production uses <hook/route if known>`.

---

# Studio controls

Prototype Studio shows a prototype's controls beside it: the states, variants and switches someone flips to see it differently. A prototype opts in by declaring them, and never draws a switcher of its own.

**Declare** them in `public/studio.json`:

```json
{
  "controls": [
    { "id": "state", "label": "State", "type": "choice", "default": "full",
      "options": [{ "value": "full", "label": "Full" }, { "value": "empty", "label": "Empty" }] },
    { "id": "dark", "label": "Dark mode", "type": "toggle" },
    { "id": "items", "label": "Items", "type": "range", "min": 0, "max": 12, "default": 3 },
    { "id": "plan", "label": "Plan", "type": "choice", "default": "a", "when": { "control": "state", "is": "full" },
      "options": [{ "value": "a", "label": "A" }, { "value": "b", "label": "B" }] }
  ]
}
```

- `choice` needs at least two options and a `default` that is one of them. `toggle` is off unless `"default": true`. `range` takes `min`, `max`, optional `step`, and a `default` inside the range.
- `"variants": true` on a `choice` control marks it as the one that picks between variations of the design: the studio shows each option as its own screen on the canvas. Use it for "make me some variations".
- `param` (optional) is the URL parameter, default the id. `when` shows a control only while another has a given value.
- Edit the file, never replace it: the push step also keeps the prototype's flow in it.

**Read** them in the page:

```tsx
import { useControl, useEmbedded } from "@/lib/studio-controls";

const state = useControl("state");          // the option's value
const dark = useControl("dark") === "on";   // toggles are "on" / "off"
const items = Number(useControl("items"));  // ranges come back as text
const embedded = useEmbedded();             // true inside the studio: hide any in-page demo bar
```

- A control is a *complete* description of what to show. If a state needs several values to change at once (a store reset, a route), apply them in one `useEffect` keyed on the control, the way a switcher bar's click handler would have.
- Opened on its own the page sees every control at its default, so each default must be a normal, working screen.
- The studio changes controls live, without a reload, so a control can go back to its default at any time: handle every value, including the default, not just the first one.
- An existing prototype with its own switcher bar: declare the same choices as controls, call the bar's setters from an effect on `useControl`, and hide the bar when `useEmbedded()` is true.

**Keep the place in the address.** When the person moves on inside the prototype (another screen, a quiz step, an answer that changes what comes next), write where they are into the address with `setPlace` from `@/lib/studio-controls`, using the same parameters the controls and flow screens read. The address is then the one thing that says what is on screen: a reload, a new tab or a QR code opens the same place, and the studio follows it, so a comment left there is reopened there, built from the same answers.

```tsx
setPlace({ start: "results", step: null, goal: answers.goal.join(",") });
```

- Write it as the person moves, not on a timer. Answers stored only in `localStorage` or React state are invisible to everyone else.
- Whatever is written must read back: opening that address must show the same screen with the same content.

# Layer 2: Only if the prototype needs it

This is the plumbing layer. **Leave all of it out by default.** Each rule only applies when the task actually needs that capability. The ready-to-copy files are in `~/Claude/team-conventions/starter/optional-stubs/` (see its README). They aren't copied into prototypes, so copy from there.

- **If the prototype needs to load or save data through a request** (for example, demonstrating a loading or error state): copy `~/Claude/team-conventions/starter/optional-stubs/api-fetch/`.
  - Write the fixture as a function in `src/lib/fixtures/<name>.ts` that returns a `Result` (`ok(data)` or `err(...)`) after a short delay. There is no API route: prototypes are static exports and `/push` stops on `app/api`.
  - Call it from a hook with `useEffect`/`useCallback` and `useState`, marked `TODO(lift)` to become `apiFetch("/api/<name>")`.
  - Branch on `!result.ok`.
  - Don't use SWR, React Query, server actions or bare `fetch`.
  - Otherwise, pass hardcoded sample data in as props.
- **If the prototype needs state shared across distant components or routes:** copy `~/Claude/team-conventions/starter/optional-stubs/store/` and create `use<Feature>Store.ts` with Zustand. Read it with selectors, `useStore((s) => s.x)`. Otherwise use `useState` in the nearest common parent.
- **If the prototype needs a form with validation:** use controlled inputs, an `errors: Record<string, string | undefined>` object, the `INPUT_BASE` / `INPUT_ERROR` / `FieldError` pattern from the stubs README, and `aria-required`. Don't use a form library. Validate on the client by hand. Production validates on the server with zod.
- **If the prototype needs multiple languages or depends on existing translated copy:** copy `~/Claude/team-conventions/starter/optional-stubs/translations/` and use `const t = useTranslations()` (account) or `usePublicTranslations()` (public site). Otherwise use plain English strings marked `TODO(lift)`.
- **If the prototype needs feedback after an action:** add `sonner` and `<Toaster position="top-right" richColors />`, then call `toast.success(...)` / `toast.error(...)`. Don't use `Snackbar`. Otherwise show the result inline or not at all.
- **If the prototype has a real `catch` path:** copy `~/Claude/team-conventions/starter/optional-stubs/error-capture/` and call `captureError(new Error("…"), { tags: { hook: "useX" } })`. Never put personal data (email, phone, address) in error messages or `extra`.
- **If the prototype mirrors a CMS-driven page:** still write **plain prop-driven components** with camelCase props. Don't take a Storyblok `blok` prop and don't add the Storyblok SDK. Engineers map CMS fields (snake_case) to these props when they lift the code.
- **Account-area prototypes** follow the **current** account tree, not the "redesign" A/B arm. Production is hard-wired to `current`.
- **Building on bundle, cart, header or hero:** follow the newest versions, **bundle-v3, cart-v2, HeaderV2, HeroV2 (unconfirmed)**.

Never in prototypes: tests, Storybook stories, auth/session, `proxy.ts`, environment validation, analytics, Sentry, Datadog, VWO, GTM, Klaviyo, Reviews.io widgets, cookie consent.

---

# Unconfirmed: ask engineering

In order of risk:

1. **Canonical versions:** are bundle-v3, cart-v2, HeaderV2 and HeroV2 the ones new work should follow? Are the older versions due to be deleted, or still live A/B arms?
2. **Error colour:** is `red-500` approved for errors, or should an error token be added?
3. **Hex values and default-palette classes** in the repo (62 hex, about 40 `gray-*` / `red-*`): are they all drift we can ignore?
4. **Unused tokens** (pastels, `dark-gold`, `olive-light`): can they be removed, or are they reserved for CMS colours?
5. **Typography:** is copying sizes and letter-spacing by hand the intended approach, or are type utilities planned?
6. **Toasts vs `Snackbar`:** is sonner the direction?
7. **Imports:** is "relative within a feature folder, `@/` across folders" the rule they'd enforce?
8. **Plain props vs Storyblok bloks:** is plain-props the easiest hand-off for public-site components?
9. **The repo's CLAUDE.md:** can it be updated (TS 6, Zustand in use, `components/account/`, `proxy.ts`)?
