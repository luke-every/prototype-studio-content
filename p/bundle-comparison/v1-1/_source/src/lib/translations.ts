import enTranslations from "@/locales/account/en.json";

export type Translations = typeof enTranslations;

/** Replaces `{key}` placeholders in a template string with the provided values. */
export function interpolate(
  template: string,
  vars: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    key in vars ? String(vars[key]) : `{${key}}`,
  );
}
