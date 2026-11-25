import Icon from "./Icon";

const footerLinks = ["교회소개", "오시는 길", "개인정보처리방침", "이메일무단수집거부", "온라인헌금"];
const socials = [
  { n: "play", l: "YouTube" },
  { n: "globe", l: "Website" },
  { n: "bell", l: "News" },
];

export default function Footer() {
  return (
    <footer className="bg-navy-deep text-white/60">
      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl flex-wrap gap-x-6 gap-y-2 px-4 py-4 text-sm lg:px-6">
          {footerLinks.map((l, i) => (
            <a key={l} href="#" className={`hover:text-white ${i === 2 ? "font-semibold text-white/90" : ""}`}>
              {l}
            </a>
          ))}
        </div>
      </div>
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 text-sm lg:grid-cols-[1fr_auto] lg:px-6">
        <div>
          <p className="text-2xl font-extrabold text-white">
            church<span className="text-gold">19</span>
          </p>
          <address className="mt-4 space-y-1 not-italic leading-relaxed">
            <p>(우) 00000 ○○광역시 ○○구 ○○로 19</p>
            <p>
              TEL 000-000-0000 <span className="mx-2 text-white/20">|</span> FAX 000-000-0000{" "}
              <span className="mx-2 text-white/20">|</span> E-mail info@church19.org
            </p>
          </address>
          <p className="mt-5 text-xs text-white/40">Copyright © 2026 church19. All rights reserved.</p>
        </div>
        <div className="flex items-start gap-3">
          {socials.map((s) => (
            <a key={s.l} href="#" aria-label={s.l} className="grid h-10 w-10 place-items-center rounded-full border border-white/15 hover:border-gold hover:text-gold">
              <Icon name={s.n} className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
