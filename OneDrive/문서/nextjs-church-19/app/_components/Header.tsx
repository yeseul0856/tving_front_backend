"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Icon from "./Icon";
import { menu, quickLinks } from "./data";

export default function Header() {
  const [open, setOpen] = useState<number | null>(null);
  const [mobile, setMobile] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobile ? "hidden" : "";
  }, [mobile]);

  return (
    <header className={`sticky top-0 z-50 bg-white transition-shadow ${scrolled ? "shadow-md" : ""}`}>
      {/* utility bar */}
      <div className="hidden bg-navy text-white/80 lg:block">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-end gap-5 px-6 text-xs">
          {quickLinks.map((q) => (
            <a key={q.label} href="#" className="flex items-center gap-1.5 hover:text-gold">
              <Icon name={q.icon} className="h-3.5 w-3.5" />
              {q.label}
            </a>
          ))}
          <span className="h-3 w-px bg-white/30" />
          <a href="#" className="flex items-center gap-1.5 hover:text-gold">
            <Icon name="user" className="h-3.5 w-3.5" />
            로그인
          </a>
        </div>
      </div>

      {/* main nav */}
      <div className="relative border-b border-line" onMouseLeave={() => setOpen(null)}>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:h-20 lg:px-6">
          <Link href="/" className="flex items-center gap-2.5" aria-label="church19 홈">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-navy text-gold lg:h-10 lg:w-10">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round">
                <path d="M12 3v18M6 9h12" />
              </svg>
            </span>
            <span className="text-xl font-extrabold tracking-tight text-navy lg:text-2xl">
              church<span className="text-gold">19</span>
            </span>
          </Link>

          <nav className="hidden h-full lg:block" aria-label="주 메뉴">
            <ul className="flex h-full items-center">
              {menu.map((m, i) => (
                <li key={m.label} className="h-full" onMouseEnter={() => setOpen(i)}>
                  <button
                    className={`relative flex h-full items-center px-3 text-[15px] font-semibold transition-colors xl:px-5 ${open === i ? "text-gold-dark" : "text-ink"}`}
                    onFocus={() => setOpen(i)}
                    onClick={() => setOpen(open === i ? null : i)}
                    aria-expanded={open === i}
                  >
                    {m.label}
                    <span className={`absolute inset-x-3 bottom-0 h-0.5 bg-gold transition-transform xl:inset-x-5 ${open === i ? "scale-x-100" : "scale-x-0"}`} />
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <button className="rounded-md p-2 text-navy lg:hidden" onClick={() => setMobile(true)} aria-label="전체메뉴 열기">
            <Icon name="menu" />
          </button>
          <a href="#" className="hidden items-center gap-1.5 rounded-full border border-navy/20 px-4 py-2 text-sm font-medium text-navy hover:bg-navy hover:text-white lg:flex">
            <Icon name="menu" className="h-4 w-4" /> 상세메뉴
          </a>
        </div>

        {/* mega dropdown */}
        {open !== null && (
          <div className="absolute inset-x-0 top-full hidden border-b border-line bg-white shadow-lg lg:block">
            <div className="mx-auto flex max-w-7xl gap-8 px-6 py-8">
              <div className="w-56 shrink-0 rounded-xl bg-navy p-6 text-white">
                <p className="text-xs tracking-widest text-gold">CHURCH19</p>
                <p className="mt-2 text-2xl font-bold">{menu[open].label}</p>
                <p className="mt-3 text-sm leading-relaxed text-white/70">사람을 살리고, 키우고, 고치는 생명사역 공동체</p>
              </div>
              <div className="grid flex-1 grid-cols-4 gap-6">
                {menu[open].groups.map((g) => (
                  <div key={g.title}>
                    <p className="mb-3 border-b border-line pb-2 text-sm font-bold text-navy">{g.title}</p>
                    <ul className="space-y-2">
                      {g.items.map((it) => (
                        <li key={it}>
                          <a href="#" className="text-sm text-muted hover:text-gold-dark">{it}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* mobile overlay */}
      {mobile && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white lg:hidden">
          <div className="flex h-16 items-center justify-between border-b border-line px-4">
            <span className="text-xl font-extrabold text-navy">church<span className="text-gold">19</span></span>
            <button className="p-2 text-navy" onClick={() => setMobile(false)} aria-label="메뉴 닫기">
              <Icon name="close" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-px border-b border-line bg-line">
            {quickLinks.map((q) => (
              <a key={q.label} href="#" className="flex flex-col items-center gap-1 bg-cream py-3 text-xs text-navy">
                <Icon name={q.icon} className="h-5 w-5" />
                {q.label}
              </a>
            ))}
          </div>
          <ul className="flex-1 overflow-y-auto">
            {menu.map((m, i) => (
              <li key={m.label} className="border-b border-line">
                <button className="flex w-full items-center justify-between px-5 py-4 text-left font-semibold text-ink" onClick={() => setExpanded(expanded === i ? null : i)} aria-expanded={expanded === i}>
                  {m.label}
                  <Icon name={expanded === i ? "close" : "plus"} className="h-4 w-4 text-muted" />
                </button>
                {expanded === i && (
                  <div className="space-y-4 bg-cream px-5 py-4">
                    {m.groups.map((g) => (
                      <div key={g.title}>
                        <p className="mb-2 text-sm font-bold text-navy">{g.title}</p>
                        <div className="flex flex-wrap gap-x-4 gap-y-2">
                          {g.items.map((it) => (
                            <a key={it} href="#" className="text-sm text-muted">{it}</a>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
