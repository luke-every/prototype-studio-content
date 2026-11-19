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

Run `/newprototype`. It makes a folder in `~/Claude/prototypes/` (one pnpm workspace, one shared install), copies `starter/`, this file and `conventions.md` in, adds the fonts from `starter/public/fonts/`, installs and starts the dev server.

The starter has only the always-on layer: tokens in `globals.css`, the font setup, and unmodified copies of the shared UI (`Button`, `Modal`, `ConfirmModal`, `Tag(s)`, `Select`, `Accordion`, icons, …). Don't edit those copies: wrap them or pass `className`, never target their inner markup, and if you need a prop leave a `TODO(lift)` naming it (conventions.md, "Reuse shared components first").

## Templates

`~/Claude/team-conventions/templates/` holds ready-built prototypes to start from instead of the blank starter: `/newprototype pdp-protein`. A template is the starter plus the kits it lists (from `optional-stubs/`) plus its own page and sample data, already linted. Change it, don't rebuild it. Each template's README (in `templates/<name>/`, not copied into the prototype) lists what is real, what is placeholder, and where to edit.

## Static only

A prototype is pushed to Prototype Studio as a static export. No API routes (`app/api`), server actions or middleware: fetch from the browser instead (the meals kit's `fetchMealDetail` is the example). `/push` stops on them.

## Studio controls

If a prototype has states, scenarios or variants someone would flip between (signed in or out, empty or full, A or B, which screen to start on, a slider value), expose each as a studio control. **When you're asked for variations, options or alternatives of a design, this is how you build them, as you go**: the studio running locally (the "Live" version) shows them straight from `public/studio.json` with no push, and lays each variant out as a screen on its canvas when the control has `"variants": true`. A variation that exists only in the code is invisible to the studio. Don't build a switcher bar into the page. Declare it in `public/studio.json` and read it with `useControl("id")` from `@/lib/studio-controls`, and hide any in-page demo chrome while `useEmbedded()` is true. The studio draws the controls beside the prototype and changes them live, without a reload. When the person moves on inside the prototype (a screen, a step, an answer), write where they are into the address with `setPlace`, so a reload, a shared link and the studio's comments see the same place. Format and a worked example: conventions.md, "Studio controls".

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
- **Explore loose, tidy when chosen:** tokens always, a design system component when it fits as it is, copy and data out of the markup, and `/handoff` once a direction is chosen. Details: conventions.md.
- **Accessibility:** semantic HTML, an `aria-label` on interactive elements, `type="button"`.
- **Images and links:** `next/image` and `next/link`. A plain `<img>` or CSS `url()` may point at a file in `public/` with a literal path, but never a path built in code (`"/img/" + name`): `/push` fixes literal paths for the studio and can't see built ones.
- **Imports:** relative within a feature folder, `@/` across folders, `import type` for types.
- **Formatting:** double quotes, semicolons, trailing commas, 2 spaces. `pnpm lint` and `pnpm tsc --noEmit` must pass.

## Layer 2: only if the prototype needs it

Each item applies only when the task needs it; otherwise leave it out. The kits are in `~/Claude/team-conventions/starter/optional-stubs/` (not copied into prototypes): its README says what each holds. Copy a kit's `src/` and `public/` in, and don't edit the files you copy.

- **Requests:** `api-fetch/`, with the fixture as a function in `src/lib/fixtures/<name>.ts` returning a `Result` (no API route: prototypes are static), called from a hook and marked `TODO(lift)`. No SWR, React Query or bare `fetch`.
- **Shared state across distant components:** `store/` (a Zustand `use<Feature>Store`, read with selectors). **Forms:** controlled inputs and an `errors` object, no form library. **Toasts:** sonner `toast`, never `Snackbar`.
- **Header, footer, product page top, reviews, meals, translations, errors:** the kits (`pdp-top/`, `site-sections/`, `meals/`, `storyblok-products/`, `translations/`, `error-capture/`). Reuse and restyle them; never rewrite them. No hand-typed meal lists (`storyblok-products/` has the real ones). Files starting `PROTOTYPE SHIM` are the only fakes.
- **Mirroring a CMS page:** plain prop-driven components with camelCase props. No Storyblok `blok` props or SDK.
- **Account area:** follow the *current* tree, not the redesign arm. **Bundle, cart, header, hero:** bundle-v3, cart-v2, HeaderV2, HeroV2 (unconfirmed).

Never add: tests, stories, auth, `proxy.ts`, env validation, analytics, Sentry, Datadog, VWO, GTM, Klaviyo, Reviews.io, cookie consent.

## Never

- Modify anything in `~/Claude/every-website-main`. It's reference only.
- Write rules marked "unconfirmed" into the code as settled. Keep the `TODO(lift)` or (unconfirmed) markers.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
