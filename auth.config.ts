/**
 * auth.config.ts — Edge Runtime Safe
 *
 * This file is imported by middleware.ts which runs in the Edge Runtime.
 * IMPORTANT: Do NOT import mongoose, bcrypt, or any Node.js-only modules here.
 * All Node.js-specific logic (DB queries, bcrypt) lives in auth.ts.
 */
import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
    providers: [],
    // We define the full Credentials provider in auth.ts (Node.js runtime only).
    // Middleware only needs JWT/session callbacks for role-based routing.

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = (user as { role?: string }).role ?? "user";
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string;
                (session.user as { role?: string }).role = token.role as string;
            }
            return session;
        },
    },

    pages: {
        signIn: "/login",
        error: "/login",
    },

    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },

    debug: process.env.NODE_ENV === "development",
};
