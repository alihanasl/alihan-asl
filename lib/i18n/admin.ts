import en from "@/locales/admin-en.json";
import tr from "@/locales/admin-tr.json";
import type { Locale } from "@/lib/i18n/config";

export const adminDictionaries = {
  en,
  tr,
} as const;

export type AdminMessages = typeof en;
export type AdminMessageKey = Paths<AdminMessages>;

type Paths<T, Prefix extends string = ""> = T extends string
  ? Prefix
  : {
      [K in keyof T & string]: Paths<
        T[K],
        Prefix extends "" ? K : `${Prefix}.${K}`
      >;
    }[keyof T & string];

function getByPath(source: unknown, path: string): string | undefined {
  const value = path.split(".").reduce<unknown>((node, segment) => {
    if (node && typeof node === "object" && segment in node) {
      return (node as Record<string, unknown>)[segment];
    }
    return undefined;
  }, source);

  return typeof value === "string" ? value : undefined;
}

export function translateAdmin(
  locale: Locale,
  key: AdminMessageKey,
  vars?: Record<string, string>,
): string {
  const raw =
    getByPath(adminDictionaries[locale], key) ??
    getByPath(adminDictionaries.en, key) ??
    key;

  if (!vars) {
    return raw;
  }

  return Object.entries(vars).reduce(
    (result, [name, value]) => result.replaceAll(`{${name}}`, value),
    raw,
  );
}

export function adminFieldLabel(locale: Locale, key: string) {
  const table = adminDictionaries[locale].fields as Record<string, string>;
  const fallback = adminDictionaries.en.fields as Record<string, string>;
  return table[key] ?? fallback[key] ?? key;
}

export function adminGroupLabel(locale: Locale, id: string) {
  const table = adminDictionaries[locale].groups as Record<string, string>;
  const fallback = adminDictionaries.en.groups as Record<string, string>;
  return table[id] ?? fallback[id] ?? id;
}

export function adminErrorText(locale: Locale, code: string) {
  const key = `errors.${code}` as AdminMessageKey;
  const translated = translateAdmin(locale, key);
  return translated === key ? code : translated;
}

export const adminUiCookie = "admin_ui_locale";
export const adminContentCookie = "admin_content_locale";
