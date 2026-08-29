"use client";

import { useLocale } from "@/components/i18n/locale-provider";
import { useCms } from "@/components/cms/cms-provider";
import { site } from "@/data/site";
import { pickLocalized } from "@/lib/cms/layout";
import type { MessageKey } from "@/lib/i18n/translate";

export function Footer() {
  const { t, locale } = useLocale();
  const { profile, layout } = useCms();
  const extra = layout.footer.links.filter((link) =>
    pickLocalized(locale, link.label),
  );
  const socials = [
    profile.email ? { id: "email", href: `mailto:${profile.email}` } : null,
    profile.linkedinUrl
      ? { id: "linkedin", href: profile.linkedinUrl }
      : null,
    profile.githubUrl ? { id: "github", href: profile.githubUrl } : null,
  ].filter((item): item is { id: string; href: string } => Boolean(item));

  return (
    <footer>
      <div className="site-pad mx-auto flex max-w-[1680px] flex-col gap-4 py-8 md:flex-row md:items-center md:justify-between">
        <p className="text-[12px] tracking-[-0.01em] text-stone">
          {profile.name || site.name}
        </p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {socials.map((item) => (
            <a
              key={item.id}
              href={item.href}
              {...(item.href.startsWith("http")
                ? { target: "_blank", rel: "noreferrer noopener" }
                : {})}
              className="text-[12px] tracking-[-0.01em] text-stone transition-colors hover:text-ink"
            >
              {t(`contact.${item.id}` as MessageKey)}
            </a>
          ))}
          {extra.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className="text-[12px] tracking-[-0.01em] text-stone transition-colors hover:text-ink"
            >
              {pickLocalized(locale, link.label)}
            </a>
          ))}
          <p className="text-[12px] tracking-[-0.01em] text-stone">
            © {t("footer.year") || String(new Date().getFullYear())}
          </p>
        </div>
      </div>
    </footer>
  );
}
