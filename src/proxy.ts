import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Only home page is public - all other routes require authentication
  const publicRoutes = [
    "/",
  ];
  
  // Check if route is public
  const isPublicRoute = publicRoutes.includes(pathname);
  
  // Get user cookie
  const userCookie = request.cookies.get("code404-user");
  
  // If accessing a protected route without authentication, redirect to home
  if (!isPublicRoute && !userCookie) {
    console.log(`🔒 Unauthorized access to ${pathname}, redirecting to home`);
    return NextResponse.redirect(new URL("/", request.url));
  }
  
  // If user is authenticated, parse the cookie
  let user = null;
  if (userCookie) {
    try {
      // Decode the URL-encoded cookie value before parsing
      const decodedValue = decodeURIComponent(userCookie.value);
      user = JSON.parse(decodedValue);
    } catch (error) {
      console.error("Failed to parse user cookie:", error);
      // Invalid cookie, clear it and redirect to home if accessing protected route
      if (!isPublicRoute) {
        const response = NextResponse.redirect(new URL("/", request.url));
        response.cookies.delete("code404-user");
        return response;
      }
    }
  }
  
  // Protect admin routes - allow both admin and mentor roles
  if (pathname.startsWith("/admin")) {
    if (!user || (user.role !== "admin" && user.role !== "mentor")) {
      console.log(`🔒 Non-admin/mentor user trying to access ${pathname}, redirecting to dashboard`);
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }
  
  // Protect dashboard routes (require authentication)
  if (pathname.startsWith("/dashboard")) {
    if (!user) {
      console.log(`🔒 Unauthenticated access to ${pathname}, redirecting to home`);
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    // Exclude API, Next internals and all common static asset file extensions
    // so public files (manifest.json, sw.js, PNG/SVG icons, favicons, etc.)
    // are fetched directly and not intercepted by this middleware.
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.json|sw.js|icons|.*\\.(?:png|jpg|jpeg|svg|ico|webp|json)).*)",
  ],
};
