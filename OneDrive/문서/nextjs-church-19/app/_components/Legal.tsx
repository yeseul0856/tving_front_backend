/** Building blocks for legal documents (terms, privacy). */

export function LegalDoc({ effective, toc, children }: { effective: string; toc: { id: string; title: string }[]; children: React.ReactNode }) {
  return (
    <div className="text-[15px] leading-[1.9] text-ink/90">
      <p className="border-y border-ink py-4 text-sm text-muted">
        시행일 <b className="font-semibold text-ink">{effective}</b>
      </p>
      <nav aria-label="목차" className="mt-8 bg-cream px-6 py-5 text-sm">
        <p className="mb-2 font-semibold text-ink">목차</p>
        <ol className="grid gap-x-8 gap-y-1 sm:grid-cols-2">
          {toc.map((t) => (
            <li key={t.id}>
              <a href={`#${t.id}`} className="text-muted hover:text-accent">
                {t.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export function Article({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-8 border-b border-line py-10">
      <h2 className="text-lg font-semibold text-ink">{title}</h2>
      <div className="mt-4 space-y-3">{children}</div>
    </section>
  );
}

export function Ol({ children }: { children: React.ReactNode }) {
  return <ol className="list-decimal space-y-2 pl-5 marker:text-muted">{children}</ol>;
}

export function Ul({ children }: { children: React.ReactNode }) {
  return <ul className="list-disc space-y-1.5 pl-5 marker:text-accent">{children}</ul>;
}

export function Table({ head, rows }: { head: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[520px] border-t border-ink text-sm">
        <thead>
          <tr className="border-b border-line bg-cream text-left">
            {head.map((h) => (
              <th key={h} className="px-3 py-2.5 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line align-top">
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (
                <td key={j} className="px-3 py-2.5">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Note({ children }: { children: React.ReactNode }) {
  return <p className="bg-sand/60 px-4 py-3 text-sm">{children}</p>;
}
