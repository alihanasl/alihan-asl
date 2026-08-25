const COOKIE = "admin_session";

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

async function sign(username: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(adminPassword()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`v1:${username}`),
  );
  return toHex(signature);
}

export async function encodeSession(username: string) {
  return `${username}.${await sign(username)}`;
}

export async function verifySessionToken(token: string | undefined) {
  if (!token || !isAdminAuthConfigured()) {
    return null;
  }

  const separator = token.lastIndexOf(".");
  if (separator <= 0) {
    return null;
  }

  const username = token.slice(0, separator);
  const signature = token.slice(separator + 1);
  if (username !== adminUsername()) {
    return null;
  }

  const expected = await sign(username);
  if (!safeEqual(signature, expected)) {
    return null;
  }

  return username;
}

export function verifyCredentials(username: string, password: string) {
  if (!isAdminAuthConfigured()) {
    return false;
  }
  return username === adminUsername() && safeEqual(password, adminPassword());
}

export { COOKIE as adminSessionCookie };
