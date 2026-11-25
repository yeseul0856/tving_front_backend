import type { SupabaseClient } from "@supabase/supabase-js";

export type Gender = "male" | "female" | "other";

export type Profile = {
  id: string;
  full_name: string | null;
  age: number | null;
  gender: Gender | null;
  postcode: string | null;
  address: string | null;
  address_detail: string | null;
  avatar_url: string | null;
  onboarded: boolean;
};

export const GENDER_LABEL: Record<Gender, string> = { male: "남성", female: "여성", other: "기타" };

export const PROFILE_PATH = "/profile";
export const AVATAR_BUCKET = "avatars";
export const AVATAR_MAX_BYTES = 2 * 1024 * 1024;
export const AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export const PROFILE_DATA_BUCKET = "profile-data";
export const profileDataPath = (userId: string) => `${userId}/profile.json`;

/**
 * Back up the user's current profile row (the source of truth) as JSON in Storage:
 * profile-data/<uid>/profile.json (private bucket, owner-only).
 */
export async function syncProfileToStorage(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single<Profile & { created_at: string; updated_at: string }>();
  if (error) return { error: error.message };

  const body = JSON.stringify({ version: 1, synced_at: new Date().toISOString(), profile: data }, null, 2);
  const { error: upErr } = await supabase.storage
    .from(PROFILE_DATA_BUCKET)
    .upload(profileDataPath(userId), new Blob([body], { type: "application/json" }), { upsert: true, contentType: "application/json", cacheControl: "0" });
  return { error: upErr?.message ?? null, syncedAt: upErr ? null : new Date() };
}

/** Read back the JSON copy (null if not synced yet). */
export async function readProfileFromStorage(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase.storage.from(PROFILE_DATA_BUCKET).download(profileDataPath(userId));
  if (error || !data) return null;
  try {
    return JSON.parse(await data.text()) as { version: number; synced_at: string; profile: Profile };
  } catch {
    return null;
  }
}

/**
 * Where to send a user right after they sign in.
 * First-time users (profile not onboarded yet) go to the profile page; everyone else to `next`.
 */
export async function postLoginPath(supabase: SupabaseClient, userId: string, next: string) {
  const { data, error } = await supabase.from("profiles").select("onboarded").eq("id", userId).maybeSingle();
  if (error) return next; // e.g. table not migrated yet: don't block login
  if (!data || !data.onboarded) return `${PROFILE_PATH}?welcome=1&next=${encodeURIComponent(next)}`;
  return next;
}
