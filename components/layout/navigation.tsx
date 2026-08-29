"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav as fallbackNav, site } from "@/data/site";
import { NavPill } from "@/components/ui/nav-pill";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { useLocale } from "@/components/i18n/locale-provider";
import { useCms } from "@/components/cms/cms-provider";

export function Navigation() {
  const { t, locale } = useLocale();
  const { profile, layout } = useCms();
  const pathname = usePathname();
  const brand = profile.name || site.name;

  const menu = (
    layout.menu.length
      ? layout.menu
      : fallbackNav.map((item) => ({
          id: item.id,
          href: item.href,
          visible: true,
          label: { tr: t(`nav.${item.id}`), en: t(`nav.${item.id}`) },
        }))
  ).filter((item) => item.visible);

  const onInfo = pathname?.startsWith("/about");
  const onWork = !onInfo;

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-gradient-to-b from-black/40 to-transparent pt-4 md:pt-6">
      <div className="site-pad mx-auto grid max-w-[1680px] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 md:gap-4">
        <Link href="/" className="min-w-0 justify-self-start">
          <span className="block truncate text-[15px] font-medium leading-none tracking-[-0.02em] text-ink md:text-[20px]">
            {brand}
          </span>
          <span className="mt-1.5 hidden text-[12px] leading-none tracking-[0.02em] text-stone sm:block">
            {t("hero.index")}
          </span>
        </Link>

        <NavPill
          aria-label={t("a11y.primary")}
          items={menu.map((item) => ({
            id: item.id,
            href: item.href,
            label: item.label[locale] || item.label.en || item.label.tr,
            active:
              item.id === "info" || item.href === "/about"
                ? onInfo
                : onWork,
          }))}
        />

        <div className="flex items-center justify-end gap-2 justify-self-end">
          <NavPill
            aria-label={t("nav.resume")}
            items={[
              {
                id: "resume",
                label: t("nav.resume"),
                href: site.resumeUrl,
              },
            ]}
          />
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
