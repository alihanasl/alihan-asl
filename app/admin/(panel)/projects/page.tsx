import { getAdminBundle } from "@/lib/cms/admin-data";
import { ProjectsTable } from "@/components/admin/projects-table";
import { AdminPageHeader } from "@/components/admin/page-header";

export default async function AdminProjectsPage() {
  const { projects } = await getAdminBundle();

  return (
    <div>
      <AdminPageHeader
        titleKey="projects.title"
        descriptionKey="projects.lead"
        actionHref="/admin/projects/new"
        actionKey="projects.add"
      />
      <ProjectsTable projects={projects} />
    </div>
  );
}
