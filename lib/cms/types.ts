import type { Locale } from "@/lib/i18n/config";

export const layouts = [
  "visual-right",
  "visual-left",
  "visual-below",
  "compact",
] as const;

export type ProjectLayout = (typeof layouts)[number];

export type LabStatus = "active" | "building" | "experimental";

export type SkillCategory =
  | "frontend"
  | "backend"
  | "database"
  | "infrastructure"
  | "tools";

export type Profile = {
  id: string;
  name: string;
  email: string;
  githubUrl: string;
  linkedinUrl: string;
  youtubeUrl: string;
};

export type CmsProject = {
  id: string;
  slug: string;
  titleTr: string;
  titleEn: string;
  shortDescriptionTr: string;
  shortDescriptionEn: string;
  problemTr: string;
  problemEn: string;
  ideaTr: string;
  ideaEn: string;
  buildTr: string;
  buildEn: string;
  resultTr: string;
  resultEn: string;
  captionTr: string;
  captionEn: string;
  category: string;
  technologies: string[];
  year: string;
  githubUrl: string;
  liveUrl: string;
  coverImage: string;
  gallery: string[];
  featured: boolean;
  published: boolean;
  sortOrder: number;
  layout: ProjectLayout;
  createdAt?: string;
  updatedAt?: string;
};

export type CmsExperience = {
  id: string;
  fieldTr: string;
  fieldEn: string;
  contextTr: string;
  contextEn: string;
  company: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  descriptionTr: string;
  descriptionEn: string;
  published: boolean;
  sortOrder: number;
};

export type CmsSkill = {
  id: string;
  name: string;
  category: SkillCategory;
  noteTr: string;
  noteEn: string;
  published: boolean;
  sortOrder: number;
};

export type CmsExperiment = {
  id: string;
  nameTr: string;
  nameEn: string;
  noteTr: string;
  noteEn: string;
  status: LabStatus;
  ref: string;
  published: boolean;
  sortOrder: number;
};

export type CmsStat = {
  id: string;
  value: number | null;
  display: string;
  suffix: string;
  sortOrder: number;
};

export type CopyMap = Record<string, Partial<Record<Locale, string>>>;

export type PublicCms = {
  configured: boolean;
  profile: Profile;
  copy: CopyMap;
  projects: CmsProject[];
  experiences: CmsExperience[];
  skills: CmsSkill[];
  experiments: CmsExperiment[];
  stats: CmsStat[];
};

export function pickLocale(
  locale: Locale,
  tr: string,
  en: string,
): string {
  return locale === "tr" ? tr || en : en || tr;
}

export function layoutForIndex(index: number, layout?: string): ProjectLayout {
  if (layouts.includes(layout as ProjectLayout)) {
    return layout as ProjectLayout;
  }
  return layouts[index % layouts.length];
}

export function projectNumber(index: number): string {
  return String(index + 1).padStart(2, "0");
}
