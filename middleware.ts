import { NextRequest, NextResponse } from "next/server";

// route yang wajib login
const ProtectedRoutes = ["/history-order", "/cart/checkout", "/checkout", "/admin", "/owner"];

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  /**
   * ✅ FIX 1: Skip request yang pasti bukan halaman (static / api / assets)
   */
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

  /**
   * ✅ FIX 2: Jika route TIDAK termasuk ProtectedRoutes dan bukan /signin,
   * middleware cukup pass-through agar tidak memicu error Edge.
   */
  const isProtectedRoute = ProtectedRoutes.some((route) => pathname.startsWith(route));
  const isSigninRoute = pathname.startsWith("/signin");

  if (!isProtectedRoute && !isSigninRoute) {
    return NextResponse.next();
  }

  /**
   * ✅ FIX 3 (PENTING): Jangan import next-auth/jwt di top-level
   * karena bisa crash di Edge runtime. Lazy import hanya saat dibutuhkan.
   */
  const authSecret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;

  // kalau secret kosong, tidak usah crash
  if (!authSecret) {
    // jika masuk protected route tapi secret kosong, redirect ke signin biar aman
    if (isProtectedRoute) {
      const signInUrl = new URL("/signin", request.url);
      signInUrl.searchParams.set("callbackUrl", pathname + search);
      return NextResponse.redirect(signInUrl);
    }
    return NextResponse.next();
  }

  let token: any = null;

  try {
    const { getToken } = await import("next-auth/jwt");
    token = await getToken({ req: request, secret: authSecret });
  } catch (err) {
    token = null;
  }

  const isLoggedIn = !!token;
  const role = token?.role as "ADMIN" | "OWNER" | "CUSTOMER" | undefined;

  /**
   * ✅ 1) WAJIB LOGIN untuk route tertentu
   */
  if (!isLoggedIn && isProtectedRoute) {
    const signInUrl = new URL("/signin", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname + search);
    return NextResponse.redirect(signInUrl);
  }

  /**
   * ✅ 2) Role guard: Admin area
   */
  if (isLoggedIn && pathname.startsWith("/admin") && role !== "ADMIN") {
    if (role === "OWNER") return NextResponse.redirect(new URL("/owner", request.url));
    return NextResponse.redirect(new URL("/", request.url));
  }

  /**
   * ✅ 3) Role guard: Owner area
   */
  if (isLoggedIn && pathname.startsWith("/owner") && role !== "OWNER") {
    if (role === "ADMIN") return NextResponse.redirect(new URL("/admin", request.url));
    return NextResponse.redirect(new URL("/", request.url));
  }

  /**
   * ✅ 4) Kalau sudah login tapi buka /signin -> redirect sesuai role
   */
  if (isLoggedIn && isSigninRoute) {
    if (role === "ADMIN") return NextResponse.redirect(new URL("/admin", request.url));
    if (role === "OWNER") return NextResponse.redirect(new URL("/owner", request.url));
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

/**
 * ✅ matcher tetap global agar tidak memicu bug Next.js proxy routing (404),
 * tapi logic auth hanya aktif pada ProtectedRoutes /signin.
 */
export const config = {
  matcher: ["/((?!api|_next/static|_next/image).*)"]
};
