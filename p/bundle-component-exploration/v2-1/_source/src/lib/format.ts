export function maskEmail(email: string): string {
    const atIndex = email.indexOf("@");
    if (atIndex < 0) return "***@***";
    return `${email.slice(0, 1)}***${email.slice(atIndex)}`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (!Number.isFinite(d.getTime())) return "";
  return d.toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" });
}

export function parseShopifyPrice(price: string | null | undefined): number | null {
  if (!price) return null;
  const num = parseFloat(price);
  return isNaN(num) ? null : num;
}

type FormatPriceOptions = {
  currencyFirst?: boolean;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  /** Keeps a space between the amount and the currency symbol. Default false preserves every existing call site's output. */
  space?: boolean;
};

export function formatPrice(value: number, currencyCode: string, options: FormatPriceOptions = {}): string {
  const { currencyFirst = false, minimumFractionDigits = 2, maximumFractionDigits = 2, space = false } = options;
  const clampedMinFractionDigits = Math.min(minimumFractionDigits, maximumFractionDigits);
  const parts = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: clampedMinFractionDigits,
    maximumFractionDigits,
  }).formatToParts(value);

  const currencyPart = parts.find((p) => p.type === "currency")?.value ?? "";
  const numberPart = parts.filter((p) => p.type !== "currency" && p.type !== "literal").map((p) => p.value).join("");
  const joiner = space ? " " : "";

  return currencyFirst ? `${currencyPart}${joiner}${numberPart}` : `${numberPart}${joiner}${currencyPart}`;
}

const WEIGHT_UNIT_LABELS: Record<string, string> = { GRAMS: "g", KILOGRAMS: "kg", OUNCES: "oz", POUNDS: "lb" };

export function formatWeightUnit(unit: string): string {
  return WEIGHT_UNIT_LABELS[unit] ?? unit.toLowerCase();
}

export function roundPrice(value: number): number {
  return Math.floor(value * 100) / 100;
}

export function formatMoney(amount: string, currencyCode: string): string {
  const n = Number(amount);
  if (!Number.isFinite(n)) return `${amount} ${currencyCode}`;
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: currencyCode }).format(n);
  } catch {
    return `${amount} ${currencyCode}`;
  }
}
