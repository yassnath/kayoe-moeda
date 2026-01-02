import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

// route yang wajib login
const ProtectedRoutes = ["/history-order", "/cart/checkout", "/checkout", "/admin", "/owner"];

export async function middleware(request: NextRequest) {
  const session = await auth();
  const isLoggedIn = !!session?.user;
  const role = (session?.user as any)?.role as "ADMIN" | "OWNER" | "CUSTOMER" | undefined;

  const { pathname, search } = request.nextUrl;

  // 1) WAJIB LOGIN untuk route tertentu
  if (!isLoggedIn && ProtectedRoutes.some((route) => pathname.startsWith(route))) {
    const signInUrl = new URL("/signin", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname + search);
    return NextResponse.redirect(signInUrl);
  }

  // 2) Role guard: Admin area
  if (isLoggedIn && pathname.startsWith("/admin") && role !== "ADMIN") {
    // OWNER tidak boleh masuk admin (sesuai permintaan: owner hanya insight)
    // Customer juga tidak boleh
    if (role === "OWNER") return NextResponse.redirect(new URL("/owner", request.url));
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 3) Role guard: Owner area
  if (isLoggedIn && pathname.startsWith("/owner") && role !== "OWNER") {
    // admin/customer tidak boleh masuk owner
    if (role === "ADMIN") return NextResponse.redirect(new URL("/admin", request.url));
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 4) Kalau sudah login tapi buka /signin -> redirect sesuai role
  if (isLoggedIn && pathname.startsWith("/signin")) {
    if (role === "ADMIN") return NextResponse.redirect(new URL("/admin", request.url));
    if (role === "OWNER") return NextResponse.redirect(new URL("/owner", request.url));
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
