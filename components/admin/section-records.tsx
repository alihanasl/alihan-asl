"use client";

import { useState } from "react";
import type {
  CmsExperiment,
  CmsExperience,
  CmsProject,
  CmsSkill,
} from "@/lib/cms/types";
import {
  deleteExperimentAction,
  deleteExperienceAction,
  deleteProjectAction,
  deleteSkillAction,
  reorderExperiencesAction,
  reorderProjectsAction,
  reorderSkillsAction,
  saveExperimentAction,
  saveExperienceAction,
  saveSkillAction,
  upsertStudioProjectAction,
} from "@/lib/cms/actions";
import { MediaPicker } from "@/components/admin/media-manager";
import { ConfirmDialog } from "@/components/admin/confirm";
import { useAdminI18n } from "@/components/admin/admin-i18n";
import { useAdminToast } from "@/components/admin/toast";
import type { SiteSectionType } from "@/lib/cms/layout";

export function SectionRecords({
  type,
  projects,
  experiences,
  skills,
  experiments,
}: {
  type: SiteSectionType;
  projects: CmsProject[];
  experiences: CmsExperience[];
  skills: CmsSkill[];
  experiments: CmsExperiment[];
}) {
  if (type === "work") return <WorkRecords initial={projects} />;
  if (type === "about") return <ExperienceRecords initial={experiences} />;
  if (type === "lab") return <LabRecords initial={experiments} />;
  if (type === "toolbox") return <SkillsRecords initial={skills} />;
  return null;
}

