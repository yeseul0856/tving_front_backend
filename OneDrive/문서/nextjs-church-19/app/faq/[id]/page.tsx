import type { Metadata } from "next";
import PageShell from "../../_components/PageShell";
import FaqDetail from "./FaqDetail";

export const metadata: Metadata = { title: "자주 묻는 질문 | rental house" };

export default function FaqDetailPage() {
  return (
    <PageShell en="faq" ko="자주 묻는 질문">
      <FaqDetail />
    </PageShell>
  );
}
