"use server";

import { redirect } from "next/navigation";
import { randomUUID } from "crypto";
import { actionError, actionOk } from "@/lib/cms/admin";
import {
  clearAdminSession,
  createAdminSession,
  isAdminAuthConfigured,
  requireAdmin,
  verifyCredentials,
} from "@/lib/cms/auth";
import { revalidatePublicSite } from "@/lib/cms/revalidate";
import { layouts, type CmsProject } from "@/lib/cms/types";
import { slugify } from "@/lib/cms/present";
import { allContentKeys } from "@/lib/cms/keys";
import { ALLOWED_MEDIA_TYPES, validateMediaFile } from "@/lib/cms/media";
import {
  contentPaths,
  persistFiles,
  persistJson,
  readCopy,
  readExperiences,
  readExperiments,
  readMedia,
  readProfile,
  readProjects,
  readSkills,
  type MediaItem,
} from "@/lib/cms/store";

function text(form: FormData, key: string) {
  return String(form.get(key) ?? "").trim();
}

function checked(form: FormData, key: string) {
  const value = form.get(key);
  return value === "on" || value === "true" || value === "1";
}

function splitList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function nowIso() {
  return new Date().toISOString();
}

export async function loginAction(formData: FormData) {
  if (!isAdminAuthConfigured()) {
    redirect("/admin/login?error=config");
  }

  const username = text(formData, "username");
  const password = text(formData, "password");
  const next = text(formData, "next") || "/admin";

  if (!verifyCredentials(username, password)) {
    redirect("/admin/login?error=credentials");
  }

  await createAdminSession(username);
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function logoutAction() {
  await clearAdminSession();
  redirect("/admin/login");
}

export async function saveProjectAction(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const titleEn = text(formData, "title_en");
  const titleTr = text(formData, "title_tr");
  const slug = slugify(text(formData, "slug") || titleEn || titleTr);

  if (!slug) {
    return actionError("Slug gerekli.");
  }

  const layoutValue = text(formData, "layout");
  const layout = layouts.includes(layoutValue as (typeof layouts)[number])
    ? layoutValue
    : "visual-right";

  const projects = await readProjects();
  const existing = projects.find((project) => project.id === id);
  const projectId = existing?.id || randomUUID();
  const gallery = splitList(text(formData, "gallery")).filter(
    (url) => url !== text(formData, "cover_image"),
  );

  const next: CmsProject = {
    id: projectId,
    slug,
    titleTr,
    titleEn,
    shortDescriptionTr: text(formData, "short_description_tr"),
    shortDescriptionEn: text(formData, "short_description_en"),
    problemTr: text(formData, "problem_tr"),
    problemEn: text(formData, "problem_en"),
    ideaTr: text(formData, "idea_tr"),
    ideaEn: text(formData, "idea_en"),
    buildTr: text(formData, "build_tr"),
    buildEn: text(formData, "build_en"),
    resultTr: text(formData, "result_tr"),
    resultEn: text(formData, "result_en"),
    captionTr: text(formData, "caption_tr"),
    captionEn: text(formData, "caption_en"),
    category: text(formData, "category") || "tools",
    technologies: splitList(text(formData, "technologies")),
    year: text(formData, "year"),
    githubUrl: text(formData, "github_url"),
    liveUrl: text(formData, "live_url"),
    coverImage: text(formData, "cover_image"),
    gallery,
    featured: checked(formData, "featured"),
    published: checked(formData, "published"),
    sortOrder: Number(text(formData, "sort_order") || existing?.sortOrder || projects.length),
    layout: layout as CmsProject["layout"],
    createdAt: existing?.createdAt || nowIso(),
    updatedAt: nowIso(),
  };

  const list = existing
    ? projects.map((project) => (project.id === projectId ? next : project))
    : [...projects, next];

  try {
    await persistJson(contentPaths.projects, list, `cms: ${existing ? "update" : "add"} project ${slug}`);
  } catch (error) {
    return actionError(error instanceof Error ? error.message : "Kayıt başarısız.");
  }

  revalidatePublicSite(slug);
  return { ...actionOk(), id: projectId, slug };
}

export async function deleteProjectAction(id: string) {
  await requireAdmin();
  const projects = await readProjects();
  const existing = projects.find((project) => project.id === id);
  try {
    await persistJson(
      contentPaths.projects,
      projects.filter((project) => project.id !== id),
      `cms: delete project ${existing?.slug ?? id}`,
    );
  } catch (error) {
    return actionError(error instanceof Error ? error.message : "Silinemedi.");
  }
  revalidatePublicSite(existing?.slug);
  return actionOk();
}

export async function setProjectPublishedAction(id: string, published: boolean) {
  await requireAdmin();
  const projects = await readProjects();
  const existing = projects.find((project) => project.id === id);
  if (!existing) {
    return actionError("Proje bulunamadı.");
  }
  const list = projects.map((project) =>
    project.id === id
      ? { ...project, published, updatedAt: nowIso() }
      : project,
  );
  try {
    await persistJson(
      contentPaths.projects,
      list,
      `cms: ${published ? "publish" : "unpublish"} ${existing.slug}`,
    );
  } catch (error) {
    return actionError(error instanceof Error ? error.message : "Güncellenemedi.");
  }
  revalidatePublicSite(existing.slug);
  return actionOk();
}

export async function setProjectFeaturedAction(id: string, featured: boolean) {
  await requireAdmin();
  const projects = await readProjects();
  const list = projects.map((project) =>
    project.id === id ? { ...project, featured, updatedAt: nowIso() } : project,
  );
  try {
    await persistJson(contentPaths.projects, list, "cms: update project featured");
  } catch (error) {
    return actionError(error instanceof Error ? error.message : "Güncellenemedi.");
  }
  revalidatePublicSite();
  return actionOk();
}

export async function reorderProjectsAction(ids: string[]) {
  await requireAdmin();
  const projects = await readProjects();
  const byId = new Map(projects.map((project) => [project.id, project]));
  const list: CmsProject[] = [];
  ids.forEach((id, index) => {
    const project = byId.get(id);
    if (project) {
      list.push({ ...project, sortOrder: index, updatedAt: nowIso() });
    }
  });
  for (const project of projects) {
    if (!ids.includes(project.id)) {
      list.push(project);
    }
  }
  try {
    await persistJson(contentPaths.projects, list, "cms: reorder projects");
  } catch (error) {
    return actionError(error instanceof Error ? error.message : "Sıralama kaydedilemedi.");
  }
  revalidatePublicSite();
  return actionOk();
}

export async function saveExperienceAction(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const items = await readExperiences();
  const existing = items.find((item) => item.id === id);
  const next = {
    id: existing?.id || randomUUID(),
    fieldTr: text(formData, "field_tr"),
    fieldEn: text(formData, "field_en"),
    contextTr: text(formData, "context_tr"),
    contextEn: text(formData, "context_en"),
    company: text(formData, "company"),
    startDate: text(formData, "start_date"),
    endDate: text(formData, "end_date"),
    isCurrent: checked(formData, "is_current"),
    descriptionTr: text(formData, "description_tr"),
    descriptionEn: text(formData, "description_en"),
    published: checked(formData, "published"),
    sortOrder: Number(text(formData, "sort_order") || existing?.sortOrder || items.length),
  };
  const list = existing
    ? items.map((item) => (item.id === next.id ? next : item))
    : [...items, next];
  try {
    await persistJson(contentPaths.experience, list, "cms: save experience");
  } catch (error) {
    return actionError(error instanceof Error ? error.message : "Kayıt başarısız.");
  }
  revalidatePublicSite();
  return actionOk();
}

export async function deleteExperienceAction(id: string) {
  await requireAdmin();
  const items = await readExperiences();
  try {
    await persistJson(
      contentPaths.experience,
      items.filter((item) => item.id !== id),
      "cms: delete experience",
    );
  } catch (error) {
    return actionError(error instanceof Error ? error.message : "Silinemedi.");
  }
  revalidatePublicSite();
  return actionOk();
}

export async function reorderExperiencesAction(ids: string[]) {
  await requireAdmin();
  const items = await readExperiences();
  const byId = new Map(items.map((item) => [item.id, item]));
  const list = ids
    .map((id, index) => {
      const item = byId.get(id);
      return item ? { ...item, sortOrder: index } : null;
    })
    .filter((item): item is (typeof items)[number] => Boolean(item));
  try {
    await persistJson(contentPaths.experience, list, "cms: reorder experience");
  } catch (error) {
    return actionError(error instanceof Error ? error.message : "Sıralama kaydedilemedi.");
  }
  revalidatePublicSite();
  return actionOk();
}

export async function saveSkillAction(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const name = text(formData, "name");
  if (!name) {
    return actionError("Teknoloji adı gerekli.");
  }
  const items = await readSkills();
  const existing = items.find((item) => item.id === id);
  const next = {
    id: existing?.id || randomUUID(),
    name,
    category: (text(formData, "category") || "tools") as (typeof items)[number]["category"],
    noteTr: text(formData, "note_tr"),
    noteEn: text(formData, "note_en"),
    published: checked(formData, "published"),
    sortOrder: Number(text(formData, "sort_order") || existing?.sortOrder || items.length),
  };
  const list = existing
    ? items.map((item) => (item.id === next.id ? next : item))
    : [...items, next];
  try {
    await persistJson(contentPaths.skills, list, "cms: save skill");
  } catch (error) {
    return actionError(error instanceof Error ? error.message : "Kayıt başarısız.");
  }
  revalidatePublicSite();
  return actionOk();
}

export async function deleteSkillAction(id: string) {
  await requireAdmin();
  const items = await readSkills();
  try {
    await persistJson(
      contentPaths.skills,
      items.filter((item) => item.id !== id),
      "cms: delete skill",
    );
  } catch (error) {
    return actionError(error instanceof Error ? error.message : "Silinemedi.");
  }
  revalidatePublicSite();
  return actionOk();
}

export async function reorderSkillsAction(ids: string[]) {
  await requireAdmin();
  const items = await readSkills();
  const byId = new Map(items.map((item) => [item.id, item]));
  const list = ids
    .map((id, index) => {
      const item = byId.get(id);
      return item ? { ...item, sortOrder: index } : null;
    })
    .filter((item): item is (typeof items)[number] => Boolean(item));
  try {
    await persistJson(contentPaths.skills, list, "cms: reorder skills");
  } catch (error) {
    return actionError(error instanceof Error ? error.message : "Sıralama kaydedilemedi.");
  }
  revalidatePublicSite();
  return actionOk();
}

export async function saveExperimentAction(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const items = await readExperiments();
  const existing = items.find((item) => item.id === id);
  const next = {
    id: existing?.id || randomUUID(),
    nameTr: text(formData, "name_tr"),
    nameEn: text(formData, "name_en"),
    noteTr: text(formData, "note_tr"),
    noteEn: text(formData, "note_en"),
    status: (text(formData, "status") || "experimental") as (typeof items)[number]["status"],
    ref: text(formData, "ref"),
    published: checked(formData, "published"),
    sortOrder: Number(text(formData, "sort_order") || existing?.sortOrder || items.length),
  };
  const list = existing
    ? items.map((item) => (item.id === next.id ? next : item))
    : [...items, next];
  try {
    await persistJson(contentPaths.experiments, list, "cms: save lab");
  } catch (error) {
    return actionError(error instanceof Error ? error.message : "Kayıt başarısız.");
  }
  revalidatePublicSite();
  return actionOk();
}

export async function deleteExperimentAction(id: string) {
  await requireAdmin();
  const items = await readExperiments();
  try {
    await persistJson(
      contentPaths.experiments,
      items.filter((item) => item.id !== id),
      "cms: delete lab",
    );
  } catch (error) {
    return actionError(error instanceof Error ? error.message : "Silinemedi.");
  }
  revalidatePublicSite();
  return actionOk();
}

export async function saveProfileAction(formData: FormData) {
  await requireAdmin();
  const current = await readProfile();
  const next = {
    id: current.id || "profile",
    name: text(formData, "name"),
    email: text(formData, "email"),
    githubUrl: text(formData, "github_url"),
    linkedinUrl: text(formData, "linkedin_url"),
    youtubeUrl: text(formData, "youtube_url"),
  };
  try {
    await persistJson(contentPaths.about, next, "cms: update about");
  } catch (error) {
    return actionError(error instanceof Error ? error.message : "Kayıt başarısız.");
  }
  revalidatePublicSite();
  return actionOk();
}

export async function saveContentAction(formData: FormData) {
  await requireAdmin();
  const copy = await readCopy();
  for (const key of allContentKeys) {
    copy[key] = {
      tr: text(formData, `${key}::tr`),
      en: text(formData, `${key}::en`),
    };
  }
  try {
    await persistJson(contentPaths.site, copy, "cms: update site content");
  } catch (error) {
    return actionError(error instanceof Error ? error.message : "Kayıt başarısız.");
  }
  revalidatePublicSite();
  return actionOk();
}

export async function saveStatsAction(formData: FormData) {
  await requireAdmin();
  const ids = ["servers", "switches", "projects", "problems"];
  const rows = ids.map((id, index) => {
    const raw = text(formData, `${id}_value`);
    return {
      id,
      value: raw === "" ? null : Number(raw),
      display: text(formData, `${id}_display`),
      suffix: text(formData, `${id}_suffix`),
      sortOrder: index,
    };
  });
  try {
    await persistJson(contentPaths.stats, rows, "cms: update stats");
  } catch (error) {
    return actionError(error instanceof Error ? error.message : "Kayıt başarısız.");
  }
  revalidatePublicSite();
  return actionOk();
}

export async function getMediaAction() {
  await requireAdmin();
  return readMedia();
}

export async function uploadMediaAction(formData: FormData) {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return actionError("Dosya seç.");
  }

  const invalid = validateMediaFile(file);
  if (invalid) {
    return actionError(invalid);
  }
  if (!ALLOWED_MEDIA_TYPES.includes(file.type)) {
    return actionError("Dosya türü desteklenmiyor.");
  }

  const safeName = file.name.replace(/[^\w.\-]+/g, "-").toLowerCase();
  const filename = `${Date.now()}-${safeName}`;
  const relative = `public/uploads/${filename}`;
  const url = `/uploads/${filename}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  const media = await readMedia();
  const item: MediaItem = { name: filename, url, path: relative };
  const next = [item, ...media.filter((entry) => entry.path !== relative)];

  try {
    await persistFiles(
      [
        {
          path: relative,
          content: bytes.toString("base64"),
          encoding: "base64",
        },
        {
          path: contentPaths.media,
          content: `${JSON.stringify(next, null, 2)}\n`,
        },
      ],
      `cms: upload ${filename}`,
    );
  } catch (error) {
    return actionError(error instanceof Error ? error.message : "Yükleme başarısız.");
  }

  revalidatePublicSite();
  return { ...actionOk(), item };
}

export async function deleteMediaAction(filePath: string) {
  await requireAdmin();
  if (!filePath.startsWith("public/uploads/") || filePath.includes("..")) {
    return actionError("Geçersiz dosya.");
  }
  const media = await readMedia();
  try {
    await persistFiles(
      [
        {
          path: contentPaths.media,
          content: `${JSON.stringify(
            media.filter((item) => item.path !== filePath),
            null,
            2,
          )}\n`,
        },
      ],
      `cms: delete ${filePath}`,
      [filePath],
    );
  } catch (error) {
    return actionError(error instanceof Error ? error.message : "Silinemedi.");
  }
  revalidatePublicSite();
  return actionOk();
}
