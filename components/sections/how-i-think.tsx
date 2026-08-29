"use client";

import { Reveal } from "@/components/ui/reveal";
import { useLocale } from "@/components/i18n/locale-provider";
import type { MessageKey } from "@/lib/i18n/translate";

const principles = ["see", "root", "beyond"] as const;

export function HowIThink() {
  const { t } = useLocale();

  return (
    <section
      id="think"
      className="scroll-mt-24"
      aria-labelledby="think-heading"
    >
      <div className="site-pad mx-auto max-w-[1680px] py-24 md:py-32">
        <Reveal>
          <p className="text-[11px] uppercase tracking-[0.22em] text-stone">
            {t("think.index")}
          </p>
          <h2
            id="think-heading"
            className="font-display mt-4 max-w-xl text-[clamp(2.4rem,6vw,4.8rem)] leading-[0.9] tracking-[-0.05em]"
          >
            {t("think.title")}
          </h2>
          <p className="mt-6 max-w-lg text-[1.05rem] leading-relaxed text-graphite">
            {t("think.copy")}
          </p>
          <p className="mt-10 text-[12px] uppercase tracking-[0.18em] text-stone">
            {t("think.group")}
          </p>
        </Reveal>
      </div>

      {principles.map((item) => (
        <Reveal key={item}>
          <article className="site-pad mx-auto flex min-h-[70svh] max-w-[1680px] flex-col justify-center py-16 md:min-h-[80svh] md:py-24">
            <h3 className="font-display max-w-[16ch] text-[clamp(2.6rem,8vw,6.8rem)] leading-[0.86] tracking-[-0.055em] text-ink">
              {t(`think.${item}` as MessageKey)}
            </h3>
            <p className="mt-8 max-w-xl text-[1.08rem] leading-[1.65] text-graphite md:text-lg">
              {t(`think.${item}Copy` as MessageKey)}
            </p>
          </article>
        </Reveal>
      ))}
    </section>
  );
}
