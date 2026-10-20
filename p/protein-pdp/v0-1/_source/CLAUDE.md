# Every prototypes

Prototypes built here should **look and read like the every-website codebase**, so engineers can lift components into production with little rework. They should *not* copy the app's architecture.

The full rules, with token tables and examples, are in [conventions.md](conventions.md). The source of truth is the code in `every-website` (read-only). If its CLAUDE.md disagrees with the code, go with the code.

## Keep prototypes small

**Do not add fetching, stores, providers, translations, error handling, tests or stories unless the task requires them. Prefer hardcoded sample data and plain strings in prototypes. Keep prototypes as small as the task allows.**

Mark every hardcoded thing production would source elsewhere with `TODO(lift)`:
- `// TODO(lift): sample data — replace with <source>` on sample-data constants
- `{/* TODO(lift): replace with translation key */}` on user-facing copy
- `// TODO(lift): fake <what>` on simulated behaviour

## Starting a prototype

Run `/newprototype` in an empty folder. It copies `starter/`, this file and `conventions.md` in, brings the fonts from `starter/public/fonts/`, and installs dependencies. To do it by hand, follow the same steps; the font list is in `starter/public/fonts/README.md`.

The starter contains only the always-on layer: tokens in `globals.css`, the font setup in `layout.tsx`, and unmodified copies of the shared UI (`Button`, `Modal`, `ConfirmModal`, `Tag(s)`, `Select`, `Accordion`, icons, …). Don't edit those copied files. Wrap them or pass `className` instead. Never target their inner markup with selectors; if you need a prop, leave a `TODO(lift)` naming it (see conventions.md, "Reuse shared components first").

## Layer 1: always apply

- **Styling:** Tailwind classes only. Combine classes with template literals; no `clsx`/`cn`. Mobile-first, with `lg:` for desktop.
- **Colour:** tokens only (`bg-dark`, `text-light-text`, `border-light-grey`, `bg-dark/6`).
  - Never hex values. Never Tailwind default palettes.
  - Exception: `text-red-500` / `ring-red-500` for errors (unconfirmed).
- **Type:** headings use `font-book`, UI/body use `font-sans`.
  - Write size, line-height and letter-spacing by hand, with tracking at −2% of the size: `text-sm leading-[18px] tracking-[-0.28px]`, `text-[34px] leading-[34px] tracking-[-0.68px]`.
  - Use the role table in conventions.md.
- **Components:** PascalCase file, named `export function`, `type Props = {…}` at the top.
  - Variants are string unions with defaults.
  - Add `"use client"` only when the component needs it.
  - Give `useState` / `useRef` explicit type parameters.
- **Reuse before writing:** `Button`, `Modal`/`ConfirmModal`, `Tag(s)`, `Select`, `Accordion`, and icons from `@/components/icons`. New icons follow the `CloseIcon` shape and are exported from `index.ts`.
- **Accessibility:** semantic HTML, an `aria-label` on interactive elements, `type="button"`.
- **Images and links:** `next/image` and `next/link`.
- **Imports:** relative within a feature folder, `@/` across folders, `import type` for types.
- **Formatting:** double quotes, semicolons, trailing commas, 2 spaces. `pnpm lint` and `pnpm tsc --noEmit` must pass.

## Layer 2: only if the prototype needs it

Each item applies only when the task needs that capability. Otherwise leave it out. Stubs are in `~/Claude/team-conventions/starter/optional-stubs/` (not copied into prototypes); see its README for what to copy.

- **If it needs requests:** copy `api-fetch/`, add a fixture route at `src/app/api/<name>/route.ts`, and call it with `useEffect` + `useState` + `apiFetch`. No SWR, React Query or bare `fetch`.
- **If it needs shared state across distant components or routes:** copy `store/` and make a Zustand `use<Feature>Store`, read with selectors.
- **If it needs a validated form:** use controlled inputs, an `errors` object, and `INPUT_BASE` / `INPUT_ERROR` / `FieldError`. No form library.
- **If it shows meals (cards, rows, filters, the meal detail modal, ratings, calendar):** copy `meals/` plus `translations/` and `error-capture/`, add `@storyblok/react@^6` and `storyblok-rich-text-react-renderer@^3`, and wrap the layout in `MealDetailProvider`. Use those components as they are and don't edit them; to change content, compose around them or pass props. Files starting `PROTOTYPE SHIM` are the only fakes. For real meal data set `MEALS_API_BASE`.
- **If it needs multiple languages:** copy `translations/` and use `useTranslations()` or `usePublicTranslations()`.
- **If it needs action feedback:** use sonner `toast` with `<Toaster position="top-right" richColors />`. Never `Snackbar`.
- **If it has a real catch path:** copy `error-capture/` and call `captureError(err, { tags })`. No personal data in messages or extras.
- **If it mirrors a CMS page:** write plain prop-driven components with camelCase props. No Storyblok `blok` props or SDK.
- **If it touches the account area:** follow the *current* tree, not the redesign arm.
- **If it touches bundle, cart, header or hero:** follow bundle-v3, cart-v2, HeaderV2, HeroV2 (unconfirmed).

Never add: tests, stories, auth, `proxy.ts`, env validation, analytics, Sentry, Datadog, VWO, GTM, Klaviyo, Reviews.io, cookie consent.

## Never

- Modify anything in `~/Claude/every-website-main`. It's reference only.
- Write rules marked "unconfirmed" into the code as settled. Keep the `TODO(lift)` or (unconfirmed) markers.
