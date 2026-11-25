import Header from "./_components/Header";
import HeroSlider from "./_components/HeroSlider";
import Footer from "./_components/Footer";
import Icon from "./_components/Icon";
import {
  education,
  intro,
  languages,
  notices,
  press,
  quickLinks,
  stories,
  subLinks,
  videoNews,
  worshipTimes,
} from "./_components/data";

function SectionTitle({ title, href = "#", light = false }: { title: string; href?: string; light?: boolean }) {
  return (
    <div className="mb-6 flex items-end justify-between">
      <h2 className={`text-xl font-bold lg:text-2xl ${light ? "text-white" : "text-navy"}`}>{title}</h2>
      <a href={href} aria-label={`${title} 더보기`} className={`grid h-8 w-8 place-items-center rounded-full border transition-colors ${light ? "border-white/30 text-white hover:bg-white/10" : "border-line text-muted hover:border-gold hover:text-gold-dark"}`}>
        <Icon name="plus" className="h-4 w-4" />
      </a>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <HeroSlider />

        {/* Quick icon tiles */}
        <section className="relative z-10 mx-auto -mt-6 max-w-7xl px-4 lg:px-6">
          <div className="grid grid-cols-3 overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-line sm:grid-cols-6">
            {quickLinks.map((q) => (
              <a key={q.label} href="#" className="group flex flex-col items-center gap-2 border-line py-5 text-sm font-medium text-ink transition-colors hover:bg-cream [&:not(:last-child)]:border-r">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-cream text-navy transition-colors group-hover:bg-navy group-hover:text-gold">
                  <Icon name={q.icon} className="h-5 w-5" />
                </span>
                {q.label}
              </a>
            ))}
          </div>
        </section>

        {/* Worship times + feature tiles */}
        <section className="mx-auto grid max-w-7xl gap-6 px-4 py-16 lg:grid-cols-[1fr_2fr] lg:px-6">
          <div className="rounded-2xl bg-navy p-7 text-white">
            <p className="text-xs tracking-[0.3em] text-gold">WORSHIP</p>
            <h2 className="mt-2 text-2xl font-bold">예배안내</h2>
            <ul className="mt-6 divide-y divide-white/10">
              {worshipTimes.map((w) => (
                <li key={w.name} className="flex justify-between py-2.5 text-sm">
                  <span className="text-white/70">{w.name}</span>
                  <span className="font-semibold">{w.time}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { t: "church19 TV", e: "Church19 TV", c: "from-[#1d3a6b] to-[#0f1f3d]" },
              { t: "생명사역 스토리", e: "Life-Giving Ministry", c: "from-[#b08350] to-[#6b4a2f]" },
              { t: "성경", e: "Bible", c: "from-[#2f6b5a] to-[#1d3d34]" },
              { t: "경배와 찬양", e: "Praise Worship", c: "from-[#8a5a9a] to-[#4a2f6b]" },
            ].map((f) => (
              <a key={f.t} href="#" className={`group relative flex min-h-36 flex-col justify-end overflow-hidden rounded-2xl bg-gradient-to-br ${f.c} p-6 text-white`}>
                <span className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full bg-white/15 transition-transform group-hover:translate-x-1">
                  <Icon name="arrow" className="h-4 w-4" />
                </span>
                <p className="text-xs uppercase tracking-widest text-white/60">{f.e}</p>
                <p className="mt-1 text-lg font-bold lg:text-xl">{f.t}</p>
              </a>
            ))}
          </div>
        </section>

        {/* Stories + Notices */}
        <section className="bg-cream py-16">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 lg:grid-cols-[2fr_1fr] lg:px-6">
            <div>
              <SectionTitle title="생명사역 스토리" />
              <div className="grid gap-5 sm:grid-cols-3">
                {stories.map((s) => (
                  <a key={s.title} href="#" className="group overflow-hidden rounded-2xl bg-white ring-1 ring-line transition-shadow hover:shadow-lg">
                    <div className={`aspect-[4/3] bg-gradient-to-br ${s.hue} transition-transform duration-500 group-hover:scale-105`} />
                    <div className="p-5">
                      <p className="text-xs font-semibold text-gold-dark">{s.sub}</p>
                      <p className="mt-1 font-bold text-ink">{s.title}</p>
                      <p className="mt-2 line-clamp-2 text-sm text-muted">{s.excerpt}</p>
                      <p className="mt-3 text-xs text-muted">{s.date}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
            <div>
              <SectionTitle title="공지사항" />
              <ul className="divide-y divide-line rounded-2xl bg-white px-5 ring-1 ring-line">
                {notices.map((n) => (
                  <li key={n.title}>
                    <a href="#" className="flex items-center justify-between gap-4 py-4 text-sm hover:text-gold-dark">
                      <span className="truncate">{n.title}</span>
                      <span className="shrink-0 text-xs text-muted">{n.date.slice(5)}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Video news */}
        <section className="mx-auto max-w-7xl px-4 py-16 lg:px-6">
          <SectionTitle title="church19 영상뉴스" />
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {videoNews.map((d) => {
              const [y, m, day] = d.split("-").map(Number);
              return (
                <a key={d} href="#" className="group">
                  <div className="relative aspect-video overflow-hidden rounded-xl bg-gradient-to-br from-navy to-[#3b5f9a]">
                    <span className="absolute left-3 top-3 rounded bg-gold px-2 py-0.5 text-[10px] font-bold text-navy">NEWS</span>
                    <span className="absolute inset-0 grid place-items-center">
                      <span className="grid h-11 w-11 place-items-center rounded-full bg-white/90 text-navy transition-transform group-hover:scale-110">
                        <Icon name="play" className="ml-0.5 h-5 w-5" />
                      </span>
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-ink group-hover:text-gold-dark">
                    church19 뉴스 {y}년 {m}월 {day}일
                  </p>
                </a>
              );
            })}
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {subLinks.map((l) => (
              <a key={l} href="#" className="rounded-full border border-line px-5 py-2.5 text-sm font-medium text-ink hover:border-navy hover:bg-navy hover:text-white">
                {l}
              </a>
            ))}
          </div>
        </section>

        {/* Press room */}
        <section className="bg-navy py-16 text-white">
          <div className="mx-auto max-w-7xl px-4 lg:px-6">
            <p className="text-xs tracking-[0.3em] text-gold">PRESS ROOM</p>
            <div className="mt-2">
              <SectionTitle title="언론보도" light />
            </div>
            <div className="grid gap-8 lg:grid-cols-2">
              <a href="#" className="group rounded-2xl bg-white/5 p-7 ring-1 ring-white/10 hover:bg-white/10">
                <p className="text-xs text-gold">{press.headline.date}</p>
                <p className="mt-2 text-xl font-bold group-hover:text-gold-light">{press.headline.title}</p>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{press.headline.excerpt}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gold">
                  전체보기 <Icon name="arrow" className="h-4 w-4" />
                </span>
              </a>
              <ul className="divide-y divide-white/10">
                {press.list.map((p) => (
                  <li key={p.title}>
                    <a href="#" className="flex items-center justify-between gap-4 py-5 hover:text-gold-light">
                      <span>{p.title}</span>
                      <span className="shrink-0 text-xs text-white/50">{p.date}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Intro */}
        <section className="mx-auto max-w-7xl px-4 py-20 text-center lg:px-6">
          <h2 className="text-2xl font-bold text-navy lg:text-3xl">church19를 소개합니다.</h2>
          <p className="mt-3 text-muted">생명사역, 교회소개, 섬기는 사람들 등 자세한 안내를 받으실 수 있습니다.</p>
          <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {intro.map((it) => (
              <a key={it.label} href="#" className="group rounded-2xl border border-line p-7 transition-all hover:-translate-y-1 hover:border-gold hover:shadow-lg">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-cream text-navy group-hover:bg-gold group-hover:text-navy">
                  <Icon name={it.icon} className="h-6 w-6" />
                </span>
                <p className="mt-4 font-bold text-ink">{it.label}</p>
                <p className="mt-1 text-sm text-muted">{it.desc}</p>
              </a>
            ))}
          </div>
        </section>

        {/* Education */}
        <section className="bg-cream py-16">
          <div className="mx-auto max-w-7xl px-4 lg:px-6">
            <p className="text-xs tracking-[0.3em] text-gold-dark">EDUCATION</p>
            <h2 className="mt-2 text-2xl font-bold text-navy">교육·훈련</h2>
            <p className="mt-2 text-muted">우리는 신앙교육공동체로서 회심한 그리스도인으로 양육하여 생명사역자가 되도록 합니다.</p>
            <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {education.map((e) => (
                <a key={e.label} href="#" className="group overflow-hidden rounded-2xl bg-white ring-1 ring-line hover:shadow-lg">
                  <div className={`h-28 bg-gradient-to-br ${e.hue}`} />
                  <div className="flex items-center justify-between p-5">
                    <div>
                      <p className="font-bold text-ink">{e.label}</p>
                      <p className="text-xs text-muted">{e.en}</p>
                    </div>
                    <Icon name="arrow" className="h-4 w-4 text-muted transition-transform group-hover:translate-x-1 group-hover:text-gold-dark" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="mx-auto max-w-7xl px-4 py-16 lg:px-6">
          <p className="text-xs tracking-[0.3em] text-gold-dark">MISSION</p>
          <h2 className="mt-2 text-2xl font-bold text-navy">선교</h2>
          <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0f1f3d] to-[#2f6b5a] p-8 text-white lg:p-10">
              <Icon name="globe" className="absolute -bottom-10 -right-10 h-56 w-56 text-white/10" />
              <p className="text-sm text-gold">church19 세계선교회</p>
              <p className="mt-3 text-xl font-bold leading-snug lg:text-2xl">
                “너희는 온 천하에 다니며
                <br />
                만민에게 복음을 전파하라”
              </p>
              <p className="mt-3 text-sm text-white/70">지역 복음화! 한국 복음화! 세계 선교!</p>
              <div className="relative mt-8 flex flex-wrap gap-3">
                <a href="#" className="rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-navy hover:bg-gold-light">바로가기</a>
                <a href="#" className="rounded-full border border-white/40 px-5 py-2.5 text-sm font-semibold hover:bg-white/10">선교영상</a>
              </div>
            </div>
            <div className="grid gap-3">
              {languages.map((l) => (
                <a key={l.label} href="#" className="flex items-center justify-between rounded-2xl border border-line p-5 hover:border-gold">
                  <div>
                    <p className="font-bold text-ink">{l.label}</p>
                    <p className="text-xs text-muted">{l.en} · Part of worship</p>
                  </div>
                  <span className="text-sm font-medium text-navy">{l.time}</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
