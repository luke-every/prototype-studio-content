import type { Locale } from "@/lib/locale";
import {getMarketConfig, Market} from "@/lib/market";
import { marketDomain } from "@/lib/market";

/** Maps ISO country code → Every market. */
const COUNTRY_MARKET: Record<string, Market> = {
  DE: "da",
  AT: "da",
  NL: "bnl",
  BE: "bnl",
  LU: "bnl",
  LI: "ch",
  CH: "ch",
};

/** Maps ISO country code → the Every market domain. */
export const COUNTRY_DOMAIN: Record<string, string> = Object.fromEntries(
  Object.entries(COUNTRY_MARKET).map(([code, market]) => [code, marketDomain(market)])
);

/** Display name for each country code used in the geo modal. */
export const COUNTRY_NAMES: Record<string, string> = {
  CH: "Switzerland",
  LI: "Liechtenstein",
  DE: "Germany",
  AT: "Austria",
  LU: "Luxembourg",
  NL: "Netherlands",
  BE: "Belgium",
};

export type SwitcherLanguage = {
  id: Locale;
  name: string;
};

export type COUNTRY_ID = "DE" | "AT" | "NL" | "BE" | "LU" | "CH" | "LI";

export type SwitcherCountry = {
  id: COUNTRY_ID;
  name: string;
  domain: string;
  defaultLocale: Locale;
  languages: Locale[];
};

export const SWITCHER_LANGUAGES: SwitcherLanguage[] = [
  { id: "en", name: "English" },
  { id: "de", name: "Deutsch" },
  { id: "nl", name: "Dutch" },
  { id: "fr", name: "Français" },
];

export const SWITCHER_COUNTRIES: SwitcherCountry[] = [
  { id: "DE", name: "Germany (EUR)", domain: marketDomain("da"), defaultLocale: "de", languages: ["de", "en"] },
  { id: "AT", name: "Austria (EUR)", domain: marketDomain("da"), defaultLocale: "de", languages: ["de", "en"] },
  { id: "NL", name: "Netherlands (EUR)", domain: marketDomain("bnl"), defaultLocale: "nl", languages: ["nl", "en", "fr"] },
  { id: "BE", name: "Belgium (EUR)", domain: marketDomain("bnl"), defaultLocale: "nl", languages: ["nl", "en", "fr"] },
  { id: "LU", name: "Luxembourg (EUR)", domain: marketDomain("bnl"), defaultLocale: "nl", languages: ["nl", "en", "fr"] },
  { id: "CH", name: "Switzerland (CHF)", domain: marketDomain("ch"), defaultLocale: "de", languages: ["de", "en", "fr"] },
  { id: "LI", name: "Liechtenstein (CHF)", domain: marketDomain("ch"), defaultLocale: "de", languages: ["de", "en", "fr"] },
];

export function getMarketLocales(market: Market): Locale[] {
  const domain = marketDomain(market);
  const languages = [
    ...new Set(SWITCHER_COUNTRIES.filter((c) => c.domain === domain).flatMap((c) => c.languages)),
  ];
  return languages.length > 0 ? languages : ["en"];
}

/**
 * Builds the locale-prefixed path for a given locale on the same domain.
 * `marketDefaultLocale` is the locale that gets no URL prefix on the target domain.
 * `translatedSlugs` maps locale → clean slug (no locale prefix); when provided,
 * the translated slug is used instead of deriving the path from the current URL.
 */
export function buildLocalePath(
  locale: Locale,
  currentPathname: string,
  currentLocale: Locale,
  marketDefaultLocale: Locale,
  translatedSlugs: Partial<Record<Locale, string>> | null,
  currentMarket: Market,
): string {
  const translatedSlug = translatedSlugs?.[locale];
  if (translatedSlug !== undefined && translatedSlug.length > 0) {
    if (locale === marketDefaultLocale) return translatedSlug ? `/${translatedSlug}` : "/";
    return `/${locale}${translatedSlug ? `/${translatedSlug}` : ""}`;
  }

  const marketConfig = getMarketConfig(currentMarket);
  let base = currentPathname;
  if (currentLocale !== marketConfig.defaultLocale) {
    base = base.slice(`/${currentLocale}`.length) || "/";
  } else if (currentLocale !== marketDefaultLocale && base.startsWith(`/${currentLocale}`)) {
    base = base.slice(`/${currentLocale}`.length) || "/";
  }
  if (locale === marketDefaultLocale) {
    return base || "/";
  }
  return `/${locale}${base === "/" ? "" : base}`;
}

/** Geo modal copy per locale. */
export const GEO_MODAL_COPY: Record<Locale, { title: string; accept: string; decline: string }> = {
  en: {
    title: "It looks like you're browsing from {country}.\nWould you like to switch to the {country} website?",
    accept: "Change website",
    decline: "Stay on current website",
  },
  de: {
    title: "Es sieht aus, als würdest du aus {country} surfen.\nMöchtest du zur {country}-Website wechseln?",
    accept: "Website wechseln",
    decline: "Auf dieser Website bleiben",
  },
  fr: {
    title: "Il semble que vous naviguez depuis {country}.\nSouhaitez-vous passer au site {country} ?",
    accept: "Changer de site",
    decline: "Rester sur ce site",
  },
  nl: {
    title: "Het lijkt erop dat je bladert vanuit {country}.\nWil je overschakelen naar de {country}-website?",
    accept: "Website wisselen",
    decline: "Op dit website blijven",
  },
};
