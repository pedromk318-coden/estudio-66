#!/bin/sh
set -eu
HERE="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
LIB="${LIB:-$(CDPATH= cd -- "$HERE/../../biblioteca" && pwd)}"
OUT="$HERE/out"
mkdir -p "$OUT"
# Original 20-second portrait cut-paper animation; no TTS or music, only designed SFX.
node "$LIB/core/render/events.mjs" "$HERE"
"$LIB/.venv/bin/python" "$HERE/sfx.py"
node "$LIB/core/render/video.mjs" "$HERE" --fps 24 --workers 1 --size 1080x1920 --out "$OUT/papercut-president-picture.mp4"
sh "$LIB/core/render/mux.sh" "$OUT/papercut-president-picture.mp4" "$OUT/papercut-sfx.wav" "$HERE/papercut-president-20s.mp4" 24 0
echo "Created $HERE/papercut-president-20s.mp4"