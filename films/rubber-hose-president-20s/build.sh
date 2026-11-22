#!/bin/sh
set -eu
HERE="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
LIB="${LIB:-$(CDPATH= cd -- "$HERE/../../biblioteca" && pwd)}"
OUT="$HERE/out"
mkdir -p "$OUT"
"$LIB/.venv/bin/python" "$HERE/mix.py"
node "$LIB/core/render/video.mjs" "$HERE" --fps 24 --workers 1 --size 1080x1920 --out "$OUT/rubber-hose-president-picture.mp4"
sh "$LIB/core/render/mux.sh" "$OUT/rubber-hose-president-picture.mp4" "$OUT/rubber-hose-president.wav" "$HERE/rubber-hose-president-20s.mp4" 24 0
echo "Created $HERE/rubber-hose-president-20s.mp4"
