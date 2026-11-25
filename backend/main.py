"""TMDB 프록시 백엔드 (FastAPI)

프론트엔드는 이 서버의 /api/* 만 호출하고, TMDB 키는 서버(.env)에만 보관합니다.
"""
import asyncio
import os
from contextlib import asynccontextmanager
from pathlib import Path

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

load_dotenv(Path(__file__).parent / ".env")

TMDB_BASE = "https://api.themoviedb.org/3"
API_KEY = os.getenv("TMDB_API_KEY", "").strip()
ACCESS_TOKEN = os.getenv("TMDB_ACCESS_TOKEN", "").strip()
LANGUAGE = os.getenv("TMDB_LANGUAGE", "ko-KR")
REGION = os.getenv("TMDB_REGION", "KR")
FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")


def _is_set(value: str) -> bool:
    return bool(value) and not value.startswith("여기에")


client: httpx.AsyncClient | None = None


@asynccontextmanager
async def lifespan(_: FastAPI):
    global client
    headers = {"accept": "application/json"}
    if _is_set(ACCESS_TOKEN):
        headers["Authorization"] = f"Bearer {ACCESS_TOKEN}"
    client = httpx.AsyncClient(base_url=TMDB_BASE, headers=headers, timeout=10)
    yield
    await client.aclose()


