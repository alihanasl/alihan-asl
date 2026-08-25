"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { CmsProject } from "@/lib/cms/types";
import { layouts } from "@/lib/cms/types";
import { slugify } from "@/lib/cms/present";
import { deleteProjectAction, saveProjectAction } from "@/lib/cms/actions";
import { MediaPicker } from "@/components/admin/media-manager";
import { ConfirmDialog } from "@/components/admin/confirm";
import { useAdminToast } from "@/components/admin/toast";
import { useAdminI18n } from "@/components/admin/admin-i18n";

const emptyProject: CmsProject = {
  id: "",
  slug: "",
  titleTr: "",
  titleEn: "",
  shortDescriptionTr: "",
  shortDescriptionEn: "",
  problemTr: "",
  problemEn: "",
  ideaTr: "",
  ideaEn: "",
  buildTr: "",
  buildEn: "",
  resultTr: "",
  resultEn: "",
  captionTr: "",
  captionEn: "",
  category: "tools",
  technologies: [],
  year: "",
  githubUrl: "",
  liveUrl: "",
  coverImage: "",
  gallery: [],
  featured: false,
  published: false,
  sortOrder: 0,
  layout: "visual-right",
};

export function ProjectForm({
  project,
  nextOrder,
}: {
  project?: CmsProject;
  nextOrder: number;
}) {
  const router = useRouter();
  const { toast } = useAdminToast();
  const { t, contentLocale, errorText } = useAdminI18n();
  const initial = project ?? { ...emptyProject, sortOrder: nextOrder };
  const [titleTr, setTitleTr] = useState(initial.titleTr);
  const [titleEn, setTitleEn] = useState(initial.titleEn);
  const [slug, setSlug] = useState(initial.slug);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial.slug));
  const [featured, setFeatured] = useState(initial.featured);
  const [cover, setCover] = useState(initial.coverImage);
  const [gallery, setGallery] = useState(initial.gallery.join("\n"));
  const [picker, setPicker] = useState<"cover" | "gallery" | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const derivedSlug = useMemo(
    () => slugify(slugTouched ? slug : titleEn || titleTr),
    [slug, slugTouched, titleEn, titleTr],
  );

  async function submit(publish: boolean) {
    setSaving(true);
    const form = new FormData(document.getElementById("project-form") as HTMLFormElement);
    form.set("published", publish ? "true" : "false");
    form.set("featured", featured ? "true" : "false");
    form.set("cover_image", cover);
    form.set(
      "gallery",
      gallery
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .join(","),
    );
    form.set("slug", derivedSlug);
    const result = await saveProjectAction(form);
    setSaving(false);
    if (!result.ok) {
      toast(errorText(result.error), "error");
      return;
    }
    toast(publish ? t("projects.publishedToast") : t("projects.draftToast"));
    router.push("/admin/projects");
    router.refresh();
  }

  return (
    <>
      <form id="project-form" className="space-y-8" onSubmit={(event) => event.preventDefault()}>
        {initial.id ? <input type="hidden" name="id" value={initial.id} /> : null}

        <section className="admin-card">
          <h2 className="admin-section-title">{t("projects.info")}</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="admin-field">
              <span>{t("projects.slug")}</span>
              <input
                name="slug_display"
                value={derivedSlug}
                onChange={(event) => {
                  setSlugTouched(true);
                  setSlug(event.target.value);
                }}
              />
            </label>
            <label className="admin-field">
              <span>{t("projects.category")}</span>
              <select name="category" defaultValue={initial.category}>
                <option value="desktop">{t("projects.catDesktop")}</option>
                <option value="platform">{t("projects.catPlatform")}</option>
                <option value="ai">{t("projects.catAi")}</option>
                <option value="tools">{t("projects.catTools")}</option>
              </select>
            </label>
            <label className="admin-field">
              <span>{t("projects.year")}</span>
              <input name="year" defaultValue={initial.year} />
            </label>
            <label className="admin-field">
              <span>{t("projects.layout")}</span>
              <select name="layout" defaultValue={initial.layout}>
                {layouts.map((layout) => (
                  <option key={layout} value={layout}>
                    {layout}
                  </option>
                ))}
              </select>
            </label>
            <label className="admin-field md:col-span-2">
              <span>{t("projects.technologies")}</span>
              <input
                name="technologies"
                defaultValue={initial.technologies.join(", ")}
              />
            </label>
            <label className="admin-field">
              <span>{t("projects.sortOrder")}</span>
              <input
                name="sort_order"
                type="number"
                defaultValue={initial.sortOrder}
              />
            </label>
          </div>
        </section>

        <section className="admin-card">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="admin-section-title">{t("projects.content")}</h2>
          </div>

          <div className={contentLocale === "tr" ? "mt-4 space-y-4" : "hidden"}>
            <label className="admin-field">
              <span>{t("projects.titleLabel")}</span>
              <input
                name="title_tr"
                value={titleTr}
                onChange={(event) => setTitleTr(event.target.value)}
              />
            </label>
            <label className="admin-field">
              <span>{t("projects.short")}</span>
              <textarea name="short_description_tr" rows={3} defaultValue={initial.shortDescriptionTr} />
            </label>
            <label className="admin-field">
              <span>{t("projects.problem")}</span>
              <textarea name="problem_tr" rows={4} defaultValue={initial.problemTr} />
            </label>
            <label className="admin-field">
              <span>{t("projects.idea")}</span>
              <textarea name="idea_tr" rows={4} defaultValue={initial.ideaTr} />
            </label>
            <label className="admin-field">
              <span>{t("projects.build")}</span>
              <textarea name="build_tr" rows={4} defaultValue={initial.buildTr} />
            </label>
            <label className="admin-field">
              <span>{t("projects.result")}</span>
              <textarea name="result_tr" rows={3} defaultValue={initial.resultTr} />
            </label>
            <label className="admin-field">
              <span>{t("projects.caption")}</span>
              <input name="caption_tr" defaultValue={initial.captionTr} />
            </label>
          </div>

          <div className={contentLocale === "en" ? "mt-4 space-y-4" : "hidden"}>
            <label className="admin-field">
              <span>{t("projects.titleLabel")}</span>
              <input
                name="title_en"
                value={titleEn}
                onChange={(event) => setTitleEn(event.target.value)}
              />
            </label>
            <label className="admin-field">
              <span>{t("projects.short")}</span>
              <textarea name="short_description_en" rows={3} defaultValue={initial.shortDescriptionEn} />
            </label>
            <label className="admin-field">
              <span>{t("projects.problem")}</span>
              <textarea name="problem_en" rows={4} defaultValue={initial.problemEn} />
            </label>
            <label className="admin-field">
              <span>{t("projects.idea")}</span>
              <textarea name="idea_en" rows={4} defaultValue={initial.ideaEn} />
            </label>
            <label className="admin-field">
              <span>{t("projects.build")}</span>
              <textarea name="build_en" rows={4} defaultValue={initial.buildEn} />
            </label>
            <label className="admin-field">
              <span>{t("projects.result")}</span>
              <textarea name="result_en" rows={3} defaultValue={initial.resultEn} />
            </label>
            <label className="admin-field">
              <span>{t("projects.caption")}</span>
              <input name="caption_en" defaultValue={initial.captionEn} />
            </label>
          </div>
        </section>

        <section className="admin-card">
          <h2 className="admin-section-title">{t("projects.links")}</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="admin-field">
              <span>{t("projects.github")}</span>
              <input name="github_url" defaultValue={initial.githubUrl} />
            </label>
            <label className="admin-field">
              <span>{t("projects.live")}</span>
              <input name="live_url" defaultValue={initial.liveUrl} />
            </label>
          </div>
        </section>

        <section className="admin-card">
          <h2 className="admin-section-title">{t("projects.media")}</h2>
          <div className="mt-4 space-y-4">
            <div>
              <p className="mb-2 text-sm text-zinc-600">{t("projects.cover")}</p>
              {cover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={cover} alt="" className="mb-2 h-28 rounded-md object-cover" />
              ) : null}
              <div className="flex gap-2">
                <button type="button" className="admin-btn-ghost" onClick={() => setPicker("cover")}>
                  {t("common.select")}
                </button>
                {cover ? (
                  <button type="button" className="admin-btn-ghost" onClick={() => setCover("")}>
                    {t("common.remove")}
                  </button>
                ) : null}
              </div>
            </div>
            <label className="admin-field">
              <span>{t("projects.gallery")}</span>
              <textarea
                rows={4}
                value={gallery}
                onChange={(event) => setGallery(event.target.value)}
              />
            </label>
            <button type="button" className="admin-btn-ghost" onClick={() => setPicker("gallery")}>
              {t("projects.addGallery")}
            </button>
          </div>
        </section>

        <section className="admin-card">
          <h2 className="admin-section-title">{t("projects.settings")}</h2>
          <div className="mt-4 flex flex-col gap-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={featured}
                onChange={(event) => setFeatured(event.target.checked)}
              />
              {t("projects.featured")}
            </label>
            <p className="text-xs text-zinc-500">{t("projects.publishHint")}</p>
          </div>
        </section>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="admin-btn"
            disabled={saving}
            onClick={() => void submit(true)}
          >
            {t("common.publish")}
          </button>
          <button
            type="button"
            className="admin-btn-ghost"
            disabled={saving}
            onClick={() => void submit(false)}
          >
            {t("common.draft")}
          </button>
          <Link href="/admin/projects" className="admin-btn-ghost">
            {t("common.cancel")}
          </Link>
          {initial.id ? (
            <button
              type="button"
              className="admin-btn-danger ml-auto"
              onClick={() => setConfirmDelete(true)}
            >
              {t("common.delete")}
            </button>
          ) : null}
        </div>
      </form>

      <MediaPicker
        open={picker !== null}
        onClose={() => setPicker(null)}
        onSelect={(url) => {
          if (picker === "cover") {
            setCover(url);
            return;
          }
          setGallery((current) =>
            current.includes(url) ? current : `${current}\n${url}`.trim(),
          );
        }}
      />

      <ConfirmDialog
        open={confirmDelete}
        title={t("projects.deleteTitle")}
        body={t("projects.deleteBody")}
        onCancel={() => setConfirmDelete(false)}
        onConfirm={async () => {
          const result = await deleteProjectAction(initial.id);
          if (!result.ok) {
            toast(errorText(result.error), "error");
            return;
          }
          toast(t("projects.deletedToast"));
          router.push("/admin/projects");
          router.refresh();
        }}
      />
    </>
  );
}
