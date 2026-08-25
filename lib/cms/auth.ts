import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  adminSessionCookie,
  adminSessionMaxAge,
  encodeSession,
  isAdminAuthConfigured,
  safeAdminPath,
  verifyCredentials,
  verifySessionToken,
} from "@/lib/cms/auth-session";

export {
  adminSessionCookie,
  isAdminAuthConfigured,
  safeAdminPath,
  verifyCredentials,
  verifySessionToken,
};

const cookieBase = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
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
  // Drop the previous Path=/admin cookie so a duplicate name cannot win.
  store.set(adminSessionCookie, "", {
    ...cookieBase,
    path: "/admin",
    maxAge: 0,
  });
  store.set(adminSessionCookie, await encodeSession(username), {
    ...cookieBase,
    path: "/",
    maxAge: adminSessionMaxAge / 1000,
  });
}

export async function clearAdminSession() {
  const store = await cookies();
  for (const path of ["/", "/admin"]) {
    store.set(adminSessionCookie, "", {
      ...cookieBase,
      path,
      maxAge: 0,
    });
  }
}
