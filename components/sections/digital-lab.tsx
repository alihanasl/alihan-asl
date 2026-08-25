"use client";

import { SectionLabel } from "@/components/ui/section-label";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/cn";
import { useLocale } from "@/components/i18n/locale-provider";
import { useCms } from "@/components/cms/cms-provider";
import { pickLocale } from "@/lib/cms/types";
import type { MessageKey } from "@/lib/i18n/translate";

export function DigitalLab({ index = "03" }: { index?: string }) {
  const { t, locale } = useLocale();
  const { experiments } = useCms();

  return (
    <section
      id="lab"
      className="lab-scope relative scroll-mt-24 overflow-hidden bg-lab text-paper"
      aria-labelledby="lab-heading"
    >
      <div aria-hidden className="grid-lab pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32 lg:px-14 lg:py-40">
        <Reveal>
          <div className="mb-16 flex flex-col gap-6 md:mb-20 md:flex-row md:items-end md:justify-between">
            <div>
              <SectionLabel index={index} label={t("lab.index")} tone="lab" />
              <h2
                id="lab-heading"
                className="font-display mt-4 text-[clamp(2.8rem,8vw,6rem)] leading-[0.9] tracking-[-0.045em]"
              >
                {t("lab.title")}
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-lab-muted md:pb-2">
              {t("lab.copy")}
            </p>
          </div>
        </Reveal>

        <div className="border-t border-lab-line">
          <div className="hidden grid-cols-[1fr_0.7fr_7rem] gap-6 py-4 font-mono text-[11px] uppercase tracking-[0.2em] text-lab-muted md:grid">
            <span>{t("lab.experiment")}</span>
            <span>{t("lab.status")}</span>
            <span className="text-right">{t("lab.ref")}</span>
          </div>

          {experiments.map((experiment, index) => (
            <Reveal key={experiment.id} delay={index * 0.05}>
              <article className="grid gap-3 border-t border-lab-line py-8 md:grid-cols-[1fr_0.7fr_7rem] md:items-baseline md:gap-6 md:py-10">
                <div>
                  <h3 className="font-display text-[clamp(1.7rem,4vw,2.6rem)] leading-none tracking-[-0.03em]">
                    {pickLocale(locale, experiment.nameTr, experiment.nameEn)}
                  </h3>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-lab-muted">
                    {pickLocale(locale, experiment.noteTr, experiment.noteEn)}
                  </p>
                </div>
                <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em]">
                  <span
                    className={cn(
                      "inline-block h-1.5 w-1.5",
                      experiment.status === "active" && "bg-accent",
                      experiment.status === "building" && "bg-paper",
                      experiment.status === "experimental" && "bg-lab-muted",
                    )}
                    aria-hidden
                  />
                  {t(`lab.${experiment.status}` as MessageKey)}
                </p>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-lab-muted md:text-right">
                  {experiment.ref}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
