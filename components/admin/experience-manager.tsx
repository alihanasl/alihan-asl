"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CmsExperience } from "@/lib/cms/types";
import {
  deleteExperienceAction,
  reorderExperiencesAction,
  saveExperienceAction,
} from "@/lib/cms/actions";
import { LangTabs } from "@/components/admin/lang-tabs";
import { SortableList } from "@/components/admin/sortable-list";
import { ConfirmDialog } from "@/components/admin/confirm";
import { useAdminToast } from "@/components/admin/toast";

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
  const [selected, setSelected] = useState<CmsExperience>(blank(items.length));
  const [locale, setLocale] = useState<"tr" | "en">("tr");
  const [pending, setPending] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Kayıtlar</h2>
          <button
            type="button"
            className="admin-btn-ghost"
            onClick={() => setSelected(blank(items.length))}
          >
            Yeni
          </button>
        </div>
        <SortableList
          items={items.map((item) => ({
            id: item.id,
            label: item.fieldTr || item.fieldEn,
            meta: item.published ? "Aktif" : "Pasif",
          }))}
          onSelect={(id) => {
            const item = items.find((entry) => entry.id === id);
            if (item) setSelected(item);
          }}
          onReorder={async (ids) => {
            const result = await reorderExperiencesAction(ids);
            if (!result.ok) {
              toast(result.error, "error");
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
            toast(result.error, "error");
            return;
          }
          toast("Deneyim kaydedildi.");
          router.refresh();
        }}
      >
        <div className="flex items-center justify-between">
          <h2 className="admin-section-title">
            {selected.id ? "Düzenle" : "Yeni deneyim"}
          </h2>
          <LangTabs locale={locale} onChange={setLocale} />
        </div>
        {selected.id ? <input type="hidden" name="id" defaultValue={selected.id} /> : null}
        <input type="hidden" name="sort_order" defaultValue={selected.sortOrder} />

        <div className={locale === "tr" ? "space-y-4" : "hidden"}>
          <label className="admin-field">
            <span>Alan</span>
            <input name="field_tr" defaultValue={selected.fieldTr} />
          </label>
          <label className="admin-field">
            <span>Bağlam</span>
            <input name="context_tr" defaultValue={selected.contextTr} />
          </label>
          <label className="admin-field">
            <span>Açıklama</span>
            <textarea
              name="description_tr"
              rows={4}
              defaultValue={selected.descriptionTr}
            />
          </label>
        </div>
        <div className={locale === "en" ? "space-y-4" : "hidden"}>
          <label className="admin-field">
            <span>Field</span>
            <input name="field_en" defaultValue={selected.fieldEn} />
          </label>
          <label className="admin-field">
            <span>Context</span>
            <input name="context_en" defaultValue={selected.contextEn} />
          </label>
          <label className="admin-field">
            <span>Description</span>
            <textarea
              name="description_en"
              rows={4}
              defaultValue={selected.descriptionEn}
            />
          </label>
        </div>

        <label className="admin-field">
          <span>Company</span>
          <input name="company" defaultValue={selected.company} />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="admin-field">
            <span>Start date</span>
            <input
              name="start_date"
              type="date"
              defaultValue={selected.startDate.slice(0, 10)}
            />
          </label>
          <label className="admin-field">
            <span>End date</span>
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
          Current
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="published"
            defaultChecked={selected.published}
          />
          Aktif
        </label>
        <div className="flex gap-2">
          <button type="submit" className="admin-btn" disabled={saving}>
            Save
          </button>
          {selected.id ? (
            <button
              type="button"
              className="admin-btn-danger"
              onClick={() => setPending(selected.id)}
            >
              Delete
            </button>
          ) : null}
        </div>
      </form>

      <ConfirmDialog
        open={Boolean(pending)}
        title="Deneyimi sil"
        body="Bu kayıt silinecek."
        onCancel={() => setPending(null)}
        onConfirm={async () => {
          if (!pending) return;
          const result = await deleteExperienceAction(pending);
          setPending(null);
          if (!result.ok) {
            toast(result.error, "error");
            return;
          }
          toast("Silindi.");
          setSelected(blank(items.length));
          router.refresh();
        }}
      />
    </div>
  );
}
