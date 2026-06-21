import { NextResponse } from "next/server";

export async function proxy(request) {
  // Get better-auth session token from cookies
  const sessionToken = 
    request.cookies.get("better-auth.session_token")?.value || 
    request.cookies.get("__secure-better-auth.session_token")?.value;

  const { pathname } = request.nextUrl;

  // If sessionToken exists, redirect logged-in users away from auth pages to dashboard
  if (pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up")) {
    if (sessionToken) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Protect dashboard, writing, and admin routes
  if (
    pathname.startsWith("/dashboard") || 
    pathname.startsWith("/add-lesson") || 
    pathname.startsWith("/admin-panel")
  ) {
    if (!sessionToken) {
      const signInUrl = new URL("/sign-in", request.url);
      // If they tried to access a specific page, save it as callback
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
    "/sign-in",
    "/sign-up",
  ],
};
