import Link from "next/link";
import { getAdminBundle } from "@/lib/cms/admin-data";
import { ProjectsTable } from "@/components/admin/projects-table";

export default async function AdminProjectsPage() {
  const { projects } = await getAdminBundle();

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Sürükleyerek sırayı değiştir. Yayınlanmayanlar public sitede görünmez.
          </p>
        </div>
        <Link href="/admin/projects/new" className="admin-btn">
          Add Project
        </Link>
      </div>
      <ProjectsTable projects={projects} />
    </div>
  );
}
