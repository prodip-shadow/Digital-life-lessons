import { NextResponse } from "next/server";

export async function proxy(request) {
  // Get better-auth session token from cookies
  const sessionToken = 
    request.cookies.get("better-auth.session_token")?.value || 
    request.cookies.get("__secure-better-auth.session_token")?.value;

  const { pathname } = request.nextUrl;

  // Protect dashboard, writing, and admin routes (Simple cookie check for performance)
  if (
    pathname.startsWith("/dashboard") || 
    pathname.startsWith("/add-lesson") || 
    pathname.startsWith("/admin-panel")
  ) {
    if (!sessionToken) {
      const signInUrl = new URL("/sign-in", request.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
}

// Config to specify which paths the proxy runs on
export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/add-lesson",
    "/add-lesson/:path*",
    "/admin-panel",
    "/admin-panel/:path*",
  ],
};
