import type { Metadata } from "next";
import PageShell from "../_components/PageShell";
import FaqList from "./FaqList";

export const metadata: Metadata = { title: "자주 묻는 질문 | rental house" };

export default function FaqPage() {
  return (
    <PageShell en="faq" ko="자주 묻는 질문">
      <FaqList />
    </PageShell>
  );
}
