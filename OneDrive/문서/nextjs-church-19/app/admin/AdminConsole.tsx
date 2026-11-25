"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/useAuth";
import ReservationsAdmin from "./_components/ReservationsAdmin";
import NoticesAdmin from "./_components/NoticesAdmin";
import FaqsAdmin from "./_components/FaqsAdmin";

const TABS = [
  { key: "reservations", en: "reservation", ko: "예약" },
  { key: "notices", en: "notice", ko: "공지사항" },
  { key: "faqs", en: "faq", ko: "FAQ" },
] as const;
type TabKey = (typeof TABS)[number]["key"];

export default function AdminConsole() {
  const { supabase, user, isAdmin, loading, name } = useAuth();
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const tab: TabKey = (TABS.find((t) => t.key === params.get("tab"))?.key ?? "reservations") as TabKey;

  if (loading) return <p className="py-16 text-center text-muted">권한을 확인하는 중…</p>;

  if (!user || !supabase)
    return (
      <div className="border-t border-ink py-16 text-center">
        <p className="text-muted">관리자 로그인이 필요합니다.</p>
        <Link href="/login?next=/admin" className="mt-6 inline-block bg-accent px-6 py-3 text-sm font-semibold text-white">
          로그인
        </Link>
      </div>
    );

  if (!isAdmin)
    return (
      <div className="border-t border-ink py-16 text-center">
        <p className="font-serif text-4xl text-accent">403</p>
        <p className="mt-3 text-muted">관리자만 접근할 수 있는 페이지입니다.</p>
        <Link href="/" className="mt-6 inline-block font-serif text-xl text-accent underline underline-offset-4">
          back to home
        </Link>
      </div>
    );

  return (
    <div>
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-line">
        <nav className="flex gap-1" aria-label="관리 메뉴">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => router.replace(`${pathname}?tab=${t.key}`, { scroll: false })}
              aria-current={tab === t.key ? "page" : undefined}
              className={`-mb-px border-b-2 px-4 pb-3 pt-2 transition-colors ${tab === t.key ? "border-accent text-accent" : "border-transparent text-muted hover:text-ink"}`}
            >
              <span className="font-serif text-2xl">{t.en}</span>
              <span className="ml-2 text-xs">{t.ko}</span>
            </button>
          ))}
        </nav>
        <p className="pb-3 text-xs text-muted">
          <b className="text-ink">{name}</b> · 관리자
        </p>
      </div>

      {tab === "reservations" && <ReservationsAdmin supabase={supabase} />}
      {tab === "notices" && <NoticesAdmin supabase={supabase} />}
      {tab === "faqs" && <FaqsAdmin supabase={supabase} />}
    </div>
  );
}
