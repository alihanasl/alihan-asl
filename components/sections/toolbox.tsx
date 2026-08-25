"use client";

import { useState } from "react";
import { SectionLabel } from "@/components/ui/section-label";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/cn";
import { useLocale } from "@/components/i18n/locale-provider";
import { useCms } from "@/components/cms/cms-provider";
import { pickLocale } from "@/lib/cms/types";

export function Toolbox() {
  const { t, locale } = useLocale();
  const { skills } = useCms();
  const [active, setActive] = useState<string | null>(null);
  const activeSkill = skills.find((skill) => skill.id === active);

  return (
    <section
      className="border-t border-line"
      aria-labelledby="toolbox-heading"
    >
      <div className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-28 lg:px-14">
        <Reveal>
          <div className="mb-12 flex flex-col gap-4 md:mb-16 md:flex-row md:items-end md:justify-between">
            <div>
              <SectionLabel index="05" label={t("toolbox.index")} />
              <h2
                id="toolbox-heading"
                className="font-display mt-4 text-[clamp(2rem,5vw,3.4rem)] leading-[0.95] tracking-[-0.04em]"
              >
                {t("toolbox.title")}
              </h2>
            </div>
            <p className="min-h-[2.5rem] max-w-sm text-sm leading-relaxed text-graphite md:text-right">
              {activeSkill
                ? pickLocale(locale, activeSkill.noteTr, activeSkill.noteEn)
                : t("toolbox.copy")}
            </p>
          </div>
        </Reveal>

        <Reveal>
          <ul className="grid grid-cols-1 border-t border-line sm:grid-cols-2">
            {skills.map((skill) => {
              const isActive = active === skill.id;
              const label = skill.name;

              return (
                <li key={skill.id} className="border-b border-line sm:odd:border-r">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between px-0 py-5 text-left transition-colors duration-300 hover:text-ink"
                    onMouseEnter={() => setActive(skill.id)}
                    onMouseLeave={() => setActive(null)}
                    onFocus={() => setActive(skill.id)}
                    onBlur={() => setActive(null)}
                    onClick={() =>
                      setActive((current) =>
                        current === skill.id ? null : skill.id,
                      )
                    }
                  >
                    <span
                      className={cn(
                        "font-mono text-[12px] uppercase tracking-[0.18em] transition-colors duration-300",
                        isActive ? "text-ink" : "text-graphite",
                      )}
                    >
                      {label}
                    </span>
                    <span
                      className={cn(
                        "h-px w-8 transition-all duration-300",
                        isActive ? "w-14 bg-accent" : "bg-line-strong",
                      )}
                      aria-hidden
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
