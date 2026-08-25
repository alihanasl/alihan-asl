"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GripVertical, EyeOff, Plus, Trash2 } from "lucide-react";
import type { CopyMap, Profile, CmsProject, CmsExperience, CmsSkill, CmsExperiment } from "@/lib/cms/types";
import {
  blankSection,
  copyKeysBySection,
  emptyLocalized,
  pickLocalized,
  sectionTypes,
  type Localized,
  type SiteButton,
  type SiteLayout,
  type SiteSection,
  type SiteSectionType,
} from "@/lib/cms/layout";
import { saveSiteLayoutAction } from "@/lib/cms/actions";
import { useAdminI18n } from "@/components/admin/admin-i18n";
import { useAdminToast } from "@/components/admin/toast";
import { MediaPicker } from "@/components/admin/media-manager";
import { ConfirmDialog } from "@/components/admin/confirm";
import { SectionRecords } from "@/components/admin/section-records";

function setLoc(value: Localized, locale: "tr" | "en", next: string): Localized {
  return { ...value, [locale]: next };
}

export function PageStudio({
  layout: initialLayout,
  copy: initialCopy,
  profile: initialProfile,
  pageId,
  projects,
  experiences,
  skills,
  experiments,
}: {
  layout: SiteLayout;
  copy: CopyMap;
  profile: Profile;
  pageId: string;
  projects: CmsProject[];
  experiences: CmsExperience[];
  skills: CmsSkill[];
  experiments: CmsExperiment[];
}) {
  const router = useRouter();
  const { t, contentLocale, errorText, fieldLabel } = useAdminI18n();
  const { toast } = useAdminToast();
  const page = initialLayout.pages.find((item) => item.id === pageId);
  const [layout, setLayout] = useState(initialLayout);
  const [copy, setCopy] = useState(initialCopy);
  const [profile, setProfile] = useState(initialProfile);
  const [selected, setSelected] = useState(
    page?.focusSection || layout.sections[0]?.id || "menu",
  );
  const [saving, setSaving] = useState(false);
  const [picker, setPicker] = useState<"image" | "gallery" | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);

  const section = layout.sections.find((item) => item.id === selected);
  const chrome = selected === "menu" || selected === "footer";

  const previewHeading = section
    ? pickLocalized(contentLocale, section.heading) ||
      (copyKeysBySection[section.type]?.[1]
        ? copy[copyKeysBySection[section.type]![1]]?.[contentLocale]
        : "")
    : "";
  const previewBody = section
    ? pickLocalized(contentLocale, section.body) ||
      (copyKeysBySection[section.type]?.[2]
        ? copy[copyKeysBySection[section.type]![2]]?.[contentLocale]
        : "")
    : "";

  const sidebar = useMemo(
    () => [
      { id: "menu", label: t("pages.menu") },
      { id: "footer", label: t("pages.footer") },
      ...layout.sections.map((item) => ({
        id: item.id,
        label:
          sectionTypes.find((type) => type.id === item.type)?.label[contentLocale] ||
          item.type,
        hidden: !item.visible,
      })),
    ],
    [layout.sections, contentLocale, t],
  );

  function updateSection(id: string, patch: Partial<SiteSection>) {
    setLayout((current) => ({
      ...current,
      sections: current.sections.map((item) =>
        item.id === id ? { ...item, ...patch } : item,
      ),
    }));
  }

  function reorder(fromId: string, toId: string) {
    if (fromId === toId) return;
    setLayout((current) => {
      const ids = current.sections.map((item) => item.id);
      const from = ids.indexOf(fromId);
      const to = ids.indexOf(toId);
      if (from < 0 || to < 0) return current;
      const next = [...current.sections];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return { ...current, sections: next };
    });
  }

  async function save() {
    setSaving(true);
    const result = await saveSiteLayoutAction(
      JSON.stringify({ layout, copy, profile }),
    );
    setSaving(false);
    if (!result.ok) {
      toast(errorText(result.error), "error");
      return;
    }
    toast(t("pages.saved"));
    router.refresh();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[16rem_minmax(0,1fr)_18rem]">
      <aside>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold">{t("pages.sections")}</h2>
          <label className="admin-field !flex-row items-center gap-2 text-xs">
            <span className="sr-only">{t("pages.addSection")}</span>
            <select
              defaultValue=""
              onChange={(event) => {
                const type = event.target.value as SiteSectionType;
                if (!type) return;
                const next = blankSection(type);
                setLayout((current) => ({
                  ...current,
                  sections: [...current.sections, next],
                }));
                setSelected(next.id);
                event.target.value = "";
              }}
            >
              <option value="">{t("pages.addSection")}</option>
              {sectionTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.label[contentLocale]}
                </option>
              ))}
            </select>
          </label>
        </div>
        <ul className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
          {sidebar.map((item) => (
            <li
              key={item.id}
              draggable={item.id !== "menu" && item.id !== "footer"}
              onDragStart={() => setDragId(item.id)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => {
                if (dragId && item.id !== "menu" && item.id !== "footer") {
                  reorder(dragId, item.id);
                }
                setDragId(null);
              }}
              className="border-b border-zinc-100 last:border-0"
            >
              <button
                type="button"
                onClick={() => setSelected(item.id)}
                className={
                  selected === item.id
                    ? "flex w-full items-center gap-2 bg-zinc-100 px-3 py-2.5 text-left text-sm"
                    : "flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-zinc-600 hover:bg-zinc-50"
                }
              >
                {item.id !== "menu" && item.id !== "footer" ? (
                  <GripVertical className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
                ) : (
                  <span className="w-3.5" />
                )}
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                {"hidden" in item && item.hidden ? (
                  <EyeOff className="h-3.5 w-3.5 text-zinc-400" />
                ) : null}
              </button>
            </li>
          ))}
        </ul>
        {page?.recordsHref ? (
          <Link href={page.recordsHref} className="admin-btn-ghost mt-4 inline-flex">
            {t("pages.openRecords")}
          </Link>
        ) : null}
      </aside>

      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {page ? pickLocalized(contentLocale, page.title) : t("pages.title")}
            </h1>
            <p className="mt-1 text-sm text-zinc-500">{t("pages.lead")}</p>
          </div>
          <button type="button" className="admin-btn" disabled={saving} onClick={() => void save()}>
            {saving ? t("common.saving") : t("common.save")}
          </button>
        </div>

        {selected === "menu" ? (
          <MenuEditor layout={layout} setLayout={setLayout} locale={contentLocale} />
        ) : null}
        {selected === "footer" ? (
          <FooterEditor
            layout={layout}
            setLayout={setLayout}
            copy={copy}
            setCopy={setCopy}
            profile={profile}
            setProfile={setProfile}
            locale={contentLocale}
          />
        ) : null}
        {section ? (
          <section className="admin-card space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="admin-section-title">
                {sectionTypes.find((type) => type.id === section.type)?.label[contentLocale]}
              </h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="admin-btn-ghost"
                  onClick={() =>
                    updateSection(section.id, { visible: !section.visible })
                  }
                >
                  {section.visible ? t("pages.hide") : t("pages.show")}
                </button>
                <button
                  type="button"
                  className="admin-btn-danger"
                  onClick={() => setPendingDelete(section.id)}
                >
                  {t("common.delete")}
                </button>
              </div>
            </div>

            {(copyKeysBySection[section.type] ?? []).map((key) => {
              const multiline = /copy|tagline|description|manifesto/.test(key);
              const value = copy[key]?.[contentLocale] ?? "";
              return (
                <label key={key} className="admin-field">
                  <span>{fieldLabel(key)}</span>
                  {multiline ? (
                    <textarea
                      rows={4}
                      value={value}
                      onChange={(event) =>
                        setCopy((current) => ({
                          ...current,
                          [key]: {
                            ...current[key],
                            [contentLocale]: event.target.value,
                          },
                        }))
                      }
                    />
                  ) : (
                    <input
                      value={value}
                      onChange={(event) =>
                        setCopy((current) => ({
                          ...current,
                          [key]: {
                            ...current[key],
                            [contentLocale]: event.target.value,
                          },
                        }))
                      }
                    />
                  )}
                </label>
              );
            })}

            {!copyKeysBySection[section.type] ? (
              <>
                <label className="admin-field">
                  <span>{t("pages.heading")}</span>
                  <input
                    value={section.heading[contentLocale] ?? ""}
                    onChange={(event) =>
                      updateSection(section.id, {
                        heading: setLoc(section.heading, contentLocale, event.target.value),
                      })
                    }
                  />
                </label>
                <label className="admin-field">
                  <span>{t("pages.body")}</span>
                  <textarea
                    rows={4}
                    value={section.body[contentLocale] ?? ""}
                    onChange={(event) =>
                      updateSection(section.id, {
                        body: setLoc(section.body, contentLocale, event.target.value),
                      })
                    }
                  />
                </label>
              </>
            ) : null}

            <div>
              <p className="mb-2 text-sm text-zinc-600">{t("pages.image")}</p>
              {section.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={section.image} alt="" className="mb-2 h-24 rounded-md object-cover" />
              ) : null}
              <div className="flex gap-2">
                <button type="button" className="admin-btn-ghost" onClick={() => setPicker("image")}>
                  {t("common.select")}
                </button>
                {section.image ? (
                  <button
                    type="button"
                    className="admin-btn-ghost"
                    onClick={() => updateSection(section.id, { image: "" })}
                  >
                    {t("common.remove")}
                  </button>
                ) : null}
              </div>
            </div>

            {section.type === "gallery" ? (
              <div>
                <p className="mb-2 text-sm text-zinc-600">{t("pages.gallery")}</p>
                <button type="button" className="admin-btn-ghost" onClick={() => setPicker("gallery")}>
                  {t("pages.addImage")}
                </button>
                <ul className="mt-3 grid grid-cols-3 gap-2">
                  {section.gallery.map((url) => (
                    <li key={url} className="relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="" className="aspect-[4/3] w-full object-cover" />
                      <button
                        type="button"
                        className="absolute top-1 right-1 rounded bg-white/90 px-1 text-xs text-red-700"
                        onClick={() =>
                          updateSection(section.id, {
                            gallery: section.gallery.filter((item) => item !== url),
                          })
                        }
                      >
                        {t("common.remove")}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <ItemsEditor
              section={section}
              locale={contentLocale}
              onChange={(items) => updateSection(section.id, { items })}
            />

            <ButtonEditor
              buttons={section.buttons}
              locale={contentLocale}
              onChange={(buttons) => updateSection(section.id, { buttons })}
            />

            <SectionRecords
              type={section.type}
              projects={projects}
              experiences={experiences}
              skills={skills}
              experiments={experiments}
            />
          </section>
        ) : null}

        {!chrome && !section ? (
          <p className="text-sm text-zinc-500">{t("pages.pickSection")}</p>
        ) : null}
      </div>

      <aside className="xl:block">
        <div className="sticky top-20 overflow-hidden rounded-lg border border-zinc-200 bg-[#e4e2dc] p-5 text-[#161615]">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8a867e]">
            {t("pages.preview")} · {contentLocale.toUpperCase()}
          </p>
          {selected === "menu" ? (
            <ul className="mt-6 space-y-3">
              {layout.menu
                .filter((item) => item.visible)
                .map((item) => (
                  <li
                    key={item.id}
                    className="font-mono text-[11px] uppercase tracking-[0.2em]"
                  >
                    {pickLocalized(contentLocale, item.label) || item.href}
                  </li>
                ))}
            </ul>
          ) : selected === "footer" ? (
            <div className="mt-6 space-y-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[#8a867e]">
              <p>{copy["footer.descriptor"]?.[contentLocale]}</p>
              <p>{copy["footer.note"]?.[contentLocale]}</p>
              {layout.footer.links.map((link) => (
                <p key={link.id}>{pickLocalized(contentLocale, link.label)}</p>
              ))}
            </div>
          ) : (
            <>
              <p className="font-display mt-6 text-[2rem] leading-[0.95] tracking-[-0.04em]">
                {previewHeading || "—"}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-[#3c3b38]">
                {previewBody || t("pages.previewEmpty")}
              </p>
              {section?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={section.image} alt="" className="mt-4 max-h-32 w-full object-cover" />
              ) : null}
              <div className="mt-6 flex flex-col gap-2">
                {(section?.buttons ?? []).map((button) => (
                  <span
                    key={button.id}
                    className="font-mono text-[11px] uppercase tracking-[0.18em]"
                  >
                    {pickLocalized(contentLocale, button.label) || button.href}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </aside>

      <MediaPicker
        open={picker !== null}
        onClose={() => setPicker(null)}
        onSelect={(url) => {
          if (!section) return;
          if (picker === "image") {
            updateSection(section.id, { image: url });
            return;
          }
          updateSection(section.id, {
            gallery: section.gallery.includes(url)
              ? section.gallery
              : [...section.gallery, url],
          });
        }}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={t("pages.deleteSection")}
        body={t("pages.deleteSectionBody")}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (!pendingDelete) return;
          setLayout((current) => ({
            ...current,
            sections: current.sections.filter((item) => item.id !== pendingDelete),
          }));
          setSelected("menu");
          setPendingDelete(null);
        }}
      />
    </div>
  );
}

function MenuEditor({
  layout,
  setLayout,
  locale,
}: {
  layout: SiteLayout;
  setLayout: (value: SiteLayout | ((current: SiteLayout) => SiteLayout)) => void;
  locale: "tr" | "en";
}) {
  const { t } = useAdminI18n();
  return (
    <section className="admin-card space-y-4">
      <h2 className="admin-section-title">{t("pages.menu")}</h2>
      {layout.menu.map((item, index) => (
        <div key={item.id} className="grid gap-3 rounded-md border border-zinc-100 p-3 md:grid-cols-2">
          <label className="admin-field">
            <span>{t("pages.label")}</span>
            <input
              value={item.label[locale]}
              onChange={(event) =>
                setLayout((current) => ({
                  ...current,
                  menu: current.menu.map((entry) =>
                    entry.id === item.id
                      ? { ...entry, label: setLoc(entry.label, locale, event.target.value) }
                      : entry,
                  ),
                }))
              }
            />
          </label>
          <label className="admin-field">
            <span>{t("pages.link")}</span>
            <input
              value={item.href}
              onChange={(event) =>
                setLayout((current) => ({
                  ...current,
                  menu: current.menu.map((entry) =>
                    entry.id === item.id ? { ...entry, href: event.target.value } : entry,
                  ),
                }))
              }
            />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={item.visible}
              onChange={(event) =>
                setLayout((current) => ({
                  ...current,
                  menu: current.menu.map((entry) =>
                    entry.id === item.id
                      ? { ...entry, visible: event.target.checked }
                      : entry,
                  ),
                }))
              }
            />
            {t("common.active")}
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              className="admin-btn-ghost"
              disabled={index === 0}
              onClick={() =>
                setLayout((current) => {
                  const next = [...current.menu];
                  const [moved] = next.splice(index, 1);
                  next.splice(index - 1, 0, moved);
                  return { ...current, menu: next };
                })
              }
            >
              ↑
            </button>
            <button
              type="button"
              className="admin-btn-ghost"
              disabled={index === layout.menu.length - 1}
              onClick={() =>
                setLayout((current) => {
                  const next = [...current.menu];
                  const [moved] = next.splice(index, 1);
                  next.splice(index + 1, 0, moved);
                  return { ...current, menu: next };
                })
              }
            >
              ↓
            </button>
            <button
              type="button"
              className="admin-btn-danger"
              onClick={() =>
                setLayout((current) => ({
                  ...current,
                  menu: current.menu.filter((entry) => entry.id !== item.id),
                }))
              }
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
          setLayout((current) => ({
            ...current,
            menu: [
              ...current.menu,
              {
                id: crypto.randomUUID(),
                href: "/#",
                visible: true,
                label: emptyLocalized(),
              },
            ],
          }))
        }
      >
        <Plus className="mr-1 h-3.5 w-3.5" />
        {t("pages.addMenu")}
      </button>
    </section>
  );
}

function FooterEditor({
  layout,
  setLayout,
  copy,
  setCopy,
  profile,
  setProfile,
  locale,
}: {
  layout: SiteLayout;
  setLayout: (value: SiteLayout | ((current: SiteLayout) => SiteLayout)) => void;
  copy: CopyMap;
  setCopy: (value: CopyMap | ((current: CopyMap) => CopyMap)) => void;
  profile: Profile;
  setProfile: (value: Profile | ((current: Profile) => Profile)) => void;
  locale: "tr" | "en";
}) {
  const { t, fieldLabel } = useAdminI18n();
  const footerKeys = ["footer.descriptor", "footer.note"];
  return (
    <section className="admin-card space-y-4">
      <h2 className="admin-section-title">{t("pages.footer")}</h2>
      <p className="text-sm text-zinc-500">{t("pages.footerHint")}</p>
      {footerKeys.map((key) => (
        <label key={key} className="admin-field">
          <span>{fieldLabel(key)}</span>
          <input
            value={copy[key]?.[locale] ?? ""}
            onChange={(event) =>
              setCopy((current) => ({
                ...current,
                [key]: {
                  ...current[key],
                  [locale]: event.target.value,
                },
              }))
            }
          />
        </label>
      ))}
      <h3 className="pt-2 text-sm font-semibold">{t("pages.socials")}</h3>
      <label className="admin-field">
        <span>{t("about.email")}</span>
        <input
          value={profile.email}
          onChange={(event) =>
            setProfile((current) => ({ ...current, email: event.target.value }))
          }
        />
      </label>
      <label className="admin-field">
        <span>{t("about.github")}</span>
        <input
          value={profile.githubUrl}
          onChange={(event) =>
            setProfile((current) => ({ ...current, githubUrl: event.target.value }))
          }
        />
      </label>
      <label className="admin-field">
        <span>{t("about.linkedin")}</span>
        <input
          value={profile.linkedinUrl}
          onChange={(event) =>
            setProfile((current) => ({
              ...current,
              linkedinUrl: event.target.value,
            }))
          }
        />
      </label>
      <label className="admin-field">
        <span>{t("about.youtube")}</span>
        <input
          value={profile.youtubeUrl}
          onChange={(event) =>
            setProfile((current) => ({
              ...current,
              youtubeUrl: event.target.value,
            }))
          }
        />
      </label>
      <h3 className="pt-2 text-sm font-semibold">{t("pages.extraLinks")}</h3>
      {layout.footer.links.map((item) => (
        <div key={item.id} className="grid gap-3 md:grid-cols-2">
          <label className="admin-field">
            <span>{t("pages.label")}</span>
            <input
              value={item.label[locale]}
              onChange={(event) =>
                setLayout((current) => ({
                  ...current,
                  footer: {
                    links: current.footer.links.map((entry) =>
                      entry.id === item.id
                        ? { ...entry, label: setLoc(entry.label, locale, event.target.value) }
                        : entry,
                    ),
                  },
                }))
              }
            />
          </label>
          <label className="admin-field">
            <span>{t("pages.link")}</span>
            <div className="flex gap-2">
              <input
                value={item.href}
                onChange={(event) =>
                  setLayout((current) => ({
                    ...current,
                    footer: {
                      links: current.footer.links.map((entry) =>
                        entry.id === item.id ? { ...entry, href: event.target.value } : entry,
                      ),
                    },
                  }))
                }
              />
              <button
                type="button"
                className="admin-btn-danger"
                onClick={() =>
                  setLayout((current) => ({
                    ...current,
                    footer: {
                      links: current.footer.links.filter((entry) => entry.id !== item.id),
                    },
                  }))
                }
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </label>
        </div>
      ))}
      <button
        type="button"
        className="admin-btn-ghost"
        onClick={() =>
          setLayout((current) => ({
            ...current,
            footer: {
              links: [
                ...current.footer.links,
                { id: crypto.randomUUID(), href: "/", label: emptyLocalized() },
              ],
            },
          }))
        }
      >
        {t("pages.addLink")}
      </button>
    </section>
  );
}

function ButtonEditor({
  buttons,
  locale,
  onChange,
}: {
  buttons: SiteButton[];
  locale: "tr" | "en";
  onChange: (buttons: SiteButton[]) => void;
}) {
  const { t } = useAdminI18n();
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">{t("pages.buttons")}</h3>
      {buttons.map((button, index) => (
        <div key={button.id} className="grid gap-3 rounded-md border border-zinc-100 p-3 md:grid-cols-2">
          <label className="admin-field">
            <span>{t("pages.label")}</span>
            <input
              value={button.label[locale]}
              onChange={(event) =>
                onChange(
                  buttons.map((entry) =>
                    entry.id === button.id
                      ? { ...entry, label: setLoc(entry.label, locale, event.target.value) }
                      : entry,
                  ),
                )
              }
            />
          </label>
          <label className="admin-field">
            <span>{t("pages.link")}</span>
            <input
              value={button.href}
              onChange={(event) =>
                onChange(
                  buttons.map((entry) =>
                    entry.id === button.id ? { ...entry, href: event.target.value } : entry,
                  ),
                )
              }
            />
          </label>
          <label className="admin-field">
            <span>{t("pages.icon")}</span>
            <select
              value={button.icon}
              onChange={(event) =>
                onChange(
                  buttons.map((entry) =>
                    entry.id === button.id
                      ? { ...entry, icon: event.target.value as SiteButton["icon"] }
                      : entry,
                  ),
                )
              }
            >
              <option value="none">{t("pages.iconNone")}</option>
              <option value="arrow">{t("pages.iconArrow")}</option>
              <option value="mail">{t("pages.iconMail")}</option>
              <option value="github">GitHub</option>
              <option value="external">{t("pages.iconExternal")}</option>
            </select>
          </label>
          <div className="flex items-end gap-2">
            <button
              type="button"
              className="admin-btn-ghost"
              disabled={index === 0}
              onClick={() => {
                const next = [...buttons];
                const [moved] = next.splice(index, 1);
                next.splice(index - 1, 0, moved);
                onChange(next);
              }}
            >
              ↑
            </button>
            <button
              type="button"
              className="admin-btn-ghost"
              disabled={index === buttons.length - 1}
              onClick={() => {
                const next = [...buttons];
                const [moved] = next.splice(index, 1);
                next.splice(index + 1, 0, moved);
                onChange(next);
              }}
            >
              ↓
            </button>
            <button
              type="button"
              className="admin-btn-danger"
              onClick={() => onChange(buttons.filter((entry) => entry.id !== button.id))}
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
          onChange([
            ...buttons,
            {
              id: crypto.randomUUID(),
              href: "/#",
              icon: "none",
              label: emptyLocalized(),
            },
          ])
        }
      >
        {t("pages.addButton")}
      </button>
    </div>
  );
}

function ItemsEditor({
  section,
  locale,
  onChange,
}: {
  section: SiteSection;
  locale: "tr" | "en";
  onChange: (items: SiteSection["items"]) => void;
}) {
  const { t } = useAdminI18n();
  if (!["faq", "testimonials", "timeline"].includes(section.type)) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">{t("pages.blocks")}</h3>
      {section.items.map((item) => (
        <div key={item.id} className="space-y-3 rounded-md border border-zinc-100 p-3">
          {"question" in item ? (
            <>
              <label className="admin-field">
                <span>{t("pages.question")}</span>
                <input
                  value={item.question[locale]}
                  onChange={(event) =>
                    onChange(
                      section.items.map((entry) =>
                        entry.id === item.id && "question" in entry
                          ? {
                              ...entry,
                              question: setLoc(entry.question, locale, event.target.value),
                            }
                          : entry,
                      ),
                    )
                  }
                />
              </label>
              <label className="admin-field">
                <span>{t("pages.answer")}</span>
                <textarea
                  rows={3}
                  value={item.answer[locale]}
                  onChange={(event) =>
                    onChange(
                      section.items.map((entry) =>
                        entry.id === item.id && "answer" in entry
                          ? {
                              ...entry,
                              answer: setLoc(entry.answer, locale, event.target.value),
                            }
                          : entry,
                      ),
                    )
                  }
                />
              </label>
            </>
          ) : "quote" in item ? (
            <>
              <label className="admin-field">
                <span>{t("pages.quote")}</span>
                <textarea
                  rows={3}
                  value={item.quote[locale]}
                  onChange={(event) =>
                    onChange(
                      section.items.map((entry) =>
                        entry.id === item.id && "quote" in entry
                          ? { ...entry, quote: setLoc(entry.quote, locale, event.target.value) }
                          : entry,
                      ),
                    )
                  }
                />
              </label>
              <label className="admin-field">
                <span>{t("pages.person")}</span>
                <input
                  value={item.person[locale]}
                  onChange={(event) =>
                    onChange(
                      section.items.map((entry) =>
                        entry.id === item.id && "person" in entry
                          ? {
                              ...entry,
                              person: setLoc(entry.person, locale, event.target.value),
                            }
                          : entry,
                      ),
                    )
                  }
                />
              </label>
            </>
          ) : (
            <>
              <label className="admin-field">
                <span>{t("pages.date")}</span>
                <input
                  value={"date" in item ? item.date[locale] : ""}
                  onChange={(event) =>
                    onChange(
                      section.items.map((entry) =>
                        entry.id === item.id && "date" in entry
                          ? { ...entry, date: setLoc(entry.date, locale, event.target.value) }
                          : entry,
                      ),
                    )
                  }
                />
              </label>
              <label className="admin-field">
                <span>{t("pages.heading")}</span>
                <input
                  value={"title" in item ? item.title[locale] : ""}
                  onChange={(event) =>
                    onChange(
                      section.items.map((entry) =>
                        entry.id === item.id && "title" in entry
                          ? { ...entry, title: setLoc(entry.title, locale, event.target.value) }
                          : entry,
                      ),
                    )
                  }
                />
              </label>
              <label className="admin-field">
                <span>{t("pages.body")}</span>
                <textarea
                  rows={3}
                  value={"body" in item ? item.body[locale] : ""}
                  onChange={(event) =>
                    onChange(
                      section.items.map((entry) =>
                        entry.id === item.id && "body" in entry
                          ? { ...entry, body: setLoc(entry.body, locale, event.target.value) }
                          : entry,
                      ),
                    )
                  }
                />
              </label>
            </>
          )}
          <button
            type="button"
            className="admin-btn-danger"
            onClick={() => onChange(section.items.filter((entry) => entry.id !== item.id))}
          >
            {t("common.delete")}
          </button>
        </div>
      ))}
      <button
        type="button"
        className="admin-btn-ghost"
        onClick={() => {
          const id = crypto.randomUUID();
          if (section.type === "faq") {
            onChange([
              ...section.items,
              { id, question: emptyLocalized(), answer: emptyLocalized() },
            ]);
            return;
          }
          if (section.type === "testimonials") {
            onChange([
              ...section.items,
              { id, quote: emptyLocalized(), person: emptyLocalized() },
            ]);
            return;
          }
          onChange([
            ...section.items,
            {
              id,
              date: emptyLocalized(),
              title: emptyLocalized(),
              body: emptyLocalized(),
            },
          ]);
        }}
      >
        {t("pages.addBlock")}
      </button>
    </div>
  );
}
