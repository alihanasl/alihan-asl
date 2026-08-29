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
import { ConfirmDialog } from "@/components/admin/confirm";
import { useAdminToast } from "@/components/admin/toast";
import { useAdminI18n } from "@/components/admin/admin-i18n";

export function ContentForm({
  copy,
  experiments,
}: {
  copy: CopyMap;
  experiments: CmsExperiment[];
}) {
  const router = useRouter();
  const { toast } = useAdminToast();
  const { t, contentLocale, fieldLabel, groupLabel, errorText } = useAdminI18n();
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
            toast(errorText(result.error), "error");
            return;
          }
          toast(t("content.saved"));
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">{t("content.siteCopy")}</h2>
        </div>

        {contentGroups.map((group) => (
          <section key={group.id} className="admin-card space-y-4">
            <h3 className="admin-section-title">{groupLabel(group.id)}</h3>
            {group.keys.map((item) => (
              <div key={item.key}>
                <label className={contentLocale === "tr" ? "admin-field" : "hidden"}>
                  <span>{fieldLabel(item.key)}</span>
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
                <label className={contentLocale === "en" ? "admin-field" : "hidden"}>
                  <span>{fieldLabel(item.key)}</span>
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
          {t("common.save")}
        </button>
      </form>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">{t("content.lab")}</h2>
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
                toast(errorText(result.error), "error");
                return;
              }
              toast(t("content.labUpdated"));
              router.refresh();
            }}
          >
            <input type="hidden" name="id" value={item.id} />
            <input type="hidden" name="sort_order" value={item.sortOrder} />
            <div className={contentLocale === "tr" ? "contents" : "hidden"}>
              <label className="admin-field">
                <span>{t("content.name")}</span>
                <input name="name_tr" defaultValue={item.nameTr} />
              </label>
              <label className="admin-field">
                <span>{t("content.note")}</span>
                <textarea name="note_tr" rows={2} defaultValue={item.noteTr} />
              </label>
            </div>
            <div className={contentLocale === "en" ? "contents" : "hidden"}>
              <label className="admin-field">
                <span>{t("content.name")}</span>
                <input name="name_en" defaultValue={item.nameEn} />
              </label>
              <label className="admin-field">
                <span>{t("content.note")}</span>
                <textarea name="note_en" rows={2} defaultValue={item.noteEn} />
              </label>
            </div>
            <label className="admin-field">
              <span>{t("content.status")}</span>
              <select name="status" defaultValue={item.status}>
                <option value="active">{t("content.statusActive")}</option>
                <option value="building">{t("content.statusBuilding")}</option>
                <option value="experimental">{t("content.statusExperimental")}</option>
              </select>
            </label>
            <label className="admin-field">
              <span>{t("content.ref")}</span>
              <input name="ref" defaultValue={item.ref} />
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="published"
                defaultChecked={item.published}
              />
              {t("content.active")}
            </label>
            <div className="flex items-end gap-2">
              <button type="submit" className="admin-btn">
                {t("common.save")}
              </button>
              <button
                type="button"
                className="admin-btn-danger"
                onClick={() => setPending(item.id)}
              >
                {t("common.delete")}
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
              toast(errorText(result.error), "error");
              return;
            }
            toast(t("content.labAdded"));
            form.reset();
            router.refresh();
          }}
        >
          <h3 className="admin-section-title md:col-span-2">{t("content.labNew")}</h3>
          <input type="hidden" name="sort_order" value={experiments.length} />
          <input type="hidden" name="published" value="true" />
          <div className={contentLocale === "tr" ? "contents" : "hidden"}>
            <label className="admin-field">
              <span>{t("content.name")}</span>
              <input name="name_tr" />
            </label>
            <label className="admin-field">
              <span>{t("content.note")}</span>
              <textarea name="note_tr" rows={2} />
            </label>
          </div>
          <div className={contentLocale === "en" ? "contents" : "hidden"}>
            <label className="admin-field">
              <span>{t("content.name")}</span>
              <input name="name_en" />
            </label>
            <label className="admin-field">
              <span>{t("content.note")}</span>
              <textarea name="note_en" rows={2} />
            </label>
          </div>
          <label className="admin-field">
            <span>{t("content.status")}</span>
            <select name="status" defaultValue="experimental">
              <option value="active">{t("content.statusActive")}</option>
              <option value="building">{t("content.statusBuilding")}</option>
              <option value="experimental">{t("content.statusExperimental")}</option>
            </select>
          </label>
          <label className="admin-field">
            <span>{t("content.ref")}</span>
            <input name="ref" />
          </label>
          <button type="submit" className="admin-btn">
            {t("common.add")}
          </button>
        </form>
      </section>

      <ConfirmDialog
        open={Boolean(pending)}
        title={t("content.deleteTitle")}
        body={t("content.deleteBody")}
        onCancel={() => setPending(null)}
        onConfirm={async () => {
          if (!pending) return;
          const result = await deleteExperimentAction(pending);
          setPending(null);
          if (!result.ok) {
            toast(errorText(result.error), "error");
            return;
          }
          toast(t("toasts.deleted"));
          router.refresh();
        }}
      />
    </div>
  );
}
