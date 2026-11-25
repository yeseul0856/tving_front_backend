import type { Metadata } from "next";
import PageShell from "../../_components/PageShell";
import NoticeDetail from "./NoticeDetail";

export const metadata: Metadata = { title: "공지사항 | rental house" };

export default function NoticeDetailPage() {
  return (
    <PageShell en="notice" ko="공지사항">
      <NoticeDetail />
    </PageShell>
  );
}
