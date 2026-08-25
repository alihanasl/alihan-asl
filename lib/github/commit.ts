type GitHubFile = {
  path: string;
  content: string;
  encoding?: "utf-8" | "base64";
};

type GitHubRef = { object: { sha: string } };
type GitHubCommit = { sha: string; tree: { sha: string } };
type GitHubBlob = { sha: string };
type GitHubTree = { sha: string };

function owner() {
  return process.env.GITHUB_OWNER?.trim() || "";
}

function repo() {
  return process.env.GITHUB_REPO?.trim() || "";
}

function token() {
  return process.env.GITHUB_TOKEN?.trim() || "";
}

export function githubBranch() {
  return process.env.GITHUB_BRANCH?.trim() || "master";
}

export function isGitHubConfigured() {
  return Boolean(token() && owner() && repo());
}

async function github<T>(
  pathname: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`https://api.github.com${pathname}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token()}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "alihan-asl-cms",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GitHub API ${response.status}: ${body.slice(0, 400)}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function readGithubFile(filePath: string): Promise<string | null> {
  if (!isGitHubConfigured()) {
    return null;
  }

  const encoded = filePath
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");

  try {
    const data = await github<{ content?: string; encoding?: string }>(
      `/repos/${owner()}/${repo()}/contents/${encoded}?ref=${encodeURIComponent(githubBranch())}`,
    );
    if (!data.content) {
      return null;
    }
    return Buffer.from(data.content.replace(/\n/g, ""), "base64").toString("utf8");
  } catch {
    return null;
  }
}

export async function commitGithubFiles(
  files: GitHubFile[],
  message: string,
  deletes: string[] = [],
) {
  if (!isGitHubConfigured()) {
    throw new Error("GITHUB_TOKEN, GITHUB_OWNER ve GITHUB_REPO gerekli.");
  }

  const branch = githubBranch();
  const ref = await github<GitHubRef>(
    `/repos/${owner()}/${repo()}/git/ref/heads/${encodeURIComponent(branch)}`,
  );
  const parentSha = ref.object.sha;
  const parent = await github<GitHubCommit>(
    `/repos/${owner()}/${repo()}/git/commits/${parentSha}`,
  );

  const treeItems: {
    path: string;
    mode: "100644";
    type: "blob";
    sha: string | null;
  }[] = [];

  for (const file of files) {
    const encoding = file.encoding ?? "utf-8";
    const blob = await github<GitHubBlob>(`/repos/${owner()}/${repo()}/git/blobs`, {
      method: "POST",
      body: JSON.stringify({
        content: file.content,
        encoding: encoding === "base64" ? "base64" : "utf-8",
      }),
    });
    treeItems.push({
      path: file.path,
      mode: "100644",
      type: "blob",
      sha: blob.sha,
    });
  }

  for (const filePath of deletes) {
    treeItems.push({
      path: filePath,
      mode: "100644",
      type: "blob",
      sha: null,
    });
  }

  const tree = await github<GitHubTree>(`/repos/${owner()}/${repo()}/git/trees`, {
    method: "POST",
    body: JSON.stringify({
      base_tree: parent.tree.sha,
      tree: treeItems,
    }),
  });

  const commit = await github<GitHubCommit>(
    `/repos/${owner()}/${repo()}/git/commits`,
    {
      method: "POST",
      body: JSON.stringify({
        message,
        tree: tree.sha,
        parents: [parentSha],
      }),
    },
  );

  await github(`/repos/${owner()}/${repo()}/git/refs/heads/${encodeURIComponent(branch)}`, {
    method: "PATCH",
    body: JSON.stringify({ sha: commit.sha }),
  });
}
