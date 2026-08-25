import Link from "next/link";
import { getAdminBundle } from "@/lib/cms/admin-data";

export default async function AdminDashboardPage() {
  const { projects, experiences, skills } = await getAdminBundle();
  const published = projects.filter((project) => project.published).length;
  const drafts = projects.length - published;
  const cards = [
    { label: "Toplam proje", value: projects.length },
    { label: "Yayında", value: published },
    { label: "Taslak", value: drafts },
    { label: "Experience", value: experiences.length },
    { label: "Teknoloji", value: skills.length },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Public site içeriğini buradan yönet.
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((card) => (
          <article key={card.label} className="admin-card">
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              {card.label}
            </p>
            <p className="mt-2 text-3xl font-semibold">{card.value}</p>
          </article>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap gap-2">
        <Link href="/admin/projects/new" className="admin-btn">
          Add Project
        </Link>
        <Link href="/admin/experience" className="admin-btn-ghost">
          Experience
        </Link>
        <Link href="/admin/content" className="admin-btn-ghost">
          Content
        </Link>
      </div>
    </div>
  );
}
