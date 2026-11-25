import type { Metadata } from "next";
import PageShell from "../_components/PageShell";
import AdminConsole from "./AdminConsole";

export const metadata: Metadata = { title: "관리자 | rental house", robots: { index: false } };

export default function AdminPage() {
  return (
    <PageShell en="admin" ko="관리자 페이지 — 예약 · 공지사항 · FAQ 관리" wide>
      <AdminConsole />
    </PageShell>
  );
}
