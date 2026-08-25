"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CmsExperience } from "@/lib/cms/types";
import {
  deleteExperienceAction,
  reorderExperiencesAction,
  saveExperienceAction,
} from "@/lib/cms/actions";
import { SortableList } from "@/components/admin/sortable-list";
import { ConfirmDialog } from "@/components/admin/confirm";
import { useAdminToast } from "@/components/admin/toast";
import { useAdminI18n } from "@/components/admin/admin-i18n";

function blank(order: number): CmsExperience {
  return {
    id: "",
    fieldTr: "",
    fieldEn: "",
    contextTr: "",
    contextEn: "",
    company: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
    descriptionTr: "",
    descriptionEn: "",
    published: true,
    sortOrder: order,
  };
}

export function ExperienceManager({ items }: { items: CmsExperience[] }) {
  const router = useRouter();
  const { toast } = useAdminToast();
  const { t, contentLocale, errorText } = useAdminI18n();
  const [selected, setSelected] = useState<CmsExperience>(blank(items.length));
  const [pending, setPending] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold">{t("experience.records")}</h2>
          <button
            type="button"
            className="admin-btn-ghost"
            onClick={() => setSelected(blank(items.length))}
          >
            {t("common.new")}
          </button>
        </div>
        <SortableList
          items={items.map((item) => ({
            id: item.id,
            label: item.fieldTr || item.fieldEn,
            meta: item.published ? t("common.active") : t("common.inactive"),
          }))}
          onSelect={(id) => {
            const item = items.find((entry) => entry.id === id);
            if (item) setSelected(item);
          }}
          onReorder={async (ids) => {
            const result = await reorderExperiencesAction(ids);
            if (!result.ok) {
              toast(errorText(result.error), "error");
              return;
            }
            router.refresh();
          }}
        />
      </div>

      <form
        key={selected.id || "new"}
        className="admin-card space-y-4"
        onSubmit={async (event) => {
          event.preventDefault();
          setSaving(true);
          const result = await saveExperienceAction(new FormData(event.currentTarget));
          setSaving(false);
          if (!result.ok) {
            toast(errorText(result.error), "error");
            return;
          }
          toast(t("experience.saved"));
          router.refresh();
        }}
      >
        <div className="flex items-center justify-between">
          <h2 className="admin-section-title">
            {selected.id ? t("experience.editItem") : t("experience.newItem")}
          </h2>
        </div>
        {selected.id ? <input type="hidden" name="id" defaultValue={selected.id} /> : null}
        <input type="hidden" name="sort_order" defaultValue={selected.sortOrder} />

        <div className={contentLocale === "tr" ? "space-y-4" : "hidden"}>
          <label className="admin-field">
            <span>{t("experience.field")}</span>
            <input name="field_tr" defaultValue={selected.fieldTr} />
          </label>
          <label className="admin-field">
            <span>{t("experience.context")}</span>
            <input name="context_tr" defaultValue={selected.contextTr} />
          </label>
          <label className="admin-field">
            <span>{t("experience.description")}</span>
            <textarea
              name="description_tr"
              rows={4}
              defaultValue={selected.descriptionTr}
            />
          </label>
        </div>
        <div className={contentLocale === "en" ? "space-y-4" : "hidden"}>
          <label className="admin-field">
            <span>{t("experience.field")}</span>
            <input name="field_en" defaultValue={selected.fieldEn} />
          </label>
          <label className="admin-field">
            <span>{t("experience.context")}</span>
            <input name="context_en" defaultValue={selected.contextEn} />
          </label>
          <label className="admin-field">
            <span>{t("experience.description")}</span>
            <textarea
              name="description_en"
              rows={4}
              defaultValue={selected.descriptionEn}
            />
          </label>
        </div>

        <label className="admin-field">
          <span>{t("experience.company")}</span>
          <input name="company" defaultValue={selected.company} />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="admin-field">
            <span>{t("experience.start")}</span>
            <input
              name="start_date"
              type="date"
              defaultValue={selected.startDate.slice(0, 10)}
            />
          </label>
          <label className="admin-field">
            <span>{t("experience.end")}</span>
            <input
              name="end_date"
              type="date"
              defaultValue={selected.endDate.slice(0, 10)}
            />
          </label>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="is_current"
            defaultChecked={selected.isCurrent}
          />
          {t("experience.current")}
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="published"
            defaultChecked={selected.published}
          />
          {t("common.active")}
        </label>
        <div className="flex gap-2">
          <button type="submit" className="admin-btn" disabled={saving}>
            {t("common.save")}
          </button>
          {selected.id ? (
            <button
              type="button"
              className="admin-btn-danger"
              onClick={() => setPending(selected.id)}
            >
              {t("common.delete")}
            </button>
          ) : null}
        </div>
      </form>

      <ConfirmDialog
        open={Boolean(pending)}
        title={t("experience.deleteTitle")}
        body={t("experience.deleteBody")}
        onCancel={() => setPending(null)}
        onConfirm={async () => {
          if (!pending) return;
          const result = await deleteExperienceAction(pending);
          setPending(null);
          if (!result.ok) {
            toast(errorText(result.error), "error");
            return;
          }
          toast(t("toasts.deleted"));
          setSelected(blank(items.length));
          router.refresh();
        }}
      />
    </div>
  );
}
