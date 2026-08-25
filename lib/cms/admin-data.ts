import { requireAdmin } from "@/lib/cms/auth";
import {
  readCopy,
  readExperiences,
  readExperiments,
  readMedia,
  readProfile,
  readProjects,
  readSkills,
  readStats,
} from "@/lib/cms/store";

export async function getAdminBundle() {
  const { username } = await requireAdmin();
  const [profile, copy, projects, experiences, skills, experiments, stats, media] =
    await Promise.all([
      readProfile(),
      readCopy(),
      readProjects(),
      readExperiences(),
      readSkills(),
      readExperiments(),
      readStats(),
      readMedia(),
    ]);

  return {
    username,
    profile,
    copy,
    projects: projects.slice().sort((a, b) => a.sortOrder - b.sortOrder),
    experiences: experiences.slice().sort((a, b) => a.sortOrder - b.sortOrder),
    skills: skills.slice().sort((a, b) => a.sortOrder - b.sortOrder),
    experiments: experiments.slice().sort((a, b) => a.sortOrder - b.sortOrder),
    stats: stats.slice().sort((a, b) => a.sortOrder - b.sortOrder),
    media,
  };
}
