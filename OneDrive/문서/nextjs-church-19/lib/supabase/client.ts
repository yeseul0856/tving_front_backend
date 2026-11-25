import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_KEY, SUPABASE_URL, isSupabaseConfigured } from "./env";

/** Browser Supabase client. Returns null when env vars are not set yet. */
export function createClient() {
  if (!isSupabaseConfigured) return null;
  return createBrowserClient(SUPABASE_URL, SUPABASE_KEY);
}
