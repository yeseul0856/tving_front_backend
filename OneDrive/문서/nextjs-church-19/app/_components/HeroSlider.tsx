"use client";

import { useEffect, useState } from "react";
import Icon from "./Icon";
import { sermons } from "./data";

const backgrounds = [
  "from-[#0f1f3d] via-[#1d3a6b] to-[#3b5f9a]",
  "from-[#2b1d3d] via-[#4a2f6b] to-[#8a5a9a]",
  "from-[#1d3d34] via-[#2f6b5a] to-[#5a9a84]",
  "from-[#3d2a1d] via-[#6b4a2f] to-[#b08350]",
];

export default function HeroSlider() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = sermons.length;

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % n), 6000);
    return () => clearInterval(t);
  }, [paused, n]);

  const s = sermons[idx];

  return (
    <section
      className={`relative overflow-hidden bg-gradient-to-br ${backgrounds[idx]} text-white`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="최근 설교"
    >
      <div className="pointer-events-none absolute -right-32 -top-32 h-[520px] w-[520px] rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 lg:grid-cols-[1.1fr_1fr] lg:px-6 lg:py-24">
        <div key={idx} className="animate-fade-up">
          <span className="inline-block rounded-full border border-gold/60 px-3 py-1 text-xs font-medium tracking-wider text-gold">
            {s.tag} · 설교
          </span>
          <h1 className="mt-5 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">{s.title}</h1>
          <p className="mt-4 text-white/75">
            {s.passage} <span className="mx-2 text-white/30">|</span> {s.preacher} <span className="mx-2 text-white/30">|</span> {s.date}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#" className="flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-navy hover:bg-gold-light">
              <Icon name="play" className="h-4 w-4" /> 설교 영상 보기
            </a>
            <a href="#" className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold hover:bg-white/10">
              MP3 다운로드
            </a>
          </div>
        </div>

        <a href="#" className="group relative block aspect-video overflow-hidden rounded-2xl bg-black/30 ring-1 ring-white/20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_60%)]" />
          <div className="absolute inset-0 grid place-items-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-white/90 text-navy shadow-xl transition-transform group-hover:scale-110">
              <Icon name="play" className="ml-1 h-7 w-7" />
            </span>
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5">
            <p className="text-xs text-gold">church19 TV</p>
            <p className="mt-1 font-semibold">{s.title}</p>
          </div>
        </a>
      </div>

      <div className="relative mx-auto flex max-w-7xl items-center gap-4 px-4 pb-8 lg:px-6">
        <button onClick={() => setIdx((idx - 1 + n) % n)} className="grid h-9 w-9 place-items-center rounded-full border border-white/30 hover:bg-white/10" aria-label="이전 설교">
          <Icon name="chevL" className="h-4 w-4" />
        </button>
        <div className="flex gap-2">
          {sermons.map((x, i) => (
            <button key={x.title} onClick={() => setIdx(i)} aria-label={`${i + 1}번째 설교`} className={`h-1.5 rounded-full transition-all ${i === idx ? "w-8 bg-gold" : "w-4 bg-white/40"}`} />
          ))}
        </div>
        <button onClick={() => setIdx((idx + 1) % n)} className="grid h-9 w-9 place-items-center rounded-full border border-white/30 hover:bg-white/10" aria-label="다음 설교">
          <Icon name="chevR" className="h-4 w-4" />
        </button>
        <span className="ml-auto text-sm tabular-nums text-white/60">
          <b className="text-white">{String(idx + 1).padStart(2, "0")}</b> / {String(n).padStart(2, "0")}
        </span>
      </div>
    </section>
  );
}
