#!/usr/bin/env bash
set -euo pipefail
image=ceos-mathapi:qa
build_image=ceos-mathapi:qa-build
container=ceos-qa-app-$$
mongo=ceos-qa-mongo-$$
network=ceos-qa-network-$$
test ! -e .env.ceos-docker-smoke
test ! -e .ceos-docker-smoke.key
cleanup() {
  status=$?
  if [ "$status" -ne 0 ]; then docker logs --tail 40 "$container" 2>/dev/null || true; fi
  docker rm -f "$container" "$mongo" >/dev/null 2>&1 || true
  docker network rm "$network" >/dev/null 2>&1 || true
  rm -f .env.ceos-docker-smoke .ceos-docker-smoke.key
  exit "$status"
}
trap cleanup EXIT
printf 'DOCKER_CONTEXT_SENTINEL=not-a-real-secret\n' > .env.ceos-docker-smoke
printf 'not-a-real-private-key\n' > .ceos-docker-smoke.key
docker build -t "$image" .
docker run --rm --entrypoint sh "$image" -ec 'node --version | grep -q "^v24."; test "$(id -u)" != 0; test ! -e /app/.env.ceos-docker-smoke; test ! -e /app/.ceos-docker-smoke.key'
docker run -d --name "$container" -e NODE_ENV=production -p 127.0.0.1:18080:8080 "$image" >/dev/null
port=18080
route=/
ready=false
for attempt in $(seq 1 40); do
  if curl -fsS "http://127.0.0.1:$port$route" >/dev/null; then ready=true; break; fi
  sleep 1
done
test "$ready" = true
curl -fsS -H 'Content-Type: application/json' -d '{"a":2,"b":3,"x":5}' http://127.0.0.1:$port/funcao/linear -o /tmp/qa-linear.json
python3 -c 'import json; assert json.load(open("/tmp/qa-linear.json"))["data"]["resultado"] == 13'
test "$(curl -s -o /tmp/qa-invalid.json -w '%{http_code}' -H 'Content-Type: application/json' -d '{}' http://127.0.0.1:$port/funcao/unknown)" = 400
echo 'Math: Node 24, non-root, startup and strict numeric/error contracts passed.'
