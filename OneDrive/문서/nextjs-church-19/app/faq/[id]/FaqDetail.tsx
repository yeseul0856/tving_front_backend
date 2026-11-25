"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Faq } from "@/lib/boards";
import Comments from "../../_components/Comments";

export default function FaqDetail() {
  const { id } = useParams<{ id: string }>();
  const faqId = Number(id);
  const supabase = useMemo(() => createClient(), []);
  const [faq, setFaq] = useState<Faq | null | undefined>(undefined);

  useEffect(() => {
    if (!supabase || !Number.isInteger(faqId)) return;
    supabase
      .from("faqs")
      .select("*")
      .eq("id", faqId)
      .maybeSingle<Faq>()
      .then(({ data }) => setFaq(data));
  }, [supabase, faqId]);

  if (!Number.isInteger(faqId) || faq === null)
    return (
      <div className="border-t border-ink py-16 text-center">
        <p className="text-muted">존재하지 않거나 삭제된 질문입니다.</p>
        <Link href="/faq" className="mt-6 inline-block font-serif text-xl text-accent underline underline-offset-4">
          back to list
        </Link>
      </div>
    );
  if (faq === undefined) return <p className="py-16 text-center text-muted">불러오는 중…</p>;

  return (
    <article>
      <header className="border-y border-ink py-6">
        <h2 className="text-2xl font-semibold leading-snug">
          <span className="mr-2 font-serif text-3xl text-accent">Q.</span>
          {faq.question}
        </h2>
      </header>
      <div className="flex gap-3 py-10 leading-loose">
        <span className="font-serif text-3xl leading-none text-accent">A.</span>
        <p className="whitespace-pre-wrap break-words">{faq.answer}</p>
      </div>
      <Link href="/faq" className="font-serif text-xl text-accent underline underline-offset-4">
        ← back to list
      </Link>
      <Comments target={{ faq_id: faq.id }} />
    </article>
  );
}
