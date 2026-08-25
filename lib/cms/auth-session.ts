const COOKIE = "admin_session";
const SESSION_MS = 60 * 60 * 24 * 14;

function adminUsername() {
  return process.env.ADMIN_USERNAME?.trim() || "";
}

function adminPassword() {
  return process.env.ADMIN_PASSWORD ?? "";
}

export function isAdminAuthConfigured() {
  return Boolean(adminUsername() && adminPassword());
}

function toHex(buffer: ArrayBuffer) {
  return [...new Uint8Array(buffer)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function safeEqual(left: string, right: string) {
  if (left.length !== right.length) {
    return false;
  }
  let mismatch = 0;
  for (let index = 0; index < left.length; index += 1) {
    mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return mismatch === 0;
}

async function sha256Hex(value: string) {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value),
  );
  return toHex(digest);
}

async function hmacKey() {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(adminPassword()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
}

async function sign(payload: string) {
  const signature = await crypto.subtle.sign(
    "HMAC",
    await hmacKey(),
    new TextEncoder().encode(payload),
  );
  return toHex(signature);
}

export async function encodeSession(username: string) {
  const payload = `v2|${username}|${Date.now() + SESSION_MS}`;
  return `${payload}.${await sign(payload)}`;
}

export async function verifySessionToken(token: string | undefined) {
  if (!token || !isAdminAuthConfigured()) {
    return null;
  }

  const separator = token.lastIndexOf(".");
  if (separator <= 0) {
    return null;
  }

  const payload = token.slice(0, separator);
  const signature = token.slice(separator + 1);
  const parts = payload.split("|");
  if (parts.length !== 3 || parts[0] !== "v2") {
    return null;
  }

  const username = parts[1];
  const expires = Number(parts[2]);
  if (!username || username !== adminUsername()) {
    return null;
  }
  if (!Number.isFinite(expires) || Date.now() > expires) {
    return null;
  }

  const expected = await sign(payload);
  if (!safeEqual(signature, expected)) {
    return null;
  }

  return username;
}

export async function verifyCredentials(username: string, password: string) {
  if (!isAdminAuthConfigured()) {
    return false;
  }

  const [givenUser, expectedUser, givenPass, expectedPass] = await Promise.all([
    sha256Hex(username),
    sha256Hex(adminUsername()),
    sha256Hex(password),
    sha256Hex(adminPassword()),
  ]);

  return safeEqual(givenUser, expectedUser) && safeEqual(givenPass, expectedPass);
}

export function safeAdminPath(path: string) {
  if (!path.startsWith("/admin")) {
    return "/admin";
  }
  if (
    path.startsWith("//") ||
    path.includes("://") ||
    path.includes("\\") ||
    path.includes("..")
  ) {
    return "/admin";
  }
  return path;
}

export { COOKIE as adminSessionCookie, SESSION_MS as adminSessionMaxAge };
