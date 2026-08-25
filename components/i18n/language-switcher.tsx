"use client";

import { locales } from "@/lib/i18n/config";
import { useLocale } from "@/components/i18n/locale-provider";
import { cn } from "@/lib/cn";

type LanguageSwitcherProps = {
  className?: string;
};

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { locale, setLocale, t } = useLocale();

  return (
    <div
      className={cn(
        "flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em]",
        className,
      )}
      role="group"
      aria-label={t("a11y.language")}
    >
      {locales.map((code, index) => (
        <span key={code} className="flex items-center gap-2">
          {index > 0 && (
            <span className="text-line-strong" aria-hidden>
              |
            </span>
          )}
          <button
            type="button"
            className={cn(
              "transition-colors duration-300",
              locale === code ? "text-ink" : "text-stone hover:text-ink",
            )}
            aria-pressed={locale === code}
            aria-label={t(code === "en" ? "a11y.en" : "a11y.tr")}
            onClick={() => setLocale(code)}
          >
            {code.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  );
}
