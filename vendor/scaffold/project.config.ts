export type Locale = string;

export function getLocalizationInfo(_locale: string) {
  return { locale: "en", language: "en", country: "US", currency: "USD" };
}

export const i18nConfig = {
  defaultLocale: "en" as Locale,
  locales: ["en"] as Locale[],
};
