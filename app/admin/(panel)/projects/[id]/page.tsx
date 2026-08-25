import { notFound } from "next/navigation";
import { getAdminBundle } from "@/lib/cms/admin-data";
import { ProjectForm } from "@/components/admin/project-form";
import { AdminHeading } from "@/components/admin/page-header";

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
      <AdminHeading titleKey="projects.edit" />
      <ProjectForm project={project} nextOrder={project.sortOrder} />
    </div>
  );
}
