"use client";

import { useLocale } from "@/components/i18n/locale-provider";

export function SkipLink() {
  const { t } = useLocale();

  return (
    <a
      href="#content"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
    >
      {t("a11y.skip")}
    </a>
  );
}
