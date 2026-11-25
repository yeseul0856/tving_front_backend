#!/usr/bin/env bash
# EC2 서버에서 실행: 업로드된 소스로 컨테이너를 다시 빌드/기동하고 헬스체크
#   사용: bash ~/app/scripts/deploy.sh
#   (GitHub Actions 가 소스를 rsync 한 뒤 자동으로 실행함. 서버에서 수동 실행도 가능)
set -euo pipefail

APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$APP_DIR"

if [ ! -f backend/.env ]; then
  echo "❌ backend/.env 가 없습니다. (TMDB 키 파일은 서버에만 보관)" >&2
  exit 1
fi
sed -i 's/\r$//' backend/.env   # Windows 줄바꿈 방지

echo "▶ docker compose build & up"
docker compose up -d --build --remove-orphans

echo "▶ health check"
for i in $(seq 1 30); do
  if curl -fsS http://127.0.0.1/api/health >/dev/null 2>&1; then
    echo "✅ healthy ($((i * 2))s)"
    docker compose ps --format "table {{.Service}}\t{{.State}}\t{{.Status}}"
    docker image prune -f >/dev/null   # 이전 빌드의 dangling 이미지 정리
    exit 0
  fi
  sleep 2
done

echo "❌ health check 실패 - 최근 로그:" >&2
docker compose ps >&2
docker compose logs --tail 50 >&2
exit 1
