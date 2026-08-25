"use client";

import { SectionLabel } from "@/components/ui/section-label";
import { Reveal } from "@/components/ui/reveal";
import { ProjectPreview } from "@/components/projects/project-preview";
import { useLocale } from "@/components/i18n/locale-provider";
import { useCms } from "@/components/cms/cms-provider";
import { toDisplayProject } from "@/lib/cms/present";

export function SelectedWork() {
  const { t, locale } = useLocale();
  const { projects } = useCms();
  const items = projects.map((project, index) =>
    toDisplayProject(project, locale, index),
  );

  return (
    <section
      id="work"
      className="scroll-mt-24"
      aria-labelledby="work-heading"
    >
      <div className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32 lg:px-14 lg:py-40">
        <Reveal>
          <div className="mb-16 flex flex-col gap-6 md:mb-24 md:flex-row md:items-end md:justify-between">
            <div>
              <SectionLabel index="02" label={t("work.index")} />
              <h2
                id="work-heading"
                className="font-display mt-4 max-w-xl text-[clamp(2.8rem,8vw,6rem)] leading-[0.9] tracking-[-0.045em]"
              >
                {t("work.title")}
              </h2>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-graphite md:pb-2">
              {t("work.copy")}
            </p>
          </div>
        </Reveal>

        <div className="flex flex-col gap-24 lg:gap-36">
          {items.map((project) => (
            <ProjectPreview key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
