"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { nav as fallbackNav, site } from "@/data/site";
import { cn } from "@/lib/cn";
import { Magnetic } from "@/components/ui/magnetic";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { useLocale } from "@/components/i18n/locale-provider";
import { useCms } from "@/components/cms/cms-provider";

export function Navigation() {
  const { t, locale } = useLocale();
  const { profile, layout } = useCms();
  const brand = profile.name || site.name;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const menu = (layout.menu.length ? layout.menu : fallbackNav.map((item) => ({
    id: item.id,
    href: item.href,
    visible: true,
    label: { tr: t(`nav.${item.id}`), en: t(`nav.${item.id}`) },
  }))).filter((item) => item.visible);

  const items = menu.map((item) => ({
    href: item.href,
    label: item.label[locale] || item.label.en || item.label.tr,
  }));

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
        scrolled || open
          ? "border-b border-line/80 bg-paper/80 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 md:h-[4.25rem] md:px-10 lg:px-14">
        <Magnetic strength={18}>
          <Link
            href="/"
            className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink"
            onClick={() => setOpen(false)}
          >
            {brand}
          </Link>
        </Magnetic>

        <nav
          className="hidden items-center gap-5 lg:gap-8 md:flex"
          aria-label={t("a11y.primary")}
        >
          {menu.map((item) => (
            <Magnetic key={item.id} strength={22}>
              <Link
                href={item.href}
                className="whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.2em] text-graphite transition-colors duration-300 hover:text-ink"
              >
                {item.label[locale] || item.label.en || item.label.tr}
              </Link>
            </Magnetic>
          ))}
          <LanguageSwitcher className="border-l border-line pl-5 lg:pl-6" />
        </nav>

        <button
          type="button"
          className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? t("nav.close") : t("nav.menu")}
        </button>
      </div>

      <div
        id="mobile-nav"
        className={cn(
          "border-t border-line bg-paper md:hidden",
          open ? "block" : "hidden",
        )}
      >
        <nav
          aria-label={t("a11y.mobile")}
          className="flex min-h-[calc(100svh-4rem)] flex-col justify-between px-5 py-10"
        >
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="font-display block py-2 text-[13vw] leading-[0.9] tracking-[-0.04em] text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-end justify-between gap-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone">
              {t("footer.descriptor")}
            </p>
            <LanguageSwitcher />
          </div>
        </nav>
      </div>
    </header>
  );
}
