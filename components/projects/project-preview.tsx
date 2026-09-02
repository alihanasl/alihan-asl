"use client";

import { useRef } from "react";
import Link from "next/link";
import type { DisplayProject } from "@/lib/cms/present";
import { ProjectVisual } from "@/components/projects/project-visual";
import { useLocale } from "@/components/i18n/locale-provider";
import { cn } from "@/lib/cn";

type ProjectPreviewProps = {
  project: DisplayProject;
};

export function ProjectPreview({ project }: ProjectPreviewProps) {
  const { t } = useLocale();
  const visualRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  function handleMove(event: React.MouseEvent<HTMLAnchorElement>) {
    const visual = visualRef.current;
    const title = titleRef.current;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    if (visual) {
      visual.style.transform = `translate3d(${x * 16}px, ${y * 12}px, 0) scale(1.045)`;
    }
    if (title) {
      title.style.transform = `translate3d(${x * 8}px, ${y * 4}px, 0)`;
    }
  }

  function handleLeave() {
    if (visualRef.current) {
      visualRef.current.style.transform = "translate3d(0, 0, 0) scale(1)";
    }
    if (titleRef.current) {
      titleRef.current.style.transform = "translate3d(0, 0, 0)";
    }
  }

  return (
    <article className="group">
      <Link
        href={`/projects/${project.slug}`}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className="site-pad mx-auto flex min-h-[100svh] w-full max-w-[1680px] cursor-pointer flex-col justify-center py-16 md:py-20"
      >
        <div className="mb-8 flex items-baseline justify-between gap-6 md:mb-10">
          <p className="text-[11px] uppercase tracking-[0.22em] text-stone">
            {project.number}
          </p>
          <p className="text-[11px] uppercase tracking-[0.18em] text-stone">
            {project.year}
          </p>
        </div>

        <h3
          ref={titleRef}
          className="font-display max-w-[14ch] text-[clamp(2.8rem,8vw,7.2rem)] leading-[0.86] tracking-[-0.055em] text-ink will-change-transform"
          style={{
            transition: "transform 600ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          {project.name}
        </h3>

        <div
          className={cn(
            "mt-6 flex max-w-xl flex-col gap-2 text-[0.95rem] leading-relaxed text-graphite",
            "opacity-80 transition-opacity duration-500 group-hover:opacity-100",
          )}
        >
          {project.description ? <p>{project.description}</p> : null}
          {project.technologies.length ? (
            <p className="text-[12px] uppercase tracking-[0.16em] text-stone">
              {project.technologies.join("  ·  ")}
            </p>
          ) : null}
        </div>

        <div className="relative mt-10 overflow-hidden md:mt-14">
          <div
            ref={visualRef}
            className="origin-center will-change-transform"
            style={{
              transition: "transform 700ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            <ProjectVisual
              project={project}
              caption={project.caption}
              src={project.image}
            />
          </div>
          <p className="pointer-events-none absolute bottom-4 right-4 text-[11px] uppercase tracking-[0.2em] text-ink opacity-0 transition-opacity duration-500 group-hover:opacity-100 md:bottom-6 md:right-6">
            {t("work.open")}
          </p>
        </div>
      </Link>
    </article>
  );
}
