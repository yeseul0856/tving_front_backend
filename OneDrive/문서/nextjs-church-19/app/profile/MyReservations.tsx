"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/useAuth";
import { fmtDate, nights, ROOM_LABEL, STATUS_LABEL, type Reservation } from "@/lib/boards";

/** Signed-in members can read only their own reservations (enforced by RLS). */
export default function MyReservations() {
  const { supabase, user } = useAuth();
  const [rows, setRows] = useState<Reservation[] | null>(null);

  useEffect(() => {
    if (!supabase || !user) return;
    supabase
      .from("reservations")
      .select("*")
      .eq("user_id", user.id)
      .order("check_in", { ascending: false })
      .then(({ data }) => setRows((data as Reservation[]) ?? []));
  }, [supabase, user]);

  if (!user) return null;

  return (
    <section className="mt-20 border-t border-ink pt-10" aria-label="내 예약">
      <h2 className="font-serif text-4xl text-accent">my reservations</h2>
      <p className="mt-2 text-sm text-muted">내 예약 — 관리자가 회원 계정에 연결한 예약이 표시됩니다.</p>
      <ul className="mt-6 divide-y divide-line">
        {rows === null && <li className="py-6 text-sm text-muted">불러오는 중…</li>}
        {rows?.length === 0 && <li className="py-6 text-sm text-muted">예약 내역이 없습니다.</li>}
        {rows?.map((r) => (
          <li key={r.id} className={`flex flex-wrap items-center justify-between gap-3 py-5 ${r.status === "cancelled" ? "text-muted" : ""}`}>
            <div>
              <p className="font-medium">{ROOM_LABEL[r.room]}</p>
              <p className="mt-1 text-sm tabular-nums text-muted">
                {fmtDate(r.check_in)} – {fmtDate(r.check_out)} · {nights(r.check_in, r.check_out)}박 · {r.guests}명
              </p>
            </div>
            <span className={`px-2.5 py-1 text-xs font-semibold ${r.status === "confirmed" ? "bg-accent text-white" : r.status === "pending" ? "bg-sand" : "bg-line line-through"}`}>
              {STATUS_LABEL[r.status]}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
