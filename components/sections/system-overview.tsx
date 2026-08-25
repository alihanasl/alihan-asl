"use client";

import { useEffect, useRef, useState } from "react";
import { SectionLabel } from "@/components/ui/section-label";
import { Reveal } from "@/components/ui/reveal";
import { useLocale } from "@/components/i18n/locale-provider";
import { useCms } from "@/components/cms/cms-provider";
import type { MessageKey } from "@/lib/i18n/translate";
import type { Locale } from "@/lib/i18n/config";

export function SystemOverview({ index = "01" }: { index?: string }) {
  const { t, locale } = useLocale();
  const { stats } = useCms();

  return (
    <section
      id="system"
      className="scroll-mt-24 border-y border-line"
      aria-labelledby="system-heading"
    >
      <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-20 lg:px-14">
        <Reveal>
          <div className="mb-12 flex flex-col gap-4 md:mb-16 md:flex-row md:items-end md:justify-between">
            <div>
              <SectionLabel index={index} label={t("system.index")} />
              <h2
                id="system-heading"
                className="font-display mt-4 text-[clamp(2rem,5vw,3.4rem)] leading-[0.95] tracking-[-0.04em]"
              >
                {t("system.title")}
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-graphite md:text-right">
              {t("system.copy")}
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 gap-px bg-line md:grid-cols-4">
          {stats.map((stat, index) => (
            <Reveal
              key={stat.id}
              delay={index * 0.06}
              className="bg-paper even:pl-5 md:even:pl-0 md:[&:nth-child(n+2)]:pl-8"
            >
              <article className="flex min-h-[148px] flex-col justify-between py-8 pr-5 md:min-h-[188px] md:py-10 md:pr-10">
                <StatValue
                  value={stat.value}
                  suffix={stat.suffix}
                  display={stat.display}
                  locale={locale}
                />
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone">
                  {t(`system.${stat.id}` as MessageKey)}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function formatStat(value: number, locale: Locale) {
  return value.toLocaleString(locale === "tr" ? "tr-TR" : "en-US");
}

function StatValue({
  value,
  suffix,
  display,
  locale,
}: {
  value: number | null;
  suffix?: string;
  display?: string;
  locale: Locale;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [shown, setShown] = useState(
    value === null ? (display || "—") : "0",
  );

  useEffect(() => {
    if (value === null) {
      setShown(display || "—");
      return;
    }

    const target = value;
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        const reduced = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        if (reduced) {
          setShown(`${formatStat(target, locale)}${suffix ?? ""}`);
          return;
        }

        const duration = 1100;
        const start = performance.now();

        function tick(now: number) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(target * eased);
          setShown(`${formatStat(current, locale)}${suffix ?? ""}`);
          if (progress < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [display, locale, suffix, value]);

  return (
    <p
      ref={ref}
      className="font-display text-[clamp(3.2rem,8vw,5.5rem)] leading-none tracking-[-0.05em] text-ink"
    >
      {shown}
    </p>
  );
}
