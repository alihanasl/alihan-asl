"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CmsSkill } from "@/lib/cms/types";
import { skillCategories } from "@/lib/cms/keys";
import {
  deleteSkillAction,
  reorderSkillsAction,
  saveSkillAction,
} from "@/lib/cms/actions";
import { LangTabs } from "@/components/admin/lang-tabs";
import { SortableList } from "@/components/admin/sortable-list";
import { ConfirmDialog } from "@/components/admin/confirm";
import { useAdminToast } from "@/components/admin/toast";
import { useAdminI18n } from "@/components/admin/admin-i18n";
import type { AdminMessageKey } from "@/lib/i18n/admin";

const categoryKeys: Record<string, AdminMessageKey> = {
  frontend: "skills.catFrontend",
  backend: "skills.catBackend",
  database: "skills.catDatabase",
  infrastructure: "skills.catInfrastructure",
  tools: "skills.catTools",
};

function blank(order: number): CmsSkill {
  return {
    id: "",
    name: "",
    category: "tools",
    noteTr: "",
    noteEn: "",
    published: true,
    sortOrder: order,
  };
}

export function SkillsManager({ items }: { items: CmsSkill[] }) {
  const router = useRouter();
  const { toast } = useAdminToast();
  const { t, contentLocale, errorText } = useAdminI18n();
  const [selected, setSelected] = useState<CmsSkill>(blank(items.length));
  const [pending, setPending] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold">{t("skills.list")}</h2>
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
            label: item.name,
            meta: t(categoryKeys[item.category] ?? "skills.catTools"),
          }))}
          onSelect={(id) => {
            const item = items.find((entry) => entry.id === id);
            if (item) setSelected(item);
          }}
          onReorder={async (ids) => {
            const result = await reorderSkillsAction(ids);
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
          const result = await saveSkillAction(new FormData(event.currentTarget));
          setSaving(false);
          if (!result.ok) {
            toast(errorText(result.error), "error");
            return;
          }
          toast(t("skills.saved"));
          router.refresh();
        }}
      >
        <div className="flex items-center justify-between">
          <h2 className="admin-section-title">
            {selected.id ? t("skills.editItem") : t("skills.newItem")}
          </h2>
          <LangTabs />
        </div>
        {selected.id ? <input type="hidden" name="id" defaultValue={selected.id} /> : null}
        <input type="hidden" name="sort_order" defaultValue={selected.sortOrder} />
        <label className="admin-field">
          <span>{t("skills.name")}</span>
          <input name="name" defaultValue={selected.name} />
        </label>
        <label className="admin-field">
          <span>{t("skills.category")}</span>
          <select name="category" defaultValue={selected.category}>
            {skillCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {t(categoryKeys[category.id] ?? "skills.catTools")}
              </option>
            ))}
          </select>
        </label>
        <div className={contentLocale === "tr" ? "block" : "hidden"}>
          <label className="admin-field">
            <span>{t("skills.note")} (TR)</span>
            <textarea name="note_tr" rows={3} defaultValue={selected.noteTr} />
          </label>
        </div>
        <div className={contentLocale === "en" ? "block" : "hidden"}>
          <label className="admin-field">
            <span>{t("skills.note")} (EN)</span>
            <textarea name="note_en" rows={3} defaultValue={selected.noteEn} />
          </label>
        </div>
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
        title={t("skills.deleteTitle")}
        body={t("skills.deleteBody")}
        onCancel={() => setPending(null)}
        onConfirm={async () => {
          if (!pending) return;
          const result = await deleteSkillAction(pending);
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
