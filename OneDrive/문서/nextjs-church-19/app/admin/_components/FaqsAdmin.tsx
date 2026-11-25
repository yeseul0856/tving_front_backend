"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { dbError, type Faq } from "@/lib/boards";
import { ErrorBox, Field, FormActions, inputCls, Modal, RowActions, Toolbar } from "./ui";

type Row = Faq & { comments: { count: number }[] };
type Draft = { id?: number; question: string; answer: string; sort_order: number };

export default function FaqsAdmin({ supabase }: { supabase: SupabaseClient }) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const { data, error } = await supabase.from("faqs").select("*, comments(count)").order("sort_order").order("id");
    if (error) setError(dbError(error));
    setRows((data as Row[]) ?? []);
  }, [supabase]);

  useEffect(() => {
    load(); // eslint-disable-line react-hooks/set-state-in-effect -- async fetch; state is set after the await
  }, [load]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft) return;
    setBusy(true);
    setError(null);
    const payload = { question: draft.question.trim(), answer: draft.answer, sort_order: draft.sort_order };
    const { error } = draft.id ? await supabase.from("faqs").update(payload).eq("id", draft.id) : await supabase.from("faqs").insert(payload);
    setBusy(false);
    if (error) return setError(dbError(error));
    setDraft(null);
    load();
  };

  const remove = async (f: Row) => {
    const c = f.comments?.[0]?.count ?? 0;
    if (!confirm(`이 질문을 삭제할까요?\n"${f.question}"${c ? `\n댓글 ${c}개도 함께 삭제됩니다.` : ""}`)) return;
    const { error } = await supabase.from("faqs").delete().eq("id", f.id);
    if (error) return setError(dbError(error));
    load();
  };

  const nextOrder = (rows?.reduce((m, r) => Math.max(m, r.sort_order), 0) ?? 0) + 1;

  return (
    <div>
      <Toolbar onCreate={() => setDraft({ question: "", answer: "", sort_order: nextOrder })} createLabel="질문 추가">
        <span className="text-sm text-muted">총 {rows?.length ?? 0}건 · 순서 숫자가 작을수록 위에 표시됩니다</span>
      </Toolbar>
      <ErrorBox message={error} />

      <div className="overflow-x-auto border-t border-ink">
        <table className="w-full min-w-[560px] text-sm">
          <thead className="border-b border-line text-left text-xs text-muted">
            <tr>
              <th className="w-16 py-3 pr-4 font-medium">순서</th>
              <th className="py-3 pr-4 font-medium">질문</th>
              <th className="w-20 py-3 pr-4 font-medium">댓글</th>
              <th className="w-24 py-3 text-right font-medium">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows === null && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-muted">불러오는 중…</td>
              </tr>
            )}
            {rows?.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-muted">질문이 없습니다.</td>
              </tr>
            )}
            {rows?.map((f) => (
              <tr key={f.id}>
                <td className="py-3.5 pr-4 tabular-nums text-muted">{f.sort_order}</td>
                <td className="py-3.5 pr-4">
                  <Link href={`/faq/${f.id}`} target="_blank" className="hover:text-accent">
                    {f.question}
                  </Link>
                  <p className="mt-1 line-clamp-1 text-xs text-muted">{f.answer}</p>
                </td>
                <td className="py-3.5 pr-4 tabular-nums text-muted">{f.comments?.[0]?.count ?? 0}</td>
                <td className="py-3.5">
                  <RowActions onEdit={() => setDraft({ id: f.id, question: f.question, answer: f.answer, sort_order: f.sort_order })} onDelete={() => remove(f)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {draft && (
        <Modal title={draft.id ? "edit faq" : "new faq"} onClose={() => setDraft(null)}>
          <form onSubmit={save} className="space-y-5">
            <Field label="질문">
              <input value={draft.question} onChange={(e) => setDraft({ ...draft, question: e.target.value })} required maxLength={300} className={inputCls} />
            </Field>
            <Field label="답변">
              <textarea value={draft.answer} onChange={(e) => setDraft({ ...draft, answer: e.target.value })} rows={7} maxLength={10000} className={inputCls} />
            </Field>
            <Field label="표시 순서" hint="숫자가 작을수록 위에 표시됩니다.">
              <input type="number" value={draft.sort_order} onChange={(e) => setDraft({ ...draft, sort_order: Number(e.target.value) || 0 })} className={`${inputCls} max-w-32`} />
            </Field>
            <FormActions busy={busy} onCancel={() => setDraft(null)} submitLabel={draft.id ? "수정" : "등록"} />
          </form>
        </Modal>
      )}
    </div>
  );
}
