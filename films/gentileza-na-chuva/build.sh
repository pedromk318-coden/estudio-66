#!/bin/sh
set -eu
HERE=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
LIB=${LIB:?O ambiente de render precisa definir LIB}
[ -f "$LIB/core/render/video.mjs" ] || { echo "LIB inválido: $LIB"; exit 1; }
mkdir -p "$HERE/out" "$HERE/stills"
cd "$LIB"
node core/render/still.mjs "$HERE" 0.5 4.8 8.8 --size 1080x1920 --out "$HERE/stills"
node core/render/video.mjs "$HERE" --fps 24 --workers 2 --size 1080x1920 --out "$HERE/out/video.mp4"
ffmpeg -y -f lavfi -i anullsrc=r=48000:cl=stereo -t 10 -c:a pcm_s16le "$HERE/out/silence.wav"
sh core/render/mux.sh "$HERE/out/video.mp4" "$HERE/out/silence.wav" "$HERE/gentileza-na-chuva.mp4" 24 0
ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$HERE/gentileza-na-chuva.mp4"
echo "pronto: $HERE/gentileza-na-chuva.mp4"
