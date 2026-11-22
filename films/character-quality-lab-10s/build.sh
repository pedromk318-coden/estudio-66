#!/usr/bin/env bash
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
LIB="${LIB:?GitHub Actions must provide LIB}"
cd "$LIB"
node core/render/still.mjs "$HERE" 0 2 4 6 8 9.8 --size 1080x1920 --out "$HERE/stills"
node core/render/video.mjs "$HERE" --fps 24 --workers 1 --size 1080x1920 --out "$HERE/out/picture.mp4"
"$LIB/.venv/bin/python" "$HERE/audio.py" "$HERE/out/mix.wav"
sh core/render/mux.sh "$HERE/out/picture.mp4" "$HERE/out/mix.wav" "$HERE/estudio66-character-quality-test.mp4" 24 1
