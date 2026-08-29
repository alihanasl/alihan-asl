"use client";

import Link from "next/link";
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
    <article className="pt-14 md:pt-16">
      <header className="site-pad mx-auto max-w-[1680px] pt-16 md:pt-24">
        <Reveal>
          <p className="text-[11px] uppercase tracking-[0.22em] text-stone">
            {t("about.kicker")}
          </p>
          <h1 className="font-display mt-5 max-w-4xl text-[clamp(2.8rem,8vw,6.4rem)] leading-[0.88] tracking-[-0.055em]">
            {t("about.title")}
          </h1>
          <p className="mt-8 max-w-xl text-[1.08rem] leading-relaxed text-graphite">
            {t("about.lead")}
          </p>
        </Reveal>
      </header>

      <section
        className="site-pad mx-auto max-w-[1680px] py-20 md:py-28"
        aria-labelledby="career-heading"
      >
        <Reveal>
          <p className="text-[11px] uppercase tracking-[0.22em] text-stone">
            {t("about.careerKicker")}
          </p>
          <h2
            id="career-heading"
            className="font-display mt-4 text-[clamp(2.2rem,6vw,4.4rem)] leading-[0.9] tracking-[-0.05em]"
          >
            {t("about.careerTitle")}
          </h2>
          <p className="mt-6 max-w-md text-[0.98rem] leading-relaxed text-graphite">
            {t("about.careerCopy")}
          </p>
        </Reveal>
        <ul className="mt-14">
          {experiences.map((item) => (
            <li
              key={item.id}
              className="grid gap-2 py-7 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:items-baseline md:gap-16"
            >
              <p className="text-[15px] tracking-[-0.02em] text-ink">
                {item.company ||
                  pickLocale(locale, item.fieldTr, item.fieldEn)}
              </p>
              <div>
                <p className="text-[12px] uppercase tracking-[0.16em] text-stone">
                  {pickLocale(locale, item.contextTr, item.contextEn) ||
                    pickLocale(locale, item.fieldTr, item.fieldEn)}
                </p>
                {pickLocale(locale, item.descriptionTr, item.descriptionEn) ? (
                  <p className="mt-3 max-w-lg text-[0.98rem] leading-relaxed text-graphite">
                    {pickLocale(locale, item.descriptionTr, item.descriptionEn)}
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="leadership-heading">
        <div className="site-pad mx-auto max-w-[1680px] py-20 md:py-28">
          <Reveal>
            <p className="text-[11px] uppercase tracking-[0.22em] text-stone">
              {t("about.leadershipKicker")}
            </p>
            <h2
              id="leadership-heading"
              className="font-display mt-4 max-w-xl text-[clamp(2.2rem,6vw,4.4rem)] leading-[0.9] tracking-[-0.05em]"
            >
              {t("about.leadershipTitle")}
            </h2>
            <p className="mt-6 max-w-md text-[0.98rem] leading-relaxed text-graphite">
              {t("about.leadershipCopy")}
            </p>
          </Reveal>
          <ul className="mt-14 max-w-3xl space-y-3">
            {leadership.map((key) => (
              <li
                key={key}
                className="font-display text-[clamp(1.5rem,3vw,2.2rem)] leading-[1.1] tracking-[-0.04em] text-ink"
              >
                {t(`about.${key}` as MessageKey)}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="impact-heading">
        <div className="site-pad mx-auto max-w-[1680px] py-20 md:py-28">
          <Reveal>
            <p className="text-[11px] uppercase tracking-[0.22em] text-stone">
              {t("about.impactKicker")}
            </p>
            <h2
              id="impact-heading"
              className="font-display mt-4 text-[clamp(2.2rem,6vw,4.4rem)] leading-[0.9] tracking-[-0.05em]"
            >
              {t("about.impactTitle")}
            </h2>
          </Reveal>
          <ul className="mt-16 max-w-3xl space-y-16">
            {impact.map(([title, copy]) => (
              <Reveal key={title}>
                <li>
                  <h3 className="font-display text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.1] tracking-[-0.04em] text-ink">
                    {t(`about.${title}` as MessageKey)}
                  </h3>
                  <p className="mt-4 max-w-xl text-[1.02rem] leading-relaxed text-graphite">
                    {t(`about.${copy}` as MessageKey)}
                  </p>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="lens-heading">
        <div className="site-pad mx-auto max-w-[1680px] py-20 md:py-28">
          <Reveal>
            <p className="text-[11px] uppercase tracking-[0.22em] text-stone">
              {t("about.lensKicker")}
            </p>
            <h2
              id="lens-heading"
              className="font-display mt-4 max-w-3xl text-[clamp(2.2rem,6vw,4.4rem)] leading-[0.9] tracking-[-0.05em]"
            >
              {t("about.lensTitle")}
            </h2>
            <p className="mt-6 max-w-xl text-[0.98rem] leading-relaxed text-graphite">
              {t("about.lensCopy")}
            </p>
          </Reveal>
          <ul className="mt-16 max-w-3xl space-y-12">
            {lens.map(([title, copy]) => (
              <li key={title}>
                <h3 className="font-display text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.1] tracking-[-0.04em] text-ink">
                  {t(`about.${title}` as MessageKey)}
                </h3>
                <p className="mt-4 text-[1.02rem] leading-relaxed text-graphite">
                  {t(`about.${copy}` as MessageKey)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="philosophy-heading">
        <div className="site-pad mx-auto flex min-h-[70svh] max-w-[1680px] flex-col justify-center py-20 md:py-28">
          <Reveal>
            <p className="text-[11px] uppercase tracking-[0.22em] text-stone">
              {t("about.philosophyKicker")}
            </p>
            <h2
              id="philosophy-heading"
              className="font-display mt-4 max-w-xl text-[clamp(2.2rem,6vw,4.4rem)] leading-[0.9] tracking-[-0.05em]"
            >
              {t("about.philosophyTitle")}
            </h2>
            <p className="font-display mt-10 max-w-2xl text-[clamp(1.6rem,3.2vw,2.6rem)] leading-[1.2] tracking-[-0.04em] text-ink">
              {t("about.philosophyCopy")}
            </p>
          </Reveal>
        </div>
      </section>

      <div className="site-pad mx-auto max-w-[1680px] pb-20 md:pb-28">
        <Link
          href="/#contact"
          className="text-[15px] tracking-[-0.02em] text-ink transition-opacity hover:opacity-40"
        >
          {t("nav.contact")}
        </Link>
      </div>
    </article>
  );
}
