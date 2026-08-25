"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { ClipReveal } from "@/components/ui/reveal";
import { useLocale } from "@/components/i18n/locale-provider";
import { useCms } from "@/components/cms/cms-provider";
import { splitName } from "@/lib/cms/present";
import { SectionButtons } from "@/components/site/section-buttons";
import { FitImage } from "@/components/site/fit-image";
import type { SiteSection } from "@/lib/cms/layout";

export function Hero({ section }: { section?: SiteSection }) {
  const { t } = useLocale();
  const { profile } = useCms();
  const { first, last } = splitName(profile.name);
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [pointer, setPointer] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const node = sectionRef.current;
    if (!node || reduce) return;

    function handleMove(event: PointerEvent) {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      setPointer({
        x: (event.clientX - rect.left) / rect.width,
        y: (event.clientY - rect.top) / rect.height,
      });
    }

    node.addEventListener("pointermove", handleMove);
    return () => node.removeEventListener("pointermove", handleMove);
  }, [reduce]);

  const shiftX = (pointer.x - 0.5) * 18;
  const shiftY = (pointer.y - 0.5) * 18;
  const roles = [t("hero.roleIt"), t("hero.roleBuilder"), t("hero.roleCreator")];

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100svh] flex-col overflow-hidden pt-16 md:pt-[4.25rem]"
      aria-label={t("a11y.intro")}
    >
      <div
        aria-hidden
        className="grid-fine pointer-events-none absolute inset-0 opacity-70"
        style={{
          transform: `translate(${shiftX}px, ${shiftY}px)`,
          transition: reduce
            ? undefined
            : "transform 700ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(520px circle at ${pointer.x * 100}% ${pointer.y * 100}%, rgb(184 67 42 / 0.05), transparent 55%)`,
        }}
      />

      <div className="relative mx-auto flex w-full max-w-[1400px] flex-1 flex-col justify-between px-5 py-10 md:px-10 md:py-14 lg:px-14">
        <div className="flex items-center justify-between">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-stone">
            {t("hero.index")}
          </p>
          <p className="hidden font-mono text-[11px] uppercase tracking-[0.22em] text-stone sm:block">
            {t("hero.lab")}
          </p>
        </div>

        <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)] lg:gap-16">
          <div>
            <h1 className="font-display text-[clamp(4.4rem,18vw,11.5rem)] leading-[0.8] tracking-[-0.05em] text-ink">
              <ClipReveal>
                <span className="block">{first}</span>
              </ClipReveal>
              {last ? (
                <ClipReveal delay={0.08}>
                  <span className="block">{last}</span>
                </ClipReveal>
              ) : null}
            </h1>
            <p className="fade-rise mt-8 max-w-md text-[1.05rem] leading-relaxed text-graphite md:mt-10 md:text-lg">
              {t("hero.tagline")}
            </p>
            <SectionButtons buttons={section?.buttons ?? []} className="mt-8" />
          </div>

          <ul className="fade-rise-late flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-6 lg:flex-col lg:items-end lg:gap-0 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
            {section?.image ? (
              <li className="w-full lg:pb-6">
                <FitImage
                  src={section.image}
                  ratio="4/5"
                  className="ml-auto max-w-xs"
                />
              </li>
            ) : null}
            {roles.map((role) => (
              <li
                key={role}
                className="font-mono text-[12px] uppercase tracking-[0.22em] text-graphite lg:py-3 lg:text-[13px]"
              >
                {role}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-end justify-between gap-6">
          <p className="hidden font-mono text-[11px] uppercase tracking-[0.18em] text-stone md:block">
            X {pointer.x.toFixed(2)}
            <span className="mx-4 text-line-strong">/</span>
            Y {pointer.y.toFixed(2)}
          </p>
          <a
            href={t("hero.scrollHref") || "#system"}
            className="group ml-auto flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.22em] text-stone transition-colors duration-300 hover:text-ink"
          >
            {t("hero.scroll")}
            <span
              className="relative h-10 w-px overflow-hidden bg-line-strong"
              aria-hidden
            >
              <span className="absolute inset-x-0 top-0 h-1/2 bg-ink transition-transform duration-500 group-hover:translate-y-full" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
