const paths: Record<string, React.ReactNode> = {
  play: <path d="M8 5v14l11-7z" />,
  heart: <path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z" />,
  book: <><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" /><path d="M4 21V5" /></>,
  edit: <><path d="M4 20h4L19 9l-4-4L4 16z" /><path d="M13.5 6.5l4 4" /></>,
  file: <><path d="M14 3H6v18h12V7z" /><path d="M14 3v4h4M9 12h6M9 16h6" /></>,
  bell: <><path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z" /><path d="M10 20a2 2 0 0 0 4 0" /></>,
  church: <><path d="M12 2v4M10 4h4M5 21V11l7-5 7 5v10z" /><path d="M10 21v-5h4v5" /></>,
  users: <><circle cx="9" cy="8" r="3.5" /><path d="M2 20c0-4 3-6 7-6s7 2 7 6" /><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14c2.5.5 4 2.5 4 6" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  seed: <><path d="M12 21V11" /><path d="M12 11C12 6 8 4 4 4c0 5 3 7 8 7zM12 13c0-4 3-6 8-6 0 4-3 6-8 6z" /></>,
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  plus: <path d="M12 5v14M5 12h14" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  chevL: <path d="M15 6l-6 6 6 6" />,
  chevR: <path d="M9 6l6 6-6 6" />,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" /></>,
  bed: <><path d="M3 18V7M21 18v-5a3 3 0 0 0-3-3h-8v6M3 14h18M3 18h18" /><circle cx="6.5" cy="11" r="1.5" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="1" /><path d="M3 10h18M8 3v4M16 3v4" /></>,
  pin: <><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></>,
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />,
  area: <><path d="M4 4h16v16H4z" /><path d="M4 9h5V4M15 20v-5h5" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></>,
};

export default function Icon({ name, className = "h-6 w-6" }: { name: string; className?: string }) {
  const filled = name === "play";
  return (
    <svg viewBox="0 0 24 24" className={className} fill={filled ? "currentColor" : "none"} stroke={filled ? "none" : "currentColor"} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}
