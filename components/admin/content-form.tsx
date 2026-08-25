"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { contentGroups } from "@/lib/cms/keys";
import type { CopyMap } from "@/lib/cms/types";
import type { CmsExperiment } from "@/lib/cms/types";
import {
  deleteExperimentAction,
  saveContentAction,
  saveExperimentAction,
} from "@/lib/cms/actions";
import { LangTabs } from "@/components/admin/lang-tabs";
import { ConfirmDialog } from "@/components/admin/confirm";
import { useAdminToast } from "@/components/admin/toast";

export function ContentForm({
  copy,
  experiments,
}: {
  copy: CopyMap;
  experiments: CmsExperiment[];
}) {
  const router = useRouter();
  const { toast } = useAdminToast();
  const [locale, setLocale] = useState<"tr" | "en">("tr");
  const [saving, setSaving] = useState(false);
  const [pending, setPending] = useState<string | null>(null);

  return (
    <div className="space-y-10">
      <form
        className="space-y-6"
        onSubmit={async (event) => {
          event.preventDefault();
          setSaving(true);
          const result = await saveContentAction(new FormData(event.currentTarget));
          setSaving(false);
          if (!result.ok) {
            toast(result.error, "error");
            return;
          }
          toast("İçerik kaydedildi.");
          router.refresh();
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Site metinleri</h2>
          <LangTabs locale={locale} onChange={setLocale} />
        </div>

        {contentGroups.map((group) => (
          <section key={group.id} className="admin-card space-y-4">
            <h3 className="admin-section-title">{group.label}</h3>
            {group.keys.map((item) => (
              <div key={item.key}>
                <label className={locale === "tr" ? "admin-field" : "hidden"}>
                  <span>{item.label} (TR)</span>
                  {item.multiline ? (
                    <textarea
                      name={`${item.key}::tr`}
                      rows={4}
                      defaultValue={copy[item.key]?.tr ?? ""}
                    />
                  ) : (
                    <input
                      name={`${item.key}::tr`}
                      defaultValue={copy[item.key]?.tr ?? ""}
                    />
                  )}
                </label>
                <label className={locale === "en" ? "admin-field" : "hidden"}>
                  <span>{item.label} (EN)</span>
                  {item.multiline ? (
                    <textarea
                      name={`${item.key}::en`}
                      rows={4}
                      defaultValue={copy[item.key]?.en ?? ""}
                    />
                  ) : (
                    <input
                      name={`${item.key}::en`}
                      defaultValue={copy[item.key]?.en ?? ""}
                    />
                  )}
                </label>
              </div>
            ))}
          </section>
        ))}

        <button type="submit" className="admin-btn" disabled={saving}>
          Save
        </button>
      </form>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Lab</h2>
        {experiments.map((item) => (
          <form
            key={item.id}
            className="admin-card grid gap-3 md:grid-cols-2"
            onSubmit={async (event) => {
              event.preventDefault();
              const result = await saveExperimentAction(
                new FormData(event.currentTarget),
              );
              if (!result.ok) {
                toast(result.error, "error");
                return;
              }
              toast("Lab kaydı güncellendi.");
              router.refresh();
            }}
          >
            <input type="hidden" name="id" value={item.id} />
            <input type="hidden" name="sort_order" value={item.sortOrder} />
            <label className="admin-field">
              <span>Ad TR</span>
              <input name="name_tr" defaultValue={item.nameTr} />
            </label>
            <label className="admin-field">
              <span>Name EN</span>
              <input name="name_en" defaultValue={item.nameEn} />
            </label>
            <label className="admin-field">
              <span>Not TR</span>
              <textarea name="note_tr" rows={2} defaultValue={item.noteTr} />
            </label>
            <label className="admin-field">
              <span>Note EN</span>
              <textarea name="note_en" rows={2} defaultValue={item.noteEn} />
            </label>
            <label className="admin-field">
              <span>Status</span>
              <select name="status" defaultValue={item.status}>
                <option value="active">Active</option>
                <option value="building">Building</option>
                <option value="experimental">Experimental</option>
              </select>
            </label>
            <label className="admin-field">
              <span>Ref</span>
              <input name="ref" defaultValue={item.ref} />
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="published"
                defaultChecked={item.published}
              />
              Aktif
            </label>
            <div className="flex items-end gap-2">
              <button type="submit" className="admin-btn">
                Save
              </button>
              <button
                type="button"
                className="admin-btn-danger"
                onClick={() => setPending(item.id)}
              >
                Delete
              </button>
            </div>
          </form>
        ))}

        <form
          className="admin-card grid gap-3 md:grid-cols-2"
          onSubmit={async (event) => {
            event.preventDefault();
            const form = event.currentTarget;
            const result = await saveExperimentAction(new FormData(form));
            if (!result.ok) {
              toast(result.error, "error");
              return;
            }
            toast("Lab kaydı eklendi.");
            form.reset();
            router.refresh();
          }}
        >
          <h3 className="admin-section-title md:col-span-2">Yeni lab kaydı</h3>
          <input type="hidden" name="sort_order" value={experiments.length} />
          <input type="hidden" name="published" value="true" />
          <label className="admin-field">
            <span>Ad TR</span>
            <input name="name_tr" />
          </label>
          <label className="admin-field">
            <span>Name EN</span>
            <input name="name_en" />
          </label>
          <label className="admin-field">
            <span>Not TR</span>
            <textarea name="note_tr" rows={2} />
          </label>
          <label className="admin-field">
            <span>Note EN</span>
            <textarea name="note_en" rows={2} />
          </label>
          <label className="admin-field">
            <span>Status</span>
            <select name="status" defaultValue="experimental">
              <option value="active">Active</option>
              <option value="building">Building</option>
              <option value="experimental">Experimental</option>
            </select>
          </label>
          <label className="admin-field">
            <span>Ref</span>
            <input name="ref" />
          </label>
          <button type="submit" className="admin-btn">
            Add
          </button>
        </form>
      </section>

      <ConfirmDialog
        open={Boolean(pending)}
        title="Lab kaydını sil"
        body="Bu deney public siteden kalkar."
        onCancel={() => setPending(null)}
        onConfirm={async () => {
          if (!pending) return;
          const result = await deleteExperimentAction(pending);
          setPending(null);
          if (!result.ok) {
            toast(result.error, "error");
            return;
          }
          toast("Silindi.");
          router.refresh();
        }}
      />
    </div>
  );
}
