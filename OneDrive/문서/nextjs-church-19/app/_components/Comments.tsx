"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/lib/useAuth";
import { dbError, fmtDateTime, type Comment } from "@/lib/boards";

type Target = { notice_id: number } | { faq_id: number };

function Avatar({ src, name }: { src: string | null; name: string | null }) {
  return (
    <span className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full bg-sand font-serif text-lg text-accent">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element -- avatar hosts vary
        <img src={src} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
      ) : (
        (name || "?").charAt(0).toUpperCase()
      )}
    </span>
  );
}

export default function Comments({ target }: { target: Target }) {
  const { supabase, user, isAdmin, loading: authLoading } = useAuth();
  const pathname = usePathname();
  const [items, setItems] = useState<Comment[] | null>(null);
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<{ id: number; body: string } | null>(null);

  const [col, id] = "notice_id" in target ? (["notice_id", target.notice_id] as const) : (["faq_id", target.faq_id] as const);

  const load = useCallback(async () => {
    if (!supabase) return;
    const { data, error } = await supabase.from("comments").select("*").eq(col, id).order("created_at", { ascending: true });
    if (error) setError(dbError(error));
    setItems(data ?? []);
  }, [supabase, col, id]);

  useEffect(() => {
    load(); // eslint-disable-line react-hooks/set-state-in-effect -- async fetch; state is set after the await
  }, [load]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !body.trim()) return;
    setBusy(true);
    setError(null);
    const { error } = await supabase.from("comments").insert({ [col]: id, body: body.trim() });
    setBusy(false);
    if (error) return setError(dbError(error));
    setBody("");
    load();
  };

  const saveEdit = async () => {
    if (!supabase || !editing || !editing.body.trim()) return;
    const { error } = await supabase.from("comments").update({ body: editing.body.trim() }).eq("id", editing.id);
    if (error) return setError(dbError(error));
    setEditing(null);
    load();
  };

  const remove = async (c: Comment) => {
    if (!supabase || !confirm("댓글을 삭제할까요?")) return;
    const { error } = await supabase.from("comments").delete().eq("id", c.id);
    if (error) return setError(dbError(error));
    load();
  };

  return (
    <section className="mt-16 border-t border-ink pt-10" aria-label="댓글">
      <h2 className="font-serif text-3xl text-accent">
        comments <span className="font-sans text-base text-muted">{items ? items.length : ""}</span>
      </h2>

      {error && <p className="mt-4 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <ul className="mt-6 divide-y divide-line">
        {items === null && <li className="py-6 text-sm text-muted">불러오는 중…</li>}
        {items?.length === 0 && <li className="py-6 text-sm text-muted">첫 댓글을 남겨 주세요.</li>}
        {items?.map((c) => {
          const mine = user?.id === c.user_id;
          return (
            <li key={c.id} className="flex gap-4 py-5">
              <Avatar src={c.author_avatar} name={c.author_name} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                  <b className="font-semibold">{c.author_name ?? "회원"}</b>
                  {mine && <span className="text-xs text-accent">내 댓글</span>}
                  <span className="text-xs text-muted">
                    {fmtDateTime(c.created_at)}
                    {c.updated_at !== c.created_at && " (수정됨)"}
                  </span>
                  <span className="ml-auto flex gap-3 text-xs text-muted">
                    {mine && editing?.id !== c.id && (
                      <button onClick={() => setEditing({ id: c.id, body: c.body })} className="hover:text-ink">
                        수정
                      </button>
                    )}
                    {(mine || isAdmin) && (
                      <button onClick={() => remove(c)} className="hover:text-red-700">
                        삭제{!mine && isAdmin ? "(관리자)" : ""}
                      </button>
                    )}
                  </span>
                </div>
                {editing?.id === c.id ? (
                  <div className="mt-2">
                    <textarea value={editing.body} onChange={(e) => setEditing({ ...editing, body: e.target.value })} maxLength={1000} rows={3} className="w-full border border-line bg-white p-3 text-sm focus:border-accent focus:outline-none" />
                    <div className="mt-2 flex gap-2 text-sm">
                      <button onClick={saveEdit} className="bg-ink px-4 py-1.5 text-white">
                        저장
                      </button>
                      <button onClick={() => setEditing(null)} className="border border-line px-4 py-1.5">
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="mt-1.5 whitespace-pre-wrap break-words text-sm leading-relaxed">{c.body}</p>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {/* write */}
      {authLoading ? null : user ? (
        <form onSubmit={submit} className="mt-6">
          <textarea value={body} onChange={(e) => setBody(e.target.value)} maxLength={1000} rows={3} placeholder="댓글을 입력하세요" className="w-full border border-line bg-white p-4 text-sm focus:border-accent focus:outline-none" />
          <div className="mt-2 flex items-center justify-between text-xs text-muted">
            <span>{body.length} / 1000</span>
            <button type="submit" disabled={busy || !body.trim()} className="bg-accent px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-40">
              {busy ? "등록 중…" : "댓글 등록"}
            </button>
          </div>
        </form>
      ) : (
        <p className="mt-6 border border-dashed border-line px-5 py-4 text-sm text-muted">
          댓글은 로그인한 회원만 작성할 수 있습니다.{" "}
          <Link href={`/login?next=${encodeURIComponent(pathname)}`} className="font-semibold text-accent underline underline-offset-4">
            로그인하기
          </Link>
        </p>
      )}
    </section>
  );
}
