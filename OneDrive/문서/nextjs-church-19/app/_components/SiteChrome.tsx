"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/useAuth";
import Badge from "./Badge";
import { BRAND, business } from "./data";

const nav = [
  { label: "home", href: "/#top" },
  { label: "rooms", href: "/#rooms" },
  { label: "facilities", href: "/#facilities" },
  { label: "notice", href: "/notices" },
  { label: "faq", href: "/faq" },
  { label: "location", href: "/#location" },
];

export default function SiteChrome() {
  const router = useRouter();
  const { supabase, user, name, avatar, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);
  const signOut = async () => {
    await supabase?.auth.signOut();
    close();
    router.refresh();
  };

  return (
    <>
      {/* rotating badge (home) */}
      <Link href="/#top" aria-label={`${BRAND} 홈`} className="fixed bottom-5 right-5 z-40 h-20 w-20 text-[13px] lg:bottom-8 lg:right-8 lg:h-32 lg:w-32 lg:text-[20px]">
        <Badge />
      </Link>

      {/* menu button */}
      <button
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="site-menu"
        className="fixed bottom-5 left-1/2 z-40 grid h-16 w-16 -translate-x-1/2 place-items-center rounded-full bg-accent pb-1 font-serif text-xl text-white shadow-lg shadow-black/20 ring-2 ring-white/80 transition-transform hover:scale-105 lg:bottom-8 lg:h-20 lg:w-20 lg:text-2xl"
      >
        menu
      </button>

      {/* full-screen menu */}
      <div
        id="site-menu"
        role="dialog"
        aria-modal="true"
        aria-label="전체 메뉴"
        aria-hidden={!open}
        inert={!open}
        className="fixed inset-0 z-50 overflow-y-auto bg-accent text-white"
        style={{
          clipPath: open ? "circle(150% at 50% 100%)" : "circle(0% at 50% 100%)",
          transition: "clip-path 0.9s cubic-bezier(0.7, 0, 0.2, 1)",
        }}
      >
        <div className="flex min-h-full flex-col px-6 py-6 lg:px-10 lg:py-8">
          {/* top: auth */}
          <div className="flex items-center justify-between text-sm">
            <span className="font-serif text-2xl">{BRAND}</span>
            <div className="flex items-center gap-5">
              {user ? (
                <>
                  <Link href="/profile" onClick={close} className="flex items-center gap-2.5 hover:underline underline-offset-4" aria-label="내 프로필">
                    <span className="grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-white/20 font-serif text-lg">
                      {avatar ? (
                        // eslint-disable-next-line @next/next/no-img-element -- avatar hosts vary (Supabase, Google, Kakao)
                        <img src={avatar} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        name.charAt(0).toUpperCase()
                      )}
                    </span>
                    <span>
                      <b className="font-semibold">{name}</b>님 · 내 프로필
                    </span>
                  </Link>
                  {isAdmin && (
                    <Link href="/admin" onClick={close} className="bg-ink px-3 py-1.5 font-semibold text-white hover:bg-white hover:text-accent">
                      관리자
                    </Link>
                  )}
                  <button onClick={signOut} className="underline-offset-4 hover:underline">
                    로그아웃
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={close} className="underline-offset-4 hover:underline">
                    로그인
                  </Link>
                  <Link href="/signup" onClick={close} className="underline-offset-4 hover:underline">
                    회원가입
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* nav */}
          <nav className="flex flex-1 items-center justify-center py-6" aria-label="주 메뉴">
            <ul className="text-center font-serif leading-none">
              {nav.map((n, i) => (
                <li
                  key={n.label}
                  className="py-[0.6vh] transition-all duration-700"
                  style={{ transitionDelay: open ? `${300 + i * 70}ms` : "0ms", opacity: open ? 1 : 0, transform: open ? "none" : "translateY(30px)" }}
                >
                  <Link href={n.href} onClick={close} className="text-[clamp(2.75rem,8vh,6.5rem)] transition-colors hover:text-ink">
                    {n.label}
                  </Link>
                </li>
              ))}
              <li className="text-[clamp(2rem,5vh,4rem)] text-ink" aria-hidden="true">
                /
              </li>
              <li style={{ transitionDelay: open ? "700ms" : "0ms", opacity: open ? 1 : 0 }} className="transition-opacity duration-700">
                <Link href="/#reservation" onClick={close} className="text-[clamp(2.75rem,8vh,6.5rem)] text-ink transition-colors hover:text-white">
                  reservation
                </Link>
              </li>
            </ul>
          </nav>

          {/* bottom: business info + close */}
          <div className="flex items-end justify-between gap-6">
            <div className="max-w-xl text-xs leading-relaxed text-white/85 lg:text-sm">
              <div className="mb-3 flex gap-6 text-ink">
                <Link href="/terms" onClick={close}>이용약관</Link>
                <Link href="/privacy" onClick={close} className="font-semibold">개인정보처리방침</Link>
              </div>
              <p className="flex flex-wrap gap-x-4">
                {business.map((b) => (
                  <span key={b}>{b}</span>
                ))}
              </p>
              <p className="mt-3 font-serif text-base text-ink">© {BRAND} all rights reserved.</p>
            </div>
            <button onClick={close} aria-label="메뉴 닫기" className="relative h-16 w-16 shrink-0 rounded-full bg-white text-accent lg:h-20 lg:w-20">
              <span className="absolute left-1/2 top-1/2 h-0.5 w-7 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-current" />
              <span className="absolute left-1/2 top-1/2 h-0.5 w-7 -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-current" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
