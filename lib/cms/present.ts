import type { Locale } from "@/lib/i18n/config";
import {
  layoutForIndex,
  pickLocale,
  projectNumber,
  type CmsProject,
  type ProjectLayout,
} from "@/lib/cms/types";

export type DisplayProject = {
  slug: string;
  number: string;
  name: string;
  category: string;
  technologies: string[];
  year: string;
  href?: string;
  githubUrl?: string;
  layout: ProjectLayout;
  image?: string;
  description: string;
  problem: string;
  idea: string;
  build: string;
  result: string;
  caption: string;
  gallery: string[];
};

export function toDisplayProject(
  project: CmsProject,
  locale: Locale,
  index: number,
): DisplayProject {
  const name = pickLocale(locale, project.titleTr, project.titleEn);
  const image = project.coverImage || project.gallery[0] || undefined;
  const href = project.liveUrl || undefined;

  return {
    slug: project.slug,
    number: projectNumber(index),
    name,
    category: project.category,
    technologies: project.technologies,
    year: project.year,
    href,
    githubUrl: project.githubUrl || undefined,
    layout: layoutForIndex(index, project.layout),
    image,
    description: pickLocale(
      locale,
      project.shortDescriptionTr,
      project.shortDescriptionEn,
    ),
    problem: pickLocale(locale, project.problemTr, project.problemEn),
    idea: pickLocale(locale, project.ideaTr, project.ideaEn),
    build: pickLocale(locale, project.buildTr, project.buildEn),
    result: pickLocale(locale, project.resultTr, project.resultEn),
    caption: pickLocale(locale, project.captionTr, project.captionEn),
    gallery: project.gallery,
  };
}

export function adjacentProjects(
  projects: DisplayProject[],
  slug: string,
): { previous: DisplayProject | null; next: DisplayProject | null } {
  const index = projects.findIndex((project) => project.slug === slug);
  if (index === -1) {
    return { previous: null, next: null };
  }

  return {
    previous: index > 0 ? projects[index - 1] : null,
    next: index < projects.length - 1 ? projects[index + 1] : null,
  };
}

export function splitName(name: string): { first: string; last: string } {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return { first: "Alihan", last: "Asl" };
  }
  if (parts.length === 1) {
    return { first: parts[0], last: "" };
  }
  return { first: parts[0], last: parts.slice(1).join(" ") };
}

export function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
