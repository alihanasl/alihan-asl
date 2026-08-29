"use client";

import Link from "next/link";
import { useLocale } from "@/components/i18n/locale-provider";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { SkipLink } from "@/components/layout/skip-link";

export default function NotFound() {
  const { t } = useLocale();

  return (
    <>
      <SkipLink />
      <Navigation />
      <main
        id="content"
        className="site-pad flex min-h-[100svh] flex-col justify-end pb-16 pt-32"
      >
        <p className="text-[11px] uppercase tracking-[0.22em] text-stone">
          404
        </p>
        <h1 className="font-display mt-6 text-[clamp(3.5rem,12vw,8.5rem)] leading-[0.84] tracking-[-0.06em]">
          {t("notFound.line1")}
          <span className="block">{t("notFound.line2")}</span>
        </h1>
        <Link
          href="/"
          className="mt-10 text-[15px] tracking-[-0.02em] text-ink transition-opacity hover:opacity-40"
        >
          {t("notFound.back")}
        </Link>
      </main>
      <Footer />
    </>
  );
}
