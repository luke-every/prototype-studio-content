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

Defined in `src/app/globals.css` under `@theme inline`. Use them as Tailwind classes, e.g. `bg-dark`, `text-light-text`, `border-light-grey`, and with opacity, `bg-dark/6` or `border-dark/10`.

| Token | Hex | Typical use (real usage count) |
|---|---|---|
| `dark` | #372d27 | Primary text, dark buttons, borders at low opacity (546) |
| `light-grey` | #EEEAE6 | Surfaces, inputs, modals, grey buttons, tags (328) |
| `near-black` | #11100a | Text, mostly on public pages (272) |
| `light-text` | #575757 | Secondary text (131) |
| `light-grey-2` | #DAD6D2 | Dividers, borders (70) |
| `off-white` | #f4f4f4 | Light surface, hover, text on dark (24) |
| `light-grey-3` | #BDB3A9 | Borders, muted text, placeholders (16) |
| `signal-orange` | #ff7d34 | Primary call to action and accent (15) |
| `olive` | #9fa06b | Accent text (15) |
| `savings-green` | #2a7a3b | Savings and discount text (9) |
| `brown` | #443d3a | Borders (8) |
| `brown-border` | #423D3A | Borders (7) |
| `ui-green` | #52A131 | Success / positive state (6) |
| `light-brown` | #efeae5 | Background (4) |
| `pantry-background` | #2f2a27 | Pantry section background (3) |
| `light-orange` | #ffd392 | Background (2) |
| `bright-yellow` | #f8d64d | Background (1) |
| `white`, `background` | #ffffff | |

Rules:
- **Never use hex values** (`bg-[#eeeae6]`). Every such hex in the repo duplicates a token.
- **Never use Tailwind's default palette** (`gray-*`, `neutral-*`, `stone-*`, …).
- **The one exception: `text-red-500` / `ring-red-500` for errors (unconfirmed).** There's no error token yet.
- Black overlays use `bg-black/50`, as in `Modal`.
- The pastels, `dark-gold`, `olive-light` and `foreground` were left out deliberately because nothing uses them. Don't add them back.

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
- Use `next/image` for images and `next/link` for internal links.
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

## Marking things for lift

Engineers will grep for `TODO(lift)`. Mark every hardcoded thing that production would get from elsewhere:

```tsx
// TODO(lift): sample data — replace with <source, e.g. Storyblok / Shopify / Eversubs>
const SAMPLE_MEALS: Meal[] = [ … ];

{/* TODO(lift): replace with translation key */}
<h2>Your next delivery</h2>
```

- **Sample data:** one marker on the constant. Keep it at the top of the file, or in a `sample-data.ts` next to the component. Type it with the shape the component expects.
- **Copy:** one marker per string, or one per block when a single element has several strings. `aria-label` text counts as copy too.
- **Faked behaviour** (a `setTimeout` pretending to save, a hardcoded logged-in state): `// TODO(lift): fake <what> — production uses <hook/route if known>`.

---

# Layer 2: Only if the prototype needs it

This is the plumbing layer. **Leave all of it out by default.** Each rule only applies when the task actually needs that capability. The ready-to-copy files are in `~/Claude/team-conventions/starter/optional-stubs/` (see its README). They aren't copied into prototypes, so copy from there.

- **If the prototype needs to load or save data through a request** (for example, demonstrating a loading or error state): copy `~/Claude/team-conventions/starter/optional-stubs/api-fetch/`.
  - Add a fixture route at `src/app/api/<name>/route.ts` returning `NextResponse.json({ data })`.
  - Call it from a hook with `useEffect`/`useCallback`, `useState` and `apiFetch`.
  - Branch on `isRedirect(result)`, then `!result.ok`.
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
