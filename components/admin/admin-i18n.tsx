"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  isLocale,
  localeCookie,
  type Locale,
} from "@/lib/i18n/config";
import {
  adminContentCookie,
  adminErrorText,
  adminFieldLabel,
  adminGroupLabel,
  adminUiCookie,
  translateAdmin,
  type AdminMessageKey,
} from "@/lib/i18n/admin";

type AdminI18nValue = {
  uiLocale: Locale;
  contentLocale: Locale;
  setUiLocale: (locale: Locale) => void;
  setContentLocale: (locale: Locale) => void;
  t: (key: AdminMessageKey, vars?: Record<string, string>) => string;
  fieldLabel: (key: string) => string;
  groupLabel: (id: string) => string;
  errorText: (code: string) => string;
};

const AdminI18nContext = createContext<AdminI18nValue | null>(null);

function writeCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; Path=/; Max-Age=31536000; SameSite=Lax`;
}

export function AdminI18nProvider({
  initialUi,
  initialContent,
  children,
}: {
  initialUi: Locale;
  initialContent: Locale;
  children: React.ReactNode;
}) {
  const [uiLocale, setUiLocaleState] = useState<Locale>(
    isLocale(initialUi) ? initialUi : "tr",
  );
  const [contentLocale, setContentLocaleState] = useState<Locale>(
    isLocale(initialContent) ? initialContent : "tr",
  );

  const setUiLocale = useCallback((next: Locale) => {
    setUiLocaleState(next);
    writeCookie(adminUiCookie, next);
    window.localStorage.setItem(adminUiCookie, next);
  }, []);

  const setContentLocale = useCallback((next: Locale) => {
    setContentLocaleState(next);
    writeCookie(adminContentCookie, next);
    writeCookie(localeCookie, next);
    window.localStorage.setItem(adminContentCookie, next);
    window.localStorage.setItem(localeCookie, next);
  }, []);

  const t = useCallback(
    (key: AdminMessageKey, vars?: Record<string, string>) =>
      translateAdmin(uiLocale, key, vars),
    [uiLocale],
  );

  const fieldLabel = useCallback(
    (key: string) => adminFieldLabel(uiLocale, key),
    [uiLocale],
  );

  const groupLabel = useCallback(
    (id: string) => adminGroupLabel(uiLocale, id),
    [uiLocale],
  );

  const errorText = useCallback(
    (code: string) => adminErrorText(uiLocale, code),
    [uiLocale],
  );

  const value = useMemo(
    () => ({
      uiLocale,
      contentLocale,
      setUiLocale,
      setContentLocale,
      t,
      fieldLabel,
      groupLabel,
      errorText,
    }),
    [
      uiLocale,
      contentLocale,
      setUiLocale,
      setContentLocale,
      t,
      fieldLabel,
      groupLabel,
      errorText,
    ],
  );

  return (
    <AdminI18nContext.Provider value={value}>
      {children}
    </AdminI18nContext.Provider>
  );
}

export function useAdminI18n() {
  const context = useContext(AdminI18nContext);
  if (!context) {
    throw new Error("useAdminI18n must be used within AdminI18nProvider");
  }
  return context;
}
