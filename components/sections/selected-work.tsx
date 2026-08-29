"use client";

import { ProjectPreview } from "@/components/projects/project-preview";
import { Reveal } from "@/components/ui/reveal";
import { useLocale } from "@/components/i18n/locale-provider";
import { useCms } from "@/components/cms/cms-provider";
import { toDisplayProject } from "@/lib/cms/present";

export function SelectedWork() {
  const { t, locale } = useLocale();
  const { projects } = useCms();
  const items = projects.map((project, projectIndex) =>
    toDisplayProject(project, locale, projectIndex),
  );

  return (
    <section
      id="work"
      className="scroll-mt-24"
      aria-labelledby="work-heading"
    >
      <div className="site-pad mx-auto max-w-[1680px] pt-16 md:pt-24">
        <Reveal>
          <div className="mb-16 max-w-md md:mb-8">
            <p className="text-[11px] uppercase tracking-[0.22em] text-stone">
              {t("work.index")}
            </p>
            <h2
              id="work-heading"
              className="font-display mt-4 text-[clamp(2.2rem,5.5vw,4.2rem)] leading-[0.9] tracking-[-0.05em]"
            >
              {t("work.title")}
            </h2>
            <p className="mt-5 text-[0.95rem] leading-relaxed text-graphite">
              {t("work.copy")}
            </p>
          </div>
        </Reveal>
      </div>

      <div>
        {items.map((project) => (
          <ProjectPreview key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
