import { unstable_cache } from "next/cache";
import { isGitHubConfigured } from "@/lib/github/commit";
import {
  readCopy,
  readExperiences,
  readExperiments,
  readLayout,
  readProfile,
  readProjects,
  readSkills,
  readStats,
} from "@/lib/cms/store";
import type { PublicCms } from "@/lib/cms/types";

async function loadPublicCms(): Promise<PublicCms> {
  const [
    profile,
    copy,
    projects,
    experiences,
    skills,
    experiments,
    stats,
    layout,
  ] = await Promise.all([
    readProfile(),
    readCopy(),
    readProjects(),
    readExperiences(),
    readSkills(),
    readExperiments(),
    readStats(),
    readLayout(),
  ]);

  return {
    configured: isGitHubConfigured(),
    profile,
    copy,
    projects: projects
      .filter((project) => project.published)
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder),
    experiences: experiences
      .filter((item) => item.published)
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder),
    skills: skills
      .filter((item) => item.published)
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder),
    experiments: experiments
      .filter((item) => item.published)
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder),
    stats: stats.slice().sort((a, b) => a.sortOrder - b.sortOrder),
    layout,
  };
}

const cachedPublicCms = unstable_cache(loadPublicCms, ["public-cms"], {
  tags: ["cms"],
  revalidate: 30,
});

export const getPublicCms =
  process.env.NODE_ENV === "development" ? loadPublicCms : cachedPublicCms;

export async function getCmsProjectBySlug(slug: string) {
  const cms = await getPublicCms();
  return cms.projects.find((project) => project.slug === slug) ?? null;
}
