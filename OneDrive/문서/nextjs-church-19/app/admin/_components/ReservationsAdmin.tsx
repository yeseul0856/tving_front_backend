"use client";

import { useCallback, useEffect, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { dbError, fmtDate, nights, ROOM_LABEL, STATUS_LABEL, type Reservation, type ReservationStatus, type RoomKey } from "@/lib/boards";
import { ErrorBox, Field, FormActions, inputCls, Modal, RowActions, Toolbar } from "./ui";

type Draft = {
  id?: number;
  room: RoomKey;
  check_in: string;
  check_out: string;
  guests: number;
  guest_name: string;
  phone: string;
  email: string;
  status: ReservationStatus;
  memo: string;
  user_id: string | null;
  link_member: boolean;
};

const STATUS_STYLE: Record<ReservationStatus, string> = {
  pending: "bg-sand text-ink",
  confirmed: "bg-accent text-white",
  cancelled: "bg-line text-muted line-through",
};

const empty = (): Draft => ({ room: "forest", check_in: "", check_out: "", guests: 2, guest_name: "", phone: "", email: "", status: "confirmed", memo: "", user_id: null, link_member: false });

export default function ReservationsAdmin({ supabase }: { supabase: SupabaseClient }) {
  const [rows, setRows] = useState<Reservation[] | null>(null);
  const [filter, setFilter] = useState<ReservationStatus | "all">("all");
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    let q = supabase.from("reservations").select("*").order("check_in", { ascending: false });
    if (filter !== "all") q = q.eq("status", filter);
    const { data, error } = await q;
    if (error) setError(dbError(error));
    setRows((data as Reservation[]) ?? []);
  }, [supabase, filter]);

  useEffect(() => {
    load(); // eslint-disable-line react-hooks/set-state-in-effect -- async fetch; state is set after the await
  }, [load]);

  const open = (r?: Reservation) => {
    setFormError(null);
    setDraft(
      r
        ? { id: r.id, room: r.room, check_in: r.check_in, check_out: r.check_out, guests: r.guests, guest_name: r.guest_name, phone: r.phone ?? "", email: r.email ?? "", status: r.status, memo: r.memo ?? "", user_id: r.user_id, link_member: Boolean(r.user_id) }
        : empty(),
    );
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft) return;
    if (draft.check_out <= draft.check_in) return setFormError("체크아웃은 체크인 다음 날 이후여야 합니다.");
    setBusy(true);
    setFormError(null);

    // Link to a member account (by email) so the member sees it in "내 예약".
    let user_id: string | null = null;
    if (draft.link_member) {
      if (!draft.email.trim()) {
        setBusy(false);
        return setFormError("회원 연결을 하려면 이메일을 입력해 주세요.");
      }
      const { data, error } = await supabase.rpc("admin_find_user", { p_email: draft.email.trim() });
      if (error) {
        setBusy(false);
        return setFormError(dbError(error));
      }
      if (!data) {
        setBusy(false);
        return setFormError("이 이메일로 가입한 회원이 없습니다. 회원 연결을 해제하거나 이메일을 확인해 주세요.");
      }
      user_id = data as string;
    }

    const payload = {
      room: draft.room,
      check_in: draft.check_in,
      check_out: draft.check_out,
      guests: draft.guests,
      guest_name: draft.guest_name.trim(),
      phone: draft.phone.trim() || null,
      email: draft.email.trim() || null,
      status: draft.status,
      memo: draft.memo.trim() || null,
      user_id,
    };
    const { error } = draft.id ? await supabase.from("reservations").update(payload).eq("id", draft.id) : await supabase.from("reservations").insert(payload);
    setBusy(false);
    if (error) return setFormError(dbError(error));
    setDraft(null);
    load();
  };

  const remove = async (r: Reservation) => {
    if (!confirm(`${r.guest_name}님 예약(${ROOM_LABEL[r.room]}, ${fmtDate(r.check_in)})을 삭제할까요?\n취소 처리만 필요하면 상태를 '취소'로 바꾸세요.`)) return;
    const { error } = await supabase.from("reservations").delete().eq("id", r.id);
    if (error) return setError(dbError(error));
    load();
  };

  const filters: [ReservationStatus | "all", string][] = [["all", "전체"], ["pending", "대기"], ["confirmed", "확정"], ["cancelled", "취소"]];

  return (
    <div>
      <Toolbar onCreate={() => open()} createLabel="예약 등록">
        {filters.map(([v, l]) => (
          <button key={v} onClick={() => setFilter(v)} className={`border px-3 py-1.5 text-xs ${filter === v ? "border-ink bg-ink text-white" : "border-line hover:border-ink"}`}>
            {l}
          </button>
        ))}
        <span className="ml-2 text-sm text-muted">{rows?.length ?? 0}건</span>
      </Toolbar>
      <ErrorBox message={error} />

      <div className="overflow-x-auto border-t border-ink">
        <table className="w-full min-w-[820px] text-sm">
          <thead className="border-b border-line text-left text-xs text-muted">
            <tr>
              <th className="py-3 pr-4 font-medium">상태</th>
              <th className="py-3 pr-4 font-medium">객실</th>
              <th className="py-3 pr-4 font-medium">일정</th>
              <th className="py-3 pr-4 font-medium">인원</th>
              <th className="py-3 pr-4 font-medium">예약자</th>
              <th className="py-3 pr-4 font-medium">연락처</th>
              <th className="py-3 text-right font-medium">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows === null && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-muted">불러오는 중…</td>
              </tr>
            )}
            {rows?.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-muted">예약이 없습니다.</td>
              </tr>
            )}
            {rows?.map((r) => (
              <tr key={r.id} className={r.status === "cancelled" ? "text-muted" : ""}>
                <td className="py-3.5 pr-4">
                  <span className={`px-2 py-0.5 text-[11px] font-semibold ${STATUS_STYLE[r.status]}`}>{STATUS_LABEL[r.status]}</span>
                </td>
                <td className="whitespace-nowrap py-3.5 pr-4">{ROOM_LABEL[r.room]}</td>
                <td className="whitespace-nowrap py-3.5 pr-4 tabular-nums">
                  {fmtDate(r.check_in)} – {fmtDate(r.check_out)} <span className="text-xs text-muted">({nights(r.check_in, r.check_out)}박)</span>
                </td>
                <td className="py-3.5 pr-4 tabular-nums">{r.guests}명</td>
                <td className="py-3.5 pr-4">
                  {r.guest_name}
                  {r.user_id && <span className="ml-1.5 text-[10px] text-accent">회원</span>}
                  {r.memo && <p className="mt-0.5 line-clamp-1 max-w-48 text-xs text-muted">{r.memo}</p>}
                </td>
                <td className="py-3.5 pr-4 text-xs text-muted">
                  {r.phone}
                  {r.phone && r.email && <br />}
                  {r.email}
                </td>
                <td className="py-3.5">
                  <RowActions onEdit={() => open(r)} onDelete={() => remove(r)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {draft && (
        <Modal title={draft.id ? "edit reservation" : "new reservation"} onClose={() => setDraft(null)}>
          <form onSubmit={save} className="space-y-5">
            <ErrorBox message={formError} />
            <div className="grid grid-cols-2 gap-4">
              <Field label="객실">
                <select value={draft.room} onChange={(e) => setDraft({ ...draft, room: e.target.value as RoomKey })} className={inputCls}>
                  {(Object.keys(ROOM_LABEL) as RoomKey[]).map((k) => (
                    <option key={k} value={k}>
                      {ROOM_LABEL[k]}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="상태">
                <select value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value as ReservationStatus })} className={inputCls}>
                  {(Object.keys(STATUS_LABEL) as ReservationStatus[]).map((k) => (
                    <option key={k} value={k}>
                      {STATUS_LABEL[k]}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="체크인">
                <input type="date" required value={draft.check_in} onChange={(e) => setDraft({ ...draft, check_in: e.target.value })} className={inputCls} />
              </Field>
              <Field label="체크아웃">
                <input type="date" required min={draft.check_in || undefined} value={draft.check_out} onChange={(e) => setDraft({ ...draft, check_out: e.target.value })} className={inputCls} />
              </Field>
              <Field label="예약자 이름">
                <input required maxLength={50} value={draft.guest_name} onChange={(e) => setDraft({ ...draft, guest_name: e.target.value })} className={inputCls} />
              </Field>
              <Field label="인원">
                <input type="number" min={1} max={10} required value={draft.guests} onChange={(e) => setDraft({ ...draft, guests: Number(e.target.value) || 1 })} className={inputCls} />
              </Field>
              <Field label="연락처">
                <input maxLength={30} value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} placeholder="010-0000-0000" className={inputCls} />
              </Field>
              <Field label="이메일">
                <input type="email" maxLength={200} value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} className={inputCls} />
              </Field>
            </div>
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" checked={draft.link_member} onChange={(e) => setDraft({ ...draft, link_member: e.target.checked })} className="mt-0.5 h-4 w-4 accent-[#da6c35]" />
              <span>
                회원 계정에 연결
                <span className="block text-xs text-muted">위 이메일로 가입한 회원이 &lsquo;내 프로필 → 내 예약&rsquo;에서 이 예약을 볼 수 있습니다.</span>
              </span>
            </label>
            <Field label="메모 (관리자용)">
              <textarea rows={3} maxLength={2000} value={draft.memo} onChange={(e) => setDraft({ ...draft, memo: e.target.value })} className={inputCls} />
            </Field>
            <FormActions busy={busy} onCancel={() => setDraft(null)} submitLabel={draft.id ? "수정" : "등록"} />
          </form>
        </Modal>
      )}
    </div>
  );
}
