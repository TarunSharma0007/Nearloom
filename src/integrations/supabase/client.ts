import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Detect whether valid Supabase configuration is present
export const isSupabaseConfigured = Boolean(
  rawUrl &&
  rawKey &&
  !rawUrl.includes("your-project") &&
  rawUrl.startsWith("http")
);

const SUPABASE_URL = isSupabaseConfigured ? rawUrl : "https://placeholder-offline.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = isSupabaseConfigured ? rawKey : "placeholder-offline-key";

if (!isSupabaseConfigured && typeof window !== "undefined") {
  console.info(
    "Nearloom is running in High-Availability Resilient Local/Demo Mode. Connecting to dataStore."
  );
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
  }
});
