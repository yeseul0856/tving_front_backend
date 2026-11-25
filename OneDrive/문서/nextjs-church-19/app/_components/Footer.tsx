import Link from "next/link";
import { BRAND, business } from "./data";

export default function Footer() {
  return (
    <footer className="bg-background px-6 pb-32 pt-20 text-sm text-muted lg:px-10 lg:pb-12">
      <div className="mx-auto max-w-7xl">
        <p className="font-serif text-5xl leading-none text-accent sm:text-7xl">{BRAND}</p>
        <div className="mt-12 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl leading-relaxed">
            <div className="mb-4 flex gap-8 text-ink">
              <Link href="/terms" className="hover:text-accent">이용약관</Link>
              <Link href="/privacy" className="font-semibold hover:text-accent">개인정보처리방침</Link>
              <Link href="/terms#refund" className="hover:text-accent">환불 규정</Link>
            </div>
            <p className="flex flex-wrap gap-x-5 gap-y-1">
              {business.map((b) => (
                <span key={b}>{b}</span>
              ))}
            </p>
          </div>
          <div className="lg:pr-40 lg:text-right">
            <p className="font-serif text-xl text-accent">© {BRAND} all rights reserved.</p>
            <p className="mt-1 text-xs">Photos via Unsplash</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
