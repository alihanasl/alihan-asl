"use client";

import Link from "next/link";
import { useAdminI18n } from "@/components/admin/admin-i18n";
import type { Locale } from "@/lib/i18n/config";

export function AdminLangBar() {
  const { t, contentLocale, setContentLocale, setUiLocale } = useAdminI18n();

  function setLocale(next: Locale) {
    setContentLocale(next);
    setUiLocale(next);
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2">
      <div
        className="inline-flex rounded-md border border-zinc-200 bg-zinc-50 p-0.5"
        role="group"
        aria-label={t("lang.siteHint")}
      >
        <button
          type="button"
          className={contentLocale === "tr" ? "admin-tab-active" : "admin-tab"}
          onClick={() => setLocale("tr")}
        >
          Türkçe
        </button>
        <button
          type="button"
          className={contentLocale === "en" ? "admin-tab-active" : "admin-tab"}
          onClick={() => setLocale("en")}
        >
          English
        </button>
      </div>
      <Link
        href="/"
        target="_blank"
        rel="noreferrer"
        className="text-xs text-zinc-500 hover:text-zinc-800"
      >
        {t("lang.viewSite")}
      </Link>
    </div>
  );
}

export function AdminPanelLangOnly() {
  const { t, uiLocale, setUiLocale, setContentLocale } = useAdminI18n();

  function setLocale(next: Locale) {
    setUiLocale(next);
    setContentLocale(next);
  }

  return (
    <div
      className="inline-flex rounded-md border border-zinc-200 bg-zinc-50 p-0.5"
      role="group"
      aria-label={t("lang.panelHint")}
    >
      <button
        type="button"
        className={uiLocale === "tr" ? "admin-tab-active" : "admin-tab"}
        onClick={() => setLocale("tr")}
      >
        Türkçe
      </button>
      <button
        type="button"
        className={uiLocale === "en" ? "admin-tab-active" : "admin-tab"}
        onClick={() => setLocale("en")}
      >
        English
      </button>
    </div>
  );
}
