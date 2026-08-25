import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  adminSessionCookie,
  encodeSession,
  isAdminAuthConfigured,
  verifyCredentials,
  verifySessionToken,
} from "@/lib/cms/auth-session";

export {
  adminSessionCookie,
  isAdminAuthConfigured,
  verifyCredentials,
  verifySessionToken,
};

export async function getAdminUsername() {
  const store = await cookies();
  return verifySessionToken(store.get(adminSessionCookie)?.value);
}

export async function requireAdmin() {
  const username = await getAdminUsername();
  if (!username) {
    redirect("/admin/login");
  }
  return { username };
}

export async function createAdminSession(username: string) {
  const store = await cookies();
  store.set(adminSessionCookie, await encodeSession(username), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
}

export async function clearAdminSession() {
  const store = await cookies();
  store.delete(adminSessionCookie);
}
