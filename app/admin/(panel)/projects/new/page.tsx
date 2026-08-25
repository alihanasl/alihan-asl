import { getAdminBundle } from "@/lib/cms/admin-data";
import { ProjectForm } from "@/components/admin/project-form";
import { AdminHeading } from "@/components/admin/page-header";

export default async function NewProjectPage() {
  const { projects } = await getAdminBundle();

  return (
    <div>
      <AdminHeading titleKey="projects.newTitle" />
      <ProjectForm nextOrder={projects.length} />
    </div>
  );
}
