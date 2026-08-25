import { getAdminBundle } from "@/lib/cms/admin-data";
import { DashboardView } from "@/components/admin/dashboard-view";

export default async function AdminDashboardPage() {
  const { projects, experiences, skills } = await getAdminBundle();
  const published = projects.filter((project) => project.published).length;

  return (
    <DashboardView
      projectCount={projects.length}
      published={published}
      drafts={projects.length - published}
      experienceCount={experiences.length}
      skillCount={skills.length}
    />
  );
}
