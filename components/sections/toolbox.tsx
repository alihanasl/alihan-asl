"use client";

import { useState } from "react";
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
    <section aria-labelledby="toolbox-heading">
      <div className="site-pad mx-auto max-w-[1680px] py-24 md:py-32">
        <Reveal>
          <p className="text-[11px] uppercase tracking-[0.22em] text-stone">
            {t("toolbox.index")}
          </p>
          <h2
            id="toolbox-heading"
            className="font-display mt-4 text-[clamp(2.2rem,6vw,4.4rem)] leading-[0.9] tracking-[-0.05em]"
          >
            {t("toolbox.title")}
          </h2>
          <p className="mt-6 min-h-[2.5rem] max-w-md text-[0.98rem] leading-relaxed text-graphite">
            {activeSkill
              ? pickLocale(locale, activeSkill.noteTr, activeSkill.noteEn)
              : t("toolbox.copy")}
          </p>
        </Reveal>

        <Reveal>
          <ul className="mt-14 flex flex-wrap gap-x-8 gap-y-4">
            {skills.map((skill) => {
              const isActive = active === skill.id;
              return (
                <li key={skill.id}>
                  <button
                    type="button"
                    className={cn(
                      "text-[clamp(1.4rem,3vw,2rem)] tracking-[-0.04em] transition-opacity duration-300",
                      isActive ? "text-ink" : "text-ink/35 hover:text-ink",
                    )}
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
                    {skill.name}
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
