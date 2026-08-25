"use client";

import { SectionLabel } from "@/components/ui/section-label";
import { Reveal } from "@/components/ui/reveal";
import { useLocale } from "@/components/i18n/locale-provider";
import { useCms } from "@/components/cms/cms-provider";
import { pickLocale } from "@/lib/cms/types";
import type { SiteSection } from "@/lib/cms/layout";
import { SectionButtons } from "@/components/site/section-buttons";

export function About({
  section,
  index = "04",
}: {
  section?: SiteSection;
  index?: string;
}) {
  const { t, locale } = useLocale();
  const { experiences } = useCms();

  return (
    <section
      id="about"
      className="scroll-mt-24"
      aria-labelledby="about-heading"
    >
      <div className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32 lg:px-14 lg:py-40">
        <Reveal>
          <SectionLabel index={index} label={t("about.index")} />
        </Reveal>

        <div className="mt-8 grid gap-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-24">
          <Reveal>
            <h2
              id="about-heading"
              className="font-display text-[clamp(2.2rem,5.4vw,4.4rem)] leading-[1.02] tracking-[-0.04em] text-ink"
            >
              {t("about.manifestoOne")}
              <span className="mt-2 block text-graphite">
                {t("about.manifestoTwo")}
              </span>
            </h2>
          </Reveal>

          <div className="flex flex-col justify-between gap-16">
            <Reveal delay={0.08}>
              <div>
                {section?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={section.image}
                    alt=""
                    className="mb-8 max-h-64 w-full max-w-sm object-cover"
                  />
                ) : null}
                <p className="max-w-md text-[1.05rem] leading-[1.7] text-graphite">
                  {t("about.copy")}
                </p>
                <SectionButtons buttons={section?.buttons ?? []} className="mt-8" />
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <ul className="border-t border-line">
                {experiences.map((item) => (
                  <li
                    key={item.id}
                    className="flex flex-col gap-1 border-b border-line py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
                  >
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink">
                      {pickLocale(locale, item.fieldTr, item.fieldEn)}
                    </span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-stone">
                      {pickLocale(locale, item.contextTr, item.contextEn)}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
