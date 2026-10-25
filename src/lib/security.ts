/**
 * Security utilities for Nearloom production.
 * Input sanitization, rate limiting, and CSP nonce generation.
 */

// ── Input Sanitization ──

/** Strip HTML tags and dangerous characters from user input */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, "") // Remove angle brackets
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, "") // Remove event handlers
    .trim();
}

/** Sanitize a URL, only allowing http/https/mailto protocols */
export function sanitizeUrl(url: string): string {
  const trimmed = url.trim();
  try {
    const parsed = new URL(trimmed);
    const allowedProtocols = ["http:", "https:", "mailto:"];
    if (!allowedProtocols.includes(parsed.protocol)) {
      return "";
    }
    return parsed.href;
  } catch {
    return "";
  }
}

/** Escape HTML entities for safe rendering */
export function escapeHtml(str: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return str.replace(/[&<>"']/g, (m) => map[m]);
}

// ── Rate Limiting ──

interface RateLimitEntry {
  count: number;
  firstAttempt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Simple client-side rate limiter.
 * Returns true if the action is allowed, false if rate-limited.
 */
export function checkRateLimit(
  key: string,
  maxAttempts: number = 5,
  windowMs: number = 60_000
): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now - entry.firstAttempt > windowMs) {
    rateLimitStore.set(key, { count: 1, firstAttempt: now });
    return true;
  }

  if (entry.count >= maxAttempts) {
    return false;
  }

  entry.count += 1;
  return true;
}

/** Get remaining time until rate limit resets (in seconds) */
export function getRateLimitCooldown(
  key: string,
  windowMs: number = 60_000
): number {
  const entry = rateLimitStore.get(key);
  if (!entry) return 0;
  const elapsed = Date.now() - entry.firstAttempt;
  return Math.max(0, Math.ceil((windowMs - elapsed) / 1000));
}

// ── Validation Helpers ──

/** Validate email format */
export function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

/** Password requirements for production */
export interface PasswordValidation {
  isValid: boolean;
  errors: string[];
}

export function validatePassword(password: string): PasswordValidation {
  const errors: string[] = [];

  if (password.length < 8) errors.push("Must be at least 8 characters");
  if (!/[A-Z]/.test(password)) errors.push("Needs an uppercase letter");
  if (!/[a-z]/.test(password)) errors.push("Needs a lowercase letter");
  if (!/[0-9]/.test(password)) errors.push("Needs a number");
  if (!/[^A-Za-z0-9]/.test(password)) errors.push("Needs a special character");

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// ── CSRF Token ──

/** Generate a random token for CSRF protection */
export function generateToken(length: number = 32): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

// ── Session Helpers ──

/** Check if a JWT token is expired */
export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}

/** Clear all auth-related storage safely */
export function clearAuthStorage(): void {
  const authKeys = [
    "sb-",
    "supabase.",
    "nearloom_store_user",
  ];

  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i);
    if (key && authKeys.some((prefix) => key.startsWith(prefix))) {
      localStorage.removeItem(key);
    }
  }
}
