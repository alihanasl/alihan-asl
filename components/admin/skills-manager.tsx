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
  const [selected, setSelected] = useState<CmsSkill>(blank(items.length));
  const [locale, setLocale] = useState<"tr" | "en">("tr");
  const [pending, setPending] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Teknolojiler</h2>
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
            label: item.name,
            meta: item.category,
          }))}
          onSelect={(id) => {
            const item = items.find((entry) => entry.id === id);
            if (item) setSelected(item);
          }}
          onReorder={async (ids) => {
            const result = await reorderSkillsAction(ids);
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
          const result = await saveSkillAction(new FormData(event.currentTarget));
          setSaving(false);
          if (!result.ok) {
            toast(result.error, "error");
            return;
          }
          toast("Teknoloji kaydedildi.");
          router.refresh();
        }}
      >
        <div className="flex items-center justify-between">
          <h2 className="admin-section-title">
            {selected.id ? "Düzenle" : "Yeni teknoloji"}
          </h2>
          <LangTabs locale={locale} onChange={setLocale} />
        </div>
        {selected.id ? <input type="hidden" name="id" defaultValue={selected.id} /> : null}
        <input type="hidden" name="sort_order" defaultValue={selected.sortOrder} />
        <label className="admin-field">
          <span>Name</span>
          <input name="name" defaultValue={selected.name} />
        </label>
        <label className="admin-field">
          <span>Category</span>
          <select name="category" defaultValue={selected.category}>
            {skillCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
        </label>
        <div className={locale === "tr" ? "block" : "hidden"}>
          <label className="admin-field">
            <span>Not (TR)</span>
            <textarea name="note_tr" rows={3} defaultValue={selected.noteTr} />
          </label>
        </div>
        <div className={locale === "en" ? "block" : "hidden"}>
          <label className="admin-field">
            <span>Note (EN)</span>
            <textarea name="note_en" rows={3} defaultValue={selected.noteEn} />
          </label>
        </div>
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
        title="Teknolojiyi sil"
        body="Bu kayıt silinecek."
        onCancel={() => setPending(null)}
        onConfirm={async () => {
          if (!pending) return;
          const result = await deleteSkillAction(pending);
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
