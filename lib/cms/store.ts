import { mkdir, readFile, unlink, writeFile } from "fs/promises";
import path from "path";
import {
  commitGithubFiles,
  isGitHubConfigured,
  readGithubFile,
} from "@/lib/github/commit";
import type {
  CmsExperiment,
  CmsExperience,
  CmsProject,
  CmsSkill,
  CmsStat,
  CopyMap,
  Profile,
} from "@/lib/cms/types";

export const contentPaths = {
  projects: "content/projects.json",
  experience: "content/experience.json",
  skills: "content/skills.json",
  experiments: "content/experiments.json",
  about: "content/about.json",
  site: "content/site.json",
  stats: "content/stats.json",
  media: "content/media.json",
} as const;

export type MediaItem = {
  name: string;
  url: string;
  path: string;
};

const allowedJson = new Set<string>(Object.values(contentPaths));

export function isAllowedCmsPath(relative: string) {
  const normalized = relative.replaceAll("\\", "/");
  if (
    !normalized ||
    normalized.includes("..") ||
    normalized.startsWith("/") ||
    normalized.includes("\0")
  ) {
    return false;
  }
  if (allowedJson.has(normalized)) {
    return true;
  }
  return /^public\/uploads\/[A-Za-z0-9._-]+$/.test(normalized);
}

function assertSafeCmsPath(relative: string) {
  if (!isAllowedCmsPath(relative)) {
    throw new Error("Invalid path.");
  }
}

function diskPath(relative: string) {
  const root = path.resolve(/* turbopackIgnore: true */ process.cwd());
  const full = path.resolve(root, relative);
  const prefix = root.endsWith(path.sep) ? root : `${root}${path.sep}`;
  if (full !== root && !full.startsWith(prefix)) {
    throw new Error("Invalid path.");
  }
  return full;
}

function canWriteLocally() {
  return process.env.VERCEL !== "1";
}

async function readLocalJson<T>(relative: string): Promise<T | null> {
  try {
    const raw = await readFile(diskPath(relative), "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function readJsonFile<T>(relative: string, fallback: T): Promise<T> {
  if (isGitHubConfigured()) {
    const remote = await readGithubFile(relative);
    if (remote) {
      try {
        return JSON.parse(remote) as T;
      } catch {
        // fall through to local
      }
    }
  }

  return (await readLocalJson<T>(relative)) ?? fallback;
}

export async function persistFiles(
  files: { path: string; content: string; encoding?: "utf-8" | "base64" }[],
  message: string,
  deletes: string[] = [],
) {
  for (const file of files) {
    assertSafeCmsPath(file.path);
  }
  for (const filePath of deletes) {
    assertSafeCmsPath(filePath);
  }

  if (isGitHubConfigured()) {
    await commitGithubFiles(files, message, deletes);
  } else if (!canWriteLocally()) {
    throw new Error("GitHub is not configured.");
  }

  if (canWriteLocally()) {
    for (const file of files) {
      const full = diskPath(file.path);
      await mkdir(path.dirname(full), { recursive: true });
      if (file.encoding === "base64") {
        await writeFile(full, Buffer.from(file.content, "base64"));
      } else {
        await writeFile(full, file.content, "utf8");
      }
    }
    for (const filePath of deletes) {
      try {
        await unlink(diskPath(filePath));
      } catch {
        // already gone
      }
    }
  }
}

export async function persistJson(
  relative: string,
  data: unknown,
  message: string,
) {
  const content = `${JSON.stringify(data, null, 2)}\n`;
  await persistFiles([{ path: relative, content }], message);
}

export async function readProjects() {
  return readJsonFile<CmsProject[]>(contentPaths.projects, []);
}

export async function readExperiences() {
  return readJsonFile<CmsExperience[]>(contentPaths.experience, []);
}

export async function readSkills() {
  return readJsonFile<CmsSkill[]>(contentPaths.skills, []);
}

export async function readExperiments() {
  return readJsonFile<CmsExperiment[]>(contentPaths.experiments, []);
}

export async function readProfile() {
  return readJsonFile<Profile>(contentPaths.about, {
    id: "profile",
    name: "Alihan Asl",
    email: "",
    githubUrl: "",
    linkedinUrl: "",
    youtubeUrl: "",
  });
}

export async function readCopy() {
  return readJsonFile<CopyMap>(contentPaths.site, {});
}

export async function readStats() {
  return readJsonFile<CmsStat[]>(contentPaths.stats, []);
}

export async function readMedia() {
  return readJsonFile<MediaItem[]>(contentPaths.media, []);
}
