"use client";

import Link from "next/link";
import { useAdminI18n } from "@/components/admin/admin-i18n";

export function DashboardView({
  projectCount,
  published,
  drafts,
  experienceCount,
  skillCount,
}: {
  projectCount: number;
  published: number;
  drafts: number;
  experienceCount: number;
  skillCount: number;
}) {
  const { t } = useAdminI18n();
  const cards = [
    { label: t("dashboard.totalProjects"), value: projectCount },
    { label: t("dashboard.published"), value: published },
    { label: t("dashboard.drafts"), value: drafts },
    { label: t("dashboard.experience"), value: experienceCount },
    { label: t("dashboard.skills"), value: skillCount },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">
        {t("dashboard.title")}
      </h1>
      <p className="mt-1 text-sm text-zinc-500">{t("dashboard.lead")}</p>
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
          {t("dashboard.addProject")}
        </Link>
        <Link href="/admin/experience" className="admin-btn-ghost">
          {t("dashboard.experienceCta")}
        </Link>
        <Link href="/admin/content" className="admin-btn-ghost">
          {t("dashboard.contentCta")}
        </Link>
      </div>
    </div>
  );
}
