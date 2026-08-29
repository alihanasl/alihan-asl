"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { ClipReveal } from "@/components/ui/reveal";
import { useLocale } from "@/components/i18n/locale-provider";
import { useCms } from "@/components/cms/cms-provider";
import { splitName } from "@/lib/cms/present";
import { SectionButtons } from "@/components/site/section-buttons";
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

  const shiftX = (pointer.x - 0.5) * 10;
  const shiftY = (pointer.y - 0.5) * 8;

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100svh] flex-col pt-14 md:pt-16"
      aria-label={t("a11y.intro")}
    >
      <div className="site-pad relative mx-auto flex w-full max-w-[1680px] flex-1 flex-col justify-between py-8 md:py-10">
        <p className="fade-rise text-[11px] uppercase tracking-[0.22em] text-stone">
          {t("hero.index")}
        </p>

        <div className="py-8 md:py-4">
          <h1
            className="font-display text-[clamp(4.6rem,18vw,13.5rem)] leading-[0.78] tracking-[-0.065em] text-ink"
            style={
              reduce
                ? undefined
                : {
                    transform: `translate3d(${shiftX}px, ${shiftY}px, 0)`,
                    transition: "transform 800ms cubic-bezier(0.22, 1, 0.36, 1)",
                  }
            }
          >
            <ClipReveal>
              <span className="block">{first}</span>
            </ClipReveal>
            {last ? (
              <ClipReveal delay={0.1}>
                <span className="block">{last}</span>
              </ClipReveal>
            ) : null}
          </h1>

          <p className="fade-rise mt-8 max-w-xl text-[1.05rem] leading-[1.45] tracking-[-0.02em] text-graphite md:mt-12 md:max-w-2xl md:text-[1.35rem] md:leading-[1.4]">
            {t("hero.tagline")}
          </p>
          <SectionButtons buttons={section?.buttons ?? []} className="mt-8" />
        </div>

        <a
          href={t("hero.scrollHref") || "#system"}
          className="group flex w-fit items-center gap-4 text-[11px] uppercase tracking-[0.2em] text-stone transition-colors duration-300 hover:text-ink"
        >
          {t("hero.scroll")}
          <span
            className="relative h-8 w-px overflow-hidden bg-line-strong"
            aria-hidden
          >
            <span className="scroll-tick absolute inset-x-0 top-0 h-2 bg-ink" />
          </span>
        </a>
      </div>
    </section>
  );
}
