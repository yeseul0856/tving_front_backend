import Link from "next/link";
import { Suspense } from "react";
import SiteChrome from "./SiteChrome";
import Footer from "./Footer";

/** Layout for sub pages (notice, faq, admin...): wordmark header, big serif title, content, footer. */
export default function PageShell({ en, ko, children, wide = false }: { en: string; ko: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <>
      <SiteChrome />
      <header className="px-6 pt-8 lg:px-10">
        <Link href="/" className="font-serif text-3xl text-accent">
          rental house
        </Link>
      </header>
      <main className="flex-1 px-6 pb-32 pt-12 lg:px-10 lg:pt-20">
        <div className={`mx-auto ${wide ? "max-w-6xl" : "max-w-3xl"}`}>
          <h1 className="font-serif text-6xl leading-[0.85] text-accent sm:text-8xl">{en}</h1>
          <p className="mt-4 pl-1 text-sm text-muted">{ko}</p>
          <div className="mt-12">
            <Suspense fallback={<p className="py-16 text-center text-muted">불러오는 중…</p>}>{children}</Suspense>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
