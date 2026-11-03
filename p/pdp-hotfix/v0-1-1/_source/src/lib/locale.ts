export const LOCALES = ["en", "de", "fr", "nl"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

const LOCALE_SET = new Set<string>(LOCALES);
export function isLocale(v: string): v is Locale { return LOCALE_SET.has(v); }

/** Maps app locale codes to BCP 47 tags for Intl.NumberFormat. */
export const INTL_LOCALE: Record<Locale, string> = { de: "de-DE", fr: "fr-FR", nl: "nl-NL", en: "en-US" };

/** Builds a locale-prefixed path helper for a given locale.
 *  `marketDefaultLocale` is the locale that gets no URL prefix on this domain. */
export function buildLocalePath(locale: string, marketDefaultLocale = "en") {
  return (path: string) => {
    if (locale === marketDefaultLocale) return path;
    const normalized = path.startsWith("/") ? path : `/${path}`;
    return `/${locale}${normalized}`;
  };
}

/** Locale from URL (`/de/...`) or default for unprefixed `/account/*` routes. */
export function resolveLocaleFromPathname(pathname: string): Locale {
  for (const locale of LOCALES) {
    if (
      locale !== DEFAULT_LOCALE &&
      (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`)
    ) {
      return locale;
    }
  }
  return DEFAULT_LOCALE;
}

/**
 * Resolves the locale for a login request from a `?locale=` param or Referer pathname.
 * Extracted as a pure function so it can be tested independently of NextRequest.
 */
export function resolveLocaleFromLoginParams(localeParam: string | null, referer: string | null): Locale {
  if (localeParam && isLocale(localeParam)) return localeParam;
  try {
    if (referer) return resolveLocaleFromPathname(new URL(referer).pathname);
  } catch {
    // malformed referer — fall through to default
  }
  return DEFAULT_LOCALE;
}

/** Runs `predicate` against a pathname, and again with any locale prefix stripped. */
function matchesPathWithLocale(pathname: string, predicate: (p: string) => boolean): boolean {
  if (predicate(pathname)) return true;
  return LOCALES.some((locale) => {
    const prefix = `/${locale}`;
    if (pathname !== prefix && !pathname.startsWith(`${prefix}/`)) return false;
    return predicate(pathname.slice(prefix.length));
  });
}

/** Whether a pathname is under the `(account)` route group, with or without a locale prefix. */
export function isAccountPath(pathname: string): boolean {
  return matchesPathWithLocale(pathname, (p) => p === "/account" || p.startsWith("/account/"));
}

/**
 * Public routes that stay reachable for an authenticated subscriber instead of being
 * redirected to /account/discover. CRM campaigns deep-link subscribers into blog
 * articles, so the whole /blogs tree is whitelisted. /claims-general is the QR target on
 * the dry-ice delivery insert — it ships inside the box, so practically everyone scanning
 * it already has a live session, and the bounce made the claims flow unreachable for
 * exactly the people it was printed for. The legal pages are linked from the account
 * footer across every store/language, so subscribers must be able to open them without
 * getting bounced back to /account/discover. /b2b is the RC B2B promo page — logged-in
 * subscribers must be able to land on it directly instead of bouncing to /account/discover.
 * /cancellation is linked from the account area, so subscribers must be able to open it too.
 */
const SUBSCRIBER_PUBLIC_PREFIXES = [
  "/blogs",
  "/tracking",
  "/claims-general",
  "/spielregeln",
  "/datenschutzerklarung",
  "/impressum",
  "/widerrufsbelehrung",
  "/b2b",
  "/cancellation",
] as const;

/** Whether a pathname is a public route a subscriber may browse, with or without a locale prefix. */
export function isSubscriberPublicPath(pathname: string): boolean {
  return matchesPathWithLocale(pathname, (p) =>
    SUBSCRIBER_PUBLIC_PREFIXES.some((prefix) => p === prefix || p.startsWith(`${prefix}/`))
  );
}

/**
 * One-off pages outside the "/b2b" tree that should also load the B2B Klaviyo account —
 * add exact pathnames here as they come up (no wildcards).
 */
const B2B_CUSTOM_PATHS: readonly string[] = [];

/**
 * Whether a pathname is the B2B page, with or without a locale prefix — matches "/b2b" at any
 * folder depth (e.g. "/testing/b2b" for a Storyblok preview path), so long as "b2b" is the
 * final path segment, or an exact match in B2B_CUSTOM_PATHS. Used to pick which Klaviyo
 * account's onsite script to load (see KLAVIYO_B2B_HEADER in proxy.ts) since Klaviyo can't run
 * two accounts on the same page.
 */
export function isB2BPath(pathname: string): boolean {
  return matchesPathWithLocale(pathname, (p) => {
    const normalized = p.replace(/\/$/, "");
    return normalized.endsWith("/b2b") || B2B_CUSTOM_PATHS.includes(normalized);
  });
}
