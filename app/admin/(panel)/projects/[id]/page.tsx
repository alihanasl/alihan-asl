import { notFound } from "next/navigation";
import { getAdminBundle } from "@/lib/cms/admin-data";
import { ProjectForm } from "@/components/admin/project-form";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { projects } = await getAdminBundle();
  const project = projects.find((item) => item.id === id);
  if (!project) {
    notFound();
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Edit Project</h1>
      <ProjectForm project={project} nextOrder={project.sortOrder} />
    </div>
  );
}
