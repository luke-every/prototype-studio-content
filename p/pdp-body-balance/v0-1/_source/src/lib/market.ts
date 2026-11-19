import type { Locale } from "@/lib/locale";
import {COUNTRY_ID} from "@/lib/geo";

export type Market = "da" | "bnl" | "ch" | "dev";

export const MARKETS: Market[] = ["da", "bnl", "ch", "dev"] as const;

export const Market = {
  DA: "da",
  BNL: "bnl",
  CH: "ch",
  DEV: "dev",
} as const satisfies Record<string, Market>;

export function shopifyProductKey(market: Market): `shopify_product_${Market}` {
  return `shopify_product_${market}`;
}

/** The bundle's own canonical Shopify product/SKU per market — static, independent of which size variant is selected. */
export function shopifyBundleKey(market: Market): `shopify_bundle_${Market}` {
  return `shopify_bundle_${market}`;
}

/** Storyblok field name for a klaviyo_form blok's per-market Klaviyo form id. */
export function formIdMarketKey(market: Market): `form_id_market_${Market}` {
  return `form_id_market_${market}`; 
}

/** Stock status is set per market in Storyblok, so the same product can be out of stock on one market only. */
export function stockStatusKey(market: Market): `stock_status_${Market}` {
  return `stock_status_${market}`;
}

const MARKET_CURRENCY: Record<Market, string> = {
  da: "EUR",
  bnl: "EUR",
  ch: "CHF",
  dev: "EUR",
};

export function marketCurrency(market: Market): string {
  return MARKET_CURRENCY[market];
}

const MARKET_DEFAULT_LOCALE_MAP: Record<Market, Locale> = {
  da:  "de",
  ch:  "de",
  bnl: "nl",
  dev: "de",
};

export function getMarketDefaultLocale(market: Market): Locale {
  return MARKET_DEFAULT_LOCALE_MAP[market];
}


const MARKET_DOMAIN: Record<Market, string> = {
  da:  "https://every-foods.com",
  bnl: "https://every-foods.nl",
  ch:  "https://everyfoods.ch",
  dev: "https://every-foods.com",
};

const MARKET_DOMAIN_STAGING: Record<Market, string> = {
  da:  "https://staging.every-foods.com",
  bnl: "https://staging.every-foods.nl",
  ch:  "https://staging.everyfoods.ch",
  dev: "https://every-foods.com",
};

export function marketDomain(market: Market): string {
  if (process.env.NEXT_PUBLIC_ENV === "staging") return MARKET_DOMAIN_STAGING[market];
  return MARKET_DOMAIN[market];
}

const KARLA_SLUG: Record<Market, string> = {
  da:  "every-de",
  ch:  "every-ch",
  bnl: "every-bnl",
  dev: "every-de",
};

export function karlaShopSlug(market: Market): string {
  return KARLA_SLUG[market];
}

type MarketConfiguration = {
  defaultLocale: Locale,
  languages: Locale[],
  countries: COUNTRY_ID[]
};

const MARKET_CONFIGURATIONS: Record<Market, MarketConfiguration> = {
  da: {defaultLocale: "de", languages: ["de", "en"], countries: ["DE", "AT"] },
  bnl: {defaultLocale: "nl", languages: ["nl", "en", "fr"], countries: ["NL", "BE", "LU"]},
  ch: {defaultLocale: "de", languages: ["de", "en", "fr"], countries: ["CH", "LI"]},
  dev: {defaultLocale: "de", languages: ["de", "en"], countries: ["DE", "AT"]},
};

export function getMarketConfig(market: Market): MarketConfiguration {
  return MARKET_CONFIGURATIONS[market];
}

const MARKET_ONLY_FIELD: Record<Market, "da_only" | "bnl_only" | "ch_only" | "dev_only"> = {
  da: "da_only",
  bnl: "bnl_only",
  ch: "ch_only",
  dev: "dev_only",
};

/** Storyblok field name for a market's slot on a market_specific_component blok. */
export function marketOnlyField(market: Market): "da_only" | "bnl_only" | "ch_only" | "dev_only" {
  return MARKET_ONLY_FIELD[market];
}