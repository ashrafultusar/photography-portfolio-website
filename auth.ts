/**
 * auth.ts — Node.js Runtime Only
 *
 * This file runs ONLY in Node.js (API routes, server actions, server components).
 * It is NEVER imported by middleware.ts.
 * Safe to import mongoose, bcrypt, and other Node.js-only modules here.
 */
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { connectDB } from "@/db/dbConfig";
import User from "@/models/User";
import { authConfig } from "./auth.config";

const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsed = LoginSchema.safeParse(credentials);
                if (!parsed.success) return null;

                const { email, password } = parsed.data;

                await connectDB();

                // Fetch user WITH password and lockout fields
                const user = await User.findOne({ email }).select(
                    "+password +loginAttempts +lockUntil"
                );

                if (!user) {
                    // Generic delay to prevent user enumeration timing attacks
                    await new Promise((r) => setTimeout(r, 300 + Math.random() * 200));
                    return null;
                }

                // Check if account is currently locked
                if (user.isLocked) {
                    const secondsLeft = Math.ceil(
                        ((user.lockUntil as number) - Date.now()) / 1000
                    );
                    throw new Error(`LOCKED:${secondsLeft}`);
                }

                const passwordMatch = await bcrypt.compare(password, user.password);

                if (!passwordMatch) {
                    // Increment failed attempts (may trigger lock)
                    await user.incLoginAttempts();

                    // Re-fetch to get updated state
                    const updated = await User.findOne({ email }).select(
                        "+loginAttempts +lockUntil"
                    );

                    if (updated?.isLocked) {
                        const secondsLeft = Math.ceil(
                            ((updated.lockUntil as number) - Date.now()) / 1000
                        );
                        throw new Error(`LOCKED:${secondsLeft}`);
                    }

                    const attemptsLeft = Math.max(0, 3 - (updated?.loginAttempts ?? 0));
                    throw new Error(`INVALID:${attemptsLeft}`);
                }

                // Successful login — reset counter
                await user.resetLoginAttempts();

                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    role: user.role,
                };
            },
        }),
    ],
});
