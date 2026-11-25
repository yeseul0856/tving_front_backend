"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { fmtDateTime, type Notice } from "@/lib/boards";
import Comments from "../../_components/Comments";

export default function NoticeDetail() {
  const { id } = useParams<{ id: string }>();
  const noticeId = Number(id);
  const supabase = useMemo(() => createClient(), []);
  const [notice, setNotice] = useState<Notice | null | undefined>(undefined);

  useEffect(() => {
    if (!supabase || !Number.isInteger(noticeId)) return;
    supabase
      .from("notices")
      .select("*")
      .eq("id", noticeId)
      .maybeSingle<Notice>()
      .then(({ data }) => setNotice(data));
  }, [supabase, noticeId]);

  if (!Number.isInteger(noticeId) || notice === null)
    return (
      <div className="border-t border-ink py-16 text-center">
        <p className="text-muted">존재하지 않거나 삭제된 공지입니다.</p>
        <Link href="/notices" className="mt-6 inline-block font-serif text-xl text-accent underline underline-offset-4">
          back to list
        </Link>
      </div>
    );
  if (notice === undefined) return <p className="py-16 text-center text-muted">불러오는 중…</p>;

  return (
    <article>
      <header className="border-y border-ink py-6">
        {notice.pinned && <span className="bg-accent px-2 py-0.5 text-[11px] font-semibold text-white">공지</span>}
        <h2 className="mt-3 text-2xl font-semibold leading-snug">{notice.title}</h2>
        <p className="mt-2 text-sm text-muted">{fmtDateTime(notice.created_at)}</p>
      </header>
      <div className="whitespace-pre-wrap break-words py-10 leading-loose">{notice.content}</div>
      <Link href="/notices" className="font-serif text-xl text-accent underline underline-offset-4">
        ← back to list
      </Link>
      <Comments target={{ notice_id: notice.id }} />
    </article>
  );
}
