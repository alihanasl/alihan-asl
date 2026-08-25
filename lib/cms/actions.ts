"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { randomUUID } from "crypto";
import { actionError, actionOk } from "@/lib/cms/admin";
import {
  clearAdminSession,
  createAdminSession,
  isAdminAuthConfigured,
  requireAdmin,
  safeAdminPath,
  verifyCredentials,
} from "@/lib/cms/auth";
import {
  clearLoginFailures,
  clientIp,
  isLoginLocked,
  recordLoginFailure,
} from "@/lib/cms/rate-limit";
import { revalidatePublicSite } from "@/lib/cms/revalidate";
import type { Locale } from "@/lib/i18n/config";
import { layouts, type CmsProject, type CopyMap, type Profile } from "@/lib/cms/types";
import { slugify } from "@/lib/cms/present";
import { allContentKeys, scaleStatIds } from "@/lib/cms/keys";
import {
  ALLOWED_MEDIA_TYPES,
  mediaExtension,
  validateMediaFile,
} from "@/lib/cms/media";
import {
  contentPaths,
  isAllowedCmsPath,
  persistFiles,
  persistJson,
  readCopy,
  readExperiences,
  readExperiments,
  readLayout,
  readMedia,
  readProfile,
  readProjects,
  readSkills,
  type MediaItem,
} from "@/lib/cms/store";
import {
  collectMediaUsage,
  normalizeLayout,
  type SiteLayout,
} from "@/lib/cms/layout";

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

  const ip = clientIp(await headers());
  if (isLoginLocked(ip)) {
    redirect("/admin/login?error=locked");
  }

  const username = text(formData, "username");
  const password = text(formData, "password");
  const next = safeAdminPath(text(formData, "next") || "/admin");

  if (!(await verifyCredentials(username, password))) {
    recordLoginFailure(ip);
    redirect("/admin/login?error=credentials");
  }

  clearLoginFailures(ip);
  await createAdminSession(username);
  redirect(next);
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
    return actionError("slugRequired");
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
  } catch {
    return actionError("saveFailed");
  }

  revalidatePublicSite(slug);
  return { ...actionOk(), id: projectId, slug };
}

export async function upsertStudioProjectAction(payload: string) {
  await requireAdmin();
  let data: {
    id?: string;
    locale?: Locale;
    title?: string;
    shortDescription?: string;
    year?: string;
    category?: string;
    technologies?: string;
    githubUrl?: string;
    liveUrl?: string;
    coverImage?: string;
    gallery?: string[];
    published?: boolean;
    problem?: string;
    idea?: string;
    build?: string;
    result?: string;
  };
  try {
    data = JSON.parse(payload) as typeof data;
  } catch {
    return actionError("saveFailed");
  }

  const locale: Locale = data.locale === "en" ? "en" : "tr";
  const projects = await readProjects();
  const existing = data.id
    ? projects.find((project) => project.id === data.id)
    : undefined;
  const projectId = existing?.id || randomUUID();
  const titleTr =
    locale === "tr" && data.title !== undefined
      ? data.title
      : (existing?.titleTr ?? "");
  const titleEn =
    locale === "en" && data.title !== undefined
      ? data.title
      : (existing?.titleEn ?? "");
  const shortTr =
    locale === "tr" && data.shortDescription !== undefined
      ? data.shortDescription
      : (existing?.shortDescriptionTr ?? "");
  const shortEn =
    locale === "en" && data.shortDescription !== undefined
      ? data.shortDescription
      : (existing?.shortDescriptionEn ?? "");
  function locField(
    key: "problem" | "idea" | "build" | "result",
    tr: string,
    en: string,
  ) {
    const incoming = data[key];
    if (incoming === undefined) return { tr, en };
    return locale === "tr" ? { tr: incoming, en } : { tr, en: incoming };
  }
  const problem = locField(
    "problem",
    existing?.problemTr ?? "",
    existing?.problemEn ?? "",
  );
  const idea = locField("idea", existing?.ideaTr ?? "", existing?.ideaEn ?? "");
  const build = locField(
    "build",
    existing?.buildTr ?? "",
    existing?.buildEn ?? "",
  );
  const result = locField(
    "result",
    existing?.resultTr ?? "",
    existing?.resultEn ?? "",
  );
  const slugSource =
    existing?.slug ||
    slugify(titleEn || titleTr) ||
    `work-${projectId.slice(0, 8)}`;

  const next: CmsProject = {
    id: projectId,
    slug: slugSource,
    titleTr: titleTr || (existing ? existing.titleTr : titleEn),
    titleEn: titleEn || (existing ? existing.titleEn : titleTr),
    shortDescriptionTr: shortTr,
    shortDescriptionEn: shortEn,
    problemTr: problem.tr,
    problemEn: problem.en,
    ideaTr: idea.tr,
    ideaEn: idea.en,
    buildTr: build.tr,
    buildEn: build.en,
    resultTr: result.tr,
    resultEn: result.en,
    captionTr: existing?.captionTr ?? "",
    captionEn: existing?.captionEn ?? "",
    category: data.category || existing?.category || "tools",
    technologies:
      data.technologies !== undefined
        ? splitList(data.technologies)
        : (existing?.technologies ?? []),
    year: data.year !== undefined ? data.year : (existing?.year ?? ""),
    githubUrl:
      data.githubUrl !== undefined
        ? data.githubUrl
        : (existing?.githubUrl ?? ""),
    liveUrl:
      data.liveUrl !== undefined ? data.liveUrl : (existing?.liveUrl ?? ""),
    coverImage:
      data.coverImage !== undefined
        ? data.coverImage
        : (existing?.coverImage ?? ""),
    gallery: data.gallery !== undefined ? data.gallery : (existing?.gallery ?? []),
    featured: existing?.featured ?? false,
    published:
      data.published !== undefined
        ? data.published
        : (existing?.published ?? true),
    sortOrder: existing?.sortOrder ?? projects.length,
    layout: existing?.layout ?? "visual-right",
    createdAt: existing?.createdAt || nowIso(),
    updatedAt: nowIso(),
  };

  const list = existing
    ? projects.map((project) => (project.id === projectId ? next : project))
    : [...projects, next];

  try {
    await persistJson(
      contentPaths.projects,
      list,
      `cms: ${existing ? "update" : "add"} project ${next.slug}`,
    );
  } catch {
    return actionError("saveFailed");
  }

  revalidatePublicSite(next.slug);
  return { ...actionOk(), project: next };
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
  } catch {
    return actionError("deleteFailed");
  }
  revalidatePublicSite(existing?.slug);
  return actionOk();
}

