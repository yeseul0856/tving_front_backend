"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { dbError, fmtDate, type Notice } from "@/lib/boards";
import { ErrorBox, Field, FormActions, inputCls, Modal, RowActions, Toolbar } from "./ui";

type Row = Notice & { comments: { count: number }[] };
type Draft = { id?: number; title: string; content: string; pinned: boolean };

export default function NoticesAdmin({ supabase }: { supabase: SupabaseClient }) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const { data, error } = await supabase.from("notices").select("*, comments(count)").order("pinned", { ascending: false }).order("created_at", { ascending: false });
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
    const payload = { title: draft.title.trim(), content: draft.content, pinned: draft.pinned };
    const { error } = draft.id ? await supabase.from("notices").update(payload).eq("id", draft.id) : await supabase.from("notices").insert(payload);
    setBusy(false);
    if (error) return setError(dbError(error));
    setDraft(null);
    load();
  };

  const remove = async (n: Row) => {
    const c = n.comments?.[0]?.count ?? 0;
    if (!confirm(`"${n.title}" 공지를 삭제할까요?${c ? `\n댓글 ${c}개도 함께 삭제됩니다.` : ""}`)) return;
    const { error } = await supabase.from("notices").delete().eq("id", n.id);
    if (error) return setError(dbError(error));
    load();
  };

  return (
    <div>
      <Toolbar onCreate={() => setDraft({ title: "", content: "", pinned: false })} createLabel="공지 작성">
        <span className="text-sm text-muted">총 {rows?.length ?? 0}건</span>
      </Toolbar>
      <ErrorBox message={error} />

      <div className="overflow-x-auto border-t border-ink">
        <table className="w-full min-w-[560px] text-sm">
          <thead className="border-b border-line text-left text-xs text-muted">
            <tr>
              <th className="py-3 pr-4 font-medium">제목</th>
              <th className="w-20 py-3 pr-4 font-medium">댓글</th>
              <th className="w-28 py-3 pr-4 font-medium">작성일</th>
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
                <td colSpan={4} className="py-8 text-center text-muted">공지가 없습니다.</td>
              </tr>
            )}
            {rows?.map((n) => (
              <tr key={n.id}>
                <td className="py-3.5 pr-4">
                  {n.pinned && <span className="mr-2 bg-accent px-1.5 py-0.5 text-[10px] font-semibold text-white">고정</span>}
                  <Link href={`/notices/${n.id}`} className="hover:text-accent" target="_blank">
                    {n.title}
                  </Link>
                </td>
                <td className="py-3.5 pr-4 tabular-nums text-muted">{n.comments?.[0]?.count ?? 0}</td>
                <td className="py-3.5 pr-4 tabular-nums text-muted">{fmtDate(n.created_at)}</td>
                <td className="py-3.5">
                  <RowActions onEdit={() => setDraft({ id: n.id, title: n.title, content: n.content, pinned: n.pinned })} onDelete={() => remove(n)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {draft && (
        <Modal title={draft.id ? "edit notice" : "new notice"} onClose={() => setDraft(null)}>
          <form onSubmit={save} className="space-y-5">
            <Field label="제목">
              <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} required maxLength={200} className={inputCls} />
            </Field>
            <Field label="내용">
              <textarea value={draft.content} onChange={(e) => setDraft({ ...draft, content: e.target.value })} rows={10} maxLength={20000} className={inputCls} />
            </Field>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={draft.pinned} onChange={(e) => setDraft({ ...draft, pinned: e.target.checked })} className="h-4 w-4 accent-[#da6c35]" />
              상단 고정
            </label>
            <FormActions busy={busy} onCancel={() => setDraft(null)} submitLabel={draft.id ? "수정" : "등록"} />
          </form>
        </Modal>
      )}
    </div>
  );
}
