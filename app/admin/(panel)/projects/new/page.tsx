import { getAdminBundle } from "@/lib/cms/admin-data";
import { ProjectForm } from "@/components/admin/project-form";

export default async function NewProjectPage() {
  const { projects } = await getAdminBundle();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Add Project</h1>
      <ProjectForm nextOrder={projects.length} />
    </div>
  );
}
