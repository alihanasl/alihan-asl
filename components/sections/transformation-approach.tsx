"use client";

import { SectionLabel } from "@/components/ui/section-label";
import { Reveal } from "@/components/ui/reveal";
import { useLocale } from "@/components/i18n/locale-provider";
import type { MessageKey } from "@/lib/i18n/translate";

const steps = [
  "observe",
  "identify",
  "design",
  "automate",
  "improve",
] as const;

export function TransformationApproach({ index = "03" }: { index?: string }) {
  const { t } = useLocale();

  return (
    <section
      id="approach"
      className="scroll-mt-24"
      aria-labelledby="approach-heading"
    >
      <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-28 lg:px-14">
        <Reveal>
          <div className="mb-12 flex flex-col gap-4 md:mb-16 md:flex-row md:items-end md:justify-between">
            <div>
              <SectionLabel index={index} label={t("approach.index")} />
              <h2
                id="approach-heading"
                className="font-display mt-4 max-w-xl text-[clamp(2rem,5vw,3.4rem)] leading-[0.95] tracking-[-0.04em]"
              >
                {t("approach.title")}
              </h2>
            </div>
            <p className="max-w-xs font-mono text-[11px] uppercase tracking-[0.16em] text-stone md:pb-2 md:text-right">
              {t("approach.copy")}
            </p>
          </div>
        </Reveal>

        <ol className="border-t border-line md:grid md:grid-cols-5">
          {steps.map((step, stepIndex) => (
            <Reveal key={step} delay={stepIndex * 0.04}>
              <li className="border-b border-line py-8 md:border-b-0 md:border-r md:px-5 md:py-10 md:first:pl-0 md:last:border-r-0 md:last:pr-0">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone">
                  {String(stepIndex + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-4 font-mono text-[12px] uppercase tracking-[0.18em] text-ink">
                  {t(`approach.${step}` as MessageKey)}
                </h3>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-graphite">
                  {t(`approach.${step}Copy` as MessageKey)}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
