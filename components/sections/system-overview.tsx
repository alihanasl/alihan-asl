"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useLocale } from "@/components/i18n/locale-provider";
import { useCms } from "@/components/cms/cms-provider";
import type { MessageKey } from "@/lib/i18n/translate";
import type { Locale } from "@/lib/i18n/config";

export function SystemOverview() {
  const { t, locale } = useLocale();
  const { stats } = useCms();
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const shift = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [28, -28]);

  return (
    <section
      ref={sectionRef}
      id="system"
      className="scroll-mt-24"
      aria-labelledby="system-heading"
    >
      <div className="site-pad mx-auto max-w-[1680px] py-24 md:py-36 lg:py-44">
        <div className="mb-16 flex max-w-xl flex-col gap-4 md:mb-28">
          <p className="text-[11px] uppercase tracking-[0.22em] text-stone">
            {t("system.index")}
          </p>
          <h2
            id="system-heading"
            className="font-display text-[clamp(2.4rem,6vw,4.6rem)] leading-[0.9] tracking-[-0.05em]"
          >
            {t("system.title")}
          </h2>
          <p className="max-w-md text-[0.95rem] leading-relaxed text-graphite">
            {t("position.copy")}
          </p>
        </div>

        <motion.ul className="grid gap-x-10 gap-y-16 sm:grid-cols-2" style={{ y: shift }}>
          {stats.map((stat) => (
            <li key={stat.id} className="min-w-0">
              <StatValue
                value={stat.value}
                suffix={stat.suffix}
                display={stat.display}
                locale={locale}
              />
              <p className="mt-3 text-[12px] uppercase tracking-[0.18em] text-stone">
                {t(`system.${stat.id}` as MessageKey)}
              </p>
            </li>
          ))}
        </motion.ul>
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
  const [shown, setShown] = useState(value === null ? display || "—" : "0");

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

        const duration = 1400;
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
      { threshold: 0.35 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [display, locale, suffix, value]);

  return (
    <p
      ref={ref}
      className="font-display text-[clamp(4.2rem,12vw,9.5rem)] leading-[0.82] tracking-[-0.07em] text-ink"
    >
      {shown}
    </p>
  );
}
