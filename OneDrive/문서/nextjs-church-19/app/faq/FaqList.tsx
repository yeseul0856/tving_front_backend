"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Faq } from "@/lib/boards";

type Row = Pick<Faq, "id" | "question" | "answer"> & { comments: { count: number }[] };

export default function FaqList({ limit }: { limit?: number }) {
  const supabase = useMemo(() => createClient(), []);
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;
    let q = supabase.from("faqs").select("id, question, answer, comments(count)").order("sort_order").order("id");
    if (limit) q = q.limit(limit);
    q.then(({ data, error }) => {
      if (error) setError(error.message);
      setRows((data as Row[]) ?? []);
    });
  }, [supabase, limit]);

  if (error) return <p className="text-sm text-red-700">{error}</p>;
  if (!rows) return <p className="py-6 text-sm text-muted">불러오는 중…</p>;
  if (rows.length === 0) return <p className="border-t border-ink py-10 text-center text-sm text-muted">등록된 질문이 없습니다.</p>;

  return (
    <div className="border-t border-ink">
      {rows.map((f) => (
        <details key={f.id} className="group border-b border-line">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 transition-colors hover:text-accent [&::-webkit-details-marker]:hidden">
            <span>
              <span className="mr-2 font-serif text-xl text-accent">Q.</span>
              {f.question}
            </span>
            <span className="shrink-0 text-xl text-accent transition-transform group-open:rotate-45">+</span>
          </summary>
          <div className="pb-6 pl-7 text-sm leading-relaxed text-muted">
            <p className="whitespace-pre-wrap">{f.answer}</p>
            <Link href={`/faq/${f.id}`} className="mt-3 inline-block text-xs text-accent underline underline-offset-4">
              댓글 {f.comments?.[0]?.count ?? 0}개 · 자세히 보기
            </Link>
          </div>
        </details>
      ))}
    </div>
  );
}
