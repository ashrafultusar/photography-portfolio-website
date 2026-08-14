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

    const isAdminRoute = nextUrl.pathname.startsWith("/admin");
    const isAuthRoute =
        nextUrl.pathname.startsWith("/login") ||
        nextUrl.pathname.startsWith("/register");

    // 1. Protect all /admin/* routes
    if (isAdminRoute) {
        if (!isLoggedIn) {
            const loginUrl = new URL("/login", nextUrl);
            loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
            return NextResponse.redirect(loginUrl);
        }

        if (userRole !== "admin") {
            // Authenticated but not admin → redirect to home
            return NextResponse.redirect(new URL("/", nextUrl));
        }

        return NextResponse.next();
    }

    // 2. Redirect already-logged-in users away from auth pages
    if (isAuthRoute && isLoggedIn) {
        if (userRole === "admin") {
            return NextResponse.redirect(new URL("/admin/my-dashboard", nextUrl));
        }
        return NextResponse.redirect(new URL("/", nextUrl));
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        // Match all paths except static files, images, and API routes
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
    ],
};
