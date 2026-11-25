"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { fmtDate, type Notice } from "@/lib/boards";

type Row = Pick<Notice, "id" | "title" | "pinned" | "created_at"> & { comments: { count: number }[] };

export default function NoticeList({ limit }: { limit?: number }) {
  const supabase = useMemo(() => createClient(), []);
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;
    let q = supabase.from("notices").select("id, title, pinned, created_at, comments(count)").order("pinned", { ascending: false }).order("created_at", { ascending: false });
    if (limit) q = q.limit(limit);
    q.then(({ data, error }) => {
      if (error) setError(error.message);
      setRows((data as Row[]) ?? []);
    });
  }, [supabase, limit]);

  if (error) return <p className="text-sm text-red-700">{error}</p>;
  if (!rows) return <p className="py-6 text-sm text-muted">불러오는 중…</p>;
  if (rows.length === 0) return <p className="border-t border-ink py-10 text-center text-sm text-muted">등록된 공지가 없습니다.</p>;

  return (
    <ul className="border-t border-ink">
      {rows.map((n) => (
        <li key={n.id} className="border-b border-line">
          <Link href={`/notices/${n.id}`} className="flex items-center justify-between gap-6 py-5 transition-colors hover:text-accent">
            <span className="flex min-w-0 items-center gap-3">
              {n.pinned && <span className="shrink-0 bg-accent px-2 py-0.5 text-[11px] font-semibold text-white">공지</span>}
              <span className="truncate">{n.title}</span>
              {n.comments?.[0]?.count ? <span className="shrink-0 text-xs text-accent">[{n.comments[0].count}]</span> : null}
            </span>
            <span className="shrink-0 text-sm tabular-nums text-muted">{fmtDate(n.created_at)}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
