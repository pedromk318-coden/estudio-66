#!/bin/sh
set -eu
HERE="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
LIB="${LIB:-$(CDPATH= cd -- "$HERE/../../biblioteca" && pwd)}"
OUT="$HERE/out"
mkdir -p "$OUT"
node "$LIB/core/render/video.mjs" "$HERE" --fps 24 --workers 1 --size 1080x1920 --out "$OUT/illustrated-character-test-10s.mp4"
echo "Created $OUT/illustrated-character-test-10s.mp4"