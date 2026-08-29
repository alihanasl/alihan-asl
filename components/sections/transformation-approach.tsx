"use client";

import { useRef, useState } from "react";
import {
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { useLocale } from "@/components/i18n/locale-provider";
import { cn } from "@/lib/cn";
import type { MessageKey } from "@/lib/i18n/translate";

const steps = [
  "observe",
  "identify",
  "design",
  "automate",
  "improve",
] as const;

export function TransformationApproach() {
  const { t } = useLocale();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = Math.min(
      steps.length - 1,
      Math.max(0, Math.floor(value * steps.length)),
    );
    setActive((current) => (current === next ? current : next));
  });

  if (reduce) {
    return (
      <section
        id="approach"
        className="scroll-mt-24"
        aria-labelledby="approach-heading"
      >
        <div className="site-pad mx-auto max-w-[1680px] py-24 md:py-36">
          <ApproachIntro t={t} />
          <ol className="mt-20 space-y-20">
            {steps.map((step, index) => (
              <li key={step}>
                <p className="text-[11px] uppercase tracking-[0.22em] text-stone">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="font-display mt-4 text-[clamp(2.4rem,8vw,5.5rem)] leading-[0.88] tracking-[-0.055em]">
                  {t(`approach.${step}` as MessageKey)}
                </h3>
                <p className="mt-6 max-w-lg text-[1.05rem] leading-relaxed text-graphite">
                  {t(`approach.${step}Copy` as MessageKey)}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  return (
    <section
      id="approach"
      className="scroll-mt-24"
      aria-labelledby="approach-heading"
    >
      <div className="site-pad mx-auto max-w-[1680px] pt-16 md:pt-24">
        <ApproachIntro t={t} />
      </div>

      <div
        ref={ref}
        className="relative mt-8"
        style={{ height: `${steps.length * 100}vh` }}
      >
        <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
          <div className="site-pad mx-auto grid w-full max-w-[1680px] items-center gap-10 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,1fr)] lg:gap-20">
            <ol className="hidden flex-col gap-3 lg:flex" aria-hidden>
              {steps.map((step, index) => (
                <li
                  key={step}
                  className={cn(
                    "text-[13px] tracking-[-0.02em] transition-colors duration-500",
                    index === active ? "text-ink" : "text-stone/70",
                  )}
                >
                  {String(index + 1).padStart(2, "0")}{" "}
                  {t(`approach.${step}` as MessageKey)}
                </li>
              ))}
            </ol>

            <div className="relative min-h-[280px] md:min-h-[420px]" aria-live="polite">
              {steps.map((step, index) => {
                const isActive = index === active;
                return (
                  <div
                    key={step}
                    className={cn(
                      "transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
                      isActive
                        ? "relative opacity-100"
                        : "pointer-events-none absolute inset-0 opacity-0",
                    )}
                    aria-hidden={!isActive}
                  >
                    <p className="text-[11px] uppercase tracking-[0.24em] text-stone">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3 className="font-display mt-5 text-[clamp(3.2rem,11vw,8.5rem)] leading-[0.82] tracking-[-0.06em] text-ink">
                      {t(`approach.${step}` as MessageKey)}
                    </h3>
                    <p className="mt-8 max-w-md text-[1.05rem] leading-relaxed text-graphite md:text-lg">
                      {t(`approach.${step}Copy` as MessageKey)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ApproachIntro({ t }: { t: (key: MessageKey) => string }) {
  return (
    <div className="max-w-2xl">
      <p className="text-[11px] uppercase tracking-[0.22em] text-stone">
        {t("approach.index")}
      </p>
      <h2
        id="approach-heading"
        className="font-display mt-4 text-[clamp(2.2rem,5.5vw,4.2rem)] leading-[0.92] tracking-[-0.05em]"
      >
        {t("approach.title")}
      </h2>
      <p className="mt-6 text-[1.02rem] leading-relaxed text-graphite">
        {t("approach.copy")}
      </p>
    </div>
  );
}
