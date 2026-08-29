"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ProjectVisual } from "@/components/projects/project-visual";
import { FitImage } from "@/components/site/fit-image";
import { SectionLabel } from "@/components/ui/section-label";
import { Reveal } from "@/components/ui/reveal";
import { useLocale } from "@/components/i18n/locale-provider";
import { useCms } from "@/components/cms/cms-provider";
import { adjacentProjects, toDisplayProject } from "@/lib/cms/present";
import type { MessageKey } from "@/lib/i18n/translate";

function RichCopy({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={index} className="font-medium text-ink">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
}

type CaseStudyProps = {
  slug: string;
};

export function CaseStudy({ slug }: CaseStudyProps) {
  const { t, locale } = useLocale();
  const { projects } = useCms();
  const items = projects.map((project, index) =>
    toDisplayProject(project, locale, index),
  );
  const project = items.find((item) => item.slug === slug);
  const { previous, next } = adjacentProjects(items, slug);

  if (!project) {
    return null;
  }

  const categoryLabel = t(`categories.${project.category}` as MessageKey);
  const category =
    categoryLabel.startsWith("categories.") ? project.category : categoryLabel;

  const chapters = [
    { label: t("project.problem"), body: project.problem },
    { label: t("project.idea"), body: project.idea },
    { label: t("project.build"), body: project.build },
  ];

  return (
    <article className="pt-16 md:pt-[4.25rem]">
      <header className="mx-auto max-w-[1400px] px-5 pt-12 md:px-10 md:pt-20 lg:px-14">
        <Reveal>
          <SectionLabel index={project.number} label={t("project.label")} />
          <h1 className="font-display mt-5 text-[clamp(3rem,10vw,7.5rem)] leading-[0.86] tracking-[-0.05em]">
            {project.name}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-graphite">
            {project.description}
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <dl className="mt-12 grid gap-6 border-t border-line py-8 sm:grid-cols-3">
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone">
                {t("project.category")}
              </dt>
              <dd className="mt-2 text-sm text-ink">{category}</dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone">
                {t("project.year")}
              </dt>
              <dd className="mt-2 text-sm text-ink">{project.year}</dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone">
                {t("project.stack")}
              </dt>
              <dd className="mt-2 text-sm text-ink">
                {project.technologies.join(" · ")}
              </dd>
            </div>
          </dl>
        </Reveal>
      </header>

      <Reveal>
        <div className="mx-auto max-w-[1400px] px-5 md:px-10 lg:px-14">
          <ProjectVisual
            project={project}
            caption={project.caption}
            src={project.image}
          />
          {project.gallery.filter((url) => url && url !== project.image).length ? (
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {project.gallery
                .filter((url) => url && url !== project.image)
                .map((url) => (
                  <li key={url}>
                    <FitImage src={url} alt="" ratio="16/10" />
                  </li>
                ))}
            </ul>
          ) : null}
        </div>
      </Reveal>

      <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-28 lg:px-14">
        <div className="grid gap-16 lg:grid-cols-3 lg:gap-12">
          {chapters.map((chapter, index) => (
            <Reveal key={chapter.label} delay={index * 0.06}>
              <section>
                <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone">
                  {chapter.label}
                </h2>
                <p className="mt-4 max-w-md text-[1.05rem] leading-[1.7] text-graphite">
                  <RichCopy text={chapter.body} />
                </p>
              </section>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <section className="mt-20 border-t border-line pt-12 md:mt-28">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone">
              {t("project.technology")}
            </h2>
            <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
              {project.technologies.map((tech) => (
                <li
                  key={tech}
                  className="font-mono text-[13px] uppercase tracking-[0.18em] text-ink"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </section>
        </Reveal>

        <Reveal>
          <section className="mt-16 grid gap-6 border-t border-line pt-12 md:grid-cols-[12rem_1fr] md:gap-16">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone">
              {t("project.result")}
            </h2>
            <p className="max-w-xl font-display text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.2] tracking-[-0.03em] text-ink">
              {project.result}
            </p>
          </section>
        </Reveal>

        {(project.href || project.githubUrl) && (
          <Reveal>
            <div className="mt-12 flex flex-wrap gap-6">
              {project.href ? (
                <a
                  href={project.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.18em] text-ink"
                >
                  {t("project.open")}
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                </a>
              ) : null}
              {project.githubUrl ? (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.18em] text-ink"
                >
                  GitHub
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                </a>
              ) : null}
            </div>
          </Reveal>
        )}

        <nav
          aria-label={t("a11y.adjacent")}
          className="mt-24 grid gap-6 border-t border-line pt-10 md:grid-cols-2"
        >
          {previous ? (
            <Link href={`/projects/${previous.slug}`} className="group">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone">
                {t("project.previous")}
              </p>
              <p className="font-display mt-3 text-3xl tracking-[-0.04em] transition-opacity duration-300 group-hover:opacity-50">
                {previous.name}
              </p>
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link href={`/projects/${next.slug}`} className="group md:text-right">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-stone">
                {t("project.next")}
              </p>
              <p className="font-display mt-3 text-3xl tracking-[-0.04em] transition-opacity duration-300 group-hover:opacity-50">
                {next.name}
              </p>
            </Link>
          ) : (
            <div />
          )}
        </nav>
      </div>
    </article>
  );
}
