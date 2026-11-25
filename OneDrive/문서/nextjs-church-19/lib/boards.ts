export type Notice = {
  id: number;
  title: string;
  content: string;
  pinned: boolean;
  created_at: string;
  updated_at: string;
};

export type Faq = {
  id: number;
  question: string;
  answer: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type RoomKey = "forest" | "light" | "rest";
export type ReservationStatus = "pending" | "confirmed" | "cancelled";

export type Reservation = {
  id: number;
  room: RoomKey;
  check_in: string;
  check_out: string;
  guests: number;
  guest_name: string;
  phone: string | null;
  email: string | null;
  user_id: string | null;
  status: ReservationStatus;
  memo: string | null;
  created_at: string;
};

export type Comment = {
  id: number;
  notice_id: number | null;
  faq_id: number | null;
  user_id: string;
  author_name: string | null;
  author_avatar: string | null;
  body: string;
  created_at: string;
  updated_at: string;
};

export const ROOM_LABEL: Record<RoomKey, string> = { forest: "숲 FOREST", light: "빛 LIGHT", rest: "쉼 REST" };
export const STATUS_LABEL: Record<ReservationStatus, string> = { pending: "대기", confirmed: "확정", cancelled: "취소" };

export const fmtDate = (s: string) => s.slice(0, 10).replaceAll("-", ".");
export const fmtDateTime = (s: string) =>
  new Date(s).toLocaleString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
export const nights = (a: string, b: string) => Math.round((+new Date(b) - +new Date(a)) / 86400000);

/** Friendly Korean messages for common Postgres / PostgREST errors. */
export function dbError(e: { code?: string; message: string }) {
  if (e.code === "23P01") return "해당 객실은 그 날짜에 이미 예약이 있습니다.";
  if (e.code === "42501") return "권한이 없습니다.";
  if (e.code === "23514") return "입력값을 확인해 주세요.";
  return e.message;
}
