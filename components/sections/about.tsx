"use client";

import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import { useLocale } from "@/components/i18n/locale-provider";
import type { SiteSection } from "@/lib/cms/layout";
import { SectionButtons } from "@/components/site/section-buttons";

export function About({
  section,
}: {
  section?: SiteSection;
  index?: string;
}) {
  const { t } = useLocale();

  return (
    <section
      id="about"
      className="scroll-mt-24"
      aria-labelledby="about-heading"
    >
      <div className="site-pad mx-auto max-w-[1680px] py-24 md:py-32">
        <Reveal>
          <p className="text-[11px] uppercase tracking-[0.22em] text-stone">
            {t("about.kicker")}
          </p>
          <h2
            id="about-heading"
            className="font-display mt-5 max-w-3xl text-[clamp(2.6rem,7vw,5.4rem)] leading-[0.88] tracking-[-0.055em]"
          >
            {t("about.title")}
          </h2>
          <p className="mt-8 max-w-md text-[1.05rem] leading-[1.7] text-graphite">
            {t("about.lead")}
          </p>
          <Link
            href="/about"
            className="mt-8 inline-block text-[15px] tracking-[-0.02em] text-ink transition-opacity hover:opacity-40"
          >
            {t("think.more")}
          </Link>
          <SectionButtons buttons={section?.buttons ?? []} className="mt-8" />
        </Reveal>
      </div>
    </section>
  );
}
