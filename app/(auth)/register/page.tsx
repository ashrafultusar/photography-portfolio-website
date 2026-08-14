"use client";

import { useActionState, useState } from "react";
import { register } from "@/actions/auth";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

type RegisterState = {
    success?: boolean;
    message?: string;
    error?: { name?: string[]; email?: string[]; password?: string[]; confirmPassword?: string[] };
} | null;

export default function RegisterPage() {
    const [state, formAction, isPending] = useActionState<RegisterState, FormData>(
        register,
        null
    );

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (state?.success) {
            setTimeout(() => router.push("/login"), 2000);
        }
    }, [state, router]);

    const EyeIcon = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
    );

    const EyeOffIcon = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
        </svg>
    );

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-4 py-10">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-amber-500/5 blur-3xl" />
            </div>

            <div className="relative w-full max-w-md">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 mb-4">
                        <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3M13.5 19.5l-.53-2.65A2.25 2.25 0 0 0 10.796 15H10.5a2.25 2.25 0 0 0-2.25 2.25V19.5m0 0h5.25" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-semibold text-white tracking-tight">Create an account</h1>
                    <p className="text-neutral-400 text-sm mt-1">Join The Story community</p>
                </div>

                <div className="bg-neutral-900/80 backdrop-blur-md border border-neutral-800 rounded-2xl p-8 shadow-2xl">

                    {state?.success && (
                        <div className="flex items-center gap-3 p-4 mb-5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-sm">
                            <svg className="w-5 h-5 shrink-0 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                            {state.message} Redirecting to login…
                        </div>
                    )}

                    {state?.message && !state.success && !state.error && (
                        <div className="flex items-center gap-3 p-3 mb-5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-sm">
                            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                            </svg>
                            {state.message}
                        </div>
                    )}

                    <form action={formAction} className="space-y-4">
                        {/* Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-neutral-300 mb-1.5">Full Name</label>
                            <input
                                id="name" name="name" type="text" autoComplete="name" required
                                disabled={isPending || state?.success}
                                placeholder="Your Name"
                                className="w-full px-4 py-3 rounded-xl bg-neutral-800/60 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-200 disabled:opacity-50"
                            />
                            {state?.error?.name && <p className="text-red-400 text-xs mt-1.5 pl-1">{state.error.name[0]}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-1.5">Email Address</label>
                            <input
                                id="email" name="email" type="email" autoComplete="email" required
                                disabled={isPending || state?.success}
                                placeholder="you@example.com"
                                className="w-full px-4 py-3 rounded-xl bg-neutral-800/60 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-200 disabled:opacity-50"
                            />
                            {state?.error?.email && <p className="text-red-400 text-xs mt-1.5 pl-1">{state.error.email[0]}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-neutral-300 mb-1.5">Password</label>
                            <div className="relative">
                                <input
                                    id="password" name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="new-password" required
                                    disabled={isPending || state?.success}
                                    placeholder="Minimum 6 characters"
                                    className="w-full px-4 py-3 pr-12 rounded-xl bg-neutral-800/60 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-200 disabled:opacity-50"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    disabled={isPending || !!state?.success}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors disabled:opacity-30 p-1"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                                </button>
                            </div>
                            {state?.error?.password && <p className="text-red-400 text-xs mt-1.5 pl-1">{state.error.password[0]}</p>}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-300 mb-1.5">Confirm Password</label>
                            <div className="relative">
                                <input
                                    id="confirmPassword" name="confirmPassword"
                                    type={showConfirm ? "text" : "password"}
                                    autoComplete="new-password" required
                                    disabled={isPending || state?.success}
                                    placeholder="Re-enter your password"
                                    className="w-full px-4 py-3 pr-12 rounded-xl bg-neutral-800/60 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-200 disabled:opacity-50"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm((v) => !v)}
                                    disabled={isPending || !!state?.success}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors disabled:opacity-30 p-1"
                                    aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                                >
                                    {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                                </button>
                            </div>
                            {state?.error?.confirmPassword && <p className="text-red-400 text-xs mt-1.5 pl-1">{state.error.confirmPassword[0]}</p>}
                        </div>

                        {/* Submit */}
                        <div className="pt-1">
                            <button
                                type="submit"
                                disabled={isPending || !!state?.success}
                                className="w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2
                  bg-amber-500 text-neutral-950 hover:bg-amber-400 active:scale-[0.98]
                  disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-amber-500 disabled:active:scale-100"
                            >
                                {isPending ? (
                                    <>
                                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Creating account…
                                    </>
                                ) : "Create Account"}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-neutral-500 text-sm">
                            Already have an account?{" "}
                            <Link href="/login" className="text-amber-400 hover:text-amber-300 font-medium transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>

                <p className="text-center text-neutral-600 text-xs mt-6">
                    Protected by end-to-end encryption · The Story
                </p>
            </div>
        </div>
    );
}