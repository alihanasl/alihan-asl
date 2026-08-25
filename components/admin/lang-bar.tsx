"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";
import { useAdminI18n } from "@/components/admin/admin-i18n";
import type { Locale } from "@/lib/i18n/config";

function Pair({
  value,
  onChange,
  labelledBy,
}: {
  value: Locale;
  onChange: (locale: Locale) => void;
  labelledBy: string;
}) {
  const { t } = useAdminI18n();

  return (
    <div
      className="inline-flex rounded-md border border-zinc-200 bg-zinc-50 p-0.5"
      role="group"
      aria-labelledby={labelledBy}
    >
      {(["tr", "en"] as const).map((code) => (
        <button
          key={code}
          type="button"
          className={value === code ? "admin-tab-active" : "admin-tab"}
          onClick={() => onChange(code)}
        >
          {t(`lang.${code}`)}
        </button>
      ))}
    </div>
  );
}

export function AdminLangBar({ compact = false }: { compact?: boolean }) {
  const { t, uiLocale, contentLocale, setUiLocale, setContentLocale } =
    useAdminI18n();

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-4 gap-y-2",
        compact ? "justify-end" : "justify-end",
      )}
    >
      <div className="flex items-center gap-2">
        <span
          id="admin-lang-site"
          className="text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-500"
          title={t("lang.siteHint")}
        >
          {t("lang.site")}
        </span>
        <Pair
          value={contentLocale}
          onChange={setContentLocale}
          labelledBy="admin-lang-site"
        />
      </div>
      <div className="flex items-center gap-2">
        <span
          id="admin-lang-panel"
          className="text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-500"
          title={t("lang.panelHint")}
        >
          {t("lang.panel")}
        </span>
        <Pair
          value={uiLocale}
          onChange={setUiLocale}
          labelledBy="admin-lang-panel"
        />
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
  const { t, uiLocale, setUiLocale } = useAdminI18n();

  return (
    <div className="flex items-center gap-2">
      <span
        id="admin-login-lang"
        className="text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-500"
      >
        {t("lang.panel")}
      </span>
      <Pair
        value={uiLocale}
        onChange={setUiLocale}
        labelledBy="admin-login-lang"
      />
    </div>
  );
}
