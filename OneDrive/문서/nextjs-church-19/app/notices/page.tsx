import type { Metadata } from "next";
import PageShell from "../_components/PageShell";
import NoticeList from "./NoticeList";

export const metadata: Metadata = { title: "공지사항 | rental house" };

export default function NoticesPage() {
  return (
    <PageShell en="notice" ko="공지사항">
      <NoticeList />
    </PageShell>
  );
}
