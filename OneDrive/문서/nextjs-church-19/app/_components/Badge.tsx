/** Rotating circular-text badge used as the site mark. */
export default function Badge({ tone = "accent", className = "" }: { tone?: "accent" | "white" | "ink"; className?: string }) {
  const color = tone === "white" ? "text-white" : tone === "ink" ? "text-ink" : "text-accent";
  return (
    <span className={`relative block h-full w-full ${color} ${className}`}>
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full animate-spin-slow" aria-hidden="true">
        <defs>
          <path id="badge-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <text className="fill-current font-serif" fontSize="17" letterSpacing="3.2">
          <textPath href="#badge-circle">slow mornings · quiet nights · rental house ·</textPath>
        </text>
      </svg>
      <span className="absolute inset-0 grid place-items-center font-serif text-[2.1em] italic leading-none">rh</span>
    </span>
  );
}
