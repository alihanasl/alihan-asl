"use client";

import Link from "next/link";
import { SectionLabel } from "@/components/ui/section-label";
import { Reveal } from "@/components/ui/reveal";
import { useLocale } from "@/components/i18n/locale-provider";
import type { MessageKey } from "@/lib/i18n/translate";

const principles = ["see", "root", "beyond"] as const;

export function HowIThink({ index = "05" }: { index?: string }) {
  const { t } = useLocale();

  return (
    <section
      id="think"
      className="scroll-mt-24 border-t border-line"
      aria-labelledby="think-heading"
    >
      <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-28 lg:px-14">
        <Reveal>
          <div className="mb-12 flex flex-col gap-4 md:mb-16 md:flex-row md:items-end md:justify-between">
            <div>
              <SectionLabel index={index} label={t("think.index")} />
              <h2
                id="think-heading"
                className="font-display mt-4 max-w-xl text-[clamp(2rem,5vw,3.4rem)] leading-[0.95] tracking-[-0.04em]"
              >
                {t("think.title")}
              </h2>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-graphite md:pb-2 md:text-right">
              {t("think.copy")}
            </p>
          </div>
        </Reveal>

        <h3 className="mb-8 font-display text-[clamp(1.4rem,2.4vw,1.85rem)] leading-[1.15] tracking-[-0.03em] text-ink">
          {t("think.group")}
        </h3>
        <ul className="grid gap-10 border-t border-line pt-10 md:grid-cols-3 md:gap-12">
          {principles.map((item, itemIndex) => (
            <Reveal key={item} delay={itemIndex * 0.05}>
              <li>
                <h4 className="text-[0.95rem] leading-snug tracking-[-0.02em] text-ink">
                  {t(`think.${item}` as MessageKey)}
                </h4>
                <p className="mt-4 max-w-sm text-sm leading-relaxed text-graphite">
                  {t(`think.${item}Copy` as MessageKey)}
                </p>
              </li>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={0.12}>
          <Link
            href="/about"
            className="mt-12 inline-block font-mono text-[11px] uppercase tracking-[0.2em] text-ink transition-opacity hover:opacity-50"
          >
            {t("think.more")}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
