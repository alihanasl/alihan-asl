import { type NextRequest, NextResponse } from "next/server";
import {
  adminSessionCookie,
  verifySessionToken,
} from "@/lib/cms/auth-session";

function withAdminHeaders(response: NextResponse) {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "no-referrer");
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export async function middleware(request: NextRequest) {
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
    return withAdminHeaders(NextResponse.next());
  }

  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname);
    return withAdminHeaders(NextResponse.redirect(url));
  }

  return withAdminHeaders(NextResponse.next());
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
