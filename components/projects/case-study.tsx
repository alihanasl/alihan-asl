"use client";

import Link from "next/link";
import { ProjectVisual } from "@/components/projects/project-visual";
import { FitImage } from "@/components/site/fit-image";
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
  ].filter((chapter) => chapter.body.trim());

  return (
    <article className="pt-14 md:pt-16">
      <header className="site-pad mx-auto max-w-[1680px] pt-16 md:pt-24">
        <Reveal>
          <p className="text-[11px] uppercase tracking-[0.22em] text-stone">
            {project.number} · {project.year}
          </p>
          <h1 className="font-display mt-5 max-w-[12ch] text-[clamp(3.4rem,12vw,8.5rem)] leading-[0.84] tracking-[-0.06em]">
            {project.name}
          </h1>
          {project.description ? (
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-graphite">
              {project.description}
            </p>
          ) : null}
        </Reveal>

        <Reveal delay={0.08}>
          <dl className="mt-14 flex flex-wrap gap-x-12 gap-y-6">
            <div>
              <dt className="text-[11px] uppercase tracking-[0.2em] text-stone">
                {t("project.category")}
              </dt>
              <dd className="mt-2 text-sm text-ink">{category}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.2em] text-stone">
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
        <div className="site-pad mx-auto mt-12 max-w-[1680px] md:mt-16">
          <ProjectVisual project={project} caption={project.caption} />
          {project.gallery.filter((url) => url && url !== project.image).length ? (
            <ul className="mt-4 grid gap-4 sm:grid-cols-2">
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

      <div className="site-pad mx-auto max-w-[1680px] py-20 md:py-28">
        <div className="max-w-3xl space-y-16 md:space-y-24">
          {chapters.map((chapter) => (
            <Reveal key={chapter.label}>
              <section>
                <h2 className="text-[11px] uppercase tracking-[0.22em] text-stone">
                  {chapter.label}
                </h2>
                <p className="mt-5 text-[1.12rem] leading-[1.7] text-graphite">
                  <RichCopy text={chapter.body} />
                </p>
              </section>
            </Reveal>
          ))}
        </div>

        {project.result ? (
          <Reveal>
            <section className="mt-24 max-w-3xl md:mt-32">
              <h2 className="text-[11px] uppercase tracking-[0.22em] text-stone">
                {t("project.result")}
              </h2>
              <p className="font-display mt-6 text-[clamp(1.8rem,4vw,3.2rem)] leading-[1.12] tracking-[-0.04em] text-ink">
                {project.result}
              </p>
            </section>
          </Reveal>
        ) : null}

        {(project.href || project.githubUrl) && (
          <Reveal>
            <div className="mt-14 flex flex-wrap gap-8">
              {project.href ? (
                <a
                  href={project.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-[15px] tracking-[-0.02em] text-ink transition-opacity hover:opacity-40"
                >
                  {t("project.open")}
                </a>
              ) : null}
              {project.githubUrl ? (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-[15px] tracking-[-0.02em] text-ink transition-opacity hover:opacity-40"
                >
                  GitHub
                </a>
              ) : null}
            </div>
          </Reveal>
        )}

        <nav
          aria-label={t("a11y.adjacent")}
          className="mt-28 grid gap-10 md:grid-cols-2"
        >
          {previous ? (
            <Link href={`/projects/${previous.slug}`} className="group">
              <p className="text-[11px] uppercase tracking-[0.2em] text-stone">
                {t("project.previous")}
              </p>
              <p className="font-display mt-3 text-[clamp(1.6rem,3vw,2.6rem)] leading-[0.95] tracking-[-0.045em] transition-opacity duration-300 group-hover:opacity-40">
                {previous.name}
              </p>
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link href={`/projects/${next.slug}`} className="group md:text-right">
              <p className="text-[11px] uppercase tracking-[0.2em] text-stone">
                {t("project.next")}
              </p>
              <p className="font-display mt-3 text-[clamp(1.6rem,3vw,2.6rem)] leading-[0.95] tracking-[-0.045em] transition-opacity duration-300 group-hover:opacity-40">
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
