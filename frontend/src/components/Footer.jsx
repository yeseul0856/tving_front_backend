export default function Footer() {
  return (
    <footer className="footer">
      <ul className="footer__links">
        <li>고객센터</li>
        <li>이용약관</li>
        <li>
          <b>개인정보처리방침</b>
        </li>
        <li>청소년보호정책</li>
        <li>법적고지</li>
        <li>이벤트</li>
        <li>인재채용</li>
      </ul>
      <p className="footer__info">
        본 사이트는 학습용 클론 프로젝트이며, 영화·시리즈 정보와 이미지는 TMDB
        API에서 제공받습니다.
      </p>
      <p className="footer__info">
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </p>
      <p className="footer__copy">
        Copyright © 2026 TVING Clone Project. All rights reserved.
      </p>
    </footer>
  );
}
