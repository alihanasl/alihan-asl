"use client";

import { Reveal } from "@/components/ui/reveal";
import { useLocale } from "@/components/i18n/locale-provider";
import { useCms } from "@/components/cms/cms-provider";
import { pickLocale } from "@/lib/cms/types";
import type { MessageKey } from "@/lib/i18n/translate";

export function DigitalLab() {
  const { t, locale } = useLocale();
  const { experiments } = useCms();

  return (
    <section
      id="lab"
      className="lab-scope relative scroll-mt-24 bg-lab text-paper"
      aria-labelledby="lab-heading"
    >
      <div className="site-pad mx-auto max-w-[1680px] py-24 md:py-36 lg:py-44">
        <Reveal>
          <p className="text-[11px] uppercase tracking-[0.22em] text-lab-muted">
            {t("lab.index")}
          </p>
          <h2
            id="lab-heading"
            className="font-display mt-4 text-[clamp(2.4rem,7vw,5.4rem)] leading-[0.88] tracking-[-0.055em]"
          >
            {t("lab.title")}
          </h2>
          <p className="mt-6 max-w-md text-[0.98rem] leading-relaxed text-lab-muted">
            {t("lab.copy")}
          </p>
        </Reveal>

        <div className="mt-20 md:mt-28">
          {experiments.map((experiment, index) => {
            const chapters = (
              [
                ["problem", experiment.problemTr, experiment.problemEn],
                ["idea", experiment.ideaTr, experiment.ideaEn],
                ["build", experiment.buildTr, experiment.buildEn],
              ] as const
            )
              .map(([key, tr, en]) => ({
                label: t(`project.${key}` as MessageKey),
                body: pickLocale(locale, tr ?? "", en ?? ""),
              }))
              .filter((chapter) => chapter.body.trim());

            return (
              <Reveal key={experiment.id} delay={index * 0.04}>
                <article className="border-t border-lab-line py-12 md:py-16">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-lab-muted">
                    {experiment.ref} · {t(`lab.${experiment.status}` as MessageKey)}
                  </p>
                  <h3 className="font-display mt-5 text-[clamp(2.2rem,7vw,5.6rem)] leading-[0.86] tracking-[-0.055em]">
                    {pickLocale(locale, experiment.nameTr, experiment.nameEn)}
                  </h3>
                  <p className="mt-6 max-w-lg text-[1.02rem] leading-relaxed text-lab-muted">
                    {pickLocale(locale, experiment.noteTr, experiment.noteEn)}
                  </p>
                  {chapters.length ? (
                    <div className="mt-12 max-w-xl space-y-10">
                      {chapters.map((chapter) => (
                        <section key={chapter.label}>
                          <h4 className="text-[11px] uppercase tracking-[0.2em] text-lab-muted">
                            {chapter.label}
                          </h4>
                          <p className="mt-3 text-[0.95rem] leading-relaxed text-paper/75">
                            {chapter.body}
                          </p>
                        </section>
                      ))}
                    </div>
                  ) : null}
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
