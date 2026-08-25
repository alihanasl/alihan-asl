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
        className="flex min-h-[100svh] flex-col justify-end px-5 pb-16 pt-32 md:px-10 lg:px-14"
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-stone">
          404
        </p>
        <h1 className="font-display mt-6 text-[clamp(3.5rem,12vw,8rem)] leading-[0.86] tracking-[-0.05em]">
          {t("notFound.line1")}
          <span className="block">{t("notFound.line2")}</span>
        </h1>
        <Link
          href="/"
          className="mt-10 font-mono text-[12px] uppercase tracking-[0.2em] text-ink"
        >
          {t("notFound.back")}
        </Link>
      </main>
      <Footer />
    </>
  );
}
