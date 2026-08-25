export const locales = ["en", "tr"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeCookie = "locale";

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "en" || value === "tr";
}

export function detectLocale(
  stored: string | undefined,
  acceptLanguage: string | null,
): Locale {
  if (isLocale(stored)) {
    return stored;
  }

  if (acceptLanguage) {
    const preferred = acceptLanguage
      .split(",")
      .map((part) => part.split(";")[0]?.trim().toLowerCase())
      .find(Boolean);

    if (preferred?.startsWith("tr")) {
      return "tr";
    }
  }

  return defaultLocale;
}
