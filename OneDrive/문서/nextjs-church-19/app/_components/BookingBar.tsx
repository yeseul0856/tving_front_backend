"use client";

import { useState, useSyncExternalStore } from "react";
import { createClient } from "@/lib/supabase/client";
import { rooms } from "./data";

const noopSubscribe = () => () => {};

const iso = (d: Date) => d.toISOString().slice(0, 10);
const addDays = (s: string, n: number) => {
  const d = new Date(s);
  d.setDate(d.getDate() + n);
  return iso(d);
};

export default function BookingBar() {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [result, setResult] = useState<string | null>(null);
  // "today" depends on the visitor's clock, so compute it after mount (not during prerender).
  const today = useSyncExternalStore(
    noopSubscribe,
    () => iso(new Date()),
    () => undefined,
  );
  const nights = checkIn && checkOut ? Math.round((+new Date(checkOut) - +new Date(checkIn)) / 86400000) : 0;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nights < 1) return setResult("체크아웃 날짜는 체크인 다음 날 이후로 선택해 주세요.");

    // Rooms already booked in that range (public function: returns room keys only, no personal data).
    let booked: string[] = [];
    const supabase = createClient();
    if (supabase) {
      setResult("확인 중…");
      const { data, error } = await supabase.rpc("booked_rooms", { p_check_in: checkIn, p_check_out: checkOut });
      if (error) return setResult(`예약 현황을 불러오지 못했습니다: ${error.message}`);
      booked = (data as string[]) ?? [];
    }

    const fits = rooms.filter((r) => r.max >= guests);
    if (!fits.length) return setResult(`${guests}명이 머물 수 있는 객실이 없습니다. 인원을 조정해 주세요.`);
    const available = fits.filter((r) => !booked.includes(r.en.toLowerCase()));
    const full = fits.filter((r) => booked.includes(r.en.toLowerCase()));
    setResult(
      available.length
        ? `${nights}박 · ${guests}명 — 예약 가능: ${available.map((r) => `${r.name} ${r.en}`).join(", ")}${full.length ? ` (마감: ${full.map((r) => r.name).join(", ")})` : ""}`
        : `선택하신 날짜는 모든 객실이 마감되었습니다. 다른 날짜를 선택해 주세요.`,
    );
  };

  const label = "font-serif text-xl text-accent";
  const input = "mt-2 w-full border-0 bg-transparent p-0 text-base font-medium text-ink focus:outline-none focus:ring-0";

  return (
    <div>
      <form onSubmit={onSubmit} className="grid border border-ink/15 bg-white sm:grid-cols-[1fr_1fr_0.7fr_auto]">
        <label className="block border-b border-line px-6 py-4 sm:border-b-0 sm:border-r">
          <span className={label}>check in</span>
          <input
            type="date"
            required
            min={today}
            value={checkIn}
            onChange={(e) => {
              setCheckIn(e.target.value);
              if (!checkOut || checkOut <= e.target.value) setCheckOut(addDays(e.target.value, 1));
            }}
            className={input}
          />
        </label>
        <label className="block border-b border-line px-6 py-4 sm:border-b-0 sm:border-r">
          <span className={label}>check out</span>
          <input type="date" required min={checkIn ? addDays(checkIn, 1) : today} value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className={input} />
        </label>
        <label className="block border-b border-line px-6 py-4 sm:border-b-0 sm:border-r">
          <span className={label}>guests</span>
          <select value={guests} onChange={(e) => setGuests(Number(e.target.value))} className={input}>
            {[1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>
                {n}명
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className="bg-accent px-10 py-5 font-serif text-2xl text-white transition-opacity hover:opacity-90">
          check availability
        </button>
      </form>
      {result && (
        <p role="status" className="mt-4 text-center text-sm text-ink">
          {result}
        </p>
      )}
    </div>
  );
}
