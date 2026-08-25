"use client";

import { useLocale } from "@/components/i18n/locale-provider";
import { useCms } from "@/components/cms/cms-provider";
import { site } from "@/data/site";

export function Footer() {
  const { t } = useLocale();
  const { profile } = useCms();

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
            © {site.year}
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone">
            {t("footer.note")}
          </p>
        </div>
      </div>
    </footer>
  );
}