app = FastAPI(title="Movie API (TMDB)", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_ORIGIN, "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


async def tmdb(path: str, **params) -> dict:
    """TMDB GET 요청. Access Token 이 없으면 api_key 쿼리 파라미터로 인증."""
    if not _is_set(ACCESS_TOKEN) and not _is_set(API_KEY):
        raise HTTPException(500, "backend/.env 에 TMDB_API_KEY 또는 TMDB_ACCESS_TOKEN 을 설정하세요.")
    params = {"language": LANGUAGE, **params}
    if not _is_set(ACCESS_TOKEN):
        params["api_key"] = API_KEY
    res = await client.get(path, params=params)
    if res.status_code != 200:
        raise HTTPException(res.status_code, f"TMDB 오류: {res.text[:200]}")
    return res.json()


def _normalize(item: dict, media_type: str | None = None) -> dict:
    """영화/TV 응답 필드를 프론트에서 쓰기 쉬운 형태로 통일."""
    mt = item.get("media_type") or media_type or ("tv" if "first_air_date" in item else "movie")
    return {
        "id": item["id"],
        "media_type": mt,
        "title": item.get("title") or item.get("name") or "",
        "original_title": item.get("original_title") or item.get("original_name") or "",
        "overview": item.get("overview") or "",
        "poster_path": item.get("poster_path"),
        "backdrop_path": item.get("backdrop_path"),
        "vote_average": round(item.get("vote_average") or 0, 1),
        "release_date": item.get("release_date") or item.get("first_air_date") or "",
        "genre_ids": item.get("genre_ids", []),
        "adult": item.get("adult", False),
    }


def _list(data: dict, media_type: str | None = None, need_image: str = "poster_path") -> list[dict]:
    items = [_normalize(i, media_type) for i in data.get("results", [])]
    return [i for i in items if i["media_type"] in ("movie", "tv") and i.get(need_image)]


# (섹션 키, 제목, TMDB 경로, 미디어타입, 추가 파라미터, 카드 형태)
HOME_SECTIONS = [
    ("trending", "오늘의 TOP 20", "/trending/all/day", None, {}, "rank"),
    ("popular_tv", "지금 인기 있는 시리즈", "/tv/popular", "tv", {}, "poster"),
    ("now_playing", "극장 동시 상영작", "/movie/now_playing", "movie", {"region": REGION}, "poster"),
    ("korean_drama", "화제의 K-드라마", "/discover/tv", "tv",
     {"with_origin_country": "KR", "with_genres": "18", "sort_by": "popularity.desc"}, "wide"),
    ("popular_movie", "인기 영화", "/movie/popular", "movie", {"region": REGION}, "poster"),
    ("korean_movie", "한국 영화 모아보기", "/discover/movie", "movie",
     {"with_origin_country": "KR", "sort_by": "popularity.desc"}, "poster"),
    ("top_rated", "평점 높은 명작 영화", "/movie/top_rated", "movie", {}, "wide"),
    ("upcoming", "공개 예정 영화", "/movie/upcoming", "movie", {"region": REGION}, "poster"),
    ("top_rated_tv", "평점 높은 시리즈", "/tv/top_rated", "tv", {}, "poster"),
]

CATEGORY_SECTIONS = {
    "tv": [
        ("trending", "실시간 인기 시리즈", "/trending/tv/week", "tv", {}, "rank"),
        ("kr", "K-드라마", "/discover/tv", "tv", {"with_origin_country": "KR", "sort_by": "popularity.desc"}, "poster"),
        ("airing", "오늘 방영", "/tv/airing_today", "tv", {}, "wide"),
        ("on_air", "방영 중인 시리즈", "/tv/on_the_air", "tv", {}, "poster"),
        ("crime", "범죄·스릴러", "/discover/tv", "tv", {"with_genres": "80", "sort_by": "popularity.desc"}, "poster"),
        ("comedy", "코미디", "/discover/tv", "tv", {"with_genres": "35", "sort_by": "popularity.desc"}, "wide"),
        ("anim", "애니메이션", "/discover/tv", "tv", {"with_genres": "16", "sort_by": "popularity.desc"}, "poster"),
        ("top", "평점 높은 시리즈", "/tv/top_rated", "tv", {}, "poster"),
    ],
    "movie": [
        ("trending", "실시간 인기 영화", "/trending/movie/week", "movie", {}, "rank"),
        ("now", "현재 상영작", "/movie/now_playing", "movie", {"region": REGION}, "poster"),
        ("kr", "한국 영화", "/discover/movie", "movie", {"with_origin_country": "KR", "sort_by": "popularity.desc"}, "wide"),
        ("action", "액션", "/discover/movie", "movie", {"with_genres": "28", "sort_by": "popularity.desc"}, "poster"),
        ("romance", "로맨스", "/discover/movie", "movie", {"with_genres": "10749", "sort_by": "popularity.desc"}, "poster"),
        ("horror", "공포·스릴러", "/discover/movie", "movie", {"with_genres": "27", "sort_by": "popularity.desc"}, "wide"),
        ("anim", "애니메이션", "/discover/movie", "movie", {"with_genres": "16", "sort_by": "popularity.desc"}, "poster"),
        ("top", "평점 높은 영화", "/movie/top_rated", "movie", {}, "poster"),
    ],
}


async def _build_sections(defs) -> list[dict]:
    results = await asyncio.gather(
        *(tmdb(path, **params) for _, _, path, _, params, _ in defs), return_exceptions=True
    )
    sections = []
    for (key, title, _, mt, _, card), data in zip(defs, results):
        if isinstance(data, Exception):
            if isinstance(data, HTTPException) and data.status_code in (401, 500):
                raise data
            continue
        need = "backdrop_path" if card == "wide" else "poster_path"
        items = _list(data, mt, need)
        if items:
            sections.append({"key": key, "title": title, "card": card, "items": items[:20]})
    return sections


def _hero(sections: list[dict]) -> list[dict]:
    pool = sections[0]["items"] if sections else []
    return [i for i in pool if i.get("backdrop_path") and i.get("overview")][:6]


@app.get("/api/health")
async def health():
    return {"ok": True, "auth": "token" if _is_set(ACCESS_TOKEN) else ("api_key" if _is_set(API_KEY) else None)}


@app.get("/api/home")
async def home():
    sections = await _build_sections(HOME_SECTIONS)
    return {"hero": _hero(sections), "sections": sections}


@app.get("/api/category/{media_type}")
async def category(media_type: str):
    if media_type not in CATEGORY_SECTIONS:
        raise HTTPException(404, "media_type 은 tv 또는 movie")
    sections = await _build_sections(CATEGORY_SECTIONS[media_type])
    return {"hero": _hero(sections), "sections": sections}


@app.get("/api/search")
async def search(q: str = Query(..., min_length=1), page: int = 1):
    data = await tmdb("/search/multi", query=q, page=page, include_adult="false")
    return {
        "page": data.get("page", 1),
        "total_pages": data.get("total_pages", 1),
        "results": _list(data),
    }


@app.get("/api/{media_type}/{item_id}")
async def detail(media_type: str, item_id: int):
    if media_type not in ("movie", "tv"):
        raise HTTPException(404, "media_type 은 tv 또는 movie")
    data = await tmdb(
        f"/{media_type}/{item_id}",
        append_to_response="videos,credits,similar,release_dates,content_ratings",
        include_video_language="ko,en",
    )
    base = _normalize(data, media_type)

    videos = data.get("videos", {}).get("results", [])
    trailer = next(
        (v for v in videos if v.get("site") == "YouTube" and v.get("type") in ("Trailer", "Teaser")), None
    )

    # 관람등급
    rating = ""
    if media_type == "movie":
        for r in data.get("release_dates", {}).get("results", []):
            if r.get("iso_3166_1") == "KR":
                rating = next((d["certification"] for d in r["release_dates"] if d.get("certification")), "")
    else:
        for r in data.get("content_ratings", {}).get("results", []):
            if r.get("iso_3166_1") == "KR":
                rating = r.get("rating", "")

    runtime = data.get("runtime") or (data.get("episode_run_time") or [None])[0]
    return {
        **base,
        "tagline": data.get("tagline") or "",
        "genres": [g["name"] for g in data.get("genres", [])],
        "runtime": runtime,
        "seasons": data.get("number_of_seasons"),
        "episodes": data.get("number_of_episodes"),
        "rating": rating,
        "trailer_key": trailer["key"] if trailer else None,
        "cast": [
            {"name": c["name"], "character": c.get("character", ""), "profile_path": c.get("profile_path")}
            for c in data.get("credits", {}).get("cast", [])[:10]
        ],
        "directors": [
            c["name"] for c in data.get("credits", {}).get("crew", []) if c.get("job") == "Director"
        ][:3] or [c["name"] for c in data.get("created_by", [])][:3],
        "similar": _list(data.get("similar", {}), media_type)[:12],
    }
