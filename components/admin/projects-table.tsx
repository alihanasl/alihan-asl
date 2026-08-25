"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { CmsProject } from "@/lib/cms/types";
import {
  deleteProjectAction,
  reorderProjectsAction,
  setProjectFeaturedAction,
  setProjectPublishedAction,
} from "@/lib/cms/actions";
import { ConfirmDialog } from "@/components/admin/confirm";
import { useAdminToast } from "@/components/admin/toast";
import { useAdminI18n } from "@/components/admin/admin-i18n";
import { GripVertical } from "lucide-react";

export function ProjectsTable({ projects }: { projects: CmsProject[] }) {
  const router = useRouter();
  const { toast } = useAdminToast();
  const { t, errorText } = useAdminI18n();
  const [order, setOrder] = useState(projects.map((project) => project.id));
  const [dragId, setDragId] = useState<string | null>(null);
  const [pending, setPending] = useState<CmsProject | null>(null);
  const items = [
    ...order
      .map((id) => projects.find((project) => project.id === id))
      .filter((project): project is CmsProject => Boolean(project)),
    ...projects.filter((project) => !order.includes(project.id)),
  ];

  async function reorder(fromId: string, toId: string) {
    if (fromId === toId) return;
    const next = [...order];
    const from = next.indexOf(fromId);
    const to = next.indexOf(toId);
    if (from < 0 || to < 0) return;
    next.splice(from, 1);
    next.splice(to, 0, fromId);
    setOrder(next);
    const result = await reorderProjectsAction(next);
    if (!result.ok) {
      toast(errorText(result.error), "error");
      setOrder(projects.map((project) => project.id));
      return;
    }
    router.refresh();
  }

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="w-8 px-3 py-2" />
              <th className="px-3 py-2">{t("projects.colProject")}</th>
              <th className="px-3 py-2">{t("projects.colStatus")}</th>
              <th className="px-3 py-2">{t("projects.colFeatured")}</th>
              <th className="px-3 py-2 text-right">{t("projects.colActions")}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((project) => (
              <tr
                key={project.id}
                draggable
                onDragStart={() => setDragId(project.id)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => {
                  if (dragId) void reorder(dragId, project.id);
                  setDragId(null);
                }}
                className="border-b border-zinc-100 last:border-0"
              >
                <td className="px-3 py-3 text-zinc-400">
                  <GripVertical className="h-4 w-4 cursor-grab" />
                </td>
                <td className="px-3 py-3">
                  <Link href={`/admin/projects/${project.id}`} className="font-medium hover:underline">
                    {project.titleTr || project.titleEn || project.slug}
                  </Link>
                  <p className="text-xs text-zinc-500">{project.slug}</p>
                </td>
                <td className="px-3 py-3">
                  <span
                    className={
                      project.published
                        ? "rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700"
                        : "rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600"
                    }
                  >
                    {project.published ? t("common.published") : t("common.draft")}
                  </span>
                </td>
                <td className="px-3 py-3 text-xs text-zinc-600">
                  {project.featured ? t("common.yes") : "—"}
                </td>
                <td className="px-3 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      className="text-xs text-zinc-600 hover:text-zinc-900"
                      onClick={async () => {
                        const result = await setProjectPublishedAction(
                          project.id,
                          !project.published,
                        );
                        if (!result.ok) {
                          toast(errorText(result.error), "error");
                          return;
                        }
                        toast(
                          project.published
                            ? t("projects.unpublishedToast")
                            : t("projects.wentLiveToast"),
                        );
                        router.refresh();
                      }}
                    >
                      {project.published ? t("common.draft") : t("common.publish")}
                    </button>
                    <button
                      type="button"
                      className="text-xs text-zinc-600 hover:text-zinc-900"
                      onClick={async () => {
                        const result = await setProjectFeaturedAction(
                          project.id,
                          !project.featured,
                        );
                        if (!result.ok) {
                          toast(errorText(result.error), "error");
                          return;
                        }
                        router.refresh();
                      }}
                    >
                      {project.featured ? t("common.unfeature") : t("common.feature")}
                    </button>
                    <button
                      type="button"
                      className="text-xs text-red-600"
                      onClick={() => setPending(project)}
                    >
                      {t("common.delete")}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {items.length === 0 ? (
        <p className="mt-4 text-sm text-zinc-500">{t("projects.empty")}</p>
      ) : null}
      <ConfirmDialog
        open={Boolean(pending)}
        title={t("projects.deleteTitle")}
        body={t("projects.deleteBodyShort")}
        onCancel={() => setPending(null)}
        onConfirm={async () => {
          if (!pending) return;
          const result = await deleteProjectAction(pending.id);
          setPending(null);
          if (!result.ok) {
            toast(errorText(result.error), "error");
            return;
          }
          toast(t("projects.deletedToast"));
          router.refresh();
        }}
      />
    </>
  );
}
