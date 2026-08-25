"use client";

import { useLocale } from "@/components/i18n/locale-provider";
import { useCms } from "@/components/cms/cms-provider";
import { site } from "@/data/site";
import { pickLocalized } from "@/lib/cms/layout";

export function Footer() {
  const { t, locale } = useLocale();
  const { profile, layout } = useCms();
  const extra = layout.footer.links.filter((link) =>
    pickLocalized(locale, link.label),
  );

  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-5 py-8 md:flex-row md:items-center md:justify-between md:px-10 md:py-10 lg:px-14">
        <div className="flex flex-wrap items-baseline gap-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink">
            {profile.name || site.name}
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone">
            {t("footer.descriptor")}
          </p>
        </div>
        <div className="flex items-center justify-between gap-6 md:justify-end">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone">
            © {t("footer.year") || String(new Date().getFullYear())}
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone">
            {t("footer.note")}
          </p>
          {extra.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone transition-colors hover:text-ink"
            >
              {pickLocalized(locale, link.label)}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
