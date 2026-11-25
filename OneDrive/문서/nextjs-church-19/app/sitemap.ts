import type { MetadataRoute } from "next";
import { cacheLife } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import { SITE_URL } from "@/lib/site";
import { SUPABASE_KEY, SUPABASE_URL, isSupabaseConfigured } from "@/lib/supabase/env";

/** Public notices / FAQs (readable by anyone via RLS). Cached for an hour. */
async function getBoardEntries() {
  "use cache";
  cacheLife("hours");

  if (!isSupabaseConfigured) return { notices: [], faqs: [] };
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } });
  const [notices, faqs] = await Promise.all([
    supabase.from("notices").select("id, updated_at").order("created_at", { ascending: false }).limit(1000),
    supabase.from("faqs").select("id, updated_at").order("sort_order").limit(1000),
  ]);
  return { notices: notices.data ?? [], faqs: faqs.data ?? [] };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { notices, faqs } = await getBoardEntries();
  const latest = (rows: { updated_at: string }[]) => (rows.length ? rows.map((r) => r.updated_at).sort().at(-1) : undefined);

  return [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/notices`, lastModified: latest(notices), changeFrequency: "daily", priority: 0.7 },
    { url: `${SITE_URL}/faq`, lastModified: latest(faqs), changeFrequency: "weekly", priority: 0.6 },
    ...notices.map((n) => ({ url: `${SITE_URL}/notices/${n.id}`, lastModified: n.updated_at, changeFrequency: "monthly" as const, priority: 0.5 })),
    ...faqs.map((f) => ({ url: `${SITE_URL}/faq/${f.id}`, lastModified: f.updated_at, changeFrequency: "monthly" as const, priority: 0.4 })),
    { url: `${SITE_URL}/terms`, lastModified: "2026-11-25", changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/privacy`, lastModified: "2026-11-25", changeFrequency: "yearly", priority: 0.2 },
  ];
}
