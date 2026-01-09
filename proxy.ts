import { NextRequest, NextResponse } from "next/server";

// route yang wajib login
const ProtectedRoutes = ["/history-order", "/cart/checkout", "/checkout", "/admin", "/owner"];

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  /**
   * ✅ FIX: skip total untuk static assets & file umum
   * (karena kamu sekarang 500 juga di favicon.ico)
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
    pathname.endsWith(".js") ||
    pathname.endsWith(".map")
  ) {
    return NextResponse.next();
  }

  /**
   * ✅ Middleware hanya aktif di protected routes + signin.
   * Route lain biarkan lewat tanpa baca token (lebih aman di edge).
   */
  const isProtectedRoute = ProtectedRoutes.some((route) => pathname.startsWith(route));
  const isSigninRoute = pathname.startsWith("/signin");

  if (!isProtectedRoute && !isSigninRoute) {
    return NextResponse.next();
  }

  const authSecret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;

  // Kalau secret kosong, jangan crash
  if (!authSecret) {
    if (isProtectedRoute) {
      const signInUrl = new URL("/signin", request.url);
      signInUrl.searchParams.set("callbackUrl", pathname + search);
      return NextResponse.redirect(signInUrl);
    }
    return NextResponse.next();
  }

  let token: any = null;

  /**
   * ✅ Lazy import next-auth/jwt (biar edge runtime aman)
   */
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
 * ✅ FIX: exclude favicon dll langsung dari matcher,
 * jadi proxy tidak akan terpanggil pada request itu sama sekali.
 */
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"]
};
