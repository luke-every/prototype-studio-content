/** A box covers a month */
export const WEEKS = 4;

/** "4 a week", or "about 4 a week" when the weeks aren't even */
export function perWeek(units: number): string {
  const each = units / WEEKS;
  // TODO(lift): replace with translation key
  return Number.isInteger(each) ? `${each} a week` : `about ${Math.round(each)} a week`;
}
