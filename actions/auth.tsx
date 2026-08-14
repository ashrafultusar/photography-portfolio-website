/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { z } from "zod";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectDB } from "@/db/dbConfig";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import sanitize from "mongo-sanitize";
import { checkRateLimit } from "@/lib/rateLimit";

// ─── Schemas ─────────────────────────────────────────────────────────────────

const RegisterSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email." }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// ─── Register ─────────────────────────────────────────────────────────────────

export async function register(prevState: any, formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData.entries());
    // Sanitize to prevent NoSQL injection
    const sanitizedData = sanitize(rawData);

    const validatedFields = RegisterSchema.safeParse(sanitizedData);

    if (!validatedFields.success) {
      return {
        error: validatedFields.error.flatten().fieldErrors,
        message: "Validation Error",
      };
    }

    const { name, email, password } = validatedFields.data;

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { message: "An account with this email already exists." };
    }

    // Cost factor 12 for production-grade security
    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({ name, email, password: hashedPassword });

    return { success: true, message: "Account created. You can now log in." };
  } catch (error) {
    console.error("Registration error:", error);
    return { message: "Failed to create account. Please try again." };
  }
}

// ─── Authenticate ─────────────────────────────────────────────────────────────

export interface AuthState {
  error?: string | null;
  locked?: boolean;
  lockSeconds?: number;
  attemptsLeft?: number;
}

export async function authenticate(
  prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headersList.get("x-real-ip") ||
    "127.0.0.1";

  // Sanitize inputs
  const email = sanitize((formData.get("email") as string | null) ?? "");
  const password = sanitize((formData.get("password") as string | null) ?? "");

  // IP-level rate limit check (layer 1 defence)
  const limitKey = `login:${ip}`;
  const limitResult = checkRateLimit(limitKey);

  if (!limitResult.allowed) {
    return {
      error: `Too many login attempts from your network. Please wait ${limitResult.retryAfter} seconds.`,
    };
  }

  try {
    await connectDB();
    await signIn("credentials", { email, password, redirect: false });
  } catch (error) {
    if (error instanceof AuthError) {
      const cause = (error.cause as { err?: Error })?.err;
      const msg = cause?.message ?? "";

      if (msg.startsWith("LOCKED:")) {
        const seconds = parseInt(msg.split(":")[1], 10);
        return {
          locked: true,
          lockSeconds: seconds,
          error: `Account locked. Try again in ${seconds} seconds.`,
        };
      }

      if (msg.startsWith("INVALID:")) {
        const attemptsLeft = parseInt(msg.split(":")[1], 10);
        return {
          attemptsLeft,
          error:
            attemptsLeft > 0
              ? `Invalid credentials. ${attemptsLeft} attempt(s) remaining before account lockout.`
              : "Invalid credentials. Account is now locked for 3 minutes.",
        };
      }

      return { error: "Invalid email or password." };
    }

    // Re-throw redirect errors (Next.js internals)
    throw error;
  }

  // On success: redirect based on role
  // Check role from DB to determine redirect target
  try {
    const user = await User.findOne({ email: email }).select("role");
    if (user?.role === "admin") {
      redirect("/admin/my-dashboard");
    } else {
      redirect("/");
    }
  } catch {
    redirect("/");
  }
}

// ─── Logout ───────────────────────────────────────────────────────────────────

export async function logout() {
  await signOut({ redirectTo: "/login" });
}
