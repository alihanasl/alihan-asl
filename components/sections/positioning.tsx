"use client";

import { SectionLabel } from "@/components/ui/section-label";
import { Reveal } from "@/components/ui/reveal";
import { useLocale } from "@/components/i18n/locale-provider";

export function Positioning({ index = "01" }: { index?: string }) {
  const { t } = useLocale();

  return (
    <section
      id="position"
      className="scroll-mt-24 border-t border-line"
      aria-labelledby="position-copy"
    >
      <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-20 lg:px-14">
        <Reveal>
          <SectionLabel index={index} label={t("position.index")} />
          <p
            id="position-copy"
            className="font-display mt-8 max-w-3xl text-[clamp(1.6rem,3.4vw,2.6rem)] leading-[1.2] tracking-[-0.03em] text-ink"
          >
            {t("position.copy")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
