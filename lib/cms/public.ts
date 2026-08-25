import projects from "@/content/projects.json";
import experience from "@/content/experience.json";
import skills from "@/content/skills.json";
import experiments from "@/content/experiments.json";
import profile from "@/content/about.json";
import copy from "@/content/site.json";
import stats from "@/content/stats.json";
import { isGitHubConfigured } from "@/lib/github/commit";
import type {
  CmsExperiment,
  CmsExperience,
  CmsProject,
  CmsSkill,
  CmsStat,
  CopyMap,
  Profile,
  PublicCms,
} from "@/lib/cms/types";

export async function getPublicCms(): Promise<PublicCms> {
  const allProjects = projects as CmsProject[];

  return {
    configured: isGitHubConfigured(),
    profile: profile as Profile,
    copy: copy as CopyMap,
    projects: allProjects
      .filter((project) => project.published)
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder),
    experiences: (experience as CmsExperience[])
      .filter((item) => item.published)
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder),
    skills: (skills as CmsSkill[])
      .filter((item) => item.published)
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder),
    experiments: (experiments as CmsExperiment[])
      .filter((item) => item.published)
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder),
    stats: (stats as CmsStat[]).slice().sort((a, b) => a.sortOrder - b.sortOrder),
  };
}

export async function getCmsProjectBySlug(slug: string): Promise<CmsProject | null> {
  const cms = await getPublicCms();
  return cms.projects.find((project) => project.slug === slug) ?? null;
}
