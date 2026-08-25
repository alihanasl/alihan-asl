"use client";

import { useAdminI18n } from "@/components/admin/admin-i18n";

export function LangTabs() {
  const { contentLocale, setContentLocale } = useAdminI18n();

  return (
    <div className="inline-flex rounded-md border border-zinc-200 bg-zinc-50 p-0.5">
      <button
        type="button"
        className={contentLocale === "tr" ? "admin-tab-active" : "admin-tab"}
        onClick={() => setContentLocale("tr")}
      >
        Türkçe
      </button>
      <button
        type="button"
        className={contentLocale === "en" ? "admin-tab-active" : "admin-tab"}
        onClick={() => setContentLocale("en")}
      >
        English
      </button>
    </div>
  );
}
