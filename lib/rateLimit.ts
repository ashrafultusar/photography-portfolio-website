/**
 * In-memory IP-based rate limiter.
 * Separate from the DB-persisted account lockout.
 * Limits: max 10 login requests per IP per 15 minutes.
 * This prevents bot-level brute force; the DB lockout
 * handles per-account brute force.
 */

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 10;

interface RateLimitEntry {
    count: number;
    resetAt: number;
}

// Module-level store (persists across requests within the same process)
const store = new Map<string, RateLimitEntry>();

// Clean stale entries every 5 minutes to avoid memory leaks
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
        if (entry.resetAt < now) {
            store.delete(key);
        }
    }
}, 5 * 60 * 1000);

export interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    retryAfter?: number; // seconds until reset
}

export function checkRateLimit(key: string): RateLimitResult {
    const now = Date.now();
    const entry = store.get(key);

    if (!entry || entry.resetAt < now) {
        // First request or window expired
        store.set(key, { count: 1, resetAt: now + WINDOW_MS });
        return { allowed: true, remaining: MAX_REQUESTS - 1 };
    }

    if (entry.count >= MAX_REQUESTS) {
        const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
        return { allowed: false, remaining: 0, retryAfter };
    }

    entry.count++;
    return { allowed: true, remaining: MAX_REQUESTS - entry.count };
}