function WorkRecords({ initial }: { initial: CmsProject[] }) {
  const { t, contentLocale, errorText } = useAdminI18n();
  const { toast } = useAdminToast();
  const [items, setItems] = useState(initial);
  const [picker, setPicker] = useState<{
    id: string;
    kind: "cover" | "gallery";
  } | null>(null);
  const [pending, setPending] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  async function patch(id: string | undefined, extra: Record<string, unknown>) {
    const result = await upsertStudioProjectAction(
      JSON.stringify({ id, locale: contentLocale, ...extra }),
    );
    if (!result.ok) {
      toast(errorText(result.error), "error");
      return null;
    }
    const project = "project" in result ? result.project : null;
    if (!project) return null;
    setItems((current) => {
      const index = current.findIndex((item) => item.id === project.id);
      if (index < 0) return [...current, project];
      const next = [...current];
      next[index] = project;
      return next;
    });
    return project;
  }

  return (
    <div className="space-y-3 border-t border-zinc-100 pt-4">
      <div>
        <h3 className="text-sm font-semibold">{t("pages.workItems")}</h3>
        <p className="mt-1 text-xs text-zinc-500">{t("pages.workHint")}</p>
      </div>
      {items.map((item, index) => (
        <article
          key={item.id}
          className="space-y-3 rounded-md border border-zinc-100 p-3"
        >
          <div className="flex gap-3">
            <button
              type="button"
              className="relative h-20 w-28 shrink-0 overflow-hidden rounded-md border border-zinc-200 bg-zinc-50"
              onClick={() => setPicker({ id: item.id, kind: "cover" })}
            >
              {item.coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.coverImage}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="flex h-full items-center justify-center px-2 text-center text-[11px] text-zinc-500">
                  {t("pages.addImage")}
                </span>
              )}
            </button>
            <div className="min-w-0 flex-1 space-y-2">
              <input
                className="admin-input w-full"
                value={
                  contentLocale === "tr" ? item.titleTr : item.titleEn
                }
                placeholder={t("projects.titleLabel")}
                onChange={(event) => {
                  const value = event.target.value;
                  setItems((current) =>
                    current.map((entry) =>
                      entry.id === item.id
                        ? contentLocale === "tr"
                          ? { ...entry, titleTr: value }
                          : { ...entry, titleEn: value }
                        : entry,
                    ),
                  );
                }}
                onBlur={(event) =>
                  void patch(item.id, { title: event.target.value })
                }
              />
              <textarea
                rows={2}
                className="admin-input w-full"
                value={
                  contentLocale === "tr"
                    ? item.shortDescriptionTr
                    : item.shortDescriptionEn
                }
                placeholder={t("projects.short")}
                onChange={(event) => {
                  const value = event.target.value;
                  setItems((current) =>
                    current.map((entry) =>
                      entry.id === item.id
                        ? contentLocale === "tr"
                          ? { ...entry, shortDescriptionTr: value }
                          : { ...entry, shortDescriptionEn: value }
                        : entry,
                    ),
                  );
                }}
                onBlur={(event) =>
                  void patch(item.id, { shortDescription: event.target.value })
                }
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              className="admin-input w-24"
              value={item.year}
              placeholder={t("projects.year")}
              onChange={(event) =>
                setItems((current) =>
                  current.map((entry) =>
                    entry.id === item.id
                      ? { ...entry, year: event.target.value }
                      : entry,
                  ),
                )
              }
              onBlur={(event) => void patch(item.id, { year: event.target.value })}
            />
            <input
              className="admin-input min-w-[12rem] flex-1"
              value={item.technologies.join(", ")}
              placeholder={t("projects.technologies")}
              onChange={(event) =>
                setItems((current) =>
                  current.map((entry) =>
                    entry.id === item.id
                      ? {
                          ...entry,
                          technologies: event.target.value
                            .split(",")
                            .map((part) => part.trim())
                            .filter(Boolean),
                        }
                      : entry,
                  ),
                )
              }
              onBlur={(event) =>
                void patch(item.id, { technologies: event.target.value })
              }
            />
            <label className="flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={item.published}
                onChange={(event) => {
                  const published = event.target.checked;
                  setItems((current) =>
                    current.map((entry) =>
                      entry.id === item.id ? { ...entry, published } : entry,
                    ),
                  );
                  void patch(item.id, { published });
                }}
              />
              {t("common.published")}
            </label>
            <button
              type="button"
              className="admin-btn-ghost"
              disabled={index === 0}
              onClick={() => {
                const next = [...items];
                const [moved] = next.splice(index, 1);
                next.splice(index - 1, 0, moved);
                setItems(next);
                void reorderProjectsAction(next.map((entry) => entry.id));
              }}
            >
              ↑
            </button>
            <button
              type="button"
              className="admin-btn-ghost"
              disabled={index === items.length - 1}
              onClick={() => {
                const next = [...items];
                const [moved] = next.splice(index, 1);
                next.splice(index + 1, 0, moved);
                setItems(next);
                void reorderProjectsAction(next.map((entry) => entry.id));
              }}
            >
              ↓
            </button>
            {item.coverImage ? (
              <button
                type="button"
                className="admin-btn-ghost"
                onClick={() => void patch(item.id, { coverImage: "" })}
              >
                {t("pages.removeImage")}
              </button>
            ) : null}
            <button
              type="button"
              className="admin-btn-ghost"
              onClick={() =>
                setOpenId((current) => (current === item.id ? null : item.id))
              }
            >
              {openId === item.id ? t("pages.hideStory") : t("pages.editStory")}
            </button>
            <button
              type="button"
              className="admin-btn-danger"
              onClick={() => setPending(item.id)}
            >
              {t("common.delete")}
            </button>
          </div>
          {openId === item.id ? (
            <div className="grid gap-2 md:grid-cols-2">
              {(
                [
                  ["problem", t("projects.problem")],
                  ["idea", t("projects.idea")],
                  ["build", t("projects.build")],
                  ["result", t("projects.result")],
                ] as const
              ).map(([key, label]) => {
                const value =
                  contentLocale === "tr"
                    ? item[`${key}Tr` as const]
                    : item[`${key}En` as const];
                return (
                  <label key={key} className="admin-field">
                    <span>{label}</span>
                    <textarea
                      rows={3}
                      value={value}
                      onChange={(event) => {
                        const nextValue = event.target.value;
                        setItems((current) =>
                          current.map((entry) =>
                            entry.id === item.id
                              ? contentLocale === "tr"
                                ? { ...entry, [`${key}Tr`]: nextValue }
                                : { ...entry, [`${key}En`]: nextValue }
                              : entry,
                          ),
                        );
                      }}
                      onBlur={(event) =>
                        void patch(item.id, { [key]: event.target.value })
                      }
                    />
                  </label>
                );
              })}
              <div className="md:col-span-2">
                <p className="mb-2 text-xs text-zinc-500">{t("pages.gallery")}</p>
                <div className="flex flex-wrap gap-2">
                  {item.gallery.map((url) => (
                    <span key={url} className="relative block h-16 w-20 overflow-hidden rounded border">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        className="absolute top-0.5 right-0.5 rounded bg-white/90 px-1 text-[10px] text-red-700"
                        onClick={() =>
                          void patch(item.id, {
                            gallery: item.gallery.filter((entry) => entry !== url),
                          })
                        }
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <button
                    type="button"
                    className="admin-btn-ghost h-16"
                    onClick={() => setPicker({ id: item.id, kind: "gallery" })}
                  >
                    {t("pages.addImage")}
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </article>
      ))}
      <button
        type="button"
        className="admin-btn"
        onClick={async () => {
          const created = await patch(undefined, {
            title: contentLocale === "tr" ? "Yeni iş" : "New work",
            published: true,
          });
          if (created) setOpenId(created.id);
        }}
      >
        {t("pages.addWork")}
      </button>

      <MediaPicker
        open={picker !== null}
        onClose={() => setPicker(null)}
        onSelect={(url) => {
          if (!picker) return;
          const item = items.find((entry) => entry.id === picker.id);
          if (picker.kind === "cover") {
            void patch(picker.id, { coverImage: url });
            return;
          }
          void patch(picker.id, {
            gallery: item?.gallery.includes(url)
              ? item.gallery
              : [...(item?.gallery ?? []), url],
          });
        }}
      />

      <ConfirmDialog
        open={Boolean(pending)}
        title={t("projects.deleteTitle")}
        body={t("projects.deleteBody")}
        onCancel={() => setPending(null)}
        onConfirm={async () => {
          if (!pending) return;
          const result = await deleteProjectAction(pending);
          setPending(null);
          if (!result.ok) {
            toast(errorText(result.error), "error");
            return;
          }
          setItems((current) => current.filter((item) => item.id !== pending));
          toast(t("projects.deletedToast"));
        }}
      />
    </div>
  );
}

function ExperienceRecords({ initial }: { initial: CmsExperience[] }) {
  const { t, contentLocale, errorText } = useAdminI18n();
  const { toast } = useAdminToast();
  const [items, setItems] = useState(initial);

  async function save(item: CmsExperience, index: number) {
    const form = new FormData();
    if (item.id) form.set("id", item.id);
    form.set("field_tr", item.fieldTr);
    form.set("field_en", item.fieldEn);
    form.set("context_tr", item.contextTr);
    form.set("context_en", item.contextEn);
    form.set("description_tr", item.descriptionTr);
    form.set("description_en", item.descriptionEn);
    form.set("company", item.company);
    form.set("start_date", item.startDate);
    form.set("end_date", item.endDate);
    if (item.isCurrent) form.set("is_current", "true");
    form.set("published", "true");
    form.set("sort_order", String(item.sortOrder));
    const result = await saveExperienceAction(form);
    if (!result.ok) {
      toast(errorText(result.error), "error");
      return;
    }
    if (result.id && result.id !== item.id) {
      setItems((current) =>
        current.map((entry, i) => (i === index ? { ...item, id: result.id } : entry)),
      );
    }
  }

  return (
    <div className="space-y-3 border-t border-zinc-100 pt-4">
      <h3 className="text-sm font-semibold">{t("pages.experienceItems")}</h3>
      {items.map((item, index) => (
        <div key={item.id || `new-${index}`} className="grid gap-2 rounded-md border border-zinc-100 p-3 md:grid-cols-2">
          <input
            className="admin-input"
            placeholder={t("experience.field")}
            value={contentLocale === "tr" ? item.fieldTr : item.fieldEn}
            onChange={(event) => {
              const value = event.target.value;
              setItems((current) =>
                current.map((entry, i) =>
                  i === index
                    ? contentLocale === "tr"
                      ? { ...entry, fieldTr: value }
                      : { ...entry, fieldEn: value }
                    : entry,
                ),
              );
            }}
            onBlur={(event) =>
              void save(
                contentLocale === "tr"
                  ? { ...item, fieldTr: event.target.value }
                  : { ...item, fieldEn: event.target.value },
                index,
              )
            }
          />
          <input
            className="admin-input"
            placeholder={t("experience.context")}
            value={contentLocale === "tr" ? item.contextTr : item.contextEn}
            onChange={(event) => {
              const value = event.target.value;
              setItems((current) =>
                current.map((entry, i) =>
                  i === index
                    ? contentLocale === "tr"
                      ? { ...entry, contextTr: value }
                      : { ...entry, contextEn: value }
                    : entry,
                ),
              );
            }}
            onBlur={(event) =>
              void save(
                contentLocale === "tr"
                  ? { ...item, contextTr: event.target.value }
                  : { ...item, contextEn: event.target.value },
                index,
              )
            }
          />
          <div className="flex gap-2 md:col-span-2">
            <button
              type="button"
              className="admin-btn-danger"
              onClick={async () => {
                if (item.id) {
                  const result = await deleteExperienceAction(item.id);
                  if (!result.ok) {
                    toast(errorText(result.error), "error");
                    return;
                  }
                }
                const next = items.filter((_, i) => i !== index);
                setItems(next);
                void reorderExperiencesAction(next.map((entry) => entry.id));
              }}
            >
              {t("common.delete")}
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        className="admin-btn-ghost"
        onClick={() =>
          setItems((current) => [
            ...current,
            {
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
              sortOrder: current.length,
            },
          ])
        }
      >
        {t("pages.addExperience")}
      </button>
    </div>
  );
}

function LabRecords({ initial }: { initial: CmsExperiment[] }) {
  const { t, contentLocale, errorText } = useAdminI18n();
  const { toast } = useAdminToast();
  const [items, setItems] = useState(initial);

  async function save(item: CmsExperiment, index: number) {
    const form = new FormData();
    if (item.id) form.set("id", item.id);
    form.set("name_tr", item.nameTr);
    form.set("name_en", item.nameEn);
    form.set("note_tr", item.noteTr);
    form.set("note_en", item.noteEn);
    form.set("status", item.status);
    form.set("ref", item.ref);
    form.set("published", "true");
    form.set("sort_order", String(item.sortOrder));
    const result = await saveExperimentAction(form);
    if (!result.ok) {
      toast(errorText(result.error), "error");
      return;
    }
    if (result.id && result.id !== item.id) {
      setItems((current) =>
        current.map((entry, i) => (i === index ? { ...item, id: result.id } : entry)),
      );
    }
  }

  return (
    <div className="space-y-3 border-t border-zinc-100 pt-4">
      <h3 className="text-sm font-semibold">{t("pages.labItems")}</h3>
      {items.map((item, index) => (
        <div key={item.id || `lab-${index}`} className="grid gap-2 rounded-md border border-zinc-100 p-3">
          <input
            className="admin-input"
            placeholder={t("content.name")}
            value={contentLocale === "tr" ? item.nameTr : item.nameEn}
            onChange={(event) => {
              const value = event.target.value;
              setItems((current) =>
                current.map((entry, i) =>
                  i === index
                    ? contentLocale === "tr"
                      ? { ...entry, nameTr: value }
                      : { ...entry, nameEn: value }
                    : entry,
                ),
              );
            }}
            onBlur={(event) =>
              void save(
                contentLocale === "tr"
                  ? { ...item, nameTr: event.target.value }
                  : { ...item, nameEn: event.target.value },
                index,
              )
            }
          />
          <textarea
            rows={2}
            className="admin-input"
            placeholder={t("content.note")}
            value={contentLocale === "tr" ? item.noteTr : item.noteEn}
            onChange={(event) => {
              const value = event.target.value;
              setItems((current) =>
                current.map((entry, i) =>
                  i === index
                    ? contentLocale === "tr"
                      ? { ...entry, noteTr: value }
                      : { ...entry, noteEn: value }
                    : entry,
                ),
              );
            }}
            onBlur={(event) =>
              void save(
                contentLocale === "tr"
                  ? { ...item, noteTr: event.target.value }
                  : { ...item, noteEn: event.target.value },
                index,
              )
            }
          />
          <button
            type="button"
            className="admin-btn-danger justify-self-start"
            onClick={async () => {
              if (item.id) {
                const result = await deleteExperimentAction(item.id);
                if (!result.ok) {
                  toast(errorText(result.error), "error");
                  return;
                }
              }
              setItems((current) => current.filter((_, i) => i !== index));
            }}
          >
            {t("common.delete")}
          </button>
        </div>
      ))}
      <button
        type="button"
        className="admin-btn-ghost"
        onClick={() =>
          setItems((current) => [
            ...current,
            {
              id: "",
              nameTr: "",
              nameEn: "",
              noteTr: "",
              noteEn: "",
              status: "experimental",
              ref: String(current.length + 1).padStart(2, "0"),
              published: true,
              sortOrder: current.length,
            },
          ])
        }
      >
        {t("pages.addLab")}
      </button>
    </div>
  );
}

function SkillsRecords({ initial }: { initial: CmsSkill[] }) {
  const { t, errorText } = useAdminI18n();
  const { toast } = useAdminToast();
  const [items, setItems] = useState(initial);

  async function save(item: CmsSkill, index: number) {
    if (!item.name.trim()) return;
    const form = new FormData();
    if (item.id) form.set("id", item.id);
    form.set("name", item.name);
    form.set("category", item.category);
    form.set("note_tr", item.noteTr);
    form.set("note_en", item.noteEn);
    form.set("published", "true");
    form.set("sort_order", String(item.sortOrder));
    const result = await saveSkillAction(form);
    if (!result.ok) {
      toast(errorText(result.error), "error");
      return;
    }
    if (result.id && result.id !== item.id) {
      setItems((current) =>
        current.map((entry, i) => (i === index ? { ...item, id: result.id } : entry)),
      );
    }
  }

  return (
    <div className="space-y-3 border-t border-zinc-100 pt-4">
      <h3 className="text-sm font-semibold">{t("pages.skillItems")}</h3>
      {items.map((item, index) => (
        <div key={item.id || `skill-${index}`} className="flex gap-2">
          <input
            className="admin-input flex-1"
            value={item.name}
            onChange={(event) =>
              setItems((current) =>
                current.map((entry, i) =>
                  i === index ? { ...entry, name: event.target.value } : entry,
                ),
              )
            }
            onBlur={(event) =>
              void save({ ...item, name: event.target.value }, index)
            }
          />
          <button
            type="button"
            className="admin-btn-danger"
            onClick={async () => {
              if (item.id) {
                const result = await deleteSkillAction(item.id);
                if (!result.ok) {
                  toast(errorText(result.error), "error");
                  return;
                }
              }
              const next = items.filter((_, i) => i !== index);
              setItems(next);
              void reorderSkillsAction(next.map((entry) => entry.id).filter(Boolean));
            }}
          >
            {t("common.delete")}
          </button>
        </div>
      ))}
      <button
        type="button"
        className="admin-btn-ghost"
        onClick={() =>
          setItems((current) => [
            ...current,
            {
              id: "",
              name: "",
              category: "tools",
              noteTr: "",
              noteEn: "",
              published: true,
              sortOrder: current.length,
            },
          ])
        }
      >
        {t("pages.addSkill")}
      </button>
    </div>
  );
}
