import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="header__left">
        <Link to="/" className="logo" aria-label="홈">
          Movie
        </Link>
        <nav className="gnb">
          <NavLink to="/" end>
            홈
          </NavLink>
          <NavLink to="/series">시리즈</NavLink>
          <NavLink to="/movie">영화</NavLink>
        </nav>
      </div>
      <div className="header__right">
        <button
          className="icon-btn"
          aria-label="검색"
          onClick={() => navigate("/search")}
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
          </svg>
        </button>
        <div className="profile" aria-label="프로필">
          <span />
        </div>
      </div>
    </header>
  );
}
