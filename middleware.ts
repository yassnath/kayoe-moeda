import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// route yang wajib login
const ProtectedRoutes = ["/history-order", "/cart/checkout", "/checkout", "/admin", "/owner"];

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // ✅ Safety: jangan jalankan middleware untuk file statik & metadata umum
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".jpg") ||
    pathname.endsWith(".jpeg") ||
    pathname.endsWith(".svg") ||
    pathname.endsWith(".ico") ||
    pathname.endsWith(".css") ||
    pathname.endsWith(".js")
  ) {
    return NextResponse.next();
  }

  const authSecret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;

  let token: any = null;

  // ✅ Safety: jika secret tidak ada, jangan crash. Skip auth check.
  if (!authSecret) {
    return NextResponse.next();
  }

  try {
    token = await getToken({
      req: request,
      secret: authSecret
    });
  } catch (err) {
    token = null;
  }

  const isLoggedIn = !!token;
  const role = token?.role as "ADMIN" | "OWNER" | "CUSTOMER" | undefined;

  // ✅ 1) WAJIB LOGIN untuk route tertentu
  if (!isLoggedIn && ProtectedRoutes.some((route) => pathname.startsWith(route))) {
    const signInUrl = new URL("/signin", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname + search);
    return NextResponse.redirect(signInUrl);
  }

  // ✅ 2) Role guard: Admin area
  if (isLoggedIn && pathname.startsWith("/admin") && role !== "ADMIN") {
    if (role === "OWNER") return NextResponse.redirect(new URL("/owner", request.url));
    return NextResponse.redirect(new URL("/", request.url));
  }

  // ✅ 3) Role guard: Owner area
  if (isLoggedIn && pathname.startsWith("/owner") && role !== "OWNER") {
    if (role === "ADMIN") return NextResponse.redirect(new URL("/admin", request.url));
    return NextResponse.redirect(new URL("/", request.url));
  }

  // ✅ 4) Kalau sudah login tapi buka /signin -> redirect sesuai role
  if (isLoggedIn && pathname.startsWith("/signin")) {
    if (role === "ADMIN") return NextResponse.redirect(new URL("/admin", request.url));
    if (role === "OWNER") return NextResponse.redirect(new URL("/owner", request.url));
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

/**
 * ✅ FIX PENTING:
 * Middleware hanya jalan di route yang butuh auth/role guard,
 * bukan di semua halaman.
 */
export const config = {
  matcher: [
    "/history-order/:path*",
    "/cart/checkout/:path*",
    "/checkout/:path*",
    "/admin/:path*",
    "/owner/:path*",
    "/signin/:path*"
  ]
};
