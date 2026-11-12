# TVING 스타일 영화/시리즈 앱 (React + FastAPI + TMDB)

```
backend/   FastAPI - TMDB API 프록시 (키는 서버의 .env 에만 보관)
frontend/  React (Vite) - UI
```

## 1. TMDB 키 설정
`backend/.env` 를 열어 값을 채웁니다. (둘 중 하나만 있어도 동작, 토큰이 우선)

```
TMDB_API_KEY=발급받은_API_Key
TMDB_ACCESS_TOKEN=발급받은_API_Read_Access_Token
```

## 2. 실행 (프로젝트 루트에서)
```powershell
npm install      # 최초 1회 (루트 도구 설치)
npm run setup    # 최초 1회 (백엔드 venv + 패키지, 프론트 패키지 설치)
npm run dev      # 백엔드(8000) + 프론트(5173) 동시 실행, Ctrl+C 로 둘 다 종료
```
- 앱: http://localhost:5173 (`/api` 요청은 Vite 프록시로 8000 포트에 전달)
- API 문서: http://localhost:8000/docs
- 하나만 실행: `npm run dev:back` / `npm run dev:front`

## Docker 실행 (배포용)
```bash
docker compose up -d --build   # http://<서버IP> (80 포트)
docker compose logs -f         # 로그
docker compose down            # 중지
```
- `frontend` 컨테이너: nginx 가 React 빌드 서빙 + `/api` 를 `backend` 로 프록시 ([frontend/nginx.conf](frontend/nginx.conf))
- `backend` 컨테이너: uvicorn (외부 포트 미공개), TMDB 키는 `backend/.env` 를 `env_file` 로 주입 (이미지에 포함 X)

## API
| 경로 | 설명 |
|---|---|
| `GET /api/home` | 메인 배너 + 섹션 목록 |
| `GET /api/category/{tv\|movie}` | 시리즈/영화 탭 |
| `GET /api/{tv\|movie}/{id}` | 상세 (예고편, 출연진, 비슷한 콘텐츠) |
| `GET /api/search?q=` | 통합 검색 |
