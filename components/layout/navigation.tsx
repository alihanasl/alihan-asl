"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { nav as fallbackNav, site } from "@/data/site";
import { cn } from "@/lib/cn";
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
      setScrolled(window.scrollY > 24);
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

  const items = menu.map((item) => ({
    href: item.href,
    label: item.label[locale] || item.label.en || item.label.tr,
  }));

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color] duration-500",
        scrolled || open ? "bg-paper/92" : "bg-transparent",
      )}
    >
      <div className="site-pad mx-auto flex h-14 max-w-[1680px] items-center justify-between md:h-16">
        <Link
          href="/"
          className="text-[13px] tracking-[-0.02em] text-ink md:text-sm"
          onClick={() => setOpen(false)}
        >
          {brand}
        </Link>

        <nav
          className="hidden items-center gap-8 md:flex lg:gap-10"
          aria-label={t("a11y.primary")}
        >
          {menu.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="text-[13px] tracking-[-0.01em] text-graphite transition-colors duration-300 hover:text-ink"
            >
              {item.label[locale] || item.label.en || item.label.tr}
            </Link>
          ))}
          <LanguageSwitcher />
        </nav>

        <button
          type="button"
          className="text-[13px] tracking-[-0.01em] text-ink md:hidden"
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
          "bg-paper md:hidden",
          open ? "block" : "hidden",
        )}
      >
        <nav
          aria-label={t("a11y.mobile")}
          className="site-pad flex min-h-[calc(100svh-3.5rem)] flex-col justify-between py-10"
        >
          <ul>
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="font-display block py-1.5 text-[12vw] leading-[0.88] tracking-[-0.05em] text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
}
