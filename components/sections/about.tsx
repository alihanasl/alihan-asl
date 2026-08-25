"use client";

import Link from "next/link";
import { SectionLabel } from "@/components/ui/section-label";
import { Reveal } from "@/components/ui/reveal";
import { useLocale } from "@/components/i18n/locale-provider";
import type { SiteSection } from "@/lib/cms/layout";
import { SectionButtons } from "@/components/site/section-buttons";

export function About({
  section,
  index = "04",
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
      <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-28 lg:px-14">
        <Reveal>
          <SectionLabel index={index} label={t("about.kicker")} />
        </Reveal>
        <Reveal delay={0.05}>
          <h2
            id="about-heading"
            className="font-display mt-6 max-w-3xl text-[clamp(2.4rem,7vw,4.8rem)] leading-[0.92] tracking-[-0.045em]"
          >
            {t("about.title")}
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="mt-8 max-w-md text-[1.05rem] leading-[1.7] text-graphite">
            {t("about.lead")}
          </p>
          <Link
            href="/about"
            className="mt-8 inline-block font-mono text-[11px] uppercase tracking-[0.2em] text-ink transition-opacity hover:opacity-50"
          >
            {t("think.more")}
          </Link>
          <SectionButtons buttons={section?.buttons ?? []} className="mt-8" />
        </Reveal>
      </div>
    </section>
  );
}