export async function setProjectPublishedAction(id: string, published: boolean) {
  await requireAdmin();
  const projects = await readProjects();
  const existing = projects.find((project) => project.id === id);
  if (!existing) {
    return actionError("notFound");
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
  } catch {
    return actionError("updateFailed");
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
  } catch {
    return actionError("updateFailed");
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
  } catch {
    return actionError("reorderFailed");
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
  } catch {
    return actionError("saveFailed");
  }
  revalidatePublicSite();
  return { ...actionOk(), id: next.id };
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
  } catch {
    return actionError("deleteFailed");
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
  } catch {
    return actionError("reorderFailed");
  }
  revalidatePublicSite();
  return actionOk();
}

export async function saveSkillAction(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const name = text(formData, "name");
  if (!name) {
    return actionError("nameRequired");
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
  } catch {
    return actionError("saveFailed");
  }
  revalidatePublicSite();
  return { ...actionOk(), id: next.id };
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
  } catch {
    return actionError("deleteFailed");
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
  } catch {
    return actionError("reorderFailed");
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
  } catch {
    return actionError("saveFailed");
  }
  revalidatePublicSite();
  return { ...actionOk(), id: next.id };
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
  } catch {
    return actionError("deleteFailed");
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
  } catch {
    return actionError("saveFailed");
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
  } catch {
    return actionError("saveFailed");
  }
  revalidatePublicSite();
  return actionOk();
}

export async function saveStatsAction(formData: FormData) {
  await requireAdmin();
  const ids = [...scaleStatIds];
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
  } catch {
    return actionError("saveFailed");
  }
  revalidatePublicSite();
  return actionOk();
}

export async function getMediaAction() {
  await requireAdmin();
  const [items, layout, projects] = await Promise.all([
    readMedia(),
    readLayout(),
    readProjects(),
  ]);
  return {
    items,
    usage: collectMediaUsage(layout, projects),
  };
}

export async function uploadMediaAction(formData: FormData) {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return actionError("fileRequired");
  }

  const invalid = validateMediaFile(file);
  if (invalid) {
    return actionError(invalid);
  }
  if (!ALLOWED_MEDIA_TYPES.includes(file.type)) {
    return actionError("fileType");
  }

  const extension = mediaExtension[file.type];
  if (!extension) {
    return actionError("fileType");
  }
  const filename = `${Date.now()}-${randomUUID()}${extension}`;
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
  } catch {
    return actionError("uploadFailed");
  }

  revalidatePublicSite();
  return { ...actionOk(), item };
}

export async function deleteMediaAction(filePath: string) {
  await requireAdmin();
  if (!isAllowedCmsPath(filePath) || !filePath.startsWith("public/uploads/")) {
    return actionError("fileInvalid");
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
      `cms: delete media`,
      [filePath],
    );
  } catch {
    return actionError("deleteFailed");
  }
  revalidatePublicSite();
  return actionOk();
}

export async function saveSiteLayoutAction(payload: string) {
  await requireAdmin();
  let parsed: { layout?: SiteLayout; copy?: CopyMap; profile?: Profile };
  try {
    parsed = JSON.parse(payload) as {
      layout?: SiteLayout;
      copy?: CopyMap;
      profile?: Profile;
    };
  } catch {
    return actionError("saveFailed");
  }

  const layout = normalizeLayout(parsed.layout);
  const copy = parsed.copy && typeof parsed.copy === "object" ? parsed.copy : null;
  if (!copy) {
    return actionError("saveFailed");
  }

  const files: { path: string; content: string }[] = [
    {
      path: contentPaths.layout,
      content: `${JSON.stringify(layout, null, 2)}\n`,
    },
    {
      path: contentPaths.site,
      content: `${JSON.stringify(copy, null, 2)}\n`,
    },
  ];

  if (parsed.profile && typeof parsed.profile === "object") {
    const current = await readProfile();
    files.push({
      path: contentPaths.about,
      content: `${JSON.stringify(
        {
          id: current.id || "profile",
          name: String(parsed.profile.name ?? current.name).trim(),
          email: String(parsed.profile.email ?? current.email).trim(),
          githubUrl: String(parsed.profile.githubUrl ?? current.githubUrl).trim(),
          linkedinUrl: String(
            parsed.profile.linkedinUrl ?? current.linkedinUrl,
          ).trim(),
          youtubeUrl: String(
            parsed.profile.youtubeUrl ?? current.youtubeUrl,
          ).trim(),
        },
        null,
        2,
      )}\n`,
    });
  }

  try {
    await persistFiles(files, "cms: update site layout");
  } catch {
    return actionError("saveFailed");
  }

  revalidatePublicSite();
  return actionOk();
}
