"use client";

import Link from "next/link";
import { SectionLabel } from "@/components/ui/section-label";
import { Reveal } from "@/components/ui/reveal";
import { useLocale } from "@/components/i18n/locale-provider";
import { useCms } from "@/components/cms/cms-provider";
import { pickLocale } from "@/lib/cms/types";
import type { MessageKey } from "@/lib/i18n/translate";

const impact = [
  ["impactOpsTitle", "impactOpsCopy"],
  ["impactCostTitle", "impactCostCopy"],
  ["impactAutoTitle", "impactAutoCopy"],
  ["impactProcessTitle", "impactProcessCopy"],
] as const;

const lens = [
  ["peopleTitle", "peopleCopy"],
  ["techTitle", "techCopy"],
  ["businessTitle", "businessCopy"],
] as const;

const leadership = [
  "leadershipTeam",
  "leadershipOps",
  "leadershipProjects",
  "leadershipCrisis",
  "leadershipProcess",
  "leadershipVendor",
] as const;

export function AboutPage() {
  const { t, locale } = useLocale();
  const { experiences } = useCms();

  return (
    <article className="pt-16 md:pt-[4.25rem]">
      <header className="mx-auto max-w-[1400px] px-5 pt-16 md:px-10 md:pt-24 lg:px-14">
        <Reveal>
          <SectionLabel index="01" label={t("about.kicker")} />
          <h1 className="font-display mt-6 max-w-4xl text-[clamp(2.6rem,7vw,5.4rem)] leading-[0.92] tracking-[-0.045em]">
            {t("about.title")}
          </h1>
          <p className="mt-8 max-w-xl text-[1.05rem] leading-relaxed text-graphite">
            {t("about.lead")}
          </p>
        </Reveal>
      </header>

      <section
        className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-28 lg:px-14"
        aria-labelledby="career-heading"
      >
        <Reveal>
          <SectionLabel index="02" label={t("about.careerKicker")} />
          <h2
            id="career-heading"
            className="font-display mt-4 text-[clamp(2rem,5vw,3.4rem)] leading-[0.95] tracking-[-0.04em]"
          >
            {t("about.careerTitle")}
          </h2>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-graphite">
            {t("about.careerCopy")}
          </p>
        </Reveal>
        <ul className="mt-12 border-t border-line">
          {experiences.map((item) => (
            <li
              key={item.id}
              className="grid gap-2 border-b border-line py-6 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:items-baseline md:gap-10"
            >
              <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-ink">
                {item.company ||
                  pickLocale(locale, item.fieldTr, item.fieldEn)}
              </p>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-stone">
                  {pickLocale(locale, item.contextTr, item.contextEn) ||
                    pickLocale(locale, item.fieldTr, item.fieldEn)}
                </p>
                {pickLocale(locale, item.descriptionTr, item.descriptionEn) ? (
                  <p className="mt-3 max-w-lg text-sm leading-relaxed text-graphite">
                    {pickLocale(locale, item.descriptionTr, item.descriptionEn)}
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section
        className="border-t border-line"
        aria-labelledby="leadership-heading"
      >
        <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-28 lg:px-14">
          <Reveal>
            <SectionLabel index="03" label={t("about.leadershipKicker")} />
            <h2
              id="leadership-heading"
              className="font-display mt-4 max-w-xl text-[clamp(2rem,5vw,3.4rem)] leading-[0.95] tracking-[-0.04em]"
            >
              {t("about.leadershipTitle")}
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-graphite">
              {t("about.leadershipCopy")}
            </p>
          </Reveal>
          <ul className="mt-12 grid gap-x-10 gap-y-4 border-t border-line pt-8 sm:grid-cols-2 lg:grid-cols-3">
            {leadership.map((key) => (
              <li
                key={key}
                className="font-mono text-[12px] uppercase tracking-[0.18em] text-ink"
              >
                {t(`about.${key}` as MessageKey)}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        className="border-t border-line"
        aria-labelledby="impact-heading"
      >
        <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-28 lg:px-14">
          <Reveal>
            <SectionLabel index="04" label={t("about.impactKicker")} />
            <h2
              id="impact-heading"
              className="font-display mt-4 text-[clamp(2rem,5vw,3.4rem)] leading-[0.95] tracking-[-0.04em]"
            >
              {t("about.impactTitle")}
            </h2>
          </Reveal>
          <ul className="mt-12 grid gap-10 border-t border-line pt-10 md:grid-cols-2">
            {impact.map(([title, copy], index) => (
              <Reveal key={title} delay={index * 0.04}>
                <li>
                  <h3 className="font-mono text-[12px] uppercase tracking-[0.18em] text-ink">
                    {t(`about.${title}` as MessageKey)}
                  </h3>
                  <p className="mt-4 max-w-md text-sm leading-relaxed text-graphite">
                    {t(`about.${copy}` as MessageKey)}
                  </p>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-line" aria-labelledby="lens-heading">
        <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-28 lg:px-14">
          <Reveal>
            <SectionLabel index="05" label={t("about.lensKicker")} />
            <h2
              id="lens-heading"
              className="font-display mt-4 max-w-3xl text-[clamp(2rem,5vw,3.4rem)] leading-[0.95] tracking-[-0.04em]"
            >
              {t("about.lensTitle")}
            </h2>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-graphite">
              {t("about.lensCopy")}
            </p>
          </Reveal>
          <ul className="mt-12 grid gap-10 border-t border-line pt-10 md:grid-cols-3">
            {lens.map(([title, copy]) => (
              <li key={title}>
                <h3 className="font-mono text-[12px] uppercase tracking-[0.18em] text-ink">
                  {t(`about.${title}` as MessageKey)}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-graphite">
                  {t(`about.${copy}` as MessageKey)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        className="border-t border-line"
        aria-labelledby="philosophy-heading"
      >
        <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-28 lg:px-14">
          <Reveal>
            <SectionLabel index="06" label={t("about.philosophyKicker")} />
            <h2
              id="philosophy-heading"
              className="font-display mt-4 max-w-xl text-[clamp(2rem,5vw,3.4rem)] leading-[0.95] tracking-[-0.04em]"
            >
              {t("about.philosophyTitle")}
            </h2>
            <p className="mt-8 max-w-xl font-display text-[clamp(1.4rem,2.6vw,2rem)] leading-[1.25] tracking-[-0.03em] text-ink">
              {t("about.philosophyCopy")}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-line" aria-labelledby="beyond-heading">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-5 py-12 md:flex-row md:items-baseline md:justify-between md:px-10 md:py-14 lg:px-14">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone">
              {t("about.beyondKicker")}
            </p>
            <h2
              id="beyond-heading"
              className="mt-3 font-mono text-[12px] uppercase tracking-[0.18em] text-ink"
            >
              {t("about.beyondTitle")}
            </h2>
          </div>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-stone">
            {t("about.beyondCopy")}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[1400px] px-5 pb-20 md:px-10 md:pb-28 lg:px-14">
        <Link
          href="/#contact"
          className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink transition-opacity hover:opacity-50"
        >
          {t("nav.contact")}
        </Link>
      </div>
    </article>
  );
}
