import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
    const url = request.nextUrl;
    const { pathname } = url;
    const hostname = request.headers.get("host") || "";

    // ----------------------------------------------------------------------
    // 1. SUBDOMAIN ROUTING (Hackathon)
    // ----------------------------------------------------------------------
    // Check if the hostname is the hackathon subdomain
    const isHackathonSubdomain =
        hostname.startsWith("hackathon.") || hostname.startsWith("hacks.");

    if (isHackathonSubdomain) {
        // If we're on the subdomain, we might need to handle public assets effectively
        // But the matcher config should handle excluding assets.

        // Allow public access to the hackathon site
        // We rewrite the request to the /hackathon folder
        if (!pathname.startsWith("/hackathon")) {
            return NextResponse.rewrite(new URL(`/hackathon${pathname}`, request.url));
        }
        // If it already starts with /hackathon (shouldn't happen often if rewritten, but possible), just process.
        return NextResponse.next();
    }

    // ----------------------------------------------------------------------
    // 2. MAIN SITE AUTHENTICATION (Existing proxy.ts logic)
    // ----------------------------------------------------------------------

    // Only home page is public - all other routes require authentication
    const publicRoutes = [
        "/",
        "/sw.js", // Service workers often need to be public
        "/manifest.json"
    ];

    // Check if route is public
    // We strictly check if the pathname IS one of the public routes
    // OR if it starts with /hackathon (public landing page)
    const isPublicRoute = publicRoutes.includes(pathname) || pathname.startsWith("/hackathon");

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
         * - public files (manifest.json, sw.js, etc handled by negative lookahead)
         */
        "/((?!api|_next/static|_next/image|favicon.ico|manifest.json|sw.js|icons|.*\\.(?:png|jpg|jpeg|svg|ico|webp|json)).*)",
    ],
};
