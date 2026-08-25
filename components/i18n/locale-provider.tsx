"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import {
  isLocale,
  localeCookie,
  type Locale,
} from "@/lib/i18n/config";
import { translate, type MessageKey } from "@/lib/i18n/translate";
import { site } from "@/data/site";
import { useCms } from "@/components/cms/cms-provider";
import { pickLocale } from "@/lib/cms/types";

type Translator = (key: MessageKey, vars?: Record<string, string>) => string;

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translator;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function persistLocale(next: Locale) {
  document.cookie = `${localeCookie}=${next}; Path=/; Max-Age=31536000; SameSite=Lax`;
  window.localStorage.setItem(localeCookie, next);
  document.documentElement.lang = next;
}

type LocaleProviderProps = {
  initialLocale: Locale;
  children: React.ReactNode;
};

export function LocaleProvider({
  initialLocale,
  children,
}: LocaleProviderProps) {
  const pathname = usePathname();
  const cms = useCms();
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    persistLocale(next);
  }, []);

  useEffect(() => {
    const cookieMatch = document.cookie.match(/(?:^|; )locale=([^;]*)/);
    const cookieLocale = cookieMatch?.[1];
    const stored = window.localStorage.getItem(localeCookie);
    const next = isLocale(cookieLocale)
      ? cookieLocale
      : isLocale(stored)
        ? stored
        : null;

    if (!next || next === initialLocale) {
      if (isLocale(cookieLocale)) {
        window.localStorage.setItem(localeCookie, cookieLocale);
      }
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      setLocaleState(next);
      persistLocale(next);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [initialLocale]);

  const t = useCallback<Translator>(
    (key, vars) => {
      const fromCms = cms.copy[key]?.[locale];
      if (typeof fromCms === "string") {
        if (!vars) return fromCms;
        return Object.entries(vars).reduce(
          (result, [name, value]) => result.replaceAll(`{${name}}`, value),
          fromCms,
        );
      }
      return translate(locale, key, vars);
    },
    [cms.copy, locale],
  );

  useEffect(() => {
    if (pathname?.startsWith("/admin")) {
      document.title = "Admin";
      return;
    }

    document.documentElement.lang = locale;

    const projectSlug = pathname?.startsWith("/projects/")
      ? pathname.split("/")[2]
      : undefined;
    const project = projectSlug
      ? cms.projects.find((item) => item.slug === projectSlug)
      : undefined;
    const projectName = project
      ? pickLocale(locale, project.titleTr, project.titleEn)
      : "";
    const projectDescription = project
      ? pickLocale(
          locale,
          project.shortDescriptionTr,
          project.shortDescriptionEn,
        )
      : "";

    document.title = project
      ? `${projectName} — ${cms.profile.name || site.name}`
      : t("meta.title");

    const description = document.querySelector('meta[name="description"]');
    description?.setAttribute(
      "content",
      project ? projectDescription : t("meta.description"),
    );
  }, [cms.profile.name, cms.projects, locale, pathname, t]);

  const value = useMemo(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return context;
}
