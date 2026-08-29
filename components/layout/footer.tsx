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
    <footer>
      <div className="site-pad mx-auto flex max-w-[1680px] items-center justify-between py-6">
        <p className="text-[12px] tracking-[-0.01em] text-stone">
          {profile.name || site.name}
        </p>
        <div className="flex items-center gap-6">
          <p className="text-[12px] tracking-[-0.01em] text-stone">
            © {t("footer.year") || String(new Date().getFullYear())}
          </p>
          {extra.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className="text-[12px] tracking-[-0.01em] text-stone transition-colors hover:text-ink"
            >
              {pickLocalized(locale, link.label)}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
