/**
 * middleware.ts — runs in Edge Runtime.
 * MUST only import from auth.config.ts (Edge-safe), NOT from auth.ts (Node.js only).
 */
import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { NextResponse } from "next/server";
import type { NextAuthRequest } from "next-auth";

const { auth } = NextAuth(authConfig);

export default auth((req: NextAuthRequest) => {
    const { nextUrl } = req;
    const session = req.auth;
    const isLoggedIn = !!session;
    const userRole = (session?.user as { role?: string } | undefined)?.role;

    // Dynamically resolve true request origin from proxy headers
    const rawHost = req.headers.get("x-forwarded-host") || req.headers.get("host") || nextUrl.host;
    const host = rawHost.split(",")[0].trim();
    const isLocal = host.includes("localhost") || host.includes("127.0.0.1");
    const proto = req.headers.get("x-forwarded-proto") || (isLocal ? "http" : "https");
    const origin = `${proto}://${host}`;

    const isAdminRoute =
        nextUrl.pathname.startsWith("/admin") ||
        nextUrl.pathname.startsWith("/my-dashboard");
    const isAuthRoute =
        nextUrl.pathname.startsWith("/login") ||
        nextUrl.pathname.startsWith("/register");

    // Helper to append no-cache headers to prevent browser Back button (BFCache) access
    const addNoCacheHeaders = (response: NextResponse) => {
        response.headers.set(
            "Cache-Control",
            "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"
        );
        response.headers.set("Pragma", "no-cache");
        response.headers.set("Expires", "0");
        return response;
    };

    // 1. Protect all /my-dashboard/* and /admin/* routes
    if (isAdminRoute) {
        if (!isLoggedIn) {
            const loginUrl = new URL(`${origin}/login`);
            loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
            return addNoCacheHeaders(NextResponse.redirect(loginUrl));
        }

        if (userRole !== "admin") {
            // Authenticated but not admin → redirect to home
            return addNoCacheHeaders(NextResponse.redirect(new URL(`${origin}/`)));
        }

        const response = NextResponse.next();
        return addNoCacheHeaders(response);
    }

    // 2. Redirect already-logged-in users away from auth pages
    if (isAuthRoute && isLoggedIn) {
        if (userRole === "admin") {
            return addNoCacheHeaders(NextResponse.redirect(new URL(`${origin}/my-dashboard`)));
        }
        return addNoCacheHeaders(NextResponse.redirect(new URL(`${origin}/`)));
    }

    return NextResponse.next();
});



export const config = {
    matcher: [
        // Match all paths except static files, images, and API routes
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
    ],
};

