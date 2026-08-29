import { type NextRequest, NextResponse } from "next/server";
import {
  adminSessionCookie,
  isAdminAuthConfigured,
  verifySessionToken,
} from "@/lib/cms/auth-session";

function withAdminHeaders(response: NextResponse) {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "no-referrer");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

function nextAdmin(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-admin-route", "1");
  return withAdminHeaders(
    NextResponse.next({
      request: { headers: requestHeaders },
    }),
  );
}

export async function middleware(request: NextRequest) {
  // Sensitive env vars are not always present in Edge. If they are missing,
  // skip the cookie check here; the Node admin layout still enforces auth.
  if (!isAdminAuthConfigured()) {
    return nextAdmin(request);
  }

  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get(adminSessionCookie)?.value;
  const user = await verifySessionToken(token);
  const isLogin = pathname === "/admin/login";

  if (isLogin) {
    if (user) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      url.search = "";
      return withAdminHeaders(NextResponse.redirect(url));
    }
    return nextAdmin(request);
  }

  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname);
    return withAdminHeaders(NextResponse.redirect(url));
  }

  return nextAdmin(request);
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
