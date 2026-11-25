"use client";

import { useEffect, useMemo, useState } from "react";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

export type Role = "user" | "admin";
export type SessionProfile = { full_name: string | null; avatar_url: string | null; role: Role };

/**
 * Current user + profile (name, avatar, role) on the client.
 * - user === null  → 일반 사용자 (signed out)
 * - role "user"    → 로그인 사용자
 * - role "admin"   → 관리자
 * Real enforcement happens in the database (RLS); this only drives the UI.
 */
export function useAuth() {
  const supabase = useMemo(() => createClient(), []);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<SessionProfile | null>(null);
  const [loading, setLoading] = useState(Boolean(supabase));

  useEffect(() => {
    if (!supabase) return;
    let alive = true;
    const apply = async (u: User | null) => {
      const p = u ? (await supabase.from("profiles").select("full_name, avatar_url, role").eq("id", u.id).maybeSingle<SessionProfile>()).data : null;
      if (!alive) return;
      setUser(u);
      setProfile(p);
      setLoading(false);
    };
    supabase.auth.getUser().then(({ data }) => apply(data.user));
    const { data } = supabase.auth.onAuthStateChange((_e, session) => {
      setTimeout(() => apply(session?.user ?? null), 0); // don't await Supabase inside the auth callback
    });
    return () => {
      alive = false;
      data.subscription.unsubscribe();
    };
  }, [supabase]);

  const meta = user?.user_metadata ?? {};
  const name: string = profile?.full_name || meta.full_name || meta.name || meta.nickname || user?.email?.split("@")[0] || "";
  const avatar: string | null = profile?.avatar_url || meta.avatar_url || meta.picture || null;

  return {
    supabase: supabase as SupabaseClient | null,
    user,
    profile,
    name,
    avatar,
    isAdmin: profile?.role === "admin",
    loading,
  };
}
