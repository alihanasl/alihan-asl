import en from "@/locales/en.json";
import tr from "@/locales/tr.json";
import type { Locale } from "@/lib/i18n/config";

export const dictionaries = {
  en,
  tr,
} as const;

export type Messages = typeof en;
export type MessageKey = Paths<Messages>;

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

export function translate(
  locale: Locale,
  key: MessageKey,
  vars?: Record<string, string>,
): string {
  const raw =
    getByPath(dictionaries[locale], key) ?? getByPath(dictionaries.en, key) ?? key;

  if (!vars) {
    return raw;
  }

  return Object.entries(vars).reduce(
    (result, [name, value]) => result.replaceAll(`{${name}}`, value),
    raw,
  );
}
