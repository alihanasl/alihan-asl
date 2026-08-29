"use client";

import { locales } from "@/lib/i18n/config";
import { useLocale } from "@/components/i18n/locale-provider";
import { NavPill } from "@/components/ui/nav-pill";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale, t } = useLocale();

  return (
    <NavPill
      className={className}
      aria-label={t("a11y.language")}
      items={locales.map((code) => ({
        id: code,
        label: code.toUpperCase(),
        active: locale === code,
        onClick: () => setLocale(code),
      }))}
    />
  );
}
