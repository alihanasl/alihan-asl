"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { DisplayProject } from "@/lib/cms/present";
import { Reveal } from "@/components/ui/reveal";
import { ProjectVisual } from "@/components/projects/project-visual";
import { useLocale } from "@/components/i18n/locale-provider";
import type { MessageKey } from "@/lib/i18n/translate";

type ProjectPreviewProps = {
  project: DisplayProject;
};

export function ProjectPreview({ project }: ProjectPreviewProps) {
  const { t } = useLocale();
  const frameRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const description = project.description;
  const caption = project.caption;
  const categoryLabel = t(`categories.${project.category}` as MessageKey);
  const category =
    categoryLabel.startsWith("categories.") ? project.category : categoryLabel;

  function handleMove(event: React.MouseEvent<HTMLDivElement>) {
    const visual = visualRef.current;
    const frame = frameRef.current;
    if (!visual || !frame) return;
    const rect = frame.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    visual.style.transform = `translate(${x * 12}px, ${y * 10}px) scale(1.04)`;
  }

  function handleLeave() {
    const visual = visualRef.current;
    if (!visual) return;
    visual.style.transform = "translate(0px, 0px) scale(1)";
  }

  const copy = (
    <div className="flex h-full flex-col justify-between gap-10">
      <div>
        <div className="mb-6 flex items-center justify-between gap-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-stone">
            {project.number}
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone">
            {project.year}
          </p>
        </div>
        <h3 className="font-display text-[clamp(2.4rem,6vw,5rem)] leading-[0.9] tracking-[-0.04em] text-ink transition-[letter-spacing] duration-500 group-hover:tracking-[-0.055em]">
          {project.name}
        </h3>
        <p className="mt-5 max-w-md text-[1.05rem] leading-relaxed text-graphite">
          {description}
        </p>
      </div>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone">
            {category}
          </p>
          <p className="mt-2 max-w-sm font-mono text-[11px] uppercase tracking-[0.14em] text-graphite">
            {project.technologies.join("  /  ")}
          </p>
        </div>
        <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink">
          {t("work.caseStudy")}
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
        </span>
      </div>
    </div>
  );

  const visual = (
    <div
      ref={frameRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="relative overflow-hidden"
    >
      <div
        ref={visualRef}
        className="origin-center will-change-transform"
        style={{
          transition: "transform 500ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {project.image ? (
          <div className="relative aspect-[16/10] overflow-hidden border border-line">
            <Image
              src={project.image}
              alt={t("project.previewAlt", { name: project.name })}
              fill
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-cover"
            />
          </div>
        ) : (
          <ProjectVisual project={project} caption={caption} />
        )}
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100 md:p-5">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink">
          {t("work.open")}
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink">
          {project.number}
        </span>
      </div>
    </div>
  );

  return (
    <Reveal>
      <article className="group">
        <Link
          href={`/projects/${project.slug}`}
          className="block focus-visible:outline-offset-8"
        >
          {project.layout === "visual-below" && (
            <div className="grid gap-8 lg:gap-10">
              {copy}
              {visual}
            </div>
          )}

          {project.layout === "compact" && (
            <div className="grid items-stretch gap-8 border-t border-line pt-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
              <div className="max-w-md">{copy}</div>
              {visual}
            </div>
          )}

          {project.layout === "visual-right" && (
            <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
              {copy}
              {visual}
            </div>
          )}

          {project.layout === "visual-left" && (
            <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
              <div className="lg:order-2">{copy}</div>
              <div className="lg:order-1">{visual}</div>
            </div>
          )}
        </Link>
      </article>
    </Reveal>
  );
}
